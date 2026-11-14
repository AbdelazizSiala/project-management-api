
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

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
        let tasks;

        if (req.user.role === 'manager') {
            tasks = await Task.find();
        } else {
            //Nselectiow el projects ely teb3In el user li b3th request o nkhdo ken el IDs (mezel array mt3 objects)
            const userProjects = await Project.find({
                owner: req.user.id
            }).select('_id');

            //Nextractiw el IDs mel array mt3 el objects hdheka fi array jdid
            const projectIds = userProjects.map(project => project._id);

            //Nlawjo 3l tasks ely el project IDs mt3hom mawjdoin fil array mt3 el IDs mt3 el projects li teb3in el user li b3atht el request
            tasks = await Task.find({
                project: { $in: projectIds }
            });
        }

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
