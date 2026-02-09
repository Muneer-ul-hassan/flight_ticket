import { UseFormReturn } from "react-hook-form";
import { FlightBookingForm } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";

interface PassengersSectionProps {
  form: UseFormReturn<FlightBookingForm>;
}

export default function PassengersSection({ form }: PassengersSectionProps) {
  const passengerCount = form.watch("passengerCount");

  const updatePassengerCount = (count: number) => {
    form.setValue("passengerCount", count);
    
    // Update the passengers array
    const currentPassengers = form.getValues("passengers");
    const newPassengers = Array.from({ length: count }, (_, index) => {
      return currentPassengers[index] || {
        name: "",
        eTicketNumber: "",
        baggage: [],
      };
    });
    form.setValue("passengers", newPassengers);
  };

  const updateBaggage = (passengerIndex: number, baggage: string, checked: boolean) => {
    const currentBaggage = form.getValues(`passengers.${passengerIndex}.baggage`) || [];
    let newBaggage: string[];
    
    if (checked) {
      newBaggage = [...currentBaggage, baggage];
    } else {
      newBaggage = currentBaggage.filter(b => b !== baggage);
    }
    
    form.setValue(`passengers.${passengerIndex}.baggage`, newBaggage as ("personal" | "carry" | "checked")[]);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Users className="w-5 h-5 mr-2 text-airline-blue" />
          Passenger Information
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            How many passengers? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <label key={num} className="relative cursor-pointer">
                <input
                  type="radio"
                  value={num}
                  checked={passengerCount === num}
                  onChange={() => updatePassengerCount(num)}
                  className="sr-only peer"
                />
                <div className="w-full p-3 text-center border-2 border-gray-300 rounded-lg peer-checked:border-airline-blue peer-checked:bg-airline-light peer-checked:text-airline-dark transition-all">
                  {num}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Passenger Details */}
        <div className="space-y-4">
          {Array.from({ length: passengerCount }, (_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-airline-blue text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                Passenger {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`passengers.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Passenger Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Full name as on passport"
                          className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`passengers.${index}.eTicketNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        E-Ticket Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., 157-2389127987"
                          className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Baggage Options
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: "personal", label: "Personal Bag" },
                      { id: "carry", label: "Hand Carry" },
                      { id: "checked", label: "Checked Bag" },
                    ].map((option) => {
                      const currentBaggage = form.watch(`passengers.${index}.baggage`) || [];
                      const isChecked = currentBaggage.includes(option.id);
                      
                      return (
                        <label key={option.id} className="flex items-center">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => 
                              updateBaggage(index, option.id, checked as boolean)
                            }
                            className="w-4 h-4 text-airline-blue border-gray-300 rounded focus:ring-airline-blue"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
