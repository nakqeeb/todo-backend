const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        todoItem: {
            type: String,
        },
        status: {
            type: String,
            enum: ['Pending', 'InProgress', 'Completed'],
            default: 'Pending',
        },
    }
);

module.exports = mongoose.model('Todo', userSchema);