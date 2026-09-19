'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LotusWorldProps {
  paused: boolean;
  language: 'en' | 'hi';
  onPetalImageReady?: (dataUrl: string) => void;
  onProgressUpdate?: (readProgress: number, stagePercent: number, stageName: string) => void;
}

export default function LotusWorld({
  paused,
  language,
  onPetalImageReady,
  onProgressUpdate,
}: LotusWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const manualAngleRef = useRef(0);
  const openExtraRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let logo: THREE.Group | null = null;
    const parts: THREE.Mesh[] = [];

    function surface(u: number, v: number, l: number, w: number, h: number) {
      return new THREE.Vector3(
        v * w * Math.pow(Math.sin(Math.PI * u), 0.78),
        h * Math.pow(u, 1.55) + 0.45 * Math.sin(Math.PI * u) * v * v - 0.2 * Math.sin(Math.PI * u),
        0.09 + l * u
      );
    }

    function geometry(l: number, w: number, h: number) {
      const points: number[] = [];
      const colors: number[] = [];
      const indices: number[] = [];
      const rows = 44;
      const cols = 24;

      for (let i = 0; i <= rows; i++) {
        const u = i / rows;
        for (let j = 0; j <= cols; j++) {
          const v = (j / cols) * 2 - 1;
          const p = surface(u, v, l, w, h);
          points.push(p.x, p.y, p.z);
          const c = new THREE.Color(0xfff3da).lerp(new THREE.Color(0xf6c6d4), u);
          c.lerp(
            new THREE.Color(0xd52c76),
            Math.pow(u, 7) * 0.87 + Math.pow(Math.abs(v), 10) * u * 0.12
          );
          colors.push(c.r, c.g, c.b);

          if (i < rows && j < cols) {
            const a = i * (cols + 1) + j;
            const b = a + cols + 1;
            indices.push(a, b, a + 1, b, b + 1, a + 1);
          }
        }
      }

      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      g.setIndex(indices);
      g.computeVertexNormals();
      return g;
    }

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0xffffff, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 2.8, 8.7);
      camera.lookAt(0, -0.7, 0);

      scene.add(new THREE.HemisphereLight(0xfff8f0, 0x718467, 2));

      const key = new THREE.DirectionalLight(0xfff4df, 3.1);
      key.position.set(-4, 7, 5);
      scene.add(key);

      const rim = new THREE.DirectionalLight(0xffc9df, 2.3);
      rim.position.set(4, 3, -4);
      scene.add(rim);

      logo = new THREE.Group();
      logo.position.y = 0.35;
      scene.add(logo);

      const material = new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.43,
        metalness: 0,
        clearcoat: 0.18,
        side: THREE.DoubleSide,
      });

      const veins = new THREE.LineBasicMaterial({
        color: 0xbd557e,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      });

      const layers = [
        { n: 8, l: 2.35, w: 0.66, h: 0.18, y: 0 },
        { n: 7, l: 1.8, w: 0.62, h: 1.25, y: 0.09 },
        { n: 6, l: 1.14, w: 0.49, h: 2.12, y: 0.15 },
        { n: 4, l: 0.57, w: 0.3, h: 2.22, y: 0.22 },
      ];

      layers.forEach((l, k) => {
        for (let i = 0; i < l.n; i++) {
          const length = l.l * (1 + Math.sin(i * 2.7 + k) * 0.07);
          const lift = l.h * (1 + Math.cos(i * 2.1) * 0.08);
          const pivot = new THREE.Group();
          pivot.rotation.y = (i / l.n) * Math.PI * 2 + k * 0.39;
          pivot.rotation.z = Math.sin(i * 1.7) * 0.035;

          const m = new THREE.Mesh(geometry(length, l.w, lift), material);
          m.position.y = l.y;
          m.userData.layer = k;
          pivot.add(m);
          logo?.add(pivot);
          parts.push(m);

          const veinSegments: THREE.Vector3[] = [];
          for (let j = -6; j <= 6; j++) {
            const pts: THREE.Vector3[] = [];
            for (let q = 1; q < 44; q++) {
              const u = q / 44;
              const p = surface(u, (j / 7) * (0.65 + 0.35 * Math.sin(Math.PI * u)), length, l.w, lift);
              p.y += 0.008;
              pts.push(p);
            }
            for (let n = 1; n < pts.length; n++) {
              veinSegments.push(pts[n - 1], pts[n]);
            }
          }
          m.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(veinSegments), veins));
        }
      });

      const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.08, 0),
        new THREE.Vector3(0.18, -1.25, 0.07),
        new THREE.Vector3(0.39, -2.7, 0.12),
        new THREE.Vector3(0.16, -4.3, 0.03),
      ]);
      logo.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(path, 52, 0.075, 12, false),
          new THREE.MeshStandardMaterial({ color: 0x3e7840, roughness: 0.6 })
        )
      );

      const calyx = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 24, 16),
        new THREE.MeshStandardMaterial({ color: 0x729551, roughness: 0.65 })
      );
      calyx.scale.set(1, 0.65, 1);
      calyx.position.y = -0.06;
      logo.add(calyx);

      const heart = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 24, 16),
        new THREE.MeshStandardMaterial({ color: 0xeac36b, roughness: 0.65 })
      );
      heart.position.y = 0.65;
      heart.scale.y = 0.5;
      logo.add(heart);

      const resize = () => {
        if (!renderer || !camera) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.set(0, 2.8, width < 600 ? 12.3 : 8.7);
        camera.lookAt(0, -0.6, 0);
        camera.updateProjectionMatrix();
      };

      window.addEventListener('resize', resize);
      resize();

      // Render single petal snapshot for the mini-game
      try {
        const thumbRenderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
        });
        thumbRenderer.setSize(130, 180);
        thumbRenderer.setClearColor(0, 0);
        const ts = new THREE.Scene();
        ts.add(new THREE.HemisphereLight(0xffffff, 0x796351, 3));
        const tc = new THREE.PerspectiveCamera(35, 130 / 180, 0.1, 50);
        tc.position.set(0, 3, 4);
        tc.lookAt(0, 0.8, 1);
        const tp = new THREE.Mesh(
          geometry(1.8, 0.58, 1.2),
          new THREE.MeshStandardMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            roughness: 0.4,
          })
        );
        ts.add(tp);
        thumbRenderer.render(ts, tc);
        const petalUrl = thumbRenderer.domElement.toDataURL('image/png');
        thumbRenderer.dispose();
        tp.geometry.dispose();
        (tp.material as THREE.Material).dispose();

        if (onPetalImageReady) {
          onPetalImageReady(petalUrl);
        }
      } catch (err) {
        console.warn('Could not generate petal snapshot:', err);
      }
    } catch (e) {
      console.warn('WebGL init error:', e);
      canvas.hidden = true;
      document.body.classList.add('no3d');
    }

    // Pointer Drag & Interaction
    let dragging = false;
    let dragged = 0;
    let lastX = 0;
    let mx = 0;
    let my = 0;

    const dragZone = document.getElementById('drag-zone');
    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      dragged = 0;
    };
    const onPointerUp = () => {
      dragging = false;
    };
    const onPointerMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      if (dragging) {
        const dx = e.clientX - lastX;
        manualAngleRef.current += dx * 0.01;
        dragged += Math.abs(dx);
        lastX = e.clientX;
      }
    };
    const onClickDrag = () => {
      if (dragged < 6) {
        openExtraRef.current = openExtraRef.current ? 0 : 0.45;
      }
    };

    if (dragZone) {
      dragZone.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerup', onPointerUp);
      dragZone.addEventListener('pointercancel', onPointerUp);
      window.addEventListener('pointermove', onPointerMove);
      dragZone.addEventListener('click', onClickDrag);
    }

    // Render loop
    const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const mix = (a: number, b: number, t: number) => a + (b - a) * t;
    const smooth = (v: number) => v * v * (3 - 2 * v);

    let lastTime = 0;
    let ry = 0;
    let bloom = 0;
    let x = 0;
    let y = 0;
    let sc = 0.9;
    let sx = 0;
    let sy = 0;
    let opacity = 1;
    let animId: number;

    const sequenceEl = document.getElementById('sequence');

    const sceneOpacity = (el: HTMLElement | null, a: number) => {
      if (!el) return;
      el.style.opacity = String(a);
      el.style.visibility = a > 0.015 ? 'visible' : 'hidden';
      el.style.pointerEvents = a > 0.8 ? 'auto' : 'none';
    };

    const frame = (now: number) => {
      animId = requestAnimationFrame(frame);
      if (document.hidden) return;

      const dt = Math.min((now - lastTime) / 1000 || 0.016, 0.045);
      lastTime = now;
      const e = 1 - Math.exp(-6 * dt);
      const mobile = window.innerWidth < 600;

      let p = 0;
      let bottomVal = 0;
      if (sequenceEl) {
        const rect = sequenceEl.getBoundingClientRect();
        p = clamp(-rect.top / Math.max(1, sequenceEl.offsetHeight - window.innerHeight));
        bottomVal = rect.bottom;
      }

      const a = smooth(clamp((p - 0.13) / 0.2));
      const b = smooth(clamp((p - 0.61) / 0.22));

      sceneOpacity(document.querySelector('.scene-home'), 1 - a);
      sceneOpacity(document.querySelector('.scene-roots'), a * (1 - b));
      sceneOpacity(document.querySelector('.scene-bloom'), b);

      const stagePercent = Math.round(p * 100);
      const stageName =
        p < 0.45
          ? language === 'en'
            ? 'ROOTED'
            : 'जड़ें'
          : language === 'en'
          ? 'IN BLOOM'
          : 'विस्तार';

      const readProgress = Math.round(
        (window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      // Parallax depths for main sections
      document.documentElement.style.setProperty('--hero-y', (paused ? 0 : -p * 40) + 'px');
      document.querySelectorAll<HTMLElement>('main > section').forEach((section) => {
        const r = section.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const v = clamp((r.top + r.height * 0.5 - window.innerHeight * 0.5) / window.innerHeight, -1, 1);
        const factor = paused ? 0 : mobile ? 0.4 : 1;
        section.style.setProperty('--heading-depth', -v * 12 * factor + 'px');
        section.style.setProperty('--photo-depth', -v * 25 * factor + 'px');
        section.style.setProperty('--card-depth', -v * 13 * factor + 'px');
        section.style.setProperty('--image-depth', v * 9 * factor + 'px');
      });

      // Floating petals movement in footer game
      const gameContainer = document.getElementById('playground');
      if (gameContainer) {
        const gameRect = gameContainer.getBoundingClientRect();
        if (gameRect.top < window.innerHeight && gameRect.bottom > 0) {
          document.querySelectorAll<HTMLElement>('[data-petal]').forEach((el, i) => {
            const t = paused ? 0 : now * 0.0004;
            el.style.left = 12 + i * 15 + Math.sin(t + i * 2) * 5 + '%';
            el.style.top = 22 + (i % 3) * 19 + Math.cos(t * 1.2 + i) * 8 + '%';
            el.style.rotate = Math.sin(t + i) * 25 + 'deg';
          });
        }
      }

      if (onProgressUpdate) {
        onProgressUpdate(readProgress, stagePercent, stageName);
      }

      if (!renderer || !logo || !camera || !scene) return;

      const tx = mobile ? mix(0, 0.35, b) : mix(0, 2.3, b);
      const ty = mobile ? mix(-1.25, -1.8, b) : mix(-0.1, -0.3, b);
      const size = mobile ? 0.64 : 0.85;
      const targetAngle = paused ? manualAngleRef.current : p * Math.PI * 2.1 + manualAngleRef.current;

      sx = mix(sx, mx, e);
      sy = mix(sy, my, e);
      ry = mix(ry, targetAngle, e);
      x = mix(x, tx, e);
      y = mix(y, ty, e);
      sc = mix(sc, size + Math.sin(p * Math.PI) * 0.08, e);
      opacity = mix(opacity, bottomVal < window.innerHeight * 0.55 ? 0 : mix(0.12, 1, a), e);

      if (worldRef.current) {
        worldRef.current.style.opacity = String(opacity);
      }

      logo.position.set(x + (paused ? 0 : sx * 0.12), y, 0);
      logo.scale.setScalar(sc);
      logo.rotation.y = ry;
      logo.rotation.x = paused ? 0 : Math.sin(p * Math.PI * 2) * 0.16 + sy * 0.05;
      logo.rotation.z = paused ? 0 : Math.sin(p * Math.PI) * 0.1;

      bloom = mix(
        bloom,
        paused ? 0 : mix(0.48, -0.09, smooth(clamp(p * 1.4))) - openExtraRef.current,
        e
      );

      parts.forEach((m) => {
        m.rotation.x = bloom * (1 - m.userData.layer * 0.19);
      });

      if (opacity > 0.005) {
        renderer.render(scene, camera);
      }
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      if (dragZone) {
        dragZone.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointerup', onPointerUp);
        dragZone.removeEventListener('pointercancel', onPointerUp);
        window.removeEventListener('pointermove', onPointerMove);
        dragZone.removeEventListener('click', onClickDrag);
      }
      renderer?.dispose();
    };
  }, [paused, language, onPetalImageReady, onProgressUpdate]);

  return (
    <div id="world" ref={worldRef} aria-hidden="true">
      <canvas id="flower" ref={canvasRef}></canvas>
    </div>
  );
}
