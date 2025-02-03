/* eslint-disable react/prop-types */
import providerMark from "../../assets/provider.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ProviderMarker = ({ map, providers }) => {
  const markersGroup = useRef(L.layerGroup());
  const navigate = useNavigate();

  useEffect(() => {
    if (map && markersGroup.current) {
      map.removeLayer(markersGroup.current); 
    }
    markersGroup.current = L.layerGroup();
    if (map && providers.length > 0) {
      providers.forEach((provider) => {
        const providerCoordinates = provider.address[0]?.coordinates?.coordinates;

        if (providerCoordinates && providerCoordinates.length === 2) {
          const [longitude, latitude] = providerCoordinates;
          if (typeof latitude === "number" && typeof longitude === "number") {
            const marker = L.marker([latitude, longitude], {
              icon: L.icon({
                iconUrl: providerMark,
                shadowUrl: markerShadowPng,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [0, -35],
              }),
            });
            marker.on("click", () => {
              navigate(`/provider/${provider._id}`);
            });
            marker
              .bindPopup(`<b>${provider.name}</b><br>${provider.address[0].place}`)
              .addTo(markersGroup.current);
          } else {
            console.error(`Invalid coordinates for provider: ${provider.name}`);
          }
        } else {
          console.error(`Missing or invalid coordinates for provider: ${provider.name}`);
        }
      });
      markersGroup.current.addTo(map);
    }
    return () => {
      if (map && markersGroup.current) {
        map.removeLayer(markersGroup.current);
      }
    };
  }, [map, navigate, providers]);

  return null;
};

export default ProviderMarker;