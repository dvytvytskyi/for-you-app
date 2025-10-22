<?php
/**
 * PDF Generator for Properties
 * Використовує mPDF для створення красивих PDF з даними проектів
 */

// Підключаємо autoloader mPDF
$autoloader_path = get_template_directory() . '/vendor/autoload.php';
if (!file_exists($autoloader_path)) {
    error_log('PDF Generator Error: autoloader not found at ' . $autoloader_path);
    add_action('admin_notices', function() {
        echo '<div class="error"><p>PDF Generator: mPDF library not found. Run composer install.</p></div>';
    });
    return;
}
require_once $autoloader_path;

/**
 * Генерує PDF для проекту
 */
function generate_property_pdf($project_data) {
    try {
        error_log('PDF Generation started for: ' . ($project_data['name'] ?? 'Unknown'));
        
        // Перевіряємо, чи клас mPDF доступний
        if (!class_exists('\Mpdf\Mpdf')) {
            throw new Exception('mPDF class not found. Check autoloader.');
        }
        
        // Створюємо екземпляр mPDF з базовими налаштуваннями
        $mpdf = new \Mpdf\Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 20,
            'margin_bottom' => 20,
            'margin_header' => 10,
            'margin_footer' => 10,
            'default_font' => 'dejavusans', // Підтримує кирилицю
            'tempDir' => sys_get_temp_dir()
        ]);

        error_log('mPDF instance created successfully');

        // Встановлюємо метадані PDF
        $mpdf->SetTitle('Property Details - ' . sanitize_text_field($project_data['name']));
        $mpdf->SetAuthor('Pro-Part Spain');
        $mpdf->SetCreator('Pro-Part Spain Real Estate');
        $mpdf->SetSubject('Property Information');

        // Генруємо HTML контент
        $html = generate_pdf_html($project_data);
        
        error_log('HTML generated, length: ' . strlen($html));
        
        // Записуємо HTML в PDF
        $mpdf->WriteHTML($html);
        
        error_log('PDF WriteHTML completed');
        
        // Повертаємо PDF як string
        $output = $mpdf->Output('', 'S');
        
        error_log('PDF generated successfully, size: ' . strlen($output) . ' bytes');
        
        return $output;
        
    } catch (\Mpdf\MpdfException $e) {
        error_log('PDF mPDF Exception: ' . $e->getMessage());
        error_log('Stack trace: ' . $e->getTraceAsString());
        return false;
    } catch (Exception $e) {
        error_log('PDF General Exception: ' . $e->getMessage());
        error_log('Stack trace: ' . $e->getTraceAsString());
        return false;
    }
}

/**
 * Генерує HTML для PDF
 */
