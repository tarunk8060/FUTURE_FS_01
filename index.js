// Initialize Lucide Icons
lucide.createIcons();

// Smooth Reveal Animation on Scroll
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Once revealed, no need to observe again for a one-time entrance feel
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));



// Smooth scroll for nav links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

/**
 * Simple Active Navigation Class
 */
document.addEventListener('DOMContentLoaded', () => {
    const navList = document.querySelector('nav:not(#mobileMenu nav) > ul');
    if (!navList) return;

    // Capture desktop links specifically
    const desktopLinks = navList.querySelectorAll('a');

    // Identify the current page accurately
    const currentPath = window.location.pathname.split('/').pop() || 'opening.html';
    
    let activeLink = null;
    desktopLinks.forEach(link => {
        // Set the text into an attribute so CSS ::before can render it
        link.setAttribute('data-text', link.innerText);

        const linkHref = link.getAttribute('href');
        // Extract base filename (e.g., 'restof.html' from 'restof.html#services')
        const linkBase = linkHref.split('#')[0];
        
        // Match if base filename matches or it's a home-page match
        if (linkBase === currentPath || 
           (currentPath === 'opening.html' && linkBase === 'opening.html')) {
            link.classList.add('active');
            activeLink = link;
        }
    });

    // Default to the first link ('Home') if we are on the landing page
    if (!activeLink && (currentPath === 'opening.html' || currentPath === '')) {
        activeLink = desktopLinks[0];
        activeLink.classList.add('active');
    }
});



// Simple Hover Effect for Cards to show "Life"
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // This could be used for advanced light-follow effects
        // For now, it just shows interactivity is enabled
    });
});

// Intro Animation Logic
document.addEventListener("DOMContentLoaded", () => {
    const introScreen = document.getElementById("introScreen");
    const introText = document.getElementById("introText");
    const introLogo = document.getElementById("introLogo");

    if (introText && introScreen && introLogo) {
        // Get the text and split it into words
        const text = introText.innerText;
        introText.innerHTML = ''; // Clear original text

        // Wrap each letter in a span with a staggered animation delay
        let letterDelay = 0;
        text.split(' ').forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'intro-word';
            wordSpan.style.marginRight = '0.4em'; // Space between words

            word.split('').forEach((letter) => {
                const letterSpan = document.createElement('span');
                letterSpan.innerText = letter;
                // Add staggered delay to each letter dropping in (this engages when the text displays)
                letterSpan.style.animationDelay = `${letterDelay}s`;
                wordSpan.appendChild(letterSpan);
                letterDelay += 0.05; // 0.05s delay per letter
            });

            introText.appendChild(wordSpan);
        });

        // Step 1: Wait for 'T' to drop and bounce (1.5 seconds)
        setTimeout(() => {
            // Step 2: Fade the 'T' out
            introLogo.classList.add('fade-out');

            // Wait 0.5s for the fade-out to complete
            setTimeout(() => {
                introLogo.style.display = 'none'; // hide it entirely
                
                // Step 3: Reveal the text, which triggers the letter dropIns
                introText.style.display = 'flex';
                introText.style.opacity = '1';

                // Step 4: After the letters finish dropping (e.g. 2.5s), slide the screen up
                setTimeout(() => {
                    introScreen.classList.add('slide-up');
                    
                    // After the animation finishes, hide it completely to prevent blocking clicks
                    setTimeout(() => {
                        introScreen.style.display = 'none';
                    }, 1000);

                    // Trigger hero content animations after the wall begins sliding up
                    const heroContent = document.querySelector('.hero-content');
                    if (heroContent) {
                        heroContent.classList.add('animate-in');
                    }
                }, 2500);


            }, 500);
        }, 1500);
    }
});

/**
 * Magnetic Shard Burst Effect
 */
window.addEventListener('mousedown', function(e) {
    const container = document.createElement('div');
    container.className = 'shard-container';
    container.style.left = e.clientX + 'px';
    container.style.top = e.clientY + 'px';

    // Add a subtle expansion ring
    const ring = document.createElement('div');
    ring.className = 'shard-ring';
    container.appendChild(ring);

    // Create 6 shards flying at random angles
    for(let i = 0; i < 6; i++) {
        const shard = document.createElement('div');
        shard.className = 'shard';
        // Random rotation between 0 and 360 degrees
        const rotation = Math.floor(Math.random() * 360);
        shard.style.setProperty('--rotation', `${rotation}deg`);
        shard.style.animation = `shard-fly 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
        container.appendChild(shard);
    }

    document.body.appendChild(container);

    // Remove from DOM after animation completes
    setTimeout(() => {
        container.remove();
    }, 600);
});


/**
 * Staggered Mobile Menu Logic
 * Handles the layered reveal and item animations
 */
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.menu-content a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Prevent body scrolling when menu is open for a focused UI
            document.body.style.overflow = isActive ? 'hidden' : 'auto';
        });

        // Close menu when a link is clicked (especially for anchor links)
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Add/remove 'nav-scrolled' class on scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (nav) { // Ensure nav element exists
            if (window.scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        }
    });
});
