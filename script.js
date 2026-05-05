import Lenis from 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm';

document.addEventListener('DOMContentLoaded', () => {
    const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
    });

    const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            const target = href ? document.querySelector(href) : null;

            if (!target) return;

            event.preventDefault();
            lenis.scrollTo(target);
        });
    });

    const statsSection = document.getElementById('stats');
    const bars = document.querySelectorAll('.skill-bar');

    if (statsSection && bars.length) {
        const resetBars = () => {
            bars.forEach((bar) => {
                bar.style.transition = 'none';
                bar.style.width = '0';
            });
        };

        const animateBars = () => {
            bars.forEach((bar) => {
                const target = bar.dataset.level || '0';

                bar.style.transition = 'none';
                bar.style.width = '0';

                requestAnimationFrame(() => {
                    bar.style.transition = 'width 1.2s cubic-bezier(0.1, 0.7, 0.1, 1)';
                    bar.style.width = `${target}%`;
                });
            });
        };

        resetBars();

        const statsObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    animateBars();
                } else {
                    resetBars();
                }
            },
            {threshold: 0.35}
        );

        statsObserver.observe(statsSection);
    }

    const experienceSection = document.getElementById('experience');
    const yearContainer = document.getElementById('experience-year-container');
    const expContent = document.getElementById('experience-content');
    const expYearLabel = document.getElementById('exp-year-label');
    const expRole = document.getElementById('exp-role');
    const expCompany = document.getElementById('exp-company');
    const expDesc = document.getElementById('exp-desc');

    // ===== ABOUT SECTION SCROLL ANIMATION =====
    const aboutSection = document.getElementById('about');
    const aboutText = document.querySelector('.about-text');

    let aboutLastProgress = -1;

    const updateAbout = () => {
        if (!aboutSection || !aboutText) return;

        const rect = aboutSection.getBoundingClientRect();
        const sectionHeight = aboutSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        const scrolled = -rect.top;
        const scrollRange = sectionHeight - viewportHeight;

        const progress = Math.max(0, Math.min(1, scrolled / scrollRange));

        // avoid unnecessary DOM updates
        if (Math.abs(progress - aboutLastProgress) < 0.01) return;

        aboutText.style.opacity = progress;
        aboutText.style.transform = `translateY(${50 * (1 - progress)}px)`;

        aboutLastProgress = progress;
    };

    const experienceData = [
        {
            yearRange: "2019 - 2020",
            years: [2019, 2020],
            role: "GAME DEVELOPER",
            company: "FREELANCER / ELEMENTRIX",
            desc: "Built various game prototypes for mobile games. Focused on complete game loops with polished UX in Unity."
        },
        {
            yearRange: "2021 - 2022",
            years: [2021],
            role: "UNITY GAME DEVELOPER",
            company: "One Learning",
            desc: "Developed educational gamified puzzles for medical concepts."
        },
        {
            yearRange: "2022 - 2025",
            years: [2022, 2023, 2024, 2025],
            role: "SENIOR UNITY DEVELOPER",
            company: "AUTOVRSE",
            desc: "Spearheading core XR systems development. Architected modular interaction frameworks and optimized rendering pipelines for standalone VR."
        }
    ];

    if (experienceSection && yearContainer) {
        // Initialize Year Odometer
        const initYearOdometer = () => {
            if (!yearContainer) return;
            yearContainer.innerHTML = '';
            // Use 0000 as base to ensure we have 4 columns
            const startYear = "0000";

            console.log("Initializing Odometer Columns");

            startYear.split('').forEach((_, i) => {
                const column = document.createElement('div');
                column.className = 'year-digit-column';
                column.dataset.index = i;

                // Add digits 0-9 to each column
                for (let n = 0; n < 10; n++) {
                    const item = document.createElement('div');
                    item.className = 'year-digit-item';
                    item.textContent = n;
                    column.appendChild(item);
                }
                yearContainer.appendChild(column);
            });
        };

        let lastYear = null;

        const updateExperience = () => {
            const rect = experienceSection.getBoundingClientRect();
            const sectionHeight = experienceSection.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Progress is 0 when section starts entering, 1 when it's fully scrolled
            // But since it's sticky, we care about the scroll within the 500vh
            const scrolled = -rect.top;
            const scrollRange = sectionHeight - viewportHeight;
            const progress = Math.max(0, Math.min(1, scrolled / scrollRange));

            // Map progress to year 2019 - 2025
            const currentYear = Math.floor(2019 + progress * (2025 - 2019 + 0.99));

            if (currentYear !== lastYear) {
                console.log(`Experience Year Update: ${currentYear}`);
                // Update Odometer
                const yearStr = currentYear.toString();
                const columns = yearContainer.querySelectorAll('.year-digit-column');
                // Ensure we have exactly 4 digits for years 2019-2025
                const paddedYearStr = yearStr.padStart(4, '0');

                if (columns.length === 0) {
                    console.warn("No odometer columns found, re-initializing.");
                    initYearOdometer();
                }

                paddedYearStr.split('').forEach((digit, i) => {
                    const col = yearContainer.children[i];
                    if (col) {
                        const digitNum = parseInt(digit);
                        col.style.transform = `translateY(-${digitNum * 10}%)`;
                    }
                });
                console.log(`Odometer set to: ${paddedYearStr}`);

                // Update Content
                const data = experienceData.find(d => d.years.includes(currentYear));
                if (data && expRole.textContent !== data.role) {
                    // Trigger fade animation
                    expContent.style.animation = 'none';
                    expContent.offsetHeight; // trigger reflow
                    expContent.style.animation = 'content-slide-up 0.5s ease-out';

                    expYearLabel.textContent = data.yearRange;
                    expRole.textContent = data.role;
                    expCompany.textContent = data.company;
                    expDesc.textContent = data.desc;
                }

                lastYear = currentYear;
            }
        };

        initYearOdometer();
        window.addEventListener('scroll', () => {
            updateExperience();
            updateAbout();
        }, {passive: true});

        window.addEventListener('resize', () => {
            updateExperience();
            updateAbout();
        });
        updateExperience();
        updateAbout();
    }

    const demoVideo = document.querySelector('.demo-video');
    const demoThumbnail = document.querySelector('.demo-thumbnail');
    const demoCard = demoVideo?.closest('.group');

    if (demoVideo && demoThumbnail && demoCard) {
        const showThumbnail = () => {
            demoVideo.pause();
            demoVideo.currentTime = 0;
            demoVideo.classList.add('opacity-0');
            demoThumbnail.classList.remove('opacity-0');
            demoThumbnail.classList.add('opacity-100');
        };

        const showVideo = () => {
            demoThumbnail.classList.remove('opacity-100');
            demoThumbnail.classList.add('opacity-0');
            demoVideo.classList.remove('opacity-0');
            demoVideo.classList.add('opacity-100');
            demoVideo.play().catch(() => {
            });
        };

        demoCard.addEventListener('mouseenter', showVideo);
        demoCard.addEventListener('mouseleave', showThumbnail);
        showThumbnail();
    }

    // Project Slider Logic
    const slider = document.getElementById('project-slider');
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');
    let cards = Array.from(document.querySelectorAll('.project-card'));

    if (slider && prevBtn && nextBtn && cards.length) {
        let currentIndex = 0;
        let isTransitioning = false;
        let autoSlideTimer;

        // Clone cards for infinite loop
        const firstClones = cards.map(card => card.cloneNode(true));
        const lastClones = cards.map(card => card.cloneNode(true));

        firstClones.forEach(clone => slider.appendChild(clone));
        lastClones.reverse().forEach(clone => slider.insertBefore(clone, slider.firstChild));

        const allCards = Array.from(slider.querySelectorAll('.project-card'));
        const originalCount = cards.length;
        currentIndex = originalCount; // Start at the first original card

        const getCardWidth = () => {
            // Adjust card width: currently ~60% on desktop, ~80% on mobile
            // Change these factors to make cards wider/narrower
            if (window.innerWidth >= 1024) return slider.offsetWidth / 3;
            if (window.innerWidth >= 768) return slider.offsetWidth / 1.5;
            return slider.offsetWidth * 0.8;
        };

        const updateSlider = (smooth = true) => {
            const cardWidth = getCardWidth();
            const gap = window.innerWidth >= 768 ? 24 : 16;

            allCards.forEach(card => {
                card.style.width = `${cardWidth}px`;
                card.classList.remove('active-card');

                // Pause videos on inactive cards
                const video = card.querySelector('video');
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
                const thumb = card.querySelector('.demo-thumbnail');
                if (thumb) thumb.classList.add('opacity-100');
            });

            const containerWidth = slider.parentElement.offsetWidth;
            const centerOffset = (containerWidth - cardWidth) / 2;
            const totalOffset = currentIndex * (cardWidth + gap) - centerOffset;

            slider.style.transition = smooth ? 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)' : 'none';
            slider.style.transform = `translateX(-${totalOffset}px)`;

            // Highlight center card
            allCards[currentIndex].classList.add('active-card');
        };

        const handleInfiniteLoop = () => {
            if (currentIndex >= originalCount * 2) {
                currentIndex = originalCount;
                updateSlider(false);
            } else if (currentIndex < originalCount) {
                currentIndex = originalCount * 2 - 1;
                updateSlider(false);
            }
            isTransitioning = false;
        };

        const nextSlide = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updateSlider();
            resetAutoSlide();
        };

        const prevSlide = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex--;
            updateSlider();
            resetAutoSlide();
        };

        const startAutoSlide = () => {
            autoSlideTimer = setInterval(nextSlide, 5000);
        };

        const resetAutoSlide = () => {
            clearInterval(autoSlideTimer);
            startAutoSlide();
        };

        slider.addEventListener('transitionend', handleInfiniteLoop);
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        window.addEventListener('resize', () => updateSlider(false));

        // Initial setup
        updateSlider(false);
        startAutoSlide();
    }

    // Scroll Spy: Highlight nav links based on scroll position
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

    if (navLinks.length && sections.length) {
        const activeClasses = ['text-[#eaea00]', 'md:border-b-4', 'md:border-[#eaea00]', 'md:pb-1'];
        const inactiveClasses = ['text-[#e2e2e2]'];

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add(...activeClasses);
                            link.classList.remove(...inactiveClasses);
                        } else {
                            link.classList.remove(...activeClasses);
                            link.classList.add(...inactiveClasses);
                        }
                    });
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));
    }

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu?.querySelectorAll('a');

    if (mobileMenuToggle && mobileMenuClose && mobileMenu) {
        const openMenu = () => {
            mobileMenu.classList.remove('translate-x-full');
            document.body.classList.add('overflow-hidden');
        };

        const closeMenu = () => {
            mobileMenu.classList.add('translate-x-full');
            document.body.classList.remove('overflow-hidden');
        };

        mobileMenuToggle.addEventListener('click', openMenu);
        mobileMenuClose.addEventListener('click', closeMenu);
        mobileMenuLinks.forEach(link => link.addEventListener('click', closeMenu));
    }
});

