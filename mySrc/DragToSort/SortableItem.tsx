import type { ReactElement } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export interface Offset {
  y: Animated.SharedValue<number>;
}

interface SortableItemProps {
  index: number;
  offsets: Offset[];
  children: ReactElement;
  item: { height: number; width: number };
}

export const SortableItem = ({
  index,
  offsets,
  children,
  item: { height, width },
}: SortableItemProps) => {
  const gestureActive = useSharedValue(false);
  const gestureFinishing = useSharedValue(false);
  const offset = offsets[index];
  const safeOffsetY = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(offset.y.value);

  const gesture = Gesture.Pan()
    .onStart(() => {
      gestureActive.value = true;
      safeOffsetY.value = offset.y.value;
    })
    .onUpdate((e) => {
      x.value = e.translationX;
      y.value = safeOffsetY.value + e.translationY;
      const offsetY = Math.round(y.value / height) * height;
      offsets.forEach((o, i) => {
        if (o.y.value === offsetY && i !== index) {
          const tmp = o.y.value;
          o.y.value = offset.y.value;
          offset.y.value = tmp;
        }
      });
    })
    .onEnd((e) => {
      gestureActive.value = false;
      gestureFinishing.value = true;
      x.value = withSpring(0, {
        stiffness: 100,
        mass: 1,
        damping: 10,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
        velocity: e.velocityX,
      });
      y.value = withSpring(
        offset.y.value,
        {
          stiffness: 100,
          mass: 1,
          damping: 10,
          overshootClamping: false,
          restSpeedThreshold: 0.001,
          restDisplacementThreshold: 0.001,
          velocity: e.velocityY,
        },
        () => (gestureFinishing.value = false)
      );
    });

  const translateX = useDerivedValue(() => x.value);
  const translateY = useDerivedValue(() => {
    if (gestureActive.value) {
      return y.value;
    } else {
      return withSpring(offset.y.value);
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    zIndex: gestureActive.value || gestureFinishing.value ? 100 : 0,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: withSpring(gestureActive.value ? 1.1 : 1) },
    ],
  }));
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height,
            width,
          },
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
