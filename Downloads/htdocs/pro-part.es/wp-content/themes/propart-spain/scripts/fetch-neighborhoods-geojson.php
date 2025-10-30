<?php
/**
 * Скрипт для отримання GeoJSON полігонів районів Costa del Sol з OpenStreetMap
 * Використовує Overpass API для завантаження меж адміністративних одиниць
 */

// Структура районів з map.php
$areasData = [
    'Estepona' => ['Benavista', 'Costalita', 'Valle Romano', 'El Padron', 'Hacienda del Sol', 'Selwo', 'Atalaya', 'Benamara', 'El Presidente', 'Bel Air', 'Cancelada', 'New Golden Mile', 'Diana Park'],
    'Malaga' => ['Alhaurín de la Torre', 'Lauro Golf', 'Málaga', 'Málaga Este', 'Málaga Centro', 'Torremar', 'Playamar', 'Almogía', 'Miraflores'],
    'Marbella' => ['Río Real', 'Las Chapas', 'Santa Clara', 'Hacienda Las Chapas', 'Los Monteros', 'Carib Playa', 'Costabella', 'Torre Real', 'Altos de los Monteros', 'Sierra Blanca', 'Nagüeles', 'Nueva Andalucía', 'Elviria', 'Aloha', 'Puerto de Cabopino', 'The Golden Mile', 'Puerto Banús', 'Artola', 'Los Almendros', 'Bahía de Marbella', 'Marbesa', 'Cabopino', 'Reserva de Marbella', 'Guadalmina Alta', 'Las Brisas', 'El Rosario', 'San Pedro de Alcántara', 'Cortijo Blanco', 'Linda Vista', 'Nueva Alcántara'],
    'Fuengirola' => ['Carvajal', 'Los Boliches', 'Los Pacos', 'Torreblanca', 'Las Lagunas'],
    'Manilva' => ['Punta Chullera', 'La Duquesa', 'San Luis de Sabinillas'],
    'Casares' => ['Casares Playa', 'Casares Pueblo', 'Doña Julia'],
    'Mijas' => ['Campo Mijas', 'La Cala de Mijas', 'Valtocado', 'Riviera del Sol', 'Sierrezuela', 'Calanova Golf', 'Mijas Costa', 'La Cala Golf', 'La Cala Hills', 'Calypso', 'Mijas Golf', 'Cerros del Aguila', 'La Cala'],
    'Benahavis' => ['La Heredia', 'Los Arqueros', 'La Zagaleta', 'El Madroñal', 'Los Flamingos', 'Monte Halcones'],
    'Benalmádena' => ['Benalmadena Pueblo', 'La Capellania', 'Arroyo de la Miel', 'Torremuelle', 'Benalmadena Costa', 'Torrequebrada'],
    'Torremolinos' => ['La Carihuela', 'El Pinillo', 'Playamar', 'Bajondillo', 'Montemar', 'Los Alamos'],
];

class OverpassGeocoder {
    private $overpassUrl = 'https://overpass-api.de/api/interpreter';
    private $outputDir;
    
