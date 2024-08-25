const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const User = require('./User')
const Project = require('./Project')

const Bug = sequelize.define(
  'Bug',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open', 'in-progress', 'closed'),
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  },
  {
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at', 
    tableName: 'Bugs'
  }
)

Bug.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' })
Bug.belongsTo(Project, { foreignKey: 'project_id', as: 'project' })

module.exports = Bug
