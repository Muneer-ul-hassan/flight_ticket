import { flightBookings, type FlightBooking, type InsertFlightBooking } from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createFlightBooking(booking: InsertFlightBooking): Promise<FlightBooking>;
  getFlightBooking(id: number): Promise<FlightBooking | undefined>;
  getAllFlightBookings(): Promise<FlightBooking[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createFlightBooking(booking: InsertFlightBooking): Promise<FlightBooking> {
    const [flightBooking] = await db.insert(flightBookings).values(booking).returning();
    return flightBooking;
  }

  async getFlightBooking(id: number): Promise<FlightBooking | undefined> {
    const [flightBooking] = await db.select().from(flightBookings).where(eq(flightBookings.id, id));
    return flightBooking;
  }

  async getAllFlightBookings(): Promise<FlightBooking[]> {
    return await db.select().from(flightBookings);
  }
}

export const storage = new DatabaseStorage();
