import { useEffect, useState } from "react";
import L from "leaflet";
import ProviderMarker from "./ProviderMarker";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import axiosInstance from "../../api/axiosInstance";

L.Icon.Default.mergeOptions({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [providers, setProviders] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const fetchProviders = async (longitude, latitude) => {
    try {
      const response = await axiosInstance.get("/providers/nearby", {
        params: { longitude, latitude, distance: 30000 },
      });
      setProviders(response.data);
    } catch (error) {
      console.error("Error fetching providers:", error.message);
    }
  };

  useEffect(() => {
    const mapInstance = L.map("map").setView([51.505, -0.09], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);
    

    mapInstance.locate({ setView: true, maxZoom: 16 });
    mapInstance.on("locationfound", (e) => {
      const userMarker = L.marker(e.latlng).addTo(mapInstance);
      userMarker.bindPopup("You are here!").openPopup();
      setUserLocation(e.latlng); 
      fetchProviders(e.latlng.lng, e.latlng.lat); 
    });
  
    mapInstance.on("locationerror", () => {
      alert("Unable to access your location.");
    });
    setMap(mapInstance);
    return () => {
      mapInstance.remove();
    };
  }, []);

  return (
  <div id="map" style={{ height: "500px", width: "100%" }} >
    {map && <ProviderMarker map={map} providers={providers} />}
  </div>
  );
};

export default MapComponent;
