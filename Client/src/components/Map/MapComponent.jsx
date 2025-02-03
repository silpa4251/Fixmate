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

const MapComponent = ({ serviceQuery, providers, setProviders }) => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [locationInput, setLocationInput] = useState("");
  const userMarkerRef = useRef(null);

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axiosInstance.get("/map/reverse", {
        params: { lat, lng },
      });
      return response.data.address.address || `${lat}, ${lng}`;
    } catch (error) {
      console.error("Error fetching address:", error.message);
      return `${lat}, ${lng}`;
    }
  };

  const fetchProviders = async (longitude, latitude, service = "") => {
    try {
      const response = await axiosInstance.get("/providers/nearby", {
        params: { longitude, latitude, distance: 5000, service },
      });
      setProviders(response.data.providers); // Update providers state
    } catch (error) {
      console.error("Error fetching providers:", error.message);
      setError("Failed to load nearby providers.");
    }
  };

  const handleGeocode = async (address) => {
    try {
      const response = await axiosInstance.get("/map/geocode", { params: { address } });
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
          userMarkerRef.current.on("dragend", handleMarkerDrag);
        }

        // Update location and fetch nearby providers
        setUserLocation({ lat, lng });
        const readableAddress = await fetchAddress(lat, lng);
        setLocationInput(readableAddress);
        fetchProviders(lng, lat, serviceQuery);
      }
    } catch (error) {
      setError("Failed to find location.");
      console.error("Geocode error:", error);
    }
  };

  const handleMarkerDrag = async () => {
    const { lat: newLat, lng: newLng } = userMarkerRef.current.getLatLng();
    const readableAddress = await fetchAddress(newLat, newLng);
    setUserLocation({ lat: newLat, lng: newLng });
    setLocationInput(readableAddress);
    fetchProviders(newLng, newLat, serviceQuery);
  };

  useEffect(() => {
    const mapInstance = L.map("map").setView([11.19843, 75.82421], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    mapInstance.locate({ setView: true, maxZoom: 16 });

    mapInstance.on("locationfound", async (e) => {
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
      })
        .addTo(mapInstance)
        .bindPopup("You are here!")
        .openPopup();
      setUserLocation(e.latlng);
      const readableAddress = await fetchAddress(lat, lng);
      setLocationInput(readableAddress);
      fetchProviders(lng, lat); // Fetch providers on page load
      userMarkerRef.current.on("dragend", handleMarkerDrag);
    });

    mapInstance.on("locationerror", () => {
      setError("Unable to access your location.Please refresh the page");
    });

    setMap(mapInstance);


    // Cleanup
    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (userLocation && serviceQuery) {
      fetchProviders(userLocation.lng, userLocation.lat, serviceQuery);
    }
  }, [serviceQuery, userLocation]);

  const handleLocationInput = (e) => {
    setLocationInput(e.target.value);
  };

  const handleLocationSearch = () => {
    if (locationInput) {
      handleGeocode(locationInput);
    }
  };

  return (
    <div className="w-full p-4 bg-white-default shadow-md rounded-2xl mt-4 mb-5">
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
          className="bg-green-button text-white-default px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Search
        </button>
      </div>

      <div
        id="map"
        className="h-[300px] sm:h-[400px] lg:h-[722px] w-full rounded-lg shadow-lg overflow-hidden z-20"
      >
        {map && <ProviderMarker map={map} providers={providers} />}
      </div>
    </div>
  );
};

export default MapComponent;