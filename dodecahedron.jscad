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

const magnitude = vec => Math.sqrt(vec.map(n => n * n)
  .reduce((a,v) => a + v));

const normalize = vec => vec.map(n => n / magnitude(vec));

const main = () => {
	const r = radiusFromSide(120);
	const d = 3;
	const gap = 2;
  const rCorner = r/15;

  	const verts = getVertices(r);
 	
 	const pentagonPane = (index, d) => {
 		const pentVerts = pentagons[index].map(vertIndex => verts[vertIndex]);
		const face1Center = averageVerts(pentVerts);

		const face1Verts = pentVerts.concat([face1Center]);
		const face1Tris = range(5).map(i => [i, (i + 1) % 5, 5].reverse());

		const face1CenterNormalized = normalize(face1Center);

		const face2Verts = face1Verts.map(v => v.map((n, i) => n + face1CenterNormalized[i] * d));
		const face2Tris = range(5).map(i => [i, (i + 1) % 5, 5]).map(v => v.map(i => i + 6));

		const edgeTrisA = range(5).map(i => [i, (i + 1) % 5, i + 6])
		const edgeTrisB = range(5).map(i => [i + 6, i + (i == 0 ? 10 : 5), i])

		return polyhedron({
			points: face1Verts.concat(face2Verts),
			triangles: face1Tris.concat(face2Tris).concat(edgeTrisA).concat(edgeTrisB),
		}).translate(face1CenterNormalized.map(n => n * gap));
 	}

  const gapPanes = (d) => {
    const pentVerts = i => pentagons[i].map(vertIndex => verts[vertIndex]);

    const s1Verts = range(3)
      .map(iP => {
        const verts = pentVerts(iP);
        const normalizedCenter = normalize(averageVerts(verts));
        return verts.map((v, i) => v.map((n, i) => n + normalizedCenter[i] * gap));
      })
      .map(v => [v[0], v[1], v[4]]);
    const side1Points = s1Verts[0].concat(s1Verts[1]).concat(s1Verts[2]);

    const side1Tris = range(3) // top faces
        .map(n => n * 3)
        .reduce((a, i) => a.concat([
          [i, (i + 3) % 9, (i + 2) % 9], 
          [(i + 3) % 9, (i + 4) % 9, (i + 2) % 9]]), []);

    const s2Verts = range(3)
      .map(iP => {
        const verts = pentVerts(iP);
        const normalizedCenter = normalize(averageVerts(verts));
        return verts.map((v, i) => v.map((n, i) => n + normalizedCenter[i] * (gap + d)));
      })
      .map(v => [v[0], v[1], v[4]]);

    const side2Points = s2Verts[0].concat(s2Verts[1]).concat(s2Verts[2]);
    const side2Tris = side1Tris.map(v => v.map(n => n + 9).reverse()); // bottom faces

    const tris = [
        // [0, 9, 3], [3, 9, 12], // inner face
        [0, 2, 9], [2, 11, 9], // side face
        [3, 12, 4], [4, 12, 13], // side face
        [13, 2, 4], [2, 13, 11], // outer face

        // [3, 12, 6], [6, 12, 15], // inner face
        [3, 5, 12], [5, 14, 12], // side face
        [6, 15, 7], [7, 15, 16], // side face
        [16, 5, 7], [5, 16, 14], // outer face

        // [6, 15, 9], [9, 0, 6], // inner face
        [6, 8, 15], [8, 17, 15], // side face
        [9, 10, 0], [10, 1, 0], // side face
        [1, 10, 8], [8, 10, 17], // outer face

        [0, 6, 3], [9, 12, 15] // top/bottom inner triangle
        ];

    return polyhedron({
      points: side1Points.concat(side2Points),
      triangles: side1Tris // top faces
        .concat(side2Tris) // bottom faces
        .concat(tris) // side faces
      });

    // const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    // return pentVerts(0).map((v, i) => 
    //     color(colors[i], sphere())
    //     .translate(v)
    //     );
  }

  const cornerBall = () => 
    sphere({ r: rCorner })
      .rotateX(55) 
      .rotateZ(135)
      .translate(verts[0]); 

  const screwHole = () =>
    cylinder({ 
      h: 4 * rCorner, 
      r: 2,
      center: true,
    })
      .rotateX(55) // I don't understand why this is not 45
      .rotateZ(135)
      .translate(verts[0]);

  const nutHole = () =>
    linear_extrude({
        height: 4
      },
      circle({
        r: 4.75,
        fn: 6,
        center: true
      })
    )
    .translate([0, 0, rCorner - 4]);

  const counterSink = () => 
    cylinder({
      r1: 3.5,
      r2: 1.5,
      h: 3
    })
    .translate([0, 0, -rCorner])


  const topPiece = () => difference(
    cornerBall().subtract(screwHole()),
    gapPanes(d * 10),
    union(range(3).map(i => pentagonPane(i, d * 10)))
    );

  return difference( // inner
    topPiece()
      .translate(verts[0].map(n => -n))
      .rotateZ(-135)
      .rotateX(-55)
      .rotateX(180),
    nutHole()
    );

	return difference( // outer
		// verts.map(v => sphere().translate(v)),
		cornerBall().subtract(screwHole()),
    // gapPanes(d),
		union(range(3).map(i => pentagonPane(i, d))),
    topPiece(),
    nutHole()
    // screwHole()
		)
  .translate(verts[0].map(n => -n))
  .rotateZ(-135)
  .rotateX(-55)
  .rotateX(180)
  .subtract(counterSink());

  // return union(
  //   // verts.map(v => sphere().translate(v)),
  //   cornerBall(),
  //   union(range(3).map(i => pentagonPane(i, gap))),
  //   screwHole()
  //   )
  // .translate(verts[0].map(n => -n))
  // .rotateZ(-135)
  // .rotateX(-55)
  // .rotateX(180);
}