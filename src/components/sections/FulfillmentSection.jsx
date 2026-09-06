import { formatINR, formatINRLakhCrore } from '../../utils/formatters.js';

const FulfillmentSection = (props) => {
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
    setIsManualOverrideOpen,
    isManualOverrideOpen,
    handleOverrideSplitQty,
    handleAcceptSuggestedSplit,
    openFulfillmentDetailView,
    handleRebalanceStock,
  } = props;

  return (
          activeFulfillmentDetail ? (
            /* WIREFRAME #8 FULFILLMENT DETAIL VIEW */
            <div className="space-y-6">
              {/* Back navigation & Title Bar matching Wireframe #8 */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <button
                    onClick={() => {
                      setActiveFulfillmentDetail(null);
                      setIsManualOverrideOpen(false);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
                  >
                    <span>←</span>
                    <span>Back to Fulfillment List</span>
                  </button>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">
                    Fulfillment Detail: {activeFulfillmentDetail.id} ({activeFulfillmentDetail.customer})
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Opened by clicking an order row on the Fulfillment list
                  </p>
                </div>

                {/* Status & Carrier Pill */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider border shadow-md ${
                      activeFulfillmentDetail.status === 'Ready to Ship'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
                        : activeFulfillmentDetail.status === 'Backorder'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10'
                    }`}
                  >
                    {activeFulfillmentDetail.status}
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-slate-800/80 text-slate-300 border border-slate-700">
                    {activeFulfillmentDetail.carrier || 'BlueDart Apex Express'}
                  </span>
                </div>
              </div>

              {/* Multi-Warehouse Fulfillment Split Table matching Wireframe #8 */}
              <div className="glass-card rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-4 px-6">Warehouse</th>
                        <th className="py-4 px-6 font-mono text-center">Qty Fulfilled</th>
                        <th className="py-4 px-6 font-mono text-center">Est. Shipments</th>
                        <th className="py-4 px-6 font-mono text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 font-sans">
                      {activeFulfillmentDetail.warehouseSplit && activeFulfillmentDetail.warehouseSplit.map((split, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-white text-base">{split.warehouse}</div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">{split.hub}</div>
                          </td>
                          <td className="py-4 px-6 font-mono font-extrabold text-center text-lg text-slate-100">
                            {split.qtyFulfilled} units
                          </td>
                          <td className="py-4 px-6 font-mono font-bold text-center text-slate-300">
                            {split.estShipments}
                          </td>
                          <td className="py-4 px-6 font-mono text-right">
                            <span className="text-base font-bold text-amber-300">
                              {formatINR(split.costINR)}
                            </span>
                            <span className="text-xs text-slate-400 ml-1.5 font-normal">
                              ({split.costUSD})
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-900/80 border-t border-slate-800 font-mono text-xs text-slate-300">
                      <tr>
                        <td className="py-3.5 px-6 font-bold uppercase tracking-wider text-slate-400">Total Distribution</td>
                        <td className="py-3.5 px-6 text-center font-extrabold text-white text-sm">
                          {activeFulfillmentDetail.warehouseSplit?.reduce((acc, s) => acc + s.qtyFulfilled, 0) || 24} units
                        </td>
                        <td className="py-3.5 px-6 text-center font-bold text-slate-300">
                          {activeFulfillmentDetail.warehouseSplit?.reduce((acc, s) => acc + s.estShipments, 0) || 2} Shipments
                        </td>
                        <td className="py-3.5 px-6 text-right font-extrabold text-emerald-400 text-sm">
                          {formatINR(activeFulfillmentDetail.warehouseSplit?.reduce((acc, s) => acc + s.costINR, 0) || 5880)} ($71)
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Explanatory Rule Banner matching Wireframe #8 */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-medium flex items-center gap-3 shadow-lg">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
                <span>
                  {activeFulfillmentDetail.splitBannerNote || '"Consolidate Remaining Backorder" prompt appears automatically once East Depot restocks.'}
                </span>
              </div>

              {/* Manual Override Panel (Collapsible / Interactive) */}
              {isManualOverrideOpen && (
                <div className="glass-card rounded-2xl p-5 border border-sky-500/40 bg-slate-900/90 space-y-4 animate-float">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sky-400 font-bold text-sm">⚙ Manual Split Override</span>
                      <span className="text-xs text-slate-400">Adjust individual unit allocations between hubs</span>
                    </div>
                    <button
                      onClick={() => setIsManualOverrideOpen(false)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      ✕ Close Panel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeFulfillmentDetail.warehouseSplit?.map((s) => (
                      <div key={s.warehouse} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{s.warehouse}</div>
                          <div className="text-[11px] text-slate-400">{s.hub}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOverrideSplitQty(s.warehouse, -1)}
                            className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-mono font-bold text-white text-sm">
                            {s.qtyFulfilled}
                          </span>
                          <button
                            onClick={() => handleOverrideSplitQty(s.warehouse, 1)}
                            className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons matching Wireframe #8 */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                {/* Accept Suggested Split (Blue Button) */}
                <button
                  onClick={handleAcceptSuggestedSplit}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Accept Suggested Split</span>
                </button>

                {/* Manual Override (Dark Button) */}
                <button
                  onClick={() => setIsManualOverrideOpen(!isManualOverrideOpen)}
                  className={`w-full sm:w-auto py-3.5 px-8 rounded-xl font-bold text-sm transition-all cursor-pointer border ${
                    isManualOverrideOpen
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {isManualOverrideOpen ? 'Hide Manual Override' : 'Manual Override'}
                </button>

                <button
                  onClick={() => {
                    const targetQuote = quotations.find((q) => q.id === activeFulfillmentDetail.id) || quotations[0];
                    openQuotationDetail(targetQuote);
                  }}
                  className="text-xs text-amber-400 hover:underline font-semibold sm:ml-auto cursor-pointer"
                >
                  View Commercial Quotation ({activeFulfillmentDetail.id}) →
                </button>
              </div>
            </div>
          ) : (
            /* WIREFRAME #7 FULFILLMENT AND STOCK (LIST) VIEW */
            <div className="space-y-8">
              {/* Header matching Wireframe #7 */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">
                    Fulfillment and Stock (List)
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Live stock per warehouse, plus every order that still needs fulfilling
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Quick Action to open Q-1042 Fulfillment Detail directly */}
                  <button
                    onClick={() => openFulfillmentDetailView(fulfillmentOrders[0])}
                    className="py-2 px-3.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Open Q-1042 Fulfillment Detail</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => handleRebalanceStock('Main Warehouse', 'East Depot', 'Laptop Pro 14', 2)}
                    className="py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Simulate inter-depot stock transfer (Bhiwandi to Sriperumbudur)"
                  >
                    <span>🔄 Rebalance Depots</span>
                  </button>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>2 Active Logistics Hubs</span>
                  </div>
                </div>
              </div>

              {/* TABLE 1: Live Stock Per Warehouse (5 columns matching Wireframe #7) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                    <span>Warehouse Inventory Levels</span>
                    <span className="text-xs font-mono font-normal text-slate-400">(Real-Time Multi-Depot Sync)</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Bhiwandi Hub & Sriperumbudur Depot</span>
                </div>

                <div className="glass-card rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-4 px-6">Warehouse</th>
                          <th className="py-4 px-6">Product</th>
                          <th className="py-4 px-6 font-mono text-center">In Stock</th>
                          <th className="py-4 px-6 font-mono text-center">Reserved</th>
                          <th className="py-4 px-6 font-mono text-center">Available</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70 font-sans">
                        {warehouseStock.map((stock) => (
                          <tr key={stock.id} className="hover:bg-slate-800/30 transition-colors">
                            {/* Warehouse */}
                            <td className="py-4 px-6">
                              <div className="font-semibold text-white flex items-center gap-2">
                                <span>{stock.warehouse}</span>
                                <span className="text-[10px] text-slate-400 font-mono hidden lg:inline">
                                  ({stock.hub})
                                </span>
                              </div>
                            </td>

                            {/* Product */}
                            <td className="py-4 px-6 text-slate-200 font-medium">
                              {stock.product}
                            </td>

                            {/* In Stock */}
                            <td className="py-4 px-6 font-mono font-bold text-center text-slate-200">
                              {stock.inStock}
                            </td>

                            {/* Reserved */}
                            <td className="py-4 px-6 font-mono text-center text-amber-400 font-semibold">
                              {stock.reserved}
                            </td>

                            {/* Available */}
                            <td className="py-4 px-6 font-mono text-center">
                              <span
                                className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-extrabold ${
                                  stock.available <= 5
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                }`}
                              >
                                {stock.available}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* TABLE 2: Orders Awaiting Fulfillment matching Wireframe #7 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold font-display text-white">
                    Orders Awaiting Fulfillment
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {fulfillmentOrders.filter(o => o.status !== 'Dispatched').length} Orders Pending Dispatch
                  </span>
                </div>

                <div className="glass-card rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-4 px-6">Order</th>
                          <th className="py-4 px-6">Customer</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6">Warehouses</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70 font-sans">
                        {fulfillmentOrders.map((order) => (
                          <tr
                            key={order.id}
                            onClick={() => openFulfillmentDetailView(order)}
                            className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                          >
                            {/* Order ID */}
                            <td className="py-4 px-6 font-mono text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                              <div className="flex items-center gap-1.5">
                                <span>{order.id}</span>
                                <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                              </div>
                            </td>

                            {/* Customer */}
                            <td className="py-4 px-6">
                              <div className="font-semibold text-white">{order.customer}</div>
                              <div className="text-[11px] text-slate-400">{order.city}</div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold tracking-wider border ${
                                  order.status === 'Split Pending'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : order.status === 'Backorder'
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                    : order.status === 'Ready to Ship'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>

                            {/* Warehouses */}
                            <td className="py-4 px-6 font-medium text-slate-200">
                              <span className="font-mono text-xs text-slate-300 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/60">
                                {order.warehouses}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Callout Banner matching Wireframe #7 */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">📦</span>
                    <span>Click an order row to open its warehouse split detail.</span>
                  </div>
                  <span className="text-xs text-amber-400/80 font-mono hidden sm:inline">Row Selection Active</span>
                </div>
              </div>
            </div>
          )
  );
};

export default FulfillmentSection;
