const STORAGE_KEY = "taskManagementTasks";
const CURRENT_SCHEMA_VERSION = 2;


// DEFAULT TASK SCHEMA
function migrateTask(task, index) {
    return {
        id: task.id ?? Date.now() + index,
        title: task.title ?? "Untitled Task",
        priority: task.priority ?? "Medium",
        completed: task.completed ?? false,
        createdAt: task.createdAt ?? new Date().toISOString(),
        updatedAt: task.updatedAt ?? new Date().toISOString()
    };
}


// SCHEMA MIGRATION
function migrateData(data) {

    // OLD SCHEMA: Array of tasks
    if (Array.isArray(data)) {

        const migratedTasks = data.map((task, index) =>
            migrateTask(task, index)
        );

        return {
            version: CURRENT_SCHEMA_VERSION,
            tasks: migratedTasks
        };
    }


    // CURRENT SCHEMA
    if (
        data &&
        typeof data === "object" &&
        Array.isArray(data.tasks)
    ) {

        return {
            version: CURRENT_SCHEMA_VERSION,
            tasks: data.tasks.map((task, index) =>
                migrateTask(task, index)
            )
        };
    }


    // INVALID DATA
    return {
        version: CURRENT_SCHEMA_VERSION,
        tasks: []
    };
}


// SAVE TASKS
export function saveTasks(tasks) {

    try {

        const data = {
            version: CURRENT_SCHEMA_VERSION,
            tasks: tasks.map((task, index) =>
                migrateTask(task, index)
            )
        };

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );

    } catch (error) {

        console.error("Save error:", error);

    }
}


// LOAD TASKS
export function loadTasks() {

    try {

        const savedTasks =
            localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        const data = JSON.parse(savedTasks);

        const migratedData =
            migrateData(data);

        // Save migrated schema
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(migratedData)
        );

        return migratedData.tasks;

    } catch (error) {

        console.error("Load error:", error);

        return [];

    }
}