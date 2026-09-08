/* js/pages.js — Page rendering logic */
const Pages = (function() {

  function renderLanding() {
    return `
      <nav class="landing-nav">
        <div class="sidebar-logo">
          <img src="assets/logo.png" alt="Maanak Lens Logo" style="height:120px; object-fit:contain; margin-right:8px;">
        </div>
        <div style="display:flex;gap:1rem;">
          <a href="#/dashboard" class="btn btn-ghost" style="color:white;border-color:rgba(255,255,255,0.2);">Dashboard</a>
        </div>
      </nav>
      
      <section class="hero-section">
        <div class="hero-eyebrow">Smart India Hackathon Prototype</div>
        <h1 class="hero-title">Smart Packaging Compliance Inspection</h1>
        <h2 class="hero-tagline">Measurement & Assessment of Adherence to Norms</h2>
        <p class="hero-desc">An OCR-assisted inspection tool that reads packaged commodity labels, identifies key declarations, and performs a preliminary compliance screening for Legal Metrology officers.</p>
        <div class="hero-cta">
          <a href="#/new" class="btn btn-primary btn-lg">Start Inspection ${Icons.get('arrow-right', 18)}</a>
          <a href="#/dashboard" class="btn btn-secondary btn-lg">Try Demo</a>
        </div>
      </section>
      
      <section class="how-section">
        <div class="section-label">How It Works</div>
        <h3 class="section-title">Automated Preliminary Screening</h3>
        <p class="section-desc">Maanak Lens assists officers by automatically extracting and verifying mandatory declarations from package images.</p>
        
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-num">01</div>
            <div class="step-ico" style="color:white">${Icons.get('upload')}</div>
            <h4>Upload Package</h4>
            <p>Upload a clear image of a packaged commodity's label.</p>
          </div>
          <div class="step-card">
            <div class="step-num">02</div>
            <div class="step-ico" style="color:white">${Icons.get('search')}</div>
            <h4>Read the Label</h4>
            <p>Browser-based OCR securely extracts visible package text.</p>
          </div>
          <div class="step-card">
            <div class="step-num">03</div>
            <div class="step-ico" style="color:white">${Icons.get('list')}</div>
            <h4>Identify Declarations</h4>
            <p>The system identifies MRP, net quantity, manufacturer, and more.</p>
          </div>
          <div class="step-card">
            <div class="step-num">04</div>
            <div class="step-ico" style="color:white">${Icons.get('check-circle')}</div>
            <h4>Check Requirements</h4>
            <p>A deterministic rule engine evaluates the detected declarations.</p>
          </div>
          <div class="step-card">
            <div class="step-num">05</div>
            <div class="step-ico" style="color:white">${Icons.get('file-text')}</div>
            <h4>Review & Report</h4>
            <p>The officer reviews evidence and generates a preliminary report.</p>
          </div>
        </div>
      </section>
      
      <footer class="landing-footer">
        Maanak Lens Prototype • Built for Smart India Hackathon<br>
        <span style="opacity:0.6;font-size:0.7rem;">Not a substitute for official legal determination.</span>
      </footer>
    `;
  }

  function renderDashboard() {
    const inspections = InspectionStore.getAll();
    const total = inspections.length;
    const compliant = inspections.filter(i => i.status === 'PRELIMINARY_COMPLIANT').length;
    const issues = inspections.filter(i => i.status === 'POTENTIAL_NON_COMPLIANCE').length;
    const review = inspections.filter(i => i.status === 'NEEDS_OFFICER_REVIEW').length;

    let recentHtml = '';
    if (inspections.length === 0) {
      recentHtml = `
        <div class="empty-state">
          <div class="esi">${Icons.get('box')}</div>
          <h3>No inspections yet</h3>
          <p>Start a new inspection or try a demo.</p>
          <div style="margin-top:1.5rem;display:flex;gap:1rem;justify-content:center;">
             <a href="#/new" class="btn btn-primary">New Inspection</a>
             <button class="btn btn-secondary" onclick="App.loadDemo(1)">Demo 01</button>
             <button class="btn btn-secondary" onclick="App.loadDemo(2)">Demo 02</button>
             <button class="btn btn-secondary" onclick="App.loadDemo(3)">Demo 03</button>
          </div>
        </div>
      `;
    } else {
      const rows = inspections.slice(0, 10).map(i => `
        <tr style="cursor:pointer" onclick="window.location.hash='#/assessment/${i.id}'">
          <td style="font-family:var(--mono);font-weight:600;color:var(--navy);">${i.id} ${i.isDemo ? '<span class="demo-tag">DEMO</span>' : ''}</td>
          <td>${i.category || 'Uncategorized'}</td>
          <td style="color:var(--text-secondary)">${new Date(i.date).toLocaleDateString()}</td>
          <td>${Components.Badge(i.status)}</td>
          <td><a href="#/assessment/${i.id}" class="btn btn-sm btn-ghost">View</a></td>
        </tr>
      `).join('');
      
      recentHtml = `
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>ID</th><th>Category</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    }

    return `
      <div class="page-hdr-row">
        <div>
          <h1>Inspection Dashboard</h1>
          <p>Monitor packaged commodity inspections and preliminary findings.</p>
        </div>
        <div style="display:flex;gap:1rem;">
           <button class="btn btn-secondary" onclick="App.loadDemo(1)">Try Demo</button>
           <a href="#/new" class="btn btn-primary">${Icons.get('plus', 16)} New Inspection</a>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-lbl">Total Inspections</div>
          <div class="stat-val">${total}</div>
        </div>
        <div class="stat-card">
          <div class="stat-lbl">Compliant (Prelim)</div>
          <div class="stat-val green">${compliant}</div>
        </div>
        <div class="stat-card">
          <div class="stat-lbl">Potential Issues</div>
          <div class="stat-val red">${issues}</div>
        </div>
        <div class="stat-card">
          <div class="stat-lbl">Needs Review</div>
          <div class="stat-val amber">${review}</div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3>Recent Inspections</h3>
        </div>
        <div class="card-body" style="${inspections.length === 0 ? '' : 'padding:0'}">
          ${recentHtml}
        </div>
      </div>
    `;
  }

  function renderNewInspection() {
    return `
      <div class="page-hdr">
        <h1>New Inspection</h1>
        <p>Upload a clear image of the packaged commodity label.</p>
      </div>
      
      <div class="card" style="max-width:800px;margin:0 auto;">
        <div class="card-body">
          <div class="form-group" style="margin-bottom:2rem;">
            <label>Product Category (Optional)</label>
            <select id="insp-category">
              <option value="Food">Food & Beverages</option>
              <option value="Cosmetics">Cosmetics</option>
              <option value="Household">Household Goods</option>
              <option value="Electronics">Electronics</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <input type="file" id="file-upload" accept="image/jpeg, image/png, image/webp" style="display:none;" onchange="App.handleImageSelect(event)">
          
          <div id="upload-area" class="upload-zone" onclick="document.getElementById('file-upload').click()">
            <div class="upload-icon">${Icons.get('camera', 28, 'text-navy')}</div>
            <h3>Drop package image here</h3>
            <p>or browse from your computer</p>
            <div class="upload-formats">Supported formats: JPG, PNG, WEBP</div>
          </div>
          
          <div id="preview-area" style="display:none;">
            <div class="img-preview-box" style="margin-bottom:1.5rem;">
               <img id="img-preview" src="" alt="Preview">
            </div>
            <div style="display:flex;gap:1rem;justify-content:flex-end;">
               <button class="btn btn-ghost" onclick="App.cancelUpload()">Remove Image</button>
               <button class="btn btn-primary" onclick="App.startAnalysis()">Analyze Package</button>
            </div>
          </div>
          
          <div class="info-box" style="margin-top:2rem;">
            <div style="color:var(--navy);flex-shrink:0;">${Icons.get('info', 20)}</div>
            <div>For best results, upload a clear, well-lit image where declarations are readable. The OCR runs entirely in your browser.</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderProcessing() {
    return `
      <div style="display:flex;align-items:center;justify-content:center;min-height:70vh;">
        <div style="text-align:center;max-width:400px;width:100%;">
          <div class="process-icon-wrap" style="color:var(--navy)">
            ${Icons.get('search', 32)}
          </div>
          <h2 style="font-size:1.4rem;margin-bottom:0.5rem;">Analyzing Package</h2>
          <p id="proc-status" style="color:var(--text-secondary);font-size:0.9rem;">Initializing...</p>
          
          <div class="progress-track">
             <div id="proc-bar" class="progress-fill" style="width:0%"></div>
          </div>
          
          <ul class="stages-list">
             <li id="stage-1" class="stage-item active"><div class="stage-dot"></div> Preparing image</li>
             <li id="stage-2" class="stage-item"><div class="stage-dot"></div> Reading package text</li>
             <li id="stage-3" class="stage-item"><div class="stage-dot"></div> Identifying declarations</li>
             <li id="stage-4" class="stage-item"><div class="stage-dot"></div> Evaluating checklist</li>
          </ul>
        </div>
      </div>
    `;
  }

  function renderAssessment(inspection) {
    if (!inspection) return '<div class="empty-state">Inspection not found.</div>';
    
    let issuesHtml = '';
    if (inspection.issues && inspection.issues.length > 0) {
      const issueCards = inspection.issues.map(i => {
         const cardClass = i.type === 'missing' ? 'issue-card' : 'warn-card';
         const icon = i.type === 'missing' ? Icons.get('x', 16) : Icons.get('alert-triangle', 16);
         return `
           <div class="${cardClass}">
              <div class="${i.type === 'missing' ? 'issue-hdr' : 'warn-hdr'}">
                 ${icon} ${i.label} ${i.type === 'missing' ? 'not detected' : 'requires verification'}
              </div>
              <p style="font-size:0.8rem;margin-bottom:0.4rem;">${i.message}</p>
              <div class="ev-snippet">Evidence: "${i.evidence}"</div>
           </div>
         `;
      }).join('');
      
      issuesHtml = `
        <div style="margin-top:2rem;">
          <h3 style="font-size:1.1rem;margin-bottom:1rem;">Potential Issues Detected</h3>
          ${issueCards}
          <div style="margin-top:1rem;background:#fefce8;border:1px solid #fef08a;padding:1rem;border-radius:var(--radius);font-size:0.85rem;color:#854d0e;display:flex;gap:0.75rem;">
             ${Icons.get('info', 18)}
             <div><strong>Recommended action:</strong> Officer should inspect the package manually to verify these findings.</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="page-hdr-row">
        <div>
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:0.5rem;">
             <h1>Preliminary Assessment</h1>
             ${inspection.isDemo ? '<span class="demo-tag">DEMO MODE</span>' : ''}
          </div>
          <p>ID: ${inspection.id} &bull; ${new Date(inspection.date).toLocaleString()}</p>
        </div>
        <div style="display:flex;gap:1rem;">
           <a href="#/evidence/${inspection.id}" class="btn btn-secondary">Review OCR Evidence</a>
           <a href="#/verify/${inspection.id}" class="btn btn-primary">Officer Verification</a>
        </div>
      </div>
      
      ${Components.StatusBanner(inspection.status)}
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1.5rem;font-style:italic;">
        Automated preliminary screening — officer verification required.
      </p>
      
      <div class="card">
        <div class="card-header">
          <h3>Declaration Checklist</h3>
        </div>
        <div class="card-body" style="padding:0;">
          ${Components.DeclarationTable(inspection.results)}
        </div>
      </div>
      
      ${issuesHtml}
    `;
  }

  function renderEvidence(inspection) {
    if (!inspection) return '<div class="empty-state">Inspection not found.</div>';
    
    return `
      <div class="page-hdr-row">
        <div>
          <h1>Evidence Review</h1>
          <p>Review the raw text extracted from the package image.</p>
        </div>
        <a href="#/assessment/${inspection.id}" class="btn btn-secondary">${Icons.get('arrow-left', 16)} Back to Assessment</a>
      </div>
      
      <div class="ev-split">
        <div class="card">
          <div class="card-header">
            <h3>Original Image</h3>
          </div>
          <div class="card-body" style="background:#0a0a0a;display:flex;align-items:center;justify-content:center;min-height:300px;padding:1rem;">
            <img src="${inspection.imagePreview}" style="max-width:100%;max-height:400px;object-fit:contain;" alt="Package Image">
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3>OCR Text Detected</h3>
            <span style="font-size:0.8rem;color:var(--text-muted);">Confidence: ${Math.round(inspection.ocrConfidence)}%</span>
          </div>
          <div class="card-body">
            ${inspection.extractedText ? `<div class="ocr-box">${inspection.extractedText}</div>` : '<p style="color:var(--text-muted);font-size:0.9rem;">No text could be reliably extracted.</p>'}
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3>Basic Readability Observation</h3>
        </div>
        <div class="card-body">
          <p style="font-size:0.9rem;color:var(--text-secondary);">
             ${inspection.ocrConfidence > 80 ? 'Package text appears clear and readable.' : (inspection.ocrConfidence > 50 ? 'Package text is somewhat readable, but some elements may be obscured or low contrast.' : 'Some package text could not be reliably extracted. The image may be blurry, poorly lit, or the text contrast is insufficient.')}
          </p>
        </div>
      </div>
    `;
  }

  function renderVerify(inspection) {
    if (!inspection) return '<div class="empty-state">Inspection not found.</div>';
    
    const verifyItems = (inspection.issues || []).map(i => {
       const isC = i.officerVerification === 'confirm';
       const isR = i.officerVerification === 'reject';
       const isF = i.officerVerification === 'further';
       return `
         <div class="verify-item">
           <div style="font-weight:600;margin-bottom:0.25rem;">${i.label}</div>
           <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.75rem;">System finding: ${i.message}</p>
           <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
             <button class="vbtn vbtn-confirm ${isC ? 'active' : ''}" onclick="App.setVerify('${inspection.id}', '${i.fieldId}', 'confirm')">Confirm Issue</button>
             <button class="vbtn vbtn-reject ${isR ? 'active' : ''}" onclick="App.setVerify('${inspection.id}', '${i.fieldId}', 'reject')">Reject Finding</button>
             <button class="vbtn vbtn-further ${isF ? 'active' : ''}" onclick="App.setVerify('${inspection.id}', '${i.fieldId}', 'further')">Needs Further Inspection</button>
           </div>
         </div>
       `;
    }).join('');

    return `
      <div class="page-hdr-row">
        <div>
          <h1>Officer Verification</h1>
          <p>Verify potential issues and finalize the inspection.</p>
        </div>
        <a href="#/assessment/${inspection.id}" class="btn btn-secondary">${Icons.get('arrow-left', 16)} Back to Assessment</a>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr;gap:1.5rem;max-width:800px;">
        <div class="card">
          <div class="card-header">
            <h3>Verify Findings</h3>
          </div>
          <div class="card-body">
            ${verifyItems || '<p style="font-size:0.9rem;color:var(--text-secondary);">No potential issues were flagged for this inspection.</p>'}
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3>Officer Remarks</h3>
          </div>
          <div class="card-body">
            <textarea id="officer-remarks" rows="4" placeholder="Enter manual inspection notes or remarks here..." onblur="App.saveRemarks('${inspection.id}', this.value)">${inspection.officerRemarks || ''}</textarea>
          </div>
        </div>
        
        <div style="display:flex;justify-content:flex-end;">
           <a href="#/report/${inspection.id}" class="btn btn-primary btn-lg">Complete Inspection & Generate Report</a>
        </div>
      </div>
    `;
  }

  function renderReport(inspection) {
     if (!inspection) return '<div class="empty-state">Inspection not found.</div>';
     
     return `
       <div class="page-hdr-row">
         <div>
           <h1>Inspection Report</h1>
           <p>Final preliminary report for record keeping.</p>
         </div>
         <div style="display:flex;gap:1rem;">
            <a href="#/assessment/${inspection.id}" class="btn btn-secondary">${Icons.get('arrow-left', 16)} Assessment</a>
            <button class="btn btn-primary" onclick="App.downloadPDF('${inspection.id}')">${Icons.get('download', 16)} Generate PDF</button>
         </div>
       </div>
       
       <div id="report-content" class="report-wrap">
          <div class="rpt-hdr">
             <h1>Maanak Lens</h1>
             <div style="font-size:0.9rem;opacity:0.9;">Preliminary Legal Metrology Inspection Report</div>
          </div>
          <div class="rpt-body">
             <div class="rpt-section">
                <div class="rpt-meta-grid">
                   <div class="rpt-meta-item">
                      <div class="rpt-meta-lbl">Inspection ID</div>
                      <div class="rpt-meta-val" style="font-family:var(--mono)">${inspection.id}</div>
                   </div>
                   <div class="rpt-meta-item">
                      <div class="rpt-meta-lbl">Date & Time</div>
                      <div class="rpt-meta-val">${new Date(inspection.date).toLocaleString()}</div>
                   </div>
                   <div class="rpt-meta-item">
                      <div class="rpt-meta-lbl">Product Category</div>
                      <div class="rpt-meta-val">${inspection.category || 'Unspecified'}</div>
                   </div>
                   <div class="rpt-meta-item">
                      <div class="rpt-meta-lbl">Overall Status</div>
                      <div class="rpt-meta-val" style="font-weight:700;">${OVERALL_STATUSES[inspection.status].label}</div>
                   </div>
                </div>
             </div>
             
             <div class="rpt-section">
                <h3>Checklist Summary</h3>
                <div style="font-size:0.85rem;">
                   ${Components.DeclarationTable(inspection.results)}
                </div>
             </div>
             
             ${inspection.issues && inspection.issues.length > 0 ? `
             <div class="rpt-section">
                <h3>Officer Verification</h3>
                <ul style="padding-left:1.2rem;font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
                   ${inspection.issues.map(i => `
                      <li style="margin-bottom:0.5rem;">
                         <strong>${i.label}:</strong> ${i.message}<br>
                         Verification: <span style="font-weight:700;color:var(--navy);text-transform:uppercase;">${i.officerVerification || 'Pending'}</span>
                      </li>
                   `).join('')}
                </ul>
             </div>
             ` : ''}
             
             ${inspection.officerRemarks ? `
             <div class="rpt-section">
                <h3>Remarks</h3>
                <p style="font-size:0.85rem;white-space:pre-wrap;">${inspection.officerRemarks}</p>
             </div>
             ` : ''}
             
             <div class="disclaimer-box">
                This report is an automated preliminary screening based on text detected from the submitted package image. It does not constitute a final legal determination. Final verification must be performed by an authorized Legal Metrology officer with reference to the applicable provisions and product-specific requirements.
             </div>
          </div>
       </div>
     `;
  }

  return { 
    renderLanding, renderDashboard, renderNewInspection, renderProcessing, 
    renderAssessment, renderEvidence, renderVerify, renderReport 
  };
})();
