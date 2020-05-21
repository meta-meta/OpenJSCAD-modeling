// title      : OpenJSCAD.org Logo
// author     : Rene K. Mueller
// license    : MIT License
// revision   : 0.003
// tags       : Logo,Intersection,Sphere,Cube
// file       : logo.jscad

const tongueCut = ({
                     borderW = 0.4,
                     tongueBaseW = 2,
                     tonguePointW = 1,
                     tongueShaftL = 15,
                     tongueTipL = 4,
                   } = {}) => rectangular_extrude([
  [tongueBaseW / -2, 0],
  [tonguePointW / -2, tongueShaftL],
  [0, tongueShaftL + tongueTipL],
  [tonguePointW / 2, tongueShaftL],
  [tongueBaseW / 2, 0]
], {
  w: borderW,
  h: 1,
  closed: false
});

const base = ({
                bottomBorder = 1,
                length = 30,
                thickness = 0.3,
                tongueCutProps,
                width = 4,
              } = {}) =>
  cube({
    center: [true, false, false],
    size: [width, length, thickness],
  })
    .subtract(
      tongueCut(tongueCutProps)
        .translate([0, bottomBorder, 0])
    );

// const main = () => [1]
//       .map((x, i, {  } = {}) =>
//
//            union([
//
//              // reed assembly
//              base({
//                bottomBorder: 3,
//                length: 30,
//                thickness: 0.5,
//                width: 7,
//
//                tongueCutProps: {
//                  borderW: 0.1,
//                  tongueBaseW: 4,
//                  tonguePointW: 2,
//                  tongueShaftL: 20,
//                  tongueTipL: 0,
//                }
//              })
//                .translate([i * 9, 0, 0]),
//
//
//              // bottom wall with cutout for reed assembly
//              cube({
//                center: [true, false, false],
//                size: [11, 100, 1],
//              })
//                .subtract(
//                  cube({
//                    center: [true, false, true],
//                    size: [7, 30, 2],
//                  })
//                ),
//
//
//
//            ])
//
//           )

const main = () => {

  const {
    tubeLength = 150,
    wallThickness = 1,
    r = 6,
  } = {};

  // const fn = 7;
  // const rot = 360 / 28;
  // const heightAdjust = r * 0.901;

  const fn = 3;
  const rot = 360 / 12;
  const heightAdjust = r * 0.5;

  const cyl = cylinder({r, h: tubeLength, fn: 3})
    .rotateX(90)
    .rotateY(rot);

  const bore = cylinder({
    r: r - wallThickness, h: tubeLength, fn: 3
  })
    .rotateX(90)
    .rotateY(rot)
    .translate([0, wallThickness, 0]);

  return union([
    cyl
      .subtract(bore)
      .translate([0, tubeLength - 10, heightAdjust])
      .subtract(
        cube({
          center: [true, false, true],
          size: [7, 30, 2],
        })
      ),

    // reed assembly
    base({
      bottomBorder: 3,
      length: 30,
      thickness: 0.5,
      width: 7,

      tongueCutProps: {
        borderW: 0.2,
        tongueBaseW: 4,
        tonguePointW: 2,
        tongueShaftL: 20,
        tongueTipL: 0,
      }
    })
      .translate([0, 0, 0]),
  ]);
}

