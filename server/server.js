const express = require("express");
const app = express();
require('dotenv').config();

const cors = require('cors');

// Define CORS options
const corsOptions = {
    origin: 'https://gpa-converter-client.vercel.app',
    methods: 'GET,PUT,POST,DELETE,PATCH,HEAD',
    credentials: true, 
    optionsSuccessStatus: 200 
};

// Use CORS for all routes
app.use(cors(corsOptions));

// Handle preflight requests globally (OPTIONS)
app.options('*', cors(corsOptions));

// JSON parsing middleware
app.use(express.json());

// Connect to the database
const DBConnect = require("./Database/Connection.js");
DBConnect();

// Define routes
const UserRoutes = require("./Routes/UserRoutes.js");
const CgpaRoutes = require("./Routes/CgpaRoutes.js");

app.use('/cgpa/', CgpaRoutes);
app.use('/auth/', UserRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
