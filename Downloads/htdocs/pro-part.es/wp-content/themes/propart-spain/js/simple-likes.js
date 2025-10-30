// Простая система лайков для свойств
// Просто сохраняет ID и показывает статус

// Функция для добавления в лайки
function addToLikes(propertyId) {
    let likedIds = JSON.parse(localStorage.getItem('likedPropertyIds') || '[]');
    if (!likedIds.includes(propertyId)) {
        likedIds.push(propertyId);
        localStorage.setItem('likedPropertyIds', JSON.stringify(likedIds));
    }
    updateLikeButton(propertyId, true);
    
    // Update badge counter
    if (window.dispatchLikesUpdateEvent) {
        window.dispatchLikesUpdateEvent();
    }
}

// Функция для удаления из лайков
function removeFromLikes(propertyId) {
    let likedIds = JSON.parse(localStorage.getItem('likedPropertyIds') || '[]');
    likedIds = likedIds.filter(id => id !== propertyId);
    localStorage.setItem('likedPropertyIds', JSON.stringify(likedIds));
    updateLikeButton(propertyId, false);
    
    // Update badge counter
    if (window.dispatchLikesUpdateEvent) {
        window.dispatchLikesUpdateEvent();
    }
}

// Функция для переключения лайка
function toggleLike(propertyId) {
    let likedIds = JSON.parse(localStorage.getItem('likedPropertyIds') || '[]');
    if (likedIds.includes(propertyId)) {
        removeFromLikes(propertyId);
        return false;
    } else {
        addToLikes(propertyId);
        return true;
    }
}

// Функция для проверки, лайкнуто ли свойство
function isLiked(propertyId) {
    let likedIds = JSON.parse(localStorage.getItem('likedPropertyIds') || '[]');
    return likedIds.includes(propertyId);
}

// Функция для получения количества лайкнутых свойств
function getLikedCount() {
    let likedIds = JSON.parse(localStorage.getItem('likedPropertyIds') || '[]');
    return likedIds.length;
}

// Функция для обновления кнопки лайка
function updateLikeButton(propertyId, isLiked) {
    const heartIcon = document.querySelector(`[data-property-id="${propertyId}"] .heart-icon`);
    if (heartIcon) {
        heartIcon.setAttribute('fill', isLiked ? '#313131' : 'none');
    }
}

// Функция для настройки всех кнопок лайка на странице
function setupLikeButtons() {
    const likeButtons = document.querySelectorAll('.heart-wrapper');
    likeButtons.forEach(button => {
        const propertyCard = button.closest('[data-property-id]');
        if (propertyCard) {
            const propertyId = propertyCard.getAttribute('data-property-id');
            if (propertyId) {
                // Убираем старые обработчики
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Добавляем новый обработчик
                newButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleLike(propertyId);
                });
                
                // Устанавливаем правильное состояние
                const isLikedState = isLiked(propertyId);
                const heartIcon = newButton.querySelector('.heart-icon');
                if (heartIcon) {
                    heartIcon.setAttribute('fill', isLikedState ? '#313131' : 'none');
                }
            }
        }
    });
}

// Функция для загрузки лайкнутых свойств с API
async function loadLikedProperties() {
    const container = document.getElementById('projects');
    if (!container) return;
    
    const likedIds = JSON.parse(localStorage.getItem('likedPropertyIds') || '[]');
    
    if (likedIds.length === 0) {
        container.innerHTML = '<p>There are no favorite projects</p>';
        return;
    }
    
    container.innerHTML = '<div style="text-align: center; padding: 40px;"><p>Loading your liked projects...</p></div>';
    
    try {
        const properties = [];
        
        // Загружаем каждое свойство по ID
        for (let id of likedIds) {
            try {
                const response = await fetch(`https://xf9m-jkaj-lcsq.p7.xano.io/api:v5maUE6u/properties/${id}`);
                if (response.ok) {
                    const property = await response.json();
                    properties.push(property);
                }
            } catch (error) {
                console.error(`Ошибка загрузки свойства ${id}:`, error);
            }
        }
        
        if (properties.length === 0) {
            container.innerHTML = '<p>There are no favorite projects</p>';
            return;
        }
        
        // Показываем свойства
        container.innerHTML = '';
        properties.forEach(property => {
            // Try to use the page's createProjectCard or createSecondaryProjectCard if available
            let card;
            
            // Determine if it's Off plan or Secondary based on property structure
            const isOffPlan = property.visible === 'Off plan' || 
                             property.generalInfo || 
                             property.development_name;
            
            if (isOffPlan && window.createProjectCardForLiked) {
                card = window.createProjectCardForLiked(property);
            } else if (window.createSecondaryProjectCardForLiked) {
                card = window.createSecondaryProjectCardForLiked(property);
            } else {
                // Fallback to simple card
                card = createPropertyCard(property);
            }
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        container.innerHTML = '<p>Error loading projects</p>';
    }
}

// Функция для создания карточки свойства
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-property-id', property.id);
    
    const price = property.price || 0;
    const currency = property.currency || 'EUR';
    const images = property.images || [];
    const firstImage = images.length > 0 ? images[0].image_url : '';
    
    card.innerHTML = `
        <div class="property-image">
            <img src="${firstImage}" alt="${property.development_name || 'Property'}" onerror="this.style.display='none'">
        </div>
        <div class="property-info">
            <h3>${property.development_name || property.type || 'Property'}</h3>
            <p>${property.town || ''}, ${property.province || ''}</p>
            <div class="price">${currency} ${price.toLocaleString()}</div>
            <p>${(property.description || '').substring(0, 100)}...</p>
            <button onclick="removeFromLikes(${property.id}); this.parentElement.parentElement.remove();">Remove</button>
        </div>
    `;
    
    return card;
}

// Функция для очистки всех лайков
function clearAllLikes() {
    localStorage.removeItem('likedPropertyIds');
    const container = document.getElementById('projects');
    if (container) {
        container.innerHTML = '<p>У вас нет лайкнутых свойств</p>';
    }
    
    // Обновляем все кнопки на странице
    const heartIcons = document.querySelectorAll('.heart-icon');
    heartIcons.forEach(icon => {
        icon.setAttribute('fill', 'none');
    });
    
    // Update badge counter
    if (window.dispatchLikesUpdateEvent) {
        window.dispatchLikesUpdateEvent();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Настраиваем кнопки лайка
    setupLikeButtons();
    
    // Если это страница лайков, загружаем свойства
    if (window.location.pathname.includes('liked')) {
        loadLikedProperties();
    }
});

// Делаем функции доступными глобально
window.addToLikes = addToLikes;
window.removeFromLikes = removeFromLikes;
window.toggleLike = toggleLike;
window.isLiked = isLiked;
window.getLikedCount = getLikedCount;
window.clearAllLikes = clearAllLikes;
window.loadLikedProperties = loadLikedProperties;
