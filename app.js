import {
    createTask,
    getTasks,
    setTasks,
    updateTask,
    deleteTask,
    toggleTaskStatus
} from "./taskManager.js";

import { renderTasks } from "./ui.js";

import {
    saveHistory,
    undo,
    redo
} from "./history.js";


// ==========================
// GET HTML ELEMENTS
// ==========================

const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");


// ==========================
// URL PARAMETERS
// ==========================

function getURLParameters() {

    const params = new URLSearchParams(window.location.search);

    return {
        search: params.get("search") || "",
        filter: params.get("filter") || "all",
        sort: params.get("sort") || "newest"
    };
}


// ==========================
// UPDATE URL
// ==========================

function updateURL() {

    const params = new URLSearchParams();

    const search = searchInput.value.trim();
    const filter = filterSelect.value;
    const sort = sortSelect.value;

    if (search !== "") {
        params.set("search", search);
    }

    if (filter !== "all") {
        params.set("filter", filter);
    }

    if (sort !== "newest") {
        params.set("sort", sort);
    }

    const newURL =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "");

    window.history.replaceState({}, "", newURL);
}


// ==========================
// FILTER + SEARCH + SORT
// ==========================

function getDisplayedTasks() {

    let tasks = [...getTasks()];

    const search = searchInput.value
        .trim()
        .toLowerCase();

    const filter = filterSelect.value;
    const sort = sortSelect.value;


    // SEARCH
    if (search !== "") {

        tasks = tasks.filter(task =>
            task.title.toLowerCase().includes(search)
        );
    }


    // FILTER
    if (filter === "pending") {

        tasks = tasks.filter(task =>
            !task.completed
        );

    } else if (filter === "completed") {

        tasks = tasks.filter(task =>
            task.completed
        );
    }


    // SORT
    if (sort === "newest") {

        tasks.sort((a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

    } else if (sort === "oldest") {

        tasks.sort((a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );

    } else if (sort === "priority") {

        const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3
        };

        tasks.sort((a, b) =>
            priorityOrder[a.priority] -
            priorityOrder[b.priority]
        );

    } else if (sort === "alphabetical") {

        tasks.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }


    return tasks;
}


// ==========================
// RENDER TASKS
// ==========================

function refreshTasks() {

    renderTasks(getDisplayedTasks());
}


// ==========================
// LOAD URL SETTINGS
// ==========================

const urlSettings = getURLParameters();

searchInput.value = urlSettings.search;
filterSelect.value = urlSettings.filter;
sortSelect.value = urlSettings.sort;


// Show tasks when page opens
refreshTasks();


// ==========================
// ADD TASK
// ==========================

addTaskBtn.addEventListener("click", function () {

    const title = taskInput.value.trim();
    const selectedPriority = priority.value;

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    saveHistory(getTasks());

    createTask(
        title,
        selectedPriority
    );

    refreshTasks();

    taskInput.value = "";
});


// ==========================
// EDIT / DELETE / COMPLETE
// ==========================

taskList.addEventListener("click", function (event) {

    const id = Number(
        event.target.dataset.id
    );


    // EDIT
    if (
        event.target.classList.contains(
            "edit-btn"
        )
    ) {

        const task = getTasks().find(
            task => task.id === id
        );

        if (!task) {
            return;
        }

        const newTitle = prompt(
            "Edit task:",
            task.title
        );

        if (
            newTitle !== null &&
            newTitle.trim() !== ""
        ) {

            saveHistory(getTasks());

            updateTask(id, {
                title: newTitle.trim()
            });

            refreshTasks();
        }
    }


    // DELETE
    if (
        event.target.classList.contains(
            "delete-btn"
        )
    ) {

        const confirmDelete = confirm(
            "Are you sure you want to delete this task?"
        );

        if (confirmDelete) {

            saveHistory(getTasks());

            deleteTask(id);

            refreshTasks();
        }
    }


    // COMPLETE
    if (
        event.target.classList.contains(
            "complete-btn"
        )
    ) {

        saveHistory(getTasks());

        toggleTaskStatus(id);

        refreshTasks();
    }

});


// ==========================
// SEARCH
// ==========================

searchInput.addEventListener(
    "input",
    function () {

        updateURL();

        refreshTasks();
    }
);


// ==========================
// FILTER
// ==========================

filterSelect.addEventListener(
    "change",
    function () {

        updateURL();

        refreshTasks();
    }
);


// ==========================
// SORT
// ==========================

sortSelect.addEventListener(
    "change",
    function () {

        updateURL();

        refreshTasks();
    }
);


// ==========================
// UNDO
// ==========================

undoBtn.addEventListener(
    "click",
    function () {

        const previousTasks =
            undo(getTasks());

        if (previousTasks === null) {

            alert("Nothing to undo!");

            return;
        }

        setTasks(previousTasks);

        refreshTasks();
    }
);


// ==========================
// REDO
// ==========================

redoBtn.addEventListener(
    "click",
    function () {

        const nextTasks =
            redo(getTasks());

        if (nextTasks === null) {

            alert("Nothing to redo!");

            return;
        }

        setTasks(nextTasks);

        refreshTasks();
    }
);
// ==========================
// KEYBOARD SHORTCUTS
// ==========================

document.addEventListener("keydown", function (event) {

    // Ctrl + Enter → Add Task
    if (event.ctrlKey && event.key === "Enter") {

        event.preventDefault();

        addTaskBtn.click();
    }


    // Ctrl + Z → Undo
    if (event.ctrlKey && event.key.toLowerCase() === "z") {

        event.preventDefault();

        document.getElementById("undoBtn").click();
    }


    // Ctrl + Y → Redo
    if (event.ctrlKey && event.key.toLowerCase() === "y") {

        event.preventDefault();

        document.getElementById("redoBtn").click();
    }

});