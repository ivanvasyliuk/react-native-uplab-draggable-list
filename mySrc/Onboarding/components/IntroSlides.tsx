import type Animated from "react-native-reanimated";
import { type LayoutRectangle, View, StyleSheet } from "react-native";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

import { icons } from "../constants";

import { Tile } from "./Tile";
import { Fader } from "./Fader";

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

const ICON_CONTAINER_OUTER_SIZE = 140;
const ICON_CONTAINER_INNER_SIZE = 100;
const ICON_SIZE = 45;

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
          <View
            style={[
              styles.outerIconContainer,
              {
                top:
                  animationContainerLayout.width / 2 -
                  ICON_CONTAINER_OUTER_SIZE / 2,
                left:
                  animationContainerLayout.width / 2 -
                  ICON_CONTAINER_OUTER_SIZE / 2,
              },
            ]}
          />
          <View
            style={[
              styles.innerIconContainer,
              {
                top:
                  animationContainerLayout.width / 2 -
                  ICON_CONTAINER_INNER_SIZE / 2,
                left:
                  animationContainerLayout.width / 2 -
                  ICON_CONTAINER_INNER_SIZE / 2,
              },
            ]}
          >
            {icons.map((icon, index) => (
              <Fader
                key={index}
                animatedActiveIndex={animatedActiveIndex}
                totalSlides={tiles.length}
                index={index}
              >
                <AntDesign name={icon} size={ICON_SIZE} />
              </Fader>
            ))}
          </View>
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
  outerIconContainer: {
    position: "absolute",
    width: ICON_CONTAINER_OUTER_SIZE,
    height: ICON_CONTAINER_OUTER_SIZE,
    borderRadius: ICON_CONTAINER_OUTER_SIZE / 2,
    backgroundColor: "#ffffff",
    opacity: 0.8,
  },
  innerIconContainer: {
    position: "absolute",
    width: ICON_CONTAINER_INNER_SIZE,
    height: ICON_CONTAINER_INNER_SIZE,
    borderRadius: ICON_CONTAINER_INNER_SIZE / 2,
    backgroundColor: "#ffffff",
    opacity: 1,
  },
});
