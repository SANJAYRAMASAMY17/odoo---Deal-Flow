const fs = require('fs');
const content = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');
const lines = content.split('\n');

const dashboardStart = lines.findIndex(l => l.includes('const Dashboard = ({ setIsAuthenticated }) => {'));
const returnStart = lines.findIndex(l => l.includes('return (') && lines.indexOf(l) > dashboardStart);

console.log('dashboardStart:', dashboardStart + 1, 'returnStart:', returnStart + 1);

// Extract the state & handlers lines
const logicLines = lines.slice(dashboardStart, returnStart);

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

const finalFileContent = importsBlock + '\n' + logicLines.join('\n') + '\n' + sectionPropsBlock + '\n' + returnBlock;

fs.writeFileSync('src/components/Dashboard.jsx', finalFileContent, 'utf8');
console.log('Successfully refactored src/components/Dashboard.jsx!');
