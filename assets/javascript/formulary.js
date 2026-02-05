document.addEventListener('DOMContentLoaded', function () {
    emailjs.init('adiHx8AuDYrdHd2Ck'); 

    const submitButton = document.querySelector('.submit');
    const contactForm = document.querySelector('.btn_message');

    if (!contactForm.querySelector('form')) {
        const form = document.createElement('form');
        form.id = 'contact-form';
        contactForm.prepend(form);
    }

    submitButton.addEventListener('click', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const project = document.getElementById('project').value.trim();

        if (!name || !email || !phone || !subject || !project) {
            showError('Champs manquants');
            return;
        }

        if (!validateEmail(email)) {
            showError('Email invalide');
            return;
        }

        const templateParams = {
            name: name,
            email: email,
            phone: phone,
            subject: subject,
            project: project,

            date: new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            current_year: new Date().getFullYear()
        };

        submitButton.disabled = true;
        submitButton.classList.add('loading');
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi...';

        emailjs.send(
            'service_tdw86jz',    
            'template_xiuruui',   
            templateParams
        )
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);

                submitButton.classList.remove('loading');
                submitButton.classList.add('success');
                submitButton.innerHTML = '<i class="fa-solid fa-check"></i> Envoyé';

                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('subject').value = '';
                document.getElementById('project').value = '';

                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.classList.remove('success');
                    submitButton.innerHTML = '<i class="fa-regular fa-paper-plane material-icons"></i>Envoyer';
                }, 3000);
            })
            .catch(function (error) {
                console.error('FAILED...', error);

                submitButton.classList.remove('loading');
                submitButton.classList.add('error');
                submitButton.innerHTML = '<i class="fa-solid fa-exclamation"></i> Erreur d\'envoi';

                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.classList.remove('error');
                    submitButton.innerHTML = '<i class="fa-regular fa-paper-plane material-icons"></i>Envoyer';
                }, 3000);
            });
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(message) {
        submitButton.classList.add('error');
        submitButton.innerHTML = `<i class="fa-solid fa-exclamation"></i> ${message}`;

        setTimeout(() => {
            submitButton.classList.remove('error');
            submitButton.innerHTML = '<i class="fa-regular fa-paper-plane material-icons"></i>Envoyer';
        }, 2000);
    }
});