import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Atom, Bot, BriefcaseBusiness, Check,
  Code2, Download, Github, GraduationCap, Linkedin, Mail, MapPin, Menu,
  Moon, Palette, Send, Sparkles, Sprout, Sun, UserRound, X, Zap
} from 'lucide-react';
import './styles.css';
import './refresh.css';

const fallbackProfile = {
  name: 'Sugandhan B',
  role: 'Computer Science and Business System Student | Aspiring Software Engineer and Designer',
  location: 'Tiruchirappalli, India',
  education: 'B.Tech. CSBS (4th Year)',
  email: 'sugandhan252004@gmail.com',
  summary: 'I enjoy building web applications, exploring AI, and creating meaningful projects. I am always eager to learn new skills and grow personally and professionally.',
  skills: ['React', 'Java', 'Spring Boot', 'Firebase', 'MongoDB', 'Tailwind CSS', 'UI/UX Design', 'Python', 'AI & LLMs'],
  projects: [
    { id: 'aitizen-realm', title: 'AITIZEN REALM', description: 'AI-powered civilization with intelligent agents and a dynamic world simulation.', tags: ['React', 'Node.js', 'Firebase', 'AI'] },
    { id: 'taskflow', title: 'TaskFlow', description: 'A smart task management concept with collaboration and notifications.', tags: ['React', 'Firebase', 'Tailwind'] },
    { id: 'greentrack', title: 'GreenTrack', description: 'A sustainability tracking concept to monitor carbon footprint and eco habits.', tags: ['React', 'Node.js', 'MongoDB'] }
  ]
};
const skillIcons = [Atom, Code2, Zap, Sprout, Sprout, Code2, Palette, Code2, Bot];
const starterQuestions = ['Tell me about your latest project', 'What technologies do you use?', 'How can I contact you?'];

