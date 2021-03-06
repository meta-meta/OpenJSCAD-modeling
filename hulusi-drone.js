const intervals = {
  0: 1,
  1: 16 / 15,
  2: 9 / 8,
  3: 6 / 5,
  4: 5 / 4,
  5: 4 / 3,
  6: 45 / 32,
  7: 3 / 2,
  8: 8 / 5,
  9: 5 / 3,
  10: 16 / 9,
  11: 15 / 8,
  12: 2,
};

/**
 * tongue is shaped like a sword: base==shaft==>point
 * tongueGap is the cut that will be subtracted from the reed plate
 * @param gapW - width of the gap
 * @param tongueBaseW - width of the base
 * @param tonguePointW - width of base of the triangle that forms the point
 * @param tongueShaftL - length of the shaft
 * @param tongueTipL - length from end of shaft to tip. if negative, forms a snake tongue
 * @returns {*}
 */
const tongueGap = ({
  gapW,
  tongueBaseW,
  tonguePointW,
  tongueShaftL,
  tongueTipL,
} = {}) => rectangular_extrude([ // extrude a path following these vertices
  [tongueBaseW / -2, 0],
  [tonguePointW / -2, tongueShaftL],
  [0, tongueShaftL + tongueTipL],
  [tonguePointW / 2, tongueShaftL],
  [tongueBaseW / 2, 0],
], {
  closed: false, // don't close the path. it's a segmented line, not an polygon
  h: 1,
  w: gapW,
});

/**
 * reedAssembly is a plate with a cutout to make a tongue for the freereed.
 * @param length
 * @param thickness
 * @param tongueGapProps
 * @param width
 * @param yOffset
 * @returns {*}
 */
const reedAssembly = ({
  length,
  thickness,
  tongueGapProps,
  width,
  yOffset,
} = {}) =>
  cube({
    center: [true, false, false],
    size: [width, length, thickness],
  })
    .subtract(
      tongueGap(tongueGapProps)
        .translate([0, yOffset, 0])
    );

const hulusiDrone = ({
  _isCalibration,
  boreLength,
  reedLength,
  reedOffset,
  reedPointWidth,
  reedThickness,
  reedBaseWidth,
  reedTongueGap,
  tubeDiameter,
  tubeSideCount,
  wallThickness,
}) => {
  const r = tubeDiameter / 2;
  const rot = 360 / (tubeSideCount * 4); // FIXME: this only works for tubeSideCount=3
  const heightAdjust = r * 0.5; // FIXME: this only works for tubeSideCount=3

  const tube = color([0, 1, 1], cylinder({
    fn: tubeSideCount,
    h: boreLength + wallThickness,
    r,
  })
    .rotateX(90)
    .rotateY(rot));

  const wallThicknessAdj = wallThickness * 2; // fudge for cylinder

  const bore = cylinder({
    fn: tubeSideCount,
    h: boreLength,
    r: r - wallThicknessAdj,
  })
    .rotateX(90)
    .rotateY(rot);

  const reedAssyLength = reedLength + reedOffset + (2 * reedTongueGap);
  const reedAssyWidth = reedBaseWidth + (4 * reedTongueGap);

  return union([
    ..._isCalibration ? [] : [
      tube
        .subtract(bore)
        .translate([
          0,
          boreLength,
          heightAdjust, // raise tube so bottom face is at z=0
        ])
        .subtract( // cutout for reedAssembly
          cube({
            center: [true, false, true], // don't center y so the edge is at y=0
            size: [reedAssyWidth, reedAssyLength, wallThicknessAdj],
          })
        )
    ],

    reedAssembly({
      length: reedAssyLength,
      thickness: reedThickness,
      width: reedAssyWidth,
      yOffset: reedOffset,

      tongueGapProps: {
        gapW: reedTongueGap,
        tongueBaseW: reedBaseWidth,
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

  //freereed-0-4-7--100
  /* return [0, 4, 7].map((i, idx) => hulusiTube({
     reedPointWidth: 2,//0.25 * i,
     reedOffset: 2,
     reedBaseWidth: 6,
     boreLength: 100 * (1 / intervals[i]),
   }).translate([10 * idx, 0, 0]));
 */
  //freereed-0-4-7--100-thin-strip-reed
  /*return [0, 4, 7].map((i, idx) => hulusiTube({
    reedPointWidth: 2,//0.25 * i,
    reedOffset: 2,
    reedLength: 15,
    reedBaseWidth: 2,
    boreLength: 100 * (1 / intervals[i]),
  }).translate([10 * idx, 0, 0]));*/


  /*return hulusiTube({
    reedLength: 8,
    reedOffset: 2,
    reedPointWidth: 0.5,
    reedThickness: 0.25,
    reedBaseWidth: 4,
    reedTongueGap: 0.4,
    tubeDiameter: 8,
    boreLength: 20,
    wallThickness: 1,
  });*/

  return [0, 5, 9, 12].map((i, idx) => hulusiDrone({
    _isCalibration: false, // true to print just the reed for z-calibration. It needs a very thin gap.
    boreLength: 200 * (1 / intervals[i]), // fixme: seems like clarinet f=3:1 at 1/2 length
    reedBaseWidth: 2.8,
    reedLength: 8,
    reedOffset: 2,
    reedPointWidth: 1,
    reedThickness: 0.2,
    reedTongueGap: 0.2,
    tubeDiameter: 8,
    tubeSideCount: 3,
    wallThickness: 0.6,
  }).translate([10 * idx, 0, 0]));

  /*
  * 100mm - 1243hz
  * 80mm - 1397hz  ~ 9/8
  * 66.6mm - 1570hz  ~ 5/4
  * */


// TODO: is there a way to generate filename here?

// TODO print housing for these with http://spheres.ml/ resonator
};

