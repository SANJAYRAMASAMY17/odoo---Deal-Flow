import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';
import { mongoAuthService } from '../services/mongoAuthService';

const SignupPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('Bengaluru (Karnataka)');
  const [gstin, setGstin] = useState('');
  const [role, setRole] = useState('Director / Co-Founder');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const getPasswordStrength = () => {
    debugger;
    if (!password) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-amber-400', text: 'text-amber-300' };
    return { score: 3, label: 'Strong & Compliant', color: 'bg-emerald-400', text: 'text-emerald-400' };
  };

  const strength = getPasswordStrength();

  const handleResetAccounts = () => {
    mongoAuthService.resetAllAccounts();
    setStatusMessage({
      type: 'emerald',
      text: '🔄 All accounts and logins reset! Ready for fresh account creation.',
    });
    setEmail('');
    setPassword('');
    setFullName('');
    setCompanyName('');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    debugger; // [DEBUGGER] Inspect signup registration data & password score
    if (!agreeTerms) return;

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Syntax validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setStatusMessage({
        type: 'error',
        text: '❌ Please enter a valid corporate email address (e.g. name@company.com).',
      });
      return;
    }

    if (trimmedPassword.length < 6) {
      setStatusMessage({
        type: 'error',
        text: '❌ Password must be at least 6 characters.',
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage({
      type: 'info',
      text: '⚡ Creating fresh account in MongoDB database...',
    });

    // 1. Store account as persistent MongoDB document
    mongoAuthService.registerUserInMongoDB({
      email: trimmedEmail,
      password: trimmedPassword,
      fullName: fullName.trim(),
      companyName: companyName.trim(),
      city,
      gstin: gstin.trim(),
      role,
    });

    // 2. Also keep legacy key synced for complete backwards compatibility
    try {
      const stored = localStorage.getItem('dealflow_registered_users');
      const accounts = stored ? JSON.parse(stored) : [];
      const idx = accounts.findIndex((a) => a.email.toLowerCase() === trimmedEmail);
      if (idx >= 0) {
        accounts[idx] = { email: trimmedEmail, password: trimmedPassword, fullName, companyName, role };
      } else {
        accounts.push({ email: trimmedEmail, password: trimmedPassword, fullName, companyName, role });
      }
      localStorage.setItem('dealflow_registered_users', JSON.stringify(accounts));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage({
        type: 'emerald',
        text: '✅ Fresh account created in MongoDB! Opening portal...',
      });
      setIsAuthenticated(true);
      navigate('/dashboard');
    }, 600);
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

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleResetAccounts}
            className="py-1.5 px-3 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset all accounts in MongoDB database"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Reset Accounts</span>
          </button>
          <Link
            to="/"
            className="py-1.5 px-3.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>Home</span>
          </Link>
          <Link
            to="/login"
            className="text-xs font-medium text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md transition-all hover:bg-slate-800 cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Main Signup Card */}
      <div className="relative z-10 w-full max-w-lg mx-auto my-auto">
        <div className="absolute -inset-0.5 bg-blue-600/20 rounded-3xl blur opacity-30 animate-pulse-slow"></div>

        <div className="relative glass-card rounded-3xl p-8 sm:p-10 border border-slate-700/60 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>14-Day Free Enterprise Trial • ₹0 Setup</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">
              Register Enterprise Business
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Accelerate pipeline velocity, GST quotations & B2B closures
            </p>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl mb-4 text-xs font-medium border flex items-center justify-between ${
                statusMessage.type === 'emerald'
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/40 text-rose-300 border-rose-800/60'
                  : 'bg-blue-950/40 text-blue-300 border-blue-800/60'
              }`}
            >
              <span>{statusMessage.text}</span>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="text-slate-400 hover:text-white ml-2 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Arjun Mehta"
                  required
                  className="w-full py-2 px-3 rounded-xl glass-input text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arjun@company.in"
                  required
                  className="w-full py-2 px-3 rounded-xl glass-input text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nexus Enterprise Ltd"
                  required
                  className="w-full py-2 px-3 rounded-xl glass-input text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Operating City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru (Karnataka)"
                  required
                  className="w-full py-2 px-3 rounded-xl glass-input text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="29AAAAA0000A1Z5"
                  className="w-full py-2 px-3 rounded-xl glass-input text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Corporate Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl glass-input text-sm outline-none"
                >
                  <option value="Director / Co-Founder" className="bg-slate-900">Director / Co-Founder</option>
                  <option value="Sales VP / Head of Sales" className="bg-slate-900">Sales VP / Head of Sales</option>
                  <option value="Finance Controller" className="bg-slate-900">Finance Controller</option>
                  <option value="Billing Specialist" className="bg-slate-900">Billing Specialist</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full py-2 pl-3 pr-10 rounded-xl glass-input text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Password Health:</span>
                    <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 h-1.5">
                    <div className={`rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-800'}`} />
                    <div className={`rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-800'}`} />
                    <div className={`rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-800'}`} />
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600"
                />
                <span>
                  I agree to the <a href="#terms" className="text-blue-400 hover:underline">Indian IT Act Terms</a> and <a href="#privacy" className="text-blue-400 hover:underline">GST Data Policy</a>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white text-sm bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Configuring Enterprise Workspace...' : 'Launch Enterprise Workspace (₹0)'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
