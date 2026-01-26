document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.querySelector('.submit');
    
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const project = document.getElementById('project').value.trim();
        
        if (!name || !email || !phone || !subject || !project) {
            submitButton.classList.add('error');
            submitButton.innerHTML = '<i class="fa-solid fa-exclamation"></i> Champs manquants';
            setTimeout(() => {
                submitButton.classList.remove('error');
                submitButton.innerHTML = '<i class="fa-regular fa-paper-plane material-icons"></i>Envoyer';
            }, 2000);
            return;
        }
        
        if (!email.includes('@')) {
            submitButton.classList.add('error');
            submitButton.innerHTML = '<i class="fa-solid fa-exclamation"></i> Email invalide';
            setTimeout(() => {
                submitButton.classList.remove('error');
                submitButton.innerHTML = '<i class="fa-regular fa-paper-plane material-icons"></i>Envoyer';
            }, 2000);
            return;
        }
        
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi...';
        
        const formData = {
            name: name,
            email: email,
            phone: phone,
            subject: subject,
            project: project
        };
        
        fetch('http://localhost:8082/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur serveur : ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            submitButton.classList.remove('loading');
            submitButton.classList.add('success');
            submitButton.innerHTML = '<i class="fa-solid fa-check"></i> Envoyé';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('subject').value = '';
            document.getElementById('project').value = '';
        })
        .catch(error => {
            console.error('Erreur :', error);
            submitButton.classList.remove('loading');
            submitButton.classList.add('error');
            submitButton.innerHTML = '<i class="fa-solid fa-exclamation"></i> Erreur d\'envoi';
        })
        .finally(() => {
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.classList.remove('success', 'error', 'loading');
                submitButton.innerHTML = '<i class="fa-regular fa-paper-plane material-icons"></i>Envoyer';
            }, 3000);
        });
    });
});