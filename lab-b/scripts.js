class Todo {
  constructor() {
    // Завантаження завдань з Local Storage при старті [cite: 42, 78]
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.term = ""; // Фраза для пошуку [cite: 85]
    this.container = document.getElementById('todoContainer');
    this.draw();
  }

  // Метод draw(): очищує контейнер і генерує його на основі масиву [cite: 57]
  draw() {
    this.container.innerHTML = "";
    const filteredTasks = this.getFilteredTasks();

    filteredTasks.forEach((task, index) => {
      const taskEl = document.createElement('div');
      taskEl.className = 'task-item';

      // Підсвічування шуканої фрази [cite: 38, 92]
      let textToShow = task.text;
      if (this.term.length >= 2) {
        const regex = new RegExp(`(${this.term})`, 'gi');
        textToShow = task.text.replace(regex, '<mark>$1</mark>');
      }

      // Форматування дати для відображення
      let dateDisplay = "";
      if (task.deadline) {
        const d = new Date(task.deadline);
        dateDisplay = ` (Termin: ${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`;
      }

      // Клік на позицію активує режим редагування
      taskEl.innerHTML = `
                <div class="task-content" onclick="document.todo.enterEditMode(${index}, this)">
                    <span class="task-text">${textToShow}${dateDisplay}</span>
                </div>
                <button class="delete-btn" onclick="event.stopPropagation(); document.todo.deleteTask(${index})">🗑️</button>
            `;
      this.container.appendChild(taskEl);
    });

    this.save(); // Збереження стану в LocalStorage [cite: 41]
  }

  // Повертає відфільтровані завдання [cite: 86, 87]
  getFilteredTasks() {
    if (this.term.length < 2) return this.tasks;
    return this.tasks.filter(task =>
      task.text.toLowerCase().includes(this.term.toLowerCase())
    );
  }

  // Додавання завдання з валідацією [cite: 35, 60]
  addTask(text, deadline) {
    if (deadline) {
      const selectedDate = new Date(deadline);
      if (selectedDate <= new Date()) {
        alert("Data musi być w przyszłości!");
        return;
      }
    }
    this.tasks.push({ text, deadline });
    this.draw();
  }

  // Видалення завдання [cite: 40, 68]
  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.draw();
  }

  // Вхід у режим редагування (текст + дата) [cite: 39, 74]
  enterEditMode(index, element) {
    const task = this.tasks[index];
    element.onclick = null; // Тимчасово вимикаємо клік

    element.innerHTML = `
            <div class="edit-container" onclick="event.stopPropagation()">
                <input type="text" class="edit-input-text" value="${task.text}">
                <input type="datetime-local" class="edit-input-date" value="${task.deadline || ''}">
                <button onclick="document.todo.saveEdit(${index}, this.parentElement)">OK</button>
            </div>
        `;
    element.querySelector('.edit-input-text').focus();
  }

  // Збереження після редагування
  saveEdit(index, editBox) {
    const newText = editBox.querySelector('.edit-input-text').value;
    const newDate = editBox.querySelector('.edit-input-date').value;

    if (newText.length >= 3 && newText.length <= 255) {
      this.tasks[index].text = newText;
      this.tasks[index].deadline = newDate;
    }
    this.draw();
  }

  // Збереження в LocalStorage через JSON [cite: 79]
  save() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}

// Ініціалізація при завантаженні [cite: 61, 63]
document.addEventListener('DOMContentLoaded', () => {
  document.todo = new Todo(); // Прив'язка до document.todo для тестів у консолі [cite: 61, 62]

  // Форма додавання
  document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('taskInput').value;
    const date = document.getElementById('taskDeadline').value;
    document.todo.addTask(text, date);
    e.target.reset();
  });

  // Пошук
  document.getElementById('searchInput').addEventListener('input', (e) => {
    document.todo.term = e.target.value;
    document.todo.draw();
  });
});
