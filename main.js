
/**
 * Engenehiro de Softwere - Script Principal
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Variáveis
    const header = document.getElementById('header');
    const preloader = document.getElementById('preloader');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link[data-scroll]');
    const backToTop = document.getElementById('backToTop');
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieSettings = document.getElementById('cookieSettings');
    const currentYearEl = document.getElementById('currentYear');
    
    // Preloader
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            setTimeout(function() {
                preloader.style.display = 'none';
                
                // Após o preloader, mostrar o aviso de cookies
                setTimeout(function() {
                    if (!localStorage.getItem('cookieConsent')) {
                        cookieConsent.classList.add('show');
                    }
                }, 2000);
                
                // Iniciar animações após o preloader
                initScrollAnimations();
                animateStats();
            }, 500);
        }, 1000);
    });
    
    // Navegação
    navToggle.addEventListener('click', function() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('show');
        document.body.classList.toggle('menu-open');
    });
    
    // Fechamento do menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Scroll suave
    document.querySelectorAll('a[data-scroll]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header com efeito ao rolar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Botão Voltar ao Topo
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Ativar link do menu baseado na seção atual
        activateMenuAtCurrentSection();
    });
    
    // Ativar link do menu baseado na seção atual
    function activateMenuAtCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + header.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                document.querySelectorAll('.nav__link').forEach(link => {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('nav__link--active');
                    }
                });
            }
        });
    }
    
    // Cookies
    cookieAccept.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'true');
        cookieConsent.classList.remove('show');
    });
    
    cookieSettings.addEventListener('click', function() {
        // Aqui você pode abrir uma modal com configurações de cookies
        // Por enquanto apenas aceita todos os cookies como exemplo
        localStorage.setItem('cookieConsent', 'true');
        cookieConsent.classList.remove('show');
    });
    
    // Ano atual no footer
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    
    // Animações ao rolar
    function initScrollAnimations() {
        // Verifique se AOS já está incluído, caso contrário, as animações serão simples
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        } else {
            // Animações simples sem biblioteca AOS
            const animatedElements = document.querySelectorAll('[data-aos]');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const animationType = el.getAttribute('data-aos');
                        
                        // Adicionar classe baseada no tipo de animação
                        if (animationType === 'fade-up') {
                            el.classList.add('slide-up');
                        } else if (animationType === 'fade-left' || animationType === 'fade-right') {
                            el.classList.add('fade-in');
                        } else {
                            el.classList.add('fade-in');
                        }
                        
                        // Remover da observação após animar
                        observer.unobserve(el);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            animatedElements.forEach(el => {
                observer.observe(el);
            });
        }
    }
    
    // Animação para os números de estatísticas
    function animateStats() {
        const stats = document.querySelectorAll('.stat-item__number');
        
        const observerStats = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const endValue = parseInt(el.getAttribute('data-count'), 10);
                    
                    animateNumber(el, 0, endValue, 2000);
                    observerStats.unobserve(el);
                }
            });
        }, {
            threshold: 0.5
        });
        
        stats.forEach(stat => {
            observerStats.observe(stat);
        });
    }
    
    // Função auxiliar para animar números
    function animateNumber(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Validação do formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const formValid = validateForm();
            if (!formValid) {
                e.preventDefault();
            }
        });
        
        function validateForm() {
            let valid = true;
            
            // Validar campos obrigatórios
            const requiredFields = contactForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    showError(field, 'Este campo é obrigatório');
                    valid = false;
                } else {
                    removeError(field);
                    
                    // Validações específicas
                    if (field.id === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(field.value)) {
                            showError(field, 'Email inválido');
                            valid = false;
                        }
                    }
                    
                    if (field.id === 'phone') {
                        const phoneRegex = /^(\d{10,11}|\(\d{2}\)\s?\d{4,5}-?\d{4})$/;
                        if (!phoneRegex.test(field.value.replace(/\D/g, ''))) {
                            showError(field, 'Telefone inválido');
                            valid = false;
                        }
                    }
                }
            });
            
            return valid;
        }
        
        function showError(field, message) {
            removeError(field);
            
            const errorEl = document.createElement('div');
            errorEl.className = 'form__error';
            errorEl.textContent = message;
            
            field.classList.add('form__input--error');
            field.parentNode.appendChild(errorEl);
        }
        
        function removeError(field) {
            const errorEl = field.parentNode.querySelector('.form__error');
            if (errorEl) {
                errorEl.remove();
            }
            field.classList.remove('form__input--error');
        }
        
        // Máscara para telefone
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) {
                    value = value.substring(0, 11);
                }
                
                if (value.length > 10) {
                    e.target.value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                } else if (value.length > 6) {
                    e.target.value = value.replace(/^(\d{2})(\d{4})(\d+)$/, '($1) $2-$3');
                } else if (value.length > 2) {
                    e.target.value = value.replace(/^(\d{2})(\d+)$/, '($1) $2');
                } else {
                    e.target.value = value;
                }
            });
        }
    }
});



