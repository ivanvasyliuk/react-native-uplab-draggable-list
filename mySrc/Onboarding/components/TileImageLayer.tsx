import { type FC } from "react";
import {
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  StyleSheet,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface ITileImageLayerProps {
  animatedDimensionsStyle: StyleProp<
    Animated.AnimateStyle<StyleProp<ImageStyle>>
  >;
  animatedActiveIndex: Animated.SharedValue<number>;
  source: ImageSourcePropType;
  totalSlides: number;
  slideIndex: number;
}
export const TileImageLayer: FC<ITileImageLayerProps> = ({
  animatedDimensionsStyle,
  animatedActiveIndex,
  totalSlides,
  slideIndex,
  source,
}) => {
  const style = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedActiveIndex.value,
      [...new Array(totalSlides)].map((_, i) => i),
      [...new Array(totalSlides)].map((_, i) => (slideIndex === i ? 1 : 0))
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
