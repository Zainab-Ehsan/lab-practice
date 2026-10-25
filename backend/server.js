
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const mongoUrl = process.env.MONGO_URL;
const dbName = "studentdb";

let students;

async function startServer() {
  const client = new MongoClient(mongoUrl);

  await client.connect();

  const db = client.db(dbName);
  students = db.collection("students");

  console.log("Connected to MongoDB");

  app.get("/api/health", (req, res) => {
    res.json({ status: "Backend is running" });
  });

  app.get("/api/students", async (req, res) => {
    const data = await students.find().toArray();
    res.json(data);
  });

  app.post("/api/students", async (req, res) => {
    const { name, course } = req.body;

    if (!name || !course) {
      return res.status(400).json({
        message: "Name and course are required"
      });
    }

    const result = await students.insertOne({
      name,
      course
    });

    res.status(201).json({
      message: "Student added successfully",
      id: result.insertedId
    });
  });

  app.listen(3000, "0.0.0.0", () => {
    console.log("Backend running on port 3000");
  });
}

startServer().catch((error) => {
  console.error("Backend failed:", error);
  process.exit(1);
});
