# PathED Setup Guide
## GitHub + Vercel + Claude Code

This gets PathED live on the internet with a secure API key, a real URL you can share,
and a workflow where Claude Code makes changes directly in the codebase.
The same setup works for AccommodatED Academy when you're ready to deploy that.

---

## What you're building

```
pathed/
  src/
    App.jsx           ← All the UI code (the main app)
    main.jsx          ← Entry point (5 lines, don't touch)
  api/
    generate.js       ← Secure API proxy (holds your Anthropic key)
  index.html          ← HTML entry (don't touch)
  vite.config.js      ← Build tool config (don't touch)
  vercel.json         ← Deployment config (don't touch)
  package.json        ← Dependencies (don't touch)
```

The only file you'll ever edit is `src/App.jsx`.
The only file that holds your API key is Vercel's environment variables dashboard — not in the code.

---

## Step 1 — GitHub account and repo

1. Go to github.com and create a free account if you don't have one.
2. Click the green "New" button to create a new repository.
3. Name it `pathed` (or `accommodated-pathed`, your choice).
4. Set it to Private (you can make it public later).
5. Click "Create repository." Don't add a README.
6. Leave the page open — you'll come back to it.

---

## Step 2 — Vercel account

1. Go to vercel.com and sign up for a free account.
2. When prompted, connect your GitHub account. Vercel needs this to auto-deploy.
3. Don't create a project yet — that comes after we push the code.

---

## Step 3 — Get your Anthropic API key

1. Go to console.anthropic.com.
2. Click "API Keys" in the left sidebar.
3. Click "Create Key." Name it `pathed-production`.
4. Copy the key immediately — you only see it once.
5. Paste it somewhere safe temporarily (Notes app is fine for now).

Set a usage limit: In the console, go to Billing > Usage Limits and set a monthly spend
cap of $20 to start. This protects you if the key ever gets misused.

---

## Step 4 — Install Node.js and set up the project locally

**On Mac:**
1. Go to nodejs.org and download the LTS version. Run the installer.
2. Open Terminal (search "Terminal" in Spotlight).
3. Type `node --version` and press Enter. You should see v18 or higher.

**On Windows:**
Windows requires an extra step called WSL (Windows Subsystem for Linux).
This takes about 30 extra minutes.
1. Open PowerShell as Administrator (right-click Start, select "Windows PowerShell (Admin)").
2. Run: `wsl --install`
3. Restart your computer when prompted.
4. After restart, open "Ubuntu" from the Start menu.
5. Create a Linux username and password when prompted.
6. Inside Ubuntu, run: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -`
7. Then run: `sudo apt-get install -y nodejs`
8. Type `node --version` to confirm it's v18 or higher.
9. From this point, all terminal commands run inside Ubuntu (WSL).

---

## Step 5 — Set up the project files

You have two options:

**Option A — Download from GitHub (easiest):**
Once I put the files in a GitHub repo you can fork, just:
1. Click "Fork" on the repo.
2. Clone it to your computer.

**Option B — Create from scratch:**
1. On your computer, create a folder called `pathed`.
2. Inside it, place all the files from this project bundle exactly as shown in the structure above.
3. Open your terminal and navigate to the folder: `cd path/to/pathed`
4. Run `npm install` to install dependencies.
5. Run `npm run dev` to start local development. Open http://localhost:5173 to see it.

The app will have a broken "Generate my profile" button locally because your API key
isn't wired yet. That's expected. Wiring happens in Vercel.

---

## Step 6 — Push to GitHub

In your terminal, inside the `pathed` folder:

```bash
git init
git add .
git commit -m "Initial PathED setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pathed.git
git push -u origin main
```

Replace YOUR_USERNAME with your GitHub username.
The URL comes from the GitHub repo page you created in Step 1.

---

## Step 7 — Deploy to Vercel

1. Go to vercel.com/dashboard.
2. Click "Add New Project."
3. Find your `pathed` repo in the list and click "Import."
4. Vercel will auto-detect that it's a Vite project. Don't change any settings.
5. Click "Deploy."
6. Your site is live. Vercel gives you a URL like `pathed-xyz.vercel.app`.

The Generate button still doesn't work because the API key isn't added yet.

---

## Step 8 — Add your Anthropic API key to Vercel

1. In Vercel, click on your `pathed` project.
2. Click "Settings" in the top nav.
3. Click "Environment Variables" in the left sidebar.
4. Add a new variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: paste your API key from Step 3
   - Environment: select "Production," "Preview," and "Development"
5. Click "Save."
6. Go back to the "Deployments" tab and click "Redeploy" on the latest deployment.

Your live URL now works end-to-end. Test the full flow.

---

## Step 9 — Install Claude Code for iteration

**The easiest path (Desktop app):**
Download the Claude Code Desktop app from claude.ai/download.
This works without the terminal. Open it, point it at your `pathed` folder, and start describing changes.

**Terminal path (Mac):**
```bash
npm install -g @anthropic-ai/claude-code
```
Then navigate to your project folder and run `claude`.

**Terminal path (Windows/WSL):**
Inside your Ubuntu terminal:
```bash
npm install -g @anthropic-ai/claude-code
```
Then navigate to your project folder and run `claude`.

When Claude Code opens, authenticate with your Anthropic account.
It reads your entire codebase and you can describe changes in plain English.

---

## How iteration works going forward

1. Open Claude Code in your `pathed` folder.
2. Say something like: "In the Watching branch, add a follow-up question after the teacher feedback step that asks whether the issue is more noticeable at home, at school, or equally both."
3. Claude Code edits `src/App.jsx` directly.
4. Review the change, then run: `git add . && git commit -m "Add home vs school question" && git push`
5. Vercel deploys automatically in about 60 seconds.
6. Your live URL reflects the change.

That's the full loop. No file copying, no pasting back into chat.

---

## When you're ready to move Academy to this setup

The Academy app (`accommodated_academy.html`) needs the same treatment:
- Move the vanilla JS code into a React component (or keep it in a single HTML file and serve it from Vercel directly — that works too).
- The API call in Academy changes from `https://api.anthropic.com/v1/messages` to `/api/generate`.
- Add an `api/generate.js` proxy identical to this one.
- Same Vercel environment variable setup.

