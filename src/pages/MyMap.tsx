import  { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, LayersControl } from 'react-leaflet';
import { Map as MapProp} from "leaflet";
import 'leaflet/dist/leaflet.css';
import mapData from '../data/Countries/Russia_regions.json';
import L from 'leaflet';
import "leaflet-boundary-canvas";



export default function MyMap() {
  const [map, setMap] = useState<MapProp | null> (null);

  useEffect(() => {
    if (!map) return;

    const fetchGeoJSON = async () => {
      const response = await fetch(
        "https://cdn.jsdelivr.net/gh/johan/world.geo.json@34c96bba/countries/RUS.geo.json"
      );
      const geoJSON = await response.json();
      const osm = L.TileLayer.boundaryCanvas(
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        {
          boundary: geoJSON,
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, UK shape <a href="https://github.com/johan/world.geo.json">johan/word.geo.json</a>'
        }
      );
      map.addLayer(osm);
      const ukLayer = L.geoJSON(geoJSON);
      map.fitBounds(ukLayer.getBounds());
      
    };
    var bounds = L.latLngBounds([[46, 4], [66, 194]]);
    map.setMaxBounds(bounds);
    map.on('drag', function() {
      map.panInsideBounds(bounds, { animate: true });
    });
    fetchGeoJSON();
  }, [map]);


    return (
    <MapContainer 
    maxZoom={4}
      minZoom={2}
    scrollWheelZoom={false}
    style={{ height: "100vh", width: "800px" }}
    ref={setMap}
    >
      <LayersControl position="topright">
      <LayersControl.Overlay name="Регионы">
      <GeoJSON 
        //@ts-expect-error
        data={mapData.features } 
        onEachFeature={(feature, layer) => {
          layer.bindTooltip(feature.properties.region)
            layer.on({
              mouseover: (e) => {
                e.target.setStyle({ fillColor: 'red' });
              },
              mouseout: (e) => {
                e.target.setStyle({ fillColor: 'white' });
              }
            });
          }}
        />
      </LayersControl.Overlay>
      </LayersControl>      
    </MapContainer>
    )
// }
}