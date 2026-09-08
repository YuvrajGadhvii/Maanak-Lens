/* js/inspectionStore.js — local storage management */
const InspectionStore = (function() {
  const STORAGE_KEY = 'maanaklens_inspections';

  function getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse inspections from local storage', e);
      return [];
    }
  }

  function getById(id) {
    const all = getAll();
    return all.find(i => i.id === id);
  }

  function save(inspection) {
    const all = getAll();
    const index = all.findIndex(i => i.id === inspection.id);
    if (index >= 0) {
      all[index] = inspection;
    } else {
      all.unshift(inspection); // Add to beginning
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.error('Failed to save inspection', e);
    }
  }
  
  function updateIssueVerification(inspectionId, issueId, verificationState) {
     const inspection = getById(inspectionId);
     if (inspection) {
         const issue = inspection.issues.find(i => i.fieldId === issueId);
         if (issue) {
             issue.officerVerification = verificationState;
             save(inspection);
         }
     }
  }
  
  function saveRemarks(inspectionId, remarks) {
     const inspection = getById(inspectionId);
     if (inspection) {
         inspection.officerRemarks = remarks;
         save(inspection);
     }
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { getAll, getById, save, clearAll, updateIssueVerification, saveRemarks };
})();
