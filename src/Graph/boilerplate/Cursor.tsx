import { View, StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

import type { Path } from "../../components/AnimatedHelpers";

import type { DataPoint } from "./Label";

const CURSOR = 100;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  cursorContainer: {
    width: CURSOR,
    height: CURSOR,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(100, 200, 300, 0.4)",
  },
  cursor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#367be2",
    borderWidth: 4,
    backgroundColor: "white",
  },
});

interface CursorProps {
  path: Path;
  length: Animated.SharedValue<number>;
  point: Animated.SharedValue<DataPoint>;
}

export const Cursor = ({ length, path, point }: CursorProps) => {
  const context = useSharedValue({ x: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value.x = interpolate(
        length.value,
        [0, path.length],
        [0, width],
        Extrapolate.CLAMP
      );
    })
    .onUpdate((e) => {
      length.value = interpolate(
        context.value.x + e.translationX,
        [0, width],
        [0, path.length],
        Extrapolate.CLAMP
      );
    })
    .onEnd(({ velocityX }) => {
      length.value = withDecay({
        velocity: velocityX,
        clamp: [0, path.length],
      });
    });

  const animatedStyle = useAnimatedStyle(() => {
    const { coord } = point.value;
    const translateX = coord.x - CURSOR / 2;
    const translateY = coord.y - CURSOR / 2;

    return { transform: [{ translateX }, { translateY }] };
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.cursorContainer, animatedStyle]}>
          <View style={styles.cursor} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
