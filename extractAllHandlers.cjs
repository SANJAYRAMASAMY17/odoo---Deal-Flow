const fs = require('fs');

const targets = [
  { name: 'handleDetailApprove', file: 'dash_rep_229.txt' },
  { name: 'handleDetailReturnForRevision', file: 'dash_rep_229.txt' },
  { name: 'handleDetailReject', file: 'dash_rep_229.txt' },
  { name: 'handleSubmitCustomerRequest', file: 'dash_rep_656.txt' },
  { name: 'handleConfirmCustomerQuotation', file: 'dash_rep_656.txt' },
  { name: 'toggleSelectAllAnomalies', file: 'dash_rep_862.txt' },
  { name: 'toggleAnomalySelect', file: 'dash_rep_862.txt' },
  { name: 'handleEscalateDeal', file: 'dash_rep_862.txt' },
  { name: 'handleNudgeRep', file: 'dash_rep_862.txt' },
  { name: 'handleAddTierCeiling', file: 'dash_rep_1088.txt' },
  { name: 'handleUpdateTierCeiling', file: 'dash_rep_1088.txt' },
  { name: 'handleRemoveTierCeiling', file: 'dash_rep_1088.txt' },
  { name: 'handleAddCategoryCeiling', file: 'dash_rep_1088.txt' },
  { name: 'handleUpdateCategoryCeiling', file: 'dash_rep_1088.txt' },
  { name: 'handleRemoveCategoryCeiling', file: 'dash_rep_1088.txt' },
  { name: 'handleAddRoutingRule', file: 'dash_rep_1088.txt' },
  { name: 'handleUpdateRoutingRule', file: 'dash_rep_1088.txt' },
  { name: 'handleRemoveRoutingRule', file: 'dash_rep_1088.txt' },
  { name: 'handleSaveDiscountConfiguration', file: 'dash_rep_1088.txt' },
  { name: 'handleOverrideSplitQty', file: 'dash_rep_509.txt' },
  { name: 'handleAcceptSuggestedSplit', file: 'dash_rep_509.txt' },
  { name: 'openFulfillmentDetailView', file: 'dash_rep_509.txt' },
  { name: 'handleRebalanceStock', file: 'dash_rep_279.txt' },
  { name: 'handleRecordDetailPayment', file: 'dash_rep_754.txt' },
  { name: 'openInvoiceDetailView', file: 'dash_rep_754.txt' },
  { name: 'openProductDetailView', file: 'dash_rep_1032.txt' },
  { name: 'handleSaveProductDetail', file: 'dash_rep_1032.txt' },
  { name: 'handleAddVariantRow', file: 'dash_rep_1032.txt' },
  { name: 'handleUpdateVariantRow', file: 'dash_rep_1032.txt' },
  { name: 'handleRemoveVariantRow', file: 'dash_rep_1032.txt' },
  { name: 'handleAddPricelistRow', file: 'dash_rep_1032.txt' },
  { name: 'handleUpdatePricelistRow', file: 'dash_rep_1032.txt' },
  { name: 'handleRemovePricelistRow', file: 'dash_rep_1032.txt' },
  { name: 'updateLineItem', file: 'dash_rep_533.txt' },
  { name: 'deleteLineItem', file: 'dash_rep_533.txt' },
  { name: 'addUpsellItem', file: 'dash_rep_533.txt' },
  { name: 'handleSaveDraft', file: 'dash_rep_533.txt' },
  { name: 'handleExportPDF', file: 'dash_rep_895.txt' },
  { name: 'handleExportXLS', file: 'dash_rep_895.txt' },
  { name: 'openSubscriptionDetailView', file: 'dash_rep_509.txt' },
  { name: 'handleConfirmFulfillmentSplit', file: 'dash_rep_279.txt' },
  { name: 'handleTogglePauseSubscription', file: 'dash_rep_525.txt' },
  { name: 'handleModifySubscription', file: 'dash_rep_525.txt' },
  { name: 'handleSendInvoiceReminder', file: 'dash_rep_707.txt' },
  { name: 'handleCreateNewProduct', file: 'dash_rep_930.txt' }
];

const extracted = {};

targets.forEach(({ name, file }) => {
  if (!fs.existsSync(file)) {
    console.log('File missing:', file);
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const startIdx = lines.findIndex(l => l.includes('const ' + name + ' =') || l.includes('function ' + name));
  if (startIdx === -1) {
    console.log('Could not find', name, 'in', file);
    return;
  }
  // Find matching closing brace
  let braceCount = 0;
  let started = false;
  let endIdx = startIdx;
  for (let i = startIdx; i < lines.length; i++) {
    const l = lines[i];
    for (const ch of l) {
      if (ch === '{') {
        braceCount++;
        started = true;
      } else if (ch === '}') {
        braceCount--;
      }
    }
    if (started && braceCount === 0) {
      endIdx = i;
      break;
    }
  }
  extracted[name] = lines.slice(startIdx, endIdx + 1).join('\n');
});

fs.writeFileSync('all_handlers.json', JSON.stringify(extracted, null, 2), 'utf8');
console.log('Successfully extracted', Object.keys(extracted).length, 'handlers into all_handlers.json');
