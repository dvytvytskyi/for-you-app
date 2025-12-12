import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapViewProps {
  latitude: number;
  longitude: number;
  accessToken: string;
  styleUrl: string;
  height?: number;
  borderRadius?: number;
  interactive?: boolean; // Дозволити зум/пан для повноекранної карти
}

export default function MapView({
  latitude,
  longitude,
  accessToken,
  styleUrl,
  height = 200,
  borderRadius = 12,
  interactive = false, // За замовчуванням неінтерактивна (для маленьких карт)
}: MapViewProps) {
  // Convert mapbox:// style URL to https:// style URL
  const convertedStyleUrl = styleUrl.replace('mapbox://styles/', 'https://api.mapbox.com/styles/v1/');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          #map {
            width: 100%;
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          mapboxgl.accessToken = '${accessToken}';
          
          const map = new mapboxgl.Map({
            container: 'map',
            style: '${convertedStyleUrl}?access_token=${accessToken}',
            center: [${longitude}, ${latitude}],
            zoom: 13,
            interactive: ${interactive ? 'true' : 'false'}, // Дозволити інтерактивність для повноекранної карти
          });

          // Add a marker
          new mapboxgl.Marker({
            color: '#102F73',
          })
            .setLngLat([${longitude}, ${latitude}])
            .addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, height ? { height, borderRadius } : { flex: 1, borderRadius }]}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={interactive} // Дозволити скрол для інтерактивної карти
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        androidLayerType="hardware"
        onMessage={() => {}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  webview: {
    backgroundColor: 'transparent',
  },
});

