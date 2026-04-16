document.addEventListener('DOMContentLoaded', function() {

    // ===== TYPEWRITER =====
    var tw = document.getElementById('typewriter');
    if (tw) {
        var words = ['Grow Your Business', 'Convert Visitors', 'Rank on Google', 'Work on Any Device', 'Look Professional'];
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
        setTimeout(type, 500);
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
                    var duration = 1500;
                    var startTime = null;
                    function animate(time) {
                        if (!startTime) startTime = time;
                        var progress = Math.min((time - startTime) / duration, 1);
                        var eased = 1 - Math.pow(1 - progress, 3);
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

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.faq-q').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var item = btn.parentElement;
            var isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(function(el) {
                el.classList.remove('active');
            });
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
            var base = Math.max(pages * 2000, 5000);
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
