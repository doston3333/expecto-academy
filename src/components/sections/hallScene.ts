import { FAME_END, FAME_LEFT, FAME_RIGHT, type FameReport } from "@/lib/content";
import type { WebGLRenderer } from "three";

type ThreeNS = typeof import("three");

/** Wide enough that both walls are in frame at the doorway, on a narrow pane too. */
const H_FOV = 74;
const START_Z = 8.15;
const END_Z = -10.15;
const EYE_Y = 1.58;

function verticalFov(aspect: number) {
  const h = (H_FOV * Math.PI) / 180;
  const v = 2 * Math.atan(Math.tan(h / 2) / Math.max(aspect, 0.45));
  return Math.min((v * 180) / Math.PI, 78);
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvasTexture(
  T: ThreeNS,
  paint: (ctx: CanvasRenderingContext2D, size: number) => void,
  size: number,
  srgb: boolean,
  repeat?: [number, number],
) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("no 2d");
  paint(ctx, size);
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace;
  texture.anisotropy = 16;
  texture.wrapS = T.RepeatWrapping;
  texture.wrapT = T.RepeatWrapping;
  if (repeat) texture.repeat.set(repeat[0], repeat[1]);
  return texture;
}

function woodTextures(T: ThreeNS) {
  const size = 1024;
  const rand = mulberry32(0x5eed);
  const color = document.createElement("canvas");
  const rough = document.createElement("canvas");
  const normal = document.createElement("canvas");
  color.width = rough.width = normal.width = size;
  color.height = rough.height = normal.height = size;
  const cctx = color.getContext("2d", { willReadFrequently: true });
  const rctx = rough.getContext("2d", { willReadFrequently: true });
  const nctx = normal.getContext("2d");
  if (!cctx || !rctx || !nctx) throw new Error("no 2d");

  const height = new Float32Array(size * size);
  const planks = 8;
  const plankW = size / planks;
  cctx.fillStyle = "#6a4128";
  cctx.fillRect(0, 0, size, size);

  for (let p = 0; p < planks; p++) {
    const x0 = Math.floor(p * plankW);
    const x1 = Math.floor((p + 1) * plankW);
    const tone = 0.78 + rand() * 0.28;
    const red = Math.floor(78 * tone);
    const green = Math.floor(44 * tone);
    const blue = Math.floor(22 * tone);
    cctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    cctx.fillRect(x0, 0, x1 - x0, size);
    const img = cctx.getImageData(x0, 0, x1 - x0, size);
    const width = x1 - x0;
    for (let y = 0; y < size; y++) {
      const gy = (y / size) * Math.PI * 2;
      const grain =
        Math.sin(gy * 22 + p) * 6 + Math.sin(gy * 57 + p * 1.7) * 3 + Math.sin(gy * 9) * 4;
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const edge = Math.min(x, width - 1 - x);
        const groove = edge < 4 ? (4 - edge) * 16 : 0;
        img.data[i] = Math.max(0, Math.min(255, img.data[i] + grain - groove));
        img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + grain * 0.7 - groove));
        img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + grain * 0.35 - groove * 0.55));
        const bevel = edge < 6 ? (6 - edge) / 6 : 0;
        const fiber = Math.sin(gy * 40 + p) * 0.06;
        height[y * size + x0 + x] = 0.62 - bevel * 0.9 + fiber;
      }
    }
    cctx.putImageData(img, x0, 0);
    cctx.fillStyle = "rgba(22, 12, 7, 0.85)";
    cctx.fillRect(x1 - 2, 0, 2, size);
  }

  const normalPx = nctx.createImageData(size, size);
  const roughPx = rctx.createImageData(size, size);
  const strength = 2.4;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      const hL = height[y * size + Math.max(0, x - 1)];
      const hR = height[y * size + Math.min(size - 1, x + 1)];
      const hD = height[Math.max(0, y - 1) * size + x];
      const hU = height[Math.min(size - 1, y + 1) * size + x];
      const dx = (hL - hR) * strength;
      const dy = (hD - hU) * strength;
      const len = Math.hypot(dx, dy, 1);
      const o = i * 4;
      normalPx.data[o] = (dx / len) * 127 + 128;
      normalPx.data[o + 1] = (dy / len) * 127 + 128;
      normalPx.data[o + 2] = (1 / len) * 127 + 128;
      normalPx.data[o + 3] = 255;
      const seam = x % (size / planks) < 3 ? 48 : 0;
      const gloss = 150 + height[i] * 28 - seam;
      roughPx.data[o] = roughPx.data[o + 1] = roughPx.data[o + 2] = Math.max(0, Math.min(255, gloss));
      roughPx.data[o + 3] = 255;
    }
  }
  nctx.putImageData(normalPx, 0, 0);
  rctx.putImageData(roughPx, 0, 0);

  const colorMap = new T.CanvasTexture(color);
  colorMap.colorSpace = T.SRGBColorSpace;
  colorMap.anisotropy = 16;
  colorMap.wrapS = colorMap.wrapT = T.RepeatWrapping;
  colorMap.repeat.set(5.2, 1);

  const normalMap = new T.CanvasTexture(normal);
  normalMap.colorSpace = T.NoColorSpace;
  normalMap.anisotropy = 16;
  normalMap.wrapS = normalMap.wrapT = T.RepeatWrapping;
  normalMap.repeat.set(5.2, 1);

  const roughMap = new T.CanvasTexture(rough);
  roughMap.colorSpace = T.NoColorSpace;
  roughMap.wrapS = roughMap.wrapT = T.RepeatWrapping;
  roughMap.repeat.set(5.2, 1);

  return { colorMap, normalMap, roughMap };
}

