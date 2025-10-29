/**
 * Frontend Form Handler
 * Captures form submissions and sends them to the Vercel API endpoint.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Find a contact form on the page (e.g., on contact.html)
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Stop the browser from submitting the form
            
            const statusMessage = document.getElementById('form-status');
            statusMessage.textContent = 'Sending...';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/forms/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    // Success!
                    statusMessage.textContent = 'Message sent! We will contact you soon.';
                    statusMessage.className = 'status-success';
                    contactForm.reset();
                } else {
                    // Handle server errors
                    statusMessage.textContent = `Error: ${result.message || 'Submission failed.'}`;
                    statusMessage.className = 'status-error';
                }
            } catch (error) {
                // Handle network errors
                console.error('Fetch error:', error);
                statusMessage.textContent = 'Network error. Please try again.';
                statusMessage.className = 'status-error';
            }
        });
    }

    // You can add a similar handler for #enrollment-form here
});