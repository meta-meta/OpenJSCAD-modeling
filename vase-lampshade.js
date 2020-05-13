const range = n => Array(n).join().split(',').map((n, i) => i);

const segs = 128;
const nSpheres = 8;
const main = () => {
  const v = union(range(segs).map(n => {
    const progress = n / segs;
    const theta = Math.PI * 2 * progress;
    const x = 2 + Math.cos(theta / 2 + 0.5) * 2 * (progress);
    const height = 6;

    const jitter = 0.02 * (n % 2);
    const y0 = height * progress;
    const y1 = height * (progress + 1 / segs);

    return rotate_extrude(
      { fn: 5 },
      polygon({
        points: [
          [0, y0],
          [x, y0],
          [x, y1],
          [0, y1]
        ]
      }))
    // .rotateX(Math.sin(theta * 2) * progress * 10)
    // .rotateY(Math.cos(theta * 2) * progress * 10)
      .rotateZ(Math.sin(theta *  0.7) * 180)
  }).concat(range(nSpheres).map(n => {
    const progress = n / nSpheres;
    const theta = Math.PI * 2 * progress + 0.4;
    const r = 1.7;

    return sphere({ fn: 14, r: 0.5}).translate([r * Math.sin(theta), r * Math.cos(theta), 2])
  })));

  return v.subtract(v.scale([0.9, 0.9, 0.9]))
}

