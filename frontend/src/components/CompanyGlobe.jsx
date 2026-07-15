import { useEffect, useMemo, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import * as THREE from 'three'

const HIRING_HUBS = [
    { name: 'London', lat: 51.5074, lng: -0.1278, size: 0.6 },
    { name: 'New York', lat: 40.7128, lng: -74.006, size: 0.7 },
    { name: 'San Francisco', lat: 37.7749, lng: -122.4194, size: 0.7 },
    { name: 'Berlin', lat: 52.52, lng: 13.405, size: 0.5 },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, size: 0.5 },
    { name: 'Toronto', lat: 43.6532, lng: -79.3832, size: 0.5 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, size: 0.5 },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708, size: 0.4 },
    { name: 'Mumbai', lat: 19.076, lng: 72.8777, size: 0.4 },
    { name: 'São Paulo', lat: -23.5505, lng: -46.6333, size: 0.4 },
    { name: 'Tokyo', lat: 35.6895, lng: 139.6917, size: 0.4 },
    { name: 'Seoul', lat: 37.5665, lng: 126.978, size: 0.4 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522, size: 0.4 },
]

export default function CompanyGlobe() {
    const globeRef = useRef()
    const [dimensions] = useState({ width: 480, height: 480 })
    const [countries, setCountries] = useState([])

    const globeMaterial = useMemo(
        () => new THREE.MeshBasicMaterial({ color: '#e0e7ff', transparent: true, opacity: 0 }),
        []
    )

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then((res) => res.json())
            .then((data) => setCountries(data.features))
            .catch(() => setCountries([]))
    }, [])

    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true
            globeRef.current.controls().autoRotateSpeed = 0.6
            globeRef.current.controls().enableZoom = false
            globeRef.current.pointOfView({ altitude: 2.2 })
        }
    }, [])

    return (
        <Globe
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            showGlobe={true}
            showAtmosphere={true}
            atmosphereColor="#4f46e5"
            atmosphereAltitude={0.15}
            globeMaterial={globeMaterial}
            hexPolygonsData={countries}
            hexPolygonResolution={3}
            hexPolygonMargin={0.4}
            hexPolygonColor={() => 'rgba(79, 70, 229, 0.35)'}
            hexPolygonAltitude={0.005}
            pointsData={HIRING_HUBS}
            pointLat="lat"
            pointLng="lng"
            pointColor={() => '#4f46e5'}
            pointAltitude={0.02}
            pointRadius="size"
            pointLabel={(d) => d.name}
            labelsData={HIRING_HUBS}
            labelLat="lat"
            labelLng="lng"
            labelText="name"
            labelSize={1.1}
            labelDotRadius={0.5}
            labelColor={() => 'rgba(79, 70, 229, 0.9)'}
            labelResolution={2}
            labelAltitude={0.02}
        />
    )
}