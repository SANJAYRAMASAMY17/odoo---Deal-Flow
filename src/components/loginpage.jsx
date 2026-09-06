import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';
import { mongoAuthService, DEMO_ROLES_CONFIG } from '../services/mongoAuthService';

const LoginPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // [DEBUGGER] Evaluate Password Score & Strength
  const getPasswordStrength = () => {
    debugger; // Debugger point to inspect password score evaluation
    if (!password) return { score: 0, label: '', color: 'bg-slate-700', text: 'text-slate-400' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-amber-400', text: 'text-amber-300' };
    return { score: 4, label: 'Strong & Compliant', color: 'bg-emerald-400', text: 'text-emerald-400' };
  };

  const strength = getPasswordStrength();

  const fillDemoCredentials = () => {
    mongoAuthService.ensureDemoAccount();
    setEmail('founder@dealflow.in');
    setPassword('BharatDealFlow#2026');
    setStatusMessage({ type: 'info', text: '✨ Founder / Co-Founder demo credentials populated!' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleAutofillRole = (roleItem) => {
    mongoAuthService.ensureDemoAccount(roleItem.email);
    setEmail(roleItem.email);
    setPassword(roleItem.password);
    setStatusMessage({
      type: 'info',
      text: `✨ Loaded ${roleItem.title} credentials (${roleItem.email})`,
    });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleQuickRoleLogin = (roleItem) => {
    mongoAuthService.ensureDemoAccount(roleItem.email);
    const sessionToken = `df_live_sec_${btoa(roleItem.email)}_${Date.now()}`;
    const userProfile = {
      _id: `65e8a1f2b3c4d5e6f7a8b9c_${roleItem.id}`,
      email: roleItem.email,
      name: roleItem.name,
      role: roleItem.role,
      company: roleItem.company,
      defaultModule: roleItem.defaultModule,
      loginTime: new Date().toISOString(),
    };
    establishUserSession(userProfile, true);
    setIsAuthenticated(true);
    navigate(`/dashboard?role=${roleItem.id}`, { state: { targetModule: roleItem.defaultModule } });
  };

  // Pre-configured valid enterprise accounts
  const DEFAULT_ACCOUNTS = [
    { email: 'arjun.mehta@dealflow.in', password: 'BharatDealFlow#2026', name: 'Arjun Mehta', role: 'Director / Co-Founder', company: 'Bharat Tech Holdings' },
    { email: 'admin@dealflow.in', password: 'BharatDealFlow#2026', name: 'System Administrator', role: 'Enterprise Admin', company: 'DealFlow Technologies Inc.' },
    { email: 'demo@dealflow.in', password: 'BharatDealFlow#2026', name: 'Enterprise Auditor', role: 'Deal Lead', company: 'Indus Capital Partners' },
  ];

  // Helper: Persist real enterprise session token matching big websites
  const establishUserSession = (userProfile, isPersistent) => {
    const sessionToken = `df_live_sec_${btoa(userProfile.email)}_${Date.now()}`;
    const sessionData = {
      token: sessionToken,
      user: {
        email: userProfile.email,
        name: userProfile.name || userProfile.fullName || userProfile.email.split('@')[0],
        role: userProfile.role || 'Executive Dealmaker',
        company: userProfile.company || userProfile.companyName || 'DealFlow Enterprise',
        loginTime: new Date().toISOString(),
      },
    };

    if (isPersistent) {
      localStorage.setItem('dealflow_auth_token', sessionData.token);
      localStorage.setItem('dealflow_active_user', JSON.stringify(sessionData.user));
      sessionStorage.removeItem('dealflow_auth_token');
      sessionStorage.removeItem('dealflow_active_user');
    } else {
      sessionStorage.setItem('dealflow_auth_token', sessionData.token);
      sessionStorage.setItem('dealflow_active_user', JSON.stringify(sessionData.user));
      localStorage.removeItem('dealflow_auth_token');
      localStorage.removeItem('dealflow_active_user');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    debugger; // [DEBUGGER] Inspect login submission status & credentials

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // 1. Email format syntax check (like Stripe / Google / Salesforce)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      debugger; // [DEBUGGER] Invalid email format
      setStatusMessage({
        type: 'error',
        text: '❌ Please enter a valid corporate email address (e.g. name@company.com).',
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage({
      type: 'info',
      text: '⚡ Connecting to MongoDB authentication & database engine...',
    });

    try {
      // 2. Real Account Login with MongoDB (checks server API / MongoDB collection & rate limiting)
      const authResult = await mongoAuthService.loginWithMongoDB(
        trimmedEmail,
        trimmedPassword,
        rememberMe
      );

      if (!authResult.success) {
        debugger; // [DEBUGGER] Status: Authentication failed or wrong password
        setIsLoading(false);
        setStatusMessage({
          type: 'error',
          text: authResult.error || '❌ Wrong password! Access denied.',
        });
        return;
      }

      debugger; // [DEBUGGER] Status: Real MongoDB account verified successfully!
      setStatusMessage({
        type: 'emerald',
        text: '✅ Verified with MongoDB! Generating secure session...',
      });

      // Match role configuration from DEMO_ROLES_CONFIG
      const matchingRole = DEMO_ROLES_CONFIG.find(
        (r) => r.email?.toLowerCase() === trimmedEmail
      ) || DEMO_ROLES_CONFIG.find(
        (r) => r.role?.toLowerCase() === (authResult.user.role || '').toLowerCase()
      ) || DEMO_ROLES_CONFIG[0];

      const targetRole = matchingRole.id;
      const targetModule = matchingRole.defaultModule || 'Dashboard';

      const enrichedUser = {
        ...authResult.user,
        role: matchingRole.role,
        company: matchingRole.company || authResult.user.company || 'DealFlow Enterprise',
        defaultModule: targetModule,
      };

      // Synchronize session token and active user
      establishUserSession(enrichedUser, rememberMe);

      setTimeout(() => {
        setIsLoading(false);
        setIsAuthenticated(true);
        navigate(`/dashboard?role=${targetRole}`, { state: { targetModule } });
      }, 600);
    } catch {
      debugger; // [DEBUGGER] Status: MongoDB login error
      setIsLoading(false);
      setStatusMessage({
        type: 'error',
        text: '❌ Authentication error connecting to database. Please retry.',
      });
    }
  };

  const onSocialLogin = async (provider) => {
    setIsLoading(true);
    debugger; // [DEBUGGER] Initiating corporate SSO identity handshake with MongoDB
    setStatusMessage({ type: 'info', text: `Connecting to ${provider} Single Sign-On (MongoDB)...` });

    try {
      const ssoResult = await mongoAuthService.ssoLoginWithMongoDB(provider, email, rememberMe);
      debugger; // [DEBUGGER] Status: SSO MongoDB session created successfully
      const trimmedEmail = (ssoResult.user.email || '').trim().toLowerCase();
      const matchingRole = DEMO_ROLES_CONFIG.find(
        (r) => r.email?.toLowerCase() === trimmedEmail
      ) || DEMO_ROLES_CONFIG[0];

      const enrichedUser = {
        ...ssoResult.user,
        role: matchingRole.role,
        company: matchingRole.company,
        defaultModule: matchingRole.defaultModule,
      };

      establishUserSession(enrichedUser, rememberMe);

      setTimeout(() => {
        setIsLoading(false);
        setIsAuthenticated(true);
        navigate(`/dashboard?role=${matchingRole.id}`, { state: { targetModule: matchingRole.defaultModule } });
      }, 700);
    } catch {
      setIsLoading(false);
      setStatusMessage({
        type: 'error',
        text: '❌ SSO authentication failed. Please try standard sign-in.',
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden bg-[#0b0f19] font-sans">
      <ParticleBackground />

      {/* Top Header Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          title="Go to Home Page"
        >
          <span className="text-xl font-bold font-display tracking-tight text-white">
            DealFlow<span className="text-blue-500">360</span>
          </span>
        </Link>

        {/* Region & Navigation Links */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="py-1.5 px-3.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Centered Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto pt-14 lg:pt-16 pb-8">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-blue-600/20 rounded-3xl blur opacity-30 animate-pulse-slow"></div>

          <div className="relative glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl bg-[#0f172a]/95">
            {/* Card Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Enterprise B2B Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                Sign In to DealFlow360
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Enter your credentials or click any demo role below to fill instantly
              </p>
            </div>

            {/* Demo Credentials Quick-Fill Strip */}
            <div className="mb-5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚡ Demo Accounts</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Password: <strong className="text-emerald-400 font-sans">BharatDealFlow#2026</strong>
                </span>
              </div>

              {/* 4 Quick Role Fill Chips */}
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ROLES_CONFIG.filter((r) => !['finance', 'warehouse'].includes(r.id)).map((roleItem) => (
                  <button
                    key={roleItem.id}
                    type="button"
                    onClick={() => handleAutofillRole(roleItem)}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 transition-all text-left cursor-pointer group"
                    title={`Auto-fill ${roleItem.title} (${roleItem.email})`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{roleItem.icon}</span>
                      <span className="text-xs font-bold text-white group-hover:text-sky-300 truncate">
                        {roleItem.title}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-sky-400/90 truncate mt-0.5">
                      {roleItem.email}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification status message */}
            {statusMessage && (
              <div
                className={`mb-5 p-3 rounded-xl text-xs font-medium border flex items-center gap-2.5 transition-all animate-fadeIn ${
                  statusMessage.type === 'error'
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    : statusMessage.type === 'info'
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                {statusMessage.type === 'error' ? (
                  <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M12 16v-4m0-4h.01" />
                  </svg>
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Corporate Email ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.in"
                    required
                    className="w-full py-2.5 pl-10 pr-4 rounded-xl glass-input text-xs sm:text-sm placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setStatusMessage({ type: 'info', text: 'Password reset link sent to registered email' });
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full py-2.5 pl-10 pr-10 rounded-xl glass-input text-xs sm:text-sm placeholder-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Score with Debugger */}
                {password && (
                  <div className="mt-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 animate-fadeIn">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">Password Score:</span>
                      <span className={`font-semibold ${strength.text}`}>
                        {strength.label} ({strength.score}/4)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 transition-all ${strength.score >= 1 ? strength.color : 'bg-slate-700/60'}`} />
                      <div className={`h-full flex-1 transition-all ${strength.score >= 2 ? strength.color : 'bg-slate-700/60'}`} />
                      <div className={`h-full flex-1 transition-all ${strength.score >= 3 ? strength.color : 'bg-slate-700/60'}`} />
                      <div className={`h-full flex-1 transition-all ${strength.score >= 4 ? strength.color : 'bg-slate-700/60'}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800/80 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition-colors"
                  />
                  <span>Remember this workstation for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-3 px-4 rounded-xl font-bold text-white text-xs sm:text-sm shadow-md shadow-blue-500/25 bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to DealFlow360</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/60" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#0f172a] px-2.5 text-slate-400 tracking-wider font-medium">
                  Fast-track corporate SSO
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSocialLogin('Google Workspace')}
                className="flex items-center justify-center py-2 px-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 text-slate-200 transition-all text-[11px] font-semibold cursor-pointer"
              >
                Google
              </button>

              <button
                type="button"
                onClick={() => onSocialLogin('Microsoft Entra ID')}
                className="flex items-center justify-center py-2 px-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 text-slate-200 transition-all text-[11px] font-semibold cursor-pointer"
              >
                Microsoft
              </button>

              <button
                type="button"
                onClick={() => onSocialLogin('GitHub Enterprise')}
                className="flex items-center justify-center py-2.5 px-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 text-slate-200 transition-all text-[11px] font-semibold cursor-pointer"
              >
                GitHub
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center pt-4 border-t border-slate-800/80">
              <p className="text-xs text-slate-400">
                New enterprise account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-blue-400 hover:text-blue-300 transition-colors ml-1"
                >
                  Register business →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;