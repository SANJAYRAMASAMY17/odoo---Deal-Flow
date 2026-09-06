import { Link } from 'react-router-dom';

const DashboardHeader = ({
  activeModule,
  setActiveModule,
  setActiveQuotationDetail,
  setActiveApprovalDetail,
  setActiveFulfillmentDetail,
  setActiveInvoiceDetail,
  setActiveSubscriptionDetail,
  theme,
  setTheme,
  isThemeMenuOpen,
  setIsThemeMenuOpen,
  themeMenuRef,
  handleLogout,
  navModules,
}) => {
  const activeUser = (() => {
    try {
      const stored = localStorage.getItem('dealflow_active_user') || sessionStorage.getItem('dealflow_active_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  return (
      <header className={`sticky top-0 z-40 ${theme === 'light' ? 'bg-white/95 border-slate-200/90 shadow-sm' : 'bg-[#0f172a]/95 border-slate-800/90 shadow-sm'} backdrop-blur-xl border-b px-4 lg:px-8 py-2.5 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Title */}
          <div 
            onClick={() => {
              setActiveQuotationDetail(null);
              setActiveModule('Dashboard');
            }}
            className="flex items-center shrink-0 cursor-pointer"
          >
            <span className={`text-xl font-extrabold tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              DealFlow<span className="text-blue-600 dark:text-blue-400">360</span>
            </span>
          </div>

          {/* 9 Navigation Module Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1 px-1 scrollbar-none max-w-2xl lg:max-w-3xl">
            {navModules.map((module) => (
              <button
                key={module}
                onClick={() => {
                  if (activeModule === module && module === 'Approvals') {
                    setActiveApprovalDetail(null);
                  } else if (activeModule === module && module === 'Fulfillment') {
                    setActiveFulfillmentDetail(null);
                  } else if (activeModule === module && module === 'Invoices') {
                    setActiveInvoiceDetail(null);
                  } else if (activeModule === module && module === 'Subscriptions') {
                    setActiveSubscriptionDetail(null);
                  } else {
                    setActiveModule(module);
                  }
                  if (module !== 'Quotations') {
                    setActiveQuotationDetail(null);
                  }
                  if (module !== 'Approvals') {
                    setActiveApprovalDetail(null);
                  }
                  if (module !== 'Fulfillment') {
                    setActiveFulfillmentDetail(null);
                  }
                  if (module !== 'Invoices') {
                    setActiveInvoiceDetail(null);
                  }
                  if (module !== 'Subscriptions') {
                    setActiveSubscriptionDetail(null);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer ${
                  activeModule === module
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : (theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-medium')
                }`}
              >
                {module}
              </button>
            ))}
          </nav>

          {/* Right Section: User Profile, Theme Selector & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Active Real User Identity Badge */}
            {activeUser && (
              <div
                className={`hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs ${
                  theme === 'light'
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200'
                }`}
                title={`Logged in as ${activeUser.email}`}
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {(activeUser.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-none">
                  <p className="font-semibold text-[11px] truncate max-w-[120px]">{activeUser.name}</p>
                  <p className="text-[9px] text-slate-400 capitalize truncate max-w-[120px]">{activeUser.role}</p>
                </div>
              </div>
            )}
            {/* Theme Transition Menu Dropdown */}
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
                {theme === 'dark' ? (
                  <span className="text-blue-400 flex items-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  </span>
                ) : (
                  <span className="text-blue-600 flex items-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  </span>
                )}
                <span className="capitalize font-medium text-[11px] hidden md:inline">
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
                <svg className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isThemeMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Theme Dropdown Menu */}
              {isThemeMenuOpen && (
                <div className={`absolute right-0 top-full mt-2 w-48 rounded-2xl p-1.5 shadow-xl z-50 border backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 ${
                  theme === 'light'
                    ? 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
                    : 'bg-[#0f172a] border-slate-800 text-slate-200 shadow-black/80'
                }`}>
                  <div className="px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Theme Mode
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setTheme('light');
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                          : theme === 'light' ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800/70 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">☀️</span>
                        <div className="text-left">
                          <p className="leading-tight font-semibold">Light Theme</p>
                          <p className="text-[10px] text-slate-500">Corporate Clean</p>
                        </div>
                      </div>
                      {theme === 'light' && (
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setTheme('dark');
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-blue-950/40 text-blue-400 font-semibold border border-blue-800/50'
                          : theme === 'light' ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800/70 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">🌙</span>
                        <div className="text-left">
                          <p className="leading-tight font-semibold">Dark Theme</p>
                          <p className="text-[10px] text-slate-400">Executive Slate</p>
                        </div>
                      </div>
                      {theme === 'dark' && (
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Return to Home Page Link */}
            <Link
              to="/"
              className={`p-2 rounded-xl ${
                theme === 'light'
                  ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 border-slate-200'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700'
              } border transition-all flex items-center gap-1.5 cursor-pointer`}
              title="Return to Home Page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span className="text-xs font-semibold hidden md:inline">Home</span>
            </Link>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className={`p-2 rounded-xl ${
                theme === 'light'
                  ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border-transparent hover:border-rose-500/20'
              } border transition-all cursor-pointer flex items-center gap-1.5`}
              title="Sign Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span className="text-xs font-semibold hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>
  );
};

export default DashboardHeader;
