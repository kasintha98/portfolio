document.addEventListener('DOMContentLoaded', () => {

    const themeSwitch = document.getElementById('theme-switch');

    // --- Theme Switcher ---
    // Check for saved theme in localStorage
    const currentTheme = localStorage.getItem('theme');
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
            <a href="${data.personal.social_links.twitter}" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
        `;

        // About Section
        document.getElementById('about-text').textContent = data.about;

        // Projects Section
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = data.projects.map(project => `
            <div class="project-card">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-card-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.live_link}" target="_blank">View Live</a>
                        <a href="${project.code_link}" target="_blank">View Code</a>
                    </div>
                </div>
            </div>
        `).join('');

        // Skills Section
        const skillsContainer = document.getElementById('skills-container');
        skillsContainer.innerHTML = data.skills.map(skill => `
            <div class="skill-badge">${skill}</div>
        `).join('');
        
        // Contact Section
        document.getElementById('contact-email').href = `mailto:${data.personal.email}`;
    };
    
    loadPortfolioData();


    // --- Scroll Animations ---
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

});