    public function __construct($outputDir) {
        $this->outputDir = $outputDir;
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }
    }
    
    /**
     * Виконати Overpass запит
     */
    private function queryOverpass($query) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->overpassUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'data=' . urlencode($query));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_USERAGENT, 'ProPartSpain/1.0');
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200 && $response) {
            return json_decode($response, true);
        }
        
        return null;
    }
    
    /**
     * Отримати полігон міста
     */
    public function getCityPolygon($cityName) {
        echo "🔍 Шукаю полігон для міста: {$cityName}...\n";
        
        // Overpass запит для міста в провінції Málaga
        $query = <<<OVERPASS
[out:json][timeout:60];
(
  // Пошук міста як адміністративної одиниці
  area["name"="Málaga"]["admin_level"="6"]->.provincia;
  (
    relation["name"="{$cityName}"]["boundary"="administrative"](area.provincia);
    relation["name:en"="{$cityName}"]["boundary"="administrative"](area.provincia);
  );
);
out geom;
OVERPASS;
        
        $data = $this->queryOverpass($query);
        
        if ($data && isset($data['elements']) && count($data['elements']) > 0) {
            $element = $data['elements'][0];
            $geojson = $this->convertToGeoJSON($element, $cityName, 'city');
            echo "✅ Знайдено полігон для {$cityName}\n";
            return $geojson;
        }
        
        echo "⚠️  Не знайдено полігон для {$cityName}, спробую альтернативний пошук...\n";
        return $this->getCityPolygonAlternative($cityName);
    }
    
    /**
     * Альтернативний пошук міста через назву місця
     */
    private function getCityPolygonAlternative($cityName) {
        $query = <<<OVERPASS
[out:json][timeout:60];
(
  relation["name"="{$cityName}"]["type"="boundary"](36.0,-5.5,37.0,-4.0);
  relation["name:en"="{$cityName}"]["type"="boundary"](36.0,-5.5,37.0,-4.0);
);
out geom;
OVERPASS;
        
        $data = $this->queryOverpass($query);
        
        if ($data && isset($data['elements']) && count($data['elements']) > 0) {
            $element = $data['elements'][0];
            echo "✅ Знайдено альтернативний полігон для {$cityName}\n";
            return $this->convertToGeoJSON($element, $cityName, 'city');
        }
        
        echo "❌ Не вдалося знайти полігон для {$cityName}\n";
        return null;
    }
    
    /**
     * Отримати полігон району
     */
    public function getNeighborhoodPolygon($neighborhoodName, $cityName) {
        echo "   🔍 Шукаю полігон для району: {$neighborhoodName} ({$cityName})...\n";
        
        $query = <<<OVERPASS
[out:json][timeout:60];
(
  // Пошук району за назвою поблизу міста
  (
    way["name"="{$neighborhoodName}"]["place"~"suburb|neighbourhood"](36.0,-5.5,37.0,-4.0);
    relation["name"="{$neighborhoodName}"]["place"~"suburb|neighbourhood"](36.0,-5.5,37.0,-4.0);
    relation["name"="{$neighborhoodName}"]["boundary"="administrative"]["admin_level"~"9|10"](36.0,-5.5,37.0,-4.0);
  );
);
out geom;
OVERPASS;
        
        $data = $this->queryOverpass($query);
        
        if ($data && isset($data['elements']) && count($data['elements']) > 0) {
            $element = $data['elements'][0];
            echo "   ✅ Знайдено полігон для {$neighborhoodName}\n";
            return $this->convertToGeoJSON($element, $neighborhoodName, 'neighborhood', $cityName);
        }
        
        echo "   ⚠️  Не знайдено полігон для {$neighborhoodName}\n";
        return null;
    }
    
    /**
     * Конвертувати OSM element в GeoJSON Feature
     */
    private function convertToGeoJSON($element, $name, $type, $parentCity = null) {
        $coordinates = [];
        
        if (isset($element['members'])) {
            // Це relation з members
            foreach ($element['members'] as $member) {
                if ($member['role'] === 'outer' && isset($member['geometry'])) {
                    $ring = [];
                    foreach ($member['geometry'] as $point) {
                        $ring[] = [$point['lon'], $point['lat']];
                    }
                    if (count($ring) > 0) {
                        // Замкнути полігон
                        if ($ring[0] !== $ring[count($ring) - 1]) {
                            $ring[] = $ring[0];
                        }
                        $coordinates[] = $ring;
                    }
                }
            }
        } elseif (isset($element['geometry'])) {
            // Це way з geometry
            $ring = [];
            foreach ($element['geometry'] as $point) {
                $ring[] = [$point['lon'], $point['lat']];
            }
            if (count($ring) > 0) {
                if ($ring[0] !== $ring[count($ring) - 1]) {
                    $ring[] = $ring[0];
                }
                $coordinates[] = $ring;
            }
        }
        
        if (empty($coordinates)) {
            return null;
        }
        
        return [
            'type' => 'Feature',
            'properties' => [
                'name' => $name,
                'type' => $type,
                'parent' => $parentCity,
                'osm_id' => $element['id'] ?? null,
            ],
            'geometry' => [
                'type' => count($coordinates) > 1 ? 'MultiPolygon' : 'Polygon',
                'coordinates' => count($coordinates) > 1 ? [$coordinates] : $coordinates,
            ]
        ];
    }
    
    /**
     * Створити GeoJSON для Costa del Sol (загальний рівень)
     */
    public function createCostaDelSolPolygon($cityPolygons) {
        echo "\n🔨 Створюю загальний полігон Costa del Sol...\n";
        
        // Об'єднати всі міські полігони в один MultiPolygon
        $allCoordinates = [];
        foreach ($cityPolygons as $feature) {
            if ($feature && isset($feature['geometry']['coordinates'])) {
                if ($feature['geometry']['type'] === 'Polygon') {
                    $allCoordinates[] = $feature['geometry']['coordinates'];
                } elseif ($feature['geometry']['type'] === 'MultiPolygon') {
                    foreach ($feature['geometry']['coordinates'] as $polygon) {
                        $allCoordinates[] = $polygon;
                    }
                }
            }
        }
        
        if (empty($allCoordinates)) {
            echo "❌ Не вдалося створити загальний полігон\n";
            return null;
        }
        
        return [
            'type' => 'Feature',
            'properties' => [
                'name' => 'Costa del Sol',
                'name_ua' => 'Коста дель Соль',
                'type' => 'region',
                'level' => 1,
            ],
            'geometry' => [
                'type' => 'MultiPolygon',
                'coordinates' => [$allCoordinates],
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
        echo "💾 Збережено: {$filepath}\n";
    }
}

// ========== ГОЛОВНА ЛОГІКА ==========

echo "🚀 Початок завантаження GeoJSON полігонів для Costa del Sol\n";
echo "═══════════════════════════════════════════════════════════\n\n";

$outputDir = __DIR__ . '/../data/geojson';
$geocoder = new OverpassGeocoder($outputDir);

$level2Cities = []; // Рівень 2: міста
$level3Neighborhoods = []; // Рівень 3: райони

// Затримка між запитами (щоб не перевантажувати Overpass API)
$requestDelay = 2; // секунди

// Обробити кожне місто
foreach ($areasData as $city => $neighborhoods) {
    echo "\n📍 Обробка міста: {$city}\n";
    echo "───────────────────────────────────\n";
    
    // Отримати полігон міста (Рівень 2)
    $cityPolygon = $geocoder->getCityPolygon($city);
    if ($cityPolygon) {
        $cityPolygon['properties']['level'] = 2;
        $level2Cities[] = $cityPolygon;
    }
    
    sleep($requestDelay);
    
    // Отримати полігони районів (Рівень 3)
    foreach ($neighborhoods as $neighborhood) {
        $neighborhoodPolygon = $geocoder->getNeighborhoodPolygon($neighborhood, $city);
        if ($neighborhoodPolygon) {
            $neighborhoodPolygon['properties']['level'] = 3;
            $level3Neighborhoods[] = $neighborhoodPolygon;
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
$costaDelSolPolygon = $geocoder->createCostaDelSolPolygon($level2Cities);
$level1Region = $costaDelSolPolygon ? [$costaDelSolPolygon] : [];

// Зберегти результати в файли
echo "💾 Збереження GeoJSON файлів...\n";
$geocoder->saveGeoJSON('level-1-region.geojson', $level1Region);
$geocoder->saveGeoJSON('level-2-cities.geojson', $level2Cities);
$geocoder->saveGeoJSON('level-3-neighborhoods.geojson', $level3Neighborhoods);

// Зберегти все разом
$allFeatures = array_merge($level1Region, $level2Cities, $level3Neighborhoods);
$geocoder->saveGeoJSON('costa-del-sol-complete.geojson', $allFeatures);

echo "\n✅ ГОТОВО! Усі файли збережено в: {$outputDir}\n";
echo "═══════════════════════════════════════════════════════════\n";

