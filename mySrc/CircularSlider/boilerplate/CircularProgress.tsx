import { type ColorValue, StyleSheet } from "react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { StyleGuide } from "../../components";

const { PI } = Math;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
interface CircularProgressProps {
  theta: Animated.SharedValue<number>;
  r: number;
  strokeWidth: number;
  backgroundColor: Animated.SharedValue<string | number>;
}

export const CircularProgress = ({
  r,
  theta,
  strokeWidth,
  backgroundColor,
}: CircularProgressProps) => {
  const radius = r - strokeWidth / 2;
  const circumference = radius * 2 * PI;
  // const progress = useDerivedValue(() => theta.value);
  const animatedProps = useAnimatedProps(() => {
    return {
      stroke: backgroundColor.value as ColorValue,
      // strokeDashoffset: progress.value * radius,
      // strokeDashoffset: Circle_Length * progress.value,
      strokeDashoffset: radius * theta.value,
    };
  });

  // useEffect(() => {
  //   progress.value = withRepeat(withTiming(1, { duration: 5000 }), 100, true);
  // }, [progress]);
  // useEffect(() => {
  //   progress.value = withRepeat(withTiming(1, { duration: 5000 }), 100, true);
  // progress.value = withTiming(0, { duration: 2000 });
  // }, [progress]);

  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Circle
        cx={r}
        cy={r}
        fill="transparent"
        stroke="white"
        r={radius}
        {...{ strokeWidth }}
      />
      <AnimatedCircle
        cx={r}
        cy={r}
        fill="transparent"
        r={radius}
        stroke={StyleGuide.palette.primary}
        strokeDasharray={`${circumference}, ${circumference}`}
        {...{ strokeWidth, animatedProps }}
      />
    </Svg>
  );
};
