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

app.use((req, res, next) => {
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
        text: `Info ${JSON.stringify(trackingData, null, 2)} \n More info: \n ${JSON.stringify(req, null, 2)}`,
    };

    transporter.sendMail(mailOptions);

    next();
});

// Serve the image when requested
app.get("/image", (req, res) => {
    res.sendFile(path.join(__dirname, "1x1.png"));
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
