const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to log request details
app.use((req, res, next) => {
    console.log("Request received:");
    console.log("IP:", req.ip);
    console.log("Headers:", req.headers);
    console.log("User-Agent:", req.get("User-Agent"));
    next();
});

// Serve the image when requested
app.get("/image", (req, res) => {
    res.sendFile(path.join(__dirname, "1x1.png"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
