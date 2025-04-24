import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// Fix para iconos rotos en React
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

interface MapViewProps {
  latlng: [number, number];
  countryName: string;
}

// Componente auxiliar para centrar el mapa
const MapCenter = ({ latlng }: { latlng: [number, number] }) => {
  const map = useMap();
  map.setView(latlng, 5); // Centra el mapa en las nuevas coordenadas
  return null; // No renderiza nada
};

export const MapView = ({ latlng, countryName }: MapViewProps) => {
  return (
    <MapContainer
      center={latlng} // Coordenadas iniciales
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={latlng}>
        <Popup>{countryName}</Popup>
      </Marker>
      <MapCenter latlng={latlng} /> {/* Centra el mapa cuando cambian las coordenadas */}
    </MapContainer>
  );
};