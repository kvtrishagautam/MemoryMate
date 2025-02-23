import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

const WebMap = ({ location, homeLocation }) => {
  if (!location) return null;

  // Only load the map component on web platform
  if (Platform.OS === 'web') {
    useEffect(() => {
      // Add Leaflet CSS
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(linkElement);

      // Add Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(linkElement);
        document.head.removeChild(script);
      };
    }, []);

    const initMap = () => {
      // Create map instance
      const L = window.L;
      const map = L.map('map', {
        zoomControl: true,
        attributionControl: true
      }).setView(
        [location.coords.latitude, location.coords.longitude],
        16 // Increased zoom level for better detail
      );

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: ' OpenStreetMap contributors'
      }).addTo(map);

      // Add accuracy circle
      if (location.coords.accuracy) {
        L.circle(
          [location.coords.latitude, location.coords.longitude],
          {
            radius: location.coords.accuracy,
            fillColor: '#4CAF50',
            fillOpacity: 0.15,
            color: '#4CAF50',
            weight: 1
          }
        ).addTo(map);
      }

      // Current location marker
      L.circleMarker(
        [location.coords.latitude, location.coords.longitude],
        {
          radius: 8,
          fillColor: '#4CAF50',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }
      )
        .addTo(map)
        .bindPopup('You are here');

      // Home location marker
      if (homeLocation) {
        const homeIcon = L.divIcon({
          html: '<div style="color: #FF6B6B; font-size: 24px;"></div>',
          className: 'home-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        });

        L.marker(
          [homeLocation.latitude, homeLocation.longitude],
          { icon: homeIcon }
        )
          .addTo(map)
          .bindPopup('Home');

        // Fit bounds to show both current location and home
        const bounds = L.latLngBounds(
          [location.coords.latitude, location.coords.longitude],
          [homeLocation.latitude, homeLocation.longitude]
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      // Add a button to recenter map
      const recenterButton = L.control({ position: 'bottomright' });
      recenterButton.onAdd = function() {
        const button = L.DomUtil.create('button', 'recenter-button');
        button.innerHTML = '';
        button.style.fontSize = '20px';
        button.style.padding = '8px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = 'white';
        button.style.border = '2px solid rgba(0,0,0,0.2)';
        button.style.borderRadius = '4px';
        button.style.width = '34px';
        button.style.height = '34px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.title = 'Center on your location';
        
        button.onclick = function() {
          map.setView([location.coords.latitude, location.coords.longitude], 16);
        };
        
        return button;
      };
      recenterButton.addTo(map);
    };

    return <div id="map" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />;
  }

  // Return empty view for non-web platforms
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
});

export default WebMap;
