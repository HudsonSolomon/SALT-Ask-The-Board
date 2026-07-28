# Ask the Board

An anonymous Q&A tool for your school leadership org. Students submit a
question with zero identifying info collected. They get a private "claim
code" to check for a reply later. Only board members you invite can see
submitted questions or reply. Free to run at your scale (Vercel + Supabase
free tiers).

## How it works

- **Student asks a question** at `/` — no login, no name, no email, nothing
  identifying is ever stored. They get a claim code like `7K2Q-9PLM` shown
  once.
- **Student checks for a reply** at `/check` by entering that code. This is
  the only way to retrieve a question — there's no list, no way to browse
  other people's questions.
- **Board members sign in** at `/admin/login` and see every question in a
  dashboard at `/admin/dashboard`, where they can reply or archive.
- Nothing ties a question back to a person. There's no IP logging, no
  cookies on the public pages, no analytics.

## 1. Create your Supabase project (free)

1. Go to [supabase.com](https://supabase.com), sign up, and create a new
   project. Pick any name/region; the free tier is plenty for this.
2. Once it's ready, open **SQL Editor** in the left sidebar, paste in the
   contents of `supabase/schema.sql` from this repo, and run it. This
   creates the `questions` table.
3. Go to **Settings -> API**. You'll need three values for the next step:
   - **Project URL**
   - **anon public** key
   - **service_role** key (click "Reveal" — keep this one secret)

## 2. Add your board members

Board members log in with an actual account — there's no public sign-up, so
only people you explicitly add can ever access the dashboard.

1. In Supabase, go to **Authentication -> Users**.
2. Click **Add user -> Create new user** for each board member. Use their
   real email and set a temporary password (or use "Send invite" if you'd
   rather they set their own password by email).
3. Share the login URL (`https://your-deployed-site.vercel.app/admin/login`)
   and their credentials with each board member.

To remove someone's access later (e.g. graduating board members), just
delete their user from this same screen.

## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the three values from step 1:

```
cp .env.example .env.local
```

## 4. Run it locally

```
npm install
npm run dev
```

Visit `http://localhost:3000` to try the question form, and
`http://localhost:3000/admin/login` to try the board dashboard.

## 5. Deploy (free, on Vercel)

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), sign up, and import the repo.
3. In the Vercel project's **Settings -> Environment Variables**, add the
   same three variables from `.env.local`.
4. Deploy. You'll get a live URL you can share with the whole school.

## Handing this off to next year's board

- Everything lives in Supabase (the data) and Vercel (the site) — both free
  tiers, both just need someone to have the login.
- Consider creating a shared board email (e.g. `board@yourschoolclub.org`)
  as the account owner on both Supabase and Vercel, rather than a graduating
  senior's personal email, so access transfers cleanly year to year.
- To wipe old questions before a new year, you can just run
  `delete from questions;` in the Supabase SQL Editor.

## Privacy notes

- The `questions` table has Row Level Security turned on with **no**
  policies attached — meaning the public anon key can't read or write to it
  at all. Every read/write goes through this app's server-side API routes,
  which use the service role key (never exposed to the browser).
- The claim code is the only way to retrieve a specific question — it's
  generated with a large random alphabet (millions of possible codes), so it
  can't be guessed.
- If you want to go further, you could add a Vercel Cron job to auto-delete
  questions after e.g. 90 days — ask if you'd like that added.
