const moment = require('moment')
const Project = require('../models/Project')
const Bug = require('../models/Bug')
const User = require('../models/User')

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body
    const project = await Project.create({ name, description })

    project.dataValues.createdAt = moment(project.createdAt).format('DD-MM-YYYY HH:mm:ss')

    res.status(201).json({ message: 'Project created successfully', project })
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error })
  }
}

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      attributes: ['id', 'name', 'description']
    })

    const formattedProjects = projects.map((project) => {
      project.dataValues.createdAt = moment(project.createdAt).format('DD-MM-YYYY HH:mm:ss')
      return project
    })

    res.status(200).json({ projects: formattedProjects })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error })
  }
}

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch all bugs for the given project id and include the associated project and user
    const bugs = await Bug.findAll({
      where: { project_id: id },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'description'] // Select only the required project attributes
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'name'] // Select only the required user attributes
        }
      ]
    });

    if (bugs.length === 0) {
      return res.status(404).json({ message: 'No bugs found for this project' });
    }

    // Extract the project information from the first bug
    const project = bugs[0].project;
    project.dataValues.created_at = moment(project.created_at).format('DD-MM-YYYY HH:mm:ss');

    // Extract bugs and format their created_at field
    const formattedBugs = bugs.map(bug => {
      bug.dataValues.created_at = moment(bug.created_at).format('DD-MM-YYYY HH:mm:ss');
      return bug;
    });

    // Attach the formatted bugs to the project
    project.bugs = formattedBugs;

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
};

exports.getBugsByProjectId = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch all bugs for the given project id and include the associated user (assignee)
    const bugs = await Bug.findAll({
      where: { project_id: id },
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'name'] // Select only the required user attributes
        }
      ]
    });

    if (bugs.length === 0) {
      return res.status(404).json({ message: 'No bugs found for this project' });
    }

    // Format the created_at field for each bug
    const formattedBugs = bugs.map(bug => {
      bug.dataValues.created_at = moment(bug.created_at).format('DD-MM-YYYY HH:mm:ss');
      return bug;
    });

    res.status(200).json({ bugs: formattedBugs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bugs', error });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    const project = await Project.findByPk(id)

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    project.name = name
    project.description = description
    await project.save()

    project.dataValues.createdAt = moment(project.createdAt).format('DD-MM-YYYY HH:mm:ss')

    res.status(200).json({ message: 'Project updated successfully', project })
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error })
  }
}

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findByPk(id)

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    await project.destroy()
    res.status(200).json({ message: 'Project deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error })
  }
}
