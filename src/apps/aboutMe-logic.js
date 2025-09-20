document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contentSections = document.querySelectorAll('.content-section');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active navigation link
                updateActiveNavLink(link);
            }
        });
    });

    // Intersection Observer for content section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all content sections
    contentSections.forEach(section => {
        observer.observe(section);
    });

    // Update active navigation link based on scroll position
    function updateActiveNavLink(activeLink = null) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        if (activeLink) {
            activeLink.classList.add('active');
        } else {
            // Find the currently visible section
            const scrollPosition = window.scrollY + 100;

            contentSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    const correspondingLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                    }
                }
            });
        }
    }

    // Update active navigation link on scroll
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
    });

    // Initialize - show first section and set first nav link as active
    if (contentSections.length > 0) {
        contentSections[0].classList.add('visible');
    }

    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        updateActiveNavLink();
    });
});