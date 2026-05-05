// ==================== MAIN DOM READY ====================
document.addEventListener("DOMContentLoaded", () => {

    // ==================== HEADER SCROLL ====================
    const header = document.getElementById("header");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // ==================== ANIMATION OBSERVER ====================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");

                // 🔥 FIX: recalc slick when visible
                if (entry.target.querySelector('#studiosSlider')) {
                    $('#studiosSlider').slick('setPosition');
                }

                if (entry.target.querySelector('#facilitiesSlider')) {
                    $('#facilitiesSlider').slick('setPosition');
                }
            }
        });
    }, {
        threshold: 0.2
    });

    document.querySelectorAll(".hidden").forEach(el => {
        observer.observe(el);
    });

    // ==================== ACTIVE NAV LINK ====================
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav a");

    window.addEventListener("scroll", () => {
        let current = "";

        const lastSection = document.getElementById("contact");
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= documentHeight - 100) {
            current = "contact";
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 180;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    current = section.getAttribute("id");
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    });

        // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const statusEl = document.getElementById("form-status");
            const submitBtn = this.querySelector("button");

            submitBtn.disabled = true;
            submitBtn.textContent = "SENDING...";

            const formData = new FormData(this);

            fetch("send.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    statusEl.style.color = "green";
                    statusEl.textContent = data.message;
                    contactForm.reset();
                } else {
                    statusEl.style.color = "red";
                    statusEl.textContent = data.message;
                }
            })
            .catch(() => {
                statusEl.style.color = "red";
                statusEl.textContent = "Something went wrong.";
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = "SEND";
            });
        });
    }

    // ==================== SCROLL TO TOP ====================
    const scrollBtn = document.getElementById("scrollTopBtn");

    if (scrollBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add("show");
            } else {
                scrollBtn.classList.remove("show");
            }
        });

        scrollBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

// ==================== CATEGORY CARDS ====================
const items = document.querySelectorAll('.category-item');
const categoriesSection = document.querySelector('.categories');
const title = document.querySelector('.categories-title');

// Store default title
const defaultTitle = title ? title.textContent : '';

// CATEGORY CLICK
items.forEach(item => {
    const main = item.querySelector('.category-main');
    if (!main) return;

    item.dataset.paused = "false";

    main.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        const container = item.querySelector('.bottle-container');
        const controls = carousels.get(container);

        // ==================== TOGGLE (SAME ITEM) ====================
        if (isActive) {
            if (!controls) return;

            if (item.dataset.paused === "false") {
                controls.stop();
                item.dataset.paused = "true";
            } else {
                controls.start();
                item.dataset.paused = "false";
            }

            return;
        }

        // ==================== SWITCH CATEGORY ====================

        // stop all
        carousels.forEach(c => c.stop());

        // close all
        items.forEach(i => {
            i.classList.remove('active');
            i.dataset.paused = "false";
        });

        if (categoriesSection) categoriesSection.classList.remove('blur');

        // open clicked
        item.classList.add('active');
        if (categoriesSection) categoriesSection.classList.add('blur');

        item.dataset.paused = "false";

        // change title
        const h3 = item.querySelector('.category-top h3');
        if (title && h3) {
            title.textContent = h3.textContent;
        }

        // start animation
        if (container && controls) {
            controls.start();
        }
    });
});


// ==================== BACK BUTTON ====================
const backButtons = document.querySelectorAll('.button-primary');

backButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        carousels.forEach(c => c.stop());

        items.forEach(i => {
            i.classList.remove('active');
            i.dataset.paused = "false";
        });

        if (categoriesSection) categoriesSection.classList.remove('blur');

        if (title) title.textContent = defaultTitle;
    });
});


// ==================== CONFIG ====================
const configs = {
    "container-bake": { path: "./img/icon/bake/", count: 23 },
    "container-food": { path: "./img/icon/food/", count: 28 },
    "container-bev": { path: "./img/icon/bev/", count: 30 }
};


