import { Fragment } from "react";
import { Canvas, Line, Path, Text, useFont } from "@shopify/react-native-skia";
import { Dimensions, View } from "react-native";
import * as shape from "d3-shape";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";
import { clamp, vec2 } from "react-native-redash";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { getPointAtLength, parsePath } from "../components/AnimatedHelpers";

import { Cursor } from "./Cursor";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sfMono = require("../SkiaWalletGraph/components/SF-Mono-Medium.otf");

const { width: WIDTH } = Dimensions.get("window");

const PADDING_HORIZONTAL = 16;
const GRAPH_HEIGHT = 400;
const GRAPH_WIDTH = WIDTH - 2 * PADDING_HORIZONTAL;

const { width } = Dimensions.get("window");
const height = width;
const HORIZONTAL_LINES_GAP = 80;

const data: [number, number][] = [
  { x: new Date(2020, 5, 1), y: 4371 },
  { x: new Date(2020, 5, 2), y: 6198 },
  { x: new Date(2020, 5, 3), y: 5310 },
  { x: new Date(2020, 5, 4), y: 7188 },
  { x: new Date(2020, 5, 5), y: 8677 },
  { x: new Date(2020, 5, 6), y: 5012 },
].map((p) => [p.x.getTime(), p.y]);

const domain = {
  x: [Math.min(...data.map(([x]) => x)), Math.max(...data.map(([x]) => x))],
  y: [Math.min(...data.map(([, y]) => y)), Math.max(...data.map(([, y]) => y))],
};

const range = {
  x: [0, width - 32],
  y: [height, 0],
};

const scale = (v: number, d: number[], r: number[]) => {
  "worklet";
  return interpolate(v, d, r, Extrapolate.CLAMP);
};

const scaleInvert = (y: number, d: number[], r: number[]) => {
  "worklet";
  return interpolate(y, r, d, Extrapolate.CLAMP);
};

const d = shape
  .line()
  .x(([x]) => scale(x, domain.x, range.x))
  .y(([, y]) => scale(y, domain.y, range.y))
  .curve(shape.curveBasis)(data) as string;
const path = parsePath(d);

export const SkiaGraph = () => {
  const titleFont = useFont(sfMono, 14);

  const length = useSharedValue(0);
  const point = useDerivedValue(() => {
    const p = getPointAtLength(path, length.value);
    return {
      coord: {
        x: p.x,
        y: p.y,
      },
      data: {
        x: scaleInvert(p.x, domain.x, range.x),
        y: scaleInvert(p.y, domain.y, range.y),
      },
    };
  });

  const contextOffsetX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      contextOffsetX.value = length.value;
    })
    .onUpdate((e) => {
      length.value = clamp(
        contextOffsetX.value + (e.translationX * path.length) / range.x[1],
        0,
        path.length
      );
    })
    .onEnd(({ velocityX }) => {
      length.value = withDecay({
        velocity: velocityX,
        clamp: [0, path.length],
      });
    });

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      zIndex: 1,
      width: 100,
      height: 100,
      left: clamp(point.value.coord.x - 100 / 2, 0, width),
      top: point.value.coord.y - 100 / 2,
    };
  });

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: PADDING_HORIZONTAL,
        alignItems: "center",
      }}
    >
      <Cursor {...{ length, point, graphWidth: GRAPH_WIDTH }} />
      <Canvas
        style={{
          width: GRAPH_WIDTH,
          height: GRAPH_HEIGHT,
        }}
      >
        {[...new Array(6)].map((_, index) => (
          <Fragment key={index}>
            <Text
              x={15}
              y={HORIZONTAL_LINES_GAP * index - 5}
              text={index.toString()}
              font={titleFont}
              color="gray"
            />
            <Line
              p1={vec2(15, HORIZONTAL_LINES_GAP * index)}
              p2={vec2(400, HORIZONTAL_LINES_GAP * index)}
              color="lightgrey"
              style="stroke"
              strokeWidth={1}
            />
          </Fragment>
        ))}
        <Path style="stroke" path={d} strokeWidth={4} color="#6231ff" />
      </Canvas>
      <GestureDetector gesture={gesture}>
        <Animated.View style={style} />
      </GestureDetector>
    </View>
  );
};
