require('dotenv').config()
const express = require('express')
const cors = require('cors');
const sequelize = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const projectRoutes = require('./routes/projectRoutes')
const bugRoutes = require('./routes/bugRoutes')
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));app.use(express.json())

app.use('/api', authRoutes)
app.use('/api', projectRoutes)
app.use('/api', bugRoutes)

sequelize
  .sync()
  .then(() => console.log('Database synchronized'))
  .catch((err) => console.log('Error synchronizing database:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