const fullscreenButton = document.getElementById('fullscreen-toggle');
const mobileFullscreenButton = document.getElementById('mobile-fullscreen-toggle');

const toggleFullscreen = async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.error('Fullscreen toggle failed:', error);
    }
};

if (fullscreenButton) {
    fullscreenButton.addEventListener('click', toggleFullscreen);
}

if (mobileFullscreenButton) {
    mobileFullscreenButton.addEventListener('click', toggleFullscreen);
}

const updateFullscreenLabel = () => {
    const icon = document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen';
    if (fullscreenButton) fullscreenButton.innerHTML = `<span class="material-symbols-outlined text-4xl leading-none text-primary-fixed">${icon}</span>`;
    if (mobileFullscreenButton) mobileFullscreenButton.innerHTML = `<span class="material-symbols-outlined text-5xl leading-none text-primary-fixed">${icon}</span>`;
};

document.addEventListener('fullscreenchange', updateFullscreenLabel);

document.addEventListener('fullscreenchange', updateFullscreenLabel);

document.addEventListener('fullscreenchange', updateFullscreenLabel);

const projectCards = document.querySelectorAll('.project-card');
const projectDetailModal = document.getElementById('project-detail-modal');
const projectDetailBackdrop = document.getElementById('project-detail-backdrop');
const projectDetailClose = document.getElementById('project-detail-close');
const projectDetailX = document.getElementById('project-detail-x');

