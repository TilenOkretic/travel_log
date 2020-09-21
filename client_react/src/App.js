import * as React from 'react';
import {
  useState,
  useEffect
} from 'react';
import ReactMapGL, {
  Marker,
  Popup
} from 'react-map-gl';
import {
  listLogEntries
} from './API';
import LogEntryForm from './LogEntryForm';


const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup,  setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95.665,
    zoom: 3
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    (async () => {
      const log = await listLogEntries();
      setLogEntries(log);
    })();
  }, []);

  const showAddMarkerPopup = (event)=>{
    console.log(event);
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    })
  }

  return ( 
    <ReactMapGL {
      ...viewport
    }
    mapStyle = 'mapbox://styles/tilen-okretic/ckfcp07uf9l4y19oejgh7hsx1'
    mapboxApiAccessToken = {
      'pk.eyJ1IjoidGlsZW4tb2tyZXRpYyIsImEiOiJja2Zjb2xkZmcxaTBiMnFxZzZkenY3YW94In0.unbmk0w0rZoAoR-CHmvM8A'
    }
    onViewportChange = {
      nextViewport => setViewport(nextViewport)
    }
    onDblClick={showAddMarkerPopup}
    >
    {
      logEntries.map(entry => {
        return (
      <React.Fragment key={entry._id}>
        <Marker
        latitude = {
          entry.latitude
        }
        longitude = {
          entry.longitude
        }
        >
        <svg
        key={entry._id}
        className="marker"
        style={{cursor: 'pointer', width: `${6 * viewport.zoom}px`, height: `${6 * viewport.zoom}px`}}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={()=>{
          setShowPopup({
            showPopup,
            [entry._id]: true
          });
        }}
       >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle></svg>
        </Marker>
        {
          showPopup[entry._id] ? (
            <Popup
                key={entry._id}
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() =>  setShowPopup({
                  showPopup,
                  [entry._id]: false
                })}
                anchor="top">
              <div className="popup">
                <h3>{entry.title}</h3>
                <p>{entry.comments}</p>
              <small>Visited on: {new Date(entry.visit_date).toLocaleDateString()}</small>
              </div>
            </Popup>
          ) : null
        }
        {
          addEntryLocation ? (
            <>
            <Marker key={entry._id}
        latitude = {
          addEntryLocation.latitude
        }
        longitude = {
          addEntryLocation.longitude
        }
        >
        <svg
        className="newMarker"
        style={{cursor: 'pointer', width: `${6 * viewport.zoom}px`, height: `${6 * viewport.zoom}px`}}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
       >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle></svg>
        </Marker>
            <Popup
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() =>  setAddEntryLocation(null)}
                anchor="top">
              <div className="popup log">
              <LogEntryForm onClose={() => {
                setAddEntryLocation(null);
                getEntries();
              }} location={addEntryLocation} />
              </div>
            </Popup>
            </>
          ): null
        }
        </React.Fragment>
        )
      })
    }
    </ReactMapGL>
  );
}

export default App;