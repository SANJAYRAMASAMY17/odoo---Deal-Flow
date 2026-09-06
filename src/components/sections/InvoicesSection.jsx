import { formatINR, formatINRLakhCrore } from '../../utils/formatters.js';

const InvoicesSection = (props) => {
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
    handleRecordDetailPayment,
    openInvoiceDetailView,
  } = props;

  return (
          activeInvoiceDetail ? (
            /* =====================================================================
               WIREFRAME #13: INVOICE DETAIL DEDICATED VIEW
               ===================================================================== */
            <div className="space-y-6 animate-fadeIn">
              {/* Back to Invoices List Breadcrumb */}
              <div>
                <button
                  onClick={() => setActiveInvoiceDetail(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium mb-2 cursor-pointer"
                >
                  <span>←</span>
                  <span>Back to Invoices List</span>
                </button>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white font-mono font-bold flex items-center justify-center text-sm">
                      13
                    </span>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                        Invoice Detail: {activeInvoiceDetail.id} ({activeInvoiceDetail.customer})
                      </h1>
                      <p className="mt-1 text-xs sm:text-sm text-slate-400">
                        Opened by clicking a row on the Invoices list
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        activeInvoiceDetail.status === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {activeInvoiceDetail.status === 'Paid' ? 'Paid & Settled' : 'Unpaid'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Due: {activeInvoiceDetail.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order-to-Cash Pipeline Stepper matching Wireframe #13 */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto py-2">
                  {/* Connector Line Background */}
                  <div className="hidden md:block absolute top-1/2 left-10 right-10 -translate-y-4 h-0.5 bg-slate-800 z-0" />

                  {/* Step 1: Order Confirmed (Green) */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/30 text-lg border-2 border-emerald-400">
                      ✓
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Order Confirmed</span>
                      <span className="text-[10px] text-slate-400 font-mono">Q-1042 Signed</span>
                    </div>
                  </div>

                  {/* Step 2: Shipped (Green) */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/30 text-lg border-2 border-emerald-400">
                      ✓
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Shipped</span>
                      <span className="text-[10px] text-slate-400 font-mono">EWB-991204842</span>
                    </div>
                  </div>

                  {/* Step 3: Invoiced (Blue Active Node) */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center shadow-lg shadow-sky-500/40 text-lg border-4 border-sky-400/30 animate-pulse">
                      📄
                    </div>
                    <div>
                      <span className="text-xs font-bold text-sky-400 block">Invoiced</span>
                      <span className="text-[10px] text-slate-300 font-mono">{activeInvoiceDetail.id} Issued</span>
                    </div>
                  </div>

                  {/* Step 4: Paid (Pending Grey or Settled Green) */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-12 h-12 rounded-full font-bold flex items-center justify-center text-lg transition-all ${
                        activeInvoiceDetail.status === 'Paid'
                          ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 border-2 border-emerald-400'
                          : 'bg-slate-800 text-slate-500 border-2 border-slate-700'
                      }`}
                    >
                      {activeInvoiceDetail.status === 'Paid' ? '✓' : '💳'}
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold block ${
                          activeInvoiceDetail.status === 'Paid' ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        Paid
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {activeInvoiceDetail.status === 'Paid'
                          ? activeInvoiceDetail.utr || 'Bank Settled'
                          : 'Due: ' + activeInvoiceDetail.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoices Reconciliation Table matching Wireframe #13 */}
              <div className="glass-card rounded-3xl border border-slate-700/60 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-5">Invoice #</th>
                        <th className="py-3.5 px-5 font-mono">Amount</th>
                        <th className="py-3.5 px-5">Status</th>
                        <th className="py-3.5 px-5 font-mono">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                      {/* Row 1: Wireframe Main Invoice */}
                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-mono font-bold text-amber-400 text-sm">
                            {activeInvoiceDetail.id}
                          </div>
                          <div className="text-[11px] text-slate-400 font-sans">
                            {activeInvoiceDetail.type || 'One-Time Originating Lines (Laptop Pro 14 + Setup)'}
                          </div>
                        </td>
                        <td className="py-4 px-5 font-mono">
                          <div className="font-extrabold text-white text-sm">
                            {activeInvoiceDetail.amountUSD}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {formatINR(activeInvoiceDetail.amountINR)}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                              activeInvoiceDetail.status === 'Paid'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                activeInvoiceDetail.status === 'Paid'
                                  ? 'bg-emerald-400'
                                  : 'bg-rose-400 animate-pulse'
                              }`}
                            />
                            <span>{activeInvoiceDetail.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-5 font-mono text-slate-300 font-medium">
                          {activeInvoiceDetail.dueDate}
                        </td>
                      </tr>

                      {/* Row 2: Wireframe Recurring Invoice */}
                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-mono font-bold text-sky-400 text-sm">
                            INV-1043 (Recurring)
                          </div>
                          <div className="text-[11px] text-slate-400 font-sans">
                            Recurring Line (Care Plan 2yr Monthly Retainer)
                          </div>
                        </td>
                        <td className="py-4 px-5 font-mono">
                          <div className="font-extrabold text-white text-sm">$45</div>
                          <div className="text-slate-400 text-[11px]">{formatINR(3735)}</div>
                        </td>
                        <td className="py-4 px-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Paid</span>
                          </span>
                        </td>
                        <td className="py-4 px-5 font-mono text-slate-300 font-medium">
                          Sep 15
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons matching Wireframe #13 */}
              <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-1">
                {activeInvoiceDetail.status === 'Unpaid' ? (
                  <button
                    onClick={handleRecordDetailPayment}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>✓ Record Payment</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full sm:w-auto py-3.5 px-8 rounded-2xl font-bold text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2 cursor-default"
                  >
                    <span>✓ Payment Fully Recorded & Reconciled</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    showNotification(
                      `Downloading consolidated Order & Delivery Reconciliation Summary for ${activeInvoiceDetail.id}...`
                    )
                  }
                  className="w-full sm:w-auto py-3.5 px-8 rounded-2xl font-bold text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Download Summary</span>
                </button>
              </div>

              {/* Callout Notice Box: Partial Invoicing Reconciliation (Yellow/Gold Outlined) matching Wireframe #13 */}
              <div className="rounded-2xl p-5 bg-amber-500/10 border-2 border-amber-500/60 shadow-xl space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚡</span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-300">
                      Partial invoicing stays reconciled with partial delivery, nothing is billed before it ships.
                    </h4>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      DealFlow360's matching engine automatically binds each tax invoice line directly to its verified dispatch E-Way Bill ({activeInvoiceDetail.deliveryStatus ? 'EWB-991204842' : 'Active SLA'}) and Goods Receipt Note ({activeInvoiceDetail.grnNumber || 'GRN-BLR-2026-881'}). If an order ships in multiple partial splits, billing splits automatically in lockstep.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery & Dispatch Reconciliation Summary Card */}
              <div className="glass-card rounded-2xl p-5 border border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[11px] font-sans uppercase">Fulfillment Depot</span>
                  <span className="text-white font-bold text-sm font-sans">Bengaluru Whitefield Depot</span>
                  <span className="text-slate-500 block text-[10px]">South Region Logistics</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-sans uppercase">E-Way Bill Number</span>
                  <span className="text-amber-400 font-bold text-sm">EWB-991204842</span>
                  <span className="text-slate-500 block text-[10px]">GST Portal Verified</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-sans uppercase">Goods Receipt Note</span>
                  <span className="text-sky-400 font-bold text-sm">GRN-BLR-2026-881</span>
                  <span className="text-slate-500 block text-[10px]">Proof of Delivery Signed</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-sans uppercase">Client Sign-Off</span>
                  <span className="text-emerald-400 font-bold text-sm font-sans">Sarah Chen (Procurement)</span>
                  <span className="text-slate-500 block text-[10px]">Acme Corp India Pvt. Ltd.</span>
                </div>
              </div>
            </div>
          ) : (
            /* =====================================================================
               WIREFRAME #12: INVOICES (LIST) VIEW
               ===================================================================== */
            <div className="space-y-6 animate-fadeIn">
              {/* Header & Subtitle matching Wireframe #12 */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white font-mono font-bold flex items-center justify-center text-sm">
                    12
                  </span>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
                      Invoices (List)
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                      Every invoice generated from one-time and recurring orders
                    </p>
                  </div>
                </div>

                {/* Outstanding Receivables summary */}
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-center gap-2.5 text-xs shadow-md">
                    <span className="text-slate-400 font-medium">Pending Receivables:</span>
                    <span className="font-mono font-bold text-rose-400">
                      {formatINRLakhCrore(
                        invoices
                          .filter((inv) => inv.status === 'Unpaid')
                          .reduce((acc, inv) => acc + inv.amountINR, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Metric Filter Pills matching Wireframe #12 */}
              <div className="flex flex-wrap items-center gap-3">
                {/* 4 Unpaid (Pink/Rose) */}
                <button
                  onClick={() => setInvoiceFilter(invoiceFilter === 'Unpaid' ? 'ALL' : 'Unpaid')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                    invoiceFilter === 'Unpaid'
                      ? 'bg-rose-500 text-white ring-2 ring-rose-400 ring-offset-2 ring-offset-slate-900 shadow-rose-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      invoiceFilter === 'Unpaid' ? 'bg-white' : 'bg-rose-400'
                    }`}
                  />
                  <span>{invoices.filter((inv) => inv.status === 'Unpaid').length} Unpaid</span>
                </button>

                {/* 21 Paid (Green/Emerald) */}
                <button
                  onClick={() => setInvoiceFilter(invoiceFilter === 'Paid' ? 'ALL' : 'Paid')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                    invoiceFilter === 'Paid'
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 shadow-emerald-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      invoiceFilter === 'Paid' ? 'bg-slate-950' : 'bg-emerald-400'
                    }`}
                  />
                  <span>{invoices.filter((inv) => inv.status === 'Paid').length} Paid</span>
                </button>

                {invoiceFilter !== 'ALL' && (
                  <button
                    onClick={() => setInvoiceFilter('ALL')}
                    className="text-xs font-semibold text-slate-400 hover:text-white underline cursor-pointer ml-1"
                  >
                    Show All ({invoices.length})
                  </button>
                )}
              </div>

              {/* Five-Column Invoices Table matching Wireframe #12 */}
              <div className="glass-card rounded-3xl border border-slate-700/60 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-5">Invoice #</th>
                        <th className="py-3.5 px-5">Customer</th>
                        <th className="py-3.5 px-5 font-mono">Amount</th>
                        <th className="py-3.5 px-5">Status</th>
                        <th className="py-3.5 px-5 font-mono">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {invoices
                        .filter((inv) => (invoiceFilter === 'ALL' ? true : inv.status === invoiceFilter))
                        .map((inv) => (
                          <tr
                            key={inv.id}
                            onClick={() => openInvoiceDetailView(inv)}
                            className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                          >
                            {/* Invoice # */}
                            <td className="py-4 px-5">
                              <div className="font-mono font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1.5">
                                <span>{inv.id}</span>
                                <span className="text-slate-600 group-hover:text-amber-400 text-xs transition-colors">
                                  →
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {inv.orderId ? `Ref: ${inv.orderId}` : 'Commercial Order'}
                              </div>
                            </td>

                            {/* Customer */}
                            <td className="py-4 px-5">
                              <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                                {inv.customer}
                              </div>
                              <div className="text-xs text-slate-400">{inv.city || 'India'}</div>
                            </td>

                            {/* Amount */}
                            <td className="py-4 px-5 font-mono">
                              <div className="font-extrabold text-white text-base">
                                {inv.amountUSD}
                              </div>
                              <div className="text-xs text-slate-400">
                                {formatINR(inv.amountINR)}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                                  inv.status === 'Paid'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/10'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    inv.status === 'Paid'
                                      ? 'bg-emerald-400'
                                      : 'bg-rose-400 animate-pulse'
                                  }`}
                                />
                                <span>{inv.status}</span>
                              </span>
                            </td>

                            {/* Due Date */}
                            <td className="py-4 px-5 font-mono">
                              <div className="text-slate-200 font-semibold">{inv.dueDate}</div>
                              <div className="text-[11px] text-slate-500">
                                Issued: {inv.invoiceDate || 'Aug 2026'}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Interactive Callout Banner (Yellow/Gold Outlined) matching Wireframe #12 */}
              <div className="rounded-2xl p-4 sm:p-5 bg-amber-500/10 border-2 border-amber-500/60 shadow-xl flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <p className="text-xs sm:text-sm font-semibold text-amber-200 leading-relaxed">
                  Click an invoice row to open its full payment and delivery reconciliation detail.
                </p>
              </div>
            </div>
          )
  );
};

export default InvoicesSection;
