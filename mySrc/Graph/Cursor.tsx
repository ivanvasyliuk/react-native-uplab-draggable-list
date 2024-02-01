import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

import type { Path } from "../components/AnimatedHelpers";

import type { DataPoint } from "./Label";

interface ICursorProps {
  path: Path;
  point: Animated.SharedValue<DataPoint>;
  length: Animated.SharedValue<number>;
}

const { width } = Dimensions.get("window");
const CURSOR = 100;

export const Cursor = ({ path, point, length }: ICursorProps) => {
  const offsetX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      offsetX.value = interpolate(
        length.value,
        [0, path.length],
        [0, width],
        Extrapolate.CLAMP
      );
    })
    .onChange((e) => {
      length.value = interpolate(
        offsetX.value + e.translationX,
        [0, width],
        [0, path.length],
        Extrapolate.CLAMP
      );
    })
    .onEnd((e) => {
      length.value = withDecay({
        velocity: e.velocityX,
        clamp: [0, path.length],
      });
      offsetX.value = e.translationX;
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
