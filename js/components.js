/* js/components.js — Reusable UI Components */
const Components = (function() {

  function Badge(status) {
    let className = 'badge-na';
    let text = status;
    
    switch(status) {
      case 'DETECTED':
      case 'Detected':
      case 'PRELIMINARY_COMPLIANT':
      case 'Preliminary Compliant':
        className = 'badge-detected';
        text = status === 'DETECTED' ? '✓ Detected' : '✓ Compliant';
        break;
      case 'NOT_DETECTED':
      case 'Potentially Missing':
      case 'POTENTIAL_NON_COMPLIANCE':
      case 'Potential Non-Compliance':
        className = 'badge-missing';
        text = status === 'NOT_DETECTED' ? '⚠ Missing' : '⚠ Issue Found';
        break;
      case 'UNCERTAIN':
      case 'Needs Verification':
      case 'NEEDS_OFFICER_REVIEW':
      case 'Needs Officer Review':
        className = 'badge-uncertain';
        text = status === 'UNCERTAIN' ? '? Uncertain' : '? Needs Review';
        break;
      case 'INSUFFICIENT_IMAGE_QUALITY':
      case 'Insufficient Image Quality':
         className = 'badge-na';
         text = 'Low Quality';
         break;
    }
    
    return `<span class="badge ${className}">${text}</span>`;
  }

  function DeclarationTable(results) {
    let rows = results.map(r => `
      <tr>
        <td style="font-weight:600;color:var(--text);">${r.label}</td>
        <td>${Badge(r.resultLabel)}</td>
        <td style="font-family:var(--mono);font-size:0.75rem;color:var(--text-secondary);max-width:300px;white-space:normal;">
          ${r.evidence ? `"${r.evidence.replace(/\n/g, '<br>')}"` : '—'}
        </td>
      </tr>
    `).join('');

    return `
      <div class="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Declaration</th>
              <th>Status</th>
              <th>OCR Evidence</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  function StatusBanner(statusKey) {
    const s = OVERALL_STATUSES[statusKey];
    if (!s) return '';
    
    let icon = '';
    if (s.cssClass === 'compliant') icon = Icons.get('check-circle', 24, 'text-white');
    else if (s.cssClass === 'issue') icon = Icons.get('alert-circle', 24, 'text-white');
    else if (s.cssClass === 'review') icon = Icons.get('alert-triangle', 24, 'text-white');
    else icon = Icons.get('info', 24, 'text-white');
    
    return `
      <div class="status-banner ${s.cssClass}">
        <div class="sb-icon">${icon}</div>
        <div>
          <div class="sb-title">${s.label}</div>
          <div style="font-size:0.85rem;color:var(--text-secondary);">${s.desc}</div>
        </div>
      </div>
    `;
  }

  return { Badge, DeclarationTable, StatusBanner };
})();
