const fs = require('fs');

const recovered = JSON.parse(fs.readFileSync('dashboard_recovered.txt', 'utf8'));

// The JSON can have tool_calls or content
let code = '';
if (recovered.content) {
  code = recovered.content;
} else if (recovered.tool_calls) {
  code = JSON.stringify(recovered.tool_calls);
}

// Let's search inside the object for the string that has "const Dashboard = ({ setIsAuthenticated }) => {"
function findCode(obj) {
  if (typeof obj === 'string') {
    if (obj.includes('const Dashboard = ({ setIsAuthenticated }) => {') && obj.includes('initialWarehouseStock')) {
      return obj;
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      const res = findCode(obj[key]);
      if (res) return res;
    }
  }
  return null;
}

const fullCode = findCode(recovered);
console.log('Found fullCode length:', fullCode ? fullCode.length : 0);

if (fullCode) {
  const lines = fullCode.split('\n');
  const dashStart = lines.findIndex(l => l.includes('const Dashboard = ({ setIsAuthenticated }) => {'));
  // Find where the main component return statement starts (around line 2768)
  // It has "return (" followed by "<div className={`min-h-screen"
  let mainReturnIdx = -1;
  for (let i = dashStart; i < lines.length; i++) {
    if (lines[i].includes('return (') && lines[i+1] && lines[i+1].includes('min-h-screen')) {
      mainReturnIdx = i;
      break;
    }
  }
  console.log('dashStart:', dashStart + 1, 'mainReturnIdx:', mainReturnIdx + 1);

  // Extract logic from line after dashStart to line before mainReturnIdx
  const logicLines = lines.slice(dashStart + 1, mainReturnIdx);

  const importsBlock = `import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  formatINR,
  formatINRLakhCrore,
  getNextActivityId,
  getNextEwayBill,
  getNextAppId,
  getNextMsgId,
} from '../utils/formatters.js';

import {
  initialQuotations,
  initialApprovals,
  initialActivities,
  initialWarehouseStock,
  initialFulfillmentOrders,
  initialSubscriptions,
  initialInvoices,
  initialProducts,
  initialDiscountTiers,
  initialApprovalRules,
  navModules,
  kanbanStages,
} from '../data/initialData.js';

import DashboardHeader from './DashboardHeader.jsx';
import DashboardModals from './DashboardModals.jsx';

import DashboardOverview from './sections/DashboardOverview.jsx';
import QuotationsSection from './sections/QuotationsSection.jsx';
import ApprovalsSection from './sections/ApprovalsSection.jsx';
import FulfillmentSection from './sections/FulfillmentSection.jsx';
import SubscriptionsSection from './sections/SubscriptionsSection.jsx';
import InvoicesSection from './sections/InvoicesSection.jsx';
import DealHealthSection from './sections/DealHealthSection.jsx';
import ReportsSection from './sections/ReportsSection.jsx';
import ProductsSection from './sections/ProductsSection.jsx';
import DiscountChainsSection from './sections/DiscountChainsSection.jsx';
import CustomerPortalSection from './sections/CustomerPortalSection.jsx';
`;

  const componentStart = `const Dashboard = ({ setIsAuthenticated }) => {\n  const navigate = useNavigate();\n`;

  const sectionPropsBlock = `  const sectionProps = {
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
    quotationViewMode,
    setQuotationViewMode,
    approvalFilter,
    setApprovalFilter,
    selectedWarehouseHub,
    setSelectedWarehouseHub,
    subscriptionFilter,
    setSubscriptionFilter,
    invoiceFilter,
    setInvoiceFilter,
    productSearchQuery,
    setProductSearchQuery,
    productCategoryFilter,
    setProductCategoryFilter,
    customerPortalTab,
    setCustomerPortalTab,
    customerPortalQuote,
    setCustomerPortalQuote,
    portalMessages,
    setPortalMessages,
    newPortalMessage,
    setNewPortalMessage,
    dealHealthData,
    auditLogs,
    theme,
    pendingCount,
    returnedCount,
    approvedCount,
    openQuotationsCount,
    atRiskDealsCount,
    totalPipelineValue,
    activeSubCount,
    pausedSubCount,
    cancelledSubCount,
    filteredSubscriptions,
    filteredApprovals,
    filteredInvoices,
    unpaidCount,
    paidCount,
    reconciledCount,
    totalUnpaidAmount,
    totalPaidAmount,
    filteredProducts,
    kanbanStages,
    openQuotationDetail,
    openNewQuotationModal,
    handleSaveQuotationChanges,
    handleApproveQuotation,
    handleReturnQuotation,
    handleSubmitForApproval,
    openApprovalDetailModal,
    openApprovalDetailView,
    handleApproveAction,
    handleReturnAction,
    openFulfillmentDetail,
    handleDispatchOrder,
    openSubscriptionDetail,
    handleCreateNewPlan,
    handlePauseSubscription,
    handleResumeSubscription,
    handleCancelSubscription,
    openInvoiceDetail,
    handleMarkInvoicePaid,
    openProductDetail,
    handleSaveProductChanges,
    handleUpdateTierLimit,
    handleSendPortalMessage,
    handleCustomerApproveQuote,
    handleCustomerRequestChange,
    exportAuditReport,
    handleCreateQuotationSubmit,
    handleDispatchSubmit,
    showNotification,
    setActiveModule,
  };
`;

  const returnBlock = `  return (
    <div className={\`min-h-screen \${theme === 'light' ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#0b0f19] text-slate-100'} font-sans flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200\`}>
      {/* Top Header Bar */}
      <DashboardHeader
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        setActiveQuotationDetail={setActiveQuotationDetail}
        setActiveApprovalDetail={setActiveApprovalDetail}
        setActiveFulfillmentDetail={setActiveFulfillmentDetail}
        setActiveInvoiceDetail={setActiveInvoiceDetail}
        setActiveSubscriptionDetail={setActiveSubscriptionDetail}
        theme={theme}
        setTheme={setTheme}
        isThemeMenuOpen={isThemeMenuOpen}
        setIsThemeMenuOpen={setIsThemeMenuOpen}
        themeMenuRef={themeMenuRef}
        handleLogout={handleLogout}
        navModules={navModules}
      />

      {/* Floating Toast Notification */}
      {notification && (
        <div className={\`fixed bottom-6 right-6 z-50 py-2.5 px-4 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md transition-all \${
          theme === 'light'
            ? 'bg-white/95 text-slate-800 border-slate-200 shadow-slate-300/40'
            : 'bg-[#0f172a]/95 text-slate-100 border-slate-700 shadow-black/60'
        }\`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {activeModule === 'Dashboard' && <DashboardOverview {...sectionProps} />}
        {activeModule === 'Quotations' && <QuotationsSection {...sectionProps} />}
        {activeModule === 'Approvals' && <ApprovalsSection {...sectionProps} />}
        {activeModule === 'Fulfillment' && <FulfillmentSection {...sectionProps} />}
        {activeModule === 'Subscriptions' && <SubscriptionsSection {...sectionProps} />}
        {activeModule === 'Invoices' && <InvoicesSection {...sectionProps} />}
        {activeModule === 'Deal Health' && <DealHealthSection {...sectionProps} />}
        {activeModule === 'Reports' && <ReportsSection {...sectionProps} />}
        {(activeModule === 'Products' || activeModule === 'Product') && <ProductsSection {...sectionProps} />}
        {activeModule === 'Discount Chains' && <DiscountChainsSection {...sectionProps} />}
        {activeModule === 'Customer Portal' && <CustomerPortalSection {...sectionProps} />}
      </main>

      {/* Modals & Popups */}
      <DashboardModals {...sectionProps} />
    </div>
  );
};

export default Dashboard;
`;

  // Filter out any duplicate "const navigate = useNavigate();" if present
  const cleanedLogic = logicLines.filter(l => !l.includes('const navigate = useNavigate();')).join('\n');

  const finalOutput = importsBlock + '\n' + componentStart + cleanedLogic + '\n' + sectionPropsBlock + '\n' + returnBlock;
  fs.writeFileSync('src/components/Dashboard.jsx', finalOutput, 'utf8');
  console.log('src/components/Dashboard.jsx successfully assembled! Total length:', finalOutput.length);
}
