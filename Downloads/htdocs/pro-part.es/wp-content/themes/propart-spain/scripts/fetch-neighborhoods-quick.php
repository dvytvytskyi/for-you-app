<?php
/**
 * Швидка версія: отримання полігонів через Nominatim API
 * Створює прості bbox полігони для всіх районів
 */

// Структура районів з map.php
$areasData = [
    'Estepona' => ['Benavista', 'Costalita', 'Valle Romano', 'El Padron', 'Hacienda del Sol', 'Selwo', 'Atalaya', 'Benamara'],
    'Malaga' => ['Málaga Centro', 'Málaga Este'],
    'Marbella' => ['Sierra Blanca', 'Puerto Banús', 'Nueva Andalucía', 'San Pedro de Alcántara', 'Cortijo Blanco', 'Golden Mile', 'Nagüeles'],
    'Fuengirola' => ['Los Boliches', 'Las Lagunas'],
    'Mijas' => ['La Cala de Mijas', 'Mijas Costa'],
];

class NominatimGeocoder {
    private $nominatimUrl = 'https://nominatim.openstreetmap.org/search';
    private $outputDir;
    
    public function __construct($outputDir) {
        $this->outputDir = $outputDir;
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }
    }
    
    /**
     * Отримати полігон через Nominatim
     */
    public function getPolygon($placeName, $cityName = null, $type = 'city') {
        $query = $placeName;
        if ($cityName) {
            $query .= ", {$cityName}";
        }
        $query .= ", Málaga, Spain";
        
        $url = $this->nominatimUrl . '?' . http_build_query([
            'q' => $query,
            'format' => 'json',
            'polygon_geojson' => 1,
            'limit' => 1,
        ]);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_USERAGENT, 'ProPartSpain/1.0 (contact@pro-part.es)');
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        if ($response) {
            $data = json_decode($response, true);
            if (isset($data[0])) {
                return $this->convertToFeature($data[0], $placeName, $type, $cityName);
            }
        }
        
        return null;
    }
    
    /**
     * Конвертувати Nominatim результат в GeoJSON Feature
     */
    private function convertToFeature($data, $name, $type, $parentCity = null) {
        // Якщо є полігон - використовуємо його
        if (isset($data['geojson'])) {
            $geometry = $data['geojson'];
        } else {
            // Інакше створюємо bbox полігон
            $bbox = $data['boundingbox']; // [minlat, maxlat, minlon, maxlon]
            $geometry = [
                'type' => 'Polygon',
                'coordinates' => [[
                    [$bbox[2], $bbox[0]], // minlon, minlat
                    [$bbox[3], $bbox[0]], // maxlon, minlat
                    [$bbox[3], $bbox[1]], // maxlon, maxlat
                    [$bbox[2], $bbox[1]], // minlon, maxlat
                    [$bbox[2], $bbox[0]], // замкнути
                ]]
            ];
        }
        
        return [
            'type' => 'Feature',
            'properties' => [
                'name' => $name,
                'type' => $type,
                'parent' => $parentCity,
                'osm_id' => $data['osm_id'] ?? null,
                'display_name' => $data['display_name'] ?? $name,
            ],
            'geometry' => $geometry
        ];
    }
    
    /**
     * Створити загальний полігон Costa del Sol
     */
    public function createCostaDelSolPolygon() {
        // Приблизні координати Costa del Sol
        $bounds = [
            'minLat' => 36.3,
            'maxLat' => 36.8,
            'minLon' => -5.3,
            'maxLon' => -4.3,
        ];
        
        return [
            'type' => 'Feature',
            'properties' => [
                'name' => 'Costa del Sol',
                'name_ua' => 'Коста дель Соль',
                'type' => 'region',
                'level' => 1,
            ],
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => [[
                    [$bounds['minLon'], $bounds['minLat']],
                    [$bounds['maxLon'], $bounds['minLat']],
                    [$bounds['maxLon'], $bounds['maxLat']],
                    [$bounds['minLon'], $bounds['maxLat']],
                    [$bounds['minLon'], $bounds['minLat']],
                ]]
            ]
        ];
    }
    
    /**
     * Зберегти GeoJSON у файл
     */
    public function saveGeoJSON($filename, $features) {
        $geojson = [
            'type' => 'FeatureCollection',
            'features' => $features,
        ];
        
        $filepath = $this->outputDir . '/' . $filename;
        file_put_contents($filepath, json_encode($geojson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo "💾 Збережено: {$filepath} (" . count($features) . " features)\n";
    }
}

// ========== ГОЛОВНА ЛОГІКА ==========

echo "🚀 Швидке завантаження GeoJSON полігонів для Costa del Sol\n";
echo "═══════════════════════════════════════════════════════════\n\n";

$outputDir = __DIR__ . '/../data/geojson';
$geocoder = new NominatimGeocoder($outputDir);

$level2Cities = [];
$level3Neighborhoods = [];

// Затримка між запитами (вимога Nominatim)
$requestDelay = 1;

// Обробити кожне місто
foreach ($areasData as $city => $neighborhoods) {
    echo "\n📍 {$city}\n";
    
    // Отримати полігон міста (Рівень 2)
    $cityPolygon = $geocoder->getPolygon($city, null, 'city');
    if ($cityPolygon) {
        $cityPolygon['properties']['level'] = 2;
        $level2Cities[] = $cityPolygon;
        echo "   ✅ Місто знайдено\n";
    } else {
        echo "   ❌ Місто не знайдено\n";
    }
    
    sleep($requestDelay);
    
    // Отримати полігони районів (Рівень 3)
    foreach ($neighborhoods as $neighborhood) {
        $neighborhoodPolygon = $geocoder->getPolygon($neighborhood, $city, 'neighborhood');
        if ($neighborhoodPolygon) {
            $neighborhoodPolygon['properties']['level'] = 3;
            $level3Neighborhoods[] = $neighborhoodPolygon;
            echo "   ✅ {$neighborhood}\n";
        } else {
            echo "   ⚠️  {$neighborhood} - не знайдено\n";
        }
        
        sleep($requestDelay);
    }
}

echo "\n\n═══════════════════════════════════════════════════════════\n";
echo "📊 РЕЗУЛЬТАТИ:\n";
echo "   • Міст (рівень 2): " . count($level2Cities) . "\n";
echo "   • Районів (рівень 3): " . count($level3Neighborhoods) . "\n";
echo "═══════════════════════════════════════════════════════════\n\n";

// Створити загальний полігон Costa del Sol (Рівень 1)
$costaDelSolPolygon = $geocoder->createCostaDelSolPolygon();
$level1Region = [$costaDelSolPolygon];

// Зберегти результати в файли
echo "💾 Збереження GeoJSON файлів...\n";
$geocoder->saveGeoJSON('level-1-region.geojson', $level1Region);
$geocoder->saveGeoJSON('level-2-cities.geojson', $level2Cities);
$geocoder->saveGeoJSON('level-3-neighborhoods.geojson', $level3Neighborhoods);

// Зберегти все разом
$allFeatures = array_merge($level1Region, $level2Cities, $level3Neighborhoods);
$geocoder->saveGeoJSON('costa-del-sol-complete.geojson', $allFeatures);

echo "\n✅ ГОТОВО! Файли збережено в: {$outputDir}\n";
echo "═══════════════════════════════════════════════════════════\n";