// ==================== GENERATE IMAGES ====================
const containers = document.querySelectorAll('.bottle-container');

containers.forEach(container => {
    const key = Object.keys(configs).find(cls => container.classList.contains(cls));
    if (!key) return;

    const { path, count } = configs[key];

    for (let i = 1; i <= count; i++) {
        const img = document.createElement('img');
        img.src = `${path}${i}.png`;
        img.className = "logo-big";
        img.loading = "lazy";
        img.alt = "Alpha Food Service logo";

        container.appendChild(img);
    }

    const blank = document.createElement('img');
    blank.src = `${path}blank.png`;
    blank.className = "logo-big blanc";
    container.appendChild(blank);

    const overlay = document.createElement('div');
    overlay.className = 'carousel-overlay';
    overlay.innerHTML = '▶';

    container.appendChild(overlay);
});


// ==================== PREMIUM CAROUSEL ====================
const carousels = new Map();

containers.forEach(container => {
    const images = container.querySelectorAll('.logo-big:not(.blanc)');
    if (images.length === 0) return;

    let index = 0;
    let interval = null;
    const intervalTime = 1400;

    images.forEach(img => {
        img.style.opacity = 0;
        img.style.transition = "opacity 0.5s ease";
    });

    images[0].style.opacity = 1;

    function start() {
        if (interval) return;

        function nextFrame() {
            const current = images[index];
            const nextIndex = (index + 1) % images.length;
            const next = images[nextIndex];

            current.style.opacity = 0;
            next.style.opacity = 1;

            index = nextIndex;
        }

        nextFrame();

        interval = setInterval(nextFrame, intervalTime);

        container.classList.remove('paused');
    }

    function stop() {
        clearInterval(interval);
        interval = null;

        container.classList.add('paused');
    }

    carousels.set(container, { start, stop });
});


// ==================== CONTAINER CLICK (SYNCED TOGGLE) ====================
containers.forEach(container => {
    container.addEventListener('click', (e) => {
        e.stopPropagation();

        const controls = carousels.get(container);
        if (!controls) return;

        const item = container.closest('.category-item');
        if (!item) return;

        if (item.dataset.paused === "false") {
            controls.stop();
            item.dataset.paused = "true";
        } else {
            controls.start();
            item.dataset.paused = "false";
        }
    });
});
    // ==================== MOBILE MENU ====================
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // ==================== SLICK INIT (CLEAN & SAFE) ====================
    if (typeof $ !== "undefined" && $.fn.slick) {

        $('#studiosSlider').slick({
            centerMode: true,
            centerPadding: '0px',
            lazyLoad: 'ondemand',
            slidesToShow: 3,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 3400,
            speed: 800,
            arrows: true,
            dots: false,
            responsive: [
                {
                    breakpoint: 1100,
                    settings: {
                        centerPadding: '50px',
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });

        $('#facilitiesSlider').slick({
            centerMode: true,
            centerPadding: '0px',
            lazyLoad: 'ondemand',
            slidesToShow: 3,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 3400,
            speed: 800,
            arrows: true,
            dots: false,
            responsive: [
                {
                    breakpoint: 1100,
                    settings: {
                        centerPadding: '50px',
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        centerPadding: '40px',
                        slidesToShow: 1
                    }
                }
            ]
        });
    }

    // ==================== COUNTERS ====================
    const statItems = document.querySelectorAll('.stat-item');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                entry.target.classList.remove('hidden');

                const counter = entry.target.querySelector('.counter');
                if (counter) {
                    const targetNumber = parseInt(counter.textContent, 10);
                    animateCount(counter, targetNumber);
                }

                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: "0px 0px -80px 0px"
    });

    statItems.forEach(item => {
        counterObserver.observe(item);
    });

    function animateCount(element, target) {
        let current = 0;
        const duration = 1000;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

});