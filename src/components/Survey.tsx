'use client'

import { useState, useEffect, useCallback } from 'react'
import { setupQuestions, buyerQuestions, sellerQuestions, generalQuestions, Question, Language, getAllQuestions } from '@/data/questions'

type Answers = Record<string, string | string[] | number>

const t = {
  en: {
    selectLanguage: 'Select Language',
    english: 'English',
    hausa: 'Hausa',
    start: 'Start Survey',
    submit: 'Submit',
    next: 'Next',
    back: 'Back',
    marketplace: 'Student Marketplace Survey',
    thankYou: 'Thank you!',
    thankYouMessage: 'Your response has been saved. We will use your feedback to build better features.',
    name: 'Name',
    regNumber: 'Reg Number',
  },
  ha: {
    selectLanguage: 'Zaɓi Harshe',
    english: 'Turanci',
    hausa: 'Hausa',
    start: 'Fara Tambaya',
    submit: 'Gabatar',
    next: 'Gaba',
    back: 'Baya',
    marketplace: 'Tambayar Kasuwar Ɗalibai',
    thankYou: 'Godiya!',
    thankYouMessage: 'Amsa ka an ajiye. Za mu amfani da rayin ka don gina kyau halitta.',
    name: 'Suna',
    regNumber: 'Lamba Komarya',
  }
}

