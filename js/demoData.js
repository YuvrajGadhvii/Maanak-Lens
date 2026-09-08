/* js/demoData.js — Hardcoded demo inspections */
const DemoData = {
  getDemo1: function() {
    return {
      id: 'DEMO-001',
      date: new Date().toISOString(),
      category: 'Food',
      status: 'PRELIMINARY_COMPLIANT',
      ocrConfidence: 92,
      isDemo: true,
      imagePreview: 'https://placehold.co/400x300/e2e8f0/475569?text=Demo+Package+1', // placeholder
      extractedText: "WHEAT FLOUR\nNET QTY: 1 kg\nMRP Rs. 55.00\nMFD: 01/2024\nBEST BEFORE 6 MONTHS\nMANUFACTURED BY:\nABC Foods Pvt Ltd\nMumbai, 400001\nCONSUMER CARE: 1800-123-4567\nPRODUCT OF INDIA",
      results: [
        { id: 'mrp', label: 'Maximum Retail Price (MRP)', status: 'DETECTED', resultLabel: 'Detected', value: '₹55.00', evidence: 'MRP Rs. 55.00' },
        { id: 'netQuantity', label: 'Net Quantity', status: 'DETECTED', resultLabel: 'Detected', value: '1 kg', evidence: 'NET QTY: 1 kg' },
        { id: 'manufacturer', label: 'Manufacturer / Packer', status: 'DETECTED', resultLabel: 'Detected', value: 'Found', evidence: 'MANUFACTURED BY:\nABC Foods Pvt Ltd' },
        { id: 'consumerCare', label: 'Consumer Care Details', status: 'DETECTED', resultLabel: 'Detected', value: 'Found', evidence: 'CONSUMER CARE: 1800-123-4567' },
        { id: 'dateInfo', label: 'Date Information (MFD/PKD/Exp)', status: 'DETECTED', resultLabel: 'Detected', value: '01/2024', evidence: 'MFD: 01/2024' },
        { id: 'countryOfOrigin', label: 'Country of Origin', status: 'DETECTED', resultLabel: 'Detected', value: 'Found', evidence: 'PRODUCT OF INDIA' }
      ],
      issues: [],
      officerRemarks: ''
    };
  },
  getDemo2: function() {
    return {
      id: 'DEMO-002',
      date: new Date().toISOString(),
      category: 'Cosmetics',
      status: 'POTENTIAL_NON_COMPLIANCE',
      ocrConfidence: 88,
      isDemo: true,
      imagePreview: 'https://placehold.co/400x300/e2e8f0/475569?text=Demo+Package+2',
      extractedText: "FACE WASH\nNET VOLUME 100ml\nMRP: 150/-\nUSE BEFORE: 12/2025\nPACKED BY XYZ COSMETICS\nDELHI",
      results: [
        { id: 'mrp', label: 'Maximum Retail Price (MRP)', status: 'DETECTED', resultLabel: 'Detected', value: '₹150', evidence: 'MRP: 150' },
        { id: 'netQuantity', label: 'Net Quantity', status: 'DETECTED', resultLabel: 'Detected', value: '100ml', evidence: 'NET VOLUME 100ml' },
        { id: 'manufacturer', label: 'Manufacturer / Packer', status: 'DETECTED', resultLabel: 'Detected', value: 'Found', evidence: 'PACKED BY XYZ COSMETICS' },
        { id: 'consumerCare', label: 'Consumer Care Details', status: 'NOT_DETECTED', resultLabel: 'Potentially Missing', value: '', evidence: 'No matching consumer-care declaration was identified in OCR text.' },
        { id: 'dateInfo', label: 'Date Information (MFD/PKD/Exp)', status: 'DETECTED', resultLabel: 'Detected', value: '12/2025', evidence: 'USE BEFORE: 12/2025' },
        { id: 'countryOfOrigin', label: 'Country of Origin', status: 'NOT_DETECTED', resultLabel: 'Potentially Missing', value: '', evidence: 'Country of origin not detected.' }
      ],
      issues: [
        { fieldId: 'consumerCare', label: 'Consumer Care Details', type: 'missing', evidence: 'No matching consumer-care declaration was identified in OCR text.', message: 'Consumer Care Details not detected in image.', officerVerification: null },
        { fieldId: 'countryOfOrigin', label: 'Country of Origin', type: 'missing', evidence: 'Country of origin not detected.', message: 'Country of Origin not detected in image.', officerVerification: null }
      ],
      officerRemarks: ''
    };
  },
  getDemo3: function() {
    return {
      id: 'DEMO-003',
      date: new Date().toISOString(),
      category: 'Household',
      status: 'NEEDS_OFFICER_REVIEW',
      ocrConfidence: 75,
      isDemo: true,
      imagePreview: 'https://placehold.co/400x300/e2e8f0/475569?text=Demo+Package+3',
      extractedText: "CLEANER\n500 ml\nMRP Rs.\nMFD 05/2024\nIMPORTED BY CLEAN CO.\nCUSTOMER CARE: info@cleanco.com",
      results: [
        { id: 'mrp', label: 'Maximum Retail Price (MRP)', status: 'UNCERTAIN', resultLabel: 'Needs Verification', value: '', evidence: 'MRP keyword found, but could not confidently extract the value. Please verify.' },
        { id: 'netQuantity', label: 'Net Quantity', status: 'UNCERTAIN', resultLabel: 'Needs Verification', value: '500 ml', evidence: 'Quantity value found (500 ml) but explicit declaration may be missing.' },
        { id: 'manufacturer', label: 'Manufacturer / Packer', status: 'DETECTED', resultLabel: 'Detected', value: 'Found', evidence: 'IMPORTED BY CLEAN CO.' },
        { id: 'consumerCare', label: 'Consumer Care Details', status: 'DETECTED', resultLabel: 'Detected', value: 'Found', evidence: 'CUSTOMER CARE: info@cleanco.com' },
        { id: 'dateInfo', label: 'Date Information (MFD/PKD/Exp)', status: 'DETECTED', resultLabel: 'Detected', value: '05/2024', evidence: 'MFD 05/2024' },
        { id: 'countryOfOrigin', label: 'Country of Origin', status: 'NOT_DETECTED', resultLabel: 'Potentially Missing', value: '', evidence: 'Country of origin not detected.' }
      ],
      issues: [
        { fieldId: 'mrp', label: 'Maximum Retail Price (MRP)', type: 'uncertain', evidence: 'MRP keyword found, but could not confidently extract the value. Please verify.', message: 'Maximum Retail Price (MRP) requires manual verification.', officerVerification: null },
        { fieldId: 'netQuantity', label: 'Net Quantity', type: 'uncertain', evidence: 'Quantity value found (500 ml) but explicit declaration may be missing.', message: 'Net Quantity requires manual verification.', officerVerification: null },
        { fieldId: 'countryOfOrigin', label: 'Country of Origin', type: 'missing', evidence: 'Country of origin not detected.', message: 'Country of Origin not detected in image.', officerVerification: null }
      ],
      officerRemarks: ''
    };
  }
};
