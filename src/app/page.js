"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { FontLoader, TextGeometry } from "three-stdlib";

export default function Home() {
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1); // Set background to white
    document.body.appendChild(renderer.domElement);

    // Add lighting
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Heart shape with pulsating effect
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

    // Pulsating heart animation
    const animateHeart = () => {
      const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 1; // Pulsate effect
      heartMesh.scale.set(pulse * 8, pulse * 8, 1);
    };

    // Create blood particles moving toward the heart
    const bloodParticles = [];
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const particleGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const numParticles = 1000;

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

    // Move blood particles toward the heart
    const animateParticles = () => {
      bloodParticles.forEach((particle) => {
        const targetPosition = new THREE.Vector3(0, -2, -30); // Heart center position
        const direction = targetPosition.sub(particle.position).normalize();
        const speed = 0.1;
        particle.position.add(direction.multiplyScalar(speed));
      });
    };

    // Create animated text
    const loader = new FontLoader();
    let textMesh;
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('I love You Najat!', {
        font: font,
        size: 5,
        height: 1,
        curveSegments: 12,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-30, 10, -50);
      scene.add(textMesh);
    });

    // Text animation (moving and changing color)
    const animateText = () => {
      if (textMesh) {
        textMesh.position.x += 0.1; // Move text to the right
        textMesh.material.color.setHSL((Math.sin(Date.now() * 0.001) + 1) / 2, 1, 0.5); // Change color
      }
    };

    // Camera positioning
    camera.position.z = 40;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate heart, particles, and text
      animateHeart();
      animateParticles();
      animateText();

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
  }, []);

  return <div />;
}
