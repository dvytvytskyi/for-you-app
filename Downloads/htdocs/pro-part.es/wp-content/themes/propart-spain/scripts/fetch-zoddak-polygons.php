<?php
/**
 * Парсер полігонів районів з Zoddak Properties
 * Логінується та отримує GeoJSON полігони з їхньої карти
 */

class ZoddakPolygonFetcher {
    private $loginUrl = 'https://app.zoddak.com/api/auth/login';
    private $propertiesUrl = 'https://app.zoddak.com/api/properties';
    private $cookieFile;
    private $session;
    private $outputDir;
    
    public function __construct($outputDir) {
        $this->outputDir = $outputDir;
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }
        $this->cookieFile = sys_get_temp_dir() . '/zoddak_cookies.txt';
    }
    
    /**
     * Логін в систему Zoddak
     */
    public function login($email, $password) {
        echo "🔐 Логінюсь в Zoddak...\n";
        
        $ch = curl_init($this->loginUrl);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_COOKIEJAR => $this->cookieFile,
            CURLOPT_COOKIEFILE => $this->cookieFile,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Accept: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode([
                'email' => $email,
                'password' => $password
            ]),
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200 || $httpCode === 201) {
            $data = json_decode($response, true);
            if (isset($data['token']) || isset($data['access_token'])) {
                echo "✅ Успішний логін\n";
                return true;
            }
        }
        
        echo "❌ Помилка логіну. HTTP Code: $httpCode\n";
        echo "Response: $response\n";
        return false;
    }
    
    /**
     * Отримати дані про властивості та райони
     */
    public function fetchProperties($filters = []) {
        echo "📥 Завантаження даних про властивості...\n";
        
        $url = $this->propertiesUrl;
        if (!empty($filters)) {
            $url .= '?' . http_build_query($filters);
        }
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_COOKIEFILE => $this->cookieFile,
            CURLOPT_COOKIEJAR => $this->cookieFile,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'Content-Type: application/json',
            ],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $data = json_decode($response, true);
            echo "✅ Отримано дані: " . count($data['properties'] ?? []) . " властивостей\n";
            return $data;
        }
        
        echo "❌ Помилка отримання даних. HTTP Code: $httpCode\n";
        echo "Response: $response\n";
        return null;
    }
    
    /**
     * Спробувати знайти API endpoint для карт/полігонів
     */
    public function fetchMapData() {
        echo "🗺️ Пошук даних карти...\n";
        
        // Можливі endpoints для карт
        $endpoints = [
            'https://app.zoddak.com/api/map/polygons',
            'https://app.zoddak.com/api/zones',
            'https://app.zoddak.com/api/areas',
            'https://app.zoddak.com/api/locations',
            'https://app.zoddak.com/api/properties/map',
            'https://app.zoddak.com/api/geojson',
        ];
        
        foreach ($endpoints as $endpoint) {
            echo "   Спробую: $endpoint\n";
            $ch = curl_init($endpoint);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_COOKIEFILE => $this->cookieFile,
                CURLOPT_COOKIEJAR => $this->cookieFile,
                CURLOPT_HTTPHEADER => [
                    'Accept: application/json',
                ],
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode === 200) {
                $data = json_decode($response, true);
                if ($data && (isset($data['features']) || isset($data['polygons']) || isset($data['zones']))) {
                    echo "   ✅ Знайдено дані на: $endpoint\n";
                    return $data;
                }
            }
        }
        
        return null;
    }
    
    /**
     * Конвертувати дані Zoddak в GeoJSON формат
     */
    public function convertToGeoJSON($zoddakData) {
        $features = [];
        
        // Різні формати відповідей
        if (isset($zoddakData['features'])) {
            // Вже GeoJSON формат
            return [
                'type' => 'FeatureCollection',
                'features' => $zoddakData['features']
            ];
        }
        
        if (isset($zoddakData['polygons'])) {
            foreach ($zoddakData['polygons'] as $polygon) {
                $features[] = $this->createFeature($polygon);
            }
        }
        
        if (isset($zoddakData['zones'])) {
            foreach ($zoddakData['zones'] as $zone) {
                $features[] = $this->createFeatureFromZone($zone);
            }
        }
        
        if (isset($zoddakData['properties'])) {
            // Групування по районах
            $grouped = [];
            foreach ($zoddakData['properties'] as $prop) {
                $area = $prop['area'] ?? $prop['zone'] ?? $prop['location'] ?? 'unknown';
                if (!isset($grouped[$area])) {
                    $grouped[$area] = [];
                }
                $grouped[$area][] = $prop;
            }
            
            // Створюємо полігони для кожного району
            foreach ($grouped as $areaName => $properties) {
                $polygon = $this->createPolygonFromProperties($properties, $areaName);
                if ($polygon) {
                    $features[] = $polygon;
                }
            }
        }
        
        return [
            'type' => 'FeatureCollection',
            'features' => $features
        ];
    }
    
    /**
     * Створити Feature з полігону
     */
    private function createFeature($polygon) {
        return [
            'type' => 'Feature',
            'properties' => [
                'name' => $polygon['name'] ?? $polygon['title'] ?? 'Unknown',
                'type' => $polygon['type'] ?? 'district',
                'level' => $polygon['level'] ?? 3,
                'parent' => $polygon['parent'] ?? null,
            ],
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => $this->normalizeCoordinates($polygon['coordinates'] ?? $polygon['path'] ?? [])
            ]
        ];
    }
    
    /**
     * Створити Feature з zone
     */
    private function createFeatureFromZone($zone) {
        return [
            'type' => 'Feature',
            'id' => $zone['id'] ?? null,
            'properties' => [
                'name' => $zone['name'] ?? $zone['title'] ?? 'Unknown',
                'type' => 'district',
                'level' => 3,
                'parent' => $zone['city'] ?? $zone['parent'] ?? null,
            ],
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => $this->normalizeCoordinates($zone['coordinates'] ?? $zone['polygon'] ?? $zone['bounds'] ?? [])
            ]
        ];
    }
    
    /**
     * Нормалізувати координати (конвертувати [lat, lon] в [lon, lat] якщо потрібно)
     */
    private function normalizeCoordinates($coords) {
        if (empty($coords)) return [[]];
        
        // Якщо це вже правильний формат
        if (isset($coords[0][0]) && is_array($coords[0][0])) {
            $normalized = [];
            foreach ($coords as $ring) {
                $normalizedRing = [];
                foreach ($ring as $point) {
                    // Якщо lat > 90, значить це lon, lat - залишаємо як є
                    // Якщо lat < 90, можливо це lat, lon - перевертаємо
                    if (abs($point[0]) > 90 || abs($point[1]) < 90) {
                        $normalizedRing[] = [$point[1], $point[0]]; // Перевертаємо
                    } else {
                        $normalizedRing[] = $point; // Залишаємо як є
                    }
                }
                // Замикаємо полігон
                if ($normalizedRing[0] !== $normalizedRing[count($normalizedRing) - 1]) {
                    $normalizedRing[] = $normalizedRing[0];
                }
                $normalized[] = $normalizedRing;
            }
            return count($normalized) === 1 ? $normalized[0] : $normalized;
        }
        
        return [[]];
    }
    
    /**
     * Створити полігон з властивостей (convex hull або bounding box)
     */
    private function createPolygonFromProperties($properties, $areaName) {
        if (empty($properties)) return null;
        
        $lats = [];
        $lons = [];
        
        foreach ($properties as $prop) {
            if (isset($prop['latitude']) && isset($prop['longitude'])) {
                $lats[] = floatval($prop['latitude']);
                $lons[] = floatval($prop['longitude']);
            } elseif (isset($prop['lat']) && isset($prop['lng'])) {
                $lats[] = floatval($prop['lat']);
                $lons[] = floatval($prop['lng']);
            } elseif (isset($prop['coordinates'])) {
                $coords = $prop['coordinates'];
                $lats[] = floatval($coords[1] ?? $coords[0]);
                $lons[] = floatval($coords[0] ?? $coords[1]);
            }
        }
        
        if (empty($lats)) return null;
        
        // Створюємо bounding box з padding
        $minLat = min($lats);
        $maxLat = max($lats);
        $minLon = min($lons);
        $maxLon = max($lons);
        
        // Додаємо padding (5%)
        $latPadding = ($maxLat - $minLat) * 0.05;
        $lonPadding = ($maxLon - $minLon) * 0.05;
        
        return [
            'type' => 'Feature',
            'properties' => [
                'name' => $areaName,
                'type' => 'district',
                'level' => 3,
            ],
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => [[
                    [$minLon - $lonPadding, $minLat - $latPadding],
                    [$maxLon + $lonPadding, $minLat - $latPadding],
                    [$maxLon + $lonPadding, $maxLat + $latPadding],
                    [$minLon - $lonPadding, $maxLat + $latPadding],
                    [$minLon - $lonPadding, $minLat - $latPadding], // Замикаємо
                ]]
            ]
        ];
    }
    
    /**
     * Зберегти GeoJSON у файл
     */
    public function saveGeoJSON($filename, $geojson) {
        $filepath = $this->outputDir . '/' . $filename;
        file_put_contents($filepath, json_encode($geojson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo "💾 Збережено: $filepath\n";
    }
    
    /**
     * Дослідити структуру API (знайти правильні endpoints)
     */
    public function exploreAPI() {
        echo "🔍 Досліджую API структуру...\n";
        
        // Спробуємо різні endpoints
        $testEndpoints = [
            '/api/properties',
            '/api/map',
            '/api/locations',
            '/api/zones',
            '/api/areas',
            '/api/districts',
        ];
        
        foreach ($testEndpoints as $endpoint) {
            $url = 'https://app.zoddak.com' . $endpoint;
            echo "\n📡 Тестую: $url\n";
            
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_COOKIEFILE => $this->cookieFile,
                CURLOPT_COOKIEJAR => $this->cookieFile,
                CURLOPT_HTTPHEADER => [
                    'Accept: application/json',
                ],
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
            curl_close($ch);
            
            echo "   HTTP Code: $httpCode\n";
            echo "   Content-Type: $contentType\n";
            
            if ($httpCode === 200 && strpos($contentType, 'json') !== false) {
                $data = json_decode($response, true);
                echo "   ✅ Валідний JSON\n";
                echo "   Структура: " . json_encode(array_keys($data ?? [])) . "\n";
                if (strlen($response) < 1000) {
                    echo "   Дані: " . substr($response, 0, 500) . "\n";
                }
            }
        }
    }
}

// ========== ГОЛОВНА ЛОГІКА ==========

echo "🚀 Парсер полігонів з Zoddak Properties\n";
echo "═══════════════════════════════════════════════════════════\n\n";

$email = 'info@property-partners.es';
$password = 'dybmyG-kefwyv-cygko5';
$outputDir = __DIR__ . '/../data/geojson';

$fetcher = new ZoddakPolygonFetcher($outputDir);

// Логін
if (!$fetcher->login($email, $password)) {
    echo "❌ Не вдалося увійти. Перевірте credentials.\n";
    exit(1);
}

// Спочатку дослідимо API
echo "\n";
$fetcher->exploreAPI();

// Спробуємо отримати дані карти
$mapData = $fetcher->fetchMapData();
if ($mapData) {
    $geojson = $fetcher->convertToGeoJSON($mapData);
    $fetcher->saveGeoJSON('zoddak-all-polygons.json', $geojson);
}

// Отримуємо властивості
$properties = $fetcher->fetchProperties(['limit' => 1000]);
if ($properties) {
    $geojson = $fetcher->convertToGeoJSON($properties);
    $fetcher->saveGeoJSON('zoddak-from-properties.json', $geojson);
}

echo "\n✅ ГОТОВО!\n";
echo "═══════════════════════════════════════════════════════════\n";

