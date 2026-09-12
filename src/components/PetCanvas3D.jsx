/**
 * src/components/PetCanvas3D.jsx
 * 
 * Interactive 3D WebGL Pet Renderer built with Three.js.
 * 
 * Features:
 * - High-craft stylized 3D characters for Dog, Cat, Penguin, and Unicorn.
 * - Cute chibi proportions, expressive glossy cartoon eyes with dual catchlights,
 *   soft blushing cheeks, and vinyl toy material aesthetics.
 * - Interactive cursor tracking: Pet's head smoothly tracks the user's mouse.
 * - Procedural animations: idle breathing, tail wagging, ear wiggling, wing flapping.
 * - 3D Attached Accessories: Top Hat, Bowtie, Glasses, Collar with bell, Bandana, Bow, Rainbow Glow.
 * - Action animations: Click-to-jump, celebrate bounce, and 360-degree victory spin.
 * - Developmental stage scaling (Baby, Young, Grown, Companion).
 * - Fully contained with proper sizing so it NEVER overlaps text or UI elements.
 */

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Developmental stage scaling
const STAGE_SCALES = {
  baby: 0.85,
  young: 1.0,
  grown: 1.15,
  companion: 1.3
};

export default function PetCanvas3D({
  petType = 'dog',
  growthStage = 'baby',
  equippedItems = [],
  animationTrigger = null, // 'celebrate' | 'spin-full'
  onAnimationEnd = null,
  reducedMotion = false,
  width = 260,
  height = 260,
  interactive = true
}) {
  const mountRef = useRef(null);
  const animStateRef = useRef({
    currentAnim: null,
    animTime: 0,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 }
  });

  // Keep anim trigger in sync
  useEffect(() => {
    if (animationTrigger && !reducedMotion) {
      animStateRef.current.currentAnim = animationTrigger;
      animStateRef.current.animTime = 0;
    }
  }, [animationTrigger, reducedMotion]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─── Scene, Camera & Renderer ───────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // ─── Lighting Setup ─────────────────────────────────────
    // Warm hemisphere ambient light for soft toy look
    const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x93c5fd, 1.25);
    scene.add(hemiLight);

    // Key sunlight from top-right
    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    dirLight.position.set(3, 5, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    scene.add(dirLight);

    // Soft rim light from back-left for 3D depth separation
    const rimLight = new THREE.DirectionalLight(0xa5b4fc, 0.7);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Soft front fill
    const fillLight = new THREE.PointLight(0xffedd5, 0.5, 8);
    fillLight.position.set(0, 1, 3);
    scene.add(fillLight);

    // ─── Root Pet Anchor ────────────────────────────────────
    const rootPetGroup = new THREE.Group();
    const scaleFactor = STAGE_SCALES[growthStage] || 1.0;
    rootPetGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
    scene.add(rootPetGroup);

    // ─── Shared Helper: Cute Expressive Cartoon Eye ──────────
    function createCuteEye(eyeColor = 0x1c1917, irisSize = 0.15) {
      const eyeGroup = new THREE.Group();
      
      // Eye base (glossy dark)
      const corneaGeo = new THREE.SphereGeometry(irisSize, 16, 16);
      const corneaMat = new THREE.MeshStandardMaterial({
        color: eyeColor,
        roughness: 0.15,
        metalness: 0.1
      });
      const cornea = new THREE.Mesh(corneaGeo, corneaMat);
      cornea.scale.set(1, 1.15, 0.5);
      eyeGroup.add(cornea);

      // Big sparkle highlight (top-right)
      const bigSparkleGeo = new THREE.SphereGeometry(irisSize * 0.38, 12, 12);
      const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const bigSparkle = new THREE.Mesh(bigSparkleGeo, whiteMat);
      bigSparkle.position.set(irisSize * 0.32, irisSize * 0.35, irisSize * 0.38);
      eyeGroup.add(bigSparkle);

      // Small glint highlight (bottom-left)
      const smallSparkleGeo = new THREE.SphereGeometry(irisSize * 0.18, 8, 8);
      const smallSparkle = new THREE.Mesh(smallSparkleGeo, whiteMat);
      smallSparkle.position.set(-irisSize * 0.28, -irisSize * 0.3, irisSize * 0.38);
      eyeGroup.add(smallSparkle);

      return eyeGroup;
    }

    // ─── Shared Helper: Rosy Blush Cheek ────────────────────
    function createCheek(radius = 0.14, color = 0xfda4af) {
      const geo = new THREE.CircleGeometry(radius, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide
      });
      const cheek = new THREE.Mesh(geo, mat);
      cheek.rotation.x = -0.1;
      return cheek;
    }

    // ─── Dynamic Model References for Animation ─────────────
    let headGroup = new THREE.Group();
    let tailGroup = new THREE.Group();
    let leftEar = null;
    let rightEar = null;
    let leftWing = null;
    let rightWing = null;
    let rainbowAuraGroup = null;

    // ─── Builders for 4 Pets ────────────────────────────────
    if (petType === 'dog') {
      // 🐶 PLAYFUL PUP: Shiba/Corgi Golden Puppy
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.45 });
      const creamMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.4 });
      const noseMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2 });
      const tongueMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
      const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.5 });

      // Body (cute pear shape)
      const bodyGeo = new THREE.SphereGeometry(0.68, 24, 24);
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.scale.set(0.92, 1.1, 0.88);
      body.position.set(0, -0.28, 0);
      body.castShadow = true;
      rootPetGroup.add(body);

      // Cream Chest Patch
      const chestGeo = new THREE.SphereGeometry(0.48, 16, 16);
      const chest = new THREE.Mesh(chestGeo, creamMat);
      chest.scale.set(0.78, 0.95, 0.45);
      chest.position.set(0, -0.22, 0.42);
      rootPetGroup.add(chest);

      // Head
      headGroup = new THREE.Group();
      headGroup.position.set(0, 0.48, 0.12);

      const headGeo = new THREE.SphereGeometry(0.72, 24, 24);
      const head = new THREE.Mesh(headGeo, bodyMat);
      head.scale.set(1.06, 0.96, 1.0);
      head.castShadow = true;
      headGroup.add(head);

      // White Muzzle
      const muzzleGeo = new THREE.SphereGeometry(0.36, 18, 18);
      const muzzle = new THREE.Mesh(muzzleGeo, creamMat);
      muzzle.scale.set(1.05, 0.78, 0.95);
      muzzle.position.set(0, -0.16, 0.52);
      headGroup.add(muzzle);

      // Nose
      const noseGeo = new THREE.SphereGeometry(0.11, 14, 14);
      const nose = new THREE.Mesh(noseGeo, noseMat);
      nose.scale.set(1.1, 0.85, 0.9);
      nose.position.set(0, -0.06, 0.82);
      headGroup.add(nose);

      // Smiling Pink Tongue
      const tongueGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const tongue = new THREE.Mesh(tongueGeo, tongueMat);
      tongue.scale.set(0.85, 0.35, 1.2);
      tongue.position.set(0, -0.26, 0.72);
      tongue.rotation.x = 0.3;
      headGroup.add(tongue);

      // Eyes
      const leftEye = createCuteEye(0x18181b, 0.14);
      leftEye.position.set(-0.28, 0.08, 0.62);
      leftEye.rotation.y = -0.25;
      headGroup.add(leftEye);

      const rightEye = createCuteEye(0x18181b, 0.14);
      rightEye.position.set(0.28, 0.08, 0.62);
      rightEye.rotation.y = 0.25;
      headGroup.add(rightEye);

      // Blushing Cheeks
      const leftCheek = createCheek(0.13, 0xfda4af);
      leftCheek.position.set(-0.48, -0.12, 0.48);
      leftCheek.rotation.y = -0.55;
      headGroup.add(leftCheek);

      const rightCheek = createCheek(0.13, 0xfda4af);
      rightCheek.position.set(0.48, -0.12, 0.48);
      rightCheek.rotation.y = 0.55;
      headGroup.add(rightCheek);

      // Ears (Cute Floppy Puppy Ears)
      const earGeo = new THREE.ConeGeometry(0.26, 0.52, 16);
      
      leftEar = new THREE.Mesh(earGeo, bodyMat);
      leftEar.position.set(-0.52, 0.54, 0.05);
      leftEar.rotation.set(-0.2, 0, 0.7);
      headGroup.add(leftEar);

      const innerEarGeo = new THREE.ConeGeometry(0.18, 0.42, 12);
      const leftInnerEar = new THREE.Mesh(innerEarGeo, innerEarMat);
      leftInnerEar.position.set(-0.5, 0.52, 0.1);
      leftInnerEar.rotation.set(-0.2, 0, 0.7);
      headGroup.add(leftInnerEar);

      rightEar = new THREE.Mesh(earGeo, bodyMat);
      rightEar.position.set(0.52, 0.54, 0.05);
      rightEar.rotation.set(-0.2, 0, -0.7);
      headGroup.add(rightEar);

      const rightInnerEar = new THREE.Mesh(innerEarGeo, innerEarMat);
      rightInnerEar.position.set(0.5, 0.52, 0.1);
      rightInnerEar.rotation.set(-0.2, 0, -0.7);
      headGroup.add(rightInnerEar);

      rootPetGroup.add(headGroup);

      // Paws (Sitting Chubby Paws)
      const pawGeo = new THREE.SphereGeometry(0.2, 14, 14);
      const leftPaw = new THREE.Mesh(pawGeo, creamMat);
      leftPaw.scale.set(1.0, 0.75, 1.3);
      leftPaw.position.set(-0.35, -0.85, 0.42);
      rootPetGroup.add(leftPaw);

      const rightPaw = new THREE.Mesh(pawGeo, creamMat);
      rightPaw.scale.set(1.0, 0.75, 1.3);
      rightPaw.position.set(0.35, -0.85, 0.42);
      rootPetGroup.add(rightPaw);

      // Tail (Wagging Curly Tail)
      tailGroup = new THREE.Group();
      tailGroup.position.set(0, -0.45, -0.55);
      const tailGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.5, 12);
      const tailMesh = new THREE.Mesh(tailGeo, bodyMat);
      tailMesh.position.set(0, 0.22, -0.15);
      tailMesh.rotation.x = -0.7;
      tailGroup.add(tailMesh);
      rootPetGroup.add(tailGroup);

    } else if (petType === 'cat') {
      // 🐱 MYSTIC KITTEN: Sweet Apricot / Ginger Kitten
      const furMat = new THREE.MeshStandardMaterial({ color: 0xfb923c, roughness: 0.4 });
      const creamMat = new THREE.MeshStandardMaterial({ color: 0xfff7ed, roughness: 0.35 });
      const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 });

      // Body
      const bodyGeo = new THREE.SphereGeometry(0.64, 24, 24);
      const body = new THREE.Mesh(bodyGeo, furMat);
      body.scale.set(0.9, 1.15, 0.85);
      body.position.set(0, -0.28, 0);
      body.castShadow = true;
      rootPetGroup.add(body);

      // Cream Chest
      const chestGeo = new THREE.SphereGeometry(0.44, 16, 16);
      const chest = new THREE.Mesh(chestGeo, creamMat);
      chest.scale.set(0.75, 0.95, 0.4);
      chest.position.set(0, -0.2, 0.38);
      rootPetGroup.add(chest);

      // Head
      headGroup = new THREE.Group();
      headGroup.position.set(0, 0.46, 0.08);

      const headGeo = new THREE.SphereGeometry(0.7, 24, 24);
      const head = new THREE.Mesh(headGeo, furMat);
      head.scale.set(1.12, 0.94, 0.98);
      head.castShadow = true;
      headGroup.add(head);

      // Cream Muzzle
      const muzzleGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const muzzle = new THREE.Mesh(muzzleGeo, creamMat);
      muzzle.scale.set(1.1, 0.72, 0.8);
      muzzle.position.set(0, -0.16, 0.52);
      headGroup.add(muzzle);

      // Cute Pink Triangle Nose
      const noseGeo = new THREE.ConeGeometry(0.08, 0.09, 3);
      const nose = new THREE.Mesh(noseGeo, pinkMat);
      nose.position.set(0, -0.09, 0.74);
      nose.rotation.set(0.4, 0, Math.PI);
      headGroup.add(nose);

      // Big Sparkling Teal/Cyan Anime Eyes
      const leftEye = createCuteEye(0x06b6d4, 0.15);
      leftEye.position.set(-0.29, 0.07, 0.58);
      leftEye.rotation.y = -0.25;
      headGroup.add(leftEye);

      const rightEye = createCuteEye(0x06b6d4, 0.15);
      rightEye.position.set(0.29, 0.07, 0.58);
      rightEye.rotation.y = 0.25;
      headGroup.add(rightEye);

      // Rosy Blushing Cheeks
      const leftCheek = createCheek(0.12, 0xfda4af);
      leftCheek.position.set(-0.46, -0.14, 0.45);
      leftCheek.rotation.y = -0.6;
      headGroup.add(leftCheek);

      const rightCheek = createCheek(0.12, 0xfda4af);
      rightCheek.position.set(0.46, -0.14, 0.45);
      rightCheek.rotation.y = 0.6;
      headGroup.add(rightCheek);

      // Cat Whiskers (Delicate white whiskers)
      const whiskerMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
      [-0.45, 0.45].forEach((wx, i) => {
        [-0.04, 0.04].forEach((wy) => {
          const points = [
            new THREE.Vector3(wx * 0.5, -0.16 + wy, 0.6),
            new THREE.Vector3(wx * 1.3, -0.16 + wy * 1.5, 0.55)
          ];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          headGroup.add(new THREE.Line(lineGeo, whiskerMat));
        });
      });

      // Upright Cat Ears with Pink Inner
      const earGeo = new THREE.ConeGeometry(0.24, 0.45, 14);
      leftEar = new THREE.Mesh(earGeo, furMat);
      leftEar.position.set(-0.46, 0.56, 0.04);
      leftEar.rotation.set(-0.1, 0, 0.35);
      headGroup.add(leftEar);

      const innerEarGeo = new THREE.ConeGeometry(0.16, 0.35, 10);
      const leftInnerEar = new THREE.Mesh(innerEarGeo, pinkMat);
      leftInnerEar.position.set(-0.44, 0.54, 0.09);
      leftInnerEar.rotation.set(-0.1, 0, 0.35);
      headGroup.add(leftInnerEar);

      rightEar = new THREE.Mesh(earGeo, furMat);
      rightEar.position.set(0.46, 0.56, 0.04);
      rightEar.rotation.set(-0.1, 0, -0.35);
      headGroup.add(rightEar);

      const rightInnerEar = new THREE.Mesh(innerEarGeo, pinkMat);
      rightInnerEar.position.set(0.44, 0.54, 0.09);
      rightInnerEar.rotation.set(-0.1, 0, -0.35);
      headGroup.add(rightInnerEar);

      rootPetGroup.add(headGroup);

      // Paws
      const pawGeo = new THREE.SphereGeometry(0.18, 14, 14);
      const leftPaw = new THREE.Mesh(pawGeo, creamMat);
      leftPaw.scale.set(0.9, 0.7, 1.2);
      leftPaw.position.set(-0.32, -0.85, 0.38);
      rootPetGroup.add(leftPaw);

      const rightPaw = new THREE.Mesh(pawGeo, creamMat);
      rightPaw.scale.set(0.9, 0.7, 1.2);
      rightPaw.position.set(0.32, -0.85, 0.38);
      rootPetGroup.add(rightPaw);

      // Tail (Curved Swishing Tail)
      tailGroup = new THREE.Group();
      tailGroup.position.set(0, -0.5, -0.5);
      const tailGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.65, 12);
      const tailMesh = new THREE.Mesh(tailGeo, furMat);
      tailMesh.position.set(0.15, 0.28, -0.15);
      tailMesh.rotation.set(-0.6, 0, -0.4);
      tailGroup.add(tailMesh);
      rootPetGroup.add(tailGroup);

    } else if (petType === 'penguin') {
      // 🐧 SNOWY PENGUIN: Adorable Chubby Baby Emperor Penguin
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35 });
      const snowMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const beakMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.25 });
      const footMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.3 });

      // Egg-shaped Body
      const bodyGeo = new THREE.SphereGeometry(0.74, 24, 24);
      const body = new THREE.Mesh(bodyGeo, darkMat);
      body.scale.set(0.95, 1.22, 0.92);
      body.position.set(0, -0.15, 0);
      body.castShadow = true;
      rootPetGroup.add(body);

      // Snowy White Belly
      const bellyGeo = new THREE.SphereGeometry(0.58, 20, 20);
      const belly = new THREE.Mesh(bellyGeo, snowMat);
      belly.scale.set(0.85, 1.05, 0.45);
      belly.position.set(0, -0.22, 0.45);
      rootPetGroup.add(belly);

      // Head
      headGroup = new THREE.Group();
      headGroup.position.set(0, 0.48, 0.05);

      const headGeo = new THREE.SphereGeometry(0.68, 24, 24);
      const head = new THREE.Mesh(headGeo, darkMat);
      head.scale.set(1.04, 0.98, 0.98);
      head.castShadow = true;
      headGroup.add(head);

      // Snowy White Face Mask
      const faceMaskGeo = new THREE.SphereGeometry(0.5, 18, 18);
      const faceMask = new THREE.Mesh(faceMaskGeo, snowMat);
      faceMask.scale.set(0.9, 0.75, 0.4);
      faceMask.position.set(0, -0.06, 0.48);
      headGroup.add(faceMask);

      // Rounded Orange Beak
      const beakGeo = new THREE.ConeGeometry(0.14, 0.3, 14);
      const beak = new THREE.Mesh(beakGeo, beakMat);
      beak.scale.set(1.1, 0.7, 1.0);
      beak.position.set(0, -0.12, 0.82);
      beak.rotation.x = Math.PI / 2 + 0.15;
      headGroup.add(beak);

      // Cheerful Eyes
      const leftEye = createCuteEye(0x0f172a, 0.13);
      leftEye.position.set(-0.25, 0.06, 0.58);
      leftEye.rotation.y = -0.2;
      headGroup.add(leftEye);

      const rightEye = createCuteEye(0x0f172a, 0.13);
      rightEye.position.set(0.25, 0.06, 0.58);
      rightEye.rotation.y = 0.2;
      headGroup.add(rightEye);

      // Bright Pink Rosy Blushing Cheeks
      const leftCheek = createCheek(0.12, 0xf472b6);
      leftCheek.position.set(-0.42, -0.14, 0.5);
      leftCheek.rotation.y = -0.5;
      headGroup.add(leftCheek);

      const rightCheek = createCheek(0.12, 0xf472b6);
      rightCheek.position.set(0.42, -0.14, 0.5);
      rightCheek.rotation.y = 0.5;
      headGroup.add(rightCheek);

      rootPetGroup.add(headGroup);

      // Flippers / Wings
      const flipperGeo = new THREE.BoxGeometry(0.14, 0.65, 0.35);
      flipperGeo.translate(0, -0.28, 0);

      leftWing = new THREE.Mesh(flipperGeo, darkMat);
      leftWing.position.set(-0.68, 0.05, 0.05);
      leftWing.rotation.set(0, 0, 0.35);
      rootPetGroup.add(leftWing);

      rightWing = new THREE.Mesh(flipperGeo, darkMat);
      rightWing.position.set(0.68, 0.05, 0.05);
      rightWing.rotation.set(0, 0, -0.35);
      rootPetGroup.add(rightWing);

      // Orange Webbed Feet
      const footGeo = new THREE.BoxGeometry(0.3, 0.08, 0.38);
      const leftFoot = new THREE.Mesh(footGeo, footMat);
      leftFoot.position.set(-0.28, -0.92, 0.25);
      rootPetGroup.add(leftFoot);

      const rightFoot = new THREE.Mesh(footGeo, footMat);
      rightFoot.position.set(0.28, -0.92, 0.25);
      rootPetGroup.add(rightFoot);

    } else if (petType === 'unicorn') {
      // 🦄 STARRY UNICORN: Magical Celestial Pastel Pony
      const coatMat = new THREE.MeshStandardMaterial({ color: 0xfdf4ff, roughness: 0.35 });
      const muzzleMat = new THREE.MeshStandardMaterial({ color: 0xfce7f3, roughness: 0.3 });
      const hornMat = new THREE.MeshStandardMaterial({
        color: 0xfde047,
        emissive: 0xfacc15,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.4
      });
      const manePinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 });
      const manePurpleMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, roughness: 0.4 });
      const maneCyanMat = new THREE.MeshStandardMaterial({ color: 0x67e8f9, roughness: 0.4 });
      const hoofMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3, metalness: 0.2 });

      // Body
      const bodyGeo = new THREE.SphereGeometry(0.66, 24, 24);
      const body = new THREE.Mesh(bodyGeo, coatMat);
      body.scale.set(0.9, 1.1, 0.95);
      body.position.set(0, -0.28, 0);
      body.castShadow = true;
      rootPetGroup.add(body);

      // Head
      headGroup = new THREE.Group();
      headGroup.position.set(0, 0.48, 0.12);

      const headGeo = new THREE.SphereGeometry(0.7, 24, 24);
      const head = new THREE.Mesh(headGeo, coatMat);
      head.scale.set(1.05, 0.95, 1.05);
      head.castShadow = true;
      headGroup.add(head);

      // Soft Pink Muzzle
      const muzzleGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const muzzle = new THREE.Mesh(muzzleGeo, muzzleMat);
      muzzle.scale.set(1.0, 0.75, 0.9);
      muzzle.position.set(0, -0.18, 0.58);
      headGroup.add(muzzle);

      // Golden Spiraling Magic Horn
      const hornGeo = new THREE.ConeGeometry(0.12, 0.65, 16);
      const horn = new THREE.Mesh(hornGeo, hornMat);
      horn.position.set(0, 0.76, 0.28);
      horn.rotation.x = -0.25;
      headGroup.add(horn);

      // Sparkling Deep Violet Anime Eyes
      const leftEye = createCuteEye(0x7c3aed, 0.15);
      leftEye.position.set(-0.28, 0.08, 0.64);
      leftEye.rotation.y = -0.22;
      headGroup.add(leftEye);

      const rightEye = createCuteEye(0x7c3aed, 0.15);
      rightEye.position.set(0.28, 0.08, 0.64);
      rightEye.rotation.y = 0.22;
      headGroup.add(rightEye);

      // Rosy Sweet Cheeks
      const leftCheek = createCheek(0.12, 0xfda4af);
      leftCheek.position.set(-0.46, -0.12, 0.52);
      leftCheek.rotation.y = -0.55;
      headGroup.add(leftCheek);

      const rightCheek = createCheek(0.12, 0xfda4af);
      rightCheek.position.set(0.46, -0.12, 0.52);
      rightCheek.rotation.y = 0.55;
      headGroup.add(rightCheek);

      // Cute Mane Locks
      const maneGeo = new THREE.SphereGeometry(0.18, 12, 12);
      
      const lockPink = new THREE.Mesh(maneGeo, manePinkMat);
      lockPink.scale.set(0.9, 1.4, 0.8);
      lockPink.position.set(-0.22, 0.58, 0.32);
      headGroup.add(lockPink);

      const lockPurple = new THREE.Mesh(maneGeo, manePurpleMat);
      lockPurple.scale.set(1.0, 1.5, 0.8);
      lockPurple.position.set(0.22, 0.56, 0.3);
      headGroup.add(lockPurple);

      const lockCyan = new THREE.Mesh(maneGeo, maneCyanMat);
      lockCyan.scale.set(0.85, 1.3, 0.8);
      lockCyan.position.set(0, 0.62, -0.15);
      headGroup.add(lockCyan);

      // Pony Ears
      const earGeo = new THREE.ConeGeometry(0.18, 0.42, 12);
      leftEar = new THREE.Mesh(earGeo, coatMat);
      leftEar.position.set(-0.42, 0.56, 0.08);
      leftEar.rotation.set(-0.15, 0, 0.4);
      headGroup.add(leftEar);

      rightEar = new THREE.Mesh(earGeo, coatMat);
      rightEar.position.set(0.42, 0.56, 0.08);
      rightEar.rotation.set(-0.15, 0, -0.4);
      headGroup.add(rightEar);

      rootPetGroup.add(headGroup);

      // Hooves
      const hoofGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.3, 14);
      const leftHoof = new THREE.Mesh(hoofGeo, hoofMat);
      leftHoof.position.set(-0.32, -0.82, 0.34);
      rootPetGroup.add(leftHoof);

      const rightHoof = new THREE.Mesh(hoofGeo, hoofMat);
      rightHoof.position.set(0.32, -0.82, 0.34);
      rootPetGroup.add(rightHoof);

      // Rainbow Flowing Tail
      tailGroup = new THREE.Group();
      tailGroup.position.set(0, -0.45, -0.5);
      const tailPart1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 0.6, 12), manePinkMat);
      tailPart1.position.set(-0.08, 0.15, -0.15);
      tailPart1.rotation.set(-0.6, 0, -0.3);
      tailGroup.add(tailPart1);

      const tailPart2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.14, 0.55, 12), maneCyanMat);
      tailPart2.position.set(0.08, 0.18, -0.12);
      tailPart2.rotation.set(-0.5, 0, 0.3);
      tailGroup.add(tailPart2);

      rootPetGroup.add(tailGroup);
    }

    // ─── 3D Equipped Accessories ─────────────────────────────
    const accGroup = new THREE.Group();
    headGroup.add(accGroup);

    const hasItem = (accType) => equippedItems.some((id) => id.includes(accType));

    // 1. Top Hat
    if (hasItem('hat')) {
      const hatGroup = new THREE.Group();
      hatGroup.position.set(0, 0.72, 0.05);

      const brimGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.06, 24);
      const brimMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3 });
      const brim = new THREE.Mesh(brimGeo, brimMat);
      hatGroup.add(brim);

      const topGeo = new THREE.CylinderGeometry(0.36, 0.38, 0.55, 24);
      const topMat = new THREE.MeshStandardMaterial({ color: 0x312e81, roughness: 0.3 });
      const top = new THREE.Mesh(topGeo, topMat);
      top.position.set(0, 0.28, 0);
      hatGroup.add(top);

      const ribbonGeo = new THREE.CylinderGeometry(0.39, 0.39, 0.1, 24);
      const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.2 });
      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbon.position.set(0, 0.08, 0);
      hatGroup.add(ribbon);

      hatGroup.rotation.z = -0.1;
      accGroup.add(hatGroup);
    }

    // 2. Bowtie (on neck)
    if (hasItem('bowtie')) {
      const bowGroup = new THREE.Group();
      bowGroup.position.set(0, -0.05, 0.45);

      const bowMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3 });
      const coneGeo = new THREE.ConeGeometry(0.14, 0.25, 12);
      
      const leftBow = new THREE.Mesh(coneGeo, bowMat);
      leftBow.rotation.z = Math.PI / 2;
      leftBow.position.set(-0.14, 0, 0);
      bowGroup.add(leftBow);

      const rightBow = new THREE.Mesh(coneGeo, bowMat);
      rightBow.rotation.z = -Math.PI / 2;
      rightBow.position.set(0.14, 0, 0);
      bowGroup.add(rightBow);

      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), bowMat);
      bowGroup.add(knot);

      rootPetGroup.add(bowGroup);
    }

    // 3. Glasses / Shades
    if (hasItem('glasses')) {
      const glassesGroup = new THREE.Group();
      glassesGroup.position.set(0, 0.08, 0.68);

      const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.3 });
      const lensMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        roughness: 0.1
      });

      const lensGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16);
      lensGeo.rotateX(Math.PI / 2);

      const leftLens = new THREE.Mesh(lensGeo, lensMat);
      leftLens.position.set(-0.28, 0, 0);
      glassesGroup.add(leftLens);

      const rightLens = new THREE.Mesh(lensGeo, lensMat);
      rightLens.position.set(0.28, 0, 0);
      glassesGroup.add(rightLens);

      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.04), frameMat);
      bridge.position.set(0, 0, 0);
      glassesGroup.add(bridge);

      headGroup.add(glassesGroup);
    }

    // 4. Collar with Golden Bell
    if (hasItem('collar')) {
      const collarGroup = new THREE.Group();
      collarGroup.position.set(0, -0.04, 0);

      const bandGeo = new THREE.TorusGeometry(0.48, 0.06, 12, 24);
      bandGeo.rotateX(Math.PI / 2);
      const bandMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      collarGroup.add(new THREE.Mesh(bandGeo, bandMat));

      const bellGeo = new THREE.SphereGeometry(0.1, 14, 14);
      const bellMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 });
      const bell = new THREE.Mesh(bellGeo, bellMat);
      bell.position.set(0, -0.06, 0.48);
      collarGroup.add(bell);

      rootPetGroup.add(collarGroup);
    }

    // 5. Bandana / Scarf
    if (hasItem('bandana')) {
      const bandanaGroup = new THREE.Group();
      bandanaGroup.position.set(0, -0.06, 0.25);

      const scarfGeo = new THREE.ConeGeometry(0.28, 0.35, 3);
      const scarfMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.4 });
      const scarf = new THREE.Mesh(scarfGeo, scarfMat);
      scarf.position.set(0, -0.15, 0.22);
      scarf.rotation.set(-0.35, 0, Math.PI);
      bandanaGroup.add(scarf);

      rootPetGroup.add(bandanaGroup);
    }

    // 6. Hair Ribbon Bow
    if (hasItem('bow')) {
      const bowGroup = new THREE.Group();
      bowGroup.position.set(0.42, 0.58, 0.28);
      bowGroup.rotation.z = -0.4;

      const bowMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 });
      const coneGeo = new THREE.ConeGeometry(0.1, 0.2, 12);

      const b1 = new THREE.Mesh(coneGeo, bowMat);
      b1.rotation.z = Math.PI / 2;
      b1.position.set(-0.1, 0, 0);
      bowGroup.add(b1);

      const b2 = new THREE.Mesh(coneGeo, bowMat);
      b2.rotation.z = -Math.PI / 2;
      b2.position.set(0.1, 0, 0);
      bowGroup.add(b2);

      bowGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), bowMat));
      headGroup.add(bowGroup);
    }

    // 7. Rainbow Particle Glow
    if (hasItem('rainbow_glow')) {
      rainbowAuraGroup = new THREE.Group();
      const starCount = 18;
      const colors = [0xf43f5e, 0xfb923c, 0xfacc15, 0x4ade80, 0x38bdf8, 0xa855f7];
      
      for (let i = 0; i < starCount; i++) {
        const angle = (i / starCount) * Math.PI * 2;
        const dist = 1.1 + Math.sin(i * 3) * 0.25;
        const starGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const starMat = new THREE.MeshBasicMaterial({ color: colors[i % colors.length] });
        const star = new THREE.Mesh(starGeo, starMat);
        star.position.set(Math.cos(angle) * dist, Math.sin(angle * 2) * 0.4 + 0.3, Math.sin(angle) * dist);
        rainbowAuraGroup.add(star);
      }
      rootPetGroup.add(rainbowAuraGroup);
    }

    // ─── Contact Floor Shadow ────────────────────────────────
    const shadowGeo = new THREE.CircleGeometry(0.75, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.25
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.96;
    scene.add(shadowMesh);

    // ─── Mouse & Touch Tracking ──────────────────────────────
    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      animStateRef.current.mouse.targetX = Math.max(-1, Math.min(1, x));
      animStateRef.current.mouse.targetY = Math.max(-1, Math.min(1, y));
    };

    const handleMouseLeave = () => {
      animStateRef.current.mouse.targetX = 0;
      animStateRef.current.mouse.targetY = 0;
    };

    const handleClick = () => {
      if (!interactive || reducedMotion) return;
      animStateRef.current.currentAnim = 'celebrate';
      animStateRef.current.animTime = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    // ─── Animation Render Loop ───────────────────────────────
    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse tracking lerp
      const mouse = animStateRef.current.mouse;
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // Handle custom action animations (celebrate / spin-full)
      const state = animStateRef.current;
      if (state.currentAnim) {
        state.animTime += delta;
        const t = state.animTime;

        if (state.currentAnim === 'celebrate') {
          // Playful double jump with squash and stretch
          const jumpDur = 0.7;
          if (t < jumpDur) {
            const jumpNorm = (t / jumpDur) * Math.PI * 2;
            const jumpY = Math.abs(Math.sin(jumpNorm)) * 0.8;
            rootPetGroup.position.y = jumpY;
            rootPetGroup.rotation.y = Math.sin(jumpNorm) * 0.4;
            shadowMesh.scale.setScalar(Math.max(0.4, 1 - jumpY * 0.7));
            shadowMesh.material.opacity = Math.max(0.08, 0.25 - jumpY * 0.18);
          } else {
            rootPetGroup.position.y = 0;
            rootPetGroup.rotation.y = 0;
            shadowMesh.scale.setScalar(1);
            shadowMesh.material.opacity = 0.25;
            state.currentAnim = null;
            if (onAnimationEnd) onAnimationEnd();
          }
        } else if (state.currentAnim === 'spin-full') {
          // 360 Victory Spin
          const spinDur = 0.9;
          if (t < spinDur) {
            const progress = t / spinDur;
            rootPetGroup.rotation.y = progress * Math.PI * 2;
            rootPetGroup.position.y = Math.sin(progress * Math.PI) * 0.45;
          } else {
            rootPetGroup.rotation.y = 0;
            rootPetGroup.position.y = 0;
            state.currentAnim = null;
            if (onAnimationEnd) onAnimationEnd();
          }
        }
      } else {
        // Natural Idle Breathing and Motion
        if (!reducedMotion) {
          const idleY = Math.sin(time * 2.4) * 0.035;
          rootPetGroup.position.y = idleY;
          shadowMesh.scale.setScalar(1 - idleY * 1.5);

          // Head looks towards cursor
          headGroup.rotation.y = mouse.x * 0.42;
          headGroup.rotation.x = -mouse.y * 0.25;

          // Tail wagging
          if (tailGroup) {
            tailGroup.rotation.y = Math.sin(time * 4.2) * 0.35;
          }

          // Ear twitching
          if (leftEar && rightEar && Math.sin(time * 1.8) > 0.8) {
            leftEar.rotation.z = 0.7 + Math.sin(time * 12) * 0.1;
            rightEar.rotation.z = -0.7 - Math.sin(time * 12) * 0.1;
          }

          // Penguin wings flap
          if (leftWing && rightWing) {
            const flap = Math.sin(time * 3.5) * 0.15;
            leftWing.rotation.z = 0.35 + flap;
            rightWing.rotation.z = -0.35 - flap;
          }

          // Rainbow Aura rotation
          if (rainbowAuraGroup) {
            rainbowAuraGroup.rotation.y = time * 1.2;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ─────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      scene.clear();
      container.innerHTML = '';
    };
  }, [petType, growthStage, equippedItems, reducedMotion, width, height, interactive, onAnimationEnd]);

  return (
    <div
      ref={mountRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        cursor: interactive ? 'pointer' : 'default',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
      }}
      aria-label={`Interactive 3D ${petType} companion`}
      role="img"
    />
  );
}
