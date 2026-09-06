import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { mongoDatabaseService } from '../services/mongoDatabaseService.js';

const HomePage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  // Two-color theme state matching Dashboard & LoginPage ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState('sell');

  // Consultation Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    needs: '',
    acknowledge: false,
  });
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim()) {
      setFormError('Please enter both your name and email address.');
      return;
    }
    if (!contactForm.acknowledge) {
      setFormError("Please acknowledge DFVC's Terms and Privacy Policy.");
      return;
    }
    if (!captchaChecked) {
      setFormError('Please verify the reCAPTCHA checkbox.');
      return;
    }
    setFormError('');

    // Persist consultation lead into MongoDB database
    mongoDatabaseService.saveConsultation(contactForm);

    setFormSubmitted(true);
  };

  // Navigation module tabs from the enterprise platform
  const navModules = [
    'Dashboard',
    'Quotations',
    'Approvals',
    'Fulfillment',
    'Subscriptions',
    'Invoices',
    'Deal Health',
    'Reports',
    'Products',
    'Discount Chains',
    'Customer Portal',
  ];

  const handleNavToModule = (moduleName) => {
    if (setIsAuthenticated) setIsAuthenticated(true);
    navigate('/dashboard', { state: { targetModule: moduleName } });
  };

  const objectives = [
    {
      id: 'sell',
      title: 'Sell a business',
      description: 'Find qualified buyers, confidentially',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'raise',
      title: 'Raise capital or financing',
      description: 'Growth capital, recaps, or acquisition financing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
    },
    {
      id: 'buy',
      title: 'Buy a business',
      description: 'Source pre-market and off-market deals',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m0-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'invest',
      title: 'Invest or lend to a business',
      description: 'Deploy capital into matched opportunities',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: 'advisor',
      title: 'M&A Advisor / Broker',
      description: 'Source buyers and sellers for client mandates',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const handleContinue = () => {
    setIsModalOpen(false);
    if (setIsAuthenticated) setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'light' ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#0b0f19] text-slate-100'
      } font-sans flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200`}
    >
      {/* =========================================================================
          TOP NAVIGATION BAR (Matching DashboardHeader Style & Theme)
         ========================================================================= */}
      <header
        className={`sticky top-0 z-40 ${
          theme === 'light'
            ? 'bg-white/95 border-slate-200/90 shadow-sm'
            : 'bg-[#0f172a]/95 border-slate-800/90 shadow-sm'
        } backdrop-blur-xl border-b px-4 lg:px-8 py-2.5 transition-colors duration-200`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Title */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center shrink-0 cursor-pointer"
          >
            <span
              className={`text-xl font-extrabold tracking-tight ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}
            >
              DealFlow<span className="text-blue-600 dark:text-blue-400">360</span>
            </span>
          </div>

          {/* Navigation Module Tabs: Dashboard, Quotations, Approvals, Fulfillment, Subscriptions, Invoices, Deal Health, Reports, Products, Discount Chains, Customer Portal */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1 px-1 scrollbar-none max-w-2xl lg:max-w-3xl">
            {navModules.map((module) => (
              <button
                key={module}
                onClick={() => handleNavToModule(module)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer ${
                  theme === 'light'
                    ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 font-medium'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-medium'
                }`}
                title={`Open ${module} Section`}
              >
                {module}
              </button>
            ))}
          </nav>

          {/* Right Action Controls: Theme Selector, Log In & Get Started */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 2-Mode Theme Transition Switcher Dropdown */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  theme === 'light'
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-slate-200/50'
                    : 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700 text-slate-200 shadow-black/20'
                }`}
                title="Change Theme (Dark / Light)"
                aria-label="Toggle Theme Menu"
              >
                {theme === 'light' ? (
                  <>
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                    <span className="hidden md:inline">Light</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                    <span className="hidden md:inline">Dark</span>
                  </>
                )}
                <svg className="w-3 h-3 opacity-60 ml-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Theme Dropdown Menu */}
              {isThemeMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-44 rounded-2xl border shadow-xl p-1.5 z-50 animate-fadeIn backdrop-blur-xl ${
                    theme === 'light'
                      ? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/40'
                      : 'bg-[#0f172a]/95 border-slate-700 text-slate-100 shadow-black/60'
                  }`}
                >
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Theme Select
                  </div>
                  <button
                    onClick={() => {
                      setTheme('light');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                    <span>Light Theme</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                    <span>Dark Theme</span>
                  </button>
                </div>
              )}
            </div>

            {/* Existing Login Page Action */}
            <Link
              to="/login"
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all inline-flex items-center justify-center ${
                theme === 'light'
                  ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700 text-slate-200'
              }`}
            >
              Log in
            </Link>

            {/* Get Started Button (Triggers Objective Modal) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-1.5 px-3.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get started</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION ("Where deals get done")
         ========================================================================= */}
      <section
        className={`relative pt-20 pb-20 sm:pt-28 sm:pb-28 overflow-hidden transition-colors duration-200 ${
          theme === 'light'
            ? 'bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc]'
            : 'bg-gradient-to-b from-[#0b0f19] via-[#0d1424] to-[#0b0f19]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1
              className={`text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight font-display leading-[1.05] ${
                theme === 'light' ? 'text-slate-950' : 'text-white'
              }`}
            >
              Where <span className="text-blue-600 dark:text-blue-400">deals</span>
              <br />
              get done
            </h1>

            <p
              className={`text-lg sm:text-xl font-normal leading-relaxed pt-2 max-w-2xl ${
                theme === 'light' ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              Join 3,000+ business owners, investors, and enterprise leaders who trust DealFlow360 to automate quotations, protect contract margins, and streamline revenue pipelines.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-3.5 px-8 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Get started</span>
                <span className="text-base">→</span>
              </button>

              <button
                onClick={() => handleNavToModule('Dashboard')}
                className={`py-3.5 px-7 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                <span>Explore Live Platform</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODULE SHORTCUTS SHOWCASE (Dashboard, Quotations, Approvals, etc.)
         ========================================================================= */}
      <section
        className={`py-16 border-t transition-colors duration-200 ${
          theme === 'light'
            ? 'bg-white border-slate-200/80'
            : 'bg-[#0f172a]/80 border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
                ENTERPRISE REVENUE ENGINE
              </span>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold font-display ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              >
                Explore Built-In Platform Modules
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Click any section to open the live workspace with complete interactive data models.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {navModules.slice(0, 6).map((mod) => (
              <div
                key={mod}
                onClick={() => handleNavToModule(mod)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                  theme === 'light'
                    ? 'bg-slate-50/80 hover:bg-white border-slate-200 hover:border-blue-500 hover:shadow-md'
                    : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 hover:border-blue-500 hover:shadow-black/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                  <span className="text-slate-400 group-hover:text-blue-500 text-xs">→</span>
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold font-display ${
                      theme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {mod}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {mod === 'Dashboard' && 'KPIs & Pipeline'}
                    {mod === 'Quotations' && 'CPQ & Line Items'}
                    {mod === 'Approvals' && 'Risk-based Chain'}
                    {mod === 'Fulfillment' && 'Warehouse Split'}
                    {mod === 'Subscriptions' && 'MRR & Lifecycle'}
                    {mod === 'Invoices' && 'GST & Aging Buckets'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS SECTION ("Management software built for the way deals get done")
         ========================================================================= */}
      <section
        className={`py-24 border-t transition-colors duration-200 ${
          theme === 'light'
            ? 'bg-[#fafbfc] border-slate-200/80'
            : 'bg-[#0b0f19] border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Heading & Narrative */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
                HOW IT WORKS
              </span>

              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display leading-tight ${
                  theme === 'light' ? 'text-slate-950' : 'text-white'
                }`}
              >
                Management software built for the way deals get done
              </h2>

              <p
                className={`text-sm sm:text-base leading-relaxed max-w-md ${
                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Unlike public deal listing sites, Dealflow sell-side members retain total control and confidentiality over whom, how, and when they approach the market.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="py-3 px-7 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Get started</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right Column: 3 Step Cards */}
            <div className="lg:col-span-7 space-y-5">
              {/* Step 1 */}
              <div
                className={`p-7 sm:p-8 rounded-2xl border transition-all duration-200 flex items-start gap-5 ${
                  theme === 'light'
                    ? 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    : 'border-slate-800 bg-[#0f172a]/90 hover:border-slate-700 hover:bg-slate-900/90 shadow-md shadow-black/20'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    STEP 01
                  </span>
                  <h3
                    className={`text-xl font-bold font-display ${
                      theme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Define your criteria
                  </h3>
                  <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Buy-side sets investment criteria and sell-side inputs company details into a private research tool.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={`p-7 sm:p-8 rounded-2xl border transition-all duration-200 flex items-start gap-5 ${
                  theme === 'light'
                    ? 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    : 'border-slate-800 bg-[#0f172a]/90 hover:border-slate-700 hover:bg-slate-900/90 shadow-md shadow-black/20'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    STEP 02
                  </span>
                  <h3
                    className={`text-xl font-bold font-display ${
                      theme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Intelligent matching
                  </h3>
                  <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Dealflow's algorithms match buy-side criteria with sell-side offers, ranking them by relevance.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`p-7 sm:p-8 rounded-2xl border transition-all duration-200 flex items-start gap-5 ${
                  theme === 'light'
                    ? 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    : 'border-slate-800 bg-[#0f172a]/90 hover:border-slate-700 hover:bg-slate-900/90 shadow-md shadow-black/20'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    STEP 03
                  </span>
                  <h3
                    className={`text-xl font-bold font-display ${
                      theme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Connect privately
                  </h3>
                  <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Sell-side reviews buy-side profiles for engagement, ensuring private direct communication and tailored deal opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4-CARD SOLUTIONS / PERSONA GRID
         ========================================================================= */}
      <section
        className={`py-24 border-t transition-colors duration-200 ${
          theme === 'light'
            ? 'bg-white border-slate-200/80'
            : 'bg-[#0f172a]/60 border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Sell your business */}
            <div
              className={`rounded-3xl p-8 sm:p-10 border transition-all flex flex-col justify-between space-y-8 ${
                theme === 'light'
                  ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  : 'bg-[#0f172a] border-slate-800 shadow-xl shadow-black/20 hover:border-slate-700'
              }`}
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    OWNERS & ADVISORS
                  </span>
                  <h3
                    className={`text-2xl sm:text-3xl font-extrabold font-display ${
                      theme === 'light' ? 'text-slate-950' : 'text-white'
                    }`}
                  >
                    Sell your business
                  </h3>
                </div>

                <ul className={`space-y-3.5 text-sm leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Surface your business exclusively to pre-vetted, high-intent buyers and investors.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Retain full control and confidentiality over who sees your deal and when.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Engage qualified private equity firms, family offices, and strategic buyers aligned with your company.</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`py-2.5 px-5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    theme === 'light'
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <span>Learn more</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Card 2: Find businesses for sale */}
            <div
              className={`rounded-3xl p-8 sm:p-10 border transition-all flex flex-col justify-between space-y-8 ${
                theme === 'light'
                  ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  : 'bg-[#0f172a] border-slate-800 shadow-xl shadow-black/20 hover:border-slate-700'
              }`}
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    BUYERS & INVESTORS
                  </span>
                  <h3
                    className={`text-2xl sm:text-3xl font-extrabold font-display ${
                      theme === 'light' ? 'text-slate-950' : 'text-white'
                    }`}
                  >
                    Find businesses for sale
                  </h3>
                </div>

                <ul className={`space-y-3.5 text-sm leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Access curated deal flow matched to your investment criteria — no more sifting through noise.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Review anonymized teasers and request NDAs directly through the platform.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Move faster with intelligent matching that ranks opportunities by relevance.</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`py-2.5 px-5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    theme === 'light'
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <span>Get started</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Card 3: Raise capital or financing */}
            <div
              className={`rounded-3xl p-8 sm:p-10 border transition-all flex flex-col justify-between space-y-8 ${
                theme === 'light'
                  ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  : 'bg-[#0f172a] border-slate-800 shadow-xl shadow-black/20 hover:border-slate-700'
              }`}
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    OWNERS & ADVISORS
                  </span>
                  <h3
                    className={`text-2xl sm:text-3xl font-extrabold font-display ${
                      theme === 'light' ? 'text-slate-950' : 'text-white'
                    }`}
                  >
                    Raise capital or financing
                  </h3>
                </div>

                <ul className={`space-y-3.5 text-sm leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Connect with lenders, venture capitalists, and equity investors actively deploying capital in the lower middle market.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Present your opportunity confidentially to a curated network of debt and equity providers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Streamline the fundraising process with matched introductions based on your deal profile.</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`py-2.5 px-5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    theme === 'light'
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <span>Get started</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Card 4: Invest or lend */}
            <div
              className={`rounded-3xl p-8 sm:p-10 border transition-all flex flex-col justify-between space-y-8 ${
                theme === 'light'
                  ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  : 'bg-[#0f172a] border-slate-800 shadow-xl shadow-black/20 hover:border-slate-700'
              }`}
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m0-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    LENDERS & INVESTORS
                  </span>
                  <h3
                    className={`text-2xl sm:text-3xl font-extrabold font-display ${
                      theme === 'light' ? 'text-slate-950' : 'text-white'
                    }`}
                  >
                    Invest or lend
                  </h3>
                </div>

                <ul className={`space-y-3.5 text-sm leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Source debt and equity opportunities matched to your mandate — industry, size, and geography.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Review detailed deal profiles and engage directly with owners and advisors.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Build a proprietary pipeline of lower middle market investment opportunities.</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`py-2.5 px-5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    theme === 'light'
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <span>Get started</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTACT SECTION (20+ Years Building Successful Deals & Consultation Form)
         ========================================================================= */}
      <section
        id="contact"
        className={`py-20 lg:py-24 border-t transition-colors duration-200 relative overflow-hidden ${
          theme === 'light'
            ? 'bg-[#f4f6f8] border-slate-200'
            : 'bg-[#090d16] border-slate-800/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: 20+ Badge & Deals Advisory Copy */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row items-center sm:items-start gap-8 lg:gap-10">
              {/* 20+ Circle Badge (Pure CSS - Zero Photos) */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#f57c00] flex items-center justify-center shrink-0 shadow-xl shadow-orange-500/25">
                <span className="text-slate-950 font-black text-5xl sm:text-6xl tracking-tight select-none">
                  20+
                </span>
              </div>

              {/* Text & Link */}
              <div className="space-y-4 text-center sm:text-left">
                <h2
                  className={`text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight font-display leading-[1.15] ${
                    theme === 'light' ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  Years building <br className="hidden sm:inline" />
                  successful deals.
                </h2>
                <p
                  className={`text-sm sm:text-base leading-relaxed max-w-md ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  Guiding business owners through valuation, marketing, diligence,
                  negotiations, and integration with a focus on confidentiality and value
                  maximization.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 text-[#c00e12] hover:text-red-700 font-bold text-sm sm:text-base transition-colors group cursor-pointer"
                  >
                    <span>See how we work</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1.5 font-bold">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Vertical Divider / Label */}
            <div className="hidden lg:flex lg:col-span-1 justify-center items-center h-full relative">
              <div className="flex flex-col items-center gap-4 py-8">
                {/* Red Target Dot Indicator matching screenshot */}
                <div className="w-5 h-5 rounded-full border border-red-500/50 flex items-center justify-center bg-red-500/10">
                  <div className="w-2 h-2 rounded-full bg-[#c00e12]"></div>
                </div>
                <div className="h-16 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-bold tracking-[0.25em] text-slate-400 select-none uppercase">
                  CONTACT US
                </span>
                <div className="h-16 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
              </div>
            </div>

            {/* Right Column: Request a Consultation Card */}
            <div className="lg:col-span-5">
              <div
                className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-9 border shadow-xl transition-all ${
                  theme === 'light'
                    ? 'bg-white border-slate-200/90 shadow-slate-200/60 text-slate-800'
                    : 'bg-[#0f172a] border-slate-800 shadow-2xl shadow-black/50 text-slate-100'
                }`}
              >
                <h3
                  className={`text-2xl sm:text-[26px] font-extrabold tracking-tight font-display mb-6 ${
                    theme === 'light' ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  Request a consultation
                </h3>

                {formSubmitted ? (
                  <div className="py-8 text-center space-y-4 animate-fadeIn">
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        Consultation Request Submitted
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Thank you, {contactForm.name}. Our senior M&A and advisory team will reach out within 24 hours.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormSubmitted(false);
                        setContactForm({ name: '', email: '', phone: '', needs: '', acknowledge: false });
                        setCaptchaChecked(false);
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your name*"
                        required
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border transition-all ${
                          theme === 'light'
                            ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#c00e12] focus:ring-1 focus:ring-[#c00e12]/20'
                            : 'bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#c00e12] focus:ring-1 focus:ring-[#c00e12]/30'
                        } outline-none`}
                      />
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="Your email address*"
                        required
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border transition-all ${
                          theme === 'light'
                            ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#c00e12] focus:ring-1 focus:ring-[#c00e12]/20'
                            : 'bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#c00e12] focus:ring-1 focus:ring-[#c00e12]/30'
                        } outline-none`}
                      />
                    </div>

                    {/* Phone Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="Your phone"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border transition-all ${
                          theme === 'light'
                            ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#c00e12] focus:ring-1 focus:ring-[#c00e12]/20'
                            : 'bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#c00e12] focus:ring-1 focus:ring-[#c00e12]/30'
                        } outline-none`}
                      />
                    </div>

                    {/* Needs Textarea */}
                    <div className="relative">
                      <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </div>
                      <textarea
                        rows="3"
                        value={contactForm.needs}
                        onChange={(e) => setContactForm({ ...contactForm, needs: e.target.value })}
                        placeholder="Tell us about your business needs..."
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border transition-all resize-none ${
                          theme === 'light'
                            ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#c00e12] focus:ring-1 focus:ring-[#c00e12]/20'
                            : 'bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#c00e12] focus:ring-1 focus:ring-[#c00e12]/30'
                        } outline-none`}
                      ></textarea>
                    </div>

                    {/* Terms Checkbox */}
                    <label className="flex items-start gap-2.5 cursor-pointer select-none text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={contactForm.acknowledge}
                        onChange={(e) => setContactForm({ ...contactForm, acknowledge: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#c00e12] focus:ring-[#c00e12] cursor-pointer shrink-0"
                      />
                      <span>
                        By submitting this form, you acknowledge{' '}
                        <span className="text-[#c00e12] font-semibold hover:underline cursor-pointer">
                          DFVC's Terms
                        </span>{' '}
                        and{' '}
                        <span className="text-[#c00e12] font-semibold hover:underline cursor-pointer">
                          Privacy Policy
                        </span>{' '}
                        and consent to be contacted regarding our advisory services.
                      </span>
                    </label>

                    {/* Interactive reCAPTCHA Box */}
                    <div
                      onClick={() => setCaptchaChecked(!captchaChecked)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-all ${
                        theme === 'light'
                          ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                          : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${
                            captchaChecked
                              ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
                              : (theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800')
                          }`}
                        >
                          {captchaChecked && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                          I'm not a robot
                        </span>
                      </div>

                      <div className="flex flex-col items-center shrink-0">
                        <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                        <span className="text-[8px] font-bold text-slate-400 tracking-tighter uppercase mt-0.5">
                          reCAPTCHA
                        </span>
                        <span className="text-[7px] text-slate-400 leading-none">
                          Privacy - Terms
                        </span>
                      </div>
                    </div>

                    {/* Error message */}
                    {formError && (
                      <p className="text-xs text-red-500 font-medium">{formError}</p>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#c00e12] hover:bg-red-800 active:bg-red-900 transition-all shadow-md shadow-red-900/20 cursor-pointer"
                    >
                      SUBMIT REQUEST
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
         ========================================================================= */}
      <footer
        className={`border-t py-12 transition-colors duration-200 ${
          theme === 'light'
            ? 'bg-white border-slate-200 text-slate-600'
            : 'bg-[#0f172a] border-slate-800 text-slate-400'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span
              className={`text-lg font-extrabold tracking-tight font-display ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}
            >
              DealFlow<span className="text-blue-500">360</span>
            </span>
            <span className="text-xs text-slate-400 ml-2">
              © 2026 DealFlow Technologies Inc. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium">
            <Link
              to="/dashboard"
              onClick={() => {
                if (setIsAuthenticated) setIsAuthenticated(true);
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Open Dashboard
            </Link>
            <button
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-red-500 transition-colors cursor-pointer font-medium"
            >
              Contact Us
            </button>
            <Link
              to="/login"
              className="hover:text-blue-500 transition-colors cursor-pointer"
            >
              Sign In
            </Link>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          "JOIN DEALFLOW" OBJECTIVE ONBOARDING MODAL (Rendered via ReactDOM Portal)
         ========================================================================= */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div
            className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border space-y-6 transition-all ${
              theme === 'light'
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-[#0f172a] border-slate-700 text-slate-100'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3
                  className={`text-2xl font-bold font-display tracking-tight ${
                    theme === 'light' ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  Join Dealflow
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">
                  What is your main objective?
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">
                  1 of 3
                </span>
                {/* 3-segment progress bar */}
                <div className="flex items-center gap-1">
                  <span className="w-6 h-1 rounded-full bg-blue-600"></span>
                  <span
                    className={`w-4 h-1 rounded-full ${
                      theme === 'light' ? 'bg-slate-200' : 'bg-slate-700'
                    }`}
                  ></span>
                  <span
                    className={`w-4 h-1 rounded-full ${
                      theme === 'light' ? 'bg-slate-200' : 'bg-slate-700'
                    }`}
                  ></span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    theme === 'light'
                      ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 5 Selectable Objective Cards */}
            <div className="space-y-2.5">
              {objectives.map((obj) => {
                const isSelected = selectedObjective === obj.id;
                return (
                  <div
                    key={obj.id}
                    onClick={() => setSelectedObjective(obj.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600/10 shadow-xs ring-1 ring-blue-600/30'
                        : (theme === 'light'
                            ? 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/60')
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : (theme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300')
                      }`}
                    >
                      {obj.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-bold ${
                          theme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {obj.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {obj.description}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : (theme === 'light' ? 'border-slate-300' : 'border-slate-700')
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414L6 7.586 3.707 5.293z" />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end pt-2">
              <button
                onClick={handleContinue}
                className="py-2.5 px-6 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default HomePage;
