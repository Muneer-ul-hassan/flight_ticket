import { FlightBookingForm } from "@shared/schema";

declare global {
  interface Window {
    jsPDF: any;
  }
}

async function loadJsPDF(): Promise<void> {
  if (window.jsPDF) return;
  
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    
    script.onload = () => {
      // Wait a bit for the library to initialize
      setTimeout(() => {
        if (window.jsPDF && typeof window.jsPDF.jsPDF === 'function') {
          resolve();
        } else {
          reject(new Error('jsPDF failed to initialize'));
        }
      }, 100);
    };
    
    script.onerror = () => reject(new Error('Failed to load jsPDF script'));
    
    document.head.appendChild(script);
    
    // Timeout after 15 seconds
    setTimeout(() => reject(new Error('jsPDF loading timeout')), 15000);
  });
}

export async function generatePDF(formData: FlightBookingForm): Promise<void> {
  try {
    // Load jsPDF with better error handling
    await loadJsPDF();
    if (!window.jsPDF || typeof window.jsPDF.jsPDF !== 'function') {
      throw new Error('jsPDF library failed to load properly');
    }
    const { jsPDF } = window.jsPDF;
    const doc = new jsPDF();
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 6;
    const addText = (text: string, x: number, y: number, fontSize: number = 10, fontStyle: string = 'normal') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);
      doc.text(text, x, y);
      return y + lineHeight + (fontSize > 12 ? 2 : 0);
    };
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return `${days[date.getDay()]} ${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]}`;
    };
    // Header
    doc.setTextColor(0, 0, 0);
    yPos = addText('ELECTRONIC TICKET', margin, yPos, 18, 'bold');
    yPos += 12;
    yPos = addText(`Issued on: ${new Date().toLocaleDateString('en-GB')}`, margin, yPos, 11);
    yPos += 22;
    // Booking Reference
    const bookingRef = formData.pnr || '';
    yPos = addText(`Booking Reference (PNR): ${bookingRef}`, margin, yPos, 13, 'bold');
    yPos += 22;
    // Passenger Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 20, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 20);
    yPos = addText('Passenger(s) Name', margin + 2, yPos + 10, 12, 'bold');
    addText('Baggage Limit', margin + 70, yPos - 10, 12, 'bold');
    addText('e-Ticket Number', margin + 130, yPos - 10, 12, 'bold');
    yPos += 15;
    // Passenger Details
    formData.passengers.forEach((passenger: any, index: number) => {
      const rowHeight = 45;
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), rowHeight);
      // Name: LAST NAME / GIVEN NAME
      let lastName = '';
      let givenName = '';
      if (passenger.fullName) {
        const parts = passenger.fullName.trim().split(' ');
        if (parts.length > 1) {
          lastName = parts[parts.length - 1].toUpperCase();
          givenName = parts.slice(0, parts.length - 1).join(' ').toUpperCase();
        } else {
          givenName = parts[0].toUpperCase();
        }
      }
      const nameFormatted = lastName && givenName ? `${lastName} / ${givenName}` : givenName || lastName;
      const title = index === 0 ? 'Mr.' : 'Ms.';
      yPos = addText(`${nameFormatted} ${title}`, margin + 2, yPos + 10, 12, 'bold');
      // Baggage details (only if provided)
      let baggageY = yPos - 10;
      const baggage = [
        passenger.baggageQuantity ? `${passenger.baggageQuantity}x` : '',
        passenger.baggageWeight ? `${passenger.baggageWeight}kg` : '',
        passenger.handBaggageQuantity ? `${passenger.handBaggageQuantity}x Hand` : '',
        passenger.handBaggageWeight ? `${passenger.handBaggageWeight}kg Hand` : '',
        passenger.personalBagQuantity ? `${passenger.personalBagQuantity}x Personal` : '',
        passenger.personalBagWeight ? `${passenger.personalBagWeight}kg Personal` : ''
      ].filter(Boolean).join(', ');
      if (baggage) {
        baggageY = addText(baggage, margin + 70, baggageY, 11);
      }
      addText(passenger.eTicketNumber || '', margin + 130, yPos - 2, 11);
      yPos += rowHeight;
    });
    yPos += 18;
    // Important notice
    doc.setFillColor(255, 255, 200);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 40, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 40);
    yPos += 12;
    yPos = addText('IMPORTANT: PLEASE ENSURE YOU CHECK YOUR EMAILS RECEIVED FROM THE AIRLINE', margin + 5, yPos, 12, 'bold');
    yPos = addText('OR FROM THE TRAVEL AGENCY REGARDING ANY CHANGES OR CANCELLATIONS AND', margin + 5, yPos, 12, 'bold');
    yPos = addText('STAY AWARE OF ANY CHANGES IN THE SCHEDULE MADE BY THE AIRLINE. YOU CAN', margin + 5, yPos, 12, 'bold');
    yPos = addText('ALWAYS VERIFY YOUR TRAVEL DETAILS FROM THE AIRLINE WEBSITE.', margin + 5, yPos, 12, 'bold');
    yPos += 25;
    // Flight segments
    formData.flightSegments.forEach((segment, index) => {
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }
      yPos = addText(`${segment.from} – ${segment.to}`, margin, yPos, 16, 'bold');
      yPos += 15;
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 60, 'F');
      doc.setDrawColor(0, 0, 0);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 60);
      yPos = addText(`Flight ${segment.flightNumber}`, margin + 5, yPos + 10, 14, 'bold');
      yPos = addText(`Operated By ${segment.airline}`, margin + 5, yPos, 12);
      
      // Add ticket class
      const ticketTypeDisplay = segment.ticketType ? 
        `Ticket Class: ${segment.ticketType.charAt(0).toUpperCase() + segment.ticketType.slice(1)}` : 
        'Ticket Class: Economy';
      yPos = addText(ticketTypeDisplay, margin + 5, yPos, 12, 'bold');
      yPos += 10;
      const formattedDate = formatDate(segment.date);
      yPos = addText(`Departure ${formattedDate} ${segment.departureTime} ${segment.from} Airport`, margin + 5, yPos, 12);
      yPos = addText(`Arrival   ${formattedDate} ${segment.arrivalTime} ${segment.to} Airport`, margin + 5, yPos, 12);
      yPos += 25;
    });
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    yPos += 15;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated e-ticket. Please keep this document for your records.', margin, yPos);
    doc.text('For any inquiries, please contact customer service with your booking reference number.', margin, yPos + 10);
    doc.save(`e-ticket-${bookingRef || 'no-pnr'}.pdf`);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
