import { useEffect, useState } from "react";
import L from "leaflet";
import ProviderMarker from "./ProviderMarker";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import axiosInstance from "../../api/axiosInstance";
import userMarkerIcon from "../../assets/usermarker.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [providers, setProviders] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  const fetchProviders = async (longitude, latitude) => {
    try {
      console.log("Fetching providers for:", longitude, latitude);
      const response = await axiosInstance.get("/providers/nearby", {
        params: { longitude, latitude, distance: 5000 },
      });
      console.log("Providers:", response.data.providers);
      setProviders(response.data.providers);
    } catch (error) {
      console.error("Error fetching providers:", error.message);
      setError("Failed to load nearby providers.");
    }
  };

  useEffect(() => {
    const mapInstance = L.map("map").setView([11.19843, 75.82421], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    mapInstance.locate({ setView: true, maxZoom: 16 });

    let userMarker;
    mapInstance.on("locationfound", (e) => {
      const { lat, lng } = e.latlng;
      userMarker = L.marker([lat, lng], {
        draggable: true,
        icon: L.icon({
          iconUrl: userMarkerIcon,
          shadowUrl: markerShadowPng,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [0, -35],
        }),
      }).addTo(mapInstance);

      userMarker.bindPopup("You are here!").openPopup();
      setUserLocation(e.latlng);
      fetchProviders(lng, lat);

      userMarker.on("dragend", () => {
        const { lat: newLat, lng: newLng } = userMarker.getLatLng();
        setUserLocation({ lat: newLat, lng: newLng });
        fetchProviders(newLng, newLat);
      });
    });

    mapInstance.on("locationerror", () => {
      setError("Unable to access your location.");
    });

    setMap(mapInstance);
    return () => {
      mapInstance.remove();
    };
  }, []);

  return (
    <div className="w-full p-4 bg-white-default shadow-md rounded-lg">
      {error && <p className="text-red-600 text-center font-semibold">{error}</p>}

      <div
        id="map"
        className="h-[300px] sm:h-[400px] lg:h-[500px] w-full rounded-lg shadow-lg overflow-hidden z-20"
      >
        {map && <ProviderMarker map={map} providers={providers} />}
      </div>
    </div>
  );
};

export default MapComponent;