const projectDetailStage = document.getElementById('project-detail-stage');
const projectDetailTitle = document.getElementById('project-detail-title');
const projectDetailImage = document.getElementById('project-detail-image');
const projectDetailVideo = document.getElementById('project-detail-video');
const projectDetailDescription = document.getElementById('project-detail-description');
const projectDetailDetails = document.getElementById('project-detail-details');
const projectDetailTags = document.getElementById('project-detail-tags');

function openProjectDetail(card) {
    const title = card.dataset.projectTitle || 'Project Details';
    const stage = card.dataset.projectStage || 'STAGE 00';
    const image = card.dataset.projectImage || '';
    const video = card.dataset.projectVideo || '';
    const description = card.dataset.projectDescription || '';
    const details = card.dataset.projectDetails || '';
    const tags = card.dataset.projectTags
        ? card.dataset.projectTags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

    projectDetailStage.textContent = stage;
    projectDetailTitle.textContent = title;
    projectDetailImage.src = image;
    projectDetailImage.alt = `${title} preview`;
    projectDetailDescription.textContent = description;
    projectDetailDetails.textContent = details;

    projectDetailVideo.pause();
    projectDetailVideo.removeAttribute('src');
    projectDetailVideo.load();

    if (video) {
        projectDetailImage.classList.add('hidden');

        projectDetailVideo.src = video;
        projectDetailVideo.classList.remove('hidden');
        projectDetailVideo.currentTime = 0;
        projectDetailVideo.play().catch(() => {
        });
    } else {
        projectDetailVideo.classList.add('hidden');

        projectDetailImage.src = image;
        projectDetailImage.alt = `${title} preview`;
        projectDetailImage.classList.remove('hidden');
    }

    projectDetailTags.innerHTML = tags
        .map((tag) => `<span class="px-2 py-1 bg-[#353535] text-[10px] font-mono border border-secondary-fixed/50">${tag}</span>`)
        .join('');

    projectDetailModal.classList.remove('hidden');
    projectDetailModal.classList.add('is-open');
    projectDetailModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    projectDetailX.focus();
}

