import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useMemo } from "react";

import { Card, type Cards } from "../components";

interface AnimatedCardProps {
  offsets: {
    y: Animated.SharedValue<number>;
    zIndex: Animated.SharedValue<number>;
  }[];
  index: number;
  card: Cards;
  distance: number;
}

export const AnimatedCard = ({
  card,
  offsets,
  index,
  distance,
}: AnimatedCardProps) => {
  const gestureActive = useSharedValue(false);
  const offset = offsets[index];
  const x = useSharedValue(0);
  const y = useSharedValue(offset.y.value);
  const safeOffsetY = useSharedValue(0);

  const sortedOffsetsList = useMemo(
    () => offsets.map((i) => i.y.value).sort((a, b) => a - b),
    [offsets]
  );

  const gesture = Gesture.Pan()
    .onStart(() => {
      gestureActive.value = true;
      safeOffsetY.value = offset.y.value;
    })
    .onUpdate((e) => {
      x.value = e.translationX;
      y.value = safeOffsetY.value + e.translationY;
      const offsetY = Math.round(y.value / distance) * distance;
      offsets.forEach((o, i) => {
        const newIndex = sortedOffsetsList.findIndex(
          (item) => item === offsetY
        );
        if (offsetY === o.y.value && i !== index) {
          const tmp = o.y.value;
          o.y.value = offset.y.value;
          o.zIndex.value = offset.zIndex.value;
          offset.y.value = tmp;
          offset.zIndex.value = newIndex;
        }
      });
    })
    .onEnd(() => {
      gestureActive.value = false;
      x.value = withSpring(0);
      y.value = withSpring(offset.y.value);
    });

  const translateY = useDerivedValue(() =>
    gestureActive.value ? y.value : withSpring(offset.y.value)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: translateY.value }],
    zIndex: offset.zIndex.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View key={card} style={[styles.overlay, animatedStyle]}>
        <Card {...{ card }} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
