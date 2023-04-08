import { useEffect, useRef, useState } from 'react'
import './App.css'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

function App() {
  const mapContainer = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  
  useEffect(() => {
    const mapRef = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11'
    })

    mapRef.on('idle', () => {
      setImageUrl(mapRef.getCanvas().toDataURL());
    })

    return () => mapRef.remove();
  }, [])
  
  const captureMap = () => {
    console.log(imageUrl);
  }

  return (
    <div className="App">
      <div ref={mapContainer} style={{ width: 400, height: 300 }}></div>
      <button onClick={captureMap}>Click me</button>
      <img src={imageUrl} alt="Image" width={500} height="auto" />
    </div>
  )
}

export default App
