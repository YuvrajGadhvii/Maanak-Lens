/* js/reportGenerator.js — PDF generation */
const ReportGenerator = (function() {
  
  async function generatePDF(inspection, elementId = 'report-content') {
     if (!window.jspdf || !window.jspdf.jsPDF) {
         alert("PDF library not loaded.");
         return;
     }
     
     const { jsPDF } = window.jspdf;
     const doc = new jsPDF('p', 'mm', 'a4');
     const element = document.getElementById(elementId);
     
     if (!element) return;
     
     // Simple text-based PDF for MVP fallback, or use html2canvas if added later.
     // For this plain JS version, we will generate a clean structured PDF using jsPDF API.
     
     doc.setFont("helvetica");
     
     // Header
     doc.setFillColor(111, 230, 60); // Primary green (#6fe63c)
     doc.rect(0, 0, 210, 30, 'F');
     doc.setTextColor(255, 255, 255);
     doc.setFontSize(22);
     doc.text("Maanak Lens", 105, 15, { align: 'center' });
     doc.setFontSize(10);
     doc.text("Preliminary Legal Metrology Inspection Report", 105, 22, { align: 'center' });
     
     // Meta info
     doc.setTextColor(50, 50, 50);
     doc.setFontSize(10);
     doc.text(`Inspection ID: ${inspection.id}`, 15, 40);
     doc.text(`Date: ${new Date(inspection.date).toLocaleString()}`, 15, 46);
     doc.text(`Category: ${inspection.category}`, 15, 52);
     doc.text(`OCR Quality: ${Math.round(inspection.ocrConfidence || 0)}%`, 15, 58);
     
     // Status
     doc.setFontSize(12);
     doc.setFont("helvetica", "bold");
     doc.text(`Overall Status: ${OVERALL_STATUSES[inspection.status].label}`, 15, 70);
     
     // Declarations Table
     let y = 85;
     doc.setFontSize(14);
     doc.text("Declarations Extracted", 15, y);
     y += 10;
     
     doc.setFontSize(10);
     doc.setFont("helvetica", "bold");
     doc.text("Field", 15, y);
     doc.text("Status", 70, y);
     doc.text("Evidence", 120, y);
     doc.line(15, y+2, 195, y+2);
     y += 8;
     
     doc.setFont("helvetica", "normal");
     inspection.results.forEach(res => {
         doc.text(res.label, 15, y);
         doc.text(res.resultLabel, 70, y);
         
         const splitEvidence = doc.splitTextToSize(res.evidence, 75);
         doc.text(splitEvidence, 120, y);
         
         y += (splitEvidence.length * 5) + 3;
         if (y > 270) {
             doc.addPage();
             y = 20;
         }
     });
     
     // Issues
     if (inspection.issues && inspection.issues.length > 0) {
         y += 10;
         doc.setFont("helvetica", "bold");
         doc.setFontSize(14);
         doc.text("Potential Issues & Officer Verification", 15, y);
         y += 10;
         
         doc.setFontSize(10);
         inspection.issues.forEach(issue => {
             doc.setFont("helvetica", "bold");
             doc.text(issue.label, 15, y);
             doc.setFont("helvetica", "normal");
             y += 6;
             const splitMsg = doc.splitTextToSize(`Message: ${issue.message}`, 180);
             doc.text(splitMsg, 15, y);
             y += (splitMsg.length * 5) + 2;
             
             doc.text(`Verification: ${issue.officerVerification || 'Pending'}`, 15, y);
             y += 10;
             if (y > 270) {
                 doc.addPage();
                 y = 20;
             }
         });
     }
     
     // Remarks
     if (inspection.officerRemarks) {
         y += 10;
         doc.setFont("helvetica", "bold");
         doc.text("Officer Remarks:", 15, y);
         y += 6;
         doc.setFont("helvetica", "normal");
         const splitRemarks = doc.splitTextToSize(inspection.officerRemarks, 180);
         doc.text(splitRemarks, 15, y);
         y += (splitRemarks.length * 5) + 10;
     }
     
     // Disclaimer
     y = Math.max(y, 250); // Push to bottom if space permits
     if (y > 270) {
         doc.addPage();
         y = 250;
     }
     doc.setFontSize(8);
     doc.setTextColor(100, 100, 100);
     const disclaimer = "DISCLAIMER: This report is an automated preliminary screening based on text detected from the submitted package image. It does not constitute a final legal determination. Final verification must be performed by an authorized Legal Metrology officer with reference to the applicable provisions and product-specific requirements.";
     const splitDisclaimer = doc.splitTextToSize(disclaimer, 180);
     doc.text(splitDisclaimer, 15, y);
     
     doc.save(`Maanak_Lens_Report_${inspection.id}.pdf`);
  }

  return { generatePDF };
})();
