require("dotenv").config();
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();

const PORT = process.env.PORT || 3000;

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.GMAIL_PASS, // Generate this in Gmail settings
    },
});

// CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(async (req, res, next) => {
    const trackingData = {
        headers: req.headers,
        userAgent: req.get("User-Agent"),
        ip: req.ip,
        timestamp: new Date().toISOString(),
    };

    // Send email
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: "Email Tracking Alert",
        text: JSON.stringify(trackingData, null, 2),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);

    next();
});

// Serve the image when requested
app.get("/image", (req, res) => {
    res.sendFile(path.join(__dirname, "1x1.png"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
