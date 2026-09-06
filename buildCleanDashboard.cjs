const fs = require('fs');

const allHandlers = JSON.parse(fs.readFileSync('all_handlers.json', 'utf8'));

const imports = `import { useState, useEffect, useRef } from 'react';
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
  initialWarehouseStock,
  initialFulfillmentOrders,
  initialSubscriptions,
  initialInvoices,
  initialDealHealthAnomalies,
  initialCatalogProducts,
  initialActivities,
  initialTierDiscountCeilings,
  initialCategoryDiscountCeilings,
  initialApprovalRoutingRules,
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

const stateAndLogic = `const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  // Navigation module state
  const [activeModule, setActiveModule] = useState('Dashboard');

  // Theme state: strict 2-color theme ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notifications
  const [notification, setNotification] = useState(null);
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Logout handler
  const handleLogout = () => {
    if (setIsAuthenticated) setIsAuthenticated(false);
    navigate('/login');
  };

  // Activity stream state
  const [activities, setActivities] = useState(initialActivities);

  // ==========================================
  // MODULE 1 & 2: QUOTATIONS STATE & HANDLERS
  // ==========================================
  const [quotations, setQuotations] = useState(initialQuotations);
  const [quotationViewMode, setQuotationViewMode] = useState('board');
  const [activeQuotationDetail, setActiveQuotationDetail] = useState(null);
  const [isCreateQuotationModalOpen, setIsCreateQuotationModalOpen] = useState(false);
  const [newQuotationForm, setNewQuotationForm] = useState({
    client: '',
    city: 'Bengaluru, Karnataka',
    gstin: '',
    title: '',
    priceList: 'Standard Indian Enterprise Tier 2026 (INR)',
    notes: '',
  });

  const openQuotationDetail = (quote) => {
    setActiveQuotationDetail(JSON.parse(JSON.stringify(quote)));
    setActiveModule('Quotations');
  };

  const openNewQuotationModal = () => {
    setIsCreateQuotationModalOpen(true);
  };

  const handleCreateQuotationSubmit = (e) => {
    if (e) e.preventDefault();
    if (!newQuotationForm.client || !newQuotationForm.title) {
      showNotification('Please provide client name and quotation title.');
      return;
    }
    const newId = \`Q-\${1040 + quotations.length + 1}\`;
    const newQuote = {
      id: newId,
      client: newQuotationForm.client,
      city: newQuotationForm.city || 'Bengaluru, Karnataka',
      gstin: newQuotationForm.gstin || '29AABCA9999F1Z5',
      title: newQuotationForm.title,
      amount: 450000,
      stage: 'Draft',
      contact: \`contact@\${newQuotationForm.client.toLowerCase().replace(/\\s+/g, '')}.com\`,
      priceList: newQuotationForm.priceList,
      date: new Date().toISOString().split('T')[0],
      lineItems: [
        { id: 1, product: 'Enterprise Core License', qty: 1, price: 350000, discount: 5, limit: 10 },
        { id: 2, product: 'Standard Deployment', qty: 1, price: 100000, discount: 0, limit: 10 },
      ],
      notes: newQuotationForm.notes || 'Created via new quotation wizard.',
    };

    setQuotations([newQuote, ...quotations]);
    setIsCreateQuotationModalOpen(false);
    setNewQuotationForm({
      client: '',
      city: 'Bengaluru, Karnataka',
      gstin: '',
      title: '',
      priceList: 'Standard Indian Enterprise Tier 2026 (INR)',
      notes: '',
    });

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: \`New Quotation \${newId} created for \${newQuote.client}\`,
        category: 'Quotation Created',
        time: 'Just now',
        type: 'success',
        badge: 'Draft',
      },
      ...prev,
    ]);

    showNotification(\`Quotation \${newId} successfully created!\`);
  };

  const handleSaveQuotationChanges = (updatedQuote) => {
    if (!updatedQuote) return;
    setQuotations(quotations.map((q) => (q.id === updatedQuote.id ? updatedQuote : q)));
    setActiveQuotationDetail(updatedQuote);
    showNotification(\`Changes saved to quotation \${updatedQuote.id}\`);
  };

  const handleSubmitForApproval = (quoteId) => {
    const targetQuote = quotations.find((q) => q.id === quoteId) || activeQuotationDetail;
    if (!targetQuote) return;

    setQuotations(
      quotations.map((q) => (q.id === targetQuote.id ? { ...q, stage: 'Pending Approval' } : q))
    );

    if (activeQuotationDetail && activeQuotationDetail.id === targetQuote.id) {
      setActiveQuotationDetail({ ...activeQuotationDetail, stage: 'Pending Approval' });
    }

    const newApp = {
      id: getNextAppId(),
      quotationId: targetQuote.id,
      customer: targetQuote.client,
      blendedRisk: 'HIGH',
      stage: 'Sales Manager',
      assignedTo: 'M. Shah',
      status: 'Pending',
      riskScore: 79,
      factors: [
        'Line item discount breach requested by sales representative.',
        'Total contract value exceeds automated approval ceiling.',
      ],
      auditTrail: [
        { time: 'Just now', user: 'Arjun Mehta (Sales Rep)', action: \`Submitted \${targetQuote.id} for approval\` },
      ],
    };

    setApprovals([newApp, ...approvals]);

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: \`\${targetQuote.client} quotation \${targetQuote.id} submitted for approval\`,
        category: 'Quotation Workflow',
        time: 'Just now',
        type: 'warning',
        badge: 'Pending Approval',
      },
      ...prev,
    ]);

    showNotification(\`Quotation \${targetQuote.id} submitted for manager review!\`);
  };

  // ==========================================
  // MODULE 3: APPROVALS STATE & HANDLERS
  // ==========================================
  const [approvals, setApprovals] = useState(initialApprovals);
  const [selectedApprovalDetail, setSelectedApprovalDetail] = useState(null);
  const [activeApprovalDetail, setActiveApprovalDetail] = useState(null);
  const [approvalFilter, setApprovalFilter] = useState('ALL');

  const openApprovalDetailModal = (app) => {
    setSelectedApprovalDetail(app);
  };

  const openApprovalDetailView = (app) => {
    const target = app || approvals[0];
    setActiveApprovalDetail(JSON.parse(JSON.stringify(target)));
    setSelectedApprovalDetail(null);
    setActiveModule('Approvals');
  };

  const handleApproveQuotation = (appId) => {
    const app = approvals.find((a) => a.id === appId);
    if (!app) return;

    setApprovals(
      approvals.map((a) => (a.id === appId ? { ...a, status: 'Approved', stage: 'Approved by ' + a.assignedTo } : a))
    );
    setQuotations(
      quotations.map((q) => (q.id === app.quotationId ? { ...q, stage: 'Approved' } : q))
    );

    if (selectedApprovalDetail && selectedApprovalDetail.id === appId) {
      setSelectedApprovalDetail({
        ...selectedApprovalDetail,
        status: 'Approved',
        stage: 'Approved by ' + app.assignedTo,
        auditTrail: [
          ...(selectedApprovalDetail.auditTrail || []),
          { time: 'Just now', user: app.assignedTo, action: 'Officially approved quotation discount & commercial terms' },
        ],
      });
    }

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: \`\${app.customer} quotation \${app.quotationId} approved by \${app.assignedTo}\`,
        category: 'Executive Approval',
        time: 'Just now',
        type: 'success',
        badge: 'Approved',
      },
      ...prev,
    ]);

    showNotification(\`Quotation \${app.quotationId} approved!\`);
  };

  const handleReturnQuotation = (appId) => {
    const app = approvals.find((a) => a.id === appId);
    if (!app) return;

    setApprovals(
      approvals.map((a) => (a.id === appId ? { ...a, status: 'Returned', stage: 'Returned to Sales Rep' } : a))
    );
    setQuotations(
      quotations.map((q) => (q.id === app.quotationId ? { ...q, stage: 'Draft' } : q))
    );

    if (selectedApprovalDetail && selectedApprovalDetail.id === appId) {
      setSelectedApprovalDetail({
        ...selectedApprovalDetail,
        status: 'Returned',
        stage: 'Returned to Sales Rep',
        auditTrail: [
          ...(selectedApprovalDetail.auditTrail || []),
          { time: 'Just now', user: app.assignedTo, action: 'Returned with feedback: Margin concession rejected.' },
        ],
      });
    }

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: \`\${app.customer} quotation \${app.quotationId} returned by \${app.assignedTo}\`,
        category: 'Executive Approval',
        time: 'Just now',
        type: 'warning',
        badge: 'Returned',
      },
      ...prev,
    ]);

    showNotification(\`Quotation \${app.quotationId} returned for revision.\`);
  };

  const handleApproveAction = handleApproveQuotation;
  const handleReturnAction = handleReturnQuotation;

  // ==========================================
  // MODULE 4: FULFILLMENT STATE & HANDLERS
  // ==========================================
  const [warehouseStock, setWarehouseStock] = useState(initialWarehouseStock);
  const [fulfillmentOrders, setFulfillmentOrders] = useState(initialFulfillmentOrders);
  const [selectedFulfillmentOrder, setSelectedFulfillmentOrder] = useState(null);
  const [activeFulfillmentDetail, setActiveFulfillmentDetail] = useState(null);
  const [selectedWarehouseHub, setSelectedWarehouseHub] = useState('All Locations');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isManualOverrideOpen, setIsManualOverrideOpen] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    carrier: 'BlueDart Express',
    trackingId: 'BD-998241',
    notes: 'Priority air cargo fulfillment',
  });

  const openFulfillmentDetail = (order) => {
    setSelectedFulfillmentOrder(order);
  };

  const handleDispatchOrder = (orderId) => {
    setIsDispatchModalOpen(true);
  };

  const handleDispatchSubmit = (e) => {
    if (e) e.preventDefault();
    const ewayNumber = getNextEwayBill();
    if (selectedFulfillmentOrder) {
      const updated = {
        ...selectedFulfillmentOrder,
        status: 'Ready to Ship',
        ewayBill: ewayNumber,
        carrier: dispatchForm.carrier,
      };
      setFulfillmentOrders(fulfillmentOrders.map((o) => (o.id === selectedFulfillmentOrder.id ? updated : o)));
      setSelectedFulfillmentOrder(updated);
    }
    setIsDispatchModalOpen(false);
    showNotification(\`Dispatch schedule confirmed! e-Way Bill \${ewayNumber} issued.\`);
  };

  // ==========================================
  // MODULE 5: SUBSCRIPTIONS STATE & HANDLERS
  // ==========================================
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [subscriptionFilter, setSubscriptionFilter] = useState('ALL');
  const [selectedSubscriptionDetail, setSelectedSubscriptionDetail] = useState(null);
  const [activeSubscriptionDetail, setActiveSubscriptionDetail] = useState(null);
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState({
    name: '',
    amount: '',
    billingCycle: 'Monthly',
    users: 'Unlimited',
    features: '',
  });
  const [isModifySubscriptionOpen, setIsModifySubscriptionOpen] = useState(false);
  const [modifyForm, setModifyForm] = useState({
    plan: '',
    cycle: 'Monthly',
    amount: '',
    nextBill: '',
  });

  const openSubscriptionDetail = (sub) => {
    setSelectedSubscriptionDetail(sub);
  };

  const handleCreateNewPlan = (e) => {
    if (e) e.preventDefault();
    if (!newPlanForm.name || !newPlanForm.amount) {
      showNotification('Please enter plan name and base subscription amount.');
      return;
    }
    showNotification(\`New plan "\${newPlanForm.name}" created successfully!\`);
    setIsNewPlanModalOpen(false);
    setNewPlanForm({ name: '', amount: '', billingCycle: 'Monthly', users: 'Unlimited', features: '' });
  };

  const handlePauseSubscription = (subId) => {
    setSubscriptions(
      subscriptions.map((s) => (s.id === subId ? { ...s, status: 'Paused', nextBill: '-' } : s))
    );
    showNotification(\`Subscription \${subId} paused.\`);
  };

  const handleResumeSubscription = (subId) => {
    setSubscriptions(
      subscriptions.map((s) => (s.id === subId ? { ...s, status: 'Active', nextBill: 'Oct 15' } : s))
    );
    showNotification(\`Subscription \${subId} resumed.\`);
  };

  const handleCancelSubscription = (subId) => {
    setSubscriptions(
      subscriptions.map((s) => (s.id === subId ? { ...s, status: 'Cancelled', nextBill: '-' } : s))
    );
    showNotification(\`Subscription \${subId} cancelled.\`);
  };

  // ==========================================
  // MODULE 6: INVOICES STATE & HANDLERS
  // ==========================================
  const [invoices, setInvoices] = useState(initialInvoices);
  const [invoiceFilter, setInvoiceFilter] = useState('ALL');
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState(null);
  const [activeInvoiceDetail, setActiveInvoiceDetail] = useState(null);

  const openInvoiceDetail = (inv) => {
    setSelectedInvoiceDetail(inv);
  };

  const handleMarkInvoicePaid = (invId) => {
    const updated = invoices.map((inv) =>
      inv.id === invId ? { ...inv, status: 'Paid', utr: \`HDFC-\${getNextActivityId()}\` } : inv
    );
    setInvoices(updated);
    if (selectedInvoiceDetail && selectedInvoiceDetail.id === invId) {
      setSelectedInvoiceDetail({
        ...selectedInvoiceDetail,
        status: 'Paid',
        utr: \`HDFC-\${getNextActivityId()}\`,
      });
    }
    showNotification(\`Invoice \${invId} marked as Paid!\`);
  };

  // ==========================================
  // MODULE 7: DEAL HEALTH STATE & HANDLERS
  // ==========================================
  const [dealHealthAnomalies, setDealHealthAnomalies] = useState(initialDealHealthAnomalies);
  const [dealHealthFilter, setDealHealthFilter] = useState('ALL');
  const [selectedAnomalyIds, setSelectedAnomalyIds] = useState(['ANOM-101']);
  const [inspectingAnomalyDeal, setInspectingAnomalyDeal] = useState(null);

  // ==========================================
  // MODULE 8: REPORTS STATE & HANDLERS
  // ==========================================
  const [reportsPeriod, setReportsPeriod] = useState('This Month');
  const [reportsSalesTeam, setReportsSalesTeam] = useState('All Sales Teams');
  const [reportsApprovalStatus, setReportsApprovalStatus] = useState('All Approval Statuses');
  const [reportsProduct, setReportsProduct] = useState('All Products & Services');

  const exportAuditReport = () => {
    showNotification('Exporting comprehensive compliance audit log (CSV)...');
  };

  // ==========================================
  // MODULE 9: PRODUCTS STATE & HANDLERS
  // ==========================================
  const [catalogProducts, setCatalogProducts] = useState(initialCatalogProducts);
  const [products, setProducts] = useState(initialCatalogProducts);
  const [selectedCatalogProduct, setSelectedCatalogProduct] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [activeProductDetail, setActiveProductDetail] = useState(null);
  const [productDetailForm, setProductDetailForm] = useState(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isManagePriceFieldsModalOpen, setIsManagePriceFieldsModalOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Hardware',
    priceUSD: '',
    unit: 'Each',
    tax: '15%',
    variants: '-',
    description: '',
  });

  const openProductDetail = (prod) => {
    setSelectedProductDetail(prod);
    setSelectedCatalogProduct(prod);
  };

  const handleSaveProductChanges = (updatedProd) => {
    if (!updatedProd) return;
    setCatalogProducts(catalogProducts.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    setProducts(products.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    showNotification(\`Product \${updatedProd.name} updated successfully!\`);
  };

  // ==========================================
  // MODULE 10: DISCOUNT CHAINS STATE & HANDLERS
  // ==========================================
  const [tierCeilings, setTierCeilings] = useState(initialTierDiscountCeilings);
  const [categoryCeilings, setCategoryCeilings] = useState(initialCategoryDiscountCeilings);
  const [approvalChains, setApprovalChains] = useState(initialApprovalRoutingRules);
  const [discountTiers, setDiscountTiers] = useState(initialTierDiscountCeilings);
  const [approvalRules, setApprovalRules] = useState(initialApprovalRoutingRules);

  const handleUpdateTierLimit = (tierId, field, value) => {
    setTierCeilings((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, [field]: value } : t))
    );
    showNotification('Discount ceiling limit updated.');
  };

  // ==========================================
  // MODULE 11: CUSTOMER PORTAL STATE & HANDLERS
  // ==========================================
  const [customerPortalTab, setCustomerPortalTab] = useState('My Quotation');
  const [counterDiscount, setCounterDiscount] = useState(15);
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState('2026-10-15');
  const [portalComments, setPortalComments] = useState({
    discountNote: 'We need 15% discount on Extended Warranty to align with enterprise budget.',
    deliveryNote: 'Urgent rollout requirement across Karnataka offices by Oct 15.',
  });
  const [portalStatus, setPortalStatus] = useState('Under Negotiation');
  const [customerPortalQuote, setCustomerPortalQuote] = useState(initialQuotations[0]);
  const [portalMessages, setPortalMessages] = useState([
    {
      id: 1,
      sender: 'Arjun Mehta (Sales Rep)',
      role: 'rep',
      time: '10:30 AM',
      text: 'Hi Sarah, please find the updated quotation Q-1042 attached. Let us know if you need any adjustments.',
    },
    {
      id: 2,
      sender: 'Sarah C. (Acme Corp)',
      role: 'customer',
      time: '11:15 AM',
      text: 'We are reviewing line items. We need an additional 5% discount on Extended Warranty and delivery by Oct 15.',
    },
  ]);
  const [newPortalMessage, setNewPortalMessage] = useState('');

  const handleSendPortalMessage = (e) => {
    if (e) e.preventDefault();
    if (!newPortalMessage.trim()) return;
    const newMsg = {
      id: getNextMsgId(),
      sender: 'Arjun Mehta (Sales Rep)',
      role: 'rep',
      time: 'Just now',
      text: newPortalMessage.trim(),
    };
    setPortalMessages([...portalMessages, newMsg]);
    setNewPortalMessage('');
    showNotification('Message sent to client portal!');
  };

  const handleCustomerApproveQuote = () => {
    setQuotations(
      quotations.map((q) => (q.id === 'Q-1042' ? { ...q, stage: 'Approved' } : q))
    );
    showNotification('Quotation Q-1042 approved by customer!');
  };

  const handleCustomerRequestChange = () => {
    showNotification('Revision request sent to sales team.');
  };

  // ==========================================
  // METRICS & COMPUTED VALUES
  // ==========================================
  const pendingCount = approvals.filter((a) => a.status === 'Pending').length;
  const returnedCount = approvals.filter((a) => a.status === 'Returned').length;
  const approvedCount = 12;
  const openQuotationsCount = quotations.length;
  const atRiskDealsCount = 3;
  const totalPipelineValue = quotations.reduce((acc, q) => acc + (q.amount || 0), 0);

  const activeSubCount = subscriptions.filter((s) => s.status === 'Active').length;
  const pausedSubCount = subscriptions.filter((s) => s.status === 'Paused').length;
  const cancelledSubCount = subscriptions.filter((s) => s.status === 'Cancelled').length;

  const filteredSubscriptions = subscriptions.filter((s) =>
    subscriptionFilter === 'ALL' ? true : s.status === subscriptionFilter
  );
  const filteredApprovals = approvals.filter((a) =>
    approvalFilter === 'ALL' ? true : a.status === approvalFilter
  );
  const filteredInvoices = invoices.filter((i) =>
    invoiceFilter === 'ALL' ? true : i.status === invoiceFilter
  );

  const unpaidCount = invoices.filter((i) => i.status === 'Unpaid').length;
  const paidCount = invoices.filter((i) => i.status === 'Paid').length;
  const reconciledCount = invoices.filter((i) => i.reconciled).length;
  const totalUnpaidAmount = invoices
    .filter((i) => i.status === 'Unpaid')
    .reduce((acc, i) => acc + (i.amount || 0), 0);
  const totalPaidAmount = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((acc, i) => acc + (i.amount || 0), 0);

  const filteredProducts = catalogProducts.filter((p) => {
    const matchesCategory =
      productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
    const matchesSearch =
      !productSearchQuery ||
      p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Deal Health data & Audit logs
  const dealHealthData = {
    anomalies: dealHealthAnomalies,
    score: 84,
  };
  const auditLogs = activities;
`;

const handlersCode = Object.values(allHandlers).join('\n\n');

const sectionPropsBlock = `  const sectionProps = {
    activeModule,
    setActiveModule,
    theme,
    setTheme,
    isThemeMenuOpen,
    setIsThemeMenuOpen,
    themeMenuRef,
    notification,
    showNotification,
    handleLogout,
    activities,
    setActivities,

    // Quotations
    quotations,
    setQuotations,
    quotationViewMode,
    setQuotationViewMode,
    activeQuotationDetail,
    setActiveQuotationDetail,
    isCreateQuotationModalOpen,
    setIsCreateQuotationModalOpen,
    newQuotationForm,
    setNewQuotationForm,
    openQuotationDetail,
    openNewQuotationModal,
    handleCreateQuotationSubmit,
    handleSaveQuotationChanges,
    handleSubmitForApproval,
    updateLineItem,
    deleteLineItem,
    addUpsellItem,
    handleSaveDraft,

    // Approvals
    approvals,
    setApprovals,
    selectedApprovalDetail,
    setSelectedApprovalDetail,
    activeApprovalDetail,
    setActiveApprovalDetail,
    approvalFilter,
    setApprovalFilter,
    filteredApprovals,
    openApprovalDetailModal,
    openApprovalDetailView,
    handleApproveQuotation,
    handleReturnQuotation,
    handleApproveAction,
    handleReturnAction,
    handleDetailApprove,
    handleDetailReturnForRevision,
    handleDetailReject,

    // Fulfillment
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
    isDispatchModalOpen,
    setIsDispatchModalOpen,
    isManualOverrideOpen,
    setIsManualOverrideOpen,
    dispatchForm,
    setDispatchForm,
    openFulfillmentDetail,
    openFulfillmentDetailView,
    handleDispatchOrder,
    handleDispatchSubmit,
    handleConfirmFulfillmentSplit,
    handleOverrideSplitQty,
    handleAcceptSuggestedSplit,
    handleRebalanceStock,

    // Subscriptions
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
    isModifySubscriptionOpen,
    setIsModifySubscriptionOpen,
    modifyForm,
    setModifyForm,
    openSubscriptionDetail,
    openSubscriptionDetailView,
    handleCreateNewPlan,
    handlePauseSubscription,
    handleResumeSubscription,
    handleCancelSubscription,
    handleTogglePauseSubscription,
    handleModifySubscription,

    // Invoices
    invoices,
    setInvoices,
    invoiceFilter,
    setInvoiceFilter,
    selectedInvoiceDetail,
    setSelectedInvoiceDetail,
    activeInvoiceDetail,
    setActiveInvoiceDetail,
    filteredInvoices,
    unpaidCount,
    paidCount,
    reconciledCount,
    totalUnpaidAmount,
    totalPaidAmount,
    openInvoiceDetail,
    openInvoiceDetailView,
    handleMarkInvoicePaid,
    handleRecordDetailPayment,
    handleSendInvoiceReminder,

    // Deal Health
    dealHealthAnomalies,
    setDealHealthAnomalies,
    dealHealthFilter,
    setDealHealthFilter,
    selectedAnomalyIds,
    setSelectedAnomalyIds,
    inspectingAnomalyDeal,
    setInspectingAnomalyDeal,
    dealHealthData,
    toggleSelectAllAnomalies,
    toggleAnomalySelect,
    handleEscalateDeal,
    handleNudgeRep,

    // Reports
    reportsPeriod,
    setReportsPeriod,
    reportsSalesTeam,
    setReportsSalesTeam,
    reportsApprovalStatus,
    setReportsApprovalStatus,
    reportsProduct,
    setReportsProduct,
    handleExportPDF,
    handleExportXLS,
    exportAuditReport,

    // Products
    catalogProducts,
    setCatalogProducts,
    products,
    setProducts,
    selectedCatalogProduct,
    setSelectedCatalogProduct,
    selectedProductDetail,
    setSelectedProductDetail,
    activeProductDetail,
    setActiveProductDetail,
    productDetailForm,
    setProductDetailForm,
    isNewProductModalOpen,
    setIsNewProductModalOpen,
    isManagePriceFieldsModalOpen,
    setIsManagePriceFieldsModalOpen,
    productSearchQuery,
    setProductSearchQuery,
    productCategoryFilter,
    setProductCategoryFilter,
    newProductForm,
    setNewProductForm,
    filteredProducts,
    openProductDetail,
    openProductDetailView,
    handleCreateNewProduct,
    handleSaveProductDetail,
    handleSaveProductChanges,
    handleAddVariantRow,
    handleUpdateVariantRow,
    handleRemoveVariantRow,
    handleAddPricelistRow,
    handleUpdatePricelistRow,
    handleRemovePricelistRow,

    // Discount Chains
    tierCeilings,
    setTierCeilings,
    categoryCeilings,
    setCategoryCeilings,
    approvalChains,
    setApprovalChains,
    discountTiers,
    setDiscountTiers,
    approvalRules,
    setApprovalRules,
    handleAddTierCeiling,
    handleUpdateTierCeiling,
    handleRemoveTierCeiling,
    handleAddCategoryCeiling,
    handleUpdateCategoryCeiling,
    handleRemoveCategoryCeiling,
    handleAddRoutingRule,
    handleUpdateRoutingRule,
    handleRemoveRoutingRule,
    handleSaveDiscountConfiguration,
    handleUpdateTierLimit,

    // Customer Portal
    customerPortalTab,
    setCustomerPortalTab,
    counterDiscount,
    setCounterDiscount,
    requestedDeliveryDate,
    setRequestedDeliveryDate,
    portalComments,
    setPortalComments,
    portalStatus,
    setPortalStatus,
    customerPortalQuote,
    setCustomerPortalQuote,
    portalMessages,
    setPortalMessages,
    newPortalMessage,
    setNewPortalMessage,
    handleSendPortalMessage,
    handleCustomerApproveQuote,
    handleCustomerRequestChange,
    handleSubmitCustomerRequest,
    handleConfirmCustomerQuotation,

    // Global Metrics & Nav
    auditLogs,
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
    kanbanStages,
    navModules,
  };
`;

const jsxReturn = `  return (
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

const completeFile = imports + '\n' + stateAndLogic + '\n' + handlersCode + '\n\n' + sectionPropsBlock + '\n' + jsxReturn;

fs.writeFileSync('src/components/Dashboard.jsx', completeFile, 'utf8');
console.log('Successfully written src/components/Dashboard.jsx! File size:', completeFile.length);
