// Enhanced Like System for Properties
// This system saves only property IDs and fetches full details when needed

class PropertyLikeManager {
    constructor() {
        this.apiBaseUrl = 'https://xf9m-jkaj-lcsq.p7.xano.io/api:v5maUE6u';
        this.storageKey = 'likedPropertyIds';
        this.init();
    }

    init() {
        // Prevent double initialization
        if (this.initialized) return;
        this.initialized = true;
        
        this.setupEventListeners();
        this.loadLikedProperties();
    }

    setupEventListeners() {
        // Listen for like/unlike events from other pages
        document.addEventListener('propertyLiked', (e) => {
            this.addToLiked(e.detail.propertyId);
        });

        document.addEventListener('propertyUnliked', (e) => {
            this.removeFromLiked(e.detail.propertyId);
        });
    }

    // Add a property to liked list
    addToLiked(propertyId) {
        const likedIds = this.getLikedPropertyIds();
        if (!likedIds.includes(propertyId)) {
            likedIds.push(propertyId);
            this.saveLikedPropertyIds(likedIds);
            this.updateLikeButton(propertyId, true);
        }
    }

    // Remove a property from liked list
    removeFromLiked(propertyId) {
        let likedIds = this.getLikedPropertyIds();
        likedIds = likedIds.filter(id => id !== propertyId);
        this.saveLikedPropertyIds(likedIds);
        this.updateLikeButton(propertyId, false);
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
        
        // Also update any other like buttons with the same property ID
        const allHeartIcons = document.querySelectorAll(`[data-property-id="${propertyId}"] .heart-icon`);
        allHeartIcons.forEach(icon => {
            icon.setAttribute('fill', isLiked ? '#313131' : 'none');
        });
    }

    // Fetch property details from API
    async fetchPropertyDetails(propertyId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/properties/${propertyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const property = await response.json();
            return property;
        } catch (error) {
            console.error(`Error fetching property ${propertyId}:`, error);
            return null;
        }
    }

    // Fetch all liked properties
    async fetchAllLikedProperties() {
        const likedIds = this.getLikedPropertyIds();
        const properties = [];

        // Fetch properties in parallel with a limit to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < likedIds.length; i += batchSize) {
            const batch = likedIds.slice(i, i + batchSize);
            const batchPromises = batch.map(id => this.fetchPropertyDetails(id));
            
            try {
                const batchResults = await Promise.all(batchPromises);
                properties.push(...batchResults.filter(p => p !== null));
            } catch (error) {
                console.error('Error fetching batch of properties:', error);
            }

            // Small delay between batches to be respectful to the API
            if (i + batchSize < likedIds.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return properties;
    }

    // Load and display liked properties
    async loadLikedProperties() {
        const container = document.getElementById('projects');
        if (!container) return;

        // Show loading state
        container.innerHTML = '<div class="loading">Loading your favorite properties...</div>';

        try {
            const properties = await this.fetchAllLikedProperties();
            
            if (properties.length === 0) {
                container.innerHTML = '<p class="no-properties">You haven\'t liked any properties yet.</p>';
                return;
            }

            // Clear container and render properties
            container.innerHTML = '';
            properties.forEach(property => {
                const card = this.createPropertyCard(property);
                container.appendChild(card);
            });

        } catch (error) {
            console.error('Error loading liked properties:', error);
            container.innerHTML = '<p class="error">Error loading your favorite properties. Please try again later.</p>';
        }
    }

    // Create a property card
    createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.setAttribute('data-property-id', property.id);

        const price = property.price || 0;
        const currency = property.currency || 'EUR';
        const images = property.images || [];
        const firstImage = images.length > 0 ? images[0].image_url : '';

        card.innerHTML = `
            <div class="property-image">
                <img src="${firstImage}" alt="${property.development_name || 'Property'}" onerror="this.src='${this.getDefaultImageUrl()}'">
                <div class="property-overlay">
                    <button class="unlike-btn" onclick="propertyLikeManager.removeFromLiked(${property.id})">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff4444">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="property-info">
                <h3 class="property-title">${property.development_name || property.type || 'Property'}</h3>
                <p class="property-location">${property.town || ''}, ${property.province || ''}, ${property.country || ''}</p>
                <div class="property-details">
                    <span class="property-price">${currency} ${price.toLocaleString()}</span>
                    ${property.beds > 0 ? `<span class="property-beds">${property.beds} beds</span>` : ''}
                    ${property.baths > 0 ? `<span class="property-baths">${property.baths} baths</span>` : ''}
                    ${property.built_area > 0 ? `<span class="property-area">${property.built_area} m²</span>` : ''}
                    ${property.plot_area > 0 ? `<span class="property-plot">${property.plot_area} m² plot</span>` : ''}
                </div>
                <p class="property-description">${(property.description || '').substring(0, 150)}${(property.description || '').length > 150 ? '...' : ''}</p>
            </div>
        `;

        return card;
    }

    // Get default image URL
    getDefaultImageUrl() {
        return `${window.location.origin}${window.location.pathname.replace('/liked', '')}/images/default-property.jpg`;
    }

    // Clear all liked properties
    clearAllLiked() {
        this.saveLikedPropertyIds([]);
        this.loadLikedProperties();
    }

    // Get liked properties count
    getLikedCount() {
        return this.getLikedPropertyIds().length;
    }

    // Export liked properties (for sharing)
    exportLikedProperties() {
        const likedIds = this.getLikedPropertyIds();
        return {
            count: likedIds.length,
            ids: likedIds,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize the like manager
const propertyLikeManager = new PropertyLikeManager();

// Global functions for use in other pages
window.addToLiked = (propertyId) => propertyLikeManager.addToLiked(propertyId);
window.removeFromLiked = (propertyId) => propertyLikeManager.removeFromLiked(propertyId);
window.toggleLike = (propertyId) => propertyLikeManager.toggleLike(propertyId);
window.isLiked = (propertyId) => propertyLikeManager.isLiked(propertyId);
window.getLikedCount = () => propertyLikeManager.getLikedCount();
window.clearAllLiked = () => propertyLikeManager.clearAllLiked();
window.exportLikedProperties = () => propertyLikeManager.exportLikedProperties();
