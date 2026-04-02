document.addEventListener('DOMContentLoaded', () => {
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
            { threshold: 0.35 }
        );

        statsObserver.observe(statsSection);
    }

    const experienceSection = document.getElementById('experience');
    const timelineContainer = document.getElementById('timeline-container');
    const dot = document.getElementById('scroll-dot');
    const timelineItems = Array.from(document.querySelectorAll('.timeline-item'));

    if (experienceSection && timelineContainer && dot && timelineItems.length >= 3) {
        let itemCenters = [];

        const measureItemCenters = () => {
            const trackRect = timelineContainer.getBoundingClientRect();
            const trackHeight = timelineContainer.offsetHeight;

            itemCenters = timelineItems.map((item) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.top + itemRect.height / 2 - trackRect.top;
            const dotMax = Math.max(0, trackHeight - dot.offsetHeight);

            return Math.max(0, Math.min(dotMax, itemCenter - dot.offsetHeight / 2));
        });
    };

    const setActiveItem = (index) => {
        const activeIndex = Math.max(0, Math.min(timelineItems.length - 1, index));

        timelineItems.forEach((item, i) => {
            item.classList.toggle('is-active', i === activeIndex);
        });

        if (itemCenters.length) {
            dot.style.top = `${itemCenters[activeIndex]}px`;
        }
    };

    const updateTimeline = () => {
        const rect = experienceSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionHeight = experienceSection.offsetHeight;

        const totalRange = viewportHeight + sectionHeight;
        const scrolled = viewportHeight - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / totalRange));

        // Use 3 zones, but align the dot to the real item centers
        let activeIndex = 0;
        if (progress >= 0.34 && progress < 0.67) {
            activeIndex = 1;
        } else if (progress >= 0.67) {
            activeIndex = 2;
        }

        measureItemCenters();
        setActiveItem(activeIndex);
    };

    measureItemCenters();
    setActiveItem(0);
    updateTimeline();

    window.addEventListener('scroll', updateTimeline, { passive: true });
    window.addEventListener('resize', updateTimeline);
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
            demoVideo.play().catch(() => {});
        };

        demoCard.addEventListener('mouseenter', showVideo);
        demoCard.addEventListener('mouseleave', showThumbnail);
        showThumbnail();
    }
});