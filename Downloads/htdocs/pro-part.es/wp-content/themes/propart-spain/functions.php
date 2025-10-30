<?php
/**
 * propart-spain functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package propart-spain
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.6.3' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function propart_spain_setup() {
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on propart-spain, use a find and replace
		* to change 'propart-spain' to the name of your theme in all the template files.
		*/
	load_theme_textdomain( 'propart-spain', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
		* Let WordPress manage the document title.
		* By adding theme support, we declare that this theme does not use a
		* hard-coded <title> tag in the document head, and expect WordPress to
		* provide it for us.
		*/
	add_theme_support( 'title-tag' );

	/*
		* Enable support for Post Thumbnails on posts and pages.
		*
		* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		*/
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'menu-1' => esc_html__( 'Primary', 'propart-spain' ),
		)
	);

	/*
		* Switch default core markup for search form, comment form, and comments
		* to output valid HTML5.
		*/
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background',
		apply_filters(
			'propart_spain_custom_background_args',
			array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
}
add_action( 'after_setup_theme', 'propart_spain_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function propart_spain_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'propart_spain_content_width', 640 );
}
add_action( 'after_setup_theme', 'propart_spain_content_width', 0 );


function custom_enqueue_styles() {
    wp_enqueue_style('custom-style', get_template_directory_uri() . '/style.css');
	wp_enqueue_script('custom-script', get_template_directory_uri() . '/js/script.js', array('jquery'), null, true);
	wp_enqueue_script('likes-counter-helper', get_template_directory_uri() . '/js/likes-counter-helper.js', array(), '1.0.2', true);

}
add_action('wp_enqueue_scripts', 'custom_enqueue_styles');



function custom_register_page_template( $templates ) {
    $templates['pages/areas.php'] = 'Areas page';
	$templates['pages/benahavis.php'] = 'Benahavis page';
	$templates['pages/concierge-service.php'] = 'Concierge Service';
	$templates['pages/construction-service.php'] = 'Construction Service';
	$templates['pages/consulting.php'] = 'Consulting page';
	$templates['pages/estapona.php'] = 'Estapona page';
	$templates['pages/insurance-service.php'] = 'Insurance Service';
	$templates['pages/legal-services.php'] = 'Legal Services';
	$templates['pages/marbella.php'] = 'Marbella page';
	$templates['pages/mijas.php'] = 'Mijas page';
	$templates['pages/mortgage-service .php'] = 'Mortgage service page';
	$templates['pages/ojen.php'] = 'Ojen page';
	$templates['pages/sotogrande.php'] = 'Sotogrande page';
	$templates['pages/visa-services.php'] = 'Visa services';
	$templates['pages/offPlanById.php'] = 'Off plan project by ID';
	$templates['pages/secondaryById.php'] = 'Secondary project by ID';
	$templates['pages/rentById.php'] = 'Rent property by ID';
	$templates['pages/blog.php'] = 'Specific blog';
	$templates['pages/AllBlogs.php'] = 'All Blogs';
	$templates['pages/off-plan.php'] = 'All off-plan projects';
	$templates['pages/secondary.php'] = 'All secondary projects';
	$templates['pages/rent.php'] = 'All rent properties';
	$templates['pages/map.php'] = 'Map page';
    $templates['pages/liked.php'] = 'Liked page';
	$templates['pages/polygons-secondary.php'] = 'Polygons secondary';
    return $templates;
}
add_filter( 'theme_page_templates', 'custom_register_page_template' );



add_filter( 'rwmb_meta_boxes', 'your_prefix_register_meta_boxes' );

