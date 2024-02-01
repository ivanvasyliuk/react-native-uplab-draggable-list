import {
  StyleSheet,
  type ImageSourcePropType,
  type StyleProp,
  type ImageStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface ITileImageLayerProps {
  source: ImageSourcePropType;
  totalSlides: number;
  slideIndex: number;
  animatedActiveIndex: Animated.SharedValue<number>;
  animatedDimensionsStyle: StyleProp<
    Animated.AnimateStyle<StyleProp<ImageStyle>>
  >;
}

export const TileImageLayer = ({
  source,
  animatedDimensionsStyle,
  totalSlides,
  slideIndex,
  animatedActiveIndex,
}: ITileImageLayerProps) => {
  const style = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedActiveIndex.value,
      [...new Array(totalSlides)].map((_, i) => i),
      [...new Array(totalSlides)].map((_, i) => (i === slideIndex ? 1 : 0))
    );
    return { opacity };
  });
  return (
    <Animated.Image
      source={source}
      style={[styles.imageBaseStyle, animatedDimensionsStyle, style]}
    />
  );
};

const styles = StyleSheet.create({
  imageBaseStyle: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
