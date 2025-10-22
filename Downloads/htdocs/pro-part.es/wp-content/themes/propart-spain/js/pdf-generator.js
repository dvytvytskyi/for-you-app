/**
 * PDF Generator JavaScript
 * Обробка генерації та завантаження PDF для проектів
 */

(function($) {
    'use strict';

    // Глобальні дані проекту
    let projectData = {};

    // Ініціалізація при завантаженні сторінки
    $(document).ready(function() {
        // Перевіряємо, чи є кнопка на сторінці
        const $pdfBtn = $('#download-pdf-btn');
        
        if ($pdfBtn.length) {
            // НЕ збираємо дані тут, бо фото ще не завантажились!
            // Збираємо дані тільки при кліку на кнопку
            
            // Додаємо обробник кліку
            $pdfBtn.on('click', handlePdfDownload);
            
            console.log('PDF Generator initialized. Images will be collected on button click.');
        }
    });

    /**
     * Збирає дані проекту з елементів DOM
     */
    function collectProjectData() {
        projectData = {
            name: $('#projectName').text() || document.title,
            location: $('#projectLocation').text() || '',
            price: parsePrice($('#projectPrice').text()),
            priceForM: parsePrice($('#priceForM').text()),
            condition: $('.project-desc-details:contains("Condition") .project-desc-title').text() || 
                      $('.project-desc-details:contains("Стан") .project-desc-title').text() || 
                      'Off plan',
            type: $('#projectType').text() || '',
            rooms: $('#projectRooms').text() || '',
            size: $('#projectSize').text() || '',
            floor: $('#projectFloor').text() || '',
            totalFloors: $('#projectTotalFloors').text() || '',
            handover: $('#projectHandover').text() || '',
            description: $('#projectDescr').text() || '',
            mainImage: $('#projectMainImg').attr('src') || '',
            galleryImages: collectGalleryImages(),
            amenities: collectAmenities()
        };

        console.log('Зібрані дані проекту:', projectData);
    }

    /**
     * Парсить ціну з тексту
     */
    function parsePrice(priceText) {
        if (!priceText) return 0;
        // Видаляємо всі символи крім цифр
        const numbers = priceText.replace(/[^\d]/g, '');
        return parseInt(numbers) || 0;
    }

    /**
     * Збирає всі фото галереї
     */
    function collectGalleryImages() {
        const galleryImages = [];
        
        console.log('=== Starting gallery images collection ===');
        console.log('window.images type:', typeof window.images);
        console.log('window.images defined?', typeof window.images !== 'undefined');
        console.log('window.images is array?', Array.isArray(window.images));
        console.log('window.images length:', window.images?.length || 0);
        
        // Спробуємо взяти з глобальної змінної images (основна галерея)
        if (typeof window.images !== 'undefined' && Array.isArray(window.images) && window.images.length > 0) {
            console.log('✓ Found images from window.images:', window.images.length);
            console.log('First image:', window.images[0]);
            galleryImages.push(...window.images);
        }
        // Альтернатива - imagesSecondary для вторинної нерухомості
        else if (typeof window.imagesSecondary !== 'undefined' && Array.isArray(window.imagesSecondary) && window.imagesSecondary.length > 0) {
            console.log('✓ Found images from window.imagesSecondary:', window.imagesSecondary.length);
            galleryImages.push(...window.imagesSecondary);
        }
        // Fallback - збираємо з thumbnail container
        else {
            console.log('⚠ No window.images found, trying thumbnailContainer');
            $('#thumbnailContainer img').each(function() {
                const src = $(this).attr('src');
                if (src && src.length > 0) {
                    galleryImages.push(src);
                }
            });
            
            // Якщо і там немає, шукаємо всі img на сторінці з певними класами
            if (galleryImages.length === 0) {
                console.log('⚠ No thumbnails found, trying .gallery-image, .property-image');
                $('.gallery-image, .property-image, [id*="projectMainImg"]').each(function() {
                    const src = $(this).attr('src');
                    if (src && src.length > 0 && !galleryImages.includes(src)) {
                        galleryImages.push(src);
                    }
                });
            }
        }
        
        console.log('✓ Total gallery images collected:', galleryImages.length);
        if (galleryImages.length > 0) {
            console.log('Gallery images:', galleryImages);
        }
        
        // Обмежуємо до 10 фото для PDF
        return galleryImages.slice(0, 10);
    }

    /**
     * Збирає зручності проекту
     */
    function collectAmenities() {
        const amenities = [];
        $('#projectAmenities .amenity-item, #projectAmenities .project-amenities-item').each(function() {
            const amenity = $(this).text().trim();
            if (amenity) {
                amenities.push(amenity);
            }
        });
        return amenities;
    }

    /**
     * Обробляє клік по кнопці завантаження PDF
     */
    function handlePdfDownload(e) {
        e.preventDefault();
        
        const $btn = $(this);
        const originalText = $btn.html();
        
        // Показуємо індикатор завантаження
        $btn.prop('disabled', true);
        $btn.html('⏳ Генерація PDF...');
        
        // Оновлюємо дані перед генерацією
        collectProjectData();
        
        console.log('Sending PDF request with data:', projectData);
        console.log('Gallery images count:', projectData.galleryImages?.length || 0);
        
        // Підготовка даних для відправки
        const formData = {
            action: 'generate_property_pdf',
            nonce: pdfGeneratorData.nonce,
            name: projectData.name,
            location: projectData.location,
            price: projectData.price,
            priceForM: projectData.priceForM,
            condition: projectData.condition,
            type: projectData.type,
            rooms: projectData.rooms,
            size: projectData.size,
            floor: projectData.floor,
            totalFloors: projectData.totalFloors,
            handover: projectData.handover,
            description: projectData.description,
            mainImage: projectData.mainImage,
            'galleryImages[]': projectData.galleryImages, // Масиви треба передавати з []
            'amenities[]': projectData.amenities
        };
        
        // Відправляємо запит на генерацію PDF
        $.ajax({
            url: pdfGeneratorData.ajaxurl,
            type: 'POST',
            data: formData,
            traditional: true, // Важливо для правильної обробки масивів
            success: function(response) {
                if (response.success) {
                    // Завантажуємо PDF
                    $btn.html('✅ Готово!');
                    
                    // Створюємо прихований iframe для завантаження
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = response.data.download_url;
                    document.body.appendChild(iframe);
                    
                    // Показуємо повідомлення
                    showNotification('PDF успішно згенеровано! Завантаження почалося...', 'success');
                    
                    // Відновлюємо кнопку через 3 секунди
                    setTimeout(() => {
                        $btn.html(originalText);
                        $btn.prop('disabled', false);
                        // Видаляємо iframe
                        if (iframe.parentNode) {
                            iframe.parentNode.removeChild(iframe);
                        }
                    }, 3000);
                } else {
                    $btn.html('❌ Помилка');
                    showNotification('Помилка генерації PDF: ' + (response.data?.message || 'Невідома помилка'), 'error');
                    
                    setTimeout(() => {
                        $btn.html(originalText);
                        $btn.prop('disabled', false);
                    }, 3000);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX error:', error);
                $btn.html('❌ Помилка');
                showNotification('Помилка з\'єднання: ' + error, 'error');
                
                setTimeout(() => {
                    $btn.html(originalText);
                    $btn.prop('disabled', false);
                }, 3000);
            }
        });
    }

    /**
     * Генерує nonce для безпеки
     */
    function generateNonce() {
        // Спробуємо знайти nonce в DOM або створимо базовий
        if (typeof wp_nonce !== 'undefined') {
            return wp_nonce;
        }
        // Створюємо простий токен (в production краще використовувати wp_create_nonce)
        return 'pdf_' + Date.now();
    }

    /**
     * Показує сповіщення користувачу
     */
    function showNotification(message, type = 'info') {
        // Перевіряємо, чи є контейнер для сповіщень
        let $container = $('#pdf-notification');
        
        if (!$container.length) {
            // Створюємо контейнер
            $container = $('<div>', {
                id: 'pdf-notification',
                css: {
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: '9999',
                    maxWidth: '400px'
                }
            }).appendTo('body');
        }
        
        // Створюємо сповіщення
        const $notification = $('<div>', {
            class: 'pdf-notification-item pdf-notification-' + type,
            html: message,
            css: {
                background: type === 'success' ? '#4CAF50' : (type === 'error' ? '#f44336' : '#2196F3'),
                color: 'white',
                padding: '15px 20px',
                marginBottom: '10px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                animation: 'slideInRight 0.3s ease-out',
                cursor: 'pointer',
                fontSize: '14px',
                lineHeight: '1.5'
            }
        }).appendTo($container);
        
        // Додаємо іконку
        const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
        $notification.prepend(icon + ' ');
        
        // Видаляємо при кліку
        $notification.on('click', function() {
            $(this).fadeOut(300, function() {
                $(this).remove();
            });
        });
        
        // Автоматично видаляємо через 5 секунд
        setTimeout(() => {
            $notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 5000);
    }

    // Додаємо CSS анімацію
    if (!$('#pdf-notification-styles').length) {
        $('<style>', {
            id: 'pdf-notification-styles',
            html: `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .pdf-notification-item:hover {
                    transform: scale(1.02);
                    transition: transform 0.2s ease;
                }
            `
        }).appendTo('head');
    }

})(jQuery);

