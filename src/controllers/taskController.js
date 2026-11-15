
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const mongoose = require('mongoose');

//Nconvertiw el special characters mt3 regex lel escaped characters (ex: . twali /.) bech ta3ti el user ely 7ab 3Lih fil request bdhabet
const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const createTask = async (req, res) => {
    try {
        const { title, description, status, deadline, project } = req.body;

        const existingProject = await Project.findById(project);

        if (!existingProject) {
            return res.status(404).json({
                message: 'Project not found.'
            });
        }

        if (
            req.user.role !== 'manager' &&
            existingProject.owner.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: 'You can only create tasks in your own projects.'
            });
        }

        const task = await Task.create({
            title,
            description,
            status,
            deadline,
            project
        });

        res.status(201).json({
            message: 'Task created successfully.',
            task
        });

    } catch (error) {
        res.status(500).json({
            message: 'Task creation failed.',
            error: error.message
        });
    }
};

const getTasks = async (req, res) => {
    try {
        const {
            search,
            status,
            project,
            assignedTo,
            deadlineFrom,
            deadlineTo,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        const allowedStatuses = ['todo', 'doing', 'done'];
        const allowedSortFields = ['title', 'status', 'deadline', 'createdAt'];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid task status.'
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

        if (project && !mongoose.isValidObjectId(project)) {
            return res.status(400).json({
                message: 'Invalid project ID.'
            });
        }

        if (assignedTo && !mongoose.isValidObjectId(assignedTo)) {
            return res.status(400).json({
                message: 'Invalid user ID.'
            });
        }

        const filters = [];

        if (req.user.role === 'manager') {
            filters.push({});
        } else {
            //Nselectiow el projects ely teb3In el user li b3th request o nkhdo ken el IDs (mezel array mt3 objects)
            const userProjects = await Project.find({
                owner: req.user.id
            }).select('_id');

            //Nextractiw el IDs mel array mt3 el objects hdheka fi array jdid
            const projectIds = userProjects.map(project => project._id);

            //Nlawjo 3l tasks ely el project IDs mt3hom mawjdoin fil array mt3 el IDs mt3 el projects li teb3in el user li b3atht el request
            filters.push({
                project: { $in: projectIds }
            });
        }

        if (project) {
            filters.push({ project });
        }

        if (status) {
            filters.push({ status });
        }

        if (assignedTo) {
            filters.push({ assignedTo });
        }

        if (search) {
            const searchRegex = new RegExp(escapeRegex(search), 'i');

            filters.push({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex }
                ]
            });
        }

        if (deadlineFrom || deadlineTo) {
            const deadlineFilter = {};

            if (deadlineFrom) {
                const fromDate = new Date(deadlineFrom);

                if (Number.isNaN(fromDate.getTime())) {
                    return res.status(400).json({
                        message: 'Invalid start deadline date.'
                    });
                }

                deadlineFilter.$gte = fromDate;
            }

            if (deadlineTo) {
                const toDate = new Date(deadlineTo);

                if (Number.isNaN(toDate.getTime())) {
                    return res.status(400).json({
                        message: 'Invalid end deadline date.'
                    });
                }

                deadlineFilter.$lte = toDate;
            }

            if (
                deadlineFrom &&
                deadlineTo &&
                new Date(deadlineFrom) > new Date(deadlineTo)
            ) {
                return res.status(400).json({
                    message: 'Start deadline cannot be after end deadline.'
                });
            }

            filters.push({ deadline: deadlineFilter });
        }

        const sortOptions = {
            [sortBy]: order === 'asc' ? 1 : -1
        };

        const tasks = await Task.find({
            $and: filters
        }).sort(sortOptions);

        res.status(200).json({
            tasks
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve tasks.',
            error: error.message
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description, status, deadline } = req.body;

        //Nest3Mlo populate bech nreturniew el object keml mt3 el project moch just el ID
        const task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            return res.status(404).json({
                message: 'Task not found.'
            });
        }

        if (
            req.user.role !== 'manager' &&
            task.project.owner.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: 'You can only update tasks in your own projects.'
            });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (deadline !== undefined) task.deadline = deadline;

        await task.save();

        res.status(200).json({
            message: 'Task updated successfully.',
            task
        });

    } catch (error) {
        res.status(500).json({
            message: 'Task update failed.',
            error: error.message
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        //Nest3Mlo populate bech nreturniew el object keml mt3 el project moch just el ID
        const task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            return res.status(404).json({
                message: 'Task not found.'
            });
        }

        if (
            req.user.role !== 'manager' &&
            task.project.owner.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: 'You can only delete tasks in your own projects.'
            });
        }

        await task.deleteOne();

        res.status(200).json({
            message: 'Task deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Task deletion failed.',
            error: error.message
        });
    }
};

const assignTask = async (req, res) => {
    try {
        const { assignedTo } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        const user = await User.findById(assignedTo);

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        task.assignedTo = user._id;

        await task.save();

        res.status(200).json({
            message: 'Task assigned successfully',
            task
        });

    } catch (error) {
        res.status(500).json({
            message: 'Task assignment failed',
            error: error.message
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    assignTask
};
