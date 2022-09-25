import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import beeRoutes from "./routes/beeRoutes";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/beehive", beeRoutes);

const mongooseUri = "mongodb+srv://admin:admin@cluster0.yogv9.mongodb.net/bee_friends?retryWrites=true&w=majority";

mongoose.connect(mongooseUri);

mongoose.connection.on("connected", () => {
    console.log("Successfully connected to MongoDB!");
});

mongoose.connection.on("error", err => {
    throw new Error("Error connecting to MongoDB! " + err);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => console.log(`Express is listening at http://localhost:${port}`));