function App() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [dark, setDark] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [chat, setChat] = useState([{ role: 'assistant', text: "Hi! I'm your AI portfolio assistant. Ask me about projects, skills, or experience." }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    fetch('/api/profile').then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setProfile(data); setApiOnline(true); }).catch(() => setApiOnline(false));
  }, []);

  async function askAssistant(text = chatInput) {
    const clean = text.trim();
    if (!clean || chatLoading) return;
    setChat(prev => [...prev, { role: 'user', text: clean }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: clean }) });
      const data = await response.json();
      setChat(prev => [...prev, { role: 'assistant', text: data.reply || 'Sorry, I could not answer that.' }]);
    } catch {
      setChat(prev => [...prev, { role: 'assistant', text: 'The server is not running yet. Start the project using the instructions in the README.' }]);
    } finally { setChatLoading(false); }
  }

  async function sendContact(e) {
    e.preventDefault();
    setContactLoading(true); setContactStatus('');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contact) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not send message.');
      setContactStatus(data.message); setContact({ name: '', email: '', message: '' });
    } catch (err) { setContactStatus(err.message || 'Could not connect to the server.'); }
    finally { setContactLoading(false); }
  }

  const nav = [['Home', 'home'], ['About', 'about'], ['Skills', 'skills'], ['Projects', 'projects'], ['Contact', 'contact']];
  return (
    <div className={dark ? 'app dark' : 'app light'}>
      <header className="topbar">
        <a className="brand" href="#home"><span className="brand-mark"><Sparkles size={19}/></span><span>Sugu<span className="brand-dot">.</span></span></a>
        <button className="mobile-toggle icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
        <nav className={mobileMenu ? 'nav open' : 'nav'}>{nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMobileMenu(false)}>{label}</a>)}</nav>
        <div className="top-actions">
          <a className="resume-button" href={`mailto:${profile.email}?subject=Resume%20Request`}><Download size={15}/> Request Resume</a>
          <button className="icon-button" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="stars" aria-hidden="true"></div>
          <div className="hero-glow"></div>
          <div className="hero-copy">
            <span className="eyebrow"><span className="status-dot"></span> AVAILABLE TO LEARN & COLLABORATE</span>
            <p className="hello">Hello, I'm</p>
            <h1>{profile.name.split(' ')[0]} <span>{profile.name.split(' ').slice(1).join(' ')}</span></h1>
            <h2>{profile.role}</h2>
            <p className="hero-description">I build digital experiences, explore emerging technologies, and turn ideas into real-world solutions.</p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">Explore my work <ArrowRight size={17}/></a>
              <a className="button secondary" href="#contact">Let's connect</a>
            </div>
            <div className="socials">
              <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub"><Github/></a>
              <a href="https://www.linkedin.com/in/sugandhan-baskaran-19579932a/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin/></a>
              <a href={`mailto:${profile.email}`} aria-label="Email"><Mail/></a>
              <span className="social-caption">Curiosity → creation</span>
            </div>
          </div>
          <div className="world-scene" aria-label="Animated abstract 3D landscape">
            <div className="planet planet-one"></div><div className="planet planet-two"></div>
            <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="floating-island island-back"><div className="island-city">⌂ ♜ ⌂</div></div>
            <div className="mountain mountain-one"></div><div className="mountain mountain-two"></div>
            <div className="mountain mountain-three"></div>
            <div className="river"></div><div className="land land-front"></div>
            <div className="person"><div className="person-head"></div><div className="person-body"></div><div className="person-pack"></div></div>
            <div className="scene-note">Dream it.<br/>Build it.<br/><span>Ship it.</span></div>
            <div className="scene-label"><span></span> EXPLORING THE POSSIBLE</div>
          </div>
          <a href="#about" className="scroll-cue"><span></span> SCROLL TO EXPLORE <ArrowDown size={14}/></a>
        </section>

        <section id="about" className="section about-section">
          <div className="section-heading"><span className="section-icon"><UserRound size={19}/></span><div><p className="eyebrow">A LITTLE ABOUT ME</p><h2>Curious mind. <span>Builder's heart.</span></h2></div></div>
          <div className="about-grid">
            <div className="profile-art"><div className="profile-orbit"></div><div className="profile-avatar"><span>SB</span></div><div className="floating-chip chip-code"><Code2 size={17}/></div><div className="floating-chip chip-spark"><Sparkles size={17}/></div></div>
            <div className="about-copy"><h3>Turning curiosity into projects</h3><p>{profile.summary}</p><p className="muted">My goal is to keep learning, collaborate with thoughtful people, and create useful technology with a little imagination.</p>
              <div className="facts"><div><MapPin/><span><small>LOCATION</small>{profile.location}</span></div><div><GraduationCap/><span><small>EDUCATION</small>{profile.education}</span></div><div><Mail/><span><small>EMAIL</small>{profile.email}</span></div></div>
            </div>
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <div className="section-heading"><span className="section-icon"><Zap size={19}/></span><div><p className="eyebrow">MY TOOLKIT</p><h2>Skills I'm <span>growing.</span></h2></div></div>
          <p className="section-intro">Technologies and creative skills I'm exploring to turn ideas into useful experiences.</p>
          <div className="skills-grid">{profile.skills.map((skill, i) => { const Icon = skillIcons[i % skillIcons.length]; return <div className="skill-card" key={skill}><span className={`skill-symbol symbol-${i % 5}`}><Icon size={22}/></span><span>{skill}</span><ArrowUpRight className="skill-arrow" size={15}/></div>; })}</div>
        </section>

        <section id="projects" className="section projects-section">
          <div className="section-heading heading-row"><div className="section-heading"><span className="section-icon"><BriefcaseBusiness size={19}/></span><div><p className="eyebrow">SELECTED WORK</p><h2>Ideas made <span>real.</span></h2></div></div><span className="project-count">0{profile.projects.length} PROJECTS</span></div>
          <div className="projects-grid">{profile.projects.map((project, i) => <article className={`project-card project-${i}`} key={project.id}>
            <div className="project-art"><div className="art-grid"></div>{i === 0 ? <div className="mini-world"><div className="mini-sun"></div><div className="mini-castle">♜</div><div className="mini-hill hill-a"></div><div className="mini-hill hill-b"></div><div className="mini-water"></div></div> : i === 1 ? <div className="task-window"><div className="window-top"><i></i><i></i><i></i></div><div className="window-body"><div className="window-side"></div><div className="window-lines"><b></b><b></b><b></b><b></b></div></div></div> : <div className="green-planet"><Sprout size={54}/><span>green future</span></div>}<span className="project-index">0{i + 1}</span></div>
            <div className="project-body"><div className="project-title-row"><h3>{project.title}</h3><span className="project-link"><ArrowUpRight size={18}/></span></div><p>{project.description}</p><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
          </article>)}</div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="contact-copy"><p className="eyebrow">HAVE AN IDEA?</p><h2>Let's make something <span>meaningful.</span></h2><p>Have a project, opportunity, or interesting idea? Send a message and let's start a conversation.</p><a className="contact-email" href={`mailto:${profile.email}`}><Mail size={18}/>{profile.email}<ArrowUpRight size={16}/></a><a className="contact-email" href="tel:8838593841">8838593841</a><div className="contact-decoration"><div></div><Sparkles/></div></div>
          <form className="contact-form" onSubmit={sendContact}><h3>Send a message <span className="form-spark"><Sparkles size={17}/></span></h3><label>Your name<input required value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} placeholder="Jane Doe"/></label><label>Email address<input required type="email" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} placeholder="jane@example.com"/></label><label>Message<textarea required rows="4" value={contact.message} onChange={e => setContact({...contact, message: e.target.value})} placeholder="Tell me a little about your idea..."/></label><button className="button primary submit-button" disabled={contactLoading}>{contactLoading ? 'Sending...' : 'Send message'} <Send size={16}/></button>{contactStatus && <p className="form-status" role="status">{contactStatus}</p>}</form>
        </section>
      </main>

      <footer className="footer"><a className="brand" href="#home"><span className="brand-mark"><Sparkles size={17}/></span><span>Sugu<span className="brand-dot">.</span></span></a><p>Designed with curiosity and a little stardust.</p><span>© {new Date().getFullYear()} Sugandhan B</span></footer>

      <aside className="assistant-panel">
        <div className="assistant-header"><div className="assistant-brand"><span className="assistant-icon"><Bot size={19}/></span><span><b>Portfolio AI</b><small>Ask me about Sugu</small></span></div><span className="online"><i></i>{apiOnline ? 'Online' : 'Demo mode'}</span></div>
        <div className="chat-messages" aria-live="polite">{chat.slice(-5).map((item, i) => <div key={`${item.role}-${i}-${item.text.slice(0,8)}`} className={`chat-bubble ${item.role}`}>{item.text}</div>)}{chatLoading && <div className="chat-bubble assistant typing">Thinking<span> ···</span></div>}</div>
        {chat.length < 3 && <div className="starter-questions">{starterQuestions.map(q => <button key={q} onClick={() => askAssistant(q)}>{q}</button>)}</div>}
        <form className="chat-form" onSubmit={e => { e.preventDefault(); askAssistant(); }}><input aria-label="Ask portfolio assistant" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask me anything..." /><button aria-label="Send chat message" disabled={chatLoading || !chatInput.trim()}><Send size={17}/></button></form>
      </aside>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);