import './style.css'

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Mobile menu toggle with accessibility
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    const toggleMenu = (isOpen) => {
        if (!mobileMenuBtn || !nav) return;
        const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !nav.classList.contains('active');
        nav.classList.toggle('active', shouldOpen);
        mobileMenuBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            if (shouldOpen) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    };

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => toggleMenu());
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                toggleMenu(false);
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect with passive listener
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // Interactive Quote Form Handler
    const quoteForm = document.getElementById('quote-form');
    const btnWhatsapp = document.getElementById('btn-whatsapp-quote');
    const feedbackEl = document.getElementById('form-feedback');

    if (quoteForm) {
        const getFormData = () => {
            const name = document.getElementById('quote-name')?.value.trim() || '';
            const phone = document.getElementById('quote-phone')?.value.trim() || '';
            const email = document.getElementById('quote-email')?.value.trim() || '';
            const service = document.getElementById('quote-service')?.value || '';
            const message = document.getElementById('quote-message')?.value.trim() || '';
            return { name, phone, email, service, message };
        };

        const validateForm = () => {
            let isValid = true;
            const { name, phone, service } = getFormData();

            // Clear previous errors
            document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));
            
            if (!name) {
                const group = document.getElementById('quote-name')?.closest('.form-group');
                const err = document.getElementById('error-name');
                if (group) group.classList.add('has-error');
                if (err) err.textContent = 'Por favor ingrese su nombre.';
                isValid = false;
            }
            if (!phone) {
                const group = document.getElementById('quote-phone')?.closest('.form-group');
                const err = document.getElementById('error-phone');
                if (group) group.classList.add('has-error');
                if (err) err.textContent = 'Por favor ingrese su teléfono o celular.';
                isValid = false;
            }
            if (!service) {
                const group = document.getElementById('quote-service')?.closest('.form-group');
                const err = document.getElementById('error-service');
                if (group) group.classList.add('has-error');
                if (err) err.textContent = 'Por favor seleccione el tipo de avalúo.';
                isValid = false;
            }
            return isValid;
        };

        const showFeedback = (msg, type = 'success') => {
            if (!feedbackEl) return;
            feedbackEl.textContent = msg;
            feedbackEl.className = `form-feedback ${type}`;
            feedbackEl.style.display = 'block';
            setTimeout(() => {
                feedbackEl.style.display = 'none';
            }, 6000);
        };

        // WhatsApp Action
        if (btnWhatsapp) {
            btnWhatsapp.addEventListener('click', (e) => {
                e.preventDefault();
                if (!validateForm()) {
                    showFeedback('Por favor complete los campos obligatorios marcados (*).', 'error');
                    return;
                }
                const data = getFormData();
                let text = `*Solicitud de Cotización - Avalúos BCC*\n\n`;
                text += `👤 *Nombre:* ${data.name}\n`;
                text += `📱 *Teléfono:* ${data.phone}\n`;
                if (data.email) text += `✉️ *Email:* ${data.email}\n`;
                text += `🏢 *Servicio:* ${data.service}\n`;
                if (data.message) text += `📝 *Detalles/Ubicación:* ${data.message}\n`;

                const url = `https://wa.me/573112091140?text=${encodeURIComponent(text)}`;
                showFeedback('Conectando con WhatsApp para enviar su cotización...', 'success');
                window.open(url, '_blank', 'noopener,noreferrer');
            });
        }

        // Email Action (Form submit)
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validateForm()) {
                showFeedback('Por favor complete los campos obligatorios marcados (*).', 'error');
                return;
            }
            const data = getFormData();
            const subject = encodeURIComponent(`Solicitud de Cotización: ${data.service} - ${data.name}`);
            let body = `Estimado equipo de Avalúos BCC,\n\n`;
            body += `Deseo solicitar una cotización con los siguientes datos:\n\n`;
            body += `Nombre: ${data.name}\n`;
            body += `Teléfono: ${data.phone}\n`;
            if (data.email) body += `Email: ${data.email}\n`;
            body += `Tipo de avalúo requerido: ${data.service}\n`;
            if (data.message) body += `Detalles o ubicación del inmueble:\n${data.message}\n\n`;
            body += `Quedo atento a su respuesta.\n`;

            showFeedback('Abriendo su cliente de correo para enviar la solicitud...', 'success');
            window.location.href = `mailto:contacto@avaluosbcc.com.co?subject=${subject}&body=${encodeURIComponent(body)}`;
        });
    }
});

