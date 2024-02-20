import type { PathCommand, SkPath, Vector } from "@shopify/react-native-skia";
import { type Path, cubicBezierYForX, selectCurve } from "react-native-redash";
// import { type Path } from "react-native-svg";

// import { cubicBezierYForX, selectCurve } from "../SkiaWalletGraph/Math";
// import { cubicBezier } from "react-native-redash";

// export type Path = {
//   curves: BezierCurve[];
//   length: number;
// };

// export interface BezierCurve {
//   from: Vector;
//   to: Vector;
//   c1: Vector;
//   c2: Vector;
//   start: number;
//   end: number;
// }

// export function getPointPosition(
//   path: SkPath,
//   x: number,
//   width: number,
//   steps: number
// ) {
//   "worklet";
//   const index = Math.max(0, Math.floor(x / (width / steps)));
//   const fraction = (x / (width / steps)) % 1;
//   // console.log("fraction", fraction);
//   const p1 = path.getPoint(index);
//   // console.log("path.getPoint", path.getPoint(120));
//   console.log("p1", p1);
//   if (index < path.countPoints() - 1) {
//     const p2 = path.getPoint(index + 1);
//     // Interpolate between p1 and p2
//     return {
//       x: p1.x + (p2.x - p1.x) * fraction,
//       y: p1.y + (p2.y - p1.y) * fraction,
//     };
//   }
//   return p1;
// }

export const getYForX = (path: Path, x: number, precision = 2) => {
  "worklet";
  const c = selectCurve(path, x);
  if (c === null) {
    return 0;
  }
  return cubicBezierYForX(
    x,
    c.from,
    c.curve.c1,
    c.curve.c2,
    c.curve.to,
    precision
  );
};

// const getPointAtPositionInPath = (x, width, steps, path) => {
//   const index = Math.max(0, Math.floor(x / (width / steps)));
//   const fraction = (x / (width / steps)) % 1;
//   const p1 = path.getPoint(index);
//   if (index < path.countPoints() - 1) {
//     const p2 = path.getPoint(index + 1);
//     // Interpolate between p1 and p2
//     return {
//       x: p1.x + (p2.x - p1.x) * fraction,
//       y: p1.y + (p2.y - p1.y) * fraction,
//     };
//   }
//   return p1;
// };
