import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FlightBookingForm } from "@shared/schema";
import { Plus, Minus } from "lucide-react";

interface FlightSegmentsSectionProps {
  form: UseFormReturn<FlightBookingForm>;
}

// International airports list
const internationalAirports = [
  // Pakistan
  "Karachi Jinnah International Airport (KHI)",
  "Lahore Allama Iqbal International Airport (LHE)", 
  "Islamabad International Airport (ISB)",
  "Peshawar Bacha Khan International Airport (PEW)",
  "Multan International Airport (MUX)",
  "Sialkot Airport (SKT)",
  "Faisalabad Airport (LYP)",
  "Quetta Airport (UET)",
  
  // Middle East
  "Dubai International Airport (DXB)",
  "Dubai Al Maktoum International Airport (DWC)",
  "Abu Dhabi International Airport (AUH)",
  "Sharjah International Airport (SHJ)",
  "Doha Hamad International Airport (DOH)",
  "Kuwait International Airport (KWI)",
  "Bahrain International Airport (BAH)",
  "Muscat International Airport (MCT)",
  "Riyadh King Khalid International Airport (RUH)",
  "Jeddah King Abdulaziz International Airport (JED)",
  "Dammam King Fahd International Airport (DMM)",
  
  // Europe
  "London Heathrow Airport (LHR)",
  "London Gatwick Airport (LGW)",
  "Manchester Airport (MAN)",
  "Birmingham Airport (BHX)",
  "Paris Charles de Gaulle Airport (CDG)",
  "Amsterdam Schiphol Airport (AMS)",
  "Frankfurt Airport (FRA)",
  "Munich Airport (MUC)",
  "Rome Leonardo da Vinci Airport (FCO)",
  "Madrid Barajas Airport (MAD)",
  "Barcelona Airport (BCN)",
  "Zurich Airport (ZUR)",
  "Vienna International Airport (VIE)",
  "Brussels Airport (BRU)",
  "Copenhagen Airport (CPH)",
  "Stockholm Arlanda Airport (ARN)",
  "Oslo Airport (OSL)",
  "Helsinki Airport (HEL)",
  
  // North America
  "New York John F. Kennedy International Airport (JFK)",
  "New York LaGuardia Airport (LGA)",
  "Newark Liberty International Airport (EWR)",
  "Los Angeles International Airport (LAX)",
  "Chicago O'Hare International Airport (ORD)",
  "Chicago Midway International Airport (MDW)",
  "Miami International Airport (MIA)",
  "San Francisco International Airport (SFO)",
  "Boston Logan International Airport (BOS)",
  "Washington Dulles International Airport (IAD)",
  "Toronto Pearson International Airport (YYZ)",
  "Vancouver International Airport (YVR)",
  "Montreal Pierre Elliott Trudeau International Airport (YUL)",
  
  // Asia
  "Singapore Changi Airport (SIN)",
  "Hong Kong International Airport (HKG)",
  "Tokyo Narita International Airport (NRT)",
  "Tokyo Haneda Airport (HND)",
  "Seoul Incheon International Airport (ICN)",
  "Beijing Capital International Airport (PEK)",
  "Shanghai Pudong International Airport (PVG)",
  "Bangkok Suvarnabhumi Airport (BKK)",
  "Kuala Lumpur International Airport (KUL)",
  "Jakarta Soekarno-Hatta International Airport (CGK)",
  "Manila Ninoy Aquino International Airport (MNL)",
  "Mumbai Chhatrapati Shivaji International Airport (BOM)",
  "Delhi Indira Gandhi International Airport (DEL)",
  "Bangalore International Airport (BLR)",
  "Chennai International Airport (MAA)",
  "Hyderabad International Airport (HYD)",
  "Kolkata Netaji Subhas Chandra Bose International Airport (CCU)",
  
  // Australia & Oceania
  "Sydney Kingsford Smith Airport (SYD)",
  "Melbourne Airport (MEL)",
  "Brisbane Airport (BNE)",
  "Perth Airport (PER)",
  "Auckland Airport (AKL)",
  
  // Africa
  "Cairo International Airport (CAI)",
  "Johannesburg OR Tambo International Airport (JNB)",
  "Cape Town International Airport (CPT)",
  "Casablanca Mohammed V International Airport (CMN)",
  "Lagos Murtala Muhammed International Airport (LOS)",
  "Nairobi Jomo Kenyatta International Airport (NBO)",
  "Addis Ababa Bole International Airport (ADD)",
];

