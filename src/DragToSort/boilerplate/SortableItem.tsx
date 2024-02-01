import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { ReactElement } from "react";

interface ISortableItemProps {
  children: ReactElement;
  offsets: { y: Animated.SharedValue<number> }[];
  index: number;
  item: { height: number; width: number };
}

export const SortableItem = ({
  offsets,
  index,
  children,
  item: { height },
}: ISortableItemProps) => {
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
    .onEnd(() => {
      gestureActive.value = false;
      gestureFinishing.value = true;
      x.value = withSpring(0);
      y.value = withSpring(
        offset.y.value,
        {},
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: withSpring(gestureActive.value ? 1.1 : 1) },
      ],
      zIndex: gestureActive.value || gestureFinishing.value ? 100 : 0,
    };
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            // height,
            // width,
          },
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
