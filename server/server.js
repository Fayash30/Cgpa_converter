const express = require("express");
const app = express();
require('dotenv').config();

const URL = process.env.APPLICATION_URL;
const cors = require('cors');

const corsOptions = {
    origin: URL,
    methods:'GET,PUT,POST,DELETE,PATCH,HEAD'
}

app.use(cors(corsOptions));

app.use(express.json());

const DBConnect = require("./Database/Connection.js");

DBConnect();

const UserRoutes = require("./Routes/UserRoutes.js");
const CgpaRoutes = require("./Routes/CgpaRoutes.js");

app.use('/cgpa/', CgpaRoutes);
app.use('/auth/' ,  UserRoutes);

app.listen(5000, ()=>{
    console.log(`Server is Running on 5000...`);
})