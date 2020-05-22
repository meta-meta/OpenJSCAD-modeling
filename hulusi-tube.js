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

const reedAssembly = ({
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

const hulusiTube = ({
  reedOffset = 0,
  reedPointWidth = 0.25,
  reedLength = 15,
  reedThickness = 0.3,
  reedWidth = 5,
  tubeDiameter = 11,
  tubeLength = 120, //187.5, //225,//150,
  tubeSides = 3,
  wallThickness = 1,
}) => {
  // const fn = 7;
  // const rot = 360 / 28;
  // const heightAdjust = r * 0.901;

  const r = tubeDiameter / 2;
  const rot = 360 / (tubeSides * 4);
  const heightAdjust = r * 0.5;

  const cyl = cylinder({r, h: tubeLength, fn: tubeSides})
    .rotateX(90)
    .rotateY(rot);

  const bore = cylinder({
    r: r - wallThickness,
    h: tubeLength,
    fn: tubeSides,
  })
    .rotateX(90)
    .rotateY(rot)
    .translate([0, wallThickness, 0]);

  const reedAssyLength = 30;
  const reedAssyWidth = reedWidth + 1;

  return union([
    cyl
      .subtract(bore)
      .translate([0, tubeLength - wallThickness, heightAdjust])
      .subtract(
        cube({
          center: [true, false, true],
          size: [reedAssyWidth, reedAssyLength, wallThickness],
        })
      ),

    reedAssembly({
      bottomBorder: reedOffset,
      length: reedAssyLength,
      thickness: reedThickness,
      width: reedAssyWidth,

      //TODO: try adding reinforcement to make more rigid
      tongueCutProps: {
        borderW: 0.23,
        tongueBaseW: reedWidth,
        tonguePointW: reedPointWidth,
        tongueShaftL: reedLength,
        tongueTipL: 0,
      }
    })
      .translate([0, 0, 0]),
  ]);
};


const main = () => {

  /*
  * 150mm -> ~290Hz
  * 225mm -> ~220Hz
  * 187.5 --> ~
  * */


  /* Looking for optimal reed placement.
   How much does distance to edge impact pitch?
  *  */

  return [
    ...[1, /*2,*/ 3, /*4,*/ 5].map(i => hulusiTube({
      reedPointWidth: 2,//0.25 * i,
      reedOffset: i,
      reedWidth: 6,
      tubeLength: 150,
    }).translate([6 * i, 0, 0])),
    ...[/*1, 2, 3,*/ 4, /*5*/].map(i => hulusiTube({
      reedPointWidth: 2,//0.25 * i,
      reedOffset: i,
      reedWidth: 6,
      tubeLength: 75,
    }).translate([ 12 * i, 0, 0]))
  ];



}

