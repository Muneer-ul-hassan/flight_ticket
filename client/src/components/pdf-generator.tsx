import { useState } from "react";
import { InsertFlightBooking, FlightSegment, Passenger } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDFGeneratorProps {
  formData: InsertFlightBooking;
  isFormValid: boolean;
  onValidate: () => Promise<boolean>;
}

declare global {
  interface Window {
    jsPDF: any;
  }
}

export default function PDFGenerator({ formData, isFormValid, onValidate }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const loadJsPDF = async (): Promise<void> => {
    if (!window.jsPDF) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      document.head.appendChild(script);
      
      await new Promise<void>((resolve) => {
        script.onload = () => resolve();
      });
    }
  };

  const generatePDF = async (): Promise<void> => {
    const isValid = await onValidate();
    if (!isValid) {
      toast({
        title: "Please fix errors",
        description: "Please complete all required fields before generating PDF.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await loadJsPDF();
      const { jsPDF } = window.jsPDF;
      const doc = new jsPDF();
      
      // Set up the document
      let yPos = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const lineHeight = 5;
      
      // Helper function to add text with proper line breaks
      const addText = (text: string, x: number, y: number, fontSize: number = 11, fontStyle: string = 'normal') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        doc.text(text, x, y);
        return y + lineHeight + (fontSize > 12 ? 4 : 0);
      };
      
      // Check if we need a new page
      const checkNewPage = (requiredSpace: number = 30) => {
        if (yPos > 280 - requiredSpace) {
          doc.addPage();
          yPos = 30;
        }
      };
      
      // Header with airline styling
      doc.setFillColor(25, 118, 210); // airline-blue
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('FLIGHT BOOKING CONFIRMATION', margin, 25);
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPos = 55;
      
      // Booking reference and date
      const bookingRef = `FB-${Date.now().toString().slice(-8)}`;
      yPos = addText(`Booking Reference: ${bookingRef}`, margin, yPos, 12, 'bold');
      yPos = addText(`Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, margin, yPos, 10);
      yPos += 4;
      
      // Personal Information Section
      checkNewPage();
      doc.setFillColor(240, 248, 255); // light blue background
      doc.rect(margin - 5, yPos - 8, pageWidth - (margin * 2) + 10, 20, 'F');
      
      yPos = addText('PERSONAL INFORMATION', margin, yPos, 14, 'bold');
      yPos += 2;
      yPos = addText(`Full Name: ${formData.fullName}`, margin + 5, yPos, 12);
      yPos = addText(`Email Address: ${formData.email}`, margin + 5, yPos, 12);
      yPos = addText(`Phone Number: ${formData.phone}`, margin + 5, yPos, 11);
      yPos += 4;
      
      // Flight Information Section
      checkNewPage(60);
      doc.setFillColor(240, 248, 255);
      doc.rect(margin - 5, yPos - 8, pageWidth - (margin * 2) + 10, 20, 'F');
      
      yPos = addText('FLIGHT INFORMATION', margin, yPos, 14, 'bold');
      yPos += 2;
      
      const flightSegments = formData.flightSegments as FlightSegment[];
      if (flightSegments && Array.isArray(flightSegments)) {
        flightSegments.forEach((segment, index) => {
          checkNewPage(60);
          
          // Segment header
          doc.setFillColor(25, 118, 210);
          doc.setTextColor(255, 255, 255);
          doc.rect(margin + 5, yPos - 5, 15, 12, 'F');
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text((index + 1).toString(), margin + 12, yPos + 2);
          
          doc.setTextColor(0, 0, 0);
          yPos = addText(`Flight Segment ${index + 1}`, margin + 25, yPos, 12, 'bold');
          
          // Flight details in a structured format
          yPos = addText(`Flight: ${segment.flightNumber} - ${segment.airline}`, margin + 10, yPos, 12);
          
          // Add ticket class
          const ticketTypeDisplay = (segment as any).ticketType ? 
            `Ticket Class: ${(segment as any).ticketType.charAt(0).toUpperCase() + (segment as any).ticketType.slice(1)}` : 
            'Ticket Class: Economy';
          yPos = addText(ticketTypeDisplay, margin + 10, yPos, 12, 'bold');
          
          yPos = addText(`Route: ${segment.from} → ${segment.to}`, margin + 10, yPos, 12);
          yPos = addText(`Date: ${new Date(segment.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}`, margin + 10, yPos, 12);
          yPos = addText(`Departure: ${segment.departureTime}`, margin + 10, yPos, 12);
          yPos = addText(`Arrival: ${segment.arrivalTime}`, margin + 10, yPos, 12);
        });
      }
      
      // Passenger Information Section
      checkNewPage(60);
      doc.setFillColor(240, 248, 255);
      doc.rect(margin - 5, yPos - 8, pageWidth - (margin * 2) + 10, 20, 'F');
      
      yPos = addText('PASSENGER INFORMATION', margin, yPos, 14, 'bold');
      yPos += 2;
      
      const passengers = formData.passengers as Passenger[];
      if (passengers && Array.isArray(passengers)) {
        passengers.forEach((passenger, index) => {
          checkNewPage(40);
          
          // Passenger header
          doc.setFillColor(25, 118, 210);
          doc.setTextColor(255, 255, 255);
          doc.rect(margin + 5, yPos - 5, 15, 12, 'F');
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text((index + 1).toString(), margin + 12, yPos + 2);
          
          doc.setTextColor(0, 0, 0);
          yPos = addText(`Passenger ${index + 1}`, margin + 25, yPos, 12, 'bold');
          yPos = addText(`Name: ${passenger.fullName}`, margin + 10, yPos, 12);
          yPos = addText(`E-Ticket Number: ${passenger.eTicketNumber}`, margin + 10, yPos, 12);
          
          const baggageParts = [];
          if (passenger.personalBagQuantity && parseInt(passenger.personalBagQuantity) > 0) {
            baggageParts.push("Personal Bag");
          }
          if (passenger.handBaggageQuantity && parseInt(passenger.handBaggageQuantity) > 0) {
            baggageParts.push("Hand Carry");
          }
          if (passenger.baggageQuantity && parseInt(passenger.baggageQuantity) > 0) {
            baggageParts.push("Checked Bag");
          }

          if (baggageParts.length > 0) {
            const baggageText = baggageParts.join(', ');
            yPos = addText(`Baggage: ${baggageText}`, margin + 10, yPos, 12);
          } else {
            yPos = addText(`Baggage: No additional baggage selected`, margin + 10, yPos, 12);
          }
        });
      }
      
      // Payment Method (if selected)
      if (formData.paymentMethod) {
        checkNewPage(30);
        doc.setFillColor(240, 248, 255);
        doc.rect(margin - 5, yPos - 8, pageWidth - (margin * 2) + 10, 20, 'F');
        
        yPos = addText('PAYMENT INFORMATION', margin, yPos, 14, 'bold');
        yPos += 2;
        const paymentText = formData.paymentMethod === 'stripe' ? 'Credit/Debit Card (Stripe)' : 'PayPal';
        yPos = addText(`Payment Method: ${paymentText}`, margin + 5, yPos, 11);
        yPos += 4;
      }
      
      // Terms acknowledgment
      checkNewPage(30);
      doc.setFillColor(240, 248, 255);
      doc.rect(margin - 5, yPos - 8, pageWidth - (margin * 2) + 10, 20, 'F');
      
      yPos = addText('TERMS & CONDITIONS', margin, yPos, 14, 'bold');
      yPos += 2;
      yPos = addText('✓ Customer has agreed to all booking terms and conditions', margin + 5, yPos, 11);
      yPos += 4;
      
      // Footer
      checkNewPage(40);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('This is a computer-generated booking confirmation. Please keep this document for your records.', margin, yPos);
      doc.text('For any inquiries, please contact customer service with your booking reference number.', margin, yPos + 8);
      doc.text(`Document generated on ${new Date().toLocaleString()}`, margin, yPos + 16);
      
      // Page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, 290);
      }
      
      // Save the PDF
      const fileName = `flight-booking-${bookingRef}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "PDF Generated Successfully!",
        description: `Your booking confirmation has been downloaded as ${fileName}`,
      });
      
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex-1 bg-airline-blue text-white hover:bg-airline-dark transition-colors"
    >
      {isGenerating ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : (
        <Download className="w-5 h-5 mr-2" />
      )}
      {isGenerating ? "Generating PDF..." : "Generate & Download PDF"}
    </Button>
  );
}
