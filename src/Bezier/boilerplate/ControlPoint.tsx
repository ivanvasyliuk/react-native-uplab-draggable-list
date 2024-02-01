import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export const CONTROL_POINT_RADIUS = 20;

interface ControlPointProps {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  min: number;
  max: number;
}

export const ControlPoint = ({ x, y }: ControlPointProps) => {
  const context = useSharedValue({ x: 0, y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: x.value, y: y.value };
    })
    .onUpdate((e) => {
      x.value = e.translationX + context.value.x;
      y.value = e.translationY + context.value.y;
    });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x.value - CONTROL_POINT_RADIUS },
        { translateY: y.value - CONTROL_POINT_RADIUS },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: CONTROL_POINT_RADIUS * 2,
            height: CONTROL_POINT_RADIUS * 2,
            backgroundColor: "red",
          },
          style,
        ]}
      />
    </GestureDetector>
  );
};
