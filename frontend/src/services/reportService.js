// PDF Report Generation Service
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (reportData, fileName = 'health-report') => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(13, 148, 136); // Primary color
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('HealthAI Report', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  let yPos = 55;
  
  // Health Score Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Health Score', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  
  const scoreColor = reportData.healthScore >= 70 ? [16, 185, 129] : 
                   reportData.healthScore >= 40 ? [245, 158, 11] : [239, 68, 68];
  doc.setTextColor(...scoreColor);
  doc.text(`${reportData.healthScore}/100`, 20, yPos);
  doc.setTextColor(0, 0, 0);
  yPos += 15;
  
  // Risk Level
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Level', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  const riskColors = {
    low: [16, 185, 129],
    medium: [245, 158, 11],
    high: [249, 115, 22],
    critical: [239, 68, 68]
  };
  doc.setTextColor(...(riskColors[reportData.riskLevel] || [0, 0, 0]));
  doc.text(reportData.riskLevel?.toUpperCase() || 'N/A', 20, yPos);
  doc.setTextColor(0, 0, 0);
  yPos += 15;
  
  // Symptoms
  if (reportData.symptoms && reportData.symptoms.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Reported Symptoms', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    reportData.symptoms.forEach((symptom, index) => {
      const symptomText = `• ${symptom.name || symptom}`;
      doc.text(symptomText, 25, yPos);
      yPos += 7;
    });
    yPos += 5;
  }
  
  // Conditions
  if (reportData.conditions && reportData.conditions.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Possible Conditions', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    reportData.conditions.forEach((condition, index) => {
      const conditionText = `• ${condition.name} (${condition.probability}% probability)`;
      doc.text(conditionText, 25, yPos);
      yPos += 7;
    });
    yPos += 5;
  }
  
  // Recommendations
  if (reportData.recommendations && reportData.recommendations.length > 0) {
    // Check if we need a new page
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommendations', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    reportData.recommendations.forEach((rec, index) => {
      const recTitle = rec.title || rec;
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${recTitle}`, 25, yPos);
      yPos += 7;
      
      if (rec.description) {
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(rec.description, 160);
        lines.forEach(line => {
          doc.text(line, 30, yPos);
          yPos += 5;
        });
      }
      yPos += 3;
    });
  }
  
  // Emergency Warning
  if (reportData.hasEmergencyWarning) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFillColor(239, 68, 68);
    doc.rect(0, yPos, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠ EMERGENCY WARNING', 20, yPos + 12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(reportData.emergencyMessage || 'Seek immediate medical attention!', 20, yPos + 22);
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount} | HealthAI - Your Personal Health Assistant`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`${fileName}-${Date.now()}.pdf`);
  
  return true;
};

// Share via Email
export const shareViaEmail = (reportData) => {
  const subject = encodeURIComponent('My HealthAI Report');
  const body = encodeURIComponent(
    `Health Score: ${reportData.healthScore}/100\n` +
    `Risk Level: ${reportData.riskLevel}\n` +
    `Conditions: ${reportData.conditions?.map(c => c.name).join(', ') || 'N/A'}\n\n` +
    `View full report at: ${typeof window !== 'undefined' ? window.location.origin : ''}`
  );
  
  window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
};

// Share via WhatsApp
export const shareViaWhatsApp = (reportData) => {
  const text = encodeURIComponent(
    `🏥 *My HealthAI Report*\n\n` +
    `📊 Health Score: ${reportData.healthScore}/100\n` +
    `⚠️ Risk Level: ${reportData.riskLevel}\n` +
    `🔬 Possible Conditions: ${reportData.conditions?.map(c => c.name).join(', ') || 'N/A'}\n\n` +
    `Check your health at: ${typeof window !== 'undefined' ? window.location.origin : ''}`
  );
  
  window.open(`https://wa.me/?text=${text}`, '_blank');
};

// Generate shareable link
export const generateShareableLink = (reportId) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/results/${reportId}?share=true`;
};

export default {
  generatePDF,
  shareViaEmail,
  shareViaWhatsApp,
  generateShareableLink
};
