import { formatINR, formatINRLakhCrore } from '../../utils/formatters.js';

const ProductsSection = (props) => {
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
    setActiveProductDetail,
    activeProductDetail,
    openProductDetailView,
    catalogProducts,
    setIsNewProductModalOpen,
    handleSaveProductDetail,
    productDetailForm,
    setProductDetailForm,
    handleAddVariantRow,
    handleUpdateVariantRow,
    handleRemoveVariantRow,
    handleAddPricelistRow,
    handleUpdatePricelistRow,
    handleRemovePricelistRow,
  } = props;

  return (
          <div className="space-y-6 animate-fadeIn">
            {/* Top View Mode Switcher Pills (Wireframe #16 vs Wireframe #17) */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-lg">
                <button
                  onClick={() => setActiveProductDetail(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    !activeProductDetail
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center text-[10px]">16</span>
                  <span>Product catalog</span>
                </button>
                <button
                  onClick={() => openProductDetailView(activeProductDetail || catalogProducts[0])}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    activeProductDetail
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center text-[10px]">17</span>
                  <span>Product and pricelist</span>
                </button>
              </div>

              {/* Quick contextual action for product detail view */}
              {activeProductDetail && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveProductDetail(null)}
                    className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>←</span>
                    <span>Back to Catalog</span>
                  </button>
                  <button
                    onClick={handleSaveProductDetail}
                    className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5 border border-emerald-300/60"
                  >
                    <span>💾</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            {/* =====================================================================
                WIREFRAME #17: PRODUCT DETAILS PAGE (Product and pricelist)
               ===================================================================== */}
            {activeProductDetail && productDetailForm ? (
              <div className="space-y-6 animate-fadeIn">
                {/* 1. Top DealFlow360 Brand Bar */}
                <div className="rounded-2xl bg-sky-500 px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-sky-500/10">
                  <div className="flex items-center gap-3 text-slate-950 font-black text-xl tracking-tight font-display">
                    <span>DealFlow360</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-md bg-slate-950/15 text-slate-950">
                      Product Studio
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-950/80 font-mono">
                    Product Configuration &amp; Commercial Pricing
                  </div>
                </div>

                {/* 2. Page Title Header & Product Selector */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                        17.Product Details page
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        SKU: {productDetailForm.sku}
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
                      Product and pricelist
                    </h1>
                  </div>

                  {/* Switch to another product quick dropdown */}
                  <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400 font-medium pl-1">Product:</span>
                    <select
                      value={productDetailForm.id}
                      onChange={(e) => {
                        const target = catalogProducts.find((p) => p.id === e.target.value);
                        if (target) openProductDetailView(target);
                      }}
                      aria-label="Select catalog product"
                      className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-sky-500 font-bold"
                    >
                      {catalogProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Section 1: General Info matching Wireframe #17 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
                    General Info
                  </span>
                  <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-700/70 shadow-xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Product name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">
                            Product name
                          </label>
                          <input
                            type="text"
                            value={productDetailForm.name || ''}
                            onChange={(e) =>
                              setProductDetailForm({ ...productDetailForm, name: e.target.value })
                            }
                            placeholder="e.g. Laptop Pro 14"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 transition-all"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">
                            Category
                          </label>
                          <select
                            value={productDetailForm.category || 'Hardware'}
                            onChange={(e) =>
                              setProductDetailForm({ ...productDetailForm, category: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-sky-400 transition-all"
                          >
                            <option value="Hardware">Hardware</option>
                            <option value="Services">Services</option>
                            <option value="Subscription">Subscription</option>
                            <option value="Peripherals">Peripherals</option>
                          </select>
                        </div>

                        {/* Price */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">
                            Price
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={productDetailForm.priceUSD || ''}
                              onChange={(e) =>
                                setProductDetailForm({ ...productDetailForm, priceUSD: e.target.value })
                              }
                              placeholder="e.g. $1,200"
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-sky-400 transition-all"
                            />
                          </div>
                        </div>

                        {/* Unit */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">
                            Unit
                          </label>
                          <input
                            type="text"
                            value={productDetailForm.unit || ''}
                            onChange={(e) =>
                              setProductDetailForm({ ...productDetailForm, unit: e.target.value })
                            }
                            placeholder="e.g. Each, Recurring, Unit, Month"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-400 transition-all"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={productDetailForm.description || ''}
                            onChange={(e) =>
                              setProductDetailForm({ ...productDetailForm, description: e.target.value })
                            }
                            placeholder="Commercial specification and product overview..."
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-sky-400 transition-all leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Tax % */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">
                            Tax %
                          </label>
                          <input
                            type="text"
                            value={productDetailForm.taxPercent || productDetailForm.tax || '15%'}
                            onChange={(e) =>
                              setProductDetailForm({
                                ...productDetailForm,
                                taxPercent: e.target.value,
                                tax: e.target.value,
                              })
                            }
                            placeholder="e.g. 15%"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-sky-400 transition-all"
                          />
                        </div>

                        {/* Subscription (Yes / NO) with wireframe note */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <label className="text-xs font-bold text-slate-300">
                              Subscription
                            </label>
                            <span className="text-[11px] text-sky-400 font-medium italic">
                              If subscription yes then recurring will be visible
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setProductDetailForm({ ...productDetailForm, subscription: 'Yes' })
                              }
                              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                productDetailForm.subscription === 'Yes'
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                                  : 'bg-slate-950/80 text-slate-400 border-slate-700 hover:text-white'
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setProductDetailForm({ ...productDetailForm, subscription: 'NO' })
                              }
                              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                productDetailForm.subscription === 'NO' || !productDetailForm.subscription
                                  ? 'bg-slate-800 text-white border-slate-600 shadow-md'
                                  : 'bg-slate-950/80 text-slate-400 border-slate-700 hover:text-white'
                              }`}
                            >
                              NO
                            </button>
                          </div>
                        </div>

                        {/* Recurring (Monthly/Yearly/Weekly) - Conditionally Visible */}
                        {productDetailForm.subscription === 'Yes' ? (
                          <div className="animate-fadeIn p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30">
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                                <span>🔄</span>
                                <span>Recurring</span>
                              </label>
                              <span className="text-[10px] text-sky-400 font-mono font-semibold">
                                Active Subscription
                              </span>
                            </div>
                            <select
                              value={productDetailForm.recurring || 'Monthly'}
                              onChange={(e) =>
                                setProductDetailForm({ ...productDetailForm, recurring: e.target.value })
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-sky-500/40 text-white font-bold text-sm focus:outline-none focus:border-sky-300 transition-all"
                            >
                              <option value="Monthly">Monthly</option>
                              <option value="Yearly">Yearly</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Quarterly">Quarterly</option>
                            </select>
                          </div>
                        ) : (
                          <div className="p-3 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-slate-500 text-xs">
                            <span className="font-semibold text-slate-400">Recurring field:</span> Hidden (Set Subscription to &ldquo;Yes&rdquo; to configure billing recurrence).
                          </div>
                        )}

                        {/* Quantity on hand (Integer field) */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-300">
                              Quantity on hand
                            </label>
                            <span className="text-[11px] text-slate-400 font-mono">
                              (Integer field)
                            </span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={productDetailForm.qtyOnHand !== undefined ? productDetailForm.qtyOnHand : 40}
                            onChange={(e) =>
                              setProductDetailForm({
                                ...productDetailForm,
                                qtyOnHand: parseInt(e.target.value, 10) || 0,
                              })
                            }
                            placeholder="40"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-sky-400 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Section 2: Product Variants matching Wireframe #17 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
                      Product Variants
                    </span>
                    <button
                      type="button"
                      onClick={handleAddVariantRow}
                      className="text-xs font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1 rounded-xl border border-sky-500/30 transition-all cursor-pointer"
                    >
                      + Add Variant
                    </button>
                  </div>

                  <div className="glass-card rounded-3xl border border-slate-700/60 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="py-3.5 px-5">Attribute</th>
                            <th className="py-3.5 px-5">Values</th>
                            <th className="py-3.5 px-5 font-mono">Extra price</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-sans">
                          {productDetailForm.productVariants && productDetailForm.productVariants.length > 0 ? (
                            productDetailForm.productVariants.map((variant, idx) => (
                              <tr key={variant.id || idx} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3.5 px-5">
                                  <input
                                    type="text"
                                    value={variant.attribute || ''}
                                    onChange={(e) => handleUpdateVariantRow(idx, 'attribute', e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-sky-400"
                                  />
                                </td>
                                <td className="py-3.5 px-5">
                                  <input
                                    type="text"
                                    value={variant.values || ''}
                                    onChange={(e) => handleUpdateVariantRow(idx, 'values', e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                                  />
                                </td>
                                <td className="py-3.5 px-5 font-mono">
                                  <input
                                    type="text"
                                    value={variant.extraPrice || ''}
                                    onChange={(e) => handleUpdateVariantRow(idx, 'extraPrice', e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-sky-400"
                                  />
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveVariantRow(idx)}
                                    className="text-slate-500 hover:text-rose-400 text-xs px-2 py-1 transition-colors cursor-pointer"
                                    title="Delete Variant"
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-4 px-5 text-center text-xs text-slate-500">
                                No variants configured. Click &ldquo;+ Add Variant&rdquo; to add Color, RAM, or custom specs.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 5. Section 3: Pricelists matching Wireframe #17 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
                      Pricelists
                    </span>
                    <button
                      type="button"
                      onClick={handleAddPricelistRow}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-500/30 transition-all cursor-pointer"
                    >
                      + Add Pricelist Rule
                    </button>
                  </div>

                  <div className="glass-card rounded-3xl border border-slate-700/60 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="py-3.5 px-5">Tier</th>
                            <th className="py-3.5 px-5 font-mono">Currency</th>
                            <th className="py-3.5 px-5">Price Rule</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-sans">
                          {productDetailForm.pricelists && productDetailForm.pricelists.length > 0 ? (
                            productDetailForm.pricelists.map((priceTier, idx) => (
                              <tr key={priceTier.id || idx} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3.5 px-5">
                                  <input
                                    type="text"
                                    value={priceTier.tier || ''}
                                    onChange={(e) => handleUpdatePricelistRow(idx, 'tier', e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                                  />
                                </td>
                                <td className="py-3.5 px-5 font-mono">
                                  <input
                                    type="text"
                                    value={priceTier.currency || ''}
                                    onChange={(e) => handleUpdatePricelistRow(idx, 'currency', e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-sky-400 font-bold focus:outline-none focus:border-amber-400"
                                  />
                                </td>
                                <td className="py-3.5 px-5">
                                  <input
                                    type="text"
                                    value={priceTier.priceRule || ''}
                                    onChange={(e) => handleUpdatePricelistRow(idx, 'priceRule', e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                                  />
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePricelistRow(idx)}
                                    className="text-slate-500 hover:text-rose-400 text-xs px-2 py-1 transition-colors cursor-pointer"
                                    title="Delete Pricelist Rule"
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-4 px-5 text-center text-xs text-slate-500">
                                No pricelist tier rules. Click &ldquo;+ Add Pricelist Rule&rdquo; to configure discount schemes.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 6. Section 4: Callout Notice Box (Yellow/Gold Border) matching Wireframe #17 */}
                <div className="rounded-2xl p-5 bg-amber-500/10 border-2 border-amber-500/70 shadow-xl space-y-1.5">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 text-lg leading-none mt-0.5">⚠️</span>
                    <div className="space-y-1 text-xs sm:text-sm font-semibold text-amber-200 leading-relaxed">
                      <p>Product details should be filled.</p>
                      <p>Recurring order with this product will be invoiced at the beginning of the period.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* =====================================================================
                  WIREFRAME #16: PRODUCT CATALOG OVERVIEW
                 ===================================================================== */
              <div className="space-y-6">
                {/* Header & Subtitle matching Wireframe #16 */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white font-mono font-bold flex items-center justify-center text-sm">
                      16
                    </span>
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
                        Product catalog
                      </h1>
                      <p className="mt-1 text-sm text-slate-400">
                        Every product, variant and price list in one place.
                      </p>
                    </div>
                  </div>

                  {/* Top Action Buttons matching Wireframe #16 */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsNewProductModalOpen(true)}
                      className="py-3 px-6 rounded-2xl font-extrabold text-sm text-slate-950 bg-[#38bdf8] hover:bg-[#0ea5e9] shadow-xl shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-2 border border-sky-300/60"
                    >
                      <span className="text-base font-black">+</span>
                      <span>New Product</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveModule('Discount Chains');
                        showNotification('Navigated to Discount Tiers & Approval Chains setup (Wireframe #18).');
                      }}
                      className="py-3 px-6 rounded-2xl font-bold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 shadow-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>⚙ Manage Price fields</span>
                    </button>
                  </div>
                </div>

                {/* Three Summary Metric Cards matching Wireframe #16 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Card 1: Total Products */}
                  <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-700/70 shadow-xl space-y-2 relative overflow-hidden group hover:border-slate-600 transition-all">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-300 font-display">Total Products</h3>
                      <span className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center text-sm">
                        📦
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                      128 active, 6 archived
                    </div>
                    <p className="text-xs text-slate-400">
                      Across hardware appliances, support services, and recurring plans.
                    </p>
                  </div>

                  {/* Card 2: Pricelists */}
                  <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-700/70 shadow-xl space-y-2 relative overflow-hidden group hover:border-slate-600 transition-all">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-300 font-display">Pricelists</h3>
                      <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-sm">
                        🏷
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display">
                      3 tiers, 2 Currencies
                    </div>
                    <p className="text-xs text-slate-400">
                      Standard Enterprise, Wholesale & Commercial Direct (INR ₹ & USD $).
                    </p>
                  </div>

                  {/* Card 3: Variants */}
                  <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-700/70 shadow-xl space-y-2 relative overflow-hidden group hover:border-slate-600 transition-all">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-300 font-display">Variants</h3>
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-sm">
                        🔀
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">
                      340 SKUs across all products
                    </div>
                    <p className="text-xs text-slate-400">
                      Configurable memory, display sizes, finishes, and regional power options.
                    </p>
                  </div>
                </div>

                {/* Products Table Section Pill & Category Filter */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-sky-400 shadow-sm">
                      Products
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Showing {catalogProducts.filter((p) => productCategoryFilter === 'ALL' ? true : p.category === productCategoryFilter).length} items
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {['ALL', 'Hardware', 'Services', 'Subscription'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setProductCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          productCategoryFilter === cat
                            ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                            : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                        }`}
                      >
                        {cat === 'ALL' ? 'All Categories' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seven-Column Products Table matching Wireframe #16 */}
                <div className="glass-card rounded-3xl border border-slate-700/60 shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-4 px-5">Product name</th>
                          <th className="py-4 px-4">Category</th>
                          <th className="py-4 px-4 font-mono text-center">Variants</th>
                          <th className="py-4 px-5 font-mono">Price</th>
                          <th className="py-4 px-4">Unit</th>
                          <th className="py-4 px-4 font-mono">Tax</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-4 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {catalogProducts
                          .filter((p) => productCategoryFilter === 'ALL' ? true : p.category === productCategoryFilter)
                          .map((prod) => (
                            <tr
                              key={prod.id}
                              onClick={() => openProductDetailView(prod)}
                              className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                            >
                              {/* Product name */}
                              <td className="py-4 px-5">
                                <div className="font-bold text-white text-base group-hover:text-amber-300 transition-colors flex items-center gap-2">
                                  <span>{prod.name}</span>
                                  <span className="text-slate-600 group-hover:text-amber-400 text-xs transition-colors">
                                    →
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  {prod.sku}
                                </div>
                              </td>

                              {/* Category */}
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                    prod.category === 'Hardware'
                                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                      : prod.category === 'Services'
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  }`}
                                >
                                  {prod.category}
                                </span>
                              </td>

                              {/* Variants */}
                              <td className="py-4 px-4 font-mono text-center">
                                {prod.variants !== '-' ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                                    {prod.variants}
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-sm">-</span>
                                )}
                              </td>

                              {/* Price */}
                              <td className="py-4 px-5 font-mono">
                                <div className="font-extrabold text-white text-base">
                                  {prod.priceUSD}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {formatINR(prod.priceINR)}
                                </div>
                              </td>

                              {/* Unit */}
                              <td className="py-4 px-4 text-xs text-slate-300 font-medium">
                                {prod.unit}
                              </td>

                              {/* Tax */}
                              <td className="py-4 px-4 font-mono text-xs">
                                <span className="text-slate-200 font-bold">{prod.tax}</span>
                                <span className="text-[10px] text-slate-500 block">
                                  {prod.taxCode ? prod.taxCode.split(' ')[0] : 'GST'}
                                </span>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  <span>{prod.status}</span>
                                </span>
                              </td>

                              {/* Action pill */}
                              <td className="py-4 px-4 text-right">
                                <span className="text-xs font-bold text-sky-400 bg-sky-500/10 group-hover:bg-sky-500 group-hover:text-slate-950 px-2.5 py-1 rounded-xl transition-all inline-flex items-center gap-1">
                                  <span>Edit</span>
                                  <span>→</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Interactive Callout Notice Box (Yellow/Gold Border) matching Wireframe #16 */}
                <div className="rounded-2xl p-4 sm:p-5 bg-amber-500/10 border-2 border-amber-500/60 shadow-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <p className="text-xs sm:text-sm font-semibold text-amber-200 leading-relaxed">
                      Click a product row to open general info, variants and tier/currency price lists.
                    </p>
                  </div>
                  <button
                    onClick={() => openProductDetailView(catalogProducts[0])}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold hover:bg-amber-400 transition-all cursor-pointer shrink-0"
                  >
                    Open Wireframe #17 →
                  </button>
                </div>
              </div>
            )}
          </div>
  );
};

export default ProductsSection;
