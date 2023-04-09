import { useEffect, useRef, useState } from 'react'
import './App.css'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as BABYLON from 'babylonjs';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

function App() {
  const mapContainer = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const cuboidRef = useRef(null);
  
  useEffect(() => {
    const mapRef = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [78.5, 22.2],
      zoom: 3
    })

    mapRef.on('idle', () => {
      setImageUrl(mapRef.getCanvas().toDataURL());
    })

    return () => mapRef.remove();
  }, [])
  
  const captureMap = () => {
    applyTextureToCuboid(imageUrl);
  }

  const applyTextureToCuboid = (textureUrl) => {
    const canvas = cuboidRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, new BABYLON.Vector3.Zero(), scene);
    camera.setPosition(new BABYLON.Vector3(0, 5, -10))
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;
  
    const texture = new BABYLON.Texture(textureUrl, scene);
    const material = new BABYLON.StandardMaterial('material', scene);
    material.diffuseTexture = texture;
    material.uScale = 0.5; // Set the uScale to 0.5 to wrap the texture horizontally
    material.vScale = 0.5; // Set the vScale to 0.5 to wrap the texture vertically
  
    const width = 4;
    const height = 2;
    const depth = 6;
  
    const cuboid = BABYLON.MeshBuilder.CreateBox('cuboid', { width, height, depth }, scene);
    cuboid.material = material;
  
    engine.runRenderLoop(() => {
      scene.render();
    });
  };

  return (
    <div className="App">
      <div>
        <h3>Mapbox</h3>
        <div ref={mapContainer} className='map-container' style={{ width: 400, height: 300 }}></div>
      </div>
      <div>
        <h3>Cuboid</h3>
        <canvas ref={cuboidRef} width={500} height="auto" className='cuboid'></canvas>
      </div>
      <button onClick={captureMap} className='btn'>Apply texture</button>
    </div>
  )
}

export default App
