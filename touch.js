// Variables to track touch positions
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const TAP_THRESHOLD = 10; // Threshold for detecting tap, adjust as needed

// Function to show the control bar and elements
function showControlBar() {
    // Show the video control bar if hidden
    player.controlBar.show();
    
    // Optionally, set a timeout to hide the controls after a few seconds of inactivity
    player.userActive(true); // Ensures controls are shown
}

// Function to update the play/pause icon based on video state
function updatePlayPauseIcon() {
    if (player.paused()) {
        player.controlBar.playToggle.controlText('Play');  // Show play icon
    } else {
        player.controlBar.playToggle.controlText('Pause'); // Show pause icon
    }
}

// Add touchstart event listener to capture the initial touch position
player.el().addEventListener('touchstart', function(event) {
    const touch = event.touches[0];
    touchStartX = touch.screenX;
    touchStartY = touch.screenY;

    // Show control bar when touch starts
    showControlBar();
});

// Add touchend event listener to detect if the movement qualifies as a tap
player.el().addEventListener('touchend', function(event) {
    const touch = event.changedTouches[0];
    touchEndX = touch.screenX;
    touchEndY = touch.screenY;

    // Calculate the difference between start and end positions
    const deltaX = Math.abs(touchEndX - touchStartX);
    const deltaY = Math.abs(touchEndY - touchStartY);

    // Get the clicked element (target)
    const targetElement = event.target;

    // List of UI elements to ignore for the play/pause toggle
    const ignoredSelectors = [
        '.vjs-volume-panel',    // Volume button
        '.vjs-resolution-button', // Gear/settings button
        '.vjs-fullscreen-control', // Fullscreen button
        '.vjs-picture-in-picture-control', // Mini player button
        '.vjs-subtitle-button', // Subtitle/captions button
        '.vjs-autoplay-switch', // Autoplay toggle
        '.vjs-control-bar',      // General control bar
        '.vjs-play-control',     // Play button (if you have one)
        '.vjs-mute-control',     // Mute button
        '.vjs-progress-control'  // Progress bar
    ];

    // Check if the target element matches any of the ignored selectors
    const isIgnoredElement = ignoredSelectors.some(selector => targetElement.closest(selector));

    // Only toggle play/pause if it's a tap and not on any ignored UI element
    if (!isIgnoredElement && deltaX < TAP_THRESHOLD && deltaY < TAP_THRESHOLD) {
        // Toggle play/pause only if it's a valid tap (not a swipe or on UI elements)
        if (player.paused()) {
            player.play();
        } else {
            player.pause();
        }

        // Update the play/pause icon
        updatePlayPauseIcon();
    } else {
        // If it's a swipe or unintentional touch, just show the control bar
        showControlBar();
    }
});

// Update play/pause icon when the video state changes
player.on('pause', updatePlayPauseIcon);
player.on('play', updatePlayPauseIcon);

// Ensure the control bar stays visible when there's any user interaction
player.on('mousemove', showControlBar);
player.on('touchmove', showControlBar);  // Ensure touch swipes also show the control bar

// Optionally, hide the control bar after a period of inactivity
let hideTimeout;
function resetHideTimeout() {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => player.userActive(false), 3000); // Hide after 3 seconds of inactivity
}
player.on('useractive', resetHideTimeout);