function closeProjectDetail() {
    projectDetailVideo.pause();
    projectDetailVideo.removeAttribute('src');
    projectDetailVideo.load();
    projectDetailModal.classList.add('hidden');
    projectDetailModal.classList.remove('is-open');
    projectDetailModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

projectCards.forEach((card) => {
    card.addEventListener('click', () => openProjectDetail(card));

    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openProjectDetail(card);
        }
    });
});

projectDetailClose.addEventListener('click', closeProjectDetail);
projectDetailX.addEventListener('click', closeProjectDetail);
projectDetailBackdrop.addEventListener('click', closeProjectDetail);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && projectDetailModal.classList.contains('is-open')) {
        closeProjectDetail();
    }
});

const RESUME_PATH = '/assets/Ashutosh Bante\'s Resume.pdf';

// Download handler
const handleDownload = () => {
    const link = document.createElement('a');
    link.href = RESUME_PATH;
    link.download = 'Ashutosh Bante\'s Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// View handler
const handleView = () => {
    window.open(RESUME_PATH, '_blank', 'noopener,noreferrer');
};

// Bind buttons
document.querySelectorAll('.resume-download').forEach(btn => {
    btn.addEventListener('click', handleDownload);
});

document.querySelectorAll('.resume-view').forEach(btn => {
    btn.addEventListener('click', handleView);
});

const hint = document.getElementById('fs-hint');
const btn = document.getElementById('fs-btn');

if (!localStorage.getItem('fs_seen')) {
    hint.style.display = 'flex';
}

btn.addEventListener('click', async () => {
    await document.documentElement.requestFullscreen();
    localStorage.setItem('fs_seen', '1');
    hint.remove();
});

// auto-dismiss after 5s
setTimeout(() => hint?.remove(), 5000);