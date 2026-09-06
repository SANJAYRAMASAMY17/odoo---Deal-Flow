import { formatINR, formatINRLakhCrore } from '../../utils/formatters.js';

const QuotationsSection = (props) => {
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
    updateLineItem,
    deleteLineItem,
    addUpsellItem,
    handleSaveDraft,
  } = props;

  return (
          <div>
            {activeQuotationDetail ? (
              /* WIREFRAME #4 VIEW */
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <button
                      onClick={() => setActiveQuotationDetail(null)}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium mb-2 cursor-pointer"
                    >
                      <span>←</span>
                      <span>Back to Quotations List</span>
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                      Quotation Detail: {activeQuotationDetail.id} ({activeQuotationDetail.client})
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-400">
                      Opened by clicking a row on the Quotations list. Add products, apply discounts, review upsells.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveModule('Customer Portal');
                        setCustomerPortalTab('My Quotation');
                      }}
                      className="py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="View from customer perspective (Wireframe #11)"
                    >
                      <span>🌐 Open Customer Portal (Screen 11)</span>
                      <span>→</span>
                    </button>
                    <span className="text-xs text-slate-400">Current Stage:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      activeQuotationDetail.stage === 'Pending Approval' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                      activeQuotationDetail.stage === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                      activeQuotationDetail.stage === 'Confirmed' ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' :
                      'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {activeQuotationDetail.stage}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Customer
                    </label>
                    <input
                      type="text"
                      value={activeQuotationDetail.client}
                      onChange={(e) => setActiveQuotationDetail({ ...activeQuotationDetail, client: e.target.value })}
                      className="w-full py-3 px-4 rounded-xl glass-input text-sm text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Price List
                    </label>
                    <select
                      value={activeQuotationDetail.priceList || 'Standard Indian Enterprise Tier 2026 (INR)'}
                      onChange={(e) => setActiveQuotationDetail({ ...activeQuotationDetail, priceList: e.target.value })}
                      className="w-full py-3 px-4 rounded-xl glass-input text-sm text-white outline-none bg-slate-900 cursor-pointer"
                    >
                      <option value="Standard Indian Enterprise Tier 2026 (INR)">Standard Indian Enterprise Tier 2026 (INR)</option>
                      <option value="Commercial Direct (INR)">Commercial Direct (INR)</option>
                      <option value="Manufacturing Wholesale Tier 1">Manufacturing Wholesale Tier 1</option>
                      <option value="Retail POS Package 2026">Retail POS Package 2026</option>
                      <option value="HPC Dedicated Cluster">HPC Dedicated Cluster</option>
                    </select>
                  </div>
                </div>

                {/* Line Item Table */}
                <div className="glass-card rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-3.5 px-6">Product</th>
                          <th className="py-3.5 px-4 text-center">Qty</th>
                          <th className="py-3.5 px-6">Price</th>
                          <th className="py-3.5 px-6">Discount</th>
                          <th className="py-3.5 px-4 text-center">Limit</th>
                          <th className="py-3.5 px-6 text-center">Status</th>
                          <th className="py-3.5 px-4 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70 font-sans">
                        {activeQuotationDetail.lineItems && activeQuotationDetail.lineItems.map((item) => {
                          const discountNum = parseFloat(item.discount) || 0;
                          const limitNum = parseFloat(item.limit) || 0;
                          const isOverLimit = discountNum > limitNum;
                          const excessPts = (discountNum - limitNum).toFixed(0);

                          return (
                            <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                              <td className="py-4 px-6 font-semibold text-white">{item.product}</td>
                              <td className="py-4 px-4 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.qty}
                                  onChange={(e) => updateLineItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                                  className="w-14 py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-700 text-center text-xs text-white outline-none"
                                />
                              </td>
                              <td className="py-4 px-6 font-mono font-bold text-white">{formatINR(item.price)}</td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={item.discount}
                                    onChange={(e) => updateLineItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                    className={`w-16 py-1.5 px-2 rounded-lg font-mono text-center text-xs outline-none ${
                                      isOverLimit 
                                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/50' 
                                        : 'bg-slate-900 text-white border border-slate-700'
                                    }`}
                                  />
                                  <span className="text-xs text-slate-400">%</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center font-mono text-xs text-slate-400">{item.limit}%</td>
                              <td className="py-4 px-6 text-center">
                                {isOverLimit ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse">
                                    OVER (+{excessPts}pt)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    OK
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => deleteLineItem(item.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  title="Delete Line"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Live discount banner */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-medium flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <span>
                    <strong>Discount is checked against each line's own limit live,</strong> as soon as it is entered, not only at submit time. Lines flagged <span className="font-bold text-amber-300">OVER (+pt)</span> require VP / Finance sign-off upon submission.
                  </span>
                </div>

                {/* Upsell Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-display text-white">Upsell and Cross-Sell Suggestions</h3>
                    <span className="text-xs text-slate-400">Click any card to add to quote</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      onClick={() => addUpsellItem('Ergonomic Wireless Mouse', 1800, 0, 15)}
                      className="group glass-card glass-card-hover rounded-2xl p-4 border border-slate-700/80 cursor-pointer flex flex-col justify-between space-y-2 transform hover:-translate-y-1 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white group-hover:text-amber-300">+ Wireless Mouse</span>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Margin +₹1,800</span>
                      </div>
                      <p className="text-xs text-slate-400">Precision ergonomic peripheral for enterprise workstations.</p>
                      <div className="pt-2 text-[11px] text-amber-400 font-semibold group-hover:underline">+ Add to Quotation →</div>
                    </div>

                    <div
                      onClick={() => addUpsellItem('Thunderbolt Universal Docking Station', 18500, 12, 15)}
                      className="group glass-card glass-card-hover rounded-2xl p-4 border border-slate-700/80 cursor-pointer flex flex-col justify-between space-y-2 transform hover:-translate-y-1 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white group-hover:text-amber-300">+ Docking Station</span>
                        <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">Promo: 12% off</span>
                      </div>
                      <p className="text-xs text-slate-400">Dual 4K display output & 100W Power Delivery hub.</p>
                      <div className="pt-2 text-[11px] text-amber-400 font-semibold group-hover:underline">+ Add to Quotation →</div>
                    </div>

                    <div
                      onClick={() => addUpsellItem('Enterprise Extended Care Plan (2 Year)', 45000, 5, 10)}
                      className="group glass-card glass-card-hover rounded-2xl p-4 border border-slate-700/80 cursor-pointer flex flex-col justify-between space-y-2 transform hover:-translate-y-1 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white group-hover:text-amber-300">+ Care Plan 2yr</span>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Margin +₹4,500</span>
                      </div>
                      <p className="text-xs text-slate-400">Priority replacement warranty & on-site technician coverage.</p>
                      <div className="pt-2 text-[11px] text-amber-400 font-semibold group-hover:underline">+ Add to Quotation →</div>
                    </div>
                  </div>
                </div>

                {/* Summary & Buttons */}
                <div className="glass-card rounded-2xl p-6 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 font-mono text-xs w-full md:w-auto">
                    <div className="text-slate-400">Taxable Subtotal: <span className="text-white font-bold">{formatINR(activeQuotationDetail.amount)}</span></div>
                    <div className="text-slate-400">GST (18%): <span className="text-amber-300 font-bold">{formatINR(activeQuotationDetail.amount * 0.18)}</span></div>
                    <div className="text-sm text-white font-extrabold pt-1 border-t border-slate-800">Commercial Total: <span className="text-emerald-400 text-lg">{formatINR(activeQuotationDetail.amount * 1.18)}</span></div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button
                      onClick={handleSaveDraft}
                      className="py-3 px-6 rounded-xl font-semibold text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-md transition-all cursor-pointer"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={handleSubmitForApproval}
                      className="py-3 px-7 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer"
                    >
                      Submit for Approval
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* WIREFRAME #3 KANBAN LIST VIEW */
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">
                      Quotations (List)
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                      Every quotation in the system, one row per quotation, click a row to open it
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openQuotationDetail(quotations[0])}
                      className="py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Open Q-1042 Detail</span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => setQuotationViewMode(quotationViewMode === 'board' ? 'table' : 'board')}
                      className="py-2.5 px-4 rounded-xl font-medium text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {quotationViewMode === 'board' ? 'Switch to Table View' : 'Switch to Board View'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {kanbanStages.map((stageName) => {
                    const stageQuotes = quotations.filter((q) => q.stage === stageName);
                    const stageTotal = stageQuotes.reduce((acc, q) => acc + q.amount, 0);

                    return (
                      <div
                        key={stageName}
                        className="glass-card rounded-2xl p-4 border border-slate-700/70 flex flex-col min-h-[480px] bg-slate-900/40"
                      >
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              stageName === 'Draft' ? 'bg-slate-400' :
                              stageName === 'Pending Approval' ? 'bg-amber-400' :
                              stageName === 'Approved' ? 'bg-emerald-400' :
                              stageName === 'Negotiation' ? 'bg-indigo-400' : 'bg-sky-400'
                            }`} />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{stageName}</h3>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                            {stageQuotes.length}
                          </span>
                        </div>

                        <div className="flex-1 space-y-3">
                          {stageQuotes.map((quote) => (
                            <div
                              key={quote.id}
                              onClick={() => openQuotationDetail(quote)}
                              className="p-3.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 shadow-md transition-all cursor-pointer group transform hover:-translate-y-0.5"
                            >
                              <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                                <span className="group-hover:text-amber-300 transition-colors">{quote.client}</span>
                                <span className="font-mono text-amber-400 font-extrabold">{formatINR(quote.amount)}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">{quote.title}</p>
                              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-700/50">
                                <span>{quote.id}</span>
                                <span className="group-hover:text-amber-400 flex items-center gap-0.5 transition-colors">
                                  <span>Click to open</span>
                                  <span>→</span>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-800/80 text-right">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Stage Volume</span>
                          <span className="text-xs font-bold text-slate-300 font-mono">{formatINRLakhCrore(stageTotal)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
  );
};

export default QuotationsSection;
