import { useEffect, useRef, useState } from "react";
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
  const [locationInput, setLocationInput] = useState("");
  const userMarkerRef = useRef(null);

  const fetchProviders = async (longitude, latitude) => {
    try {
      setProviders([]);
      const response = await axiosInstance.get("/providers/nearby", {
        params: { longitude, latitude, distance: 5000 },
      });
      setProviders(response.data.providers);
    } catch (error) {
      console.error("Error fetching providers:", error.message);
      setError("Failed to load nearby providers.");
    }
  };

  const handleGeocode = async (address) => {
    try {
      const response = await axiosInstance.get("/geocode", { params: { address } });
      const { lat, lng } = response.data;

      if (map) {
        // Update map view
        map.setView([lat, lng], 16);

        // Update or create the marker
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([lat, lng]); // Update existing marker position
        } else {
          userMarkerRef.current = L.marker([lat, lng], {
            draggable: true,
            icon: L.icon({
              iconUrl: userMarkerIcon,
              shadowUrl: markerShadowPng,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [0, -35],
            }),
          })
            .addTo(map)
            .bindPopup("You are here!")
            .openPopup();

          // Handle drag event on marker
          userMarkerRef.current.on("dragend", () => {
            const { lat: newLat, lng: newLng } = userMarkerRef.current.getLatLng();
            setUserLocation({ lat: newLat, lng: newLng });
            setLocationInput(`${newLat}, ${newLng}`);
            fetchProviders(newLng, newLat);
          });
        }

        // Update location and fetch nearby providers
        setUserLocation({ lat, lng });
        fetchProviders(lng, lat);
      }
    } catch (error) {
      setError("Failed to find location.");
      console.error("Geocode error:", error);
    }
  };


  useEffect(() => {
    const mapInstance = L.map("map").setView([11.19843, 75.82421], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    mapInstance.locate({ setView: true, maxZoom: 16 });

    mapInstance.on("locationfound", (e) => {
      const { lat, lng } = e.latlng;
      userMarkerRef.current = L.marker([lat, lng], {
        draggable: true,
        icon: L.icon({
          iconUrl: userMarkerIcon,
          shadowUrl: markerShadowPng,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [0, -35],
        }),
      }).addTo(mapInstance)
        .bindPopup("You are here!")
        .openPopup();
      setUserLocation(e.latlng);
      setLocationInput(`${lat}, ${lng}`);
      fetchProviders(lng, lat);

      userMarkerRef.current.on("dragend", () => {
        const { lat: newLat, lng: newLng } = userMarkerRef.current.getLatLng();
        setUserLocation({ lat: newLat, lng: newLng });
        setLocationInput(`${newLat}, ${newLng}`);
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

  const handleLocationInput = (e) => {
    setLocationInput(e.target.value);
  };

  const handleLocationSearch = () => {
    if (locationInput) {
      handleGeocode(locationInput);
    }
  };


  return (
    <div className="w-full p-4 bg-white-default shadow-md rounded-lg">
      {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          value={locationInput}
          onChange={handleLocationInput}
          placeholder="Enter the location for service"
          className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleLocationSearch}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Search
        </button>
      </div>

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
