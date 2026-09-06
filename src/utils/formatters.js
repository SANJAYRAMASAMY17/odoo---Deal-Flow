// Indian currency formatters (en-IN comma grouping & Lakh/Crore notation)
export const formatINR = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN');
};

export const formatINRLakhCrore = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} L`;
  }
  return '₹' + Number(val).toLocaleString('en-IN');
};

// Deterministic counter-based generators to ensure React 19 purity compliance
let activitySequence = 1000;
export const getNextActivityId = () => {
  activitySequence += 1;
  return activitySequence;
};

let ewbSequence = 991204800;
export const getNextEwayBill = () => {
  ewbSequence += 7;
  return `EWB-${ewbSequence}`;
};

let appSequence = 500;
export const getNextAppId = () => {
  appSequence += 1;
  return `APP-${appSequence}`;
};

let msgSequence = 100;
export const getNextMsgId = () => {
  msgSequence += 1;
  return msgSequence;
};
