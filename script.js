// 1. Initialize Icons
lucide.createIcons();

// 2. Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

mobileBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.style.display === 'none' || mobileMenu.style.display === '';
    mobileMenu.style.display = isHidden ? 'flex' : 'none';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
    });
});

// 3. Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
});

// 4. Copy To Clipboard Functionality
function copyToClipboard() {
    const email = "pranavsharma.chouduru@gmail.com";
    const btn = document.getElementById("copyBtn");
    const originalContent = btn.innerHTML;

    // Visual Success Feedback Function
    const showSuccess = () => {
        btn.style.borderColor = "#14b8a6"; // Teal
        btn.style.color = "#14b8a6";
        btn.innerHTML = `<i data-lucide="check"></i> <span>Copied!</span>`;
        lucide.createIcons();
        
        setTimeout(() => {
            btn.style.borderColor = "";
            btn.style.color = "";
            btn.innerHTML = originalContent;
            lucide.createIcons();
        }, 2000);
    };

    // Attempt Copy
    if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(showSuccess).catch(() => fallbackCopy(email));
    } else {
        fallbackCopy(email);
    }

    // Fallback for local files or restricted browsers
    function fallbackCopy(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; 
        textArea.style.opacity = "0"; 
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showSuccess();
        } catch (err) {
            alert("Could not copy automatically. Please select the email manually!");
        }
        document.body.removeChild(textArea);
    }
}