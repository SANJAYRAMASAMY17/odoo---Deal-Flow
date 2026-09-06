const fs = require('fs');

const updates = {
  'src/components/sections/ApprovalsSection.jsx': [
    'handleDetailApprove',
    'handleDetailReturnForRevision',
    'handleDetailReject'
  ],
  'src/components/sections/CustomerPortalSection.jsx': [
    'portalStatus',
    'portalComments',
    'setPortalComments',
    'counterDiscount',
    'setCounterDiscount',
    'requestedDeliveryDate',
    'setRequestedDeliveryDate',
    'handleSubmitCustomerRequest',
    'handleConfirmCustomerQuotation'
  ],
  'src/components/sections/DealHealthSection.jsx': [
    'dealHealthAnomalies',
    'setDealHealthFilter',
    'dealHealthFilter',
    'selectedAnomalyIds',
    'toggleSelectAllAnomalies',
    'toggleAnomalySelect',
    'setInspectingAnomalyDeal',
    'handleEscalateDeal',
    'handleNudgeRep'
  ],
  'src/components/sections/DiscountChainsSection.jsx': [
    'handleAddTierCeiling',
    'tierCeilings',
    'handleUpdateTierCeiling',
    'handleRemoveTierCeiling',
    'handleAddCategoryCeiling',
    'categoryCeilings',
    'handleUpdateCategoryCeiling',
    'handleRemoveCategoryCeiling',
    'handleAddRoutingRule',
    'approvalChains',
    'handleUpdateRoutingRule',
    'handleRemoveRoutingRule',
    'handleSaveDiscountConfiguration'
  ],
  'src/components/sections/FulfillmentSection.jsx': [
    'setIsManualOverrideOpen',
    'isManualOverrideOpen',
    'handleOverrideSplitQty',
    'handleAcceptSuggestedSplit',
    'openFulfillmentDetailView',
    'handleRebalanceStock'
  ],
  'src/components/sections/InvoicesSection.jsx': [
    'handleRecordDetailPayment',
    'openInvoiceDetailView'
  ],
  'src/components/sections/ProductsSection.jsx': [
    'setActiveProductDetail',
    'activeProductDetail',
    'openProductDetailView',
    'catalogProducts',
    'setIsNewProductModalOpen',
    'handleSaveProductDetail',
    'productDetailForm',
    'setProductDetailForm',
    'handleAddVariantRow',
    'handleUpdateVariantRow',
    'handleRemoveVariantRow',
    'handleAddPricelistRow',
    'handleUpdatePricelistRow',
    'handleRemovePricelistRow'
  ],
  'src/components/sections/QuotationsSection.jsx': [
    'updateLineItem',
    'deleteLineItem',
    'addUpsellItem',
    'handleSaveDraft'
  ],
  'src/components/sections/ReportsSection.jsx': [
    'reportsPeriod',
    'setReportsPeriod',
    'reportsSalesTeam',
    'setReportsSalesTeam',
    'reportsApprovalStatus',
    'setReportsApprovalStatus',
    'reportsProduct',
    'setReportsProduct',
    'handleExportPDF',
    'handleExportXLS'
  ],
  'src/components/sections/SubscriptionsSection.jsx': [
    'setModifyForm',
    'setIsModifySubscriptionOpen',
    'openSubscriptionDetailView'
  ],
  'src/components/DashboardModals.jsx': [
    'openQuotationDetail',
    'setActiveModule',
    'handleConfirmFulfillmentSplit',
    'handleTogglePauseSubscription',
    'handleModifySubscription',
    'modifyForm',
    'setModifyForm',
    'handleSendInvoiceReminder',
    'inspectingAnomalyDeal',
    'setInspectingAnomalyDeal',
    'handleEscalateDeal',
    'handleNudgeRep',
    'selectedCatalogProduct',
    'setSelectedCatalogProduct',
    'isNewProductModalOpen',
    'setIsNewProductModalOpen',
    'handleCreateNewProduct',
    'newProductForm',
    'setNewProductForm'
  ]
};

Object.entries(updates).forEach(([filePath, missingVars]) => {
  let content = fs.readFileSync(filePath, 'utf8');
  // Find "const { ... } = props;"
  const match = content.match(/const\s*\{\s*([\s\S]*?)\s*\}\s*=\s*props;/);
  if (!match) {
    console.log('No match for const { ... } = props in', filePath);
    return;
  }
  const existingVars = match[1].split(',').map(v => v.trim()).filter(Boolean);
  const toAdd = missingVars.filter(v => !existingVars.includes(v));
  if (toAdd.length > 0) {
    const newVars = [...existingVars, ...toAdd];
    const newDestructure = 'const {\n    ' + newVars.join(',\n    ') + ',\n  } = props;';
    content = content.replace(match[0], newDestructure);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath, 'with', toAdd.length, 'variables.');
  } else {
    console.log('No new variables to add to', filePath);
  }
});
