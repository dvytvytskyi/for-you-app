<?php
/**
 * Тестовий файл для перевірки mPDF
 * Відкрийте: localhost:8000/wp-content/themes/propart-spain/test-pdf.php
 */

// Підключаємо WordPress
require_once('../../../../../wp-load.php');

echo "<h1>PDF Generator Test</h1>";

// Перевіряємо autoloader
$autoloader_path = get_template_directory() . '/vendor/autoload.php';
echo "<p>Autoloader path: $autoloader_path</p>";

if (!file_exists($autoloader_path)) {
    die("<p style='color:red'>ERROR: Autoloader not found!</p>");
}
echo "<p style='color:green'>✓ Autoloader exists</p>";

require_once $autoloader_path;

// Перевіряємо клас mPDF
if (!class_exists('\Mpdf\Mpdf')) {
    die("<p style='color:red'>ERROR: mPDF class not found!</p>");
}
echo "<p style='color:green'>✓ mPDF class loaded</p>";

// Спробуємо створити простий PDF
try {
    echo "<p>Creating mPDF instance...</p>";
    
    $mpdf = new \Mpdf\Mpdf([
        'mode' => 'utf-8',
        'format' => 'A4',
        'tempDir' => sys_get_temp_dir()
    ]);
    
    echo "<p style='color:green'>✓ mPDF instance created</p>";
    
    $html = '<h1>Тестовий PDF</h1><p>Це працює! Ukrainian text works: Привіт!</p>';
    
    echo "<p>Writing HTML...</p>";
    $mpdf->WriteHTML($html);
    
    echo "<p style='color:green'>✓ HTML written</p>";
    
    echo "<p>Generating PDF...</p>";
    $output = $mpdf->Output('test.pdf', 'S');
    
    echo "<p style='color:green'>✓ PDF generated! Size: " . strlen($output) . " bytes</p>";
    
    // Зберігаємо файл
    $test_file = sys_get_temp_dir() . '/test-pdf-' . time() . '.pdf';
    file_put_contents($test_file, $output);
    
    echo "<p style='color:green'>✓ PDF saved to: $test_file</p>";
    echo "<p><a href='data:application/pdf;base64," . base64_encode($output) . "' download='test.pdf'>Download Test PDF</a></p>";
    
    echo "<hr><h2 style='color:green'>✓ ALL TESTS PASSED!</h2>";
    
} catch (Exception $e) {
    echo "<p style='color:red'>ERROR: " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