Academy can live in the same repo or a separate one. Separate is cleaner for two products.

---

## Vercel KV for rate limiting

Both `api/generate.js` and `api/subscribe.js` use `@vercel/kv` to count requests
per IP. Without a KV store connected, the code logs a warning and lets every
request through. Set this up in five minutes in the Vercel dashboard.

1. Vercel dashboard, open the `pathed` project, click **Storage** in the top nav.
2. Click **Create Database** and pick the Redis option (Vercel KV is now sold
   as the Upstash for Redis marketplace integration). The free tier is plenty.
3. Region, pick the same region as the Vercel project. For most US projects
   that is **iad1 (Washington)**. Same region keeps cold-call latency low.
4. Name the database `pathed-kv`.
5. On the connect screen, check **Production**, **Preview**, and **Development**
   so the env vars are injected into all three environments.
6. Click **Connect**. Vercel injects the connection vars into the project:
   `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`,
   plus the Upstash equivalents.
7. Trigger a redeploy from the Deployments tab so the new env vars are picked
   up. Pushing a fresh commit to main also redeploys.

To verify it works: open the live site, run the wizard once, then submit it
nine times in a row. The ninth attempt should return a 429 with the message
"Too many requests. Please wait a while before generating another profile."
You can also tail Vercel function logs and confirm the **"Rate limit check
failed"** warnings have stopped appearing.

If the free Upstash tier ever feels tight (10,000 commands per day on the
default plan), the rate limiter needs at most two commands per request, so
that ceiling supports about 5,000 generates and 5,000 subscribes per day,
roughly 50 paying parents per day's worth of activity.

---

## Troubleshooting

**"npm: command not found"** — Node.js isn't installed or isn't in your PATH. Restart your terminal after installing Node.

**"Cannot find module"** — Run `npm install` in the project folder.

**API calls returning 500** — Check Vercel's Function Logs (under the Deployments tab) for the actual error. Usually the API key isn't set or has a typo.

**Generate button not working locally** — Expected. The proxy calls your Vercel environment variable, which only exists in the deployed environment. To test locally, create a `.env.local` file with your key (it's in `.gitignore` so it won't be pushed).

---

## Questions

contact@accommodatedpathways.com
