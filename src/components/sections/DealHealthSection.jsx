import { formatINR, formatINRLakhCrore } from '../../utils/formatters.js';

const DealHealthSection = (props) => {
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
    dealHealthAnomalies,
    setDealHealthFilter,
    dealHealthFilter,
    selectedAnomalyIds,
    toggleSelectAllAnomalies,
    toggleAnomalySelect,
    setInspectingAnomalyDeal,
    handleEscalateDeal,
    handleNudgeRep,
  } = props;

  return (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Subtitle matching Wireframe #14 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white font-mono font-bold flex items-center justify-center text-sm">
                  14
                </span>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
                    Deal Health and Anomaly Dashboard
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Real-time flags for stalled deals and unusual discount patterns
                  </p>
                </div>
              </div>

              {/* Status summary pill */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center gap-2.5 text-xs shadow-md">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <span className="text-slate-300 font-medium">Flagged Deals:</span>
                  <span className="font-mono font-bold text-rose-400">
                    {dealHealthAnomalies.length} Active
                  </span>
                </div>
              </div>
            </div>

            {/* Top 3 Metric Cards matching Wireframe #14 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Stalled Deals */}
              <div
                onClick={() => setDealHealthFilter(dealHealthFilter === 'Stalled' ? 'ALL' : 'Stalled')}
                className={`rounded-3xl p-6 border transition-all cursor-pointer shadow-xl relative overflow-hidden group ${
                  dealHealthFilter === 'Stalled'
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/10'
                    : 'glass-card border-slate-700/70 hover:border-amber-400/50 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white font-display">Stalled Deals</h3>
                  <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center text-sm">
                    ⏱
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-amber-400 font-display">
                  5 quotes idle 7+ days
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Velocity drop-off detected in client review stage. Click to filter.
                </p>
              </div>

              {/* Card 2: Discount Anomalies */}
              <div
                onClick={() => setDealHealthFilter(dealHealthFilter === 'Discount' ? 'ALL' : 'Discount')}
                className={`rounded-3xl p-6 border transition-all cursor-pointer shadow-xl relative overflow-hidden group ${
                  dealHealthFilter === 'Discount'
                    ? 'bg-rose-500/15 border-rose-400 ring-2 ring-rose-400/40 shadow-rose-500/10'
                    : 'glass-card border-slate-700/70 hover:border-rose-400/50 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white font-display">Discount Anomalies</h3>
                  <span className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center text-sm">
                    📉
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-rose-400 font-display">
                  2 above rep average
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Concession outliers exceeding historical tier benchmarks. Click to filter.
                </p>
              </div>

              {/* Card 3: Delivery Slippage */}
              <div
                onClick={() => setDealHealthFilter(dealHealthFilter === 'Delivery' ? 'ALL' : 'Delivery')}
                className={`rounded-3xl p-6 border transition-all cursor-pointer shadow-xl relative overflow-hidden group ${
                  dealHealthFilter === 'Delivery'
                    ? 'bg-sky-500/15 border-sky-400 ring-2 ring-sky-400/40 shadow-sky-500/10'
                    : 'glass-card border-slate-700/70 hover:border-sky-400/50 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white font-display">Delivery Slippage</h3>
                  <span className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center text-sm">
                    🚚
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-sky-400 font-display">
                  3 promise dates at risk
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Depot inventory shortfall or transit bottlenecks. Click to filter.
                </p>
              </div>
            </div>

            {/* Filter Pill Reset Bar if filter active */}
            {dealHealthFilter !== 'ALL' && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                <span className="text-slate-300">
                  Filtering by: <strong className="text-amber-400">{dealHealthFilter}</strong>
                </span>
                <button
                  onClick={() => setDealHealthFilter('ALL')}
                  className="text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Clear Filter (Show All)
                </button>
              </div>
            )}

            {/* Four-Column Deal Health Table matching Wireframe #14 */}
            <div className="glass-card rounded-3xl border border-slate-700/60 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={
                            dealHealthAnomalies
                              .filter((a) => (dealHealthFilter === 'ALL' ? true : a.type === dealHealthFilter))
                              .length > 0 &&
                            dealHealthAnomalies
                              .filter((a) => (dealHealthFilter === 'ALL' ? true : a.type === dealHealthFilter))
                              .every((a) => selectedAnomalyIds.includes(a.id))
                          }
                          onChange={toggleSelectAllAnomalies}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0 cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-5">Deal</th>
                      <th className="py-3.5 px-5">Issue</th>
                      <th className="py-3.5 px-5 font-mono">Flagged</th>
                      <th className="py-3.5 px-5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {dealHealthAnomalies
                      .filter((a) => (dealHealthFilter === 'ALL' ? true : a.type === dealHealthFilter))
                      .map((item) => {
                        const isSelected = selectedAnomalyIds.includes(item.id);
                        return (
                          <tr
                            key={item.id}
                            className={`transition-colors cursor-pointer group ${
                              isSelected
                                ? 'bg-slate-800/70 border-l-4 border-l-sky-400'
                                : 'hover:bg-slate-800/40'
                            }`}
                          >
                            {/* Checkbox */}
                            <td
                              className="py-4 px-4 text-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAnomalySelect(item.id);
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleAnomalySelect(item.id)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0 cursor-pointer"
                              />
                            </td>

                            {/* Deal */}
                            <td
                              className="py-4 px-5"
                              onClick={() => setInspectingAnomalyDeal(item)}
                            >
                              <div className="font-bold text-white group-hover:text-amber-300 transition-colors text-base flex items-center gap-2">
                                <span>{item.deal}</span>
                                <span className="text-xs text-slate-500 font-mono font-normal">
                                  ({item.dealId})
                                </span>
                              </div>
                              <div className="text-xs text-slate-400">
                                {item.city} • Rep: <span className="text-slate-300">{item.rep}</span>
                              </div>
                            </td>

                            {/* Issue */}
                            <td
                              className="py-4 px-5"
                              onClick={() => setInspectingAnomalyDeal(item)}
                            >
                              <div className="font-semibold text-slate-200 text-sm">
                                {item.issue}
                              </div>
                              <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                                {item.issueDetail}
                              </div>
                            </td>

                            {/* Flagged */}
                            <td
                              className="py-4 px-5 font-mono"
                              onClick={() => setInspectingAnomalyDeal(item)}
                            >
                              <div className="text-slate-300 font-medium">{item.flagged}</div>
                              <div className="text-[10px] text-slate-500">2026 Audit</div>
                            </td>

                            {/* Action */}
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                    item.action === 'Nudge sent'
                                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                      : item.action === 'Escalated to Manager'
                                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                      : item.action === 'Awaiting Logistics Expedite'
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                                  }`}
                                >
                                  <span>{item.action}</span>
                                </span>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInspectingAnomalyDeal(item);
                                  }}
                                  className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700 transition-colors cursor-pointer"
                                  title="Inspect anomaly breakdown"
                                >
                                  🔍
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons matching Wireframe #14 (Escalate & Nudge Rep) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Escalate (Coral / Red / Rose Button from wireframe) */}
              <button
                onClick={() => handleEscalateDeal()}
                className="py-3.5 px-8 rounded-2xl font-extrabold text-sm text-white bg-[#f87171] hover:bg-[#ef4444] shadow-xl shadow-rose-500/25 transition-all cursor-pointer flex items-center gap-2 border border-rose-400/50"
              >
                <span>⚠️ Escalate</span>
                {selectedAnomalyIds.length > 0 && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">
                    ({selectedAnomalyIds.length})
                  </span>
                )}
              </button>

              {/* Nudge Rep (Sky Blue Button from wireframe) */}
              <button
                onClick={() => handleNudgeRep()}
                className="py-3.5 px-8 rounded-2xl font-extrabold text-sm text-slate-950 bg-[#38bdf8] hover:bg-[#0ea5e9] shadow-xl shadow-sky-400/25 transition-all cursor-pointer flex items-center gap-2 border border-sky-300/60"
              >
                <span>✉ Nudge Rep</span>
                {selectedAnomalyIds.length > 0 && (
                  <span className="text-xs bg-slate-950/20 px-2 py-0.5 rounded-full font-mono text-slate-950 font-bold">
                    ({selectedAnomalyIds.length})
                  </span>
                )}
              </button>

              <span className="text-xs text-slate-400 ml-2">
                Click a row to select or inspect root-cause analysis
              </span>
            </div>
          </div>
  );
};

export default DealHealthSection;
