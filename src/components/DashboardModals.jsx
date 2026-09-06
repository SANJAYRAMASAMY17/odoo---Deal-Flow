/* eslint-disable no-unused-vars */
import { createPortal } from 'react-dom';
import { formatINR, formatINRLakhCrore } from '../utils/formatters.js';

const DashboardModals = (props) => {
  const {
    quotations,
    setQuotations,
    approvals,
    setApprovals,
    activities,
    setActivities,
    activeQuotationDetail,
    setActiveQuotationDetail,
    selectedApprovalDetail,
    setSelectedApprovalDetail,
    activeApprovalDetail,
    setActiveApprovalDetail,
    warehouseStock,
    setWarehouseStock,
    fulfillmentOrders,
    setFulfillmentOrders,
    selectedFulfillmentOrder,
    setSelectedFulfillmentOrder,
    activeFulfillmentDetail,
    setActiveFulfillmentDetail,
    subscriptions,
    setSubscriptions,
    selectedSubscriptionDetail,
    setSelectedSubscriptionDetail,
    activeSubscriptionDetail,
    setActiveSubscriptionDetail,
    isNewPlanModalOpen,
    setIsNewPlanModalOpen,
    newPlanForm,
    setNewPlanForm,
    isModifySubscriptionOpen,
    setIsModifySubscriptionOpen,
    invoices,
    setInvoices,
    selectedInvoiceDetail,
    setSelectedInvoiceDetail,
    activeInvoiceDetail,
    setActiveInvoiceDetail,
    products,
    setProducts,
    selectedProductDetail,
    setSelectedProductDetail,
    discountTiers,
    setDiscountTiers,
    approvalRules,
    setApprovalRules,
    isCreateQuotationModalOpen,
    setIsCreateQuotationModalOpen,
    newQuotationForm,
    setNewQuotationForm,
    isDispatchModalOpen,
    setIsDispatchModalOpen,
    dispatchForm,
    setDispatchForm,
    isManagePriceFieldsModalOpen,
    setIsManagePriceFieldsModalOpen,
    handleSaveQuotationChanges,
    handleApproveQuotation,
    handleReturnQuotation,
    handleSaveProductChanges,
    handleUpdateTierLimit,
    handleCreateQuotationSubmit,
    handleDispatchSubmit,
    handleApproveAction,
    handleReturnAction,
    handleMarkInvoicePaid,
    handleCreateNewPlan,
    showNotification,
    theme,
    openQuotationDetail,
    setActiveModule,
    handleConfirmFulfillmentSplit,
    handleTogglePauseSubscription,
    handleModifySubscription,
    modifyForm,
    setModifyForm,
    handleSendInvoiceReminder,
    inspectingAnomalyDeal,
    setInspectingAnomalyDeal,
    handleEscalateDeal,
    handleNudgeRep,
    selectedCatalogProduct,
    setSelectedCatalogProduct,
    isNewProductModalOpen,
    setIsNewProductModalOpen,
    handleCreateNewProduct,
    newProductForm,
    setNewProductForm,
  } = props;

  const modalContent = (
    <>

      {/* =========================================================================
          MODAL: APPROVAL DETAIL & AUDIT TRAIL (Wireframe #5 Row Inspector)
         ========================================================================= */}
      {selectedApprovalDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6 animate-float">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-white">{selectedApprovalDetail.quotationId}</span>
                  <span className="text-slate-500">•</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                      selectedApprovalDetail.blendedRisk === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : selectedApprovalDetail.blendedRisk === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {selectedApprovalDetail.blendedRisk} RISK
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    (Score: {selectedApprovalDetail.riskScore}/100)
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold font-display text-white">
                  {selectedApprovalDetail.customer} Approval Review
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Workflow Stage: <strong className="text-slate-200">{selectedApprovalDetail.stage}</strong> • Assignee: <strong className="text-amber-400">{selectedApprovalDetail.assignedTo}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedApprovalDetail(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Risk Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Blended Risk Factor Breakdown
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedApprovalDetail.factors && selectedApprovalDetail.factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Audit Trail */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Chronological Audit Trail
              </span>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3 font-mono text-xs">
                {selectedApprovalDetail.auditTrail && selectedApprovalDetail.auditTrail.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-3 border-l-2 border-slate-700 pl-3">
                    <div className="text-slate-500 shrink-0 w-28 text-[11px]">{entry.time}</div>
                    <div>
                      <span className="text-amber-400 font-semibold">{entry.user}: </span>
                      <span className="text-slate-300">{entry.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  const targetQuote = quotations.find((q) => q.id === selectedApprovalDetail.quotationId) || quotations[0];
                  setSelectedApprovalDetail(null);
                  openQuotationDetail(targetQuote);
                }}
                className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                Inspect Line Items on Q-1042 →
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleReturnQuotation(selectedApprovalDetail.id)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                >
                  ↩ Return with Comments
                </button>

                <button
                  onClick={() => handleApproveQuotation(selectedApprovalDetail.id)}
                  className="py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  ✓ Approve Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: WAREHOUSE SPLIT DETAIL (Wireframe #7 Order Inspector)
         ========================================================================= */}
      {selectedFulfillmentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6 animate-float">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-white">{selectedFulfillmentOrder.id}</span>
                  <span className="text-slate-500">•</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                      selectedFulfillmentOrder.status === 'Split Pending'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : selectedFulfillmentOrder.status === 'Backorder'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : selectedFulfillmentOrder.status === 'Ready to Ship'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    }`}
                  >
                    {selectedFulfillmentOrder.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({selectedFulfillmentOrder.warehouses})
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold font-display text-white">
                  {selectedFulfillmentOrder.customer} Warehouse Split Detail
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Delivery Destination: <strong className="text-slate-200">{selectedFulfillmentOrder.city}</strong> • GSTIN: <strong className="text-amber-400 font-mono">{selectedFulfillmentOrder.gstin}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedFulfillmentOrder(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Warehouse Allocation Breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Line-Item Depot Allocation Breakdown
              </span>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Item</th>
                      <th className="py-2.5 px-3 text-center">Order Qty</th>
                      <th className="py-2.5 px-3 text-center text-amber-300">Main Warehouse</th>
                      <th className="py-2.5 px-3 text-center text-sky-300">East Depot</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {selectedFulfillmentOrder.allocations && selectedFulfillmentOrder.allocations.map((alloc, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20">
                        <td className="py-3 px-4 font-semibold text-white">{alloc.product}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-200">{alloc.qty}</td>
                        <td className="py-3 px-3 text-center font-mono text-amber-300">{alloc.mainDepot} units</td>
                        <td className="py-3 px-3 text-center font-mono text-sky-300">{alloc.eastDepot} units</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {alloc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dispatch & Logistics Card */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>e-Way Bill Reference:</span>
                <span className="font-mono font-bold text-amber-400">{selectedFulfillmentOrder.ewayBill}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>National Freight Partner:</span>
                <span className="font-semibold text-slate-200">{selectedFulfillmentOrder.carrier}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                {selectedFulfillmentOrder.notes}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedFulfillmentOrder(null);
                  setActiveModule('Quotations');
                }}
                className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                View Commercial Quotation →
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedFulfillmentOrder(null)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => handleConfirmFulfillmentSplit(selectedFulfillmentOrder.id)}
                  className="py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  ✓ Confirm Split & Issue e-Way Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BILLING DETAIL & PRORATION HISTORY (WIREFRAME #9 ROW CLICK)
         ========================================================================= */}
      {selectedSubscriptionDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="glass-card max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    {selectedSubscriptionDetail.id}
                  </span>
                  {selectedSubscriptionDetail.orderId && (
                    <span className="text-xs font-mono text-slate-400">
                      Derived from {selectedSubscriptionDetail.orderId}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  {selectedSubscriptionDetail.customer}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedSubscriptionDetail.plan} • {selectedSubscriptionDetail.city} (GSTIN: {selectedSubscriptionDetail.gstin})
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedSubscriptionDetail.status === 'Active' && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    ● Active Plan
                  </span>
                )}
                {selectedSubscriptionDetail.status === 'Paused' && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    ⏸ Paused
                  </span>
                )}
                {selectedSubscriptionDetail.status === 'Cancelled' && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    ✕ Cancelled
                  </span>
                )}
                <button
                  onClick={() => setSelectedSubscriptionDetail(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Recurring Cost</span>
                <div className="font-mono font-bold text-white text-base mt-1">
                  {formatINR(selectedSubscriptionDetail.amount)}
                </div>
                <span className="text-[10px] text-slate-400">per {selectedSubscriptionDetail.cycle.toLowerCase()}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">18% GST (Tax)</span>
                <div className="font-mono font-bold text-amber-400 text-base mt-1">
                  {formatINR(Math.round(selectedSubscriptionDetail.amount * 0.18))}
                </div>
                <span className="text-[10px] text-slate-400">CGST 9% + SGST 9%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Next Invoice</span>
                <div className="font-mono font-bold text-slate-200 text-base mt-1">
                  {selectedSubscriptionDetail.nextBill}
                </div>
                <span className="text-[10px] text-slate-400">{selectedSubscriptionDetail.cycle} cycle</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Gross per Cycle</span>
                <div className="font-mono font-bold text-emerald-400 text-base mt-1">
                  {formatINR(Math.round(selectedSubscriptionDetail.amount * 1.18))}
                </div>
                <span className="text-[10px] text-slate-400">Tax inclusive</span>
              </div>
            </div>

            {/* Proration Engine Banner */}
            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs flex items-center gap-2.5">
              <span className="text-base">⚖️</span>
              <span>
                <strong>DealFlow360 Proration Engine:</strong> Any mid-month upgrades, seat additions, or temporary pauses automatically calculate daily pro-rata credits and adjust on the next GST invoice.
              </span>
            </div>

            {/* Proration & Lifecycle History Log */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>📜 Billing & Proration History Log</span>
                </h4>
                <span className="text-[11px] text-slate-400">Chronological audit</span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedSubscriptionDetail.prorationLog && selectedSubscriptionDetail.prorationLog.map((log, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-amber-400/90 font-semibold">{log.date}</span>
                        <span className="font-semibold text-white">{log.title}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{log.note}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-200 shrink-0 text-right">
                      {log.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedSubscriptionDetail.status === 'Active' && (
                  <button
                    onClick={() => handleTogglePauseSubscription(selectedSubscriptionDetail.id)}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>⏸</span>
                    <span>Pause Subscription</span>
                  </button>
                )}
                {selectedSubscriptionDetail.status === 'Paused' && (
                  <button
                    onClick={() => handleTogglePauseSubscription(selectedSubscriptionDetail.id)}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>▶</span>
                    <span>Resume Subscription</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    showNotification(`GST Proforma Tax Invoice generated for ${selectedSubscriptionDetail.customer}.`);
                  }}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>📄</span>
                  <span>Download Proforma Invoice</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedSubscriptionDetail(null)}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: + NEW PLAN (ADMIN) (WIREFRAME #9)
         ========================================================================= */}
      {isNewPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="glass-card max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  DealFlow360 Admin Mode
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-1">
                  Create Recurring Subscription Plan
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure recurring service plans, SLA retainers, or SaaS subscriptions with GST rules.
                </p>
              </div>
              <button
                onClick={() => setIsNewPlanModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewPlan} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer / Enterprise Client</label>
                <select
                  value={newPlanForm.customer}
                  onChange={(e) => {
                    const cust = e.target.value;
                    const matchedQuote = quotations.find((q) => q.client === cust);
                    setNewPlanForm({
                      ...newPlanForm,
                      customer: cust,
                      city: matchedQuote ? matchedQuote.city : 'Bengaluru, Karnataka',
                      gstin: matchedQuote ? matchedQuote.gstin : '29AABCX9988F1Z2',
                      orderId: matchedQuote ? matchedQuote.id : 'Q-1042',
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="Acme Corp">Acme Corp (Bengaluru, Karnataka)</option>
                  <option value="Beta Industries">Beta Industries (Pune, Maharashtra)</option>
                  <option value="Delta LLC">Delta LLC (Gurugram, Haryana)</option>
                  <option value="Nova Retail">Nova Retail (Mumbai, Maharashtra)</option>
                  <option value="Zenith Co">Zenith Co (Hyderabad, Telangana)</option>
                  <option value="Orion Ltd">Orion Ltd (Chennai, Tamil Nadu)</option>
                  <option value="Tata Digital">Tata Digital (Bengaluru, Karnataka)</option>
                  <option value="Mahindra Logistics">Mahindra Logistics (Mumbai, Maharashtra)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Plan / Solution Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Care Plan 2yr or Support SLA"
                    value={newPlanForm.plan}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, plan: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Billing Cycle</label>
                  <select
                    value={newPlanForm.cycle}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, cycle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Recurring Amount (₹ INR, Tax Exclusive)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    placeholder="e.g. 85000"
                    value={newPlanForm.amount}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, amount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Next Billing Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sep 15 or Nov 1"
                    value={newPlanForm.nextBill}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, nextBill: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Tax preview */}
              {newPlanForm.amount && Number(newPlanForm.amount) > 0 && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Taxable Value:</span>
                    <span className="text-slate-200 font-bold">{formatINR(newPlanForm.amount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>GST (18% IGST / CGST+SGST):</span>
                    <span className="text-amber-400 font-bold">{formatINR(Math.round(newPlanForm.amount * 0.18))}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold border-t border-slate-800 pt-1">
                    <span>Total Billing per {newPlanForm.cycle}:</span>
                    <span className="text-emerald-400">{formatINR(Math.round(newPlanForm.amount * 1.18))}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Linked Order / Quotation Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. Q-1042"
                    value={newPlanForm.orderId}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, orderId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="autoRenewCheck"
                    checked={newPlanForm.autoRenew}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, autoRenew: e.target.checked })}
                    className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                  />
                  <label htmlFor="autoRenewCheck" className="text-slate-300 cursor-pointer select-none">
                    Auto-Renew on Billing Date
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewPlanModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  ✓ Create & Activate Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: MODIFY SUBSCRIPTION (WIREFRAME #10)
         ========================================================================= */}
      {isModifySubscriptionOpen && activeSubscriptionDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Plan Modification
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-1">
                  Modify Subscription: {activeSubscriptionDetail.customer}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust billing frequency, plan tier, or cycle renewal schedule with automatic proration credits.
                </p>
              </div>
              <button
                onClick={() => setIsModifySubscriptionOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModifySubscription} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Plan / Solution Name</label>
                <input
                  type="text"
                  required
                  value={modifyForm.plan}
                  onChange={(e) => setModifyForm({ ...modifyForm, plan: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Billing Cycle</label>
                  <select
                    value={modifyForm.cycle}
                    onChange={(e) => setModifyForm({ ...modifyForm, cycle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Recurring Amount (₹ INR)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    value={modifyForm.amount}
                    onChange={(e) => setModifyForm({ ...modifyForm, amount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Next Billing Date</label>
                <input
                  type="text"
                  required
                  value={modifyForm.nextBill}
                  onChange={(e) => setModifyForm({ ...modifyForm, nextBill: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-[11px]">
                <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span>⚖️</span>
                  <span>Proration Calculation Preview:</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Mid-cycle rate changes will credit unconsumed days ({activeSubscriptionDetail.cycle}) toward the new {modifyForm.cycle} rate on {modifyForm.nextBill}.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModifySubscriptionOpen(false)}
                  className="py-2.5 px-4 rounded-xl font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PAYMENT & DELIVERY RECONCILIATION DETAIL (WIREFRAME #12 ROW CLICK)
         ========================================================================= */}
      {selectedInvoiceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-3xl glass-card rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6 animate-float my-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-amber-400">{selectedInvoiceDetail.id}</span>
                  <span className="text-slate-500">•</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border ${
                      selectedInvoiceDetail.status === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedInvoiceDetail.status === 'Paid' ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'
                      }`}
                    />
                    <span>{selectedInvoiceDetail.status}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Due: {selectedInvoiceDetail.dueDate}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold font-display text-white">
                  {selectedInvoiceDetail.customer} — Reconciliation Detail
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedInvoiceDetail.type} • Order Ref: <strong className="text-amber-400 font-mono">{selectedInvoiceDetail.orderId}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedInvoiceDetail(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Invoice Total (USD)</span>
                <div className="text-xl font-extrabold text-white font-mono mt-0.5">{selectedInvoiceDetail.amountUSD}</div>
                <span className="text-[10px] text-slate-500 font-mono block mt-1">Dual-Currency Peg</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Taxable Base (INR)</span>
                <div className="text-xl font-extrabold text-white font-mono mt-0.5">{formatINR(selectedInvoiceDetail.amountINR)}</div>
                <span className="text-[10px] text-slate-500 font-mono block mt-1">+18% GST itemized</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Payment Status</span>
                <div className={`text-base font-extrabold mt-1 ${selectedInvoiceDetail.status === 'Paid' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedInvoiceDetail.status === 'Paid' ? 'Cleared & Settled' : 'Pending Remittance'}
                </div>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">Terms: Net-30</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Dispatch Status</span>
                <div className="text-base font-extrabold text-sky-400 mt-1">
                  {selectedInvoiceDetail.deliveryStatus ? 'Reconciled' : 'In Service'}
                </div>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">E-Way Bill verified</span>
              </div>
            </div>

            {/* Reconciliation Columns: Payment vs Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Box 1: Payment Reconciliation */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <span>💳</span>
                    <span>Payment Reconciliation</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedInvoiceDetail.status === 'Paid'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {selectedInvoiceDetail.status === 'Paid' ? 'Bank Cleared' : 'Unreconciled'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Payment Instrument</span>
                  <span className="text-white font-semibold">{selectedInvoiceDetail.paymentMode || 'Direct Corporate Bank Transfer'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Bank UTR / Transaction Ref</span>
                  <span className="text-amber-300 font-mono font-bold">{selectedInvoiceDetail.utr || 'Pending Collection'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Beneficiary Account</span>
                  <span className="text-slate-300 font-mono">{selectedInvoiceDetail.bankAccount || 'HDFC Bank Corporate — Current A/c 50200019284'}</span>
                </div>
              </div>

              {/* Box 2: Delivery Reconciliation */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <span>📦</span>
                    <span>Delivery Reconciliation</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    GRN Verified
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Fulfillment Delivery Status</span>
                  <span className="text-white font-semibold">{selectedInvoiceDetail.deliveryStatus || 'Delivered to Site'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Goods Receipt Note (GRN)</span>
                  <span className="text-sky-300 font-mono font-bold">{selectedInvoiceDetail.grnNumber || 'GRN-BLR-2026-881'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Dispatch / Installation Date</span>
                  <span className="text-slate-300 font-mono">{selectedInvoiceDetail.deliveryDate || '2026-09-02'}</span>
                </div>
              </div>
            </div>

            {/* Line Items Breakdown */}
            {selectedInvoiceDetail.lineItems && selectedInvoiceDetail.lineItems.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Billed Line Items
                </span>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 divide-y divide-slate-800/80 text-xs">
                  {selectedInvoiceDetail.lineItems.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between font-mono">
                      <span className="text-slate-200 font-sans">{item.desc}</span>
                      <span className="text-white font-bold">{formatINR(item.amount)}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex items-center justify-between font-mono text-[11px] text-slate-400">
                    <span>GST (18% Integrated GST / CGST + SGST)</span>
                    <span className="text-amber-300 font-bold">{formatINR(selectedInvoiceDetail.gstAmountINR || selectedInvoiceDetail.amountINR * 0.18)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {selectedInvoiceDetail.status === 'Unpaid' ? (
                  <>
                    <button
                      onClick={() => handleMarkInvoicePaid(selectedInvoiceDetail.id)}
                      className="py-2.5 px-5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>✓ Mark as Paid / Record UTR</span>
                    </button>
                    <button
                      onClick={() => handleSendInvoiceReminder(selectedInvoiceDetail.id)}
                      className="py-2.5 px-4 rounded-xl font-semibold text-xs text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer"
                    >
                      ✉ Send Reminder
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span>✓ Fully Reconciled & Settled</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => showNotification(`Downloading official GST Tax Invoice for ${selectedInvoiceDetail.id}...`)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>📄 Download Tax Invoice (PDF)</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceDetail(null)}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* =========================================================================
          MODAL: DEAL ANOMALY ROOT-CAUSE INSPECTOR (WIREFRAME #14 ROW CLICK)
         ========================================================================= */}
      {inspectingAnomalyDeal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="glass-card max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    {inspectingAnomalyDeal.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Ref: {inspectingAnomalyDeal.dealId}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      inspectingAnomalyDeal.severity === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {inspectingAnomalyDeal.severity} Severity
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  {inspectingAnomalyDeal.deal} Anomaly Analysis
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {inspectingAnomalyDeal.city} • Rep: <strong className="text-slate-200">{inspectingAnomalyDeal.rep}</strong>
                </p>
              </div>

              <button
                onClick={() => setInspectingAnomalyDeal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
              >
                ✕
              </button>
            </div>

            {/* Score & Issue Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Deal Value</span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {formatINR(inspectingAnomalyDeal.amount)}
                </div>
                <span className="text-[11px] text-slate-400">{inspectingAnomalyDeal.amountUSD} USD</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Risk Score</span>
                <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                  {inspectingAnomalyDeal.riskScore}/100
                </div>
                <span className="text-[11px] text-slate-400">{inspectingAnomalyDeal.type} Anomaly</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Action</span>
                <div className="text-sm font-bold text-sky-400 mt-1">
                  {inspectingAnomalyDeal.action}
                </div>
                <span className="text-[11px] text-slate-400">Flagged: {inspectingAnomalyDeal.flagged}</span>
              </div>
            </div>

            {/* Root-Cause Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Anomaly Diagnosis & Root Cause
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>Detected Flag:</strong> {inspectingAnomalyDeal.issue}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {inspectingAnomalyDeal.issueDetail}
              </p>
            </div>

            {/* AI Recommendation Playbook */}
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base">🤖</span>
                <span className="font-bold text-sky-300">DealFlow360 AI Recovery Playbook:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {inspectingAnomalyDeal.aiRecommendation}
              </p>
            </div>

            {/* Navigation Jump buttons */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Quick Navigation Jumps
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const quote = quotations.find((q) => q.client === inspectingAnomalyDeal.deal || q.id === inspectingAnomalyDeal.dealId) || quotations[0];
                    setInspectingAnomalyDeal(null);
                    openQuotationDetail(quote);
                  }}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer"
                >
                  View Quotation ({inspectingAnomalyDeal.dealId}) →
                </button>
                <button
                  onClick={() => {
                    setInspectingAnomalyDeal(null);
                    setActiveModule('Approvals');
                  }}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors cursor-pointer"
                >
                  Open Approvals Queue →
                </button>
                <button
                  onClick={() => {
                    setInspectingAnomalyDeal(null);
                    setActiveModule('Fulfillment');
                  }}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-colors cursor-pointer"
                >
                  Inspect Fulfillment & Depots →
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEscalateDeal(inspectingAnomalyDeal.id)}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-[#f87171] hover:bg-[#ef4444] border border-rose-400 transition-colors cursor-pointer"
                >
                  ⚠️ Escalate to Manager
                </button>
                <button
                  onClick={() => handleNudgeRep(inspectingAnomalyDeal.id)}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs text-slate-950 bg-[#38bdf8] hover:bg-[#0ea5e9] border border-sky-300 transition-colors cursor-pointer"
                >
                  ✉ Nudge Rep ({inspectingAnomalyDeal.rep})
                </button>
              </div>

              <button
                onClick={() => setInspectingAnomalyDeal(null)}
                className="py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PRODUCT DETAIL, VARIANTS & PRICE LISTS INSPECTOR (WIREFRAME #16)
         ========================================================================= */}
      {selectedCatalogProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="glass-card max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    {selectedCatalogProduct.sku}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {selectedCatalogProduct.id}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {selectedCatalogProduct.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  {selectedCatalogProduct.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Category: <strong className="text-slate-200">{selectedCatalogProduct.category}</strong> • Tax: <strong className="text-amber-400">{selectedCatalogProduct.tax}</strong> ({selectedCatalogProduct.taxCode})
                </p>
              </div>

              <button
                onClick={() => setSelectedCatalogProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
              >
                ✕
              </button>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Base Price (USD)</span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {selectedCatalogProduct.priceUSD}
                </div>
                <span className="text-[10px] text-slate-500">Global benchmark</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Indian Price (INR)</span>
                <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                  {formatINR(selectedCatalogProduct.priceINR)}
                </div>
                <span className="text-[10px] text-slate-500">Excl. GST</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Unit & Billing</span>
                <div className="text-sm font-bold text-slate-200 mt-1">
                  {selectedCatalogProduct.unit}
                </div>
                <span className="text-[10px] text-slate-500">Inventory UOM</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Discount Limit</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {selectedCatalogProduct.discountLimit || 15}%
                </div>
                <span className="text-[10px] text-slate-500">Rep ceiling</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Commercial Specification & Description
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedCatalogProduct.description}
              </p>
            </div>

            {/* Variants Matrix */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>🔀 Configurable SKU Variants ({selectedCatalogProduct.variants})</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">Stock Level</span>
              </div>

              {selectedCatalogProduct.variantList && selectedCatalogProduct.variantList.length > 0 ? (
                <div className="space-y-2">
                  {selectedCatalogProduct.variantList.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{v.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{v.sku}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-slate-200">{v.priceUSD} ({formatINR(v.priceINR)})</div>
                        <div className="text-[10px] text-emerald-400 font-semibold">{v.inStock} in stock</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                  Standard non-variant catalog item. Uniform configuration across all order fulfillment lines.
                </div>
              )}
            </div>

            {/* Multi-Tier & Multi-Currency Price Lists */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>🏷 Multi-Tier Price Books & Currency Rates</span>
                </h4>
                <span className="text-[11px] text-slate-400">Rules Engine</span>
              </div>

              <div className="space-y-2 text-xs">
                {selectedCatalogProduct.tierPricing && selectedCatalogProduct.tierPricing.map((tp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">{tp.tier}</div>
                      <div className="text-[11px] text-slate-400">Currency: {tp.currency}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-amber-300">{tp.price}</div>
                      <div className="text-[10px] text-slate-400">Max Discount: {tp.discountLimit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  showNotification(`Product specifications exported for ${selectedCatalogProduct.name}.`);
                }}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>📄 Export Datasheet (PDF)</span>
              </button>

              <button
                onClick={() => setSelectedCatalogProduct(null)}
                className="py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: + NEW PRODUCT (WIREFRAME #16)
         ========================================================================= */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="glass-card max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                  Catalog Manager
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-1">
                  Add New Catalog Product
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure hardware appliances, professional services, or subscription retainers with GST rates.
                </p>
              </div>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder="e.g. UltraWide Monitor 34, Cloud Gateway Hub..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Services">Services</option>
                    <option value="Subscription">Subscription</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Base Price (USD)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductForm.priceUSD}
                    onChange={(e) => setNewProductForm({ ...newProductForm, priceUSD: e.target.value })}
                    placeholder="e.g. 1200"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit</label>
                  <select
                    value={newProductForm.unit}
                    onChange={(e) => setNewProductForm({ ...newProductForm, unit: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Each">Each</option>
                    <option value="Recurring">Recurring</option>
                    <option value="Hour">Hour</option>
                    <option value="Asset">Asset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tax Rate</label>
                  <select
                    value={newProductForm.tax}
                    onChange={(e) => setNewProductForm({ ...newProductForm, tax: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="15%">15% (Hardware Tier)</option>
                    <option value="10%">10% (Services Tier)</option>
                    <option value="18%">18% (Standard GST)</option>
                    <option value="0%">0% (Exempt)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Variants (Optional)</label>
                  <input
                    type="text"
                    value={newProductForm.variants}
                    onChange={(e) => setNewProductForm({ ...newProductForm, variants: e.target.value })}
                    placeholder="e.g. 3(size) or -"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Spec</label>
                <textarea
                  rows="2"
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  placeholder="Enter enterprise product description..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: MANAGE PRICE FIELDS & TIERS (WIREFRAME #16)
         ========================================================================= */}
      {isManagePriceFieldsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="glass-card max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Pricing Governance
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-1">
                  Manage Price Fields & Price Lists
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure active enterprise tiers, currency conversion multipliers, and discount limits.
                </p>
              </div>
              <button
                onClick={() => setIsManagePriceFieldsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Tier 1: Standard Indian Enterprise (INR)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">Default Price Book</span>
                </div>
                <p className="text-slate-400 text-[11px]">Primary INR price book for registered GST entities with 15% discount concession ceiling.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Tier 2: Commercial Direct (INR)</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">+8% Base Premium</span>
                </div>
                <p className="text-slate-400 text-[11px]">Short-term commercial contracts with strict 10% discount concession threshold.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Tier 3: Global Export (USD)</span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-bold">1 USD = ₹83 Fixed</span>
                </div>
                <p className="text-slate-400 text-[11px]">International cross-border transactions billed in USD with integrated SWIFT/wire rules.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setIsManagePriceFieldsModalOpen(false);
                  showNotification('Price fields & tier rules synchronized across all quotes.');
                }}
                className="py-2.5 px-6 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              >
                Close & Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (typeof document === 'undefined') return null;

  return createPortal(modalContent, document.body);
};

export default DashboardModals;
