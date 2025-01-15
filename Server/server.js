const express = require("express");
require("dotenv").config();
const app = express();
const connect = require('./config/db');

const PORT = process.env.PORT || 3000;

connect();

app.listen(PORT,()=>{
    console.log(`server is running on port: ${PORT}`);
})