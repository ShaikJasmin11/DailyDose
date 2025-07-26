document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', dateOptions);

  const tabs = document.querySelectorAll('.tab, .mobile-tab');
  const views = document.querySelectorAll('main > section');

  const switchTab = (tabName) => {
    views.forEach(view => view.classList.add('hidden'));
    const target = document.getElementById(`${tabName}-view`);
    target.classList.remove('hidden');
    target.classList.add('fade-in');

    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Shortcuts
  ['view-all-habits', 'view-mood-history', 'view-all-tasks'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => switchTab(el.dataset.target));
  });

  // Redundant visibility ensures
  document.getElementById("view-all-habits").addEventListener("click", () => {
    document.getElementById("habits-view").classList.remove("hidden");
  });

  document.getElementById("view-mood-history").addEventListener("click", () => {
    document.getElementById("mood-view").classList.remove("hidden");
  });

  document.getElementById("view-all-tasks").addEventListener("click", () => {
    document.getElementById("tasks-view").classList.remove("hidden");
  });

  // Habit tracker
  document.addEventListener("click", (e) => {
    // Habit Check toggle
    if (e.target.classList.contains("habit-check")) {
      const check = e.target;
      check.classList.toggle("checked");
      check.classList.add("check-animation");
      setTimeout(() => check.classList.remove("check-animation"), 500);
      check.closest(".habit-item")?.classList.toggle("completed");
    }

    // Delete habit row
    const deleteBtn = e.target.closest(".delete-habit-btn");
    if (deleteBtn) {
      const row = deleteBtn.closest("tr");
      if (row) row.remove();
    }
  });

  // Mood emoji
  const moodEmojis = document.querySelectorAll('.mood-emoji');
  moodEmojis.forEach(emoji => emoji.addEventListener('click', () => {
    moodEmojis.forEach(e => e.classList.remove('selected'));
    emoji.classList.add('selected', 'bounce');
    setTimeout(() => emoji.classList.remove('bounce'), 500);

    const moodText = emoji.dataset.mood;
    document.getElementById('selected-mood-text').textContent = moodText;
    document.getElementById('mood-timestamp').textContent = `Recorded at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    document.getElementById('mood-selected').classList.remove('hidden');
  }));

  // Add Task
  const setupAddTask = (btnId, inputId, listId) => {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    const container = document.getElementById(listId);

    const add = () => {
      const task = input.value.trim();
      if (!task) return;

      const item = document.createElement('div');
      item.className = 'task-item flex items-center justify-between p-3 bg-white rounded shadow-sm';

      item.innerHTML = `
        <div class="flex items-center">
          <input type="checkbox" class="w-5 h-5 rounded mr-3">
          <span>${task}</span>
        </div>
        <button class="delete-task-btn text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;

      container.appendChild(item);
      input.value = '';
    };

    btn.addEventListener('click', add);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') add();
    });
  };

  setupAddTask('task-view-add-btn', 'task-view-input', 'tasks-list');

  // Task interactions
  document.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const item = e.target.closest('.task-item');
      item?.classList.toggle('completed', e.target.checked);
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.delete-task-btn')) {
      const item = e.target.closest('.task-item');
      item?.remove();
    }
  });

  // Task filter
  document.querySelectorAll('.task-filter').forEach(filter => {
    filter.addEventListener('click', () => {
      const type = filter.dataset.filter;
      document.querySelectorAll('.task-filter').forEach(f => f.classList.remove('active', 'btn-mint'));
      filter.classList.add('active', 'btn-mint');

      document.querySelectorAll('#tasks-list .task-item').forEach(task => {
        if (type === 'all') task.style.display = 'flex';
        else if (type === 'active') task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
        else if (type === 'completed') task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
      });
    });
  });

  // Quote generator
  const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" }
  ];

  document.getElementById('new-quote-btn').addEventListener('click', () => {
    const { text, author } = quotes[Math.floor(Math.random() * quotes.length)];
    const qText = document.getElementById('quote-text');
    const qAuthor = document.getElementById('quote-author');
    qText.textContent = `"${text}"`;
    qAuthor.textContent = `— ${author}`;
    qText.classList.add('fade-in');
    qAuthor.classList.add('fade-in');
    setTimeout(() => {
      qText.classList.remove('fade-in');
      qAuthor.classList.remove('fade-in');
    }, 500);
  });

  // Add habit
  const addHabitBtn = document.getElementById('add-habit-btn');
  const newHabitInput = document.getElementById('new-habit-input');
  const habitsTableBody = document.getElementById('habits-table-body');

  const addNewHabit = () => {
    const habitText = newHabitInput.value.trim();
    if (!habitText) return;

    const row = document.createElement('tr');
    row.className = 'border-t border-gray-100 fade-in';

    let cells = `<td class="py-3">${habitText}</td>`;
    for (let i = 0; i < 7; i++) {
      cells += `<td class="text-center">
                  <div class="habit-check w-6 h-6 rounded-full border-2 border-gray-300 mx-auto"></div>
                </td>`;
    }

    cells += `<td class="text-center">
      <button class="delete-habit-btn text-gray-400 hover:text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </td>`;

    row.innerHTML = cells;
    habitsTableBody.appendChild(row);
    newHabitInput.value = '';
  };

  addHabitBtn.addEventListener('click', addNewHabit);
  newHabitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNewHabit();
  });

  // Save mood
  document.getElementById('save-mood-btn').addEventListener('click', () => {
    const selected = document.querySelector('.mood-emoji.selected');
    if (!selected) return alert('Select a mood first!');

    const type = selected.dataset.mood;
    const emoji = selected.textContent;
    const notes = document.getElementById('mood-notes').value.trim();
    const colors = {
      great: 'border-green-400',
      good: 'border-yellow-400',
      okay: 'border-blue-400',
      sad: 'border-purple-400',
      stressed: 'border-red-400'
    };

    const newEntry = document.createElement('div');
    newEntry.className = `flex items-center p-3 border-l-4 ${colors[type] || 'border-gray-400'} bg-white rounded shadow-sm fade-in`;

    newEntry.innerHTML = `
      <div class="text-2xl mr-4">${emoji}</div>
      <div class="flex-1">
        <div class="flex justify-between">
          <p class="font-medium">${type.charAt(0).toUpperCase() + type.slice(1)}</p>
          <p class="text-sm text-gray-500">Today, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <p class="text-sm text-gray-600 mt-1">${notes || 'No notes added.'}</p>
      </div>
    `;

    document.getElementById('mood-history').prepend(newEntry);
    document.getElementById('mood-notes').value = '';
    selected.classList.remove('selected');
    alert('Mood saved successfully!');
  });
});
