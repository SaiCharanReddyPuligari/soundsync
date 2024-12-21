'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'

export function BackgroundScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2)
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.CineonToneMapping
    renderer.toneMappingExposure = 1.75
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio(sizes.pixelRatio)
    renderer.setSize(sizes.width, sizes.height)

    containerRef.current.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, sizes.aspect, 1, 1000)
    scene.add(camera)

    // Lights
    const sunLight = new THREE.DirectionalLight('#ffffff', 1)
    sunLight.position.set(0, 2, 0)
    scene.add(sunLight)

    const pointLight = new THREE.PointLight('#eee', 3, 100, 0.1)
    pointLight.position.set(50, 0, 200)
    scene.add(pointLight)

    // Fog
    scene.fog = new THREE.Fog('#000', 20, 1000)

    // Camera Position
    camera.position.x = 208
    camera.position.y = 180
    camera.position.z = 477

    // Animation
    const animate = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 -z-10" />
}

