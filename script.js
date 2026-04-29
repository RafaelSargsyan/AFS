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

    // ==================== CATEGORY CARDS ====================
    const items = document.querySelectorAll('.category-item');
    const categoriesSection = document.querySelector('.categories');
    const title = document.querySelector('.categories-title');

    // Store default title
    const defaultTitle = title ? title.textContent : '';

    // CATEGORY CLICK
    items.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all first
            items.forEach(i => i.classList.remove('active'));
            if (categoriesSection) categoriesSection.classList.remove('blur');

            // If already active → just reset title and stop
            if (isActive) {
                if (title) title.textContent = defaultTitle;
                return;
            }

            // Open clicked
            item.classList.add('active');
            if (categoriesSection) categoriesSection.classList.add('blur');

            // Change title to h3 content
            const h3 = item.querySelector('.category-top h3');
            if (title && h3) {
                title.textContent = h3.textContent;
            }

            const container = item.querySelector('.bottle-container');
            if (container && carousels.has(container)) {
                carousels.get(container).start();
            }
        });
    });


    // ==================== BACK BUTTON ====================
    const backButtons = document.querySelectorAll('.button-primary');

    backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 

            carousels.forEach(c => c.stop());

            // Close everything
            items.forEach(i => i.classList.remove('active'));
            if (categoriesSection) categoriesSection.classList.remove('blur');

            // Restore title
            if (title) title.textContent = defaultTitle;
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

    // ==================== CONFIG ====================
    const configs = {
        "container-bake": {
            path: "./img/icon/bake/",
            count: 6
        },
        "container-food": {
            path: "./img/icon/food/",
            count: 17
        },
        "container-bev": {
            path: "./img/icon/bev/",
            count: 14
        }
    };

    // ==================== GENERATE IMAGES ====================
    const containers = document.querySelectorAll('.bottle-container');

    containers.forEach(container => {
        const key = Object.keys(configs).find(cls => container.classList.contains(cls));
        if (!key) return;

        const { path, count } = configs[key];

        // Generate numbered images
        for (let i = 1; i <= count; i++) {
            const img = document.createElement('img');
            img.src = `${path}${i}.png`;
            img.className = "logo-big";
            img.loading = "lazy"; // better performance
            img.alt = "Alpha Food Service logo";

            container.appendChild(img);
        }

        // Add blank background image
        const blank = document.createElement('img');
        blank.src = `${path}blank.png`;
        blank.className = "logo-big blanc";
        container.appendChild(blank);
    });


    // ==================== PREMIUM CAROUSEL ====================
    const carousels = new Map(); // store controls

    containers.forEach(container => {
        const images = container.querySelectorAll('.logo-big:not(.blanc)');
        if (images.length === 0) return;

        let index = 0;
        let interval = null;

        const intervalTime = 1400;

        // INIT styles
        images.forEach(img => {
            img.style.opacity = 0;
            img.style.transition = "opacity 0.5s ease";
        });

        images[0].style.opacity = 1;

        function start() {
            if (interval) return; // prevent multiple intervals

            interval = setInterval(() => {
                const current = images[index];
                const nextIndex = (index + 1) % images.length;
                const next = images[nextIndex];

                current.style.opacity = 0;
                next.style.opacity = 1;

                index = nextIndex;
            }, intervalTime);
        }

        function stop() {
            clearInterval(interval);
            interval = null;
        }

        // store controls
        carousels.set(container, { start, stop });

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