function your_prefix_register_meta_boxes( $meta_boxes ) {
    $prefix = '';

    $meta_boxes[] = [
        'title'   => esc_html__( 'Создание нового блога', 'online-generator' ),
        'id'      => 'untitled',
		'post_types' => ['blog'],
        'context' => 'normal',
        'fields'  => [
            [
                'type' => 'text',
                'name' => esc_html__( 'Название блога', 'online-generator' ),
                'id'   => $prefix . 'nazvanie_bloga',
            ],
            [
				'type' => 'image_advanced',
                'name' => esc_html__( 'Карти��ка блога', 'online-generator' ),
                'id'   => $prefix . 'kartinka_bloga',
				'max_file_uploads' => 1,
            ],
            [
                'type' => 'wysiwyg',
                'name' => esc_html__( 'Описание блога', 'online-generator' ),
                'id'   => $prefix . 'opisanie_bloga',
            ],
        ],
    ];

    return $meta_boxes;
}

function get_all_blog_posts_list() {
    // Define the query arguments
    $args = array(
        'post_type'      => 'blog',
        'posts_per_page' => -1,     
        'post_status'    => 'publish' 
    );

    // Get the posts using WP_Query
    $query = new WP_Query($args);
    $posts_list = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $posts_list[] = array(
                'title' => get_the_title(),
                'id'  => get_the_ID(),
                'date'  => get_the_date(),
				'nazvanie_bloga'=>get_field("nazvanie_bloga"),
				'opisanie'=>get_field("opisanie_bloga"),
				'image'=>wp_get_attachment_url(get_field("kartinka_bloga"))
            );
        }
        wp_reset_postdata(); // Restore the original post data
    }

    return $posts_list;
}


function get_blog_post_by_id($id) {
    // Define the query arguments
    $args = array(
        'post_type'      => 'blog',
        'p'              => $id, // Use the post ID
        'post_status'    => 'publish'
    );

    // Get the post using WP_Query
    $query = new WP_Query($args);
    $post_data = null;

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_data = array(
                'title' => get_the_title(),
                'link'  => get_permalink(),
                'date'  => get_the_date(),
                'content' => get_the_content(),
                'nazvanie_bloga' => get_field("nazvanie_bloga"),
                'opisanie' => get_field("opisanie_bloga"),
                'image' => get_field("kartinka_bloga"), // assuming this returns an image URL
            );
        }
        wp_reset_postdata(); // Restore the original post data
    }

    return $post_data;
}

/**
 * ============================================
 * SIMPLE AI CHAT
 * Minimal chat - just request/response
 * ============================================
 */

// Include Simple AI class
require get_template_directory() . '/inc/simple-ai.php';

// Register REST API endpoint
add_action('rest_api_init', function () {
    register_rest_route('propart/v1', '/simple-chat', array(
        'methods' => 'POST',
        'callback' => 'propart_simple_chat',
        'permission_callback' => '__return_true',
    ));
});

// Handle chat request
function propart_simple_chat($request) {
    $message = $request->get_param('message');
    $history = $request->get_param('history');
    
    if (empty($message)) {
        return new WP_Error('empty_message', 'Введіть повідомлення', array('status' => 400));
    }
    
    // Ensure history is an array
    if (!is_array($history)) {
        $history = array();
    }
    
    $ai = new Simple_AI_Chat();
    $response = $ai->chat($message, $history);
    
    if (!$response['success']) {
        return new WP_Error('chat_error', $response['message'], array('status' => 500));
    }
    
    return new WP_REST_Response($response, 200);
}

// Enqueue scripts
add_action('wp_enqueue_scripts', 'propart_enqueue_simple_chat');

function propart_enqueue_simple_chat() {
    wp_enqueue_script(
        'simple-ai-chat',
        get_template_directory_uri() . '/js/simple-chat.js',
        array('jquery'),
        _S_VERSION,
        true
    );
    
    wp_localize_script('simple-ai-chat', 'simpleAI', array(
        'apiUrl' => home_url('/index.php?rest_route=/propart/v1/simple-chat'),
        'nonce' => wp_create_nonce('wp_rest')
    ));
    
    wp_enqueue_style(
        'simple-ai-chat',
        get_template_directory_uri() . '/css/simple-chat.css',
        array(),
        _S_VERSION
    );
}
