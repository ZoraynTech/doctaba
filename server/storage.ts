import {
  type User,
  type InsertUser,
  type Appointment,
  type InsertAppointment,
  type Message,
  type InsertMessage,
  type Document,
  type InsertDocument
} from "@shared/schema";
import session from "express-session";
import { MemoryStorage } from "./memoryStorage";

export interface IStorage {
  sessionStore: session.Store;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: any): Promise<User>; // For Replit auth
  
  // Appointments
  getAppointments(userId: number, userType: 'doctor' | 'patient'): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;
  
  // Messages
  getMessages(userId: number): Promise<Message[]>;
  getConversation(user1Id: number, user2Id: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageRead(id: number): Promise<void>;
  
  // Documents
  getUserDocuments(userId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
}

export const storage = new MemoryStorage();
