// Database Simulation using LocalStorage
const defaultData = {
  schoolInfo: {
    name: "Sena Yerosan School of Excellence",
    motto: "Pride in Excellence!",
    logo: "Seenaa Y.png",
    icon: "Seenaa Y.png"
  },
  announcements: [
    { id: 1, title: "Badhaasa Qabxii Kutaa 8ffaa", body: "Barattoonni keenya qormaata naannoo kutaa 8ffaa irratti qabxii olaanaa galmeessisuun badhaafamanii jiru." },
    { id: 2, title: "Galmeen Barattoota Haaraa Banameera", body: "Bara barnoota haaraaf galmeen daaimmanii fi barattoota sadarkaa 1ffaa & 2ffaa banamuu isaa isin beeksisna." }
  ],
  applications: [
    { name: "Abebe Kebede", grade: "Primary (1-8)", parent: "Kebede Tola", phone: "0911000000", branch: "Ganda Haraa" }
  ],
  vacancies: [
    { title: "Barsiisaa Saayinsii Guutuu", desc: "Digrii jalqabaa kan qabu fi muuxannoo waggaa 2+ kan qabu." }
  ]
};

// Get Data from LocalStorage or Default
function getSystemData() {
  const data = localStorage.getItem('sena_school_data');
  return data ? JSON.parse(data) : defaultData;
}

// Save Data to LocalStorage
function saveSystemData(data) {
  localStorage.setItem('sena_school_data', JSON.stringify(data));
}

// Toggle Mobile Responsive Navigation Menu
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('show-menu');
}

// Dynamically Load JSON Data, Icons, and Logos
async function setupSchoolIconsAndData() {
  try {
    const response = await fetch('data.json');
    if (response.ok) {
      const jsonData = await response.json();

      // If LocalStorage is empty, initialize with JSON content
      if (!localStorage.getItem('sena_school_data')) {
        saveSystemData(jsonData);
      }

      // Update Favicon (Browser Tab Icon)
      const iconPath = jsonData.schoolInfo?.icon || "Seenaa Y.png";
      let iconLink = document.querySelector("link[rel*='icon']");
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        iconLink.type = 'image/png';
        document.getElementsByTagName('head')[0].appendChild(iconLink);
      }
      iconLink.href = iconPath;

      // Update Header & Footer Logos
      const logoPath = jsonData.schoolInfo?.logo || "Seenaa Y.png";
      const logos = document.querySelectorAll('.brand-logo img, .footer-logo-wrap img');
      logos.forEach(img => {
        img.src = logoPath;
      });
    }
  } catch (error) {
    console.warn("data.json dubbisuun hin danda'amne, ragaa default/localStorage fayyadamaa jira:", error);
  }
}

// Render dynamic content on Home page
function renderHomeContent() {
  const annContainer = document.getElementById('announcement-feed');
  if (!annContainer) return;
  const data = getSystemData();
  annContainer.innerHTML = data.announcements.map(ann => `
    <div class="card">
      <h3>${ann.title}</h3>
      <p>${ann.body}</p>
    </div>
  `).join('');
}

// Render dynamic vacancies on Contact/Vacancy page
function renderVacancies() {
  const vacContainer = document.getElementById('vacancy-list-feed');
  if (!vacContainer) return;
  const data = getSystemData();
  vacContainer.innerHTML = data.vacancies.map(vac => `
    <div style="background:#F7FAFC; padding:1rem; border-radius:6px; margin-bottom:10px;">
      <h4 style="color:var(--primary);">${vac.title}</h4>
      <p>${vac.desc}</p>
    </div>
  `).join('');
}

// Submit Application Form
function submitApplication(e) {
  e.preventDefault();
  const data = getSystemData();
  const newApp = {
    name: document.getElementById('appStudentName').value,
    grade: document.getElementById('appGrade').value,
    parent: document.getElementById('appParentName').value,
    phone: document.getElementById('appPhone').value,
    branch: document.getElementById('appBranch').value
  };
  data.applications.push(newApp);
  saveSystemData(data);
  alert("Iyyanni keessan milkaa'inaan ergameera!");
  e.target.reset();
}

// Admin Panel Auth & Actions
function handleAdminLogin(e) {
  e.preventDefault();
  const u = document.getElementById('adminUser').value;
  const p = document.getElementById('adminPass').value;

  if (u === "admin_sena" && p === "sena@2026_secure") {
    sessionStorage.setItem('admin_logged', 'true');
    checkAdminAuth();
  } else {
    document.getElementById('login-error-msg').innerText = "Username ykn Password dogoggoraa!";
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem('admin_logged');
  checkAdminAuth();
}

function checkAdminAuth() {
  const isLogged = sessionStorage.getItem('admin_logged') === 'true';
  const loginView = document.getElementById('admin-login-view');
  const dashView = document.getElementById('admin-dashboard-view');
  
  if (loginView && dashView) {
    if (isLogged) {
      loginView.style.display = 'none';
      dashView.style.display = 'block';
      renderAdminData();
    } else {
      loginView.style.display = 'block';
      dashView.style.display = 'none';
    }
  }
}

function renderAdminData() {
  const data = getSystemData();
  const appBody = document.getElementById('applicationsTableBody');
  if (appBody) {
    appBody.innerHTML = data.applications.map(app => `
      <tr>
        <td>${app.name}</td>
        <td>${app.grade}</td>
        <td>${app.parent}</td>
        <td>${app.phone}</td>
        <td>${app.branch}</td>
      </tr>
    `).join('');
  }
}

function postAnnouncement() {
  const title = document.getElementById('newAnnTitle').value;
  const body = document.getElementById('newAnnBody').value;
  if (title && body) {
    const data = getSystemData();
    data.announcements.unshift({ id: Date.now(), title, body });
    saveSystemData(data);
    alert("Labsii haaraa maxxanfameera!");
    document.getElementById('newAnnTitle').value = '';
    document.getElementById('newAnnBody').value = '';
    renderHomeContent();
  }
}

function postVacancy() {
  const title = document.getElementById('newJobTitle').value;
  const desc = document.getElementById('newJobDesc').value;
  if (title && desc) {
    const data = getSystemData();
    data.vacancies.unshift({ title, desc });
    saveSystemData(data);
    alert("Beeksisi hojii maxxanfameera!");
    document.getElementById('newJobTitle').value = '';
    document.getElementById('newJobDesc').value = '';
    renderVacancies();
  }
}

function switchAdminTab(tabName, btn) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.admin-sidebar button').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).style.display = 'block';
  btn.classList.add('active');
}

// Global Event Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupSchoolIconsAndData();
  renderHomeContent();
  renderVacancies();
  checkAdminAuth();
});