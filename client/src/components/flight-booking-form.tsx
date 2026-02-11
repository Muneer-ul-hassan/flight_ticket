import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { flightBookingSchema, type FlightBookingForm } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, CheckCircle, Loader2 } from "lucide-react";

import FlightSegmentsSection from "./flight-segments-redesign";
import PassengersSection from "./passengers-redesign";
import BrandingSection from "./branding-section";
import { generateWorkingPDF } from "@/lib/clean-pdf";

interface BrandingOptions {
  logoUrl?: string;
}

export default function FlightBookingForm() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [branding, setBranding] = useState<BrandingOptions>({});
  const { toast } = useToast();

  const form = useForm<FlightBookingForm>({
    resolver: zodResolver(flightBookingSchema),
    defaultValues: {
      flightSegments: [{
        from: "",
        to: "",
        date: "",
        arrivalDate: "",
        departureTime: "",
        arrivalTime: "",
        flightNumber: "",
        airline: "",
        ticketType: "economy",
      }],
      passengers: [{
        title: "Mr",
        fullName: "",
        eTicketNumber: "",
        baggageQuantity: "1",
        baggageWeight: "23kg",
        handBaggageQuantity: "1",
        handBaggageWeight: "7kg",
        personalBagQuantity: "1",
        personalBagWeight: "Small",
      }],
    },
  });

  const submitBookingMutation = useMutation({
    mutationFn: async (data: FlightBookingForm) => {
      const response = await apiRequest("POST", "/api/bookings", {
        fullName: "User", // Assuming a generic name or extracting from form if added
        email: "user@example.com",
        phone: "00000000",
        flightSegments: data.flightSegments,
        passengers: data.passengers,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Submitted Successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FlightBookingForm) => {
    submitBookingMutation.mutate(data);
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const formData = form.getValues();
      generateWorkingPDF(formData, branding);
      toast({
        title: "E-Ticket Generated Successfully!",
        description: "Your professional e-ticket with branding is ready to print or save.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BrandingSection branding={branding} onBrandingChange={setBranding} />

        {/* PNR Field */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="pnr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Reference (PNR) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter booking reference (e.g., ABC123)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <FlightSegmentsSection form={form} />
        <PassengersSection form={form} />





        {/* Generate E-Ticket Section */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Button
                type="button"
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="w-full sm:w-auto px-8 py-4 bg-airline-blue text-white hover:bg-airline-dark text-lg font-semibold"
              >
                {isGeneratingPDF ? (
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                ) : (
                  <Download className="w-6 h-6 mr-3" />
                )}
                {isGeneratingPDF ? "Generating E-Ticket..." : "Generate Professional E-Ticket"}
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Creates a professional airline-style e-ticket PDF for your client
              </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}