let undoStack = [];
let redoStack = [];

export function saveHistory(tasks) {
    undoStack.push(JSON.parse(JSON.stringify(tasks)));

    if (undoStack.length > 20) {
        undoStack.shift();
    }

    redoStack = [];
}

export function undo(currentTasks) {
    if (undoStack.length === 0) {
        return currentTasks;
    }

    redoStack.push(JSON.parse(JSON.stringify(currentTasks)));

    return undoStack.pop();
}

export function redo(currentTasks) {
    if (redoStack.length === 0) {
        return currentTasks;
    }

    undoStack.push(JSON.parse(JSON.stringify(currentTasks)));

    return redoStack.pop();
}