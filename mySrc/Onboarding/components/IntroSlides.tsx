import type Animated from "react-native-reanimated";
import { type LayoutRectangle, View, StyleSheet } from "react-native";
import { useState } from "react";

import { Tile } from "./Tile";

type Tile = {
  id: string;
  slides: {
    width: number;
    originalWidth: number;
    originalHeight: number;
    x: number;
    y: number;
    image: string;
  }[];
};

interface IIntroSlidesProps {
  animatedActiveIndex: Animated.SharedValue<number>;
  tiles: Tile[];
}

export const IntroSlides = ({
  tiles,
  animatedActiveIndex,
}: IIntroSlidesProps) => {
  const [animationContainerLayout, setAnimationContainerLayout] = useState<
    LayoutRectangle | undefined
  >();

  return (
    <View
      style={styles.animationContainer}
      onLayout={({ nativeEvent: { layout } }) =>
        setAnimationContainerLayout(layout)
      }
    >
      {animationContainerLayout ? (
        <>
          {tiles.map((tile) => (
            <Tile
              key={tile.id}
              tile={tile}
              containerWidth={animationContainerLayout.width}
              animatedActiveIndex={animatedActiveIndex}
            />
          ))}
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    flex: 1,
    position: "relative",
  },
  //   outerIconContainer: {
  //     position: "absolute",
  //     width: ICON_CONTAINER_OUTER_SIZE,
  //     height: ICON_CONTAINER_OUTER_SIZE,
  //     borderRadius: ICON_CONTAINER_OUTER_SIZE / 2,
  //     backgroundColor: "#ffffff",
  //     opacity: 0.8,
  //   },
  //   innerIconContainer: {
  //     position: "absolute",
  //     width: ICON_CONTAINER_INNER_SIZE,
  //     height: ICON_CONTAINER_INNER_SIZE,
  //     borderRadius: ICON_CONTAINER_INNER_SIZE / 2,
  //     backgroundColor: "#ffffff",
  //     opacity: 1,
  //   },
});
