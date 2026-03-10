import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stage } from "@react-three/drei"
import { useRef, Component } from "react"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '15px' }}>
          <p style={{ color: 'white' }}>3D Preview Unavailable</p>
        </div>
      )
    }
    return this.props.children
  }
}

function Pizza({ toppings = [] }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={meshRef}>
      {/* Pizza base */}
      <mesh>
        <cylinderGeometry args={[2, 2, 0.3, 32]} />
        <meshStandardMaterial color="#d9a066" />
      </mesh>

      {/* Sauce */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 0.05, 32]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>

      {/* Cheese */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.05, 32]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>

      {/* Toppings logic */}
      {toppings && toppings.length > 0 && toppings.map((topping, idx) => (
        <mesh key={idx} position={[Math.cos(idx) * 1, 0.3, Math.sin(idx) * 1]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={topping.includes("pepperoni") ? "red" : "#22c55e"} />
        </mesh>
      ))}
    </group>
  )
}

export default function Pizza3D({ toppings }) {
  return (
    <ErrorBoundary>
      <Canvas 
        shadows 
        camera={{ position: [0, 5, 10], fov: 40 }}
        style={{ height: "400px", background: 'transparent' }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Stage environment="city" intensity={0.6} contactShadow={true} adjustCamera={false}>
          <Pizza toppings={toppings} />
        </Stage>
        
        <OrbitControls enableZoom={false} makeDefault />
      </Canvas>
    </ErrorBoundary>
  )
}