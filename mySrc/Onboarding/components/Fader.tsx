import { type ReactElement } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface IFaderProps {
  children: ReactElement;
  animatedActiveIndex: Animated.SharedValue<number>;
  index: number;
  totalSlides: number;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
}

export const Fader = ({
  children,
  animatedActiveIndex,
  index,
  totalSlides,
  style,
}: IFaderProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedActiveIndex.value,
      [...new Array(totalSlides)].map((_, i) => i),
      [...new Array(totalSlides)].map((_, i) => (i === index ? 1 : 0))
    );
    const translateX = interpolate(
      animatedActiveIndex.value,
      [...new Array(totalSlides)].map((_, i) => i),
      [...new Array(totalSlides)].map((_, i) => (i === index ? 0 : 2))
    );
    return { opacity, transform: [{ translateX }] };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
