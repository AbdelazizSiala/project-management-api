const Project = require('../models/Project');

//Nconvertiw el special characters mt3 regex lel escaped characters (ex: . twali /.) bech ta3ti el user ely 7ab 3Lih fil request bdhabet
const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const createProject = async (req, res, next) => {
    try {
        const { nom, description, status } = req.body;

        const project = await Project.create({
            nom,
            description,
            status,
            owner: req.user.id
        });

        res.status(201).json({
            message: 'Project created successfully.',
            project
        });

    } catch (error) {
        next(error);
    }
};

const getProjects = async (req, res, next) => {
    try {
        const {
            search,
            status,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        const allowedStatuses = ['in progress', 'completed', 'paused'];
        const allowedSortFields = ['nom', 'status', 'createdAt'];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid project status.'
            });
        }

        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({
                message: 'Invalid sort field.'
            });
        }

        if (!['asc', 'desc'].includes(order)) {
            return res.status(400).json({
                message: 'Invalid sort order.'
            });
        }

        const filters = [];

        // El managers ynjmo ychof el projects el kol, ama el users ynjmo just ychofo el projects mt3hom
        if (req.user.role !== 'manager') {
            filters.push({ owner: req.user.id });
        }

        if (status) {
            filters.push({ status });
        }

        if (search) {
            const searchRegex = new RegExp(escapeRegex(search), 'i');

            filters.push({
                $or: [
                    { nom: searchRegex },
                    { description: searchRegex }
                ]
            });
        }

        const sortOptions = {
            [sortBy]: order === 'asc' ? 1 : -1
        };

        const projectQuery = filters.length > 0 ? { $and: filters } : {};

        const projects = await Project.find(projectQuery).sort(sortOptions);

        res.status(200).json({
            projects
        });

    } catch (error) {
        next(error);
    }
};

const updateProject = async (req, res, next) => {
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
        next(error);
    }
};

const deleteProject = async (req, res, next) => {
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
        next(error);
    }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };