import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Code, Cpu, Database, Orbit, Rocket, Layers, 
  Mail, Github, Linkedin, ExternalLink, ChevronRight, 
  User, BookOpen, Activity, HeartPulse, 
  Send, CheckCircle2, Sliders, Image as ImageIcon,
  ArrowUpRight, Globe, Compass, Shield, Terminal,
  Camera, Upload, Trash2, X, RefreshCw, Award, Download,
  FileText, Check, Phone, MapPin, Eye, ZoomIn
} from 'lucide-react';
import JSZip from 'jszip';

const DEFAULT_AVATAR = "/assets/renuka_avatar_square.jpg";

const PRESET_AVATARS = [
  { name: 'Profile Photo (Current)', url: '/assets/renuka_avatar_square.jpg' },
  { name: 'Portrait Frame', url: '/assets/renuka_avatar.jpg' },
  { name: 'Professional 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600' },
  { name: 'Developer Style', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600' }
];

interface SkillItem {
  name: string;
  category: 'core' | 'web' | 'tools';
  level: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  badgeText: string;
  badgeColor: string;
  description: string;
  skills: string[];
  credentialUrl?: string;
  defaultImage?: string;
}

const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 'careerschool-hms',
    title: 'Professional Certification Program & Internship',
    issuer: 'Careerschool HR Solutions',
    year: '2026',
    badgeText: 'Internship Certified',
    badgeColor: 'border-cyan-400 text-cyan-300 bg-cyan-500/10',
    description: 'Practical full-stack engineering internship developing CurePoint: Hospital Management System using Django REST Framework, PostgreSQL, and Bootstrap with role-based access control and live deployment on Render & Netlify.',
    skills: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'Render', 'Netlify', 'Postman'],
    credentialUrl: 'https://github.com/Renuka9951/CurePoint-Hospital-Management-System'
  },
  {
    id: 'nasscom-gold',
    title: 'Acquiring Data (Gold Star - 78%)',
    issuer: 'NASSCOM FutureSkills Prime',
    year: '2025',
    badgeText: 'Gold Star (78%)',
    badgeColor: 'border-amber-400 text-amber-300 bg-amber-500/10',
    description: 'National Level IT Skill Standard qualification in Data Acquisition, Web Scraping, Structured & Unstructured Data Ingestion, Data Quality Assurance, and Database Storage.',
    skills: ['Data Acquisition', 'Web Scraping', 'Data Cleaning', 'SQL', 'Python Data Processing'],
    credentialUrl: 'https://futureskillsprime.in'
  },
  {
    id: 'linkedin-genai',
    title: 'Generative AI Foundations & Applied Practice',
    issuer: 'LinkedIn Learning',
    year: '2025',
    badgeText: 'Verified Credential',
    badgeColor: 'border-purple-400 text-purple-300 bg-purple-500/10',
    description: 'Comprehensive study of Large Language Models, prompt engineering, generative multimodal AI architecture, and integrating intelligent APIs into web applications.',
    skills: ['Generative AI', 'Prompt Engineering', 'LLM Architectures', 'AI Web Integration'],
    credentialUrl: 'https://www.linkedin.com/learning'
  },
  {
    id: 'sql-cert',
    title: 'SQL Problem Solving & Relational Databases',
    issuer: 'HackerRank & LeetCode',
    year: '2024–2025',
    badgeText: 'Verified Skills',
    badgeColor: 'border-emerald-400 text-emerald-300 bg-emerald-500/10',
    description: 'Demonstrated mastery in complex relational SQL queries, nested joins, aggregations, window functions, indexing, and PostgreSQL database schema design.',
    skills: ['SQL', 'PostgreSQL', 'Complex Queries', 'Database Schema', 'Query Optimization'],
    credentialUrl: 'https://www.hackerrank.com'
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [userImage, setUserImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('renuka_profile_photo');
      if (saved && !saved.includes('photo-1534528741775-53994a69daeb')) {
        return saved;
      }
      return DEFAULT_AVATAR;
    } catch {
      return DEFAULT_AVATAR;
    }
  });

  // Certifications with custom uploaded pictures map { [certId]: string }
  const [certImages, setCertImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('renuka_cert_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modal States
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [tempImgUrl, setTempImgUrl] = useState('');
  const [uploadingCertId, setUploadingCertId] = useState<string | null>(null);
  const [previewCertImage, setPreviewCertImage] = useState<{ title: string; url: string } | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [activeSkillTab, setActiveSkillTab] = useState<'all' | 'core' | 'web' | 'tools'>('all');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const certFileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cosmic Starfield Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = reducedMotion ? 35 : 120;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
      pulseSpeed: number;
    }> = [];
    const colors = ['#00f2fe', '#4facfe', '#7928ca', '#ffffff', '#a855f7'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const radialGlow = ctx.createRadialGradient(
        mouseX || width / 2, 
        mouseY || height / 2, 
        50, 
        width / 2, 
        height / 2, 
        Math.max(width, height) * 0.8
      );
      radialGlow.addColorStop(0, 'rgba(121, 40, 202, 0.08)');
      radialGlow.addColorStop(0.5, 'rgba(0, 242, 254, 0.04)');
      radialGlow.addColorStop(1, 'rgba(9, 10, 22, 0.95)');
      
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      if (!reducedMotion) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 110) {
              ctx.save();
              ctx.globalAlpha = (1 - dist / 110) * 0.15;
              ctx.strokeStyle = '#00f2fe';
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [reducedMotion]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const savePhoto = (newUrl: string) => {
    setUserImage(newUrl);
    try {
      localStorage.setItem('renuka_profile_photo', newUrl);
    } catch {
      // quota fallback
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size is too large. Please select an image under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          savePhoto(reader.result);
          setIsPhotoModalOpen(false);
          showToast('Profile photo updated successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingCertId) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size is too large. Please select an image under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const updated = { ...certImages, [uploadingCertId]: reader.result };
          setCertImages(updated);
          try {
            localStorage.setItem('renuka_cert_images', JSON.stringify(updated));
          } catch {
            // storage fallback
          }
          showToast('Certificate image uploaded successfully!');
          setUploadingCertId(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCertImage = (certId: string) => {
    const updated = { ...certImages };
    delete updated[certId];
    setCertImages(updated);
    try {
      localStorage.setItem('renuka_cert_images', JSON.stringify(updated));
    } catch {
      // storage fallback
    }
    showToast('Certificate photo removed');
  };

  const handleDownloadProjectZip = async () => {
    setIsDownloadingZip(true);
    try {
      // Try direct fetch first
      const res = await fetch('/renuka-reddy-portfolio.zip');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'renuka-reddy-portfolio.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showToast('Project ZIP downloaded! Ready for VS Code & GitHub.');
      } else {
        // Fallback: Generate via JSZip in browser dynamically
        const zip = new JSZip();
        zip.file('README.md', '# Renuka Reddy Portfolio\n\nRun:\n1. npm install\n2. npm run dev\n');
        const content = await zip.generateAsync({ type: 'blob' });
        const url = window.URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'renuka-reddy-portfolio.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showToast('Project ZIP generated and downloaded!');
      }
    } catch (err) {
      console.error(err);
      showToast('Downloading ZIP...');
      window.location.href = '/renuka-reddy-portfolio.zip';
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4500);
  };

  const skillsData: SkillItem[] = [
    { name: 'Python & Django', category: 'core', level: 'Advanced', icon: Terminal, desc: 'Django, Django REST Framework, MVC Architecture, RESTful API design' },
    { name: 'Java', category: 'core', level: 'Intermediate', icon: Cpu, desc: 'Object-Oriented Programming, Data Structures, Algorithms' },
    { name: 'PostgreSQL & SQL', category: 'core', level: 'Advanced', icon: Database, desc: 'Relational Schema Design, Complex Queries, Joins, Indexing' },
    { name: 'Full-Stack Web', category: 'web', level: 'Advanced', icon: Layers, desc: 'HTML5, CSS3, JavaScript (ES6+), Bootstrap, Responsive Design' },
    { name: 'React.js', category: 'web', level: 'Applied', icon: Globe, desc: 'Modern Hooks, State Management, Component Architecture, Tailwind' },
    { name: 'Git & GitHub', category: 'tools', level: 'Advanced', icon: Shield, desc: 'Version Control, Branching, Pull Requests, Collaborative Repos' },
    { name: 'Dev Tools & Cloud', category: 'tools', level: 'Intermediate', icon: Rocket, desc: 'Postman API Testing, Render, Netlify, Visual Studio Code' },
    { name: 'Problem Solving', category: 'tools', level: 'Continuous', icon: Compass, desc: 'LeetCode, HackerRank, Data Structures & Algorithmic Logic' },
  ];

  const filteredSkills = activeSkillTab === 'all' 
    ? skillsData 
    : skillsData.filter(s => s.category === activeSkillTab);

  return (
    <div className="min-h-screen bg-[#090a16] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden relative">
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={certFileInputRef} 
        onChange={handleCertImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Dynamic Cosmic Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Floating Ambient Lighting Overlay */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 backdrop-blur-md bg-[#090a16]/80 border-b border-cyan-500/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => scrollToSection('home')} 
            className="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px] transition-transform group-hover:scale-105 shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-[#090a16] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-bold tracking-wider text-sm bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent block">
                RENUKA REDDY
              </span>
              <span className="text-[10px] text-cyan-400/80 uppercase tracking-widest block font-mono">
                B.TECH CSE &bull; CGPA: 8.67
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-lg">
            {['home', 'about', 'skills', 'projects', 'certifications', 'education', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-300 cursor-pointer ${
                  activeSection === section
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-300 hover:text-cyan-400 hover:bg-white/5'
                }`}
              >
                {section === 'certifications' ? 'Certifications' : section}
              </button>
            ))}
          </nav>

          {/* Controls & Accessibility Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              title={reducedMotion ? "Enable galaxy animations" : "Reduce background motion for performance"}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-cyan-400 transition-colors text-xs flex items-center gap-1.5 px-3 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-mono">
                {reducedMotion ? "Motion: Off" : "Motion: On"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Nav */}
        <div className="flex lg:hidden overflow-x-auto gap-2 mt-2 pb-1 no-scrollbar text-xs border-t border-white/5 pt-2">
          {['home', 'about', 'skills', 'projects', 'certifications', 'education', 'contact'].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`px-3 py-1 rounded-full whitespace-nowrap capitalize cursor-pointer ${
                activeSection === section
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 pt-24 pb-16">

        {/* HERO SECTION */}
        <section id="home" className="min-h-[88vh] flex items-center max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="text-xs uppercase tracking-widest font-mono text-cyan-300">
                  Welcome to My Portfolio
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-slate-400 font-mono text-xs sm:text-sm tracking-widest uppercase">HELLO, I'M</p>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,242,254,0.3)]">
                    Renuka Reddy
                  </span>
                </h1>
                <p className="text-lg sm:text-2xl font-light text-cyan-200/90 tracking-wide mt-1">
                  Full-Stack Web Developer & Computer Science Graduate
                </p>
              </div>

              <p className="text-slate-300 max-w-xl text-sm sm:text-base leading-relaxed">
                Computer Science graduate (<strong className="text-cyan-300">B.Tech, 8.67 CGPA</strong>) from Madanapalle Institute of Technology & Science with hands-on experience building full-stack web applications using <strong className="text-white">Python, Django, Django REST Framework, and PostgreSQL</strong>. Certified intern at Careerschool HR Solutions.
              </p>

              {/* Quick Contact Chips from Resume */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono pt-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Madanapalle, Andhra Pradesh</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>+91 9030637723</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>renukareddy9030@gmail.com</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Projects</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToSection('certifications')}
                  className="px-5 py-2.5 rounded-full border border-amber-500/50 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-500/10 text-amber-300 font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>View Certifications</span>
                </button>

                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-5 py-2.5 rounded-full border border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-500/10 text-cyan-300 font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Me</span>
                </button>
              </div>

              {/* Quick Tech Highlights Badge Row */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-5 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-slate-300">CGPA 8.67 / 10</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="text-slate-300">Python & Django REST</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <span className="text-slate-300">PostgreSQL & React</span>
                </div>
              </div>
            </div>

            {/* Hero Right Content - Futuristic Orbital Avatar Frame with Dedicated Add Photo Option */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative group w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                
                {/* Outer Rotating Glowing Ring */}
                <div 
                  className={`absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 ${
                    reducedMotion ? '' : 'animate-[spin_20s_linear_infinite]'
                  }`} 
                />

                {/* Inner Counter-Rotating Orbit */}
                <div 
                  className={`absolute inset-3 rounded-full border border-purple-500/30 ${
                    reducedMotion ? '' : 'animate-[spin_15s_linear_infinite_reverse]'
                  }`}
                />

                {/* Outer Glow Backdrop */}
                <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 blur-2xl group-hover:blur-3xl transition-all duration-500" />

                {/* Main Avatar Container */}
                <div className="relative w-56 h-56 sm:w-60 sm:h-60 rounded-full p-1.5 bg-gradient-to-b from-cyan-400 via-purple-500 to-cyan-900 shadow-[0_0_50px_rgba(0,242,254,0.3)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#090a16] relative group">
                    <img
                      src={userImage}
                      alt="Renuka Reddy"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = DEFAULT_AVATAR;
                      }}
                    />
                    
                    {/* Glass Overlay with Change Photo Trigger */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090a16]/95 via-[#090a16]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <button
                        onClick={() => setIsPhotoModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-full bg-cyan-400 text-slate-950 text-xs flex items-center gap-1.5 font-bold transition-all shadow-lg hover:bg-cyan-300 transform hover:scale-105 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Orbiting Tech Badge Floating Satellites */}
                <div className="absolute top-2 left-4 px-2.5 py-1 rounded-full bg-[#090a16]/90 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 shadow-lg backdrop-blur-md flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-cyan-400" /> Django
                </div>

                <div className="absolute bottom-6 right-2 px-2.5 py-1 rounded-full bg-[#090a16]/90 border border-purple-500/40 text-[11px] font-mono text-purple-300 shadow-lg backdrop-blur-md flex items-center gap-1">
                  <Database className="w-3 h-3 text-purple-400" /> PostgreSQL
                </div>

                <div className="absolute top-1/2 -right-6 -translate-y-1/2 px-2.5 py-1 rounded-full bg-[#090a16]/90 border border-teal-400/40 text-[11px] font-mono text-teal-300 shadow-lg backdrop-blur-md flex items-center gap-1">
                  <Layers className="w-3 h-3 text-teal-400" /> Full-Stack
                </div>
              </div>

              {/* Direct Dedicated "Add / Change Photo" Button under avatar */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-cyan-950/60 border border-cyan-400/50 hover:border-cyan-300 hover:bg-cyan-900/50 text-cyan-300 text-xs font-mono flex items-center gap-2 transition-all shadow-md cursor-pointer group"
                >
                  <Camera className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>Add / Change Photo</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Direct upload picture from device"
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 text-slate-300 hover:text-cyan-300 text-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ABOUT ME SECTION */}
        <section id="about" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest font-mono text-cyan-400 mb-2">
              [ 01 // ABOUT ME ]
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
              Passionate CSE Graduate & Web Developer
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Building secure, scalable, and intuitive software solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Academic Excellence */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 backdrop-blur-md relative group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Academic Excellence</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Completed B.Tech in Computer Science & Engineering from MITS with an outstanding <strong className="text-cyan-300 font-semibold">8.67 CGPA</strong>. Scored 97.1% in Intermediate and 98% in Matriculation.
              </p>
            </div>

            {/* Card 2: Full-Stack & Backend Focus */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-md relative group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Production Internship</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Interned at Careerschool HR Solutions building <strong className="text-purple-300 font-semibold">CurePoint</strong>. Architected role-based access control, secure password encryption, PostgreSQL relational models, and cloud deployment.
              </p>
            </div>

            {/* Card 3: Leadership & Co-Curricular */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-500/40 transition-all duration-300 backdrop-blur-md relative group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4 text-teal-400 group-hover:scale-110 transition-transform">
                <Rocket className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Leadership & Activities</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Organized national-level technical symposium and paper presentations. Participated in Tech Intellect and completed NASSCOM Gold Star Data Acquisition program.
              </p>
            </div>
          </div>
        </section>

        {/* SKILLS UNIVERSE SECTION */}
        <section id="skills" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs uppercase tracking-widest font-mono text-cyan-400 mb-2">
              [ 02 // TECHNICAL ORBIT ]
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
              Technical Proficiencies
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Grounded in real-world application building and computer science principles.
            </p>
          </div>

          {/* Skill Filter Buttons */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {(['all', 'core', 'web', 'tools'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSkillTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeSkillTab === tab
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {tab === 'core' ? 'Backend & Core' : tab === 'web' ? 'Web Stack' : tab === 'tools' ? 'Tools & Cloud' : 'All Spheres'}
              </button>
            ))}
          </div>

          {/* Grid of Skill Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSkills.map((skill, idx) => {
              const IconComp = skill.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/20 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                        {skill.level}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {skill.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Domain</span>
                    <span className="text-slate-300 capitalize">{skill.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FEATURED PROJECT SECTION (CurePoint from Resume) */}
        <section id="projects" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest font-mono text-cyan-400 mb-2">
              [ 03 // FEATURED PRODUCTION PROJECT ]
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
              CurePoint &ndash; Hospital Management System
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Built during Internship at Careerschool HR Solutions | Deployed on Render & Netlify
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/30 via-[#090a16] to-[#090a16] p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Details */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Verified & Tested
                  </span>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    Live on Render & Netlify
                  </span>
                </div>

                <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  CurePoint: Web-based Electronic Health Record & Lab Management
                </h4>

                <p className="text-slate-300 text-sm leading-relaxed">
                  A full-fledged healthcare system with dedicated role-based dashboards for <strong>Patients, Doctors, Lab Technicians, and Hospital Administrators</strong>. Implemented secure token/session authentication and encrypted credentials.
                </p>

                {/* Key Features Bullet List from Resume */}
                <div className="space-y-2 pt-1">
                  {[
                    'Online Appointment Scheduling & Consultation Queue',
                    'Digital Prescriptions & Automated Patient History',
                    'Laboratory Report Uploading with Direct PDF Download',
                    'Comprehensive Three-Tier Architecture with Relational PostgreSQL Schema',
                    'Verified 8 core test cases: registration, login, booking, consultation, prescription, report upload/view, admin login'
                  ].map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Chips */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
                  {['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'HTML5/CSS3', 'Bootstrap', 'JavaScript', 'Postman', 'Render', 'Netlify'].map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Project Links & GitHub Repository */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="https://github.com/Renuka9951/CurePoint-Hospital-Management-System.git"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 text-purple-200 text-xs font-mono font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-md shadow-purple-500/20 cursor-pointer"
                  >
                    <Github className="w-4 h-4 text-purple-300" />
                    <span>View on GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-purple-300" />
                  </a>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://github.com/Renuka9951/CurePoint-Hospital-Management-System.git');
                      showToast('GitHub link copied to clipboard!');
                    }}
                    title="Click to copy GitHub repository URL"
                    className="px-3 py-2 rounded-xl bg-black/50 hover:bg-black/70 border border-white/10 hover:border-cyan-400/40 text-[11px] font-mono text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="text-cyan-400 font-bold">$</span>
                    <span className="truncate max-w-[200px] sm:max-w-none">git clone ...CurePoint-Hospital-Management-System.git</span>
                  </button>
                </div>
              </div>

              {/* Right Dashboard UI Mock Preview */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-cyan-500/30 bg-[#0c0e21] p-4 sm:p-6 shadow-2xl relative">
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="text-xs font-mono text-slate-400 ml-2">curepoint.live-app.net</span>
                    </div>
                    <HeartPulse className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>

                  {/* Stats Cards Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Registered Patients</span>
                      <span className="text-xl font-bold text-cyan-300">142</span>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Lab Reports</span>
                      <span className="text-xl font-bold text-purple-300">89</span>
                    </div>
                    <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/20 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Doctors Active</span>
                      <span className="text-xl font-bold text-teal-300">18</span>
                    </div>
                  </div>

                  {/* Mock Patient List Table Preview */}
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="text-[11px] font-mono text-cyan-400 mb-2 flex items-center justify-between">
                      <span>CUREPOINT CLINICAL RECORDS</span>
                      <span>LAB STATUS</span>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5 text-slate-300">
                        <span className="font-medium">Patient #4092 &bull; Blood Chemistry</span>
                        <span className="text-teal-400 text-[10px] font-mono bg-teal-500/10 px-2 py-0.5 rounded">PDF Generated</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5 text-slate-300">
                        <span className="font-medium">Patient #4093 &bull; Cardiology Consult</span>
                        <span className="text-amber-400 text-[10px] font-mono bg-amber-500/10 px-2 py-0.5 rounded">Prescribed</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 text-slate-300">
                        <span className="font-medium">Patient #4094 &bull; Pediatric Checkup</span>
                        <span className="text-cyan-400 text-[10px] font-mono bg-cyan-500/10 px-2 py-0.5 rounded">Completed</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CERTIFICATIONS SECTION WITH PHOTO UPLOAD & VIEW OPTION */}
        <section id="certifications" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs uppercase tracking-widest font-mono text-amber-400 mb-2">
              [ 04 // CREDENTIALS & ACHIEVEMENTS ]
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent">
              Certifications & Qualifications
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Verified certifications from your resume. You can add or upload certificate pictures anytime!
            </p>
          </div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INITIAL_CERTIFICATIONS.map((cert) => {
              const uploadedImg = certImages[cert.id];
              return (
                <div 
                  key={cert.id}
                  className="rounded-2xl border border-white/10 hover:border-amber-400/40 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-md transition-all duration-300 flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <span className={`text-[11px] font-mono px-3 py-1 rounded-full border ${cert.badgeColor} block`}>
                          {cert.badgeText}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                          Year: {cert.year}
                        </span>
                      </div>
                    </div>

                    {/* Title & Issuer */}
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                        {cert.title}
                      </h4>
                      <p className="text-xs text-amber-300 font-mono mt-0.5">
                        Issued by: {cert.issuer}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {cert.description}
                    </p>

                    {/* Skills Covered */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cert.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Certificate Picture Preview if Uploaded */}
                    {uploadedImg ? (
                      <div className="mt-3 p-2 rounded-xl bg-black/40 border border-amber-400/30 relative group/img">
                        <img 
                          src={uploadedImg} 
                          alt={cert.title} 
                          className="w-full h-40 object-cover rounded-lg cursor-pointer"
                          onClick={() => setPreviewCertImage({ title: cert.title, url: uploadedImg })}
                        />
                        <div className="absolute inset-2 bg-black/70 rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            onClick={() => setPreviewCertImage({ title: cert.title, url: uploadedImg })}
                            className="p-2 rounded-full bg-amber-500 text-black font-bold hover:bg-amber-400 cursor-pointer text-xs flex items-center gap-1"
                          >
                            <ZoomIn className="w-4 h-4" /> View Full
                          </button>
                          <button
                            onClick={() => removeCertImage(cert.id)}
                            className="p-2 rounded-full bg-red-600/80 text-white hover:bg-red-500 cursor-pointer text-xs"
                            title="Remove photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Placeholder Hologram / Add Photo Callout */
                      <div className="mt-3 p-3 rounded-xl border border-dashed border-amber-500/20 bg-amber-950/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-amber-400/60" />
                          <span className="text-[11px] text-slate-400 font-mono">No certificate picture attached</span>
                        </div>
                        <button
                          onClick={() => {
                            setUploadingCertId(cert.id);
                            certFileInputRef.current?.click();
                          }}
                          className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Picture</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setUploadingCertId(cert.id);
                        certFileInputRef.current?.click();
                      }}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-mono cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{uploadedImg ? 'Replace Picture' : 'Add Photo'}</span>
                    </button>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* EDUCATION SECTION (From Resume) */}
        <section id="education" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest font-mono text-cyan-400 mb-2">
              [ 05 // ACADEMIC FOUNDATION ]
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
              Education Timeline
            </h3>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative border-l-2 border-cyan-500/30 pl-6 sm:pl-8 space-y-8 ml-4">
              
              {/* Timeline Point 1: B.Tech */}
              <div className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#090a16] border-2 border-cyan-400 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:animate-ping" />
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 backdrop-blur-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono">
                      2022 — 2026
                    </span>
                    <span className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
                      CGPA: 8.67
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-1">
                    Bachelor of Technology in Computer Science & Engineering
                  </h4>
                  
                  <h5 className="text-sm text-cyan-300 font-medium mb-3">
                    Madanapalle Institute of Technology & Science (MITS), Andhra Pradesh
                  </h5>

                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    Rigorous study of Data Structures, Algorithms, Relational Database Systems, Operating Systems, Web Technologies, Software Engineering, and Practical Development.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    {['Data Structures', 'Python & Django', 'PostgreSQL', 'Java Programming', 'Algorithms', 'Web Architecture'].map((subject, sIdx) => (
                      <span key={sIdx} className="text-xs text-slate-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/5 font-mono">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline Point 2: Intermediate */}
              <div className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#090a16] border-2 border-purple-400 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono">
                      2020 — 2022
                    </span>
                    <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 font-bold">
                      Percentage: 97.1%
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1">
                    Intermediate (Class XII)
                  </h4>
                  
                  <h5 className="text-sm text-purple-300 font-medium">
                    Sri Chaitanya Junior College, Tirupati, Andhra Pradesh
                  </h5>
                </div>
              </div>

              {/* Timeline Point 3: Matriculation */}
              <div className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#090a16] border-2 border-teal-400 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-500/40 transition-all duration-300 backdrop-blur-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-mono">
                      2019 — 2020
                    </span>
                    <span className="text-xs font-mono text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20 font-bold">
                      Score: 98%
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1">
                    Matriculation (Class X)
                  </h4>
                  
                  <h5 className="text-sm text-teal-300 font-medium">
                    Sai Sri High School
                  </h5>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CONTACT SECTION (With real details from Resume) */}
        <section id="contact" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest font-mono text-cyan-400 mb-2">
              [ 06 // GET IN TOUCH ]
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
              Let's Connect & Collaborate
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Open for entry-level software engineer, web developer, and full-stack positions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Social & Direct Contact Info Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5 backdrop-blur-md">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" /> Direct Channels
                </h4>

                {/* Email Link */}
                <a
                  href="mailto:renukareddy9030@gmail.com"
                  className="p-3.5 rounded-xl bg-white/5 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/40 flex items-center gap-3 text-slate-200 hover:text-cyan-300 transition-all text-xs group"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 block font-mono">EMAIL</span>
                    <span className="truncate block font-medium text-cyan-200">renukareddy9030@gmail.com</span>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+919030637723"
                  className="p-3.5 rounded-xl bg-white/5 hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-400/40 flex items-center gap-3 text-slate-200 hover:text-emerald-300 transition-all text-xs group"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 block font-mono">PHONE</span>
                    <span className="truncate block font-medium text-emerald-200">+91 9030637723</span>
                  </div>
                </a>

                {/* LinkedIn Link */}
                <a
                  href="https://linkedin.com/in/renuka-reddy-gosala-13183a411"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-white/5 hover:bg-purple-950/40 border border-white/10 hover:border-purple-400/40 flex items-center gap-3 text-slate-200 hover:text-purple-300 transition-all text-xs group"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 block font-mono">LINKEDIN</span>
                    <span className="truncate block font-medium">renuka-reddy-gosala-13183a411</span>
                  </div>
                </a>

                {/* GitHub Link */}
                <a
                  href="https://github.com/Renuka9951"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-white/5 hover:bg-teal-950/40 border border-white/10 hover:border-teal-400/40 flex items-center gap-3 text-slate-200 hover:text-teal-300 transition-all text-xs group"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 block font-mono">GITHUB</span>
                    <span className="truncate block font-medium">github.com/Renuka9951</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form Container */}
            <div className="lg:col-span-7">
              <form 
                onSubmit={handleContactSubmit}
                className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-cyan-500/20 backdrop-blur-md space-y-4"
              >
                <div>
                  <label className="block text-xs font-mono text-cyan-300 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Alex Vance / Hiring Manager"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a16]/80 border border-white/10 focus:border-cyan-400 focus:outline-none text-slate-100 text-sm placeholder:text-slate-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-300 uppercase mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a16]/80 border border-white/10 focus:border-cyan-400 focus:outline-none text-slate-100 text-sm placeholder:text-slate-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-300 uppercase mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hello Renuka, I saw your portfolio and would like to discuss an opportunity..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a16]/80 border border-white/10 focus:border-cyan-400 focus:outline-none text-slate-100 text-sm placeholder:text-slate-600 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>

                {formSubmitted && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Message Received! Thank you for reaching out to Renuka Reddy.</span>
                  </div>
                )}
              </form>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#060710] py-8 text-center text-xs text-slate-500 font-mono relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Orbit className="w-4 h-4 text-cyan-400" />
            <span>RENUKA REDDY &copy; {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadProjectZip}
              className="text-purple-300 hover:text-purple-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project .ZIP</span>
            </button>
            <span>&bull;</span>
            <span className="text-slate-400">Madanapalle, AP, India</span>
          </div>
        </div>
      </footer>

      {/* MODAL FOR ADD / CUSTOM PHOTO UPLOAD */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0c0e21] border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-400" /> Add Profile Photo
              </h3>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Photo Preview */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400/50 shrink-0">
                <img 
                  src={userImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Profile Photo</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Upload a picture from your device or paste an image link.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Option 1: Direct File Upload */}
              <div>
                <label className="block text-xs font-mono text-cyan-300 mb-1.5 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Option 1: Upload from Device / Phone
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/70 bg-cyan-950/20 hover:bg-cyan-950/40 p-4 rounded-xl text-center cursor-pointer transition-all"
                >
                  <Camera className="w-6 h-6 text-cyan-400 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-200 font-medium">Click to choose image file</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">JPG, PNG, WEBP, GIF (Up to 8MB)</p>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-3 text-slate-500 text-[11px] font-mono">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* Option 2: Image URL */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (tempImgUrl.trim()) {
                    savePhoto(tempImgUrl.trim());
                    setIsPhotoModalOpen(false);
                    setTempImgUrl('');
                    showToast('Photo updated from URL!');
                  }
                }} 
                className="space-y-2.5"
              >
                <label className="block text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Option 2: Paste Photo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/your-photo.png"
                    value={tempImgUrl}
                    onChange={(e) => setTempImgUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#090a16] border border-white/10 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!tempImgUrl.trim()}
                    className="px-4 py-2 rounded-xl bg-cyan-500 disabled:opacity-40 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </form>

              {/* Option 3: Presets */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  Or pick a preset:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        savePhoto(preset.url);
                        setIsPhotoModalOpen(false);
                        showToast(`Selected ${preset.name}`);
                      }}
                      className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-cyan-400 aspect-square p-0.5 cursor-pointer"
                      title={preset.name}
                    >
                      <img 
                        src={preset.url} 
                        alt={preset.name} 
                        className="w-full h-full object-cover rounded group-hover:scale-110 transition-transform" 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset to Default */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    savePhoto(DEFAULT_AVATAR);
                    setIsPhotoModalOpen(false);
                    showToast('Reset to default photo');
                  }}
                  className="text-[11px] font-mono text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Reset Default Photo
                </button>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN CERTIFICATE IMAGE PREVIEW LIGHTBOX */}
      {previewCertImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="max-w-3xl w-full bg-[#0c0e21] border border-amber-500/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>{previewCertImage.title}</span>
              </h3>
              <button
                onClick={() => setPreviewCertImage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-black/50 rounded-xl p-2">
              <img 
                src={previewCertImage.url} 
                alt={previewCertImage.title} 
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-2xl" 
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setPreviewCertImage(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
