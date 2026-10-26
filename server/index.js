import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'messages.json');
app.use(cors());
app.use(express.json({ limit: '1mb' }));

async function readMessages() {
  await fs.mkdir(dataDir, { recursive: true });
  try { return JSON.parse(await fs.readFile(dataFile, 'utf8')); }
  catch { await fs.writeFile(dataFile, '[]'); return []; }
}
async function saveMessage(message) {
  const messages = await readMessages();
  messages.push(message);
  await fs.writeFile(dataFile, JSON.stringify(messages, null, 2));
}

const profile = {
  name: 'Sugandhan B',
  role: 'Computer Science and Business System Student | Aspiring Software Engineer and Designer',
  location: 'Tiruchirappalli, India',
  education: 'B.Tech. CSBS (4th Year)',

  email: 'sugandhan252004@gmail.com',
  summary: 'I enjoy building web applications, exploring AI, and creating meaningful projects. I am always eager to learn new skills and grow personally and professionally.',
  skills: ['React', 'Java', 'Spring Boot', 'Firebase', 'MongoDB', 'Tailwind CSS', 'UI/UX Design', 'Python', 'AI & LLMs'],
  projects: [
    { id: 'aitizen-realm', title: 'AITIZEN REALM', description: 'AI-powered civilization with intelligent agents and dynamic world simulation.', tags: ['React', 'Node.js', 'Firebase', 'AI'], status: 'In progress' },
    { id: 'taskflow', title: 'TaskFlow', description: 'Smart task management app concept with collaboration and notifications.', tags: ['React', 'Firebase', 'Tailwind'] },
    { id: 'greentrack', title: 'GreenTrack', description: 'A sustainability tracking concept to monitor carbon footprint and eco habits.', tags: ['React', 'Node.js', 'MongoDB'] }
  ]
};

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'Sugu Portfolio API' }));
app.get('/api/profile', (_req, res) => res.json(profile));
app.get('/api/projects', (_req, res) => res.json(profile.projects));

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Please provide your name, email, and message.' });
  }
  const entry = { name: name.trim().slice(0, 100), email: email.trim().slice(0, 200), message: message.trim().slice(0, 3000), createdAt: new Date().toISOString() };
  await saveMessage(entry);
  res.status(201).json({ ok: true, message: 'Thanks! Your message was saved.' });
});

const fallbackReply = (message) => {
  const q = message.toLowerCase();
  if (q.includes('project') || q.includes('aitizen')) return 'Sugandhan is building AITIZEN REALM, an AI civilization concept featuring intelligent agents and a dynamic simulated world. It is currently a work in progress.';
  if (q.includes('skill') || q.includes('technology') || q.includes('stack')) return `The portfolio highlights ${profile.skills.join(', ')}. Sugandhan is continuing to learn and improve these skills.`;
  if (q.includes('contact') || q.includes('email')) return `You can contact Sugandhan at ${profile.email}, or use the contact form on this page.`;
  if (q.includes('education') || q.includes('study')) return 'Sugandhan is a fourth-year B.E. Computer Science and Business Systems (CSBS) student.';
  return 'Hi! I’m Sugu’s portfolio assistant. Ask me about projects, skills, education, or how to get in touch.';
};

app.post('/api/assistant', async (req, res) => {
  const message = String(req.body?.message || '').trim().slice(0, 1000);
  if (!message) return res.status(400).json({ error: 'Please type a message.' });

  // If configured, use an OpenAI-compatible chat completions endpoint.
  if (process.env.AI_API_KEY) {
    try {
      const response = await fetch(`${(process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.AI_API_KEY}` },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `You are the friendly portfolio assistant for Sugandhan B, a fourth-year CSBS student in Tiruchirappalli, India. Answer only using this profile: role ${profile.role}; education ${profile.education}; skills ${profile.skills.join(', ')}; projects ${profile.projects.map(p => `${p.title}: ${p.description}`).join('; ')}; email ${profile.email}. If unknown, say you don't have that information and suggest contacting Sugandhan. Keep answers under 100 words.` },
            { role: 'user', content: message }
          ],
          temperature: 0.5
        })
      });
      if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
      const data = await response.json();
      return res.json({ reply: data.choices?.[0]?.message?.content || fallbackReply(message), mode: 'ai' });
    } catch (error) {
      console.error('AI provider error:', error.message);
      return res.json({ reply: fallbackReply(message), mode: 'fallback', note: 'Live AI is temporarily unavailable.' });
    }
  }
  return res.json({ reply: fallbackReply(message), mode: 'fallback' });
});

// Production build serving
const distDir = path.resolve(__dirname, '../dist');
try {
  await fs.access(distDir);
  app.use(express.static(distDir));
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
} catch { /* Vite serves the frontend during development. */ }

app.listen(PORT, () => console.log(`Portfolio API running at http://localhost:${PORT}`));