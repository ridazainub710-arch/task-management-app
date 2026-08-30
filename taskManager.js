import { saveTasks, loadTasks } from "./storage.js";

let tasks = loadTasks();


// CREATE TASK
export function createTask(title, priority) {

    const task = {
        id: Date.now(),
        title: title,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);

    saveTasks(tasks);

    return task;
}


// READ TASKS
export function getTasks() {
    return tasks;
}


// REPLACE ALL TASKS
export function setTasks(newTasks) {

    tasks = JSON.parse(JSON.stringify(newTasks));

    saveTasks(tasks);

    return tasks;
}


// UPDATE TASK
export function updateTask(id, updatedData) {

    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, ...updatedData }
            : task
    );

    saveTasks(tasks);

    return tasks;
}


// DELETE TASK
export function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks(tasks);

    return tasks;
}


// COMPLETE / PENDING TASK
export function toggleTaskStatus(id) {

    tasks = tasks.map(task =>
        task.id === id
            ? {
                ...task,
                completed: !task.completed
            }
            : task
    );

    saveTasks(tasks);

    return tasks;
}