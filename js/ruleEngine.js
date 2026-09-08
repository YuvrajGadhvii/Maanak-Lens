/* js/ruleEngine.js — Deterministic compliance rule engine */
const RuleEngine = (function() {

  const FIELDS = [
    { id: 'mrp', label: 'Maximum Retail Price (MRP)' },
    { id: 'netQuantity', label: 'Net Quantity' },
    { id: 'manufacturer', label: 'Manufacturer / Packer' },
    { id: 'consumerCare', label: 'Consumer Care Details' },
    { id: 'dateInfo', label: 'Date Information (MFD/PKD/Exp)' },
    { id: 'countryOfOrigin', label: 'Country of Origin' },
  ];

  function evaluate(extractedFields, ocrConfidence) {
    const results = [];
    let hasMissing = false;
    let hasUncertain = false;
    let hasLowConfidence = ocrConfidence < 60; // arbitrarily setting 60% as threshold

    FIELDS.forEach(fieldDef => {
      const fData = extractedFields[fieldDef.id];
      let resStatus = 'Not Applicable';
      
      if (fData) {
        if (fData.status === 'DETECTED') {
          resStatus = 'Detected';
        } else if (fData.status === 'NOT_DETECTED') {
          resStatus = 'Potentially Missing';
          hasMissing = true;
        } else if (fData.status === 'UNCERTAIN') {
          resStatus = 'Needs Verification';
          hasUncertain = true;
        }
      } else {
        resStatus = 'Potentially Missing';
        hasMissing = true;
      }

      results.push({
        id: fieldDef.id,
        label: fieldDef.label,
        status: fData ? fData.status : 'NOT_DETECTED',
        resultLabel: resStatus,
        value: fData ? fData.value : '',
        evidence: fData ? fData.evidence : 'No data extracted.'
      });
    });

    let overallStatus = 'PRELIMINARY_COMPLIANT';
    if (hasLowConfidence) {
      overallStatus = 'INSUFFICIENT_IMAGE_QUALITY';
    } else if (hasMissing) {
      overallStatus = 'POTENTIAL_NON_COMPLIANCE';
    } else if (hasUncertain) {
      overallStatus = 'NEEDS_OFFICER_REVIEW';
    }

    const issues = results.filter(r => r.status === 'NOT_DETECTED' || r.status === 'UNCERTAIN').map(r => ({
      fieldId: r.id,
      label: r.label,
      type: r.status === 'NOT_DETECTED' ? 'missing' : 'uncertain',
      evidence: r.evidence,
      message: r.status === 'NOT_DETECTED' ? `${r.label} not detected in image.` : `${r.label} requires manual verification.`,
      officerVerification: null // 'confirm', 'reject', 'further'
    }));
    
    if (hasLowConfidence) {
       issues.unshift({
           fieldId: 'ocr_quality',
           label: 'Readability',
           type: 'missing',
           evidence: `OCR Confidence: ${Math.round(ocrConfidence)}%`,
           message: 'Some package text could not be reliably extracted. Basic readability observation suggests poor image quality.',
           officerVerification: null
       })
    }

    return {
      results: results,
      overallStatus: overallStatus,
      issues: issues,
      ocrConfidence: ocrConfidence
    };
  }

  return { evaluate };
})();
