document.addEventListener('DOMContentLoaded', () => {

    const themeSwitch = document.getElementById('theme-switch');

    // --- Theme Switcher ---
    // Check for saved theme in localStorage
    const systemDefault = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    const currentTheme = localStorage.getItem('theme') || systemDefault;
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeSwitch.checked = true;
        }
    }

    // Listen for theme switch change
    themeSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });





    loadPortfolioData();




});

// --- Dynamic Content Loading ---
const loadPortfolioData = async () => {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        populateUI(data);
    } catch (error) {
        console.error("Could not load portfolio data:", error);
    }
};

const populateUI = (data) => {
    // Hero Section
    document.getElementById('hero-name').textContent = data.personal.name;
    document.getElementById('hero-title').textContent = data.personal.title;
    document.getElementById('hero-img').src = data.personal.profile_image;
    document.getElementById('footer-name').textContent = data.personal.name;

    // Social Links
    const socialLinksContainer = document.getElementById('hero-socials');
    socialLinksContainer.innerHTML = `
            <a href="${data.personal.social_links.github}" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>
            <a href="${data.personal.social_links.linkedin}" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
        `;

    // About Section
    document.getElementById('about-text').textContent = data.about;

    // Main Sections
    const mainSectionHolder = document.getElementById('main-sections');
    const sectionsData = data.sections || [];
    for (let section of sectionsData) {
        if (section.sectionId && mainSectionHolder) {
            let sectionList = section.list || [];
            let sectionElement = document.createElement("section");
            let titleElement = document.createElement("h2");
            let contentElement = document.createElement("div");

            mainSectionHolder.appendChild(sectionElement);
            sectionElement.id = section.sectionId;
            sectionElement.className = "content-section";
            titleElement.innerHTML = section.sectionTitle || "";
            sectionElement.appendChild(titleElement);
            contentElement.id = section.sectionId + "-div";
            section.isGridList ? contentElement.classList.add("projects-grid") : null;
            sectionElement.appendChild(contentElement);
            contentElement.innerHTML = sectionList.map(element => `
            <div class="project-card">
                ${element.image ? '<img src="' + element.image + '" alt="' + element.title + '"></img>' : ""}
                <div class="project-card-content">
                    <h3>${element.title || ""}</h3>
                    ${element.company ? '<h4>' + element.company + '</h4>' : ''}
                    ${element.date ? '<p class="date-span">' + element.date + '</p>' : ''}
                    <div class="date-holder">
                        ${element.from ? '<p class="date-span">From: ' + element.from + '</p>' : ''}
                        ${element.to ? '<p class="date-span">To: ' + element.to + '</p>' : ''}
                    </div>
                    <p>${element.description || ""}</p>
                    ${element.tags ? '<div class="project-tags">' + element.tags.map(tag => `<span>${tag}</span>`).join('') + '</div>' : ""}
                    <div class="project-links">
                        ${element.live_link ? '<a href="' + element.live_link + '" target="_blank">View Live</a>' : ""}
                        ${element.code_link ? '<a href="' + element.code_link + '" target="_blank">View Code</a>' : ""}
                    </div>
                </div>
            </div>`).join('');
        }
    }

    // Skills Section
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = data.skills.map(skill => `
            <div class="skill-badge">${skill}</div>
        `).join('');

    // Contact Section
    document.getElementById('contact-email').href = `mailto:${data.personal.email}`;

    // --- Scroll Animations ---
    addSectionObservers();
};

// --- Scroll Animations ---
const addSectionObservers = () => {
    const sections = document.querySelectorAll('.content-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}