import { useEffect, useState } from "react";
import L from "leaflet";
import ProviderMarker from "./ProviderMarker";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const providers = [
    { name: "Provider 1", latitude: 51.515, longitude: -0.09, address: "123 Street" },
    { name: "Provider 2", latitude: 51.505, longitude: -0.08, address: "456 Avenue" },
  ];
  useEffect(() => {
    const mapInstance = L.map("map").setView([51.505, -0.09], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);
    setMap(mapInstance);

    mapInstance.locate({ setView: true, maxZoom: 16 });
    mapInstance.on("locationfound", (e) => {
      const userMarker = L.marker(e.latlng).addTo(mapInstance);
      userMarker.bindPopup("You are here!").openPopup();
    });
  
    mapInstance.on("locationerror", () => {
      alert("Unable to access your location.");
    });

  }, []);

  return (
  <div id="map" style={{ height: "500px", width: "100%" }} >
    {map && <ProviderMarker map={map} providers={providers} />}
  </div>
  );
};

export default MapComponent;
