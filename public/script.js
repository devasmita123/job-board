async function fetchJobs() {
  const res = await fetch('/api/jobs');
  const jobs = await res.json();
  displayJobs(jobs);

  document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filtered = jobs.filter(job => job.title.toLowerCase().includes(searchTerm));
    displayJobs(filtered);
  });
}

function displayJobs(jobs) {
  const jobsDiv = document.getElementById('jobs');
  jobsDiv.innerHTML = '';

  jobs.forEach(job => {
    const div = document.createElement('div');
    div.className = 'job';
    const remaining = timeLeft(job.lastDate);

    div.innerHTML = `
      <h2 onclick="showJobDetails(${JSON.stringify(job)})">${job.title}</h2>
      <p><strong>Company:</strong> ${job.company}</p>
      <p>${job.description}</p>
      <p><strong>Vacancies Left:</strong> <span class="vacancies">${job.vacancies}</span></p>
      <p><strong>Last Date:</strong> ${new Date(job.lastDate).toLocaleDateString()}</p>
      <p class="countdown">⏰ Time Left: ${remaining}</p>
      <a href="${job.applyLink}" target="_blank" onclick="applyForJob(${job.id})">Apply Now</a>
    `;

    jobsDiv.appendChild(div);
  });
}

function timeLeft(lastDate) {
  const now = new Date();
  const end = new Date(lastDate);
  const diff = end - now;

  if (diff <= 0) return 'Deadline Passed';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return `${days}d ${hrs}h ${mins}m`;
}

// Handle job application
function applyForJob(jobId) {
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  if (jobIndex !== -1 && jobs[jobIndex].vacancies > 0) {
    jobs[jobIndex].vacancies--;
    displayJobs(jobs);
    alert('Application successful! Vacancy left: ' + jobs[jobIndex].vacancies);
  }
}

// Show Job Details in Modal
function showJobDetails(job) {
  document.getElementById('modalTitle').textContent = job.title;
  document.getElementById('modalCompany').textContent = job.company;
  document.getElementById('modalVacancies').textContent = job.vacancies;
  document.getElementById('modalDate').textContent = new Date(job.lastDate).toLocaleDateString();
  document.getElementById('modalDescription').textContent = job.description;
  
  document.getElementById('jobModal').style.display = "block";
}

function closeModal() {
  document.getElementById('jobModal').style.display = "none";
}

fetchJobs();
