
const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');


dotenv.config();


const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 

app.use(session({
  secret: process.env.SESSION_SECRET || 'Group_Project_44', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));


app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});


const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
