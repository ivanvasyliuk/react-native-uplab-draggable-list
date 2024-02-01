import { type LayoutRectangle, StyleSheet, View } from "react-native";
import { useState } from "react";
import type Animated from "react-native-reanimated";

import { tiles } from "../constants";

import { Tile } from "./Tile";

interface IIntroSlidesProps {
  animatedActiveIndex: Animated.SharedValue<number>;
}

export const IntroSlides = ({ animatedActiveIndex }: IIntroSlidesProps) => {
  const [animationContainerLayout, setAnimationContainerLayout] = useState<
    LayoutRectangle | undefined
  >();

  return (
    <View
      style={styles.container}
      onLayout={({ nativeEvent: { layout } }) =>
        setAnimationContainerLayout(layout)
      }
    >
      {animationContainerLayout
        ? tiles.map((tile) => (
            <Tile
              key={tile.id}
              containerWidth={animationContainerLayout?.width}
              animatedActiveIndex={animatedActiveIndex}
              tile={tile}
            />
          ))
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
