"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { FontLoader, TextGeometry } from "three-stdlib";

export default function Home() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1); // Changed to black for better contrast
    document.body.appendChild(renderer.domElement);

    // Background Animation (starry sky)
    const background = new THREE.TextureLoader().load('path_to_star_texture.jpg');
    scene.background = background;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    const pointLight = new THREE.PointLight(0xff0000, 1, 100);
    pointLight.position.set(0, 10, 20);
    scene.add(ambientLight, pointLight);

    // Heart Shape Geometry
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(1, 1, 2, 1, 2, 0);
    heartShape.bezierCurveTo(2, -1, 1, -2, 0, -3);
    heartShape.bezierCurveTo(-1, -2, -2, -1, -2, 0);
    heartShape.bezierCurveTo(-2, 1, -1, 1, 0, 0);

    const heartGeometry = new THREE.ShapeGeometry(heartShape);
    const heartMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
    heartMesh.scale.set(8, 8, 1);
    heartMesh.position.set(0, -2, -30);
    scene.add(heartMesh);

    // Text Elements
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      
      // Generate multiple text elements with typewriter effect
      const numTexts = 100;
      for (let i = 0; i < numTexts; i++) {
        const randomText = "I'm Sorry Najat";
        const textGeometry = new TextGeometry(randomText, {
          font: font,
          size: 2,
          height: 1,
          curveSegments: 12,
        });

        const textBox = new THREE.Box3().setFromObject(new THREE.Mesh(textGeometry));
        const width = textBox.max.x - textBox.min.x;

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(
          Math.random() * 200 - 100, 
          Math.random() * 200 - 100, 
          Math.random() * -50 - 30
        );

        scene.add(textMesh);
      }
    });

    // Blood Particle System
    const bloodParticles = [];
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const particleGeometry = new THREE.SphereGeometry(0.7, 8, 8);
    const numParticles = 500;

    for (let i = 0; i < numParticles; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        Math.random() * 200 - 100,
        Math.random() * 200 - 100,
        Math.random() * -50 - 30
      );
      scene.add(particle);
      bloodParticles.push(particle);
    }

    const animateParticles = () => {
      let allParticlesOut = true;
      bloodParticles.forEach((particle) => {
        const targetPosition = new THREE.Vector3(0, -2, -30);
        const direction = particle.position.clone().normalize();
        const speed = 0.2;
        const rotationSpeed = 0.02;
        particle.position.add(direction.multiplyScalar(speed));
        particle.rotation.y += rotationSpeed;

        if (particle.position.distanceTo(targetPosition) < 200) {
          allParticlesOut = false;
        }
      });

      if (allParticlesOut) {
        heartMesh.rotation.y += 0.02;
      }
    };

    // Camera animation with rotation around the heart
    let rotationAngle = 0;
    const cameraAnimation = () => {
      rotationAngle += 0.01;
      camera.position.x = 40 * Math.sin(rotationAngle);
      camera.position.z = 40 * Math.cos(rotationAngle);
      camera.lookAt(heartMesh.position);
    };

    // Heart pulsation effect with smoother transitions
    let scaleDirection = 1;
    const pulsateHeart = () => {
      const minScale = 7;
      const maxScale = 9;
      const speed = 0.02;

      if (heartMesh.scale.x > maxScale || heartMesh.scale.x < minScale) scaleDirection *= -1;

      heartMesh.scale.x += speed * scaleDirection;
      heartMesh.scale.y += speed * scaleDirection;
      heartMesh.rotation.x += 0.005 * scaleDirection; 
      heartMesh.rotation.y += 0.005 * scaleDirection;
    };

    // Main animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      animateParticles();
      cameraAnimation();
      pulsateHeart();

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
  }, []);

  return <div />;
}
