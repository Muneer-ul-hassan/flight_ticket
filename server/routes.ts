import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFlightBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Flight booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = insertFlightBookingSchema.parse(req.body);
      
      // Create the booking
      const booking = await storage.createFlightBooking(validatedData);
      
      res.status(201).json({
        success: true,
        booking: {
          id: booking.id,
          fullName: booking.fullName,
          email: booking.email,
          createdAt: booking.createdAt,
        },
        message: "Booking created successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Error creating booking:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllFlightBookings();
      res.json({
        success: true,
        bookings: bookings.map(booking => ({
          id: booking.id,
          fullName: booking.fullName,
          email: booking.email,
          createdAt: booking.createdAt,
        })),
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
        });
      }

      const booking = await storage.getFlightBooking(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      res.json({
        success: true,
        booking,
      });
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
