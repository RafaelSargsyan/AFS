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

    items.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            items.forEach(i => i.classList.remove('active'));
            if (categoriesSection) categoriesSection.classList.remove('blur');

            if (!isActive) {
                item.classList.add('active');
                if (categoriesSection) categoriesSection.classList.add('blur');
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