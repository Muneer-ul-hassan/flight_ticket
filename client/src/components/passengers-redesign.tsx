import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FlightBookingForm } from "@shared/schema";
import { Plus, Minus } from "lucide-react";

interface PassengersSectionProps {
  form: UseFormReturn<FlightBookingForm>;
}

export default function PassengersSection({ form }: PassengersSectionProps) {
  const { watch, setValue } = form;
  const passengers = watch("passengers");

  const addPassenger = () => {
    if (passengers.length < 6) {
      setValue("passengers", [
        ...passengers,
        {
          title: "",
          firstName: "",
          lastName: "",
          eTicketNumber: "",
          passportNumber: "",
          passportExpiry: "",
          baggageQuantity: "1",
          baggageWeight: "23kg",
          mealPreference: "",
        },
      ]);
    }
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      setValue("passengers", updatedPassengers);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Passenger Information</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPassenger}
            disabled={passengers.length >= 6}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Passenger
          </Button>
        </div>
      </div>

      {passengers.map((_, index) => (
        <div key={index} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Passenger {index + 1}</h4>
            {passengers.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removePassenger(index)}
              >
                <Minus className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormField
              control={form.control}
              name={`passengers.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Miss">Miss</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`passengers.${index}.firstName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passenger Name (Manual Entry)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="AHMED/HASSAN Mr." 
                      {...field} 
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`passengers.${index}.lastName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="MUHAMMAD" 
                      {...field} 
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name={`passengers.${index}.eTicketNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Ticket Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 157-2389127987" 
                      {...field} 
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Baggage Information */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-4">Baggage Information</h4>
            
            {/* Checked Baggage */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Checked Baggage</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`passengers.${index}.baggageQuantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          min="0"
                          max="10"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`passengers.${index}.baggageWeight`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="23kg" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Hand Baggage */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Hand Baggage</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`passengers.${index}.handBaggageQuantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          min="0"
                          max="5"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`passengers.${index}.handBaggageWeight`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="7kg" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Personal Bag */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Personal Bag</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`passengers.${index}.personalBagQuantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          min="0"
                          max="2"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`passengers.${index}.personalBagWeight`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight/Size</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="Small" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-800">
                Standard allowance: 1x 7kg Hand baggage, 1x Personal Bag included
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}