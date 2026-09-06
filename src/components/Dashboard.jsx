import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  formatINR,
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
  initialCustomers,
  navModules,
  kanbanStages,
} from '../data/initialData.js';
import { mongoDatabaseService } from '../services/mongoDatabaseService.js';

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
import { DEMO_ROLES_CONFIG } from '../services/mongoAuthService.js';

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Active User Profile State
  const [activeUser, setActiveUser] = useState(() => {
    try {
      const stored = localStorage.getItem('dealflow_active_user') || sessionStorage.getItem('dealflow_active_user');
      if (stored) return JSON.parse(stored);
      return DEMO_ROLES_CONFIG[0];
    } catch {
      return DEMO_ROLES_CONFIG[0];
    }
  });

  // Navigation module state
  const [activeModule, setActiveModule] = useState(() => {
    return location.state?.targetModule || activeUser?.defaultModule || 'Dashboard';
  });

  // Handle URL role parameter on initial load or change (e.g. /dashboard?role=founder)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam) {
      const matched = DEMO_ROLES_CONFIG.find(
        (r) => r.id === roleParam.toLowerCase() || r.role.toLowerCase().includes(roleParam.toLowerCase())
      );
      if (matched) {
        const userProfile = {
          _id: `65e8a1f2b3c4d5e6f7a8b9c_${matched.id}`,
          email: matched.email,
          name: matched.name,
          role: matched.role,
          company: matched.company,
          defaultModule: matched.defaultModule,
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('dealflow_active_user', JSON.stringify(userProfile));
        setActiveUser(userProfile);
        if (location.state?.targetModule) {
          setActiveModule(location.state.targetModule);
        } else {
          setActiveModule(matched.defaultModule);
        }
      }
    }
  }, [location.search, location.state]);

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
    localStorage.removeItem('dealflow_auth_token');
    localStorage.removeItem('dealflow_active_user');
    sessionStorage.removeItem('dealflow_auth_token');
    sessionStorage.removeItem('dealflow_active_user');
    if (setIsAuthenticated) setIsAuthenticated(false);
    navigate('/');
  };

  // Activity stream state stored in MongoDB
  const [activities, setActivities] = useState(() => mongoDatabaseService.getCollection('activities'));

  // ==========================================
  // MODULE 1 & 2: QUOTATIONS STATE & HANDLERS (MongoDB)
  // ==========================================
  const [quotations, setQuotations] = useState(() => mongoDatabaseService.getCollection('quotations'));
  const [quotationViewMode, setQuotationViewMode] = useState('board');
  const [activeQuotationDetail, setActiveQuotationDetail] = useState(null);
  const [isCreateQuotationModalOpen, setIsCreateQuotationModalOpen] = useState(false);
  const [newQuotationForm, setNewQuotationForm] = useState({
    client: '',
    city: 'Bengaluru, Karnataka',
    gstin: '',
    title: '',
    priceList: 'Standard Indian Enterprise Tier 2026 (INR)',
    amount: '450000',
    stage: 'Draft',
    contact: '',
    initialProduct: 'Enterprise Core License & Platform',
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
    if (!newQuotationForm.client?.trim() || !newQuotationForm.title?.trim()) {
      showNotification('Please provide client name and quotation title.');
      return;
    }
    const newId = `Q-${1040 + quotations.length + 1}`;
    const parsedAmount = parseFloat(newQuotationForm.amount) || 450000;
    const clientName = newQuotationForm.client.trim();
    const cleanClient = clientName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const newQuote = {
      id: newId,
      client: clientName,
      city: newQuotationForm.city?.trim() || 'Bengaluru, Karnataka',
      gstin: newQuotationForm.gstin?.trim() || '29AABCA9999F1Z5',
      title: newQuotationForm.title.trim(),
      amount: parsedAmount,
      stage: newQuotationForm.stage || 'Draft',
      contact: newQuotationForm.contact?.trim() || `contact@${cleanClient || 'enterprise'}.com`,
      priceList: newQuotationForm.priceList || 'Standard Indian Enterprise Tier 2026 (INR)',
      date: new Date().toISOString().split('T')[0],
      lineItems: [
        {
          id: 1,
          product: newQuotationForm.initialProduct?.trim() || 'Enterprise Core License & Platform',
          qty: 1,
          price: parsedAmount > 100000 ? parsedAmount - 100000 : parsedAmount,
          discount: 5,
          limit: 10,
        },
        ...(parsedAmount > 100000
          ? [{ id: 2, product: 'Standard Deployment & Implementation', qty: 1, price: 100000, discount: 0, limit: 10 }]
          : []),
      ],
      notes: newQuotationForm.notes?.trim() || 'Created via DealFlow360 Quotation Builder.',
    };

    setQuotations([newQuote, ...quotations]);
    setIsCreateQuotationModalOpen(false);
    setNewQuotationForm({
      client: '',
      city: 'Bengaluru, Karnataka',
      gstin: '',
      title: '',
      priceList: 'Standard Indian Enterprise Tier 2026 (INR)',
      amount: '450000',
      stage: 'Draft',
      contact: '',
      initialProduct: 'Enterprise Core License & Platform',
      notes: '',
    });

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `New Quotation ${newId} created for ${newQuote.client}`,
        category: 'Quotation Created',
        time: 'Just now',
        type: 'success',
        badge: newQuote.stage,
      },
      ...prev,
    ]);

    showNotification(`Quotation ${newId} successfully created for ${newQuote.client}!`);
  };

  const handleSaveQuotationChanges = (updatedQuote) => {
    if (!updatedQuote) return;
    setQuotations(quotations.map((q) => (q.id === updatedQuote.id ? updatedQuote : q)));
    setActiveQuotationDetail(updatedQuote);
    showNotification(`Changes saved to quotation ${updatedQuote.id}`);
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
        { time: 'Just now', user: 'Arjun Mehta (Sales Rep)', action: `Submitted ${targetQuote.id} for approval` },
      ],
    };

    setApprovals([newApp, ...approvals]);

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `${targetQuote.client} quotation ${targetQuote.id} submitted for approval`,
        category: 'Quotation Workflow',
        time: 'Just now',
        type: 'warning',
        badge: 'Pending Approval',
      },
      ...prev,
    ]);

    showNotification(`Quotation ${targetQuote.id} submitted for manager review!`);
  };

  // ==========================================
  // MODULE 3: APPROVALS STATE & HANDLERS (MongoDB)
  // ==========================================
  const [approvals, setApprovals] = useState(() => mongoDatabaseService.getCollection('approvals'));
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
        title: `${app.customer} quotation ${app.quotationId} approved by ${app.assignedTo}`,
        category: 'Executive Approval',
        time: 'Just now',
        type: 'success',
        badge: 'Approved',
      },
      ...prev,
    ]);

    showNotification(`Quotation ${app.quotationId} approved!`);
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
        title: `${app.customer} quotation ${app.quotationId} returned by ${app.assignedTo}`,
        category: 'Executive Approval',
        time: 'Just now',
        type: 'warning',
        badge: 'Returned',
      },
      ...prev,
    ]);

    showNotification(`Quotation ${app.quotationId} returned for revision.`);
  };

  const handleApproveAction = handleApproveQuotation;
  const handleReturnAction = handleReturnQuotation;

  // ==========================================
  // MODULE 4: FULFILLMENT STATE & HANDLERS (MongoDB)
  // ==========================================
  const [warehouseStock, setWarehouseStock] = useState(() => mongoDatabaseService.getCollection('warehouseStock'));
  const [fulfillmentOrders, setFulfillmentOrders] = useState(() => mongoDatabaseService.getCollection('fulfillment'));
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

  const handleDispatchOrder = () => {
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
    showNotification(`Dispatch schedule confirmed! e-Way Bill ${ewayNumber} issued.`);
  };

  const [isNewFulfillmentModalOpen, setIsNewFulfillmentModalOpen] = useState(false);
  const [newFulfillmentForm, setNewFulfillmentForm] = useState({
    customer: '',
    city: 'Bengaluru, Karnataka',
    gstin: '29AABCA9999F1Z5',
    product: 'Laptop Pro 14',
    qty: 10,
    warehouses: 'Main + East Depot',
    mainWarehouseQty: 7,
    eastDepotQty: 3,
    carrier: 'BlueDart Apex Express',
    status: 'Split Pending',
    notes: 'Dual warehouse stock allocation for rapid dispatch.',
  });

  const openNewFulfillmentModal = () => {
    setIsNewFulfillmentModalOpen(true);
  };

  const handleCreateFulfillmentSubmit = (e) => {
    if (e) e.preventDefault();
    if (!newFulfillmentForm.customer?.trim()) {
      showNotification('Please provide a customer name for the fulfillment order.');
      return;
    }

    const nextId = `Q-${1050 + fulfillmentOrders.length + 1}`;
    const totalQty = parseInt(newFulfillmentForm.qty, 10) || 10;
    const mainQty = parseInt(newFulfillmentForm.mainWarehouseQty, 10) || Math.ceil(totalQty * 0.7);
    const eastQty = totalQty >= mainQty ? totalQty - mainQty : 0;
    const carrier = newFulfillmentForm.carrier || 'BlueDart Apex Express';
    const status = newFulfillmentForm.status || 'Split Pending';
    const ewayNumber = status === 'Ready to Ship' ? getNextEwayBill() : (status === 'Backorder' ? 'Pending Stock Balance' : getNextEwayBill());

    const newOrder = {
      id: nextId,
      customer: newFulfillmentForm.customer.trim(),
      city: newFulfillmentForm.city || 'Bengaluru, Karnataka',
      gstin: newFulfillmentForm.gstin || '29AABCA9999F1Z5',
      status: status,
      warehouses: eastQty > 0 ? 'Main + East Depot' : 'Main Warehouse',
      ewayBill: ewayNumber,
      carrier: carrier,
      warehouseSplit: [
        {
          warehouse: 'Main Warehouse',
          hub: 'Bhiwandi Hub, Mumbai',
          qtyFulfilled: mainQty,
          estShipments: 1,
          costINR: mainQty * 190,
          costUSD: `$${Math.round(mainQty * 2.3)}`,
        },
        ...(eastQty > 0
          ? [
              {
                warehouse: 'East Depot',
                hub: 'Sriperumbudur Hub, Chennai',
                qtyFulfilled: eastQty,
                estShipments: 1,
                costINR: eastQty * 400,
                costUSD: `$${Math.round(eastQty * 4.8)}`,
              },
            ]
          : []),
      ],
      splitBannerNote: eastQty > 0
        ? '"Consolidate Remaining Backorder" prompt appears automatically once East Depot restocks.'
        : 'Single warehouse fulfillment confirmed.',
      allocations: [
        {
          product: newFulfillmentForm.product || 'Laptop Pro 14',
          qty: totalQty,
          mainDepot: mainQty,
          eastDepot: eastQty,
          status: status === 'Ready to Ship' ? 'Packed & Barcoded' : (status === 'Backorder' ? 'Shortage Pending' : 'Split Scheduled'),
        },
      ],
      notes: newFulfillmentForm.notes || 'Created manually via Fulfillment Manager.',
    };

    const updated = [newOrder, ...fulfillmentOrders];
    setFulfillmentOrders(updated);
    setIsNewFulfillmentModalOpen(false);
    setNewFulfillmentForm({
      customer: '',
      city: 'Bengaluru, Karnataka',
      gstin: '29AABCA9999F1Z5',
      product: 'Laptop Pro 14',
      qty: 10,
      warehouses: 'Main + East Depot',
      mainWarehouseQty: 7,
      eastDepotQty: 3,
      carrier: 'BlueDart Apex Express',
      status: 'Split Pending',
      notes: 'Dual warehouse stock allocation for rapid dispatch.',
    });

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `New Fulfillment Order ${nextId} created for ${newOrder.customer}`,
        category: 'Fulfillment & Dispatch',
        time: 'Just now',
        type: 'success',
        badge: newOrder.status,
      },
      ...prev,
    ]);

    showNotification(`Fulfillment order ${nextId} created successfully!`);
  };

  // ==========================================
  // MODULE 5: SUBSCRIPTIONS STATE & HANDLERS (MongoDB)
  // ==========================================
  const [subscriptions, setSubscriptions] = useState(() => mongoDatabaseService.getCollection('subscriptions'));
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
    showNotification(`New plan "${newPlanForm.name}" created successfully!`);
    setIsNewPlanModalOpen(false);
    setNewPlanForm({ name: '', amount: '', billingCycle: 'Monthly', users: 'Unlimited', features: '' });
  };

  const handlePauseSubscription = (subId) => {
    setSubscriptions(
      subscriptions.map((s) => (s.id === subId ? { ...s, status: 'Paused', nextBill: '-' } : s))
    );
    showNotification(`Subscription ${subId} paused.`);
  };

  const handleResumeSubscription = (subId) => {
    setSubscriptions(
      subscriptions.map((s) => (s.id === subId ? { ...s, status: 'Active', nextBill: 'Oct 15' } : s))
    );
    showNotification(`Subscription ${subId} resumed.`);
  };

  const handleCancelSubscription = (subId) => {
    setSubscriptions(
      subscriptions.map((s) => (s.id === subId ? { ...s, status: 'Cancelled', nextBill: '-' } : s))
    );
    showNotification(`Subscription ${subId} cancelled.`);
  };

  // ==========================================
  // MODULE 6: INVOICES STATE & HANDLERS (MongoDB)
  // ==========================================
  const [invoices, setInvoices] = useState(() => mongoDatabaseService.getCollection('invoices'));
  const [invoiceFilter, setInvoiceFilter] = useState('ALL');
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState(null);
  const [activeInvoiceDetail, setActiveInvoiceDetail] = useState(null);

  const openInvoiceDetail = (inv) => {
    setSelectedInvoiceDetail(inv);
  };

  const handleMarkInvoicePaid = (invId) => {
    const updated = invoices.map((inv) =>
      inv.id === invId ? { ...inv, status: 'Paid', utr: `HDFC-${getNextActivityId()}` } : inv
    );
    setInvoices(updated);
    if (selectedInvoiceDetail && selectedInvoiceDetail.id === invId) {
      setSelectedInvoiceDetail({
        ...selectedInvoiceDetail,
        status: 'Paid',
        utr: `HDFC-${getNextActivityId()}`,
      });
    }
    showNotification(`Invoice ${invId} marked as Paid!`);
  };

  // ==========================================
  // MODULE 7: DEAL HEALTH STATE & HANDLERS (MongoDB)
  // ==========================================
  const [dealHealthAnomalies, setDealHealthAnomalies] = useState(() => mongoDatabaseService.getCollection('dealHealth'));
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
  // MODULE 9: PRODUCTS STATE & HANDLERS (MongoDB)
  // ==========================================
  const [catalogProducts, setCatalogProducts] = useState(() => mongoDatabaseService.getCollection('products'));
  const [products, setProducts] = useState(() => mongoDatabaseService.getCollection('products'));
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
    showNotification(`Product ${updatedProd.name} updated successfully!`);
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
  const [customers, setCustomers] = useState(() => mongoDatabaseService.getCollection('customers') || initialCustomers);
  const [activeCustomer, setActiveCustomer] = useState(() => initialCustomers[0]);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    companyName: '',
    legalEntity: '',
    contactPerson: '',
    designation: 'VP Procurement',
    email: '',
    phone: '',
    city: 'Bengaluru, Karnataka',
    gstin: '',
    address: '',
    priceList: 'Standard Indian Enterprise Tier 2026 (INR)',
    paymentTerms: 'Net-30 Days from Delivery Invoice',
    assignedRep: 'Arjun Mehta (Enterprise Sales - South)',
    notes: '',
  });

  const handleCreateCustomerSubmit = (e) => {
    if (e) e.preventDefault();
    if (!newCustomerForm.companyName?.trim() || !newCustomerForm.contactPerson?.trim()) {
      showNotification('Please provide company name and primary contact person.');
      return;
    }
    const cleanCompany = newCustomerForm.companyName.trim();
    const cleanSlug = cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, '');
    const newCustId = `CUST-${100 + customers.length + 1}`;
    const newCust = {
      id: newCustId,
      companyName: cleanCompany,
      legalEntity: newCustomerForm.legalEntity?.trim() || `${cleanCompany} Private Limited`,
      contactPerson: newCustomerForm.contactPerson.trim(),
      designation: newCustomerForm.designation?.trim() || 'VP Procurement',
      email: newCustomerForm.email?.trim() || `procurement@${cleanSlug || 'corp'}.com`,
      phone: newCustomerForm.phone?.trim() || '+91 80 4122 8900',
      city: newCustomerForm.city?.trim() || 'Bengaluru, Karnataka',
      gstin: newCustomerForm.gstin?.trim() || '29AABCA9999F1Z5',
      address: newCustomerForm.address?.trim() || `${newCustomerForm.city || 'Bengaluru, Karnataka'} Tech Park`,
      priceList: newCustomerForm.priceList || 'Standard Indian Enterprise Tier 2026 (INR)',
      paymentTerms: newCustomerForm.paymentTerms || 'Net-30 Days from Delivery Invoice',
      assignedRep: newCustomerForm.assignedRep || 'Arjun Mehta (Enterprise Sales - South)',
      quotationNumber: `Q-${1040 + quotations.length + 1}`,
      commercialBase: 1240000,
    };

    const updated = [newCust, ...customers];
    setCustomers(updated);
    setActiveCustomer(newCust);
    setIsAddCustomerModalOpen(false);
    setNewCustomerForm({
      companyName: '',
      legalEntity: '',
      contactPerson: '',
      designation: 'VP Procurement',
      email: '',
      phone: '',
      city: 'Bengaluru, Karnataka',
      gstin: '',
      address: '',
      priceList: 'Standard Indian Enterprise Tier 2026 (INR)',
      paymentTerms: 'Net-30 Days from Delivery Invoice',
      assignedRep: 'Arjun Mehta (Enterprise Sales - South)',
      notes: '',
    });

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `Customer ${newCust.companyName} manually registered (${newCustId})`,
        category: 'Customer Created',
        time: 'Just now',
        type: 'success',
        badge: 'Client Portal',
      },
      ...prev,
    ]);

    showNotification(`Customer ${newCust.companyName} added successfully!`);
  };

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

  // Auto-sync all module mutations to persistent MongoDB database
  useEffect(() => {
    mongoDatabaseService.saveCollection('customers', customers);
  }, [customers]);

  useEffect(() => {
    mongoDatabaseService.saveCollection('quotations', quotations);
  }, [quotations]);

  useEffect(() => {
    mongoDatabaseService.saveCollection('approvals', approvals);
  }, [approvals]);

  useEffect(() => {
    mongoDatabaseService.saveCollection('fulfillment', fulfillmentOrders);
  }, [fulfillmentOrders]);

  useEffect(() => {
    mongoDatabaseService.saveCollection('warehouseStock', warehouseStock);
  }, [warehouseStock]);

  useEffect(() => {
    mongoDatabaseService.saveCollection('subscriptions', subscriptions);
  }, [subscriptions]);

  useEffect(() => {
    mongoDatabaseService.saveCollection('invoices', invoices);
  }, [invoices]);

  useEffect(() => {
    mongoDatabaseService.saveCollection('products', catalogProducts);
  }, [catalogProducts]);

  useEffect(() => {
    mongoDatabaseService.saveCollection('dealHealth', dealHealthAnomalies);
  }, [dealHealthAnomalies]);

  useEffect(() => {
    mongoDatabaseService.saveCollection('activities', activities);
  }, [activities]);

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

  // ==========================================
  // EXTRACTED HANDLERS
  // ==========================================
  const handleDetailApprove = () => {
    if (!activeApprovalDetail) return;
    const appId = activeApprovalDetail.id;
    const currentIdx = activeApprovalDetail.currentStageIndex ?? 1;
    const stages = activeApprovalDetail.workflowStages || ['Submitted', 'Sales Manager', 'Finance', 'Confirmed'];
    const nextIdx = Math.min(currentIdx + 1, stages.length - 1);
    const isFinalStage = nextIdx === stages.length - 1;

    const newAuditEntry = {
      user: 'M. Shah (Sales Mgr)',
      action: isFinalStage ? 'Fully Approved' : 'Approved & Advanced',
      date: 'Aug 23',
      note: isFinalStage ? 'Final commercial authorization confirmed.' : 'Authorized discount concession. Escalated to Finance review.',
    };

    const updatedApproval = {
      ...activeApprovalDetail,
      currentStageIndex: nextIdx,
      stage: stages[nextIdx],
      status: isFinalStage ? 'Approved' : 'Pending',
      auditHistory: [...(activeApprovalDetail.auditHistory || []), newAuditEntry],
    };

    setActiveApprovalDetail(updatedApproval);
    setApprovals(approvals.map((a) => (a.id === appId ? updatedApproval : a)));

    if (isFinalStage) {
      setQuotations(
        quotations.map((q) => (q.id === activeApprovalDetail.quotationId ? { ...q, stage: 'Approved' } : q))
      );
    }

    setActivities([
      {
        id: Date.now(),
        title: `${activeApprovalDetail.customer} quotation ${activeApprovalDetail.quotationId} approved by M. Shah`,
        category: 'Executive Approval',
        time: 'Just now',
        type: 'success',
        badge: 'Approved',
      },
      ...activities,
    ]);

    showNotification(`Quotation ${activeApprovalDetail.quotationId} approved and forwarded to ${stages[nextIdx]}!`);
  };

  const handleDetailReturnForRevision = () => {
    if (!activeApprovalDetail) return;
    const appId = activeApprovalDetail.id;

    const newAuditEntry = {
      user: 'M. Shah (Sales Mgr)',
      action: 'Returned for Revision',
      date: 'Aug 23',
      note: 'Returned for revision: Setup service discount (18%) exceeds 10% limit. Adjust pricing.',
    };

    const updatedApproval = {
      ...activeApprovalDetail,
      currentStageIndex: 0,
      stage: 'Returned to Rep',
      status: 'Returned',
      auditHistory: [...(activeApprovalDetail.auditHistory || []), newAuditEntry],
    };

    setActiveApprovalDetail(updatedApproval);
    setApprovals(approvals.map((a) => (a.id === appId ? updatedApproval : a)));

    setQuotations(
      quotations.map((q) => (q.id === activeApprovalDetail.quotationId ? { ...q, stage: 'Draft' } : q))
    );

    setActivities([
      {
        id: Date.now(),
        title: `${activeApprovalDetail.customer} quotation ${activeApprovalDetail.quotationId} returned for revision`,
        category: 'Revision Requested',
        time: 'Just now',
        type: 'warning',
        badge: 'Returned',
      },
      ...activities,
    ]);

    showNotification(`Quotation ${activeApprovalDetail.quotationId} returned to rep for revision.`);
  };

  const handleDetailReject = () => {
    if (!activeApprovalDetail) return;
    const appId = activeApprovalDetail.id;

    const newAuditEntry = {
      user: 'M. Shah (Sales Mgr)',
      action: 'Rejected',
      date: 'Aug 23',
      note: 'Concession request rejected. Exceeds permissible company margin thresholds.',
    };

    const updatedApproval = {
      ...activeApprovalDetail,
      stage: 'Rejected',
      status: 'Returned',
      auditHistory: [...(activeApprovalDetail.auditHistory || []), newAuditEntry],
    };

    setActiveApprovalDetail(updatedApproval);
    setApprovals(approvals.map((a) => (a.id === appId ? updatedApproval : a)));

    setQuotations(
      quotations.map((q) => (q.id === activeApprovalDetail.quotationId ? { ...q, stage: 'Draft' } : q))
    );

    showNotification(`Quotation ${activeApprovalDetail.quotationId} discount concession rejected.`);
  };

  const handleSubmitCustomerRequest = (e) => {
    if (e) e.preventDefault();
    const discountVal = parseFloat(counterDiscount) || 0;
    const isExceedingThreshold = discountVal > 10;

    if (isExceedingThreshold) {
      setPortalStatus('Pending Approval (Re-entered Screen 6)');

      setQuotations((prev) =>
        prev.map((q) =>
          q.id === 'Q-1042'
            ? {
                ...q,
                stage: 'Pending Approval',
                notes: `Customer counter-request: ${discountVal}% discount on Extended Warranty & delivery on ${requestedDeliveryDate}.`,
              }
            : q
        )
      );

      const newAuditItem = {
        time: 'Just now',
        user: 'Acme Corp (Customer Portal)',
        action: `Counter-proposal submitted: ${discountVal}% discount (+5pt over 10% limit) & delivery date requested for ${requestedDeliveryDate}. Re-entered Screen 6.`,
      };

      setApprovals((prev) =>
        prev.map((a) =>
          a.quotationId === 'Q-1042'
            ? {
                ...a,
                status: 'Pending',
                stage: 'Sales Manager',
                currentStageIndex: 1,
                auditTrail: [...(a.auditTrail || []), newAuditItem],
              }
            : a
        )
      );

      setActivities((prev) => [
        {
          id: getNextActivityId(),
          title: `Acme Corp submitted counter-proposal (${discountVal}% discount) • Re-entered Screen 6 Approval`,
          category: 'Customer Negotiation',
          time: 'Just now',
          type: 'warning',
          badge: 'Re-entered Approval',
        },
        ...prev,
      ]);

      showNotification(`Counter-proposal submitted. Threshold exceeded: Quote re-entered Screen 6 Approval for M. Shah!`);
    } else {
      setPortalStatus('Counter-Proposal Submitted');
      showNotification(`Counter-proposal submitted successfully to sales rep.`);
    }
  };

  const handleConfirmCustomerQuotation = () => {
    setPortalStatus('Confirmed');

    setQuotations((prev) =>
      prev.map((q) =>
        q.id === 'Q-1042'
          ? {
              ...q,
              stage: 'Confirmed',
              notes: `Quotation confirmed directly by Acme Corp customer portal.`,
            }
          : q
      )
    );

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `Acme Corp confirmed Quotation Q-1042 directly via Customer Portal`,
        category: 'Customer Confirmation',
        time: 'Just now',
        type: 'success',
        badge: 'Confirmed',
      },
      ...prev,
    ]);

    showNotification(`Quotation Q-1042 confirmed by Acme Corp! Transitioned to Fulfillment.`);
  };

  const toggleSelectAllAnomalies = () => {
    const visibleIds = dealHealthAnomalies
      .filter((a) => (dealHealthFilter === 'ALL' ? true : a.type === dealHealthFilter))
      .map((a) => a.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedAnomalyIds.includes(id));
    if (allSelected) {
      setSelectedAnomalyIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedAnomalyIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const toggleAnomalySelect = (id) => {
    setSelectedAnomalyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEscalateDeal = (targetId) => {
    const idsToEscalate = targetId
      ? [targetId]
      : (selectedAnomalyIds.length > 0 ? selectedAnomalyIds : ['ANOM-102']);

    setDealHealthAnomalies((prev) =>
      prev.map((item) => {
        if (idsToEscalate.includes(item.id)) {
          return {
            ...item,
            action: 'Escalated to Manager',
            status: 'Escalated',
            escalated: true,
          };
        }
        return item;
      })
    );

    const escalatedDeals = dealHealthAnomalies.filter((d) => idsToEscalate.includes(d.id));
    const dealNames = escalatedDeals.map((d) => d.deal).join(', ') || 'Selected deals';

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `Deal anomaly escalated for ${dealNames} to Regional Sales Manager`,
        category: 'Leadership Escalation',
        time: 'Just now',
        type: 'warning',
        badge: 'Escalated',
      },
      ...prev,
    ]);

    if (inspectingAnomalyDeal && idsToEscalate.includes(inspectingAnomalyDeal.id)) {
      setInspectingAnomalyDeal((prev) => ({
        ...prev,
        action: 'Escalated to Manager',
        status: 'Escalated',
        escalated: true,
      }));
    }

    showNotification(`Escalated ${dealNames} to Sales Leadership & Manager!`);
  };

  const handleNudgeRep = (targetId) => {
    const idsToNudge = targetId
      ? [targetId]
      : (selectedAnomalyIds.length > 0 ? selectedAnomalyIds : ['ANOM-101']);

    setDealHealthAnomalies((prev) =>
      prev.map((item) => {
        if (idsToNudge.includes(item.id)) {
          return {
            ...item,
            action: 'Nudge sent',
            nudgeCount: (item.nudgeCount || 0) + 1,
          };
        }
        return item;
      })
    );

    const nudgedDeals = dealHealthAnomalies.filter((d) => idsToNudge.includes(d.id));
    const dealDetails = nudgedDeals.map((d) => `${d.deal} (${d.rep})`).join(', ') || 'Assigned reps';

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `Automated nudge sent to sales rep for ${dealDetails}`,
        category: 'Deal Velocity Nudge',
        time: 'Just now',
        type: 'info',
        badge: 'Nudge Sent',
      },
      ...prev,
    ]);

    if (inspectingAnomalyDeal && idsToNudge.includes(inspectingAnomalyDeal.id)) {
      setInspectingAnomalyDeal((prev) => ({
        ...prev,
        action: 'Nudge sent',
        nudgeCount: (prev.nudgeCount || 0) + 1,
      }));
    }

    showNotification(`Nudge notification sent to ${dealDetails} via Slack & Email!`);
  };

  const handleAddTierCeiling = () => {
    const newTier = {
      id: getNextActivityId(),
      tier: 'Platinum',
      maxDiscount: '20 percent',
      discountValue: 20,
    };
    setTierCeilings((prev) => [...prev, newTier]);
  };

  const handleUpdateTierCeiling = (id, field, val) => {
    setTierCeilings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveTierCeiling = (id) => {
    setTierCeilings((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCategoryCeiling = () => {
    const newCat = {
      id: getNextActivityId(),
      category: 'Software Retainers',
      maxDiscount: '20 percent',
      discountValue: 20,
    };
    setCategoryCeilings((prev) => [...prev, newCat]);
  };

  const handleUpdateCategoryCeiling = (id, field, val) => {
    setCategoryCeilings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveCategoryCeiling = (id) => {
    setCategoryCeilings((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddRoutingRule = () => {
    const newRule = {
      id: getNextActivityId(),
      discountRange: 'Over 25% Critical Concession',
      maxDiscount: 'VP of Sales & CFO Approval',
      role: 'Board Level Escalation',
      riskLevel: 'CRITICAL',
    };
    setApprovalChains((prev) => [...prev, newRule]);
  };

  const handleUpdateRoutingRule = (id, field, val) => {
    setApprovalChains((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveRoutingRule = (id) => {
    setApprovalChains((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveDiscountConfiguration = () => {
    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: 'Discount ceilings & approval escalation chain saved',
        category: 'Compliance & Governance',
        time: 'Just now',
        type: 'success',
        badge: 'Config Saved',
      },
      ...prev,
    ]);
    showNotification('Discount tiers and approval chain configuration saved successfully!');
  };

  const handleOverrideSplitQty = (warehouseName, delta) => {
    if (!activeFulfillmentDetail || !activeFulfillmentDetail.warehouseSplit) return;
    const updatedSplit = activeFulfillmentDetail.warehouseSplit.map((split) => {
      if (split.warehouse === warehouseName) {
        const newQty = Math.max(0, split.qtyFulfilled + delta);
        return {
          ...split,
          qtyFulfilled: newQty,
          costINR: newQty * 190,
          costUSD: `$${Math.round((newQty * 190) / 83)}`,
        };
      }
      return split;
    });

    setActiveFulfillmentDetail({
      ...activeFulfillmentDetail,
      warehouseSplit: updatedSplit,
    });
  };

  const handleAcceptSuggestedSplit = () => {
    if (!activeFulfillmentDetail) return;
    const orderId = activeFulfillmentDetail.id;
    const ewayNumber = getNextEwayBill();

    const updated = {
      ...activeFulfillmentDetail,
      status: 'Ready to Ship',
      ewayBill: ewayNumber,
    };

    setActiveFulfillmentDetail(updated);
    setFulfillmentOrders(
      fulfillmentOrders.map((o) => (o.id === orderId ? updated : o))
    );

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `Suggested split accepted for ${activeFulfillmentDetail.customer} (${orderId}) • ${ewayNumber}`,
        category: 'Fulfillment Dispatch',
        time: 'Just now',
        type: 'success',
        badge: 'Ready to Ship',
      },
      ...prev,
    ]);

    showNotification(`Suggested warehouse split accepted for ${orderId}! e-Way Bill generated.`);
  };

  const openFulfillmentDetailView = (order) => {
    setActiveFulfillmentDetail(JSON.parse(JSON.stringify(order)));
    setIsManualOverrideOpen(false);
    setActiveModule('Fulfillment');
  };

  const handleRebalanceStock = (fromWarehouse, toWarehouse, productName, amount = 2) => {
    setWarehouseStock((prev) =>
      prev.map((item) => {
        if (item.warehouse === fromWarehouse && item.product === productName) {
          return {
            ...item,
            inStock: Math.max(0, item.inStock - amount),
            available: Math.max(0, item.available - amount),
          };
        }
        if (item.warehouse === toWarehouse && item.product === productName) {
          return {
            ...item,
            inStock: item.inStock + amount,
            available: item.available + amount,
          };
        }
        return item;
      })
    );
    showNotification(`Rebalanced ${amount} units of ${productName} from ${fromWarehouse} to ${toWarehouse}.`);
  };

  const handleRecordDetailPayment = () => {
    if (!activeInvoiceDetail) return;
    const invId = activeInvoiceDetail.id;
    const utrNumber = `HDFC-UTR-${getNextActivityId()}910`;

    const updated = {
      ...activeInvoiceDetail,
      status: 'Paid',
      utr: utrNumber,
      paymentMode: 'NEFT / RTGS (Direct Settlement)',
    };

    setActiveInvoiceDetail(updated);
    setInvoices((prev) => prev.map((inv) => (inv.id === invId ? updated : inv)));

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `Payment recorded for ${activeInvoiceDetail.customer} (${invId}) • ${utrNumber}`,
        category: 'Invoice Settlement',
        time: 'Just now',
        type: 'success',
        badge: 'Paid',
      },
      ...prev,
    ]);

    showNotification(`Payment recorded for ${invId}! Stepper advanced to Paid.`);
  };

  const openInvoiceDetailView = (inv) => {
    setActiveInvoiceDetail(JSON.parse(JSON.stringify(inv)));
    setSelectedInvoiceDetail(null);
    setActiveModule('Invoices');
  };

  const openProductDetailView = (prod) => {
    const target = prod || catalogProducts[0];
    const cloned = JSON.parse(JSON.stringify(target));
    setActiveProductDetail(cloned);
    setProductDetailForm(cloned);
    setSelectedCatalogProduct(null);
    setActiveModule('Products');
  };

  const handleSaveProductDetail = () => {
    if (!productDetailForm) return;
    setCatalogProducts((prev) =>
      prev.map((p) => (p.id === productDetailForm.id ? { ...productDetailForm } : p))
    );
    setActiveProductDetail({ ...productDetailForm });
    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `Product "${productDetailForm.name}" & pricelist rules updated`,
        category: 'Catalog Management',
        time: 'Just now',
        type: 'success',
        badge: 'Saved',
      },
      ...prev,
    ]);
    showNotification(`Product details for "${productDetailForm.name}" updated successfully!`);
  };

  const handleAddVariantRow = () => {
    if (!productDetailForm) return;
    const newVariant = {
      id: getNextActivityId(),
      attribute: 'New Option',
      values: 'Standard',
      extraPrice: '0',
    };
    setProductDetailForm((prev) => ({
      ...prev,
      productVariants: [...(prev.productVariants || []), newVariant],
    }));
  };

  const handleUpdateVariantRow = (index, field, val) => {
    setProductDetailForm((prev) => ({
      ...prev,
      productVariants: (prev.productVariants || []).map((item, idx) =>
        idx === index ? { ...item, [field]: val } : item
      ),
    }));
  };

  const handleRemoveVariantRow = (index) => {
    setProductDetailForm((prev) => ({
      ...prev,
      productVariants: (prev.productVariants || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleAddPricelistRow = () => {
    if (!productDetailForm) return;
    const newPricelist = {
      id: getNextActivityId(),
      tier: 'Silver',
      currency: 'USD',
      priceRule: 'Price minus 5 percent base',
    };
    setProductDetailForm((prev) => ({
      ...prev,
      pricelists: [...(prev.pricelists || []), newPricelist],
    }));
  };

  const handleUpdatePricelistRow = (index, field, val) => {
    setProductDetailForm((prev) => ({
      ...prev,
      pricelists: (prev.pricelists || []).map((item, idx) =>
        idx === index ? { ...item, [field]: val } : item
      ),
    }));
  };

  const handleRemovePricelistRow = (index) => {
    setProductDetailForm((prev) => ({
      ...prev,
      pricelists: (prev.pricelists || []).filter((_, idx) => idx !== index),
    }));
  };

  const updateLineItem = (itemId, field, value) => {
    if (!activeQuotationDetail) return;
    const updatedItems = activeQuotationDetail.lineItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    });

    const newTotal = updatedItems.reduce((acc, item) => {
      const lineSubtotal = (parseFloat(item.price) || 0) * (parseInt(item.qty) || 1);
      const lineDiscount = lineSubtotal * ((parseFloat(item.discount) || 0) / 100);
      return acc + (lineSubtotal - lineDiscount);
    }, 0);

    setActiveQuotationDetail({
      ...activeQuotationDetail,
      lineItems: updatedItems,
      amount: newTotal,
    });
  };

  const deleteLineItem = (itemId) => {
    if (!activeQuotationDetail) return;
    const updatedItems = activeQuotationDetail.lineItems.filter((i) => i.id !== itemId);
    const newTotal = updatedItems.reduce((acc, item) => {
      const lineSubtotal = (parseFloat(item.price) || 0) * (parseInt(item.qty) || 1);
      const lineDiscount = lineSubtotal * ((parseFloat(item.discount) || 0) / 100);
      return acc + (lineSubtotal - lineDiscount);
    }, 0);

    setActiveQuotationDetail({
      ...activeQuotationDetail,
      lineItems: updatedItems,
      amount: newTotal,
    });
  };

  const addUpsellItem = (productName, price, promoDiscount = 0, limit = 15) => {
    if (!activeQuotationDetail) return;
    const newItem = {
      id: getNextActivityId(),
      product: productName,
      qty: 1,
      price: price,
      discount: promoDiscount,
      limit: limit,
    };
    const updatedItems = [...activeQuotationDetail.lineItems, newItem];
    const newTotal = updatedItems.reduce((acc, item) => {
      const lineSubtotal = (parseFloat(item.price) || 0) * (parseInt(item.qty) || 1);
      const lineDiscount = lineSubtotal * ((parseFloat(item.discount) || 0) / 100);
      return acc + (lineSubtotal - lineDiscount);
    }, 0);

    setActiveQuotationDetail({
      ...activeQuotationDetail,
      lineItems: updatedItems,
      amount: newTotal,
    });

    showNotification(`Added ${productName} to quotation line items!`);
  };

  const handleSaveDraft = () => {
    if (!activeQuotationDetail) return;
    setQuotations(
      quotations.map((q) => (q.id === activeQuotationDetail.id ? activeQuotationDetail : q))
    );
    showNotification(`Quotation ${activeQuotationDetail.id} draft saved.`);
  };

  const handleExportPDF = () => {
    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `Executive Sales & Approval Audit Report exported (PDF) for ${reportsPeriod}`,
        category: 'Compliance & Reporting',
        time: 'Just now',
        type: 'info',
        badge: 'Exported',
      },
      ...prev,
    ]);
    showNotification(`Exporting Executive Sales & Approval Audit Report (PDF) for ${reportsPeriod}...`);
  };

  const handleExportXLS = () => {
    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `Commercial Ledger & Quotations raw dataset exported (XLS) for ${reportsSalesTeam}`,
        category: 'Compliance & Reporting',
        time: 'Just now',
        type: 'info',
        badge: 'Exported',
      },
      ...prev,
    ]);
    showNotification(`Exporting Platform Usage & Commercial Ledger (XLS) for ${reportsSalesTeam}...`);
  };

  const openSubscriptionDetailView = (sub) => {
    setActiveSubscriptionDetail(JSON.parse(JSON.stringify(sub)));
    setIsModifySubscriptionOpen(false);
    setActiveModule('Subscriptions');
  };

  const handleConfirmFulfillmentSplit = (orderId) => {
    const order = fulfillmentOrders.find((o) => o.id === orderId);
    if (!order) return;

    const ewayNumber = getNextEwayBill();
    const updatedOrders = fulfillmentOrders.map((o) =>
      o.id === orderId ? { ...o, status: 'Ready to Ship', ewayBill: ewayNumber } : o
    );
    setFulfillmentOrders(updatedOrders);

    if (selectedFulfillmentOrder && selectedFulfillmentOrder.id === orderId) {
      setSelectedFulfillmentOrder({
        ...selectedFulfillmentOrder,
        status: 'Ready to Ship',
        ewayBill: ewayNumber,
      });
    }

    setActivities([
      {
        id: getNextActivityId(),
        title: `Order ${orderId} (${order.customer}) warehouse split confirmed • ${ewayNumber}`,
        category: 'Fulfillment & Dispatch',
        time: 'Just now',
        type: 'success',
        badge: 'Ready to Ship',
      },
      ...activities,
    ]);

    showNotification(`Warehouse split confirmed for Order ${orderId}! e-Way Bill ${ewayNumber} generated.`);
  };

  const handleTogglePauseSubscription = (subId) => {
    const sub = subscriptions.find((s) => s.id === subId);
    if (!sub) return;

    const isCurrentlyActive = sub.status === 'Active';
    const newStatus = isCurrentlyActive ? 'Paused' : 'Active';
    const newNextBill = isCurrentlyActive ? '-' : 'Oct 15';

    const newLog = {
      date: '2026-09-05',
      title: isCurrentlyActive ? 'Subscription Paused by Admin' : 'Subscription Resumed by Admin',
      amount: isCurrentlyActive ? '₹0 (Paused)' : `${formatINR(sub.amount)} (${sub.cycle})`,
      note: isCurrentlyActive
        ? 'Billing suspended by Admin operations. Prorated credits preserved.'
        : 'Billing reactivated by Admin operations. Next cycle scheduled for Oct 15.',
    };

    const updated = {
      ...sub,
      status: newStatus,
      nextBill: newNextBill,
      prorationLog: [newLog, ...(sub.prorationLog || [])],
    };

    setSubscriptions(subscriptions.map((s) => (s.id === subId ? updated : s)));

    if (selectedSubscriptionDetail && selectedSubscriptionDetail.id === subId) {
      setSelectedSubscriptionDetail(updated);
    }
    if (activeSubscriptionDetail && activeSubscriptionDetail.id === subId) {
      setActiveSubscriptionDetail(updated);
    }

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `${sub.customer} plan "${sub.plan}" ${isCurrentlyActive ? 'paused' : 'resumed'} by Admin`,
        category: 'Subscription Lifecycle',
        time: 'Just now',
        type: isCurrentlyActive ? 'warning' : 'success',
        badge: newStatus,
      },
      ...prev,
    ]);

    showNotification(`Subscription for ${sub.customer} has been ${isCurrentlyActive ? 'paused' : 'resumed'}.`);
  };

  const handleModifySubscription = (e) => {
    if (e) e.preventDefault();
    if (!activeSubscriptionDetail) return;
    const subId = activeSubscriptionDetail.id;

    const updatedRecurring = (activeSubscriptionDetail.recurringLines || []).map((line) => {
      if (line.plan === activeSubscriptionDetail.plan || line.plan === modifyForm.plan) {
        return {
          ...line,
          plan: modifyForm.plan || line.plan,
          cycle: modifyForm.cycle || line.cycle,
          nextBillDate: modifyForm.nextBill || line.nextBillDate,
          amountINR: modifyForm.amount ? Number(modifyForm.amount) : line.amountINR,
          amountUSD: modifyForm.amount ? `$${Math.round(Number(modifyForm.amount) / 83)}` : line.amountUSD,
        };
      }
      return line;
    });

    const newLog = {
      date: '2026-09-05',
      title: 'Subscription Terms Modified',
      amount: `${formatINR(modifyForm.amount || activeSubscriptionDetail.amount)} (${modifyForm.cycle || activeSubscriptionDetail.cycle})`,
      note: `Plan updated to ${modifyForm.plan || activeSubscriptionDetail.plan}. Next billing cycle set to ${modifyForm.nextBill || activeSubscriptionDetail.nextBill}.`,
    };

    const updated = {
      ...activeSubscriptionDetail,
      plan: modifyForm.plan || activeSubscriptionDetail.plan,
      cycle: modifyForm.cycle || activeSubscriptionDetail.cycle,
      amount: modifyForm.amount ? Number(modifyForm.amount) : activeSubscriptionDetail.amount,
      nextBill: modifyForm.nextBill || activeSubscriptionDetail.nextBill,
      recurringLines: updatedRecurring,
      prorationLog: [newLog, ...(activeSubscriptionDetail.prorationLog || [])],
    };

    setActiveSubscriptionDetail(updated);
    setSubscriptions(subscriptions.map((s) => (s.id === subId ? updated : s)));
    setIsModifySubscriptionOpen(false);

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `${updated.customer} subscription terms modified to ${updated.plan} (${updated.cycle})`,
        category: 'Subscription Update',
        time: 'Just now',
        type: 'info',
        badge: 'Modified',
      },
      ...prev,
    ]);

    showNotification(`Subscription updated for ${updated.customer}!`);
  };

  const handleSendInvoiceReminder = (invoiceId) => {
    const matched = invoices.find((inv) => inv.id === invoiceId);
    if (!matched) return;

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `Payment reminder dispatched for ${matched.customer} (${invoiceId})`,
        category: 'Accounts Receivable',
        time: 'Just now',
        type: 'warning',
        badge: 'Reminder Sent',
      },
      ...prev,
    ]);

    showNotification(`Automated payment reminder sent to ${matched.customer} finance team!`);
  };

  const handleCreateNewProduct = (e) => {
    if (e) e.preventDefault();
    if (!newProductForm.name || !newProductForm.priceUSD) {
      showNotification('Please enter a product name and base USD price.');
      return;
    }

    const priceNum = Number(newProductForm.priceUSD.replace(/[^0-9.]/g, '')) || 100;
    const priceINR = Math.round(priceNum * 83);
    const generatedSku = `SKU-${newProductForm.name.slice(0, 4).toUpperCase()}-${getNextActivityId()}`;

    const newProd = {
      id: `PROD-${100 + catalogProducts.length + 1}`,
      name: newProductForm.name,
      sku: generatedSku,
      category: newProductForm.category,
      variants: newProductForm.variants || '-',
      variantList: [],
      priceUSD: `$${priceNum}`,
      priceINR: priceINR,
      unit: newProductForm.unit,
      tax: newProductForm.tax,
      taxRate: Number(newProductForm.tax.replace('%', '')) || 15,
      taxCode: newProductForm.category === 'Services' ? 'SAC 9987 (Deployment)' : 'HSN 8471 (Appliance)',
      status: 'Active',
      description: newProductForm.description || 'Enterprise catalog equipment.',
      discountLimit: 15,
      tierPricing: [
        { tier: 'Standard Indian Enterprise Tier 2026', currency: 'INR', price: formatINR(priceINR), discountLimit: '15%' },
        { tier: 'Commercial Direct Tier', currency: 'INR', price: formatINR(Math.round(priceINR * 1.08)), discountLimit: '10%' },
        { tier: 'Global Export USD Tier', currency: 'USD', price: `$${priceNum}`, discountLimit: '15%' },
      ],
    };

    setCatalogProducts([newProd, ...catalogProducts]);
    setIsNewProductModalOpen(false);
    setNewProductForm({
      name: '',
      category: 'Hardware',
      priceUSD: '',
      unit: 'Each',
      tax: '15%',
      variants: '-',
      description: '',
    });

    setActivities((prev) => [
      {
        id: getNextActivityId(),
        title: `New product "${newProd.name}" (${newProd.sku}) added to catalog`,
        category: 'Catalog Management',
        time: 'Just now',
        type: 'success',
        badge: 'Product Added',
      },
      ...prev,
    ]);

    showNotification(`New product "${newProd.name}" added to catalog!`);
  };

  const sectionProps = {
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
    isNewFulfillmentModalOpen,
    setIsNewFulfillmentModalOpen,
    newFulfillmentForm,
    setNewFulfillmentForm,
    openNewFulfillmentModal,
    handleCreateFulfillmentSubmit,

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
    customers,
    setCustomers,
    activeCustomer,
    setActiveCustomer,
    isAddCustomerModalOpen,
    setIsAddCustomerModalOpen,
    newCustomerForm,
    setNewCustomerForm,
    handleCreateCustomerSubmit,
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
    activeUser,
    setActiveUser,
  };

  const currentRoleConfig = DEMO_ROLES_CONFIG.find(
    (r) => r.role === activeUser?.role || r.email?.toLowerCase() === activeUser?.email?.toLowerCase()
  ) || DEMO_ROLES_CONFIG[0];

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#0b0f19] text-slate-100'} font-sans flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200`}>
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
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        showNotification={showNotification}
      />

      {/* Floating Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 py-2.5 px-4 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md transition-all ${
          theme === 'light'
            ? 'bg-white/95 text-slate-800 border-slate-200 shadow-slate-300/40'
            : 'bg-[#0f172a]/95 text-slate-100 border-slate-700 shadow-black/60'
        }`}>
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
