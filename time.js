function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Update both time elements (footer and mobile footer)
    const timeElements = document.querySelectorAll('#current-time');
    timeElements.forEach(element => {
        element.textContent = timeString;
    });
}

// Start the time updates when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateTime(); // Update immediately
    setInterval(updateTime, 1000); // Then update every second
});