function generate_pdf_html($data) {
    error_log('Generating PDF HTML for: ' . ($data['name'] ?? 'Unknown'));
    
    // Отримуємо URL логотипу
    $logo_url = get_template_directory_uri() . '/icons/shared/logo1.png';
    $logo_path = get_template_directory() . '/icons/shared/logo1.png';
    
    // Конвертуємо зображення в base64 для вставки в PDF (з обмеженням розміру)
    $logo_base64 = '';
    if (file_exists($logo_path) && filesize($logo_path) < 500000) { // Макс 500KB
        $logo_data = @file_get_contents($logo_path);
        if ($logo_data !== false) {
            $logo_base64 = 'data:image/png;base64,' . base64_encode($logo_data);
        }
    } else {
        error_log('Logo file not found or too large: ' . $logo_path);
    }

    // Форматуємо ціну
    $price = !empty($data['price']) ? number_format($data['price'], 0, ',', ' ') . ' €' : 'За запитом';
    $price_per_m2 = !empty($data['priceForM']) ? number_format($data['priceForM'], 0, ',', ' ') . ' €/m²' : '-';
    
    // Створюємо HTML
    $html = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page {
                margin: 0;
                background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
            }
            body {
                font-family: DejaVuSans, sans-serif;
                color: #333;
                line-height: 1.6;
                padding: 0;
                margin: 0;
            }
            .header {
                background: linear-gradient(135deg, #dba77b 0%, #c9935f 100%);
                color: white;
                padding: 30px;
                text-align: center;
                margin-bottom: 0;
            }
            .logo {
                max-width: 140px;
                margin-bottom: 25px;
                margin-top: 10px;
            }
            .header h1 {
                margin: 20px 0 15px 0;
                font-size: 36px;
                font-weight: bold;
                color: white;
                line-height: 1.3;
            }
            .header p {
                margin: 10px 0 20px 0;
                font-size: 18px;
                color: white;
                font-weight: 500;
            }
            .container {
                padding: 0 30px 30px 30px;
            }
            .photo-gallery {
                margin: 10px 30px 20px 30px;
            }
            .photo-gallery img {
                width: 100%;
                height: 200px;
                display: block;
                border-radius: 8px;
                margin-bottom: 8px;
                object-fit: cover;
                object-position: center;
                page-break-inside: avoid;
                page-break-before: auto;
            }
            .price-block {
                background: linear-gradient(135deg, #dba77b 0%, #c9935f 100%);
                color: white;
                padding: 25px 30px;
                border-radius: 10px;
                margin-bottom: 15px;
                text-align: center;
                page-break-inside: avoid;
            }
            .price-block h2 {
                margin: 0 0 8px 0;
                font-size: 42px;
                font-weight: bold;
            }
            .price-block p {
                margin: 0;
                font-size: 15px;
                opacity: 0.95;
            }
            .details-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                page-break-inside: avoid;
            }
            .details-table tr {
                border-bottom: 1px solid #e9ecef;
            }
            .details-table tr:last-child {
                border-bottom: none;
            }
            .details-table td {
                padding: 12px 20px;
                vertical-align: middle;
            }
            .details-table td:first-child {
                width: 40%;
                font-size: 11px;
                color: #6c757d;
                text-transform: uppercase;
                font-weight: 600;
                letter-spacing: 0.5px;
                background: #f8f9fa;
            }
            .details-table td:last-child {
                font-size: 16px;
                color: #2c3e50;
                font-weight: 600;
            }
            .section {
                margin-bottom: 15px;
                page-break-inside: avoid;
            }
            .section-title {
                font-size: 18px;
                color: #dba77b;
                border-left: 4px solid #dba77b;
                padding-left: 15px;
                margin-bottom: 12px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .description {
                background: white;
                padding: 20px;
                border-radius: 8px;
                font-size: 13px;
                line-height: 1.9;
                color: #444;
                border: 1px solid #e9ecef;
                text-align: justify;
            }
            .amenities {
                background: white;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }
            .amenity-item {
                display: inline-block;
                background: #f8f9fa;
                padding: 8px 16px;
                margin: 4px 6px 4px 0;
                border-radius: 20px;
                font-size: 12px;
                color: #2c3e50;
                border: 1px solid #dee2e6;
            }
            .footer {
                margin-top: 25px;
                padding: 25px 30px;
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                color: white;
                text-align: center;
                border-radius: 10px;
            }
            .footer p {
                margin: 6px 0;
                font-size: 13px;
            }
            .footer strong {
                font-size: 16px;
                color: #dba77b;
            }
            .contact-info {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid rgba(255,255,255,0.2);
            }
            .contact-info p {
                margin: 5px 0;
                font-size: 13px;
            }
        </style>
    </head>
    <body>
        <div class="header">';
    
    if ($logo_base64) {
        $html .= '
            <img src="' . $logo_base64 . '" class="logo" alt="Pro-Part Spain">';
    }
    
    $html .= '
            <h1>' . htmlspecialchars($data['name']) . '</h1>
            <p>' . htmlspecialchars($data['location']) . '</p>
        </div>';
    
    // Фотогалерея (таблиця 2x2)
    if (!empty($data['galleryImages']) && is_array($data['galleryImages']) && count($data['galleryImages']) > 0) {
        error_log('PDF Gallery: Processing ' . count($data['galleryImages']) . ' images');
        
        // Збираємо base64 фото
        $images_base64 = [];
        $photo_count = 0;
        
        foreach ($data['galleryImages'] as $index => $image_url) {
            if (empty($image_url)) continue;
            if ($photo_count >= 4) break; // Максимум 4 фото
            
            error_log('PDF Gallery Image ' . ($index + 1) . ': ' . $image_url);
            
            // Завантажуємо зображення та конвертуємо в base64
            $image_base64 = '';
            
            if (function_exists('curl_init')) {
                $ch = curl_init($image_url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 10);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
                
                $image_data = curl_exec($ch);
                $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
                
                if ($http_code === 200 && $image_data !== false && strlen($image_data) > 0) {
                    // Стискаємо зображення
                    $img = @imagecreatefromstring($image_data);
                    if ($img !== false) {
                        $width = imagesx($img);
                        $height = imagesy($img);
                        $max_width = 800;
                        
                        if ($width > $max_width) {
                            $ratio = $max_width / $width;
                            $new_width = $max_width;
                            $new_height = (int)($height * $ratio);
                        } else {
                            $new_width = $width;
                            $new_height = $height;
                        }
                        
                        $resized = imagecreatetruecolor($new_width, $new_height);
                        imagecopyresampled($resized, $img, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
                        
                        ob_start();
                        imagejpeg($resized, null, 75);
                        $compressed_data = ob_get_clean();
                        
                        imagedestroy($img);
                        imagedestroy($resized);
                        
                        $image_base64 = 'data:image/jpeg;base64,' . base64_encode($compressed_data);
                        error_log('PDF Gallery Image ' . ($photo_count + 1) . ' compressed: ' . strlen($image_data) . ' → ' . strlen($compressed_data) . ' bytes');
                    }
                }
            }
            
            if (!empty($image_base64)) {
                $images_base64[] = $image_base64;
                $photo_count++;
            }
        }
        
        // Генеруємо HTML - просто фото одне за одним
        if (count($images_base64) > 0) {
            $html .= '
        <div class="photo-gallery">';
            
            foreach ($images_base64 as $i => $img_src) {
                $html .= '<img src="' . $img_src . '" alt="Property Photo ' . ($i + 1) . '">';
            }
            
            $html .= '
        </div>';
            
            error_log('PDF Gallery: Added ' . count($images_base64) . ' images to HTML');
        }
    } else {
        error_log('PDF Gallery: No images found in data');
    }
    
    $html .= '
        <div class="container">
            <div class="price-block">
                <p>Price from</p>
                <h2>' . $price . '</h2>
                <p>Price per m²: ' . $price_per_m2 . '</p>
            </div>
            
            <table class="details-table">
                <tr>
                    <td>Condition</td>
                    <td>' . htmlspecialchars($data['condition'] ?? 'Off plan') . '</td>
                </tr>
                <tr>
                    <td>Type</td>
                    <td>' . htmlspecialchars($data['type'] ?? '-') . '</td>
                </tr>
                <tr>
                    <td>Bedrooms</td>
                    <td>' . htmlspecialchars($data['rooms'] ?? '-') . '</td>
                </tr>
                <tr>
                    <td>Area</td>
                    <td>' . htmlspecialchars($data['size'] ?? '-') . ' m²</td>
                </tr>
                <tr>
                    <td>Floor</td>
                    <td>' . htmlspecialchars($data['floor'] ?? '-') . '</td>
                </tr>
                <tr>
                    <td>Handover</td>
                    <td>' . htmlspecialchars($data['handover'] ?? '-') . '</td>
                </tr>
            </table>';
    
    // Опис проекту
    if (!empty($data['description'])) {
        $html .= '
            <div class="section">
                <h2 class="section-title">About the Project</h2>
                <div class="description">
                    ' . nl2br(htmlspecialchars($data['description'])) . '
                </div>
            </div>';
    }
    
    // Зручності
    if (!empty($data['amenities']) && is_array($data['amenities'])) {
        $html .= '
            <div class="section">
                <h2 class="section-title">Amenities</h2>
                <div class="amenities">';
        foreach ($data['amenities'] as $amenity) {
            $html .= '<span class="amenity-item">' . htmlspecialchars($amenity) . '</span>';
        }
        $html .= '
                </div>
            </div>';
    }
    
    $html .= '
            <div class="footer">
                <p><strong>Pro-Part Spain Real Estate</strong></p>
                <p>Your Trusted Partner in Spanish Real Estate</p>
                <div class="contact-info">
                    <p>📞 +34 695 113 333</p>
                    <p>🌐 www.pro-part.es</p>
                    <p>📧 info@pro-part.es</p>
                </div>
                <p style="margin-top: 15px; font-size: 11px; opacity: 0.8;">
                    Generated: ' . date('d.m.Y H:i') . '
                </p>
            </div>
        </div>
    </body>
    </html>';
    
    return $html;
}

/**
 * AJAX handler для генерації PDF
 */
function handle_generate_pdf_ajax() {
    try {
        error_log('PDF AJAX handler called');
        error_log('POST data: ' . print_r($_POST, true));
        
        // Перевіряємо nonce для безпеки
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'generate_pdf_nonce')) {
            error_log('PDF: Security check failed');
            wp_send_json_error(['message' => 'Security check failed']);
            return;
        }
        
        error_log('PDF: Security check passed');
        
        // Отримуємо дані проекту з POST
        // Зверніть увагу: масиви можуть прийти як 'key[]' або просто 'key'
        $gallery_images = [];
        if (isset($_POST['galleryImages']) && is_array($_POST['galleryImages'])) {
            $gallery_images = array_map('esc_url_raw', $_POST['galleryImages']);
        }
        
        $amenities = [];
        if (isset($_POST['amenities']) && is_array($_POST['amenities'])) {
            $amenities = array_map('sanitize_text_field', $_POST['amenities']);
        }
        
        $project_data = [
            'name' => sanitize_text_field($_POST['name'] ?? 'Untitled Project'),
            'location' => sanitize_text_field($_POST['location'] ?? ''),
            'price' => floatval($_POST['price'] ?? 0),
            'priceForM' => floatval($_POST['priceForM'] ?? 0),
            'condition' => sanitize_text_field($_POST['condition'] ?? ''),
            'type' => sanitize_text_field($_POST['type'] ?? ''),
            'rooms' => sanitize_text_field($_POST['rooms'] ?? ''),
            'size' => sanitize_text_field($_POST['size'] ?? ''),
            'floor' => sanitize_text_field($_POST['floor'] ?? ''),
            'totalFloors' => sanitize_text_field($_POST['totalFloors'] ?? ''),
            'handover' => sanitize_text_field($_POST['handover'] ?? ''),
            'description' => sanitize_textarea_field($_POST['description'] ?? ''),
            'mainImage' => esc_url_raw($_POST['mainImage'] ?? ''),
            'galleryImages' => $gallery_images,
            'amenities' => $amenities
        ];
        
        error_log('Gallery images received: ' . count($gallery_images));
        
        error_log('PDF: Project data collected: ' . $project_data['name']);
        
        // Генеруємо PDF
        $pdf_content = generate_property_pdf($project_data);
        
        if ($pdf_content === false) {
            error_log('PDF: Generation failed');
            wp_send_json_error(['message' => 'Failed to generate PDF. Check error log.']);
            return;
        }
        
        error_log('PDF: Content generated, size: ' . strlen($pdf_content));
        
        // Створюємо унікальне ім'я файлу
        $filename = sanitize_file_name($project_data['name']) . '-' . date('Y-m-d-His') . '.pdf';
        
        // Зберігаємо тимчасово
        $upload_dir = wp_upload_dir();
        $temp_dir = $upload_dir['basedir'] . '/temp-pdfs/';
        
        if (!file_exists($temp_dir)) {
            if (!wp_mkdir_p($temp_dir)) {
                error_log('PDF: Failed to create temp directory: ' . $temp_dir);
                wp_send_json_error(['message' => 'Failed to create temp directory']);
                return;
            }
        }
        
        $temp_file = $temp_dir . $filename;
        $written = file_put_contents($temp_file, $pdf_content);
        
        if ($written === false) {
            error_log('PDF: Failed to write file: ' . $temp_file);
            wp_send_json_error(['message' => 'Failed to save PDF file']);
            return;
        }
        
        error_log('PDF: File saved successfully: ' . $temp_file);
        
        // Повертаємо URL для завантаження
        $download_url = add_query_arg([
            'action' => 'download_pdf',
            'file' => urlencode($filename),
            'nonce' => wp_create_nonce('download_pdf_' . $filename)
        ], admin_url('admin-ajax.php'));
        
        error_log('PDF: Sending success response with URL: ' . $download_url);
        
        wp_send_json_success([
            'download_url' => $download_url,
            'filename' => $filename
        ]);
        
    } catch (Exception $e) {
        error_log('PDF AJAX Exception: ' . $e->getMessage());
        error_log('Stack trace: ' . $e->getTraceAsString());
        wp_send_json_error(['message' => 'Exception: ' . $e->getMessage()]);
    }
}
add_action('wp_ajax_generate_property_pdf', 'handle_generate_pdf_ajax');
add_action('wp_ajax_nopriv_generate_property_pdf', 'handle_generate_pdf_ajax');

/**
 * Handler для завантаження PDF
 */
function handle_download_pdf() {
    $filename = isset($_GET['file']) ? sanitize_file_name($_GET['file']) : '';
    $nonce = isset($_GET['nonce']) ? $_GET['nonce'] : '';
    
    if (empty($filename) || !wp_verify_nonce($nonce, 'download_pdf_' . $filename)) {
        wp_die('Invalid request');
    }
    
    $upload_dir = wp_upload_dir();
    $file_path = $upload_dir['basedir'] . '/temp-pdfs/' . $filename;
    
    if (!file_exists($file_path)) {
        wp_die('File not found');
    }
    
    // Відправляємо файл
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . filesize($file_path));
    header('Cache-Control: private, max-age=0, must-revalidate');
    header('Pragma: public');
    
    readfile($file_path);
    
    // Видаляємо тимчасовий файл
    @unlink($file_path);
    
    exit;
}
add_action('wp_ajax_download_pdf', 'handle_download_pdf');
add_action('wp_ajax_nopriv_download_pdf', 'handle_download_pdf');

/**
 * Очищення старих PDF файлів (запускається щодня)
 */
function cleanup_old_pdfs() {
    $upload_dir = wp_upload_dir();
    $temp_dir = $upload_dir['basedir'] . '/temp-pdfs/';
    
    if (!file_exists($temp_dir)) {
        return;
    }
    
    $files = glob($temp_dir . '*.pdf');
    $now = time();
    
    foreach ($files as $file) {
        if (is_file($file)) {
            // Видаляємо файли старші 1 години
            if ($now - filemtime($file) >= 3600) {
                @unlink($file);
            }
        }
    }
}
add_action('wp_scheduled_delete', 'cleanup_old_pdfs');


