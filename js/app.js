/* js/app.js — Main Application Router & Controller */
const App = (function () {

  let currentFile = null;
  let currentImagePreview = null;
  let currentCategory = 'Food';

  function init() {
    window.addEventListener('hashchange', router);
    // Initial route
    if (!window.location.hash) {
      window.location.hash = '#/';
    } else {
      router();
    }
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.style.background = 'var(--navy-dark)';
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(16px)';
      t.style.transition = 'all 0.3s ease';
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  function getSidebar() {
    const hash = window.location.hash;
    if (hash === '#/' || hash === '') return ''; // No sidebar on landing

    return `
      <div class="sidebar">
        <div class="sidebar-logo" onclick="window.location.hash='#/'" style="padding-bottom:1.5rem; padding-top:1.5rem;">
          <img src="assets/logo.png" alt="Maanak Lens Logo" style="height:120px; object-fit:contain; margin:0 auto; display:block;">
        </div>
        <div class="sidebar-nav">
          <div class="sidebar-section-label">Menu</div>
          <a href="#/dashboard" class="nav-item ${hash === '#/dashboard' ? 'active' : ''}">${Icons.get('home', 18)} Dashboard</a>
          <a href="#/new" class="nav-item ${hash === '#/new' ? 'active' : ''}">${Icons.get('plus', 18)} New Inspection</a>
          <div style="margin-top:2rem;" class="sidebar-section-label">System</div>
          <a class="nav-item" onclick="App.clearData()">${Icons.get('x', 18)} Clear Data</a>
        </div>
        <div class="sidebar-footer">
          Prototype &bull; SIH<br>Not for legal use.
        </div>
      </div>
    `;
  }

  function render(html) {
    const appDiv = document.getElementById('app');
    const hash = window.location.hash;

    if (hash === '#/' || hash === '') {
      appDiv.innerHTML = html;
    } else {
      appDiv.innerHTML = `
         <div class="app-layout">
           ${getSidebar()}
           <div class="main-content">
             <div class="content-area">
               ${html}
             </div>
           </div>
         </div>
       `;
    }
  }

  function router() {
    const hash = window.location.hash;
    const path = hash.split('/');
    const route = path[1] || '';
    const id = path[2];

    switch (route) {
      case '':
        render(Pages.renderLanding());
        break;
      case 'dashboard':
        render(Pages.renderDashboard());
        break;
      case 'new':
        currentFile = null;
        currentImagePreview = null;
        render(Pages.renderNewInspection());
        setupDragDrop();
        break;
      case 'processing':
        render(Pages.renderProcessing());
        break;
      case 'assessment':
        render(Pages.renderAssessment(InspectionStore.getById(id)));
        break;
      case 'evidence':
        render(Pages.renderEvidence(InspectionStore.getById(id)));
        break;
      case 'verify':
        render(Pages.renderVerify(InspectionStore.getById(id)));
        break;
      case 'report':
        render(Pages.renderReport(InspectionStore.getById(id)));
        break;
      default:
        render('<h2>404 - Page Not Found</h2>');
    }
  }

  // ---- NEW INSPECTION FLOW ----

  function setupDragDrop() {
    const zone = document.getElementById('upload-area');
    if (!zone) return;

    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', e => { e.preventDefault(); zone.classList.remove('dragover'); });
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
  }

  function handleImageSelect(e) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }

  function handleFile(file) {
    if (!file.type.match('image.*')) {
      alert("Please select an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please select an image under 10MB.");
      return;
    }

    currentFile = file;
    const reader = new FileReader();
    reader.onload = function (e) {
      currentImagePreview = e.target.result;
      document.getElementById('upload-area').style.display = 'none';
      const previewArea = document.getElementById('preview-area');
      previewArea.style.display = 'block';
      document.getElementById('img-preview').src = currentImagePreview;
    }
    reader.readAsDataURL(file);
  }

  function cancelUpload() {
    currentFile = null;
    currentImagePreview = null;
    document.getElementById('file-upload').value = '';
    document.getElementById('preview-area').style.display = 'none';
    document.getElementById('upload-area').style.display = 'block';
  }

  async function startAnalysis() {
    if (!currentFile) return;

    const catSelect = document.getElementById('insp-category');
    currentCategory = catSelect ? catSelect.value : 'Other';

    window.location.hash = '#/processing';

    // Simulate initial steps
    setTimeout(() => updateProgress(2, 'Initializing OCR...', 10), 500);

    try {
      const ocrResult = await OCREngine.recognize(currentFile, (info) => {
        // Map tesseract progress to our UI
        if (info.status === 'Reading package text...') {
          updateProgress(2, `Reading package text... ${Math.round(info.progress * 100)}%`, 10 + (info.progress * 60));
        } else if (info.status === 'Initializing OCR engine...') {
          updateProgress(1, 'Loading OCR Engine...', 5);
        }
      });

      if (!ocrResult.success) {
        alert("OCR Failed: " + ocrResult.error);
        window.location.hash = '#/new';
        return;
      }

      updateProgress(3, 'Identifying declarations...', 80);

      // Artificial delay so user sees the step
      await new Promise(r => setTimeout(r, 800));

      const fields = FieldExtractor.extract(ocrResult.text);

      updateProgress(4, 'Evaluating checklist...', 90);
      await new Promise(r => setTimeout(r, 800));

      const evaluation = RuleEngine.evaluate(fields, ocrResult.confidence);

      // Save result
      const inspectionId = 'INSP-' + Date.now().toString().slice(-6);
      const inspection = {
        id: inspectionId,
        date: new Date().toISOString(),
        category: currentCategory,
        status: evaluation.overallStatus,
        ocrConfidence: evaluation.ocrConfidence,
        imagePreview: currentImagePreview,
        extractedText: ocrResult.text,
        results: evaluation.results,
        issues: evaluation.issues,
        isDemo: false
      };

      InspectionStore.save(inspection);
      updateProgress(4, 'Complete!', 100);

      setTimeout(() => {
        window.location.hash = '#/assessment/' + inspectionId;
      }, 500);

    } catch (err) {
      console.error(err);
      alert("An error occurred during analysis.");
      window.location.hash = '#/new';
    }
  }

  function updateProgress(stageNum, text, pct) {
    const statusEl = document.getElementById('proc-status');
    const bar = document.getElementById('proc-bar');
    if (statusEl) statusEl.innerText = text;
    if (bar) bar.style.width = pct + '%';

    // Update stage list classes
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById('stage-' + i);
      if (!el) continue;
      if (i < stageNum) {
        el.className = 'stage-item done';
      } else if (i === stageNum) {
        el.className = 'stage-item active';
      } else {
        el.className = 'stage-item';
      }
    }
  }

  // ---- DEMO / UTILS ----

  function loadDemo(num) {
    let data;
    if (num === 1) data = DemoData.getDemo1();
    if (num === 2) data = DemoData.getDemo2();
    if (num === 3) data = DemoData.getDemo3();

    if (data) {
      // Force unique ID so we can load multiple demos
      data.id = data.id.split('-')[0] + '-' + Date.now().toString().slice(-4);
      InspectionStore.save(data);
      window.location.hash = '#/assessment/' + data.id;
      showToast('Demo inspection loaded');
    }
  }

  function setVerify(inspId, issueId, state) {
    InspectionStore.updateIssueVerification(inspId, issueId, state);
    router(); // re-render
  }

  function saveRemarks(inspId, text) {
    InspectionStore.saveRemarks(inspId, text);
  }

  function clearData() {
    if (confirm("Are you sure you want to clear all local inspection data?")) {
      InspectionStore.clearAll();
      window.location.hash = '#/dashboard';
      showToast('Data cleared');
    }
  }

  function downloadPDF(inspId) {
    const insp = InspectionStore.getById(inspId);
    if (insp) {
      showToast('Generating PDF...');
      ReportGenerator.generatePDF(insp);
    }
  }

  // Public API
  return {
    init,
    handleImageSelect,
    cancelUpload,
    startAnalysis,
    loadDemo,
    setVerify,
    saveRemarks,
    clearData,
    downloadPDF
  };
})();

// Start App
document.addEventListener('DOMContentLoaded', App.init);
