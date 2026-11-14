const Project = require('../models/Project');

const createProject = async (req, res) => {
    try {
        const { nom, description } = req.body;

        const project = await Project.create({
            nom,
            description,
            owner: req.user.id
        });

        res.status(201).json({
            message: 'Project created successfully.',
            project
        });

    } catch (error) {
        res.status(500).json({
            message: 'Project creation failed.',
            error: error.message
        });
    }
};

const getProjects = async (req, res) => {
    try {
        let projects;

        // El managers ynjmo ychof el projects el kol, ama el users ynjmo just ychofo el projects mt3hom
        if (req.user.role === 'manager') {
            projects = await Project.find();
        } else {
            projects = await Project.find({ owner: req.user.id });
        }

        res.status(200).json({
            projects
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve projects.',
            error: error.message
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const { nom, description, status } = req.body;

        //Nlawjo 3L projet li 7chtna bih bel ID mt3o wel ID mt3 el user, bech mynjmsh user ybadel projet mt3 user ekher
        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user.id
            },
            {
                nom,
                description,
                status
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!project) {
            return res.status(404).json({
                message: 'Project not found.'
            });
        }

        res.status(200).json({
            message: 'Project updated successfully.',
            project
        });

    } catch (error) {
        res.status(500).json({
            message: 'Project update failed.',
            error: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        //Nthbto ely el projet teba3 el user li b3th request 9bal manfskhoh
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!project) {
            return res.status(404).json({
                message: 'Project not found.'
            });
        }

        res.status(200).json({
            message: 'Project deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Project deletion failed.',
            error: error.message
        });
    }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };