import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDecay,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { clamp, withBouncing } from "react-native-redash";

import { Card, Cards, CARD_WIDTH, CARD_HEIGHT } from "../components";

interface GestureProps {
  width: number;
  height: number;
}

export const PanGesture = ({ width, height }: GestureProps) => {
  const boundX = width - CARD_WIDTH;
  const boundY = height - CARD_HEIGHT;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((e) => {
      translateX.value = clamp(context.value.x + e.translationX, 0, boundX);
      translateY.value = clamp(context.value.y + e.translationY, 0, boundY);
    })
    .onEnd((e) => {
      translateX.value = withBouncing(
        withDecay({
          velocity: e.velocityX,
        }),
        0,
        boundX
      );
      translateY.value = withBouncing(
        withDecay({
          velocity: e.velocityY,
        }),
        0,
        boundY
      );
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={animatedStyle}>
          <Card card={Cards.Card1} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
