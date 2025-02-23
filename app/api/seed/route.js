import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../../../utils/db.js"; // Adjust the relative path as needed
import Admin from "../../../models/Admin.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the HTML seeder page at /admin-seeder
app.get("/admin-seeder", (req, res) => {
  res.sendFile(path.join(__dirname, "admin-seeder.html"));
});

// API endpoint: Get all current admins
app.get("/api/seed/admins", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving admins", error: error.message });
  }
});

// API endpoint: Add a new admin  
app.post("/api/seed/admin", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }
    // Count current admins to determine the sequence number
    const adminCount = await Admin.countDocuments();
    // Format the email as user+admin<number>@domain.com
    const adminEmail = email.replace("@", `+admin${adminCount + 1}@`);
    const newAdmin = await Admin.create({ name, email: adminEmail });
    res.status(201).json({
      success: true,
      message: `Admin ${name} added successfully with email ${adminEmail}`,
      admin: newAdmin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding admin", error: error.message });
  }
});

// API endpoint: Delete an admin
app.delete("/api/seed/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({ success: true, message: `Admin deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting admin", error: error.message });
  }
});

// Start the server on PORT (default 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Goto this link for accessing the Admin Seeder page : http://localhost:${PORT}/admin-seeder`)
});
