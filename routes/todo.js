const express = require('express');
const router = express.Router();

const Todo = require('../models/todo');
const isAuth = require('../middleware/is-auth');

const statusEnum = {
    pending: 'Pending',
    inProgress: 'InProgress',
    completed: 'Completed'
};

// create todo
router.post('/', isAuth, async (req, res, next) => {
    const status = req.body.status;
    try {
        const todo = new Todo({
            userId: req.userId,
            todoItem: req.body.todoItem,
            status: status,
        });
        const addedTodo = await todo.save();
        if (!addedTodo) {
            const error = new Error("Could not add the todo item.");
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json({
            todo: addedTodo,
            success: true
        });
    } catch (err) {
        if (status !== statusEnum) {
            return res.status(401).json({
                message: "Status must be Pending, InProgress or Completed.",
                success: false
            });
        }
        if (!err.statusCode) {
            return res.status(401).json({
                message: "Unauthorized access.",
                success: false
            });
        }
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }
});


// fetch todo items
router.get('/', isAuth, async (req, res, next) => {
    try {
        const todoItems = await Todo.find({ userId: req.userId });
        if (!todoItems) {
            const error = new Error("Could not fetch the todo items.");
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json({
            todoItems: todoItems,
            success: true
        });
    } catch (err) {
        if (!err.statusCode) {
            return res.status(401).json({
                message: "Unauthorized access.",
                success: false
            });
        }
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }
});


// fetch single item by id
router.get('/:todoId', isAuth, async (req, res, next) => {
    const todoId = req.params.todoId;
    try {
        const todoItem = await Todo.findOne({ _id: todoId, userId: req.userId });
        if (!todoItem) {
            const error = new Error("Could not fetch the todo item.");
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json({
            todoItem: todoItem,
            success: true
        });
    } catch (err) {
        if (!err.statusCode) {
            return res.status(401).json({
                message: "Unauthorized access.",
                success: false
            });
        }
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }
});


// update todo item by id
router.put('/:todoId', isAuth, async (req, res, next) => {
    const todoId = req.params.todoId;
    const status = req.body.status;
    try {
        const fetchedTodo = Todo.findById(todoId);
        if (!fetchedTodo) {
            const error = new Error('Todo item is not found');
            error.statusCode = 404;
            throw error;
        }
        const result = await Todo.updateOne({ _id: todoId, userId: req.userId },
            {
                todoItem: req.body.todoItem,
                status: status,
            });
        if (result.matchedCount > 0) {
            return res.status(200).json({ message: 'Todo item updated successfully.', success: true });
        } else {
            const error = new Error('You are unauthorized to update this item.');
            error.statusCode = 500;
            throw error;
        }
    } catch (err) {
        if (status !== statusEnum) {
            return res.status(401).json({
                message: 'Status must be Pending, InProgress or Completed.',
                success: false
            });
        }
        if (!err.statusCode) {
            return res.status(401).json({
                message: 'Unauthorized access.',
                success: false
            });
        }
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }
});


// delete todo item by id
router.delete('/:todoId', isAuth, async (req, res, next) => {
    const todoId = req.params.todoId;
    try {
        const fetchedTodo = await Todo.findById(todoId);
        if (!fetchedTodo) {
            const error = new Error('Todo item is not found');
            error.statusCode = 404;
            throw error;
        }
        const result = await Todo.deleteOne({ _id: todoId, userId: req.userId });
        if (result.deletedCount > 0) {
            return res.status(200).json({ message: 'Deletion successful!', success: true });
        } else {
            const error = new Error('You are unauthorized to delete this item.');
            error.statusCode = 404;
            throw error;
        }
    } catch (err) {
        if (!err.statusCode) {
            return res.status(401).json({
                message: "Unauthorized access.",
                success: false
            });
        }
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }
});


module.exports = router;