import { FlightBookingForm } from "@shared/schema";

interface BrandingOptions {
  logoUrl?: string;
}

export function generateWorkingPDF(formData: FlightBookingForm, branding?: BrandingOptions): void {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup blocked! Please allow popups for PDF generation.');
      return;
    }

    // Use user-provided PNR, fallback to 'NO-PNR' if not provided
    const pnr = formData.pnr && formData.pnr.trim() ? formData.pnr.trim().toUpperCase() : 'NO-PNR';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>E-Ticket ${pnr}</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            margin: 38px; 
            font-size: 11px; 
            line-height: 1.35;
            color: #000;
        }
        .logo-section {
            margin-bottom: 18px;
            min-height: 55px;
        }
        .logo {
            max-height: 110px;
            max-width: 260px;
            object-fit: contain;
        }
        .header { 
            text-align: center; 
            font-size: 17.5px; 
            font-weight: bold; 
            margin-bottom: 18px; 
            letter-spacing: 1.75px;
        }
        .booking-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 18px;
            font-size: 11.75px;
        }
        .booking-ref {
            font-weight: bold;
        }
        .issue-date {
            color: #666;
        }
        .flight-segment {
            border: 1px solid #000;
            margin-bottom: 14px;
            background: white;
        }
        .segment-header {
            background: #e8e8e8;
            padding: 8px 12px;
            font-weight: bold;
            font-size: 12px;
            border-bottom: 1px solid #000;
        }
        .segment-table {
            width: 100%;
            border-collapse: collapse;
        }
        .segment-table td {
            padding: 14px 19px;
            border-bottom: 1px solid #ddd;
            vertical-align: top;
        }
        .segment-table .label {
            font-weight: bold;
            width: 120px;
            background: #f5f5f5;
        }
        .passenger-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000;
            margin-top: 20px;
        }
        .passenger-table th {
            background: #e8e8e8;
            padding: 8px;
            text-align: left;
            border: 1px solid #000;
            font-weight: bold;
            font-size: 11px;
        }
        .passenger-table td {
            padding: 8px;
            border: 1px solid #000;
            font-size: 11px;
            vertical-align: top;
        }
        .baggage-info {
            font-size: 10px;
            color: #000;
        }
        .important-info {
            margin-top: 20px;
            font-size: 10px;
            color: #000;
        }
        @media print {
            body { -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="logo-section">
        ${branding?.logoUrl ? `<img src="${branding.logoUrl}" alt="Company Logo" class="logo">` : ''}
    </div>

    <div class="header">ELECTRONIC TICKET</div>

    <div class="booking-info">
        <div class="booking-ref">Booking Reference (PNR): ${pnr}</div>
        <div class="issue-date">Issued on: ${new Date().toLocaleDateString('en-GB')}</div>
    </div>

    ${formData.flightSegments.map((segment: any, index: number) => {
      // Use both backend and frontend field names for compatibility (bracket notation, TS any)
      const depCity = segment['departureCity'] || segment['from'] || '';
      const arrCity = segment['arrivalCity'] || segment['to'] || '';
      const depDateStr = segment['departureDate'] || segment['date'] || '';
      const arrDateStr = segment['arrivalDate'] || segment['date'] || '';
      const depDateObj = depDateStr ? new Date(depDateStr) : null;
      const arrDateObj = arrDateStr ? new Date(arrDateStr) : null;
      const depDay = depDateObj ? depDateObj.getDate().toString().padStart(2, '0') : '';
      const depMonth = depDateObj ? depDateObj.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase() : '';
      const depWeekDay = depDateObj ? depDateObj.toLocaleDateString('en-GB', { weekday: 'long' }).toUpperCase() : '';
      const arrDay = arrDateObj ? arrDateObj.getDate().toString().padStart(2, '0') : '';
      const arrMonth = arrDateObj ? arrDateObj.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase() : '';
      const arrWeekDay = arrDateObj ? arrDateObj.toLocaleDateString('en-GB', { weekday: 'long' }).toUpperCase() : '';
      return `
        <div class="flight-segment">
            <div class="segment-header">
                ${depCity} – ${arrCity}
            </div>
            <table class="segment-table">
                <tr>
                    <td class="label">Flight</td>
                    <td>${segment['flightNumber'] || ''}</td>
                </tr>
                <tr>
                    <td class="label">Operated By</td>
                    <td>${segment['airline'] || ''}</td>
                </tr>
                <tr>
                    <td class="label">Ticket Class</td>
                    <td>${segment['ticketType'] ? segment['ticketType'].charAt(0).toUpperCase() + segment['ticketType'].slice(1) : 'Economy'}</td>
                </tr>
                <tr>
                    <td class="label">Departure</td>
                    <td>${depWeekDay}, ${depDay} ${depMonth} &nbsp;&nbsp;&nbsp; ${segment['departureTime'] || ''} &nbsp;&nbsp;&nbsp; ${depCity}</td>
                </tr>
                <tr>
                    <td class="label">Arrival</td>
                    <td>${arrWeekDay}, ${arrDay} ${arrMonth} &nbsp;&nbsp;&nbsp; ${segment['arrivalTime'] || ''} &nbsp;&nbsp;&nbsp; ${arrCity}</td>
                </tr>
            </table>
        </div>
      `;
    }).join('')}

    <table class="passenger-table">
        <thead>
            <tr>
                <th>Passenger (s) Name</th>
                <th>Baggage Limit</th>
                <th>E-Ticket Number</th>
            </tr>
        </thead>
        <tbody>
            ${formData.passengers.map((passenger: any, index: number) => {
              // Use both backend and frontend field names for compatibility (bracket notation, TS any)
              const lastName = (passenger['lastName'] || (passenger['fullName'] ? passenger['fullName'].split(' ').slice(-1)[0] : '') || '').toUpperCase();
              const givenName = (passenger['firstName'] || (passenger['fullName'] ? passenger['fullName'].split(' ').slice(0, -1).join(' ') : '') || '').toUpperCase();
              const title = passenger['title'] ? ` ${passenger['title']}.` : '';
              const nameFormatted = lastName && givenName ? `${lastName} / ${givenName}${title}` : givenName || lastName;
              // Only show baggage type if quantity > 0, skip if 0 or blank
              const getBagVal = (val: any) => {
                if (val === undefined || val === null) return '';
                if (typeof val === 'string') return val.trim();
                return val;
              };
              // Checked Baggage
              const checkedQty = getBagVal(passenger['baggageQuantity'] ?? passenger['checked23kg'] ?? passenger['checked'] ?? passenger['checkedBag'] ?? passenger['checkedBaggageQuantity']);
              const checkedWgt = getBagVal(passenger['baggageWeight'] ?? passenger['checked23kgWeight'] ?? passenger['checkedWeight'] ?? passenger['checkedBagWeight'] ?? passenger['checkedBaggageWeight']);
              // Hand Baggage
              const handQty = getBagVal(passenger['handBaggageQuantity'] ?? passenger['handCarry'] ?? passenger['cabin7kg'] ?? passenger['cabin'] ?? passenger['cabinBag'] ?? passenger['handQuantity']);
              const handWgt = getBagVal(passenger['handBaggageWeight'] ?? passenger['handCarryWeight'] ?? passenger['cabin7kgWeight'] ?? passenger['cabinWeight'] ?? passenger['cabinBagWeight'] ?? passenger['handWeight']);
              // Personal Bag
              const personalQty = getBagVal(passenger['personalBagQuantity'] ?? passenger['smallBag'] ?? passenger['small'] ?? passenger['personalQuantity']);
              const personalWgt = getBagVal(passenger['personalBagWeight'] ?? passenger['smallBagWeight'] ?? passenger['smallWeight'] ?? passenger['personalWeight']);
              // Always keep the order: Personal Bag, Hand Baggage, Checked Baggage
              let baggageInfoArr: string[] = [];
              // Personal Bag
              if (personalQty && !isNaN(Number(personalQty)) && Number(personalQty) > 0) {
                baggageInfoArr.push(`${personalQty} x ${personalWgt || ''} Personal Baggage`.trim());
              }
              // Hand Baggage
              if (handQty && !isNaN(Number(handQty)) && Number(handQty) > 0) {
                baggageInfoArr.push(`${handQty} x ${handWgt || ''} Hand Baggage`.trim());
              }
              // Checked Baggage
              if (checkedQty && !isNaN(Number(checkedQty)) && Number(checkedQty) > 0) {
                baggageInfoArr.push(`${checkedQty} x ${checkedWgt || ''} Checked Baggage`.trim());
              }
              let baggageInfo = baggageInfoArr.join('<br>');
              return `
                <tr>
                    <td>${nameFormatted}</td>
                    <td class="baggage-info">
                        ${baggageInfo}
                    </td>
                    <td>${passenger['eTicketNumber'] || ''}</td>
                </tr>
              `;
            }).join('')}
        </tbody>
    </table>

    <div class="important-info">
        <strong>IMPORTANT: PLEASE ENSURE YOU CHECK YOUR EMAILS RECEIVED FROM THE AIRLINE OR FROM THE TRAVEL AGENCY REGARDING ANY CHANGES, CANCELLATIONS AND STAY AWARE OF ANY CHANGES IN THE SCHEDULE MADE BY THE AIRLINE. YOU CAN ALWAYS VERIFY YOUR TRAVEL DETAILS FROM THE AIRLINE WEBSITE.</strong>
    </div>
</body>
</html>
  `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('PDF generation failed. Please try again.');
  }
}
