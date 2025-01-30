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
    markersGroup.current.clearLayers();
    if (map && providers.length) {
    providers.forEach((provider) => {
      const providerCoordinates = provider.address[0]?.coordinates?.coordinates;
        
      if (providerCoordinates && providerCoordinates.length >0) {
        const [longitude, latitude] = providerCoordinates;
      const marker = L.marker([latitude, longitude],{
         icon: L.icon({
                  iconUrl: providerMark,
                  shadowUrl: markerShadowPng,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [0,-35],
                }),
      });
      marker.on("click", () => {
        navigate(`/provider/${provider._id}`);
      });
      marker
        .addTo(map)
        .bindPopup(`<b>${provider.name}</b><br>${provider.address[0].place}`);
        markersGroup.current.addLayer(marker); }
    });
    markersGroup.current.addTo(map);
    }
    return () => {
      markersGroup.current.clearLayers();
    };
  }, [map, navigate, providers]);

  return null;
};

export default ProviderMarker;
