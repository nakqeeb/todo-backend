const express = require('express');
const mongoose = require('mongoose');
require("dotenv/config");

const app = express();

const userRoutes = require('./routes/user');
const todoRoutes = require('./routes/todo');

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/users', userRoutes);
app.use('/todo', todoRoutes);

mongoose.connect('mongodb+srv://nakqeeb:' + process.env.MONGO_ATLAS_PW + '@cluster0.rbc72.mongodb.net/todo-app').then(() => {
    console.log('Connected to database');
    const PORT = process.env.PORT || 3000;
    //Server
    app.listen(PORT, () => { 
        console.log('server is running http://localhost:3000');
    });
}).catch((err) => {
    console.log(err);
});