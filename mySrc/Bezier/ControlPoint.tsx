import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { clamp } from "react-native-redash";

export const CONTROL_POINT_RADIUS = 20;

interface ControlPointProps {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  min: number;
  max: number;
}

export const ControlPoint = ({ x, y, min, max }: ControlPointProps) => {
  const context = useSharedValue({ x: 0, y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: x.value, y: y.value };
    })
    .onUpdate(({ translationX, translationY }) => {
      x.value = clamp(context.value.x + translationX, min, max);
      y.value = clamp(context.value.y + translationY, min, max);
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value - CONTROL_POINT_RADIUS },
      { translateY: y.value - CONTROL_POINT_RADIUS },
    ],
  }));
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: CONTROL_POINT_RADIUS * 2,
            height: CONTROL_POINT_RADIUS * 2,
          },
          style,
        ]}
      />
    </GestureDetector>
  );
};
