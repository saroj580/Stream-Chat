import express from 'express';
import dotenv from 'dotenv'

//To run the env file we need to import dotenv package and config it
dotenv.config();
// or simply we can do for dotenv
// import "dotenv/config"; If we do this we don't need to config it mannually

const app = express();
const PORT = process.env.PORT || 5001;

app.get('/api/auth/signup', (req, res) => {
    res.send("Signup page");
})

app.get('/api/auth/login', (req, res) => {
    res.send("Login page");
})

app.get('/api/auth/logout', (req, res) => {
    res.send("Logout page");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
