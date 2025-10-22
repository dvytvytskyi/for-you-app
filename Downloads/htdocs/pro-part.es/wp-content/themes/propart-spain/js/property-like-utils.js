// Property Like Utilities
// This file provides like functionality for property cards

class PropertyLikeUtils {
    constructor() {
        this.apiBaseUrl = 'https://xf9m-jkaj-lcsq.p7.xano.io/api:v5maUE6u';
        this.storageKey = 'likedPropertyIds';
        this.init();
    }

    init() {
        this.setupGlobalFunctions();
        this.setupExistingLikeButtons();
        
        // Setup like buttons when DOM changes
        this.observeDOMChanges();
    }

    observeDOMChanges() {
        // Use MutationObserver to detect when new property cards are added
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if new property cards were added
                    const hasNewCards = Array.from(mutation.addedNodes).some(node => 
                        node.nodeType === 1 && (
                            node.classList?.contains('card') || 
                            node.querySelector?.('.heart-wrapper')
                        )
                    );
                    
                    if (hasNewCards) {
                        // Small delay to ensure DOM is fully rendered
                        setTimeout(() => {
                            this.setupExistingLikeButtons();
                        }, 100);
                    }
                }
            });
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupGlobalFunctions() {
        // Make functions available globally
        window.addPropertyToLiked = (propertyId) => this.addToLiked(propertyId);
        window.removePropertyFromLiked = (propertyId) => this.removeFromLiked(propertyId);
        window.togglePropertyLike = (propertyId) => this.toggleLike(propertyId);
        window.isPropertyLiked = (propertyId) => this.isLiked(propertyId);
    }

    // Add a property to liked list
    addToLiked(propertyId) {
        const likedIds = this.getLikedPropertyIds();
        if (!likedIds.includes(propertyId)) {
            likedIds.push(propertyId);
            this.saveLikedPropertyIds(likedIds);
            this.updateLikeButton(propertyId, true);
            this.dispatchLikeEvent(propertyId, true);
        }
    }

    // Remove a property from liked list
    removeFromLiked(propertyId) {
        let likedIds = this.getLikedPropertyIds();
        likedIds = likedIds.filter(id => id !== propertyId);
        this.saveLikedPropertyIds(likedIds);
        this.updateLikeButton(propertyId, false);
        this.dispatchLikeEvent(propertyId, false);
    }

    // Toggle like status
    toggleLike(propertyId) {
        const likedIds = this.getLikedPropertyIds();
        if (likedIds.includes(propertyId)) {
            this.removeFromLiked(propertyId);
            return false; // Now unliked
        } else {
            this.addToLiked(propertyId);
            return true; // Now liked
        }
    }

    // Check if a property is liked
    isLiked(propertyId) {
        const likedIds = this.getLikedPropertyIds();
        return likedIds.includes(propertyId);
    }

    // Get all liked property IDs
    getLikedPropertyIds() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Save liked property IDs
    saveLikedPropertyIds(ids) {
        localStorage.setItem(this.storageKey, JSON.stringify(ids));
    }

    // Update like button appearance
    updateLikeButton(propertyId, isLiked) {
        const heartIcon = document.querySelector(`[data-property-id="${propertyId}"] .heart-icon`);
        if (heartIcon) {
            heartIcon.setAttribute('fill', isLiked ? '#313131' : 'none');
        }
    }

    // Dispatch custom events for like/unlike
    dispatchLikeEvent(propertyId, isLiked) {
        const eventName = isLiked ? 'propertyLiked' : 'propertyUnliked';
        const event = new CustomEvent(eventName, {
            detail: { propertyId }
        });
        document.dispatchEvent(event);
    }

    // Create a like button for a property card
    createLikeButton(propertyId, initialLikedState = false) {
        const button = document.createElement('div');
        button.className = 'heart-wrapper';
        button.setAttribute('data-property-id', propertyId);
        
        const isLiked = initialLikedState || this.isLiked(propertyId);
        
        button.innerHTML = `
            <svg
                class="heart-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="${isLiked ? '#313131' : 'none'}"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        `;

        // Remove any existing event listeners and add new one
        const newButton = button.cloneNode(true);
        newButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.toggleLike(propertyId);
        });

        return newButton;
    }

    // Update all like buttons on the page
    updateAllLikeButtons() {
        const likeButtons = document.querySelectorAll('[data-property-id]');
        likeButtons.forEach(button => {
            const propertyId = button.getAttribute('data-property-id');
            const isLiked = this.isLiked(propertyId);
            const heartIcon = button.querySelector('.heart-icon');
            if (heartIcon) {
                heartIcon.setAttribute('fill', isLiked ? '#313131' : 'none');
            }
        });
    }

    // Setup like buttons for existing property cards
    setupExistingLikeButtons() {
        const likeButtons = document.querySelectorAll('.heart-wrapper:not([data-liked-initialized])');
        likeButtons.forEach(button => {
            // Find the closest parent with data-property-id
            const propertyCard = button.closest('[data-property-id]');
            if (propertyCard) {
                const propertyId = propertyCard.getAttribute('data-property-id');
                if (propertyId) {
                    // Mark as initialized
                    button.setAttribute('data-liked-initialized', 'true');
                    
                    // Remove existing click listeners
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    
                    // Add new click listener
                    newButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.toggleLike(propertyId);
                    });
                    
                    // Update initial state
                    const isLiked = this.isLiked(propertyId);
                    const heartIcon = newButton.querySelector('.heart-icon');
                    if (heartIcon) {
                        heartIcon.setAttribute('fill', isLiked ? '#313131' : 'none');
                    }
                }
            }
        });
    }

    // Get liked count for display
    getLikedCount() {
        return this.getLikedPropertyIds().length;
    }

    // Update like count display if it exists
    updateLikeCountDisplay() {
        const countElements = document.querySelectorAll('.liked-count, .favorites-count');
        const count = this.getLikedCount();
        countElements.forEach(element => {
            element.textContent = count;
        });
    }
}

// Initialize the utility
const propertyLikeUtils = new PropertyLikeUtils();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PropertyLikeUtils;
}
