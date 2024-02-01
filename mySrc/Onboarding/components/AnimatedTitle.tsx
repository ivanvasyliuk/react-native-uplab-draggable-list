import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface IAnimatedTitleProps {
  title: string;
  index: number;
  totalSlides: number;
  animatedActiveIndex: Animated.SharedValue<number>;
}

export const AnimatedTitle = ({
  title,
  index,
  totalSlides,
  animatedActiveIndex,
}: IAnimatedTitleProps) => {
  const style = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedActiveIndex.value,
      [...new Array(totalSlides)].map((_, i) => i),
      [...new Array(totalSlides)].map((_, i) => (index === i ? 1 : 0))
    );
    return { opacity, position: "absolute" };
  });

  return <Animated.Text {...{ style }}>{title}</Animated.Text>;
};
