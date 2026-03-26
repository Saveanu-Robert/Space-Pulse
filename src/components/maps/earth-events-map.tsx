'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/styles/map.css';
import type { EarthEvent } from '@/types/earth-events';
import { CATEGORY_COLORS } from '@/lib/config/constants';

interface EarthEventsMapProps {
  events: EarthEvent[];
  onSelectEvent: (event: EarthEvent) => void;
}

const iconCache = new Map<string, L.DivIcon>();

function getCategoryIcon(categoryId: string): L.DivIcon {
  const cached = iconCache.get(categoryId);
  if (cached) return cached;

  const color = CATEGORY_COLORS[categoryId] ?? '#3B82F6';
  const icon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.5);box-shadow:0 0 8px ${color}"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
  iconCache.set(categoryId, icon);
  return icon;
}

export function EarthEventsMap({ events, onSelectEvent }: EarthEventsMapProps) {
  const eventsWithGeometry = useMemo(
    () => events.filter((e) => e.geometry !== null && e.geometry.coordinates.length >= 2),
    [events]
  );

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxBounds={[[-85, -180], [85, 180]]}
      maxBoundsViscosity={1.0}
      worldCopyJump={false}
      className="h-[350px] md:h-[450px] w-full rounded-xl"
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        noWrap={true}
        bounds={[[-85, -180], [85, 180]]}
      />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={40}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
      >
        {eventsWithGeometry.map((event) => {
          const geo = event.geometry!;
          return (
            <Marker
              key={event.id}
              position={[geo.coordinates[1], geo.coordinates[0]]}
              icon={getCategoryIcon(event.category.id)}
              eventHandlers={{ click: () => onSelectEvent(event) }}
            >
              <Popup>
                <div style={{ fontSize: '12px' }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>{event.title}</p>
                  <p style={{ opacity: 0.7, margin: '2px 0 0' }}>{event.category.title}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
