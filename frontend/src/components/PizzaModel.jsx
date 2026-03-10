import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Pizza3D() {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + 0.4
  })

  const toppingPositions = [
    [-0.6, 0.19, 0.4], [0.7, 0.19, -0.3], [-0.2, 0.19, -0.8],
    [0.4, 0.19, 0.9], [-1.0, 0.19, -0.1], [0.9, 0.19, 0.5],
  ]

  return (
    <group ref={groupRef}>
      {/* Crust */}
      <mesh>
        <cylinderGeometry args={[2.3, 2.5, 0.18, 48]} />
        <meshStandardMaterial color="#d97706" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Sauce */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[2.0, 2.0, 0.06, 48]} />
        <meshStandardMaterial color="#dc2626" roughness={0.85} />
      </mesh>
      {/* Cheese */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[1.75, 1.75, 0.05, 48]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.75} />
      </mesh>
      {/* Toppings */}
      {toppingPositions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.18, 10, 10]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#059669' : '#b91c1c'}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function PizzaModel() {
  return (
    <Canvas camera={{ position: [0, 3.5, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#fff8f0" />
      <pointLight position={[-4, 2, -4]} intensity={0.6} color="#fca5a5" />
      <Pizza3D />
    </Canvas>
  )
}
