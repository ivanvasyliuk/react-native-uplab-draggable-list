import * as React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { canvas2Polar, clamp, polar2Canvas } from "react-native-redash";

import { StyleGuide } from "../../components";

const THRESHOLD = 0.001;
interface CursorProps {
  r: number;
  strokeWidth: number;
  theta: Animated.SharedValue<number>;
  backgroundColor: Animated.SharedValue<string | number>;
}

export const Cursor = ({
  strokeWidth,
  r,
  theta,
  backgroundColor,
}: CursorProps) => {
  const context = useSharedValue({ x: 0, y: 0 });
  const center = { x: r, y: r };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = polar2Canvas({ theta: theta.value, radius: r }, center);
    })
    .onUpdate((e) => {
      const x = e.translationX + context.value.x;
      const y1 = e.translationY + context.value.y;
      let y: number;
      if (x < r) {
        y = y1;
      } else if (theta.value < Math.PI) {
        y = clamp(y1, 0, r - THRESHOLD);
      } else {
        y = clamp(y1, r, 2 * r);
      }
      const value = canvas2Polar({ x, y }, center).theta;
      theta.value = value > 0 ? value : 2 * Math.PI + value;
    });

  const animatedStyle = useAnimatedStyle(() => {
    const translate = polar2Canvas(
      {
        theta: theta.value,
        radius: r,
      },
      center
    );
    return {
      backgroundColor: backgroundColor.value,
      transform: [{ translateX: translate.x }, { translateY: translate.y }],
    };
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            width: strokeWidth,
            height: strokeWidth,
            borderRadius: strokeWidth / 2,
            borderColor: "white",
            borderWidth: 5,
            backgroundColor: StyleGuide.palette.primary,
          },
          animatedStyle,
        ]}
      />
    </GestureDetector>
  );
};