// ─── Progress Bar ──────────────────────────────────────────────
function ProgressBar({ current, total, language }: { current: number; total: number; language: Language }) {
  const pct = Math.round((current / total) * 100)
  const labels = { en: 'Question', ha: 'Tambaya' }
  return (
    <div className="w-full mb-8 animate-fade-slide-in">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-[#1B4FD8] uppercase tracking-widest">
          {labels[language]} {current} {language === 'en' ? 'of' : 'daga'} {total}
        </span>
        <span className="text-xs font-medium text-slate-400">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1B4FD8] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Single Choice ─────────────────────────────────────────────
function SingleChoice({
  q,
  value,
  onChange,
  language,
}: {
  q: Question
  value: string
  onChange: (v: string) => void
  language: Language
}) {
  return (
    <div className="space-y-3">
      {q.options!.map((opt, idx) => {
        const optText = typeof opt === 'string' ? opt : opt[language]
        const selected = value === optText
        return (
          <button
            key={idx}
            onClick={() => onChange(optText)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4FD8] focus-visible:ring-offset-2 animate-fade-slide-in
              ${selected
                ? 'border-[#1B4FD8] bg-[#EEF3FD] text-[#1B4FD8] scale-105'
                : 'border-[#E2E8F0] bg-white text-slate-700 hover:border-[#1B4FD8]/40 hover:bg-[#F8FAFF]'
              }`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <span className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors duration-200
                  ${selected ? 'border-[#1B4FD8] bg-[#1B4FD8]' : 'border-slate-300 bg-white'}`}
              >
                {selected && (
                  <span className="block w-1.5 h-1.5 rounded-full bg-white mx-auto mt-[3px]" />
                )}
              </span>
              {optText}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Multi Choice ──────────────────────────────────────────────
function MultiChoice({
  q,
  value,
  onChange,
  language,
}: {
  q: Question
  value: string[]
  onChange: (v: string[]) => void
  language: Language
}) {
  const toggle = (opt: string) => {
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]
    )
  }
  return (
    <div className="space-y-3">
      {q.options!.map((opt, idx) => {
        const optText = typeof opt === 'string' ? opt : opt[language]
        const checked = value.includes(optText)
        return (
          <button
            key={idx}
            onClick={() => toggle(optText)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4FD8] focus-visible:ring-offset-2 animate-fade-slide-in
              ${checked
                ? 'border-[#1B4FD8] bg-[#EEF3FD] text-[#1B4FD8] scale-105'
                : 'border-[#E2E8F0] bg-white text-slate-700 hover:border-[#1B4FD8]/40 hover:bg-[#F8FAFF]'
              }`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <span className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-200
                  ${checked ? 'border-[#1B4FD8] bg-[#1B4FD8]' : 'border-slate-300 bg-white'}`}
              >
                {checked && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {optText}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Scale ─────────────────────────────────────────────────────
function ScaleQuestion({
  q,
  value,
  onChange,
  language,
}: {
  q: Question
  value: number | null
  onChange: (v: number) => void
  language: Language
}) {
  const points = Array.from(
    { length: (q.scaleMax ?? 5) - (q.scaleMin ?? 1) + 1 },
    (_, i) => (q.scaleMin ?? 1) + i
  )
  return (
    <div>
      <div className="flex gap-3 justify-between mt-2">
        {points.map((n, idx) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 aspect-square max-w-[56px] rounded-xl border-2 font-bold text-base transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4FD8] focus-visible:ring-offset-2 animate-fade-slide-in
              ${value === n
                ? 'border-[#1B4FD8] bg-[#1B4FD8] text-white shadow-md scale-110'
                : 'border-[#E2E8F0] bg-white text-slate-600 hover:border-[#1B4FD8]/50 hover:bg-[#F8FAFF]'
              }`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {n}
          </button>
        ))}
      </div>
      {q.scaleLabels && (
        <div className="flex justify-between mt-3 animate-fade-slide-in" style={{ animationDelay: '200ms' }}>
          <span className="text-xs text-slate-400">{typeof q.scaleLabels.min === 'string' ? q.scaleLabels.min : q.scaleLabels.min[language]}</span>
          <span className="text-xs text-slate-400">{typeof q.scaleLabels.max === 'string' ? q.scaleLabels.max : q.scaleLabels.max[language]}</span>
        </div>
      )}
    </div>
  )
}

// ─── Text Input ────────────────────────────────────────────────
function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8F0] bg-white text-slate-700 text-sm placeholder-slate-300 focus:outline-none focus:border-[#1B4FD8] transition-all duration-200 resize-none animate-fade-slide-in"
    />
  )
}

// ─── Thank You Screen ──────────────────────────────────────────
function ThankYou({ language }: { language: Language }) {
  return (
    <div className="text-center py-8">
      {/* Animated celebration container */}
      <div className="relative mb-8">
        <div className="animate-bounce mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] flex items-center justify-center mx-auto shadow-lg">
            <svg className="w-10 h-10 text-[#16A34A] animate-pulse" fill="none" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {/* Celebration circles animation */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <div className="animate-ping w-12 h-12 rounded-full border-2 border-[#1B4FD8] opacity-75" style={{ animationDuration: '2s' }} />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-800 mb-2 animate-fade-slide-in">
        {language === 'en' ? '✓ All done!' : '✓ An gama!'}
      </h2>
      <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed mb-6 animate-fade-slide-in" style={{ animationDelay: '100ms' }}>
        {language === 'en' 
          ? 'Your response has been saved. We will use your feedback to build better features.' 
          : 'Amsa ka an ajiye. Za mu amfani da rayin ka don gina kyau halitta.'}
      </p>

      {/* Animated badge */}
      <div className="inline-flex flex-col items-center gap-3 px-5 py-4 rounded-3xl bg-[#EEF3FD] text-[#1B4FD8] text-xs font-semibold animate-fade-slide-in" style={{ animationDelay: '200ms' }}>
        <div className="inline-flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {language === 'en' ? 'BUK Developer — Marketplace Survey' : 'BUK Developer — Tambayar Kasuwa'}
        </div>
        <a
          href="https://wa.me/09131294991?text=Hello%20Blaxk,%20I%20am%20interested%20in%20the%20BUK%20Marketplace.%20Let's%20work%20together!"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#1B4FD8] px-4 py-2 text-white text-xs font-semibold hover:bg-[#1440B0] transition-colors duration-200"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 3.5A11.8 11.8 0 0012 1C6.48 1 1.96 4.87 1.14 10.11a11.9 11.9 0 001.64 8.07L1 23l4.96-1.25a11.93 11.93 0 005.08 1.15h.01c5.55 0 10.18-3.83 11.2-9.05.39-1.84.12-3.75-.75-5.45zM12 20.75c-1.61 0-3.2-.4-4.57-1.16l-.33-.18-2.94.74.78-2.83-.21-.35A8.7 8.7 0 013.25 10.13c.71-4.1 4.23-7.08 8.5-7.08 4.74 0 8.61 3.86 8.61 8.61 0 4.63-3.74 8.38-8.38 8.38z" />
            <path d="M7.77 8.43c-.19-.64.41-1.26 1.08-1.02.68.24 1.91.88 2.2 1.01.28.12.5.16.73-.13.24-.3.9-1.03 1.1-1.24.19-.22.36-.24.65-.09.29.15 1.24.45 1.45.54.22.1.38.15.42.24.04.09.04.55.03.9-.02.35-.11.57-.25.77-.14.2-.29.45-.42.63-.14.18-.28.19-.51.06-.23-.14-.96-.35-1.64-.6-.68-.24-1.26-.36-1.45-.36-.2 0-.35.02-.53.22-.18.19-.69.72-.69 1.74 0 1.02.71 1.27.81 1.35.1.08 1.4 2.1 3.4 2.95 2 .84 2 .56 2.35.52.35-.04 1.14-.44 1.3-.87.16-.44.16-.82.11-.9-.05-.08-.17-.12-.36-.2-.19-.08-1.15-.58-1.33-.64-.18-.07-.31-.1-.44.1-.12.19-.48.64-.59.77-.12.13-.23.15-.43.05-.2-.1-.86-.32-1.63-.99-.6-.5-1.01-1.12-1.13-1.32-.11-.2-.01-.31.09-.4.09-.09.2-.23.31-.34.1-.12.14-.2.2-.33.07-.13.03-.24-.02-.34-.05-.1-.44-1.07-.6-1.47-.16-.39-.32-.34-.44-.35-.12-.01-.26-.01-.4-.01s-.34.05-.51.23c-.17.17-.67.66-.67 1.61 0 .95.69 1.87.78 2.01.09.13 1.35 2.1 3.28 2.96.96.43 1.72.69 2.31.88.97.29 1.85.25 2.55.15.78-.12 2.4-.98 2.74-1.93.34-.96.34-1.78.24-1.95-.1-.17-.37-.27-.77-.45-.4-.18-2.37-1.16-2.45-1.23-.09-.07-.15-.19-.07-.38.08-.19.3-.63.42-.86.12-.22.25-.24.42-.24.17 0 .35 0 .53.01.18.02.38.03.55.03.18 0 .46-.07.7-.38.24-.3.97-1.12 1.09-1.34.12-.22.02-.41-.1-.54-.12-.12-1.21-1.15-1.75-1.57-.54-.42-1-.32-1.25-.28-.25.04-.53.18-.82.47-.29.29-1.1 1.07-1.1 2.61 0 1.54-.03 1.75-.14 1.87-.12.12-.25.2-.49.12-.24-.08-1.64-.6-3.12-1.92-.51-.43-.85-.95-1.03-1.29z" />
          </svg>
          {language === 'en' ? 'Send me a WhatsApp DM' : 'Aiko min da DM a WhatsApp'}
        </a>
      </div>
    </div>
  )
}

// ─── Main Survey ───────────────────────────────────────────────
const submitMessages = [
  'sending ...',
  'thank you for your feedback ...',
  'this is revolution ...',
  'i’m single anyways ...',
  'would you like a girlfriends form? ...',
]

function SubmittingAnimation({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-14">
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-8 border-[#1B4FD8]/20 border-t-[#1B4FD8] animate-spin" />
      </div>

      <div className="text-center max-w-lg px-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">{message}</p>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Please wait while we submit your feedback</h2>
        <p className="text-sm text-slate-500">This will only take a moment. Your survey response is being processed now.</p>
      </div>
    </div>
  )
}

export default function Survey() {
  const [language, setLanguage] = useState<Language>('en')
  const [step, setStep] = useState(-1) // -1 = language select, 0 = intro, 1+ = questions
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitMessageIndex, setSubmitMessageIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [animKey, setAnimKey] = useState(0)

  // Build questions array based on role
  const questionsArray = useCallback(() => {
    const role = (answers.marketplace_role as string | undefined || '').toLowerCase().trim()
    const isBuyer = role.includes('buy')
    const isSeller = role.includes('sell')
    const isBoth = role.includes('both')

    let qs: Question[] = [...setupQuestions]
    if (isBuyer || isBoth) qs = [...qs, ...buyerQuestions]
    if (isSeller || isBoth) qs = [...qs, ...sellerQuestions]
    qs = [...qs, ...generalQuestions]
    return qs
  }, [answers.marketplace_role])

  const allQuestions = questionsArray()
  const currentQ = step > 0 && step <= allQuestions.length ? allQuestions[step - 1] : null
  const totalSteps = allQuestions.length
  const currentAnswer = currentQ ? answers[currentQ.id] : undefined

  const regNumberPattern = /^[A-Z]{2,5}\/\d{2}\/[A-Z]{2,5}\/\d{3,6}$/i
  const isRegNumberValid = (value: unknown) =>
    typeof value === 'string' && regNumberPattern.test(value.trim())

  const isAnswered = useCallback(() => {
    if (!currentQ) return false
    
    // Check based on question type
    if (currentQ.type === 'single') {
      const ans = answers[currentQ.id]
      return typeof ans === 'string' && ans.length > 0
    }
    if (currentQ.type === 'multi') {
      const ans = answers[currentQ.id]
      return Array.isArray(ans) && ans.length > 0
    }
    if (currentQ.type === 'scale') {
      const ans = answers[currentQ.id]
      return typeof ans === 'number'
    }
    if (currentQ.type === 'text') {
      // Text fields only required if marked as required
      if (!currentQ.required) return true
      const ans = answers[currentQ.id]
      if (currentQ.id === 'reg_number') {
        return isRegNumberValid(ans)
      }
      return typeof ans === 'string' && ans.trim().length > 0
    }
    return false
  }, [currentQ, answers])

  const handleAnswer = (val: string | string[] | number) => {
    if (!currentQ) return
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }))
  }

  const getQuestionText = (q: Question, field: 'question' | 'subtext'): string | null => {
    const value = q[field]
    if (!value) return null
    if (typeof value === 'string') return value
    return value[language]
  }

  const goNext = async () => {
    if (step === -1) {
      setStep(0)
      setAnimKey((k) => k + 1)
      return
    }

    if (step === 0) {
      setStep(1)
      setAnimKey((k) => k + 1)
      return
    }

    if (step < totalSteps) {
      setStep((s) => s + 1)
      setAnimKey((k) => k + 1)
      return
    }

    // Submit
    setSubmitting(true)
    setSubmitMessageIndex(0)
    setError(null)
    try {
      const payloadDeviceId = deviceId || (typeof window !== 'undefined' ? localStorage.getItem('survey_device_id') : null)
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...answers, language, deviceId: payloadDeviceId }),
      })

      if (res.status === 409) {
        localStorage.setItem('survey_submitted', 'true')
        setSubmitted(true)
        return
      }

      if (!res.ok) throw new Error('Server error')

      localStorage.setItem('survey_submitted', 'true')
      if (payloadDeviceId) {
        localStorage.setItem('survey_device_id', payloadDeviceId)
      }
      setSubmitted(true)
    } catch {
      setError(language === 'en' ? 'Something went wrong. Please try again.' : 'Wani abu ya faru. Jara a sake.')
    } finally {
      setSubmitting(false)
    }
  }

  const goBack = () => {
    if (step > 0) {
      setStep((s) => s - 1)
      setAnimKey((k) => k + 1)
    }
  }

  useEffect(() => {
    const hasSubmitted = typeof window !== 'undefined' && localStorage.getItem('survey_submitted') === 'true'
    let storedDeviceId: string | null = null

    if (typeof window !== 'undefined') {
      storedDeviceId = localStorage.getItem('survey_device_id')

      if (!storedDeviceId) {
        if (window.crypto?.randomUUID) {
          storedDeviceId = window.crypto.randomUUID()
        } else {
          storedDeviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
        }
        localStorage.setItem('survey_device_id', storedDeviceId)
      }
    }

    if (storedDeviceId) {
      setDeviceId(storedDeviceId)
    }
    if (hasSubmitted) {
      setSubmitted(true)
    }
  }, [])

  // Keyboard: Enter to advance
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && ((step >= 0 && isAnswered()) || step === -1)) {
        goNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [step, isAnswered])

  useEffect(() => {
    if (!submitting) return
    const timer = window.setInterval(() => {
      setSubmitMessageIndex((index) => (index + 1) % submitMessages.length)
    }, 2600)
    return () => window.clearInterval(timer)
  }, [submitting])

  const canProceed = step === -1 || step === 0 || isAnswered()
  const txt = t[language]

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center px-4 py-12">
      {/* Language Toggle */}
      {step < 0 && (
        <div className="mb-8 animate-fade-slide-in">
          <div className="flex items-center gap-2 bg-white rounded-full border border-[#E2E8F0] p-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                language === 'en'
                  ? 'bg-[#1B4FD8] text-white'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {txt.english}
            </button>
            <button
              onClick={() => setLanguage('ha')}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                language === 'ha'
                  ? 'bg-[#1B4FD8] text-white'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {txt.hausa}
            </button>
          </div>
        </div>
      )}

      {/* Header wordmark */}
      <div className="mb-8 flex items-center gap-2 animate-fade-slide-in">
        <div className="w-7 h-7 rounded-md bg-[#1B4FD8] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-sm font-bold text-slate-700 tracking-tight">BUK Developer</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-[#E2E8F0] px-6 py-8 sm:px-8">
        {submitted ? (
          <ThankYou language={language} />
        ) : submitting ? (
          <SubmittingAnimation message={submitMessages[submitMessageIndex]} />
        ) : (
          <>
            {/* Language Selection */}
            {step === -1 && (
              <div className="animate-fade-slide-in">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#1B4FD8] bg-[#EEF3FD] px-3 py-1 rounded-full mb-5">
                  {language === 'en' ? 'Feature Survey' : 'Tambayar Halitta'}
                </span>
                <h1 className="text-2xl font-bold text-slate-800 leading-snug mb-3">
                  {language === 'en' ? 'Select Your Language' : 'Zaɓi Harshen Ka'}
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {language === 'en'
                    ? 'Choose the language you would like to use for this survey.'
                    : 'Zaɓi harshen da kake so amfani a wannan tambayar.'}
                </p>
              </div>
            )}

            {/* Intro */}
            {step === 0 && (
              <div className="animate-fade-slide-in">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#1B4FD8] bg-[#EEF3FD] px-3 py-1 rounded-full mb-5">
                  {language === 'en' ? 'Marketplace Survey' : 'Tambayar Kasuwa'}
                </span>
                <h1 className="text-2xl font-bold text-slate-800 leading-snug mb-3">
                  {language === 'en'
                    ? 'Help us build the BUK Marketplace'
                    : 'Taimaka mun gina Kasuwar BUK'}
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {language === 'en'
                    ? 'We\'re creating a student marketplace where you can buy, sell, and swap items directly with other BUK students. Help us understand what you need by answering a few quick questions. This survey takes about 3 minutes.'
                    : 'Za mu gina kasuwa ina ɗalibai za su iya sirinki, sayarwa, da musayar kaya tsakanin juna. Taimaka mun fahimta abin da kake bukatar da amsa wasu tambayoyi. Wannan tambayar ta gajiya ne kusan mintoci 3.'}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {language === 'en' ? '~3 minutes' : '~Mintoci 3'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {totalSteps} {language === 'en' ? 'questions' : 'tambayoyi'}
                  </span>
                </div>
              </div>
            )}

            {/* Questions */}
            {step > 0 && currentQ && (
              <div key={animKey} className="animate-fade-slide-in">
                <ProgressBar current={step} total={totalSteps} language={language} />
                <h2 className="text-lg font-bold text-slate-800 leading-snug mb-2">
                  {getQuestionText(currentQ, 'question')}
                  {currentQ.required && (
                    <span className="text-[#1B4FD8] ml-1">*</span>
                  )}
                </h2>
                {currentQ.subtext && (
                  <p className="text-sm text-slate-400 mb-5 leading-relaxed">{getQuestionText(currentQ, 'subtext')}</p>
                )}

                {currentQ.type === 'single' && (
                  <SingleChoice
                    q={currentQ}
                    value={(currentAnswer as string) ?? ''}
                    onChange={handleAnswer}
                    language={language}
                  />
                )}
                {currentQ.type === 'multi' && (
                  <MultiChoice
                    q={currentQ}
                    value={(currentAnswer as string[]) ?? []}
                    onChange={handleAnswer}
                    language={language}
                  />
                )}
                {currentQ.type === 'scale' && (
                  <ScaleQuestion
                    q={currentQ}
                    value={(currentAnswer as number) ?? null}
                    onChange={handleAnswer}
                    language={language}
                  />
                )}
                {currentQ.type === 'text' && (
                  <>
                    <TextInput
                      value={(currentAnswer as string) ?? ''}
                      onChange={handleAnswer}
                      placeholder={language === 'en' ? 'Type your thoughts here…' : 'Rubuta ra\'ayin ka a nan…'}
                    />
                    {currentQ.id === 'reg_number' && typeof currentAnswer === 'string' && currentAnswer.trim().length > 0 && !isRegNumberValid(currentAnswer) && (
                      <p className="mt-3 text-sm text-orange-600">{language === 'en'
                        ? 'Please enter your registration number in FCT/YR/DPT/NUMBER format, e.g. ENG/24/MCT/00029.'
                        : 'Da fatan za a shigar da lambar komarya cikin tsarin FCT/YR/DPT/NUMBER, misali ENG/24/MCT/00029.'
                      }</p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Navigation */}
            <div className={`flex items-center mt-8 ${step < 1 ? 'justify-center' : step > 1 ? 'justify-between' : 'justify-end'}`}>
              {step > 1 && (
                <button
                  onClick={goBack}
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4FD8] rounded-lg px-2 py-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {txt.back}
                </button>
              )}

              <button
                onClick={goNext}
                disabled={!canProceed || submitting}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4FD8] focus-visible:ring-offset-2
                  ${canProceed && !submitting
                    ? 'bg-[#1B4FD8] text-white hover:bg-[#1440B0] shadow-sm hover:shadow-md hover:scale-105'
                    : 'bg-[#E2E8F0] text-slate-400 cursor-not-allowed'
                  }`}
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    {language === 'en' ? 'Saving…' : 'Ana ajiye…'}
                  </>
                ) : step === -1 ? (
                  <>
                    {txt.start}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </>
                ) : step === 0 ? (
                  <>
                    {txt.start}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </>
                ) : step < totalSteps ? (
                  <>
                    {txt.next}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </>
                ) : (
                  <>
                    {txt.submit}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Keyboard hint */}
            {step >= 0 && canProceed && (step === 0 || step < totalSteps) && (
              <p className="text-center text-xs text-slate-300 mt-4">
                {language === 'en'
                  ? 'Press Enter to continue'
                  : 'Danna Enter don ci gaba'
                }
              </p>
            )}
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-300">
        BUK Developer © {new Date().getFullYear()}
      </p>
    </div>
  )
}
