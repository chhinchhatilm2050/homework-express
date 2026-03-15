const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tasks = [
    {
        id: 1,
        title: 'Learn Express.js',
        description: 'Complete Express tutorial and build an API',
        completed: false,
        priority: 'high',
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: 'Practice REST APIs',
        description: 'Build multiple API endpoints',
        completed: true,
        priority: 'medium',
        createdAt: new Date().toISOString()
    }
];

let nextId = tasks.length + 1;

function validateTask(task) {
    const { title, description, priority } = task;

    if (!title || !description) {
        return { valid: false, message: 'Title and description are required' };
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
        return { valid: false, message: 'Priority must be low, medium, or high' };
    }

    return { valid: true };
}

app.get('/api/tasks', (req, res) => {
    res.json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});


app.get('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({
            success: false,
            error: `Task with ID ${taskId} not found`
        });
    }

    res.json({
        success: true,
        data: task
    });
});

app.post('/api/tasks',(req, res) => {
    const { title, description, priority = 'medium'} = req.body;
    const validation = validateTask(req.body);
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            error: validation.message
        })
    };
    const newTask = {
        id: nextId++,
        title, description,
        completed: false,
        priority,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: newTask
    });
});

app.patch('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    if(!task) {
        return res.status(400).json({
            success: false,
            error: 'Task not found'
        });
    };
    task.completed = !task.completed;
    res.json({
        success: true,
        message: `Task marked as ${task.completed ? 'completed' : 'pending'}`,
        data: task
    });
} )
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            error: `Task with ID ${taskId} not found`
        });
    }

    const validation = validateTask(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            error: validation.message
        });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...req.body,
        id: taskId
    };

    res.json({
        success: true,
        message: 'Task updated successfully',
        data: tasks[taskIndex]
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            error: `Task with ID ${taskId} not found`
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.json({
        success: true,
        message: 'Task deleted successfully',
        data: deletedTask
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});