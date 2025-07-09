const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Define schema and model
const UserSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    email: String,
    course: String
});

const User = mongoose.model("User", UserSchema);

// Register new user
app.post("/register", async (req, res) => {
    try {
        const { name, age, gender, email, course } = req.body;
        const newUser = new User({ name, age, gender, email, course });
        await newUser.save();
        res.status(201).json({ message: "Registration Successful" });
    } catch (err) {
        res.status(500).json({ error: "Failed to register" });
    }
});

// Get all registrations
app.get("/registrations", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch registrations" });
    }
});
// Get registration by email
app.get("/registrations/email/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: new RegExp(`^${req.params.email}$`, 'i') });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch registration" });
    }
});


// Update a registration
app.put("/registrations/:id", async (req, res) => {
    try {
        const { course } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { course },
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to update registration" });
    }
});

// Delete a registration
app.delete("/registrations/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Registration deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete registration" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
