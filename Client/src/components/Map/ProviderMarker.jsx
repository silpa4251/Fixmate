/* eslint-disable react/prop-types */

import L from "leaflet";
import { useEffect } from "react";

const ProviderMarker = ({ map, providers }) => {
  useEffect(() => {
    providers.forEach((provider) => {
      const marker = L.marker([provider.latitude, provider.longitude]);
      marker
        .addTo(map)
        .bindPopup(`<b>${provider.name}</b><br>${provider.address}`);
    });
  }, [map, providers]);

  return null;
};

export default ProviderMarker;
