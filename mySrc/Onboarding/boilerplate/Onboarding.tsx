import {
  type LayoutRectangle,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useCallback, useState } from "react";

import { tiles } from "../constants";

import { IntroSlides } from "./IntroSlides";

const MAX_INDEX = tiles[0].slides.length - 1;
const DURATION = 300;
const SWIPE_WIDTH = 20;

export const Onboarding = () => {
  const animatedActiveIndex = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [animationContainerLayout, setAnimationContainerLayout] = useState<
    LayoutRectangle | undefined
  >();

  const handleNav = useCallback(
    (direction: "prev" | "next") => {
      const to =
        direction === "next"
          ? Math.min(Math.round(animatedActiveIndex.value) + 1, MAX_INDEX)
          : Math.max(Math.round(animatedActiveIndex.value) - 1, 0);
      setActiveIndex(to);
      animatedActiveIndex.value = withTiming(to, {
        duration: DURATION,
        easing: Easing.out(Easing.quad),
      });
    },
    [animatedActiveIndex]
  );

  const gesture = Gesture.Pan()
    .onChange((e) => {
      if (animationContainerLayout) {
        animatedActiveIndex.value = interpolate(
          -e.translationX,
          [-animationContainerLayout.width, 0, animationContainerLayout.width],
          [activeIndex - 0.2, activeIndex, activeIndex + 0.2],
          Extrapolate.CLAMP
        );
      }
    })
    .onEnd((e) => {
      if (animationContainerLayout) {
        if (Math.abs(e.translationX) > SWIPE_WIDTH) {
          if (e.translationX > 0) {
            runOnJS(handleNav)("prev");
          }
          if (e.translationX < 0) {
            runOnJS(handleNav)("next");
          }
        } else {
          animatedActiveIndex.value = withTiming(activeIndex, {
            duration: DURATION,
            easing: Easing.out(Easing.quad),
          });
        }
      }
    });

  return (
    <SafeAreaView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View
          style={styles.animationContainer}
          onLayout={({ nativeEvent: { layout } }) =>
            setAnimationContainerLayout(layout)
          }
        >
          {animationContainerLayout ? (
            <IntroSlides animatedActiveIndex={animatedActiveIndex} />
          ) : null}
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  animationContainer: { flex: 1, position: "relative" },
  container: { flex: 1, paddingHorizontal: 16 },
});
