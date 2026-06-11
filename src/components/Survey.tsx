'use client'

import { useState, useEffect, useCallback } from 'react'
import { questions, Question } from '@/data/questions'

type Answers = Record<string, string | string[] | number>

// ─── Progress Bar ──────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-[#1B4FD8] uppercase tracking-widest">
          Question {current} of {total}
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
}: {
  q: Question
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-3">
      {q.options!.map((opt) => {
        const selected = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4FD8] focus-visible:ring-offset-2
              ${selected
                ? 'border-[#1B4FD8] bg-[#EEF3FD] text-[#1B4FD8]'
                : 'border-[#E2E8F0] bg-white text-slate-700 hover:border-[#1B4FD8]/40 hover:bg-[#F8FAFF]'
              }`}
          >
            <span className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors duration-150
                  ${selected ? 'border-[#1B4FD8] bg-[#1B4FD8]' : 'border-slate-300 bg-white'}`}
              >
                {selected && (
                  <span className="block w-1.5 h-1.5 rounded-full bg-white mx-auto mt-[3px]" />
                )}
              </span>
              {opt}
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
}: {
  q: Question
  value: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) => {
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]
    )
  }
  return (
    <div className="space-y-3">
      {q.options!.map((opt) => {
        const checked = value.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4FD8] focus-visible:ring-offset-2
              ${checked
                ? 'border-[#1B4FD8] bg-[#EEF3FD] text-[#1B4FD8]'
                : 'border-[#E2E8F0] bg-white text-slate-700 hover:border-[#1B4FD8]/40 hover:bg-[#F8FAFF]'
              }`}
          >
            <span className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-150
                  ${checked ? 'border-[#1B4FD8] bg-[#1B4FD8]' : 'border-slate-300 bg-white'}`}
              >
                {checked && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {opt}
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
}: {
  q: Question
  value: number | null
  onChange: (v: number) => void
}) {
  const points = Array.from(
    { length: (q.scaleMax ?? 5) - (q.scaleMin ?? 1) + 1 },
    (_, i) => (q.scaleMin ?? 1) + i
  )
  return (
    <div>
      <div className="flex gap-3 justify-between mt-2">
        {points.map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 aspect-square max-w-[56px] rounded-xl border-2 font-bold text-base transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4FD8] focus-visible:ring-offset-2
              ${value === n
                ? 'border-[#1B4FD8] bg-[#1B4FD8] text-white shadow-md scale-105'
                : 'border-[#E2E8F0] bg-white text-slate-600 hover:border-[#1B4FD8]/50 hover:bg-[#F8FAFF]'
              }`}
          >
            {n}
          </button>
        ))}
      </div>
      {q.scaleLabels && (
        <div className="flex justify-between mt-3">
          <span className="text-xs text-slate-400">{q.scaleLabels.min}</span>
          <span className="text-xs text-slate-400">{q.scaleLabels.max}</span>
        </div>
      )}
    </div>
  )
}

// ─── Text Input ────────────────────────────────────────────────
function TextInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your thoughts here…"
      rows={5}
      className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8F0] bg-white text-slate-700 text-sm placeholder-slate-300 focus:outline-none focus:border-[#1B4FD8] transition-colors duration-150 resize-none"
    />
  )
}

// ─── Thank You Screen ──────────────────────────────────────────
function ThankYou() {
  return (
    <div className="text-center py-8 animate-fade-slide-in">
      <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-[#16A34A]" fill="none" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">Thanks for your input!</h2>
      <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
        Your response has been saved. We&apos;ll use this to decide whether to build the Marketplace feature.
      </p>
      <div className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EEF3FD] text-[#1B4FD8] text-xs font-semibold">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
          <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        BUK Housing — Student Survey
      </div>
    </div>
  )
}

// ─── Main Survey ───────────────────────────────────────────────
export default function Survey() {
  const [step, setStep] = useState(0) // 0 = intro
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [animKey, setAnimKey] = useState(0)

  const currentQ = questions[step - 1]
  const totalSteps = questions.length

  const currentAnswer = currentQ ? answers[currentQ.id] : undefined

  const isAnswered = useCallback(() => {
    if (!currentQ) return false
    if (!currentQ.required && currentQ.type !== 'text') return true
    const ans = answers[currentQ.id]
    if (currentQ.type === 'single') return typeof ans === 'string' && ans.length > 0
    if (currentQ.type === 'multi') return Array.isArray(ans) && ans.length > 0
    if (currentQ.type === 'scale') return typeof ans === 'number'
    if (currentQ.type === 'text') return true // optional
    return false
  }, [currentQ, answers])

  const handleAnswer = (val: string | string[] | number) => {
    if (!currentQ) return
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }))
  }

  const goNext = async () => {
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
    setError(null)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })
      if (!res.ok) throw new Error('Server error')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const goBack = () => {
    if (step > 1) {
      setStep((s) => s - 1)
      setAnimKey((k) => k + 1)
    }
  }

  // Keyboard: Enter to advance
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && step > 0 && isAnswered()) {
        goNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [step, isAnswered])

  const canProceed = step === 0 || isAnswered()

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center px-4 py-12">
      {/* Header wordmark */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-[#1B4FD8] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-sm font-bold text-slate-700 tracking-tight">BUK Housing</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-[#E2E8F0] px-6 py-8 sm:px-8">
        {submitted ? (
          <ThankYou />
        ) : (
          <>
            {/* Intro */}
            {step === 0 && (
              <div className="animate-fade-slide-in">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#1B4FD8] bg-[#EEF3FD] px-3 py-1 rounded-full mb-5">
                  Feature Survey
                </span>
                <h1 className="text-2xl font-bold text-slate-800 leading-snug mb-3">
                  Should we build a Marketplace?
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  We&apos;re considering adding a student Marketplace to BUK Housing where you can buy, sell, and swap items within the BUK community.
                  This 8-question survey takes under 3 minutes. Your answers directly shape what we build.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    ~3 minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Anonymous
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {totalSteps} questions
                  </span>
                </div>
              </div>
            )}

            {/* Questions */}
            {step > 0 && currentQ && (
              <div key={animKey} className="animate-fade-slide-in">
                <ProgressBar current={step} total={totalSteps} />
                <h2 className="text-lg font-bold text-slate-800 leading-snug mb-2">
                  {currentQ.question}
                  {currentQ.required && (
                    <span className="text-[#1B4FD8] ml-1">*</span>
                  )}
                </h2>
                {currentQ.subtext && (
                  <p className="text-sm text-slate-400 mb-5 leading-relaxed">{currentQ.subtext}</p>
                )}

                {currentQ.type === 'single' && (
                  <SingleChoice
                    q={currentQ}
                    value={(currentAnswer as string) ?? ''}
                    onChange={handleAnswer}
                  />
                )}
                {currentQ.type === 'multi' && (
                  <MultiChoice
                    q={currentQ}
                    value={(currentAnswer as string[]) ?? []}
                    onChange={handleAnswer}
                  />
                )}
                {currentQ.type === 'scale' && (
                  <ScaleQuestion
                    q={currentQ}
                    value={(currentAnswer as number) ?? null}
                    onChange={handleAnswer}
                  />
                )}
                {currentQ.type === 'text' && (
                  <TextInput
                    value={(currentAnswer as string) ?? ''}
                    onChange={handleAnswer}
                  />
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Navigation */}
            <div className={`flex items-center mt-8 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
              {step > 1 && (
                <button
                  onClick={goBack}
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4FD8] rounded-lg px-2 py-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Back
                </button>
              )}

              <button
                onClick={goNext}
                disabled={!canProceed || submitting}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4FD8] focus-visible:ring-offset-2
                  ${canProceed && !submitting
                    ? 'bg-[#1B4FD8] text-white hover:bg-[#1440B0] shadow-sm hover:shadow-md'
                    : 'bg-[#E2E8F0] text-slate-400 cursor-not-allowed'
                  }`}
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Saving…
                  </>
                ) : step === 0 ? (
                  <>
                    Start Survey
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </>
                ) : step < totalSteps ? (
                  <>
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </>
                ) : (
                  <>
                    Submit
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Keyboard hint */}
            {step > 0 && canProceed && step < totalSteps && (
              <p className="text-center text-xs text-slate-300 mt-4">
                Press <kbd className="font-mono bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded border border-slate-200">Enter</kbd> to continue
              </p>
            )}
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-300">
        BUK Housing © {new Date().getFullYear()}
      </p>
    </div>
  )
}
