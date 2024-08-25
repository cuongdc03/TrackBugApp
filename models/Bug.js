const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Project = require('./Project');

const Bug = sequelize.define('Bug', {
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
}, {
    timestamps: true, // Ensure timestamps are enabled
    createdAt: 'created_at', // Use 'created_at' column for createdAt
    updatedAt: 'updated_at', // Use 'updated_at' column for updatedAt
    tableName: 'Bugs'
});

Bug.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });
Bug.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

module.exports = Bug;
