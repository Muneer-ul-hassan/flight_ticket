import FlightBookingForm from "@/components/flight-booking-form";
import { Plane } from "lucide-react";

export default function FlightBookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-airline-blue rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Professional E-Ticket Generator</h1>
              <p className="text-gray-600">Enter client details and generate professional e-tickets instantly</p>
            </div>
          </div>
        </div>

        <FlightBookingForm />
      </div>
    </div>
  );
}