function wallRoughness(T: ThreeNS) {
  return canvasTexture(
    T,
    (ctx, size) => {
      const rand = mulberry32(0x0a11);
      const image = ctx.createImageData(size, size);
      for (let i = 0; i < image.data.length; i += 4) {
        const n = 150 + rand() * 70;
        image.data[i] = image.data[i + 1] = image.data[i + 2] = n;
        image.data[i + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    },
    256,
    false,
    [3, 2],
  );
}

function sheetTexture(T: ThreeNS, report: FameReport, featured: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = featured ? 768 : 512;
  canvas.height = featured ? 960 : 680;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("no 2d");
  ctx.fillStyle = "#efe4d0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const grain = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rand = mulberry32(report.score * 13 + report.name.length);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (rand() - 0.5) * 14;
    grain.data[i] = Math.max(0, Math.min(255, grain.data[i] + n));
    grain.data[i + 1] = Math.max(0, Math.min(255, grain.data[i + 1] + n * 0.85));
    grain.data[i + 2] = Math.max(0, Math.min(255, grain.data[i + 2] + n * 0.55));
  }
  ctx.putImageData(grain, 0, 0);
  ctx.strokeStyle = "rgba(90, 74, 56, 0.28)";
  ctx.lineWidth = featured ? 3 : 2;
  const inset = featured ? 36 : 26;
  ctx.strokeRect(inset, inset, canvas.width - inset * 2, canvas.height - inset * 2);
  ctx.fillStyle = "#1a140e";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${featured ? 176 : 132}px "Instrument Sans", sans-serif`;
  ctx.fillText(String(report.score), canvas.width / 2, canvas.height * 0.44);
  ctx.fillStyle = "#5c5144";
  ctx.font = `500 ${featured ? 34 : 26}px "Instrument Sans", sans-serif`;
  ctx.fillText(`${report.rw}   ${report.math}`, canvas.width / 2, canvas.height * 0.62);
  ctx.fillStyle = "#3a3228";
  ctx.font = `italic ${featured ? 58 : 36}px "Cormorant Garamond", serif`;
  ctx.fillText(report.name, canvas.width / 2, canvas.height * 0.74);
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 16;
  return texture;
}

function addFrame(
  T: ThreeNS,
  parent: InstanceType<ThreeNS["Object3D"]>,
  report: FameReport,
  x: number,
  y: number,
  z: number,
  rotY: number,
  featured: boolean,
  gold: InstanceType<ThreeNS["MeshPhysicalMaterial"]>,
  matte: InstanceType<ThreeNS["MeshStandardMaterial"]>,
) {
  const w = featured ? 1.72 : 0.84;
  const h = featured ? 2.12 : 1.06;
  const mould = featured ? 0.075 : 0.055;
  const depth = 0.055;
  const group = new T.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  const bar = (bw: number, bh: number, px: number, py: number) => {
    const mesh = new T.Mesh(new T.BoxGeometry(bw, bh, depth), gold);
    mesh.position.set(px, py, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };
  group.add(
    bar(w, mould, 0, h / 2 - mould / 2),
    bar(w, mould, 0, -h / 2 + mould / 2),
    bar(mould, h - mould * 2, -w / 2 + mould / 2, 0),
    bar(mould, h - mould * 2, w / 2 - mould / 2, 0),
  );

  const liner = new T.Mesh(new T.BoxGeometry(w - mould * 2.05, h - mould * 2.05, 0.012), matte);
  liner.position.z = depth * 0.28;
  const paper = new T.Mesh(
    new T.PlaneGeometry((w - mould * 2) * 0.78, (h - mould * 2) * 0.78),
    new T.MeshStandardMaterial({
      map: sheetTexture(T, report, featured),
      roughness: 0.86,
      metalness: 0,
    }),
  );
  paper.position.z = depth * 0.42;
  paper.castShadow = false;
  group.add(liner, paper);
  parent.add(group);
}

function addArchitecture(
  T: ThreeNS,
  scene: InstanceType<ThreeNS["Scene"]>,
  trimMat: InstanceType<ThreeNS["MeshStandardMaterial"]>,
  railMat: InstanceType<ThreeNS["MeshStandardMaterial"]>,
  recessMat: InstanceType<ThreeNS["MeshStandardMaterial"]>,
) {
  const length = 23.2;
  const zMid = -3.15;

  const run = (side: -1 | 1) => {
    const xWall = side * 3.04;
    const into = -side;
    const chair = new T.Mesh(new T.BoxGeometry(0.1, 0.065, length), trimMat);
    chair.position.set(xWall + into * 0.07, 1.34, zMid);
    chair.castShadow = true;
    const base = new T.Mesh(new T.BoxGeometry(0.12, 0.14, length), trimMat);
    base.position.set(xWall + into * 0.07, 0.07, zMid);
    const crown = new T.Mesh(new T.BoxGeometry(0.14, 0.1, length), trimMat);
    crown.position.set(xWall + into * 0.06, 3.28, zMid);
    scene.add(chair, base, crown);

    const bays = 18;
    const bay = length / bays;
    for (let i = 0; i < bays; i++) {
      const z = zMid + length / 2 - bay * (i + 0.5);
      const recess = new T.Mesh(new T.BoxGeometry(0.018, 1.02, bay * 0.78), recessMat);
      recess.position.set(xWall + into * 0.01, 0.7, z);
      recess.receiveShadow = true;
      const stile = new T.Mesh(new T.BoxGeometry(0.05, 1.12, 0.055), railMat);
      stile.position.set(xWall + into * 0.045, 0.68, z + bay / 2);
      stile.castShadow = true;
      const rail = new T.Mesh(new T.BoxGeometry(0.045, 0.05, bay * 0.78), railMat);
      rail.position.set(xWall + into * 0.04, 0.16, z);
      scene.add(recess, stile, rail);
    }
  };

  run(-1);
  run(1);

  const endRail = new T.Mesh(new T.BoxGeometry(6.08, 0.065, 0.1), trimMat);
  endRail.position.set(0, 1.34, -14.58);
  const endBase = new T.Mesh(new T.BoxGeometry(6.08, 0.14, 0.12), trimMat);
  endBase.position.set(0, 0.07, -14.56);
  const endCrown = new T.Mesh(new T.BoxGeometry(6.08, 0.1, 0.14), trimMat);
  endCrown.position.set(0, 3.28, -14.58);
  scene.add(endRail, endBase, endCrown);
}

function galleryEnvironment(T: ThreeNS, renderer: WebGLRenderer) {
  const env = new T.Scene();
  const shell = new T.Mesh(
    new T.SphereGeometry(12, 24, 16),
    new T.MeshBasicMaterial({ color: 0x1a2c28, side: T.BackSide }),
  );
  const ceiling = new T.Mesh(
    new T.PlaneGeometry(16, 16),
    new T.MeshBasicMaterial({ color: 0xffe7c4 }),
  );
  ceiling.position.y = 5;
  ceiling.rotation.x = Math.PI / 2;
  const floor = new T.Mesh(
    new T.PlaneGeometry(16, 16),
    new T.MeshBasicMaterial({ color: 0x6a3e28 }),
  );
  floor.position.y = -2;
  floor.rotation.x = -Math.PI / 2;
  env.add(shell, ceiling, floor);
  const pmrem = new T.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const target = pmrem.fromScene(env, 0.04);
  pmrem.dispose();
  shell.geometry.dispose();
  ceiling.geometry.dispose();
  floor.geometry.dispose();
  (shell.material as InstanceType<ThreeNS["Material"]>).dispose();
  (ceiling.material as InstanceType<ThreeNS["Material"]>).dispose();
  (floor.material as InstanceType<ThreeNS["Material"]>).dispose();
  return target.texture;
}

export async function mountHall(
  canvas: HTMLCanvasElement,
  walk: { current: number },
): Promise<() => void> {
  const T = await import("three");
  await document.fonts.ready.catch(() => undefined);

  const renderer: WebGLRenderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  if (!renderer.getContext()) throw new Error("no webgl");
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;

  const scene = new T.Scene();
  scene.background = new T.Color(0x1a2826);
  scene.fog = new T.Fog(0x1c2a28, 20, 46);
  scene.environment = galleryEnvironment(T, renderer);
  scene.environmentIntensity = 0.32;

  const camera = new T.PerspectiveCamera(48, 1, 0.06, 48);

  const wood = woodTextures(T);
  const plasterRough = wallRoughness(T);
  const floorMat = new T.MeshPhysicalMaterial({
    map: wood.colorMap,
    normalMap: wood.normalMap,
    normalScale: new T.Vector2(0.38, 0.38),
    roughnessMap: wood.roughMap,
    roughness: 0.62,
    metalness: 0.03,
    clearcoat: 0.08,
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.28,
  });
  const wallMat = new T.MeshStandardMaterial({
    color: 0x1c3833,
    roughness: 0.9,
    roughnessMap: plasterRough,
    metalness: 0.02,
    envMapIntensity: 0.18,
  });
  const ceilMat = new T.MeshBasicMaterial({ color: 0xf6efe2 });
  const trimMat = new T.MeshStandardMaterial({
    color: 0xe4d8c4,
    roughness: 0.48,
    metalness: 0.12,
    envMapIntensity: 0.4,
  });
  const railMat = new T.MeshStandardMaterial({
    color: 0x27443e,
    roughness: 0.62,
    metalness: 0.06,
    envMapIntensity: 0.3,
  });
  const recessMat = new T.MeshStandardMaterial({
    color: 0x152824,
    roughness: 0.92,
    metalness: 0,
  });
  const gold = new T.MeshPhysicalMaterial({
    color: 0xc49a4e,
    metalness: 1,
    roughness: 0.4,
    clearcoat: 0.12,
    clearcoatRoughness: 0.45,
    envMapIntensity: 0.8,
  });
  const matte = new T.MeshStandardMaterial({ color: 0x100e0c, roughness: 0.92, metalness: 0.02 });

  const floor = new T.Mesh(new T.PlaneGeometry(6.5, 24), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -3.1);
  floor.receiveShadow = true;
  const ceiling = new T.Mesh(new T.PlaneGeometry(6.5, 24), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 3.38, -3.1);
  const left = new T.Mesh(new T.PlaneGeometry(24, 3.38), wallMat);
  left.rotation.y = Math.PI / 2;
  left.position.set(-3.08, 1.69, -3.1);
  left.receiveShadow = true;
  const right = new T.Mesh(new T.PlaneGeometry(24, 3.38), wallMat);
  right.rotation.y = -Math.PI / 2;
  right.position.set(3.08, 1.69, -3.1);
  right.receiveShadow = true;
  const end = new T.Mesh(new T.PlaneGeometry(6.16, 3.38), wallMat);
  end.position.set(0, 1.69, -14.72);
  end.receiveShadow = true;
  scene.add(floor, ceiling, left, right, end);
  addArchitecture(T, scene, trimMat, railMat, recessMat);

  FAME_LEFT.forEach((report, index) => {
    addFrame(T, scene, report, -2.78, 2.12, 5.7 - index * 1.12, Math.PI / 2, false, gold, matte);
  });
  FAME_RIGHT.forEach((report, index) => {
    addFrame(T, scene, report, 2.78, 2.12, 5.7 - index * 1.12, -Math.PI / 2, false, gold, matte);
  });
  addFrame(T, scene, FAME_END, 0, 1.78, -14.52, 0, true, gold, matte);

  scene.add(new T.HemisphereLight(0xfff4e4, 0x3a4a44, 0.42));
  scene.add(new T.AmbientLight(0xfff1e2, 0.14));

  const sun = new T.DirectionalLight(0xffe2c0, 0.62);
  sun.position.set(0.4, 7.2, 2.5);
  sun.target.position.set(0, 0, -6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.00035;
  sun.shadow.normalBias = 0.035;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 28;
  sun.shadow.camera.left = -8;
  sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 8;
  sun.shadow.camera.bottom = -8;
  scene.add(sun, sun.target);

  for (let i = 0; i < 8; i++) {
    const z = 6.4 - i * 2.45;
    const spot = new T.SpotLight(0xffc48a, 72, 14, 0.48, 0.92, 2);
    spot.position.set(0, 3.28, z);
    spot.target.position.set(0, 0, z);
    scene.add(spot, spot.target);

    const lamp = new T.Mesh(
      new T.CylinderGeometry(0.07, 0.09, 0.03, 20),
      new T.MeshStandardMaterial({
        color: 0xfff1d8,
        emissive: 0xffd7a4,
        emissiveIntensity: 2.4,
        roughness: 0.4,
      }),
    );
    lamp.position.set(0, 3.36, z);
    scene.add(lamp);
  }

  for (const side of [-1, 1] as const) {
    for (let i = 0; i < 4; i++) {
      const z = 4.5 - i * 4.2;
      const wash = new T.SpotLight(0xfff0d8, 32, 12, 0.7, 1, 2);
      wash.position.set(side * 1.15, 2.85, z);
      wash.target.position.set(side * 3.0, 1.7, z - 0.4);
      scene.add(wash, wash.target);
    }
  }

  const endSpot = new T.SpotLight(0xffe6c4, 86, 12, 0.78, 1, 2);
  endSpot.position.set(0, 3.05, -11.4);
  endSpot.target.position.set(0, 1.75, -14.55);
  endSpot.castShadow = true;
  endSpot.shadow.mapSize.set(1024, 1024);
  endSpot.shadow.bias = -0.0004;
  scene.add(endSpot, endSpot.target);

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width < 2 || height < 2) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = verticalFov(camera.aspect);
    camera.updateProjectionMatrix();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  let frame = 0;
  const tick = () => {
    frame = requestAnimationFrame(tick);
    const t = smoothstep(walk.current);
    const z = START_Z + (END_Z - START_Z) * t;
    camera.position.set(0, EYE_Y, z);
    camera.lookAt(0, 1.18 + t * 0.52, z - 6.5);
    renderer.render(scene, camera);
  };
  tick();

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    scene.environment?.dispose();
    renderer.dispose();
    scene.traverse((object) => {
      const mesh = object as InstanceType<ThreeNS["Mesh"]>;
      if (!mesh.isMesh) return;
      mesh.geometry?.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        const mapped = material as InstanceType<ThreeNS["MeshStandardMaterial"]>;
        mapped.map?.dispose();
        mapped.normalMap?.dispose();
        mapped.roughnessMap?.dispose();
        material.dispose();
      });
    });
  };
}
