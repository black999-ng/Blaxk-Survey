import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'responses.json')
const DEVICE_COOKIE_NAME = 'survey_device_id'
const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 5 // 5 years

function readResponses(): object[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf-8')
      return []
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function getGoogleSheetId(rawId: string) {
  const trimmed = rawId.trim()
  const patterns = [
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/,
    /(?:spreadsheets\/d\/|sheet=|id=)([a-zA-Z0-9_-]+)(?:\/|$|&|#)/,
  ]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return trimmed
}

function getDeviceId(request: Request, bodyDeviceId?: string) {
  const cookieDeviceId = (request as any).cookies?.get?.(DEVICE_COOKIE_NAME)?.value ?? null
  const cookieHeader = request.headers.get('cookie') ?? ''
  const headerDeviceId = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${DEVICE_COOKIE_NAME}=`))
    ?.split('=')[1] ?? null

  const deviceId = bodyDeviceId?.trim() || cookieDeviceId || headerDeviceId || null
  return deviceId && deviceId.length > 0 ? deviceId : null
}

function getSheetTitleForRole(role?: string) {
  const normalized = (role || '').toLowerCase().trim()
  let sheetTitle = 'Buyers'
  if (normalized.includes('both')) {
    sheetTitle = 'Both'
  } else if (normalized.includes('sell')) {
    sheetTitle = 'Sellers'
  } else if (normalized.includes('buy')) {
    sheetTitle = 'Buyers'
  }
  return sheetTitle
}

async function appendToGoogleSheet(data: Record<string, any>) {
  try {
    // Check if credentials are available
    const rawSheetId = process.env.GOOGLE_SHEET_ID || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_URL
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !rawSheetId) {
      console.warn('Google Sheets credentials not configured')
      return null
    }

    // Initialize auth
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    // Flatten the data structure for the spreadsheet
    const flatData: Record<string, any> = {
      Timestamp: new Date().toISOString(),
      'Student Name': data.full_name || '',
      'Phone Number': data.phone_number || '',
      'Level': data.level || '',
      'Role': data.marketplace_role || '',
      'Language': data.language || 'en',
      'buy_what': Array.isArray(data.buy_what) ? data.buy_what.join('; ') : data.buy_what || '',
      'buy_price': data.buy_price || '',
      'buy_trust': Array.isArray(data.buy_trust) ? data.buy_trust.join('; ') : data.buy_trust || '',
      'buy_payment': data.buy_payment || '',
      'sell_what': data.sell_what || '',
      'sell_concern': data.sell_concern || '',
      'sell_price': data.sell_price || '',
      'sell_payment': data.sell_payment || '',
      'sell_feature': data.sell_feature || '',
      'marketplace_use': data.marketplace_use || '',
      'features_want': Array.isArray(data.features_want) ? data.features_want.join('; ') : data.features_want || '',
      'feedback': data.feedback || '',
    }

    // Sanitize all values for Google Sheets: arrays must be strings and null/undefined should be empty
    for (const key of Object.keys(flatData)) {
      const val = flatData[key]
      if (Array.isArray(val)) {
        flatData[key] = val.join('; ')
      } else if (val === null || val === undefined) {
        flatData[key] = ''
      }
    }

    const headers = Object.keys(flatData)

    // Initialize sheet
    const sheetId = getGoogleSheetId(rawSheetId)
    const doc = new GoogleSpreadsheet(sheetId, auth)
    await doc.loadInfo()

    const sheetTitle = getSheetTitleForRole(data.marketplace_role)
    let sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) {
      // Sheet doesn't exist, create it with headers
      sheet = await doc.addSheet({ title: sheetTitle, headerValues: headers })
    } else {
      // Sheet exists, try to load headers; if none, set them
      try {
        await sheet.loadHeaderRow()
      } catch {
        await sheet.setHeaderRow(headers)
        await sheet.loadHeaderRow()
      }
    }

    // Add row
    await sheet.addRow(flatData)
    return true
  } catch (error) {
    console.error('Google Sheets error:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payloadDeviceId = typeof body.deviceId === 'string' ? body.deviceId : undefined
    const deviceId = getDeviceId(request, payloadDeviceId) || crypto.randomUUID()

    // Always save locally as backup
    const responses = readResponses()
    const alreadySubmitted = responses.some((response: any) => response?.deviceId === deviceId)
    if (alreadySubmitted) {
      const response = NextResponse.json(
        {
          success: false,
          error: 'Already submitted from this device',
          alreadySubmitted: true,
        },
        { status: 409 }
      )
      response.cookies.set(DEVICE_COOKIE_NAME, deviceId, {
        path: '/',
        maxAge: DEVICE_COOKIE_MAX_AGE,
        sameSite: 'lax',
      })
      return response
    }

    // Try to save to Google Sheets
    const sheetsSuccess = await appendToGoogleSheet(body)

    const entry = {
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      answers: body,
      deviceId,
      googleSheetsSync: sheetsSuccess,
    }
    responses.push(entry)

    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(responses, null, 2), 'utf-8')
    } catch {
      console.error('Failed to write local backup')
    }

    const response = NextResponse.json(
      {
        success: true,
        id: entry.id,
        sheetsSync: sheetsSuccess,
        message: sheetsSuccess ? 'Data saved to Google Sheets and local storage' : 'Data saved locally (Google Sheets not configured)',
      },
      { status: 200 }
    )
    response.cookies.set(DEVICE_COOKIE_NAME, deviceId, {
      path: '/',
      maxAge: DEVICE_COOKIE_MAX_AGE,
      sameSite: 'lax',
    })
    return response
  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save response' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const responses = readResponses()
    return NextResponse.json({ count: responses.length, responses }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Failed to read responses' }, { status: 500 })
  }
}
