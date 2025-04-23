// Minimal automated UI logic for Cascade Scoreboard MCP
const API = {
  score: '/api/score',
  tasks: '/api/tasks',
  files: '/api/files'
};

async function getScore() {
  const res = await fetch(API.score);
  const data = await res.json();
  document.getElementById('score').textContent = data.score;
}

async function addPoint() {
  const res = await fetch(API.score, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score: parseInt(document.getElementById('score').textContent) + 1 })
  });
  getScore();
}

document.getElementById('add-point').onclick = addPoint;

async function getTasks() {
  const res = await fetch(API.tasks);
  const data = await res.json();
  const ul = document.getElementById('tasks');
  ul.innerHTML = '';
  data.tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.name} (${task.status})`;
    li.onclick = async () => {
      // Toggle status on click
      const newStatus = task.status === 'pending' ? 'in_progress' : (task.status === 'in_progress' ? 'done' : 'pending');
      await fetch(API.tasks, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: newStatus })
      });
      getTasks();
    };
    ul.appendChild(li);
  });
}

document.getElementById('add-task').onclick = async () => {
  const val = document.getElementById('task-input').value.trim();
  if (!val) return;
  await fetch(API.tasks, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: val, status: 'pending' })
  });
  document.getElementById('task-input').value = '';
  getTasks();
};

async function getFiles() {
  const res = await fetch(API.files);
  const data = await res.json();
  const ul = document.getElementById('files');
  ul.innerHTML = '';
  data.files.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f;
    li.onclick = async () => {
      await fetch(API.files, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_file: f })
      });
      getFiles();
      getCurrentFile();
    };
    ul.appendChild(li);
  });
}

document.getElementById('add-file').onclick = async () => {
  const val = document.getElementById('file-input').value.trim();
  if (!val) return;
  await fetch(API.files, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file: val })
  });
  document.getElementById('file-input').value = '';
  getFiles();
};

async function getCurrentFile() {
  const res = await fetch(API.files);
  const data = await res.json();
  document.getElementById('current-file').textContent = data.current_file;
}

function refreshAll() {
  getScore();
  getTasks();
  getFiles();
  getCurrentFile();
}

refreshAll();
setInterval(refreshAll, 5000); // auto-refresh every 5 seconds
