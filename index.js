require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

sequelize.sync()
    .then(() => console.log('Database synchronized'))
    .catch(err => console.log('Error synchronizing database:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
