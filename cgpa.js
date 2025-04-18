
let chartInstance = null;

function getLetterGrade(gpa) {
  if (gpa >= 9) return 'A+';
  if (gpa >= 8) return 'A';
  if (gpa >= 7) return 'B';
  if (gpa >= 6) return 'C';
  if (gpa >= 5) return 'D';
  return 'F';
}

function calculateCGPA() {
  const grades = document.querySelectorAll('.grade');
  const weights = document.querySelectorAll('.weight');
  const subjects = document.querySelectorAll('.subject');
  let totalWeighted = 0;
  let totalCredits = 0;
  let breakdown = '';
  let labels = [];
  let data = [];

  grades.forEach((gradeInput, index) => {
    const grade = parseFloat(gradeInput.value);
    const credit = parseFloat(weights[index].value) || 0;
    const subject = subjects[index].value || `Course ${index + 1}`;
    if (!isNaN(grade)) {
      const letter = getLetterGrade(grade);
      breakdown += `<li>${subject}: GPA ${grade.toFixed(2)} (${letter}), Credits: ${credit}</li>`;
      totalWeighted += grade * credit;
      totalCredits += credit;
      labels.push(subject);
      data.push(grade);
    }
  });

  let resultText = document.getElementById('result');
  const progressBar = document.getElementById('progress-bar');

  if (totalCredits === 0) {
    resultText.innerHTML = "⚠️ Please enter valid GPA values and credits.";
    resultText.className = 'text-yellow-400 mt-6 text-center text-xl font-bold animate-pulse';
    progressBar.style.width = '0%';
    return;
  }

  const finalCGPA = totalWeighted / totalCredits;
  const cgpaRounded = finalCGPA.toFixed(2);

  resultText.innerHTML = `Final CGPA: ${cgpaRounded}<br><ul class='mt-2 text-sm text-left list-disc list-inside'>${breakdown}</ul>`;
  resultText.className = 'text-green-400 mt-6 text-center text-xl font-bold animate-fadeIn';
  progressBar.style.width = `${(finalCGPA / 10) * 100}%`;
  document.getElementById('chime-sound').play();

  renderChart(labels, data);
  // 
  // confetti({
  //   particleCount: 100,
  //   angle: 60,
  //   spread: 55,
  //   origin: { x: 0 },
  // });
  // confetti({
  //   particleCount: 100,
  //   angle: 120,
  //   spread: 55,
  //   origin: { x: 1 },
  // });
  
  launchCelebrationConfetti();


}


function renderChart(labels, data) {
  const ctx = document.getElementById('gpaChart').getContext('2d');

  if (chartInstance) {
    chartInstance.destroy(); // Remove old chart instance before drawing new
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'GPA per Subject',
        data: data,
        backgroundColor: '#3B82F6',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 10
        }
      }
    }
  });
}

function addRow() {
  const form = document.getElementById('grade-form');
  const row = document.createElement('div');
  row.className = 'flex flex-col md:flex-row gap-3 items-center animate-slideIn';
  row.innerHTML = `
    <input type="text" placeholder="Course" class="subject w-full md:w-1/3 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 transition-all" />
    <input type="number" placeholder="GPA (0.0 - 10.0)" min="0" max="10" step="0.01" class="grade w-full md:w-1/3 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 transition-all" />
    <input type="number" placeholder="Credits" min="0" step="1" class="weight w-full md:w-1/3 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 transition-all" />
  `;
  form.appendChild(row);
  saveToLocalStorage();
}

function clearForm() {
  document.getElementById('grade-form').innerHTML = '';
  document.getElementById('result').textContent = '';
  document.getElementById('progress-bar').style.width = '0%';
  if (chartInstance) chartInstance.destroy();
  localStorage.removeItem('cgpaFormData');
}

function restartCalculator() {
  clearForm();
  addRow();
}

function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains('dark-theme');
  body.classList.toggle('dark-theme', !isDark);
  body.classList.toggle('light-theme', isDark);

  document.querySelectorAll('input').forEach(input => {
    input.classList.toggle('bg-gray-700', !isDark);
    input.classList.toggle('text-white', !isDark);
    input.classList.toggle('placeholder-gray-300', !isDark);
    input.classList.toggle('bg-white', isDark);
    input.classList.toggle('text-gray-800', isDark);
    input.classList.toggle('placeholder-gray-500', isDark);
  });
}

function saveToLocalStorage() {
  const subjects = [...document.querySelectorAll('.subject')].map(i => i.value);
  const grades = [...document.querySelectorAll('.grade')].map(i => i.value);
  const credits = [...document.querySelectorAll('.weight')].map(i => i.value);
  const data = { subjects, grades, credits };
  localStorage.setItem('cgpaFormData', JSON.stringify(data));
}

function launchCelebrationConfetti() {
  // Left burst
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 60,
    origin: { x: 0 },
    emojis: ['✨', '🎓', '🌟', '📘'],
    emojiSize: 24
  });

  // Right burst
  confetti({
    particleCount: 80,
    angle: 120,
    spread: 60,
    origin: { x: 1 },
    emojis: ['✨', '🎓', '🌟', '📘'],
    emojiSize: 24
  });

  // Top-center fireworks
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { y: 0.4 },
    emojis: ['✨', '🎓', '🌟'],
    emojiSize: 18
  });
}


function loadFromLocalStorage() {
  const saved = JSON.parse(localStorage.getItem('cgpaFormData'));
  if (!saved) return;
  const form = document.getElementById('grade-form');
  form.innerHTML = '';
  saved.subjects.forEach((subject, i) => {
    const row = document.createElement('div');
    row.className = 'flex flex-col md:flex-row gap-3 items-center animate-slideIn';
    row.innerHTML = `
      <input type="text" value="${subject}" class="subject w-full md:w-1/3 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 transition-all" />
      <input type="number" value="${saved.grades[i]}" class="grade w-full md:w-1/3 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 transition-all" />
      <input type="number" value="${saved.credits[i]}" class="weight w-full md:w-1/3 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 transition-all" />
    `;
    form.appendChild(row);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  if (!localStorage.getItem('cgpaFormData')) addRow(); // default row
});

