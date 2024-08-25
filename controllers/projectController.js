const moment = require('moment');
const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = await Project.create({ name, description });

        project.dataValues.createdAt = moment(project.createdAt).format('DD-MM-YYYY HH:mm:ss');

        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            attributes: ['id', 'name', 'description']
        });

        const formattedProjects = projects.map(project => {
            project.dataValues.createdAt = moment(project.createdAt).format('DD-MM-YYYY HH:mm:ss');
            return project;
        });

        res.status(200).json({ projects: formattedProjects });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByPk(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.dataValues.createdAt = moment(project.createdAt).format('DD-MM-YYYY HH:mm:ss');

        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const project = await Project.findByPk(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.name = name;
        project.description = description;
        await project.save();

        project.dataValues.createdAt = moment(project.createdAt).format('DD-MM-YYYY HH:mm:ss');

        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByPk(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await project.destroy();
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error });
    }
};
