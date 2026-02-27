/**
 * ============================================
 * WEB ATELIER (UDIT) - Student Project Template
 * ============================================
 * Main JavaScript: Scrollytelling Functionality
 * ============================================
 * PEDAGOGICAL NOTE: This file implements
 * scrollytelling with Intersection Observer API.
 * Progressive enhancement: site works without JS.
 * ============================================
 */

// ===== INTERSECTION OBSERVER FOR SCROLL-TRIGGERED ANIMATIONS =====
// PEDAGOGICAL NOTE: Modern, performant way to detect when elements
// enter viewport. Better than scroll event listeners.

const observerOptions = {
	threshold: 0.2, // Trigger when 20% of element is visible
	rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters viewport
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			// Element is visible, add 'visible' class to trigger CSS animations
			entry.target.classList.add('visible');

			// PEDAGOGICAL NOTE: Optional - stop observing after animation
			// Uncomment below if you want one-time animations only
			// observer.unobserve(entry.target);
		}
	});
}, observerOptions);

// Observe all sections with data-observe attribute
// PEDAGOGICAL NOTE: data-* attributes are semantic way to mark elements for JS
document.querySelectorAll('[data-observe]').forEach((section) => {
	observer.observe(section);
});

// ===== SCROLL PROGRESS INDICATOR =====
// PEDAGOGICAL NOTE: Shows user how far they've scrolled through the page

function updateScrollProgress() {
	const windowHeight = window.innerHeight;
	const documentHeight = document.documentElement.scrollHeight;
	const scrollTop = window.scrollY;

	// Calculate percentage scrolled
	const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

	// Update progress display
	const progressElement = document.getElementById('progress');
	if (progressElement) {
		progressElement.textContent = Math.round(scrollPercent);
	}
}

// Listen for scroll events (throttled by browser's requestAnimationFrame)
window.addEventListener('scroll', updateScrollProgress);

// Initialize on page load
updateScrollProgress();

// ===== SCROLL TO TOP FUNCTION =====
// PEDAGOGICAL NOTE: Smooth scroll to top for better UX

function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}

// Make function available globally for onclick in HTML
// PEDAGOGICAL NOTE: In production, prefer addEventListener over onclick
window.scrollToTop = scrollToTop;

// ===== BACK TO TOP BUTTON VISIBILITY =====
// Show button once user scrolls past viewport height
const backToTopBtn = document.getElementById('back-to-top');
function toggleBackToTop() {
	if (!backToTopBtn) return;
	if (window.scrollY > window.innerHeight * 0.5) {
		backToTopBtn.classList.add('show');
	} else {
		backToTopBtn.classList.remove('show');
	}
}
window.addEventListener('scroll', toggleBackToTop);
// initialize state
toggleBackToTop();

// ===== SMOOTH SCROLL BEHAVIOR =====
// PEDAGOGICAL NOTE: CSS scroll-behavior is simpler, but this works in all browsers

document.documentElement.style.scrollBehavior = 'smooth';

// ===== REDUCED MOTION PREFERENCE =====
// PEDAGOGICAL NOTE: Respect user's accessibility preferences
// If user prefers reduced motion, disable scroll animations

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
	// Disable smooth scrolling
	document.documentElement.style.scrollBehavior = 'auto';

	// Optionally: add a class to body to disable CSS animations
	document.body.classList.add('reduce-motion');

	console.log('Reduced motion preference detected - animations disabled');
}

// ===== CONSOLE LOG FOR DEBUGGING =====
// PEDAGOGICAL NOTE: Helpful during development, remove in production

console.log('✅ Scrollytelling initialized');
console.log(`📊 Observing ${document.querySelectorAll('[data-observe]').length} sections`);

// ===== CONTACT MODAL BEHAVIOR =====
const openContactBtn = document.getElementById('open-contact-modal');
const contactModal = document.getElementById('contact-modal');
const restoreContactBtn = document.getElementById('restore-contact');
if (openContactBtn && contactModal) {
	const closeBtn = contactModal.querySelector('.contact-modal__close');
	const overlay = contactModal.querySelector('.contact-modal__overlay');
	const disableBtn = contactModal.querySelector('#contact-disable');

	// If user previously chose to hide contact modal, reflect that state
	const isHidden = localStorage.getItem('hideContactModal') === '1';
	if (isHidden) {
		openContactBtn.style.display = 'none';
		if (restoreContactBtn) restoreContactBtn.style.display = 'inline-block';
	}

	function openContactModal() {
		// respect user preference
		if (localStorage.getItem('hideContactModal') === '1') return;
		contactModal.classList.add('open');
		contactModal.setAttribute('aria-hidden', 'false');
		// lock scroll
		document.body.style.overflow = 'hidden';
		// focus close for accessibility
		if (closeBtn) closeBtn.focus();
	}

	function closeContactModal() {
		contactModal.classList.remove('open');
		contactModal.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
		openContactBtn.focus();
	}

	openContactBtn.addEventListener('click', (e) => {
		e.preventDefault();
		openContactModal();
	});

	// disable (don't show again) button
	if (disableBtn) {
		disableBtn.addEventListener('click', (ev) => {
			ev.preventDefault();
			localStorage.setItem('hideContactModal', '1');
			closeContactModal();
			// hide the main CTA and show restore link
			openContactBtn.style.display = 'none';
			if (restoreContactBtn) restoreContactBtn.style.display = 'inline-block';
		});
	}

	// restore contact visibility
	if (restoreContactBtn) {
		restoreContactBtn.addEventListener('click', (ev) => {
			ev.preventDefault();
			localStorage.removeItem('hideContactModal');
			openContactBtn.style.display = '';
			restoreContactBtn.style.display = 'none';
			openContactBtn.focus();
		});
	}

	if (closeBtn) closeBtn.addEventListener('click', closeContactModal);
	if (overlay) overlay.addEventListener('click', closeContactModal);

	document.addEventListener('keydown', (ev) => {
		if (ev.key === 'Escape' && contactModal.classList.contains('open')) {
			closeContactModal();
		}
	});
}
