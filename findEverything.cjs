const fs = require('fs');

const missing = [
  'handleDetailApprove', 'handleDetailReturnForRevision', 'handleDetailReject',
  'portalStatus', 'portalComments', 'counterDiscount', 'requestedDeliveryDate',
  'handleSubmitCustomerRequest', 'handleConfirmCustomerQuotation',
  'dealHealthAnomalies', 'dealHealthFilter', 'selectedAnomalyIds',
  'toggleSelectAllAnomalies', 'toggleAnomalySelect', 'inspectingAnomalyDeal',
  'handleEscalateDeal', 'handleNudgeRep',
  'handleAddTierCeiling', 'tierCeilings', 'handleUpdateTierCeiling', 'handleRemoveTierCeiling',
  'handleAddCategoryCeiling', 'categoryCeilings', 'handleUpdateCategoryCeiling', 'handleRemoveCategoryCeiling',
  'handleAddRoutingRule', 'approvalChains', 'handleUpdateRoutingRule', 'handleRemoveRoutingRule', 'handleSaveDiscountConfiguration',
  'isManualOverrideOpen', 'handleOverrideSplitQty', 'handleAcceptSuggestedSplit', 'openFulfillmentDetailView', 'handleRebalanceStock',
  'handleRecordDetailPayment', 'openInvoiceDetailView',
  'activeProductDetail', 'openProductDetailView', 'catalogProducts', 'handleSaveProductDetail', 'productDetailForm',
  'handleAddVariantRow', 'handleUpdateVariantRow', 'handleRemoveVariantRow', 'handleAddPricelistRow', 'handleUpdatePricelistRow', 'handleRemovePricelistRow',
  'updateLineItem', 'deleteLineItem', 'addUpsellItem', 'handleSaveDraft',
  'reportsPeriod', 'reportsSalesTeam', 'reportsApprovalStatus', 'reportsProduct', 'handleExportPDF', 'handleExportXLS',
  'openSubscriptionDetailView', 'handleConfirmFulfillmentSplit', 'handleTogglePauseSubscription', 'handleModifySubscription',
  'modifyForm', 'handleSendInvoiceReminder', 'selectedCatalogProduct', 'isNewProductModalOpen', 'handleCreateNewProduct', 'newProductForm'
];

const found = {};

fs.readdirSync('.').forEach(f => {
  if (f.startsWith('dash_rep_') && f.endsWith('.txt')) {
    const content = fs.readFileSync(f, 'utf8');
    missing.forEach(m => {
      if (content.includes('const ' + m) || content.includes('let ' + m) || content.includes('function ' + m)) {
        if (!found[m]) found[m] = [];
        found[m].push(f);
      }
    });
  }
});

console.log('Results:');
missing.forEach(m => {
  console.log(m + ':', found[m] ? found[m].join(', ') : 'NOT FOUND IN DASH_REP');
});
