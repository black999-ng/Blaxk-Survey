import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'responses.json')

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

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const responses = readResponses()

    const entry = {
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      answers: body,
    }

    responses.push(entry)

    fs.writeFileSync(DATA_FILE, JSON.stringify(responses, null, 2), 'utf-8')

    return NextResponse.json({ success: true, id: entry.id }, { status: 200 })
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
