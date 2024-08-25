const Bug = require('../models/Bug')
const User = require('../models/User')
const Project = require('../models/Project')
const moment = require('moment')

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' })
}

exports.createBug = async (req, res) => {
  try {
    const { title, description, status, severity, assigned_to, project_id } = req.body
    const bug = await Bug.create({
      title,
      description,
      status,
      severity,
      assigned_to,
      project_id
    })

    bug.dataValues.created_at = moment(bug.dataValues.created_at).format('DD-MM-YYYY HH:mm:ss')
    bug.dataValues.updated_at = moment(bug.dataValues.updated_at).format('DD-MM-YYYY HH:mm:ss')

    res.status(201).json({ message: 'Bug created successfully', bug })
  } catch (error) {
    res.status(500).json({ message: 'Error creating bug', error })
  }
}

exports.getAllBugs = async (req, res) => {
  try {
    const bugs = await Bug.findAll({
      order: [['created_at', 'DESC']]
    })

    const formattedBugs = bugs.map((bug) => {
      return {
        ...bug.dataValues,
        created_at: moment(bug.dataValues.created_at).format('DD-MM-YYYY HH:mm:ss'),
        updated_at: moment(bug.dataValues.updated_at).format('DD-MM-YYYY HH:mm:ss')
      }
    })

    res.status(200).json({ bugs: formattedBugs })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching bugs', error })
  }
}

exports.getBugById = async (req, res) => {
  try {
    const { id } = req.params
    const bug = await Bug.findByPk(id, { include: [User, Project] })

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' })
    }

    bug.dataValues.created_at = moment(bug.dataValues.created_at).format('DD-MM-YYYY HH:mm:ss')
    bug.dataValues.updated_at = moment(bug.dataValues.updated_at).format('DD-MM-YYYY HH:mm:ss')

    res.status(200).json({ bug })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bug', error })
  }
}

exports.updateBug = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, severity, assigned_to } = req.body

    const bug = await Bug.findByPk(id)

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' })
    }

    bug.title = title
    bug.description = description
    bug.status = status
    bug.severity = severity
    bug.assigned_to = assigned_to

    await bug.save()

    bug.dataValues.created_at = moment(bug.dataValues.created_at).format('DD-MM-YYYY HH:mm:ss')
    bug.dataValues.updated_at = moment(bug.dataValues.updated_at).format('DD-MM-YYYY HH:mm:ss')

    res.status(200).json({ message: 'Bug updated successfully', bug })
  } catch (error) {
    res.status(500).json({ message: 'Error updating bug', error })
  }
}

exports.deleteBug = [
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params
      const bug = await Bug.findByPk(id)

      if (!bug) {
        return res.status(404).json({ message: 'Bug not found' })
      }

      await bug.destroy()
      res.status(200).json({ message: 'Bug deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Error deleting bug', error })
    }
  }
]
