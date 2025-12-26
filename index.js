const POCKETBASE_URL = 'https://wearing-extension-strengthening-cancellation.trycloudflare.com';

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker registered', reg))
        .catch(err => console.log('Service Worker not registered', err));
}

// Fetch and display services from Database
async function loadServices() {
    const servicesContainer = document.getElementById('services-container');
    try {
        const response = await fetch(`${POCKETBASE_URL}/api/collections/services/records?sort=created`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            servicesContainer.innerHTML = '';
            data.items.forEach(service => {
                const imgUrl = service.image
                    ? `${POCKETBASE_URL}/api/files/${service.collectionId}/${service.id}/${service.image}`
                    : 'assets/logo.png'; // Fallback

                const serviceHtml = `
                    <div class="card glass">
                        <div class="card-img">
                            <img src="${imgUrl}" alt="${service.title}">
                        </div>
                        <h3>${service.title}</h3>
                        <p>${service.description}</p>
                    </div>
                `;
                servicesContainer.insertAdjacentHTML('beforeend', serviceHtml);
            });
            // Re-apply observer for new items
            document.querySelectorAll('.card').forEach(el => observer.observe(el));
        }
    } catch (error) {
        console.log('Error loading services:', error);
    }
}

// Fetch and display articles from Database
async function loadArticles() {
    const articlesList = document.querySelector('.articles-list');
    try {
        const response = await fetch(`${POCKETBASE_URL}/api/collections/articles/records?sort=-created`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            articlesList.innerHTML = ''; // Clear static ones
            data.items.forEach(article => {
                const date = new Date(article.created).toLocaleDateString('fa-IR');
                const articleHtml = `
                    <article class="article-item glass">
                        <div>
                            <h4>${article.title}</h4>
                            <span class="date">${date} | ${article.category || 'تکنولوژی'}</span>
                        </div>
                        <a href="#" class="read-more">مطالعه مقاله <i class="fas fa-arrow-left"></i></a>
                    </article>
                `;
                articlesList.insertAdjacentHTML('beforeend', articleHtml);
            });
            // Re-apply observer for new dynamic items
            document.querySelectorAll('.article-item').forEach(el => observer.observe(el));
        }
    } catch (error) {
        console.log('Error loading articles:', error);
    }
}

loadArticles();
loadServices();

// Smooth scroll for nav links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Real-time contact form handler with Database
const contactForm = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            name: contactForm.querySelector('input[type="text"]').value,
            email: contactForm.querySelector('input[type="email"]').value,
            text: contactForm.querySelector('textarea').value
        };

        formMsg.innerHTML = 'در حال ارسال پیام به دیتابیس...';
        formMsg.style.color = 'var(--primary-color)';

        try {
            const response = await fetch(`${POCKETBASE_URL}/api/collections/messages/records`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                formMsg.innerHTML = 'پیام شما در دیتابیس ثبت شد. به زودی با شما تماس می‌گیرم.';
                contactForm.reset();
            } else {
                formMsg.innerHTML = 'خطا در ثبت پیام. لطفا دوباره تلاش کنید.';
            }
        } catch (error) {
            formMsg.innerHTML = 'متاسفانه ارتباط با سرور برقرار نشد.';
        }
    });
}

// Reveal animations on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .article-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = '0.8s ease-out';
    observer.observe(el);
});
