const range = n => Array(n).join().split(',').map((n, i) => i);

const gradient = () => {
  const w = 20;
  const h = 10;
  const nX = 20;
  const nY = 10;

  const grid = range(nX)
    .map(ix => range(nY).map(iy => [ix * (w / nX), iy * (h / nY)]))
    .reduce((row, array) => array.concat(row), [])
    .map(([x, y]) => cylinder({
      fn: 12,
      r: (0.6 * (w / nX)) * Math.abs((Math.cos(0.7 + 0.8 * (x / nX)))),
    }).translate([x + (((w / nX) * 0.5) * (y % 2)) + 0.5, y + 0.5, 0]))

  // return union(grid)
  return difference(cube({ size: [w, h, 0.05]}), union(grid))
}

const main = () => {
  const w = 10;
  const h = 10;
  const nX = 16;
  const nY = 16;

  const grid = range(nX)
    .map(ix => range(nY).map(iy => [ix * (w / nX), iy * (h / nY), iy]))
    .reduce((row, array) => array.concat(row), [])
    .map(([x, y, iY]) => cylinder({
      fn: 12,
      r: 0.25,
    }).translate([x + (((h / nY) * 0.5) * (iY % 2)) + 0.5, y + 0.5, 0]))

  // return union(grid)
  return difference(cube({ size: [w, h, 0.05]}), union(grid))

}

