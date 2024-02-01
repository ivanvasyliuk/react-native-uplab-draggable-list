import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

import { StyleGuide } from "../components";

const { width } = Dimensions.get("window");
const BALL_SIZE = 100;

export const MyHeartOfTheMatter = () => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: x.value, y: y.value };
    })
    .onUpdate((event) => {
      x.value = context.value.x + event.translationX;
      y.value = context.value.y + event.translationY;
    })
    .onEnd(() => {
      x.value = withDecay({ clamp: [0, width - BALL_SIZE] });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.ball, animatedStyle]} />
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ball: {
    backgroundColor: StyleGuide.palette.primary,
    height: BALL_SIZE,
    width: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
  },
});
