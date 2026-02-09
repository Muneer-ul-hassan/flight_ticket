import { UseFormReturn } from "react-hook-form";
import { FlightBookingForm } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface PersonalInfoSectionProps {
  form: UseFormReturn<FlightBookingForm>;
}

export default function PersonalInfoSection({ form }: PersonalInfoSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <User className="w-5 h-5 mr-2 text-airline-blue" />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name (Surname/Given Name) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your full name as shown on passport"
                      className="px-4 py-3 focus:ring-2 focus:ring-airline-blue focus:border-transparent transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Address <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="your.email@example.com"
                      className="px-4 py-3 focus:ring-2 focus:ring-airline-blue focus:border-transparent transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="px-4 py-3 focus:ring-2 focus:ring-airline-blue focus:border-transparent transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
