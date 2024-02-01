import { StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useMemo } from "react";

import type { tiles } from "../constants";

import { TileImageLayer } from "./TileImageLayer";

interface ITileProps {
  tile: (typeof tiles)[0];
  animatedActiveIndex: Animated.SharedValue<number>;
  containerWidth: number;
}

export const Tile = ({
  tile,
  animatedActiveIndex,
  containerWidth: w,
}: ITileProps) => {
  const indexes = useMemo(() => tile.slides.map((_, i) => i), [tile]);

  const animatedDimensionsStyle = useAnimatedStyle(() => {
    const width = interpolate(
      animatedActiveIndex.value,
      indexes,
      tile.slides.map((slide) => slide.width * w),
      Extrapolate.CLAMP
    );
    const height = interpolate(
      animatedActiveIndex.value,
      indexes,
      tile.slides.map((slide) => {
        const aspectRatio = slide.originalWidth / slide.originalHeight;
        return width / aspectRatio;
      }),
      Extrapolate.CLAMP
    );
    return { width, height };
  });

  const animatedPositionStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animatedActiveIndex.value,
      indexes,
      tile.slides.map((slide) => slide.x * w),
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      animatedActiveIndex.value,
      indexes,
      tile.slides.map((slide) => slide.y * w),
      Extrapolate.CLAMP
    );
    return { transform: [{ translateX }, { translateY }] };
  });

  return (
    <Animated.View
      key={tile.id}
      style={[styles.container, animatedDimensionsStyle, animatedPositionStyle]}
    >
      {tile.slides.map((slide, index) => (
        <TileImageLayer
          key={index}
          slideIndex={index}
          totalSlides={tile.slides.length}
          source={slide.image}
          animatedActiveIndex={animatedActiveIndex}
          animatedDimensionsStyle={animatedDimensionsStyle}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { position: "absolute", overflow: "hidden" },
});
