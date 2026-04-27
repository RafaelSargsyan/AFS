// Wait for DOM to be fully loaded (best practice)
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

        // Special case for the last section (Contact)
        const lastSection = document.getElementById("contact");
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // If user is near the bottom → activate "Contact us"
        if (scrollPosition >= documentHeight - 100) {   // 100px threshold from bottom
            current = "contact";
        } 
        else {
            // Normal logic for other sections
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 180;   // Increased offset for better feel
                const sectionBottom = sectionTop + section.offsetHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    current = section.getAttribute("id");
                }
            });
        }

        // Update active class
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    });

    // // ==================== PROGRESS BAR ====================
    // const progressBar = document.getElementById("progressBar");

    // window.addEventListener("scroll", () => {
    //     const scrollTop = window.scrollY;
    //     const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    //     const progress = (scrollTop / docHeight) * 100;
    //     progressBar.style.width = `${progress}%`;
    // });

    // ==================== CATEGORY CARDS (Click to expand) ====================
    const items = document.querySelectorAll('.category-item');
    const categoriesSection = document.querySelector('.categories');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Reset all
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

            // Disable button while sending
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
                statusEl.textContent = "Something went wrong. Please try again.";
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = "SEND";
            });
        });
    }


    
    const scrollBtn = document.getElementById("scrollTopBtn");

    if (scrollBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add("show");
            } else {
                scrollBtn.classList.remove("show");
            }
        });

        // Smooth scroll to top when button is clicked
        scrollBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

});

$(document).ready(function(){
    $('#studiosSlider').slick({
        centerMode: true,
        centerPadding: "0px",
        slidesToShow: 3,
        infinite: true,
        speed: 700,
        arrows: true,
        dots: false,
        autoplay: true,
        autoplaySpeed: 3200,
        lazyLoad: "ondemand",
        cssEase: "ease-in-out",
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
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
});

$(document).ready(function(){
    $('#facilitiesSlider').slick({
        centerMode: true,
        centerPadding: '0px',
        lazyLoad: 'ondemand',
        slidesToShow: 3,
        infinite: true,
        autoplay: true,
        // initialSlide: 1,
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
            },
            {
                breakpoint: 600,
                settings: {
                    centerPadding: '20px',
                    slidesToShow: 1
                }
            }
        ]
    });
});

document.addEventListener('DOMContentLoaded', () => {
    
    const statItems = document.querySelectorAll('.stat-item');
    const counters = document.querySelectorAll('.counter');
    console.log('init');
    

    // Intersection Observer to detect when stats come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                // Remove 'hidden' and show the item
                entry.target.classList.remove('hidden');
                
                // Animate the counter inside this item
                const counter = entry.target.querySelector('.counter');
                if (counter) {
                    const targetNumber = parseInt(counter.textContent, 10);
                    animateCount(counter, targetNumber);
                }

                // Stop observing once triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,        
        rootMargin: "0px 0px -80px 0px"
    });

    // Observe all stat items
    statItems.forEach(item => {
        observer.observe(item);
    });

    // Smooth counter animation function
    function animateCount(element, target) {
        let current = 0;
        const duration = 1000; // 2 seconds
        const increment = target / (duration / 16); // ~60fps

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