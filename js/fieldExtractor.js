/* js/fieldExtractor.js — Regex based text extraction */
const FieldExtractor = (function() {

  function extract(text) {
    const rawText = text || '';
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const textUpper = rawText.toUpperCase();

    const fields = {};

    // 1. MRP Detection
    fields.mrp = detectMRP(rawText, textUpper);

    // 2. Net Quantity
    fields.netQuantity = detectNetQuantity(rawText, textUpper);

    // 3. Manufacturer / Packer / Importer
    fields.manufacturer = detectManufacturer(rawText, textUpper, lines);

    // 4. Consumer Care
    fields.consumerCare = detectConsumerCare(rawText, textUpper, lines);

    // 5. Dates (MFD/PKD/EXP)
    fields.dateInfo = detectDates(rawText, textUpper);

    // 6. Country of Origin
    fields.countryOfOrigin = detectCountryOfOrigin(rawText, textUpper, lines);

    return fields;
  }

  function detectMRP(raw, upper) {
    const mrpRegex = /(?:MRP|M\.R\.P|MAX(?:IMUM)?\s+RETAIL\s+PRICE)\s*(?:[.:-]\s*)?(?:Rs\.?|INR|₹)?\s*(\d+(?:\.\d{1,2})?)/i;
    const match = raw.match(mrpRegex);
    if (match) {
      return { status: 'DETECTED', value: '₹' + match[1], evidence: match[0] };
    }
    // Check for just a currency symbol and number if keywords are missing but it looks like a price near the word MRP
    if (upper.includes('MRP') || upper.includes('M.R.P')) {
      return { status: 'UNCERTAIN', value: '', evidence: 'MRP keyword found, but could not confidently extract the value. Please verify.' };
    }
    return { status: 'NOT_DETECTED', value: '', evidence: 'No matching MRP declaration was identified in OCR text.' };
  }

  function detectNetQuantity(raw, upper) {
    const qtyRegex = /(?:NET\s+(?:QTY|QUANTITY|WT|WEIGHT|VOL(?:UME)?))\s*(?:[.:-]\s*)?(\d+(?:\.\d+)?\s*(?:g|kg|mg|ml|l|litre|liter)s?)/i;
    const match = raw.match(qtyRegex);
    if (match) {
      return { status: 'DETECTED', value: match[1], evidence: match[0] };
    }
    const simpleQty = /(\d+(?:\.\d+)?\s*(?:g|kg|mg|ml|L|litre|liter)s?)/i;
    const sMatch = raw.match(simpleQty);
    if (sMatch && (upper.includes('NET') || upper.includes('WEIGHT') || upper.includes('WT'))) {
      return { status: 'UNCERTAIN', value: sMatch[1], evidence: 'Quantity value found (' + sMatch[0] + ') but explicit declaration may be missing.' };
    }
    return { status: 'NOT_DETECTED', value: '', evidence: 'No net quantity declaration was identified.' };
  }

  function detectManufacturer(raw, upper, lines) {
    const keywords = ['MANUFACTURED BY', 'MANUFACTURER', 'MFG. BY', 'PACKED BY', 'PACKER', 'IMPORTED BY', 'IMPORTER', 'MARKETED BY'];
    for (let i = 0; i < lines.length; i++) {
      const lineUp = lines[i].toUpperCase();
      if (keywords.some(k => lineUp.includes(k))) {
         // Attempt to get this line and the next as evidence
         const ev = lines.slice(i, i + 2).join('\n');
         return { status: 'DETECTED', value: 'Found', evidence: ev };
      }
    }
    return { status: 'NOT_DETECTED', value: '', evidence: 'Manufacturer/Packer details not found.' };
  }

  function detectConsumerCare(raw, upper, lines) {
    const keywords = ['CONSUMER CARE', 'CUSTOMER CARE', 'COMPLAINTS', 'HELPLINE', 'TOLL FREE', 'CUSTOMER SERVICE', 'FEEDBACK'];
    const phoneRegex = /(?:ph|phone|tel|call|mob|mobile|toll free)?\s*(?:[:-]\s*)?(?:\+?91|0)?\s*[6-9]\d{9}|\d{3,4}[-\s]?\d{3,4}[-\s]?\d{3,4}/i;
    
    let evidenceLine = '';
    for (let i = 0; i < lines.length; i++) {
      const lineUp = lines[i].toUpperCase();
      if (keywords.some(k => lineUp.includes(k))) {
         evidenceLine = lines.slice(i, Math.min(lines.length, i+3)).join(' ');
         break;
      }
    }

    if (evidenceLine || phoneRegex.test(raw)) {
       return { status: 'DETECTED', value: 'Found', evidence: evidenceLine || 'Phone number detected' };
    }

    return { status: 'NOT_DETECTED', value: '', evidence: 'No matching consumer-care declaration was identified in OCR text.' };
  }

  function detectDates(raw, upper) {
    const dateRegex = /(?:MFD|MFG|PKD|PACKED|USE BEFORE|BEST BEFORE|EXP(?:IRY)?)\s*(?:[.:-]\s*)?((?:0[1-9]|1[0-2]|[A-Z]{3})[\/\-.,\s]\d{2,4}|\d{2,4})/i;
    const match = raw.match(dateRegex);
    if (match) {
      return { status: 'DETECTED', value: match[1], evidence: match[0] };
    }
    if (upper.includes('MFD') || upper.includes('PKD') || upper.includes('BEST BEFORE')) {
       return { status: 'UNCERTAIN', value: '', evidence: 'Date keyword found but format unrecognized.' };
    }
    return { status: 'NOT_DETECTED', value: '', evidence: 'Date information not detected.' };
  }

  function detectCountryOfOrigin(raw, upper, lines) {
    const keywords = ['COUNTRY OF ORIGIN', 'MADE IN', 'PRODUCT OF'];
    for (let i = 0; i < lines.length; i++) {
      const lineUp = lines[i].toUpperCase();
      if (keywords.some(k => lineUp.includes(k))) {
         return { status: 'DETECTED', value: 'Found', evidence: lines[i] };
      }
    }
    return { status: 'NOT_DETECTED', value: '', evidence: 'Country of origin not detected.' };
  }

  return { extract };
})();
