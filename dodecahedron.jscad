const phi = (1 + Math.sqrt(5)) / 2;
const sqrt3 = Math.sqrt(3);

const getVertices = r => {
  const a = r / sqrt3;
  const b = r / (sqrt3 * phi);
  const c = (r * phi) / sqrt3;

  /*
   P(± a, ± a, ± a)
   P(0, ± b, ± c)
   P(± b, ± c, 0)
   P(± c, 0, ± b)
   */

  return [
    [ a,  a,  a],
    [-a,  a,  a],
    [ a, -a,  a],
    [ a,  a, -a],
    [-a, -a,  a],
    [ a, -a, -a],
    [-a,  a, -a],
    [-a, -a, -a],
    [ 0,  b,  c],
    [ 0, -b,  c],
    [ 0,  b, -c],
    [ 0, -b, -c],
    [ b,  c,  0],
    [-b,  c,  0],
    [ b, -c,  0],
    [-b, -c,  0],
    [ c,  0,  b],
    [ c,  0, -b],
    [-c,  0,  b],
    [-c,  0, -b],
  ];
};

const pentagons = [
  [0,8,1,13,12],
  [0,12,3,17,16],
  [0,16,2,9,8],
  [1,8,9,4,18],
  [1,18,19,6,13],
  [3,12,13,6,10],
  [2,14,15,4,9],
  [2,16,17,5,14],
  [3,10,11,5,17],
  [4,15,7,19,18],
  [5,11,7,15,14],
  [6,19,7,11,10]
];

const averageVerts = vecs => vecs
  .reduce(
    (acc, val) => acc.map((n, i) => val[i] + n),
    [0, 0, 0]
  )
  .map(n => n / vecs.length);

const getPentagons = radius => {
  const verts = getVertices(radius);
  return pentagons.map(pentagon => {
    const vertices = pentagon.map(vertIndex => verts[vertIndex]);
    return {
      vertices,
      center: averageVecs(vertices),
    }
  })
};

const radiusFromSide = (side) => (side / 4) * (Math.sqrt(15) + Math.sqrt(3));

const range = n => Array(n).join().split(',').map((n, i) => i);

const main = () => {
	const r = radiusFromSide(120);
	const d = 3;
	const gap = 2;

  	const verts = getVertices(r);
 	
 	const pentagonPane = (index) => {
 		const pentVerts = pentagons[index].map(vertIndex => verts[vertIndex]);
		const face1Center = averageVerts(pentVerts);

		const face1Verts = pentVerts.concat([face1Center]);
		const face1Tris = range(5).map(i => [i, (i + 1) % 5, 5].reverse());

		const distanceToFace1Center = Math.sqrt(face1Center.map(n => n * n).reduce((a,v) => a + v));
		const face1CenterNormalized = face1Center.map(n => n / distanceToFace1Center);

		const face2Verts = face1Verts.map(v => v.map((n, i) => n + face1CenterNormalized[i] * d));
		const face2Tris = range(5).map(i => [i, (i + 1) % 5, 5]).map(v => v.map(i => i + 6));

		const edgeTrisA = range(5).map(i => [i, (i + 1) % 5, i + 6])
		const edgeTrisB = range(5).map(i => [i + 6, i + (i == 0 ? 10 : 5), i])

		return polyhedron({
			points: face1Verts.concat(face2Verts),
			triangles: face1Tris.concat(face2Tris).concat(edgeTrisA).concat(edgeTrisB),
		}).translate(face1CenterNormalized.map(n => n * gap));
 	}

	return difference(
		// verts.map(v => sphere().translate(v)),
		sphere({ r: r/20 }).translate(verts[0]),
		union(range(12).map(pentagonPane))
		);
}