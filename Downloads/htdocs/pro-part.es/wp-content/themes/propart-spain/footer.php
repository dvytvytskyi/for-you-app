<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package propart-spain
 */

?>

<form id="feedbackBlock">
</form>
<footer id="footer">
    <script>

document.addEventListener("DOMContentLoaded", function() {
    const logoImg = document.querySelector('.logoImg'); // Найдите элемент по классу
    const logoImg_footer = document.querySelector('.logo-image'); // Найдите элемент по классу
    if (logoImg) {
        logoImg.src = "<?php echo get_template_directory_uri();?>/icons/shared/logo.svg'"; // Установите новый путь
    }
    if (logoImg_footer) {
        logoImg_footer.src = "<?php echo get_template_directory_uri();?>/icons/shared/logo.svg'"; // Установите новый путь
    }
});
		
        </script>

<?php wp_footer(); ?>

<?php
// Показуємо WhatsApp кнопку на всіх сторінках окрім карти
$current_template = get_page_template_slug();
if ($current_template !== 'pages/map.php') :
?>
<!-- WhatsApp плаваюча кнопка -->
<a href="https://wa.me/34695113333?text=Hello%2C%20I%27m%20interested%20in%20information%20about%20properties" target="_blank" class="whatsapp-float" aria-label="WhatsApp">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#25D366"/>
        <path d="M24 12C17.3731 12 12 17.3731 12 24C12 26.1776 12.6127 28.218 13.6761 29.9698L12.3007 35.4504L17.9553 34.1047C19.6447 35.0728 21.4537 35.52 23.4746 35.52C30.1015 35.52 35.4746 30.1015 35.4746 23.4746C35.4746 20.2374 34.1894 17.1541 31.9873 14.9414C29.7806 12.7294 26.7056 12 24 12ZM24 13.8946C26.2448 13.8946 28.3977 14.8149 30.0673 16.4846C31.737 18.1542 32.7139 20.3172 32.7139 22.6173C32.7139 28.7508 27.9493 33.6498 21.8893 33.6498C20.049 33.6498 18.2426 33.0987 16.6841 32.1127L16.2739 31.8866L13.4626 32.6379L14.2241 29.8925L13.9739 29.4716C12.915 27.838 12.3479 25.9623 12.3479 23.9793C12.3589 17.8459 17.124 13.8946 24 13.8946ZM18.5173 18.1144C18.3206 18.1144 18 18.1867 17.7307 18.4561C17.4613 18.7254 16.7373 19.3874 16.7373 20.754C16.7373 22.1207 17.7707 23.4341 17.9173 23.6307C18.0633 23.8637 20.1541 27.156 23.4541 28.438C26.209 29.5474 26.8321 29.3357 27.4841 29.2947C28.1361 29.2537 29.6321 28.6227 29.8921 27.9907C30.1521 27.3587 30.1521 26.7807 30.0921 26.6667C30.0321 26.5527 29.8373 26.4874 29.5307 26.3361C29.2241 26.1847 27.8694 25.5207 27.635 25.4327C27.4006 25.3447 27.2041 25.3087 27.0074 25.6154C26.8107 25.9221 26.3041 26.4874 26.1074 26.6841C25.9107 26.8807 25.7161 26.9054 25.4094 26.754C25.1027 26.6027 24.2274 26.3054 23.1907 25.3894C22.3761 24.672 21.8241 23.7894 21.6274 23.4827C21.4307 23.176 21.6087 22.9894 21.7601 22.8387C21.8967 22.7021 22.0694 22.4767 22.2207 22.2801C22.3721 22.0834 22.4121 21.9321 22.4974 21.7354C22.5827 21.5387 22.5387 21.3421 22.4694 21.1907C22.4001 21.0394 21.8594 19.6754 21.6361 19.1101C21.4254 18.5787 21.2061 18.6434 21.0307 18.6434C20.8537 18.6434 20.6574 18.6307 20.4607 18.6307C20.2641 18.6307 20.0374 18.5847 20.0374 18.5847C20.0374 18.5847 18.5173 18.1144 18.5173 18.1144Z" fill="white"/>
    </svg>
</a>

<style>
.whatsapp-float {
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    z-index: 9999 !important;
    width: 48px !important;
    height: 48px !important;
    border-radius: 50% !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    transition: all 0.3s ease !important;
    animation: pulse 2s infinite !important;
    display: inline-block !important;
}

.whatsapp-float svg {
    width: 48px !important;
    height: 48px !important;
    display: block !important;
}

.whatsapp-float:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
}

@keyframes pulse {
    0%, 100% {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    50% {
        box-shadow: 0 4px 20px rgba(37, 211, 102, 0.6);
    }
}

/* Адаптивність для мобільних пристроїв */
@media (max-width: 768px) {
    .whatsapp-float {
        display: none !important; /* Приховуємо на мобільних, бо є кнопка в нижньому меню */
    }
}
</style>
<?php endif; ?>

</body>
</html>
