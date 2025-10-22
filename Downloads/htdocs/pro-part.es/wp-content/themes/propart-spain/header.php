<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package propart-spain
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	
	<!-- Google Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&display=swap" rel="stylesheet" />
	
	<!-- Swiper JS (for sliders) -->
	<link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css">
	<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

	<!-- START: Mapbox Libraries -->
	<!-- Mapbox GL JS - Core Library -->
	<script src='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'></script>
	<link href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />

	<!-- Mapbox GL Draw Plugin (for drawing on map) -->
	<script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.0/mapbox-gl-draw.js'></script>
	<link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.0/mapbox-gl-draw.css' type='text/css' />

	<!-- Turf.js (for spatial analysis like points in polygon) -->
	<script src='https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js'></script>
	<!-- END: Mapbox Libraries -->

	<?php wp_head(); ?>
	
	<!-- Inline Styles for Mapbox Popup & Controls (from previous step) -->
<!-- ВСТАВИТИ ЗАМІСТЬ СТАРОГО БЛОКУ STYLE В HEADER.PHP -->
	<style>
		/* --- Стилі для кастомних попапів Mapbox --- */

		/* Основна обгортка попапу від Mapbox */
		.mapboxgl-popup {
			max-width: 300px !important;
			box-shadow: none !important;
			outline: none !important;
		}
		.mapboxgl-popup-content {
			padding: 0 !important;
			border-radius: 8px !important; /* Встановлено 8px */
			box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25) !important;
		}
		.mapboxgl-popup-tip,
		.mapboxgl-popup-close-button {
			display: none !important;
		}

		/* --- Стилі для вашого вмісту попапу --- */

		.mapPopup {
			border-radius: 8px !important; /* Встановлено 8px */
			width: 300px !important;
			overflow: hidden !important;
			font-family: 'Onest', Arial, sans-serif !important;
		}

		/* Слайдер та зображення */
		.mapPopup .swiper-container {
			width: 100%;
			height: 180px;
			/* Переконайтеся, що тут немає заокруглення */
			border-radius: 0 !important; 
		}
		.mapPopup .imgMapPopup {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}

		/* Текстовий блок */
		.mapPopup__texts {
			padding: 16px !important;
		}

		.mapPopup__info-title {
			font-size: 20px !important; /* Зменшено шрифт назви */
			font-weight: 600 !important;
		}

		.mapPopup__info-list {
			font-size: 14px !important;
			margin-bottom: 16px !important;
		}

		/* Футер з ціною та кнопкою */
		.mapPopup__info-price {
			font-size: 18px !important; /* Зменшено шрифт ціни */
			font-weight: 600 !important;
			white-space: nowrap !important;
		}

		.mapPopupBtnRedirect {
			padding: 10px 20px !important;
			border-radius: 8px !important;
			white-space: nowrap !important;
		}
	</style>

	<!--Start of Tawk.to Script-->
	<script type="text/javascript">
	var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
	(function(){
	var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
	s1.async=true;
	// s1.src='https://embed.tawk.to/676889f449e2fd8dfefc1c23/1ifo5lp46';
	s1.charset='UTF-8';
	s1.setAttribute('crossorigin','*');
	s0.parentNode.insertBefore(s1,s0);
	})();
	</script>
	<!--End of Tawk.to Script-->


	<!-- Meta Pixel Code -->
	<script>
	!function(f,b,e,v,n,t,s)
	{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
	n.callMethod.apply(n,arguments):n.queue.push(arguments)};
	if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
	n.queue=[];t=b.createElement(e);t.async=!0;
	t.src=v;s=b.getElementsByTagName(e)[0];
	s.parentNode.insertBefore(t,s)}(window, document,'script',
	'https://connect.facebook.net/en_US/fbevents.js');
	fbq('init', '512701751683146');
	fbq('track', 'PageView');
	</script>
	<noscript><img height="1" width="1" style="display:none"
	src="https://www.facebook.com/tr?id=512701751683146&ev=PageView&noscript=1"
	/></noscript>
	<!-- End Meta Pixel Code -->

	<!-- Smartsupp Live Chat script -->
	<script type="text/javascript">
		var _smartsupp = _smartsupp || {};
		_smartsupp.key = 'f2309a0cd60efdaba6d4847837da6a3d900e6a74';
		window.smartsupp||(function(d) {
			var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
			s=d.getElementsByTagName('script')[0];c=d.createElement('script');
			c.type='text/javascript';c.charset='utf-8';c.async=true;
			c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
		})(document);
	</script>
	<noscript> Powered by <a href=“https://www.smartsupp.com” target=“_blank”>Smartsupp</a></noscript>
	
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header id="header"></header>