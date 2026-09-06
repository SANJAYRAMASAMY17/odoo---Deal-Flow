import { formatINR, formatINRLakhCrore } from '../../utils/formatters.js';

const CustomerPortalSection = (props) => {
  const {
    quotations,
    approvals,
    activities,
    openQuotationDetail,
    setActiveModule,
    openApprovalDetailView,
    theme,
    pendingCount,
    returnedCount,
    approvedCount,
    openQuotationsCount,
    atRiskDealsCount,
    totalPipelineValue,
    activeQuotationDetail,
    setActiveQuotationDetail,
    quotationViewMode,
    setQuotationViewMode,
    openNewQuotationModal,
    kanbanStages,
    handleSaveQuotationChanges,
    handleApproveQuotation,
    handleReturnQuotation,
    handleSubmitForApproval,
    selectedApprovalDetail,
    setSelectedApprovalDetail,
    activeApprovalDetail,
    setActiveApprovalDetail,
    approvalFilter,
    setApprovalFilter,
    filteredApprovals,
    openApprovalDetailModal,
    handleApproveAction,
    handleReturnAction,
    warehouseStock,
    setWarehouseStock,
    fulfillmentOrders,
    setFulfillmentOrders,
    selectedFulfillmentOrder,
    setSelectedFulfillmentOrder,
    activeFulfillmentDetail,
    setActiveFulfillmentDetail,
    selectedWarehouseHub,
    setSelectedWarehouseHub,
    openFulfillmentDetail,
    handleDispatchOrder,
    subscriptions,
    setSubscriptions,
    subscriptionFilter,
    setSubscriptionFilter,
    selectedSubscriptionDetail,
    setSelectedSubscriptionDetail,
    activeSubscriptionDetail,
    setActiveSubscriptionDetail,
    isNewPlanModalOpen,
    setIsNewPlanModalOpen,
    newPlanForm,
    setNewPlanForm,
    handleCreateNewPlan,
    openSubscriptionDetail,
    handlePauseSubscription,
    handleResumeSubscription,
    handleCancelSubscription,
    activeSubCount,
    pausedSubCount,
    cancelledSubCount,
    filteredSubscriptions,
    invoices,
    setInvoices,
    invoiceFilter,
    setInvoiceFilter,
    selectedInvoiceDetail,
    setSelectedInvoiceDetail,
    activeInvoiceDetail,
    setActiveInvoiceDetail,
    openInvoiceDetail,
    handleMarkInvoicePaid,
    filteredInvoices,
    unpaidCount,
    paidCount,
    reconciledCount,
    totalUnpaidAmount,
    totalPaidAmount,
    dealHealthData,
    exportAuditReport,
    auditLogs,
    products,
    setProducts,
    selectedProductDetail,
    setSelectedProductDetail,
    productSearchQuery,
    setProductSearchQuery,
    productCategoryFilter,
    setProductCategoryFilter,
    filteredProducts,
    openProductDetail,
    handleSaveProductChanges,
    discountTiers,
    setDiscountTiers,
    approvalRules,
    setApprovalRules,
    handleUpdateTierLimit,
    customerPortalTab,
    setCustomerPortalTab,
    customerPortalQuote,
    setCustomerPortalQuote,
    portalMessages,
    setPortalMessages,
    newPortalMessage,
    setNewPortalMessage,
    handleSendPortalMessage,
    handleCustomerApproveQuote,
    handleCustomerRequestChange,
    showNotification,
    portalStatus,
    portalComments,
    setPortalComments,
    counterDiscount,
    setCounterDiscount,
    requestedDeliveryDate,
    setRequestedDeliveryDate,
    handleSubmitCustomerRequest,
    handleConfirmCustomerQuotation,
  } = props;

  return (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Customer Portal Navigation Bar (matching Wireframe #11 header) */}
            <div className="glass-card rounded-3xl p-4 sm:p-5 border border-sky-500/30 bg-[#0f172a]/90 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/30 text-xs">
                    DF
                  </div>
                  <span className="font-extrabold text-lg text-white font-display tracking-tight">
                    DealFlow360
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    Client Portal
                  </span>
                </div>

                {/* 3 Portal Tabs: My Quotation | Messages | Profile */}
                <div className="flex items-center bg-slate-900/90 rounded-2xl p-1 border border-slate-800">
                  <button
                    onClick={() => setCustomerPortalTab('My Quotation')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      customerPortalTab === 'My Quotation'
                        ? 'bg-slate-950 text-white shadow-md border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    My Quotation
                  </button>
                  <button
                    onClick={() => setCustomerPortalTab('Messages')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      customerPortalTab === 'Messages'
                        ? 'bg-slate-950 text-white shadow-md border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Messages</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  </button>
                  <button
                    onClick={() => setCustomerPortalTab('Profile')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      customerPortalTab === 'Profile'
                        ? 'bg-slate-950 text-white shadow-md border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Profile
                  </button>
                </div>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveModule('Quotations')}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                >
                  ← Switch to Sales Rep View
                </button>
              </div>
            </div>

            {/* TAB 1: MY QUOTATION (WIREFRAME #11) */}
            {customerPortalTab === 'My Quotation' && (
              <div className="space-y-6">
                {/* Header & Status Pill */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white font-mono font-bold flex items-center justify-center text-sm">
                      11
                    </span>
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
                        Customer Portal Negotiation
                      </h1>
                      <p className="mt-1 text-sm text-slate-400">
                        Customer reviews and negotiates the quote directly, no email needed
                      </p>
                    </div>
                  </div>

                  {/* Wireframe #11 Status Pill (Orange / Amber) */}
                  <div className="pt-1">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold border ${
                      portalStatus === 'Confirmed'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : portalStatus.includes('Screen 6')
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        portalStatus === 'Confirmed' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                      }`} />
                      <span>Status: {portalStatus}</span>
                    </span>
                  </div>
                </div>

                {/* Quotation Header Details Card */}
                <div className="glass-card rounded-2xl p-5 border border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans uppercase">Customer Entity</span>
                    <span className="text-white font-bold text-sm font-sans">Acme Corp India Pvt. Ltd.</span>
                    <span className="text-slate-500 block text-[10px]">Bengaluru, Karnataka (GSTIN 29AABCA1234F1Z5)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans uppercase">Quotation Number</span>
                    <span className="text-amber-400 font-bold text-sm">Q-1042</span>
                    <span className="text-slate-500 block text-[10px]">Standard Price Book 2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans uppercase">Assigned Rep</span>
                    <span className="text-white font-bold text-sm font-sans">Arjun Mehta</span>
                    <span className="text-slate-500 block text-[10px]">VP Procurement Contact: Sarah Chen</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans uppercase">Commercial Base</span>
                    <span className="text-emerald-400 font-bold text-sm">₹12,40,000 + 18% GST</span>
                    <span className="text-slate-400 block text-[10px]">Total: ₹14,63,200</span>
                  </div>
                </div>

                {/* Negotiation Table (matching Wireframe #11) */}
                <div className="glass-card rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-4 px-6">Line</th>
                          <th className="py-4 px-4 font-mono">Qty & Base Price</th>
                          <th className="py-4 px-4 text-center font-mono">Current Disc. (Limit)</th>
                          <th className="py-4 px-6">Customer Comment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {/* Row 1: Extended Warranty */}
                        <tr className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-white text-sm">Extended Warranty</div>
                            <div className="text-[11px] text-slate-400 font-mono">SKU-WAR-EXT • 2-Year Comprehensive</div>
                          </td>
                          <td className="py-4 px-4 font-mono">
                            <div className="text-white font-bold">1 × ₹18,000</div>
                            <div className="text-[10px] text-slate-400">HSN 9987 (18% GST)</div>
                          </td>
                          <td className="py-4 px-4 text-center font-mono">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              10% <span className="text-slate-500">(Limit: 15%)</span>
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={portalComments['Extended Warranty']}
                                onChange={(e) =>
                                  setPortalComments({ ...portalComments, 'Extended Warranty': e.target.value })
                                }
                                className="w-full bg-slate-900 border border-slate-700 hover:border-amber-400/60 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white font-medium text-xs focus:outline-none transition-all"
                                placeholder="Enter feedback on this line..."
                              />
                            </div>
                          </td>
                        </tr>

                        {/* Row 2: Onsite Setup */}
                        <tr className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-white text-sm">Onsite Setup</div>
                            <div className="text-[11px] text-slate-400 font-mono">SKU-SVC-ONSITE • Implementation Engineer</div>
                          </td>
                          <td className="py-4 px-4 font-mono">
                            <div className="text-white font-bold">1 × ₹45,000</div>
                            <div className="text-[10px] text-slate-400">SAC 9987 (18% GST)</div>
                          </td>
                          <td className="py-4 px-4 text-center font-mono">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
                              18% <span className="text-amber-400/70">(Limit: 10% - Flagged)</span>
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={portalComments['Onsite Setup Service']}
                                onChange={(e) =>
                                  setPortalComments({ ...portalComments, 'Onsite Setup Service': e.target.value })
                                }
                                className="w-full bg-slate-900 border border-slate-700 hover:border-amber-400/60 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white font-medium text-xs focus:outline-none transition-all"
                                placeholder="Enter feedback on this line..."
                              />
                            </div>
                          </td>
                        </tr>

                        {/* Row 3: Laptop Pro 14 */}
                        <tr className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-white text-sm">Laptop Pro 14</div>
                            <div className="text-[11px] text-slate-400 font-mono">SKU-LAP-14 • Core i7 32GB 1TB SSD</div>
                          </td>
                          <td className="py-4 px-4 font-mono">
                            <div className="text-white font-bold">2 × ₹1,20,000</div>
                            <div className="text-[10px] text-slate-400">Total ₹2,40,000</div>
                          </td>
                          <td className="py-4 px-4 text-center font-mono">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              12% <span className="text-slate-500">(Limit: 15%)</span>
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={portalComments['Laptop Pro 14']}
                                onChange={(e) =>
                                  setPortalComments({ ...portalComments, 'Laptop Pro 14': e.target.value })
                                }
                                className="w-full bg-slate-900 border border-slate-700 hover:border-amber-400/60 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white font-medium text-xs focus:outline-none transition-all"
                                placeholder="Enter feedback on this line..."
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Counter Discount % and Requested Delivery Date Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl p-5 border border-slate-700/80 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Counter Discount %
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={counterDiscount}
                          onChange={(e) => setCounterDiscount(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-white font-mono text-lg font-bold outline-none"
                          placeholder="e.g. 15"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-sm">
                          %
                        </span>
                      </div>
                      <div className="text-right text-xs font-mono text-slate-400 shrink-0">
                        <div>Current Quote: <span className="text-white font-bold">10%</span></div>
                        <div>Delta Request: <span className="text-amber-400 font-bold">+{counterDiscount - 10}%</span></div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Proposed discount for Extended Warranty line. Standard price book limit is 10%.
                    </p>
                  </div>

                  <div className="glass-card rounded-2xl p-5 border border-slate-700/80 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Requested Delivery Date
                    </label>
                    <input
                      type="text"
                      value={requestedDeliveryDate}
                      onChange={(e) => setRequestedDeliveryDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-white font-medium text-sm outline-none"
                      placeholder="e.g. 2026-10-15 or Next Month"
                    />
                    <p className="text-[11px] text-slate-400">
                      Requested dispatch schedule. Pushes hardware delivery and onsite engineer setup to mid-October 2026.
                    </p>
                  </div>
                </div>

                {/* Actions: Submit Request & Confirm Quotation */}
                <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2">
                  <button
                    onClick={handleSubmitCustomerRequest}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-2xl font-bold text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Submit Request</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={handleConfirmCustomerQuotation}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>✓ Confirm Quotation</span>
                  </button>
                </div>

                {/* Callout Notice Box: Threshold Engine (Yellow/Gold Outlined) */}
                <div className="rounded-2xl p-5 bg-amber-500/10 border-2 border-amber-500/60 shadow-xl space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-amber-300">
                        If final terms exceed thresholds, the quote automatically re-enters approval (Screen 6).
                      </h4>
                      <p className="text-xs text-amber-200/90 leading-relaxed">
                        {counterDiscount > 10 ? (
                          <>
                            Your requested counter discount of <strong>{counterDiscount}%</strong> exceeds the standard sales threshold of <strong>10%</strong>. Submitting this request will automatically update Quotation Q-1042 status to <em>Pending Approval</em> and route to <strong>M. Shah (Sales Manager)</strong> in <strong>Screen 6: Dedicated Approval Detail</strong>.
                          </>
                        ) : (
                          <>
                            Counter discount is within standard limits. If final terms stay within allowable price book thresholds, the quotation can be confirmed directly without executive re-approval.
                          </>
                        )}
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            const matchedApp = approvals.find((a) => a.quotationId === 'Q-1042') || approvals[0];
                            openApprovalDetailView(matchedApp);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                        >
                          <span>Open in Screen 6: Approval Detail View</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MESSAGES */}
            {customerPortalTab === 'Messages' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-white">Direct Negotiation Chat Thread</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Live dialogue between Acme Corp (Sarah Chen) and DealFlow360 Sales Rep (Arjun Mehta)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    🟢 Connected
                  </span>
                </div>

                {/* Message List */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {portalMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isCustomer ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-300">{msg.sender}</span>
                        <span className="text-[10px] text-slate-500">{msg.time}</span>
                      </div>
                      <div
                        className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
                          msg.isCustomer
                            ? 'bg-amber-500/20 text-white border border-amber-500/30 rounded-tr-none'
                            : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Send Message Form */}
                <form onSubmit={handleSendPortalMessage} className="flex gap-3 pt-4 border-t border-slate-800">
                  <input
                    type="text"
                    value={newPortalMessage}
                    onChange={(e) => setNewPortalMessage(e.target.value)}
                    placeholder="Type a negotiation comment or message to Arjun Mehta..."
                    className="flex-1 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white text-xs outline-none"
                  />
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: PROFILE */}
            {customerPortalTab === 'Profile' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold font-display text-white">Enterprise Customer Profile</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authorized corporate entity, GST verification, and billing defaults
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                      Organization Information
                    </span>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Legal Entity</span>
                      <span className="text-white font-bold text-sm">Acme Corp India Private Limited</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">GST Identification Number (GSTIN)</span>
                      <span className="text-emerald-400 font-mono font-bold">29AABCA1234F1Z5</span>
                      <span className="text-[10px] text-slate-500 block">State: Karnataka (Code 29) • Active Taxpayer</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Registered Address</span>
                      <span className="text-slate-300">
                        Prestige Tech Cloud, Building 4, Phase 1, Whitefield, Bengaluru, Karnataka - 560066
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
                      Commercial Terms & Governance
                    </span>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Primary Procurement Lead</span>
                      <span className="text-white font-bold text-sm">Sarah Chen (VP Procurement)</span>
                      <span className="text-slate-500 text-[11px] block">sarah.c@acme.com • +91 80 4122 8900</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Commercial Payment Terms</span>
                      <span className="text-amber-300 font-bold">Net-30 Days from Delivery Invoice</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Assigned DealFlow360 Account Exec</span>
                      <span className="text-white font-bold">Arjun Mehta (Enterprise Sales - South)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
  );
};

export default CustomerPortalSection;
