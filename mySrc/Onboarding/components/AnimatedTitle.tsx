import { StyleSheet, Text, View } from "react-native";
import type Animated from "react-native-reanimated";
import { interpolate, useAnimatedStyle } from "react-native-reanimated";

import { Fader } from "./Fader";

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

  return (
    <Fader
      animatedActiveIndex={animatedActiveIndex}
      {...{ index, totalSlides, style }}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Fader>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  title: {
    width: "100%",
    textAlign: "center",
  },
});
