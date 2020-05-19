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
    .translate([0, -bottomBorder, 0])
    .subtract(tongueCut(tongueCutProps));

const main = () => [3]
    .map((tongueTipL, i) =>
        base({
            length: 20 + tongueTipL,
            tongueCutProps: {
                tongueTipL
            }
        })
        .scale(2)
        .translate([i * 5, 0, 0]))