// Airport autocomplete component
const AirportInput = ({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredAirports, setFilteredAirports] = useState<string[]>([]);
  const [isCustom, setIsCustom] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    if (inputValue.length > 0) {
      const filtered = internationalAirports.filter(airport =>
        airport.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredAirports(filtered);
      setShowSuggestions(true);
      setIsCustom(filtered.length === 0);
    } else {
      setShowSuggestions(false);
      setIsCustom(false);
    }
  };

  // Use onMouseDown instead of onClick to avoid losing focus before click
  const handleSuggestionSelect = (airport: string) => {
    onChange(airport);
    setShowSuggestions(false);
    setIsCustom(false);
  };

  return (
    <div className="relative">
      <Input 
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        onFocus={() => {
          if (value.length > 0) {
            const filtered = internationalAirports.filter(airport =>
              airport.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredAirports(filtered);
            setShowSuggestions(true);
            setIsCustom(filtered.length === 0);
          }
        }}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 200);
        }}
      />
      {showSuggestions && filteredAirports.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredAirports.slice(0, 10).map((airport, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onMouseDown={() => handleSuggestionSelect(airport)}
            >
              {airport}
            </div>
          ))}
        </div>
      )}
      {isCustom && value && (
        <div className="mt-1 text-xs text-blue-600">Custom location: {value}</div>
      )}
    </div>
  );
};

export default function FlightSegmentsSection({ form }: FlightSegmentsSectionProps) {
  const { watch, setValue } = form;
  const flightSegments = watch("flightSegments");

  const addSegment = () => {
    if (flightSegments.length < 6) {
      setValue("flightSegments", [
        ...flightSegments,
        {
          from: "",
          to: "",
          date: "",
          arrivalDate: "",
          departureTime: "",
          arrivalTime: "",
          flightNumber: "",
          airline: "",
          ticketType: "",
        },
      ]);
    }
  };

  const removeSegment = (index: number) => {
    if (flightSegments.length > 1) {
      const updatedSegments = flightSegments.filter((_, i) => i !== index);
      setValue("flightSegments", updatedSegments);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Flight Details</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSegment}
            disabled={flightSegments.length >= 6}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Segment
          </Button>
        </div>
      </div>

      {flightSegments.map((_, index) => (
        <div key={index} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Flight Segment {index + 1}</h4>
            {flightSegments.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeSegment(index)}
              >
                <Minus className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name={`flightSegments.${index}.from`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure City</FormLabel>
                  <FormControl>
                    <AirportInput 
                      value={typeof field.value === 'string' ? field.value : ''} 
                      onChange={field.onChange} 
                      placeholder="Karachi Jinnah International Airport (KHI)" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`flightSegments.${index}.to`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival City</FormLabel>
                  <FormControl>
                    <AirportInput 
                      value={typeof field.value === 'string' ? field.value : ''} 
                      onChange={field.onChange} 
                      placeholder="Doha Hamad International Airport (DOH)" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <FormField
              control={form.control}
              name={`flightSegments.${index}.date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Date</FormLabel>
                  <FormControl>
                    <Input type="date" value={typeof field.value === 'string' ? field.value : ''} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`flightSegments.${index}.departureTime`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Time</FormLabel>
                  <FormControl>
                    <Input type="time" value={typeof field.value === 'string' ? field.value : ''} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`flightSegments.${index}.arrivalDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Date</FormLabel>
                  <FormControl>
                    <Input type="date" value={typeof field.value === 'string' ? field.value : ''} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`flightSegments.${index}.arrivalTime`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Time</FormLabel>
                  <FormControl>
                    <Input type="time" value={typeof field.value === 'string' ? field.value : ''} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`flightSegments.${index}.flightNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flight Number</FormLabel>
                  <FormControl>
                    <Input placeholder="QR605" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`flightSegments.${index}.airline`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operated By</FormLabel>
                  <FormControl>
                    <Input placeholder="Qatar Airways" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`flightSegments.${index}.ticketType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Class</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}