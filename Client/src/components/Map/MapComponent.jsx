/* eslint-disable react/prop-types */
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const MapComponent = ({ userLocation, providers }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      center={{
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      }}
      zoom={12}
      mapContainerStyle={{ width: "100%", height: "400px" }}
    >
      {providers.map((provider) => (
        <Marker
          key={provider._id}
          position={{
            lat: provider.location.coordinates[1],
            lng: provider.location.coordinates[0],
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
