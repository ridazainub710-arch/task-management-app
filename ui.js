export function renderTasks(tasks, searchText = "") {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const taskDiv = document.createElement("div");

        taskDiv.classList.add("task-item");

        if (task.completed) {
            taskDiv.classList.add("completed");
        }

        // Highlight searched text
        let taskTitle = task.title;

        if (searchText !== "") {

            const regex = new RegExp(`(${searchText})`, "gi");

            taskTitle = task.title.replace(
                regex,
                '<span class="highlight">$1</span>'
            );
        }

        taskDiv.innerHTML = `
            <div class="task-info">
                <strong>${taskTitle}</strong>

                <span class="task-priority">
                    Priority: ${task.priority}
                </span>
            </div>

            <div class="task-actions">
                <button class="complete-btn" data-id="${task.id}">
                    Complete
                </button>

                <button class="edit-btn" data-id="${task.id}">
                    Edit
                </button>

                <button class="delete-btn" data-id="${task.id}">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(taskDiv);
    });
}