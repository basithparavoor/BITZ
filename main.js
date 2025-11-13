/**
 * Frontend Form Handlers
 * Captures submissions for Contact, Enrollment, and Corporate forms.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Handler 1: Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const statusMessage = document.getElementById('form-status');
            statusMessage.textContent = 'Sending...';
            statusMessage.className = '';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/forms/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();

                if (response.ok) {
                    statusMessage.textContent = result.message;
                    statusMessage.className = 'status-success';
                    contactForm.reset();
                } else {
                    statusMessage.textContent = `Error: ${result.message || 'Submission failed.'}`;
                    statusMessage.className = 'status-error';
                }
            } catch (error) {
                console.error('Contact form error:', error);
                statusMessage.textContent = 'Network error. Please try again.';
                statusMessage.className = 'status-error';
            }
        });
    }

    // --- Handler 2: Enrollment Form ---
    const enrollmentForm = document.getElementById('enrollment-form');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const statusMessage = document.getElementById('enroll-form-status');
            statusMessage.textContent = 'Submitting application...';
            statusMessage.className = '';
            
            const formData = new FormData(enrollmentForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/forms/enroll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();

                if (response.ok) {
                    statusMessage.textContent = result.message;
                    statusMessage.className = 'status-success';
                    enrollmentForm.reset();
                } else {
                    statusMessage.textContent = `Error: ${result.message || 'Submission failed.'}`;
                    statusMessage.className = 'status-error';
                }
            } catch (error) {
                console.error('Enrollment form error:', error);
                statusMessage.textContent = 'Network error. Please try again.';
                statusMessage.className = 'status-error';
            }
        });
    }
    
    // --- Handler 3: Corporate Form ---
    const corporateForm = document.getElementById('corporate-form');
    if (corporateForm) {
        corporateForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const statusMessage = document.getElementById('corporate-form-status');
            statusMessage.textContent = 'Submitting request...';
            statusMessage.className = '';
            
            const formData = new FormData(corporateForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/forms/corporate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();

                if (response.ok) {
                    statusMessage.textContent = result.message;
                    statusMessage.className = 'status-success';
                    corporateForm.reset();
                } else {
                    statusMessage.textContent = `Error: ${result.message || 'Submission failed.'}`;
                    statusMessage.className = 'status-error';
                }
            } catch (error) {
                console.error('Corporate form error:', error);
                statusMessage.textContent = 'Network error. Please try again.';
                statusMessage.className = 'status-error';
            }
        });
    }

});