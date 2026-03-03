
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin, PlayCircle } from 'lucide-react';
import { SectionId, AppSettings } from '../types';
import { getAppSettings } from '../services/authService';
import * as THREE from 'three';

const Hero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());

  useEffect(() => {
    // Listen for setting changes
    const update = () => setSettings(getAppSettings());
    window.addEventListener('settings-updated', update);
    return () => window.removeEventListener('settings-updated', update);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Three.js Setup (Clean Light Mode)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White background
    // Subtle fog to blend bottom
    scene.fog = new THREE.FogExp2(0xffffff, 0.005);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;
    camera.position.x = 8;
    camera.position.y = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Sphere (Blue Wireframe for Tech look)
    const geometry = new THREE.IcosahedronGeometry(10, 3);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x0052cc, // Brand Blue
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const sphere = new THREE.Mesh(geometry, material);
    globeGroup.add(sphere);

    // Inner Sphere (Subtle shading)
    const innerGeo = new THREE.IcosahedronGeometry(9.9, 3);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0xf0f9ff, // Very light blue
        transparent: true,
        opacity: 0.8
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // Particles (Blue/Grey dots)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        color: 0x0052cc,
        transparent: true,
        opacity: 0.4,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation Loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      globeGroup.rotation.y += 0.001;
      globeGroup.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1;
      
      particlesMesh.rotation.y -= 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <section id={SectionId.HOME} className="relative h-screen flex items-center overflow-hidden bg-white">
      {/* 3D Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 opacity-80" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 pt-20">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="h-[2px] w-12 bg-brand-red"></span>
            <span className="text-brand-red font-bold tracking-widest uppercase text-sm">{settings.home.welcomeTitle}</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-900 mb-6 leading-tight whitespace-pre-wrap">
            {settings.home.mainTitle}
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-lg font-light leading-relaxed whitespace-pre-wrap">
            {settings.home.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <a
              href={`#${SectionId.SERVICES}`}
              className="px-8 py-4 bg-brand-blue text-white font-bold rounded-full transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-3"
            >
              {settings.home.buttonText}
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </a>
            <a
              href={`#${SectionId.MEDIA}`}
              className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full transition-all hover:border-brand-blue hover:text-brand-blue flex items-center justify-center gap-3 group shadow-sm"
            >
              <PlayCircle className="w-5 h-5 text-brand-red group-hover:scale-110 transition-transform" />
              Bekijk Livestream
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-slate-400 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </section>
  );
};

export default Hero;
