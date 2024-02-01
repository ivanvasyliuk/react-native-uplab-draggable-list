import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { clamp, withBouncing } from "react-native-redash";

import { CARD_HEIGHT, CARD_WIDTH, Card, Cards } from "../../components";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface GestureProps {
  width: number;
  height: number;
}

export const PanGesture = ({ width, height }: GestureProps) => {
  const boundX = width - CARD_WIDTH;
  const boundY = height - CARD_HEIGHT;
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: x.value, y: y.value };
    })
    .onUpdate((e) => {
      x.value = clamp(context.value.x + e.translationX, 0, boundX);
      x.value = clamp(context.value.y + e.translationY, 0, boundY);
    })
    .onEnd((e) => {
      x.value = withBouncing(
        withDecay({
          velocity: e.velocityX,
        }),
        0,
        boundX
      );
      y.value = withBouncing(
        withDecay({
          velocity: e.velocityY,
        }),
        0,
        boundY
      );
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector {...{ gesture }}>
        <Animated.View {...{ style }}>
          <Card card={Cards.Card1} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
