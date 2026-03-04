document.addEventListener('DOMContentLoaded', function() {

    // ===== PARTICLE CANVAS =====
    var canvas = document.getElementById('particleCanvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var particles = [];
        var mouse = { x: 0, y: 0 };

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
        }

        for (var i = 0; i < 80; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function(p, idx) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, ' + p.opacity + ')';
                ctx.fill();

                // Connect nearby particles
                for (var j = idx + 1; j < particles.length; j++) {
                    var dx = p.x - particles[j].x;
                    var dy = p.y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(99, 102, 241, ' + (0.06 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ===== CURSOR GLOW =====
    var glow = document.getElementById('cursorGlow');
    if (glow && window.innerWidth > 768) {
        document.addEventListener('mousemove', function(e) {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // ===== TYPEWRITER =====
    var tw = document.getElementById('typewriter');
    if (tw) {
        var words = ['Grow Your Business', 'Convert Visitors', 'Rank on Google', 'Work Offline', 'Look Professional'];
        var wordIdx = 0, charIdx = 0, deleting = false, pause = 0;

        function type() {
            var current = words[wordIdx];
            if (pause > 0) { pause--; requestAnimationFrame(type); return; }

            if (!deleting) {
                tw.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    pause = 120;
                    deleting = true;
                }
            } else {
                tw.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    deleting = false;
                    wordIdx = (wordIdx + 1) % words.length;
                }
            }
            setTimeout(function() { requestAnimationFrame(type); }, deleting ? 30 : 60);
        }
        setTimeout(type, 800);
    }

    // ===== SCROLL REVEAL =====
    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(function(el) {
        revealObserver.observe(el);
    });

    // ===== ANIMATED COUNTERS =====
    var counted = false;
    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !counted) {
                counted = true;
                document.querySelectorAll('.stat-value[data-count]').forEach(function(num) {
                    var target = parseInt(num.getAttribute('data-count'));
                    var duration = 1800;
                    var startTime = null;
                    function animate(time) {
                        if (!startTime) startTime = time;
                        var progress = Math.min((time - startTime) / duration, 1);
                        var eased = 1 - Math.pow(1 - progress, 4);
                        num.textContent = Math.floor(eased * target);
                        if (progress < 1) requestAnimationFrame(animate);
                        else num.textContent = target;
                    }
                    requestAnimationFrame(animate);
                });
            }
        });
    }, { threshold: 0.5 });

    var statsSection = document.querySelector('.hero-stats');
    if (statsSection) counterObserver.observe(statsSection);

    // ===== TILT CARDS =====
    document.querySelectorAll('.tilt-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / centerY * -4;
            var rotateY = (x - centerX) / centerX * 4;

            card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });

    // ===== NAV SCROLL =====
    var nav = document.getElementById('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    // ===== MOBILE MENU =====
    var toggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');
    if (toggle && navLinks) {
        toggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ===== PARALLAX =====
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        document.querySelectorAll('[data-parallax]').forEach(function(el) {
            var speed = parseFloat(el.getAttribute('data-parallax'));
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                var offset = (rect.top - window.innerHeight / 2) * speed;
                el.style.transform = 'translateY(' + offset + 'px)';
            }
        });
    });

    // ===== MAGNETIC BUTTONS =====
    document.querySelectorAll('[data-magnetic]').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = 'translate(' + x * 0.2 + 'px, ' + y * 0.2 + 'px)';
        });
        btn.addEventListener('mouseleave', function() {
            btn.style.transform = '';
        });
    });

    // ===== RIPPLE ON ALL BUTTONS =====
    document.querySelectorAll('.btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var rect = btn.getBoundingClientRect();
            var ripple = document.createElement('span');
            ripple.className = 'ripple';
            var size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            btn.appendChild(ripple);
            setTimeout(function() { ripple.remove(); }, 600);
        });
    });

    // ===== SPOTLIGHT ON DARK SECTIONS =====
    document.querySelectorAll('.has-grid-bg').forEach(function(sec) {
        sec.addEventListener('mousemove', function(e) {
            var rect = sec.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            sec.style.setProperty('--spot-x', x + 'px');
            sec.style.setProperty('--spot-y', y + 'px');
        });
    });

    // ===== LOADING SCREEN =====
    var loader = document.getElementById('loader');
    if (loader) {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 1800);
    }

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.faq-q').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var item = btn.parentElement;
            var isActive = item.classList.contains('active');
            // Close all first
            document.querySelectorAll('.faq-item').forEach(function(el) {
                el.classList.remove('active');
            });
            // Toggle clicked one
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===== PRICE CALCULATOR =====
    var calcPages = document.getElementById('calcPages');
    var calcPagesVal = document.getElementById('calcPagesVal');
    var calcPrice = document.getElementById('calcPrice');
    if (calcPages && calcPrice) {
        function updateCalc() {
            var pages = parseInt(calcPages.value);
            calcPagesVal.textContent = pages;
            // Base: P2,000 per page, min P5,000
            var base = Math.max(pages * 2000, 5000);
            // Add feature prices
            document.querySelectorAll('.calc-check input[type="checkbox"]').forEach(function(cb) {
                if (cb.checked) {
                    base += parseInt(cb.getAttribute('data-price')) || 0;
                }
            });
            calcPrice.textContent = 'P' + base.toLocaleString();
        }
        calcPages.addEventListener('input', updateCalc);
        document.querySelectorAll('.calc-check input[type="checkbox"]').forEach(function(cb) {
            cb.addEventListener('change', updateCalc);
        });
        updateCalc();
    }

    // ===== DARK/LIGHT THEME TOGGLE =====
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Check saved preference
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
        }
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        });
    }

    // ===== CONTACT FORM =====
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var originalHTML = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="btn-spinner"></span><span>Sending...</span>';
            status.className = '';
            status.innerHTML = '';

            fetch(form.action, { method: 'POST', body: new FormData(form) })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    status.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Message sent! We\'ll reply within 24 hours.';
                    status.className = 'form-status-msg form-success';
                    form.reset();
                    setTimeout(function() { status.classList.add('form-status-fade'); }, 5000);
                    setTimeout(function() { status.className = ''; status.innerHTML = ''; }, 5800);
                } else {
                    status.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Something went wrong. Please try again.';
                    status.className = 'form-status-msg form-error';
                }
            })
            .catch(function() {
                status.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Network error. Check your connection.';
                status.className = 'form-status-msg form-error';
            })
            .finally(function() {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            });
        });
    }
});
