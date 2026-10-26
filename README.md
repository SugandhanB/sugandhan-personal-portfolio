# Sugu — 3D-inspired Full-Stack Portfolio

A responsive React portfolio with animated CSS artwork, a Node/Express API, a persistent contact form, and a portfolio assistant. The design uses CSS-generated 3D-style scenery rather than a static screenshot, so the page is a real website and remains responsive.

## Requirements

- Node.js 18+ (Node.js 20 LTS recommended)
- npm
- VS Code (recommended)

## Run locally

1. Extract this ZIP and open the `sugu-portfolio` folder in VS Code.
2. Open Terminal → New Terminal.
3. Install packages:

   ```bash
   npm install
   ```

4. Start the frontend and backend together:

   ```bash
   npm run dev
   ```

5. Open the local URL printed by Vite, usually `http://localhost:5173`.

The API runs at `http://localhost:5000`. Try `http://localhost:5000/api/health` to verify it.

## Enable live AI (optional)

The assistant works in demo/fallback mode without an API key. To enable model-powered responses:

1. Copy `.env.example` to a new file named `.env`.
2. Set `AI_API_KEY` to a valid API key for an OpenAI-compatible chat-completions provider.
3. Set `AI_BASE_URL` and `AI_MODEL` to the values for your provider if needed.
4. Restart `npm run dev`.

Keep `.env` private and never commit it to Git. API usage may cost money depending on your provider and account. If no key is configured, the assistant uses local profile-aware responses.

## Contact messages and data

Contact form submissions are stored in `server/data/messages.json`, created automatically after the first message. This is a lightweight local JSON data store for easy setup; it is suitable for local demos, not a multi-user production database. For deployment, replace it with Firebase Firestore, MongoDB Atlas, or PostgreSQL and add spam protection/rate limiting.

## Build for production

```bash
npm run build
npm start
```

Express serves the built frontend from `dist` when that directory exists. Set `PORT` in your deployment environment if required.

## Personalize it

- Edit profile details, skills, and sample project content in `server/index.js`.
- Update social links in `src/main.jsx` (the GitHub and LinkedIn URLs are placeholders).
- Add a real resume file and change the “Request Resume” button to link to it when ready.
- Replace sample project descriptions with your real project links and screenshots.

## Important notes

- The project is a runnable full-stack starter, not a hosted deployment.
- The 3D landscape is built with animated CSS shapes; no paid 3D service is required.
- The assistant is a real API-backed chat endpoint. It becomes model-powered only when a valid provider key is configured.
- Do not publish your personal email if you prefer not to receive unsolicited messages.
