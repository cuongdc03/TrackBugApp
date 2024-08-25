const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email was existed' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({ name, email, password: hashedPassword, role })

    res.status(201).json({ message: 'Register successfully', user })
  } catch (error) {
    res.status(500).json({ message: 'Error', error })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Login invalid' })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.status(200).json({ message: 'Login successfully', token })
  } catch (error) {
    res.status(500).json({ message: 'Error', error })
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    })

    if (!user) {
      return res.status(404).json({ message: 'There is no User ' })
    }

    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: 'Fail to fetch user data', error })
  }
}
