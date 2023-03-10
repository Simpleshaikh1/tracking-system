const Projects = require("../models/Project.model");

// Create a new project.
const createProject = async (req, res) => {
  try {
    const { projectTitle, projectLink, projectDescription } = req.body;
    const userId = req.user;

    if (!projectTitle || !projectLink || !projectDescription) {
      return res.status(400).json({
        msg: "Missing required fields",
      });
    }

    const project = await Projects.create({
      projectTitle,
      projectLink,
      projectDescription,
      userId,
    });

    res.status(201).json({
      msg: "Created",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
};

// Get all projects for the authenticated user.
const getAllProjects = async (req, res) => {
  try {
    const userId = req.user;
    const projects = await Projects.find({ userId });

    res.status(200).json({
      msg: "Successfull",
      data: projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
};

// Update an existing project.
const updateProject = async (req, res) => {
  try {
    const { projectTitle, projectLink, projectDescription } = req.body;

    if (!projectTitle && !projectLink && !projectDescription) {
      return res.status(400).json({
        msg: "Missing required fields",
      });
    }

    const project = await Projects.findByIdAndUpdate(
      req.params.id,
      {
        projectTitle,
        projectLink,
        projectDescription,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        msg: "Project not found",
      });
    }

    res.status(200).json({
      msg: "Project updated",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
};

// Delete a project.
const deleteProject = async (req, res) => {
  try {
    await Projects.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });
    res.status(200).json({
      msg: "Project deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
};
