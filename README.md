# BUK Housing — Feature Survey

A clean, step-by-step survey to gauge student interest in a Marketplace feature. Built with **Next.js 14 (App Router)**, **Tailwind CSS**, and a serverless API route that saves every submission to `src/data/responses.json`.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **API:** Serverless route at `/api/submit` (Next.js Route Handler)
- **Storage:** Flat JSON file (`src/data/responses.json`)

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Vercel Deployment

1. Push the project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Vercel auto-detects Next.js — no config needed.
4. Click **Deploy**.

> ⚠️ **Important note on file storage:**
> Vercel's serverless functions run in a **read-only filesystem** in production. This means writing to `responses.json` will fail after deploy.
>
> **Recommended fix for production:** Replace the file-write logic in `src/app/api/submit/route.ts` with one of:
> - **Vercel KV** (Redis-based, simplest): `await kv.rpush('responses', JSON.stringify(entry))`
> - **Supabase** (Postgres, since you already use it on BUK Housing): insert into a `survey_responses` table
> - **MongoDB Atlas** free tier
>
> For local testing and development, the JSON file approach works perfectly.

---

## Viewing Responses

While on `localhost`, hit:

```
GET /api/submit
```

Returns:
```json
{
  "count": 12,
  "responses": [
    {
      "id": "uuid-here",
      "submittedAt": "2026-06-11T10:30:00.000Z",
      "answers": {
        "role": "Student at BUK",
        "marketplace_need": "Definitely — I would use it regularly",
        ...
      }
    }
  ]
}
```

---

## Customising Questions

All questions live in `src/data/questions.ts`. Each question has a `type`:

| Type | Description |
|------|-------------|
| `single` | Pick one option |
| `multi` | Pick multiple options |
| `scale` | Numeric scale (e.g. 1–5) |
| `text` | Open-ended free text |

Mark a question `required: true` to block the Next button until answered.
