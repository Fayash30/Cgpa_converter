const express = require("express");
const app = express();
require('dotenv').config();

const port = process.env.PORT;
const cors = require('cors');
app.use(cors());

app.use(express.json());

const DBConnect = require("./Database/Connection.js");

DBConnect();

const UserRoutes = require("./Routes/UserRoutes.js");
const CgpaRoutes = require("./Routes/CgpaRoutes.js");

app.use('/cgpa/', CgpaRoutes);
app.use('/auth/' ,  UserRoutes);

app.listen(port, ()=>{
    console.log(`Server is Running on ${port}...`);
})