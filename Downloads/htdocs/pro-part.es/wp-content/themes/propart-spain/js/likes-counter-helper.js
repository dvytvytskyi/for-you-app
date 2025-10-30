// Helper function to dispatch likes update event
// This notifies the header badge to update
function dispatchLikesUpdateEvent() {
    const event = new CustomEvent('likesUpdated');
    document.dispatchEvent(event);
}

// Helper function to get total likes count
function getTotalLikesCount() {
    const likedIds = JSON.parse(localStorage.getItem('likedPropertyIds')) || [];
    return likedIds.length;
}

// Function to add badge to like button
function addLikeBadgeToButton() {
    const likeButtons = document.querySelectorAll('.likeButton, .settingsButton');
    
    console.log('🔍 Found like buttons:', likeButtons.length);
    
    if (likeButtons.length === 0) {
        console.log('⚠️ No like buttons found! Checking all buttons...');
        const allButtons = document.querySelectorAll('button');
        console.log('Total buttons on page:', allButtons.length);
        allButtons.forEach((btn, index) => {
            if (btn.className.includes('like') || btn.className.includes('heart')) {
                console.log(`Button ${index} classes:`, btn.className);
            }
        });
    }
    
    likeButtons.forEach(likeButton => {
        // Check if badge already exists
        if (likeButton.querySelector('.like-count-badge')) {
            console.log('Badge already exists on button');
            return; // Already has badge
        }
        
        // Make sure button has position relative
        likeButton.style.position = 'relative';
        
        // Create badge
        const likeBadge = document.createElement('span');
        likeBadge.className = 'like-count-badge';
        likeBadge.style.display = 'none'; // Hidden by default
        likeButton.appendChild(likeBadge);
        
        console.log('✅ Like badge added to button:', likeButton);
        console.log('Button classes:', likeButton.className);
        console.log('Badge element:', likeBadge);
    });
    
    // Update badge count immediately
    updateLikeCountBadge();
}

// Function to update like count badge
function updateLikeCountBadge() {
    const totalCount = getTotalLikesCount();
    const badges = document.querySelectorAll('.like-count-badge');
    
    console.log('🔄 Updating badges. Total likes:', totalCount, 'Badges found:', badges.length);
    
    badges.forEach((badge, index) => {
        console.log(`Badge ${index}:`, badge, 'Parent:', badge.parentElement);
        if (totalCount > 0) {
            badge.textContent = totalCount > 99 ? '99+' : totalCount;
            badge.style.display = 'flex';
            console.log(`✅ Badge ${index} updated to show:`, totalCount);
        } else {
            badge.style.display = 'none';
            console.log(`❌ Badge ${index} hidden (no likes)`);
        }
    });
}

// Initialize when DOM is ready
function initializeLikeBadge() {
    // Try to add badge immediately
    addLikeBadgeToButton();
    
    // Also observe for dynamically added like buttons
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && (node.classList.contains('likeButton') || node.classList.contains('settingsButton'))) {
                            addLikeBadgeToButton();
                        } else if (node.querySelector) {
                            const likeBtn = node.querySelector('.likeButton, .settingsButton');
                            if (likeBtn) {
                                addLikeBadgeToButton();
                            }
                        }
                    }
                });
            }
        });
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Listen for likes update events
    document.addEventListener('likesUpdated', updateLikeCountBadge);
    
    // Also check periodically (in case localStorage changes in same tab)
    setInterval(updateLikeCountBadge, 1000);
    
    console.log('Like badge system initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLikeBadge);
} else {
    // DOM is already ready
    initializeLikeBadge();
}

// Also initialize after a short delay to catch dynamically created headers
setTimeout(initializeLikeBadge, 500);
setTimeout(initializeLikeBadge, 1000);
setTimeout(initializeLikeBadge, 2000);

// Make functions globally available
window.dispatchLikesUpdateEvent = dispatchLikesUpdateEvent;
window.getTotalLikesCount = getTotalLikesCount;
window.updateLikeCountBadge = updateLikeCountBadge;
window.addLikeBadgeToButton = addLikeBadgeToButton;

