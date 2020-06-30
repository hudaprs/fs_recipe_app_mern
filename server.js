const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');

// Connect to database
connectDB();

app.use(express.json({ extended: false }));

app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));

app.listen(port, () => console.log(`Server started at port ${port}...`));
