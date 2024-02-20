import { useCallback, useState } from "react";
import {
  type LayoutRectangle,
  SafeAreaView,
  View,
  StyleSheet,
  Button,
} from "react-native";
import {
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { IntroSlides } from "./components/IntroSlides";
import { tiles, titles } from "./constants";
import { AnimatedTitle } from "./components/AnimatedTitle";

const MAX_INDEX = tiles[0].slides.length - 1;
const DURATION = 300;
const SWIPE_WIDTH = 20;
// const SKIP_BUTTON_PADDING = 13;

export const Onboarding = () => {
  const animatedActiveIndex = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [animationContainerLayout, setAnimationContainerLayout] = useState<
    LayoutRectangle | undefined
  >();

  const handleNav = useCallback(
    (direction: "next" | "prev") => {
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
    [animatedActiveIndex, setActiveIndex]
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
          if (e.translationX < 0) {
            runOnJS(handleNav)("next");
          }
          if (e.translationX > 0) {
            runOnJS(handleNav)("prev");
          }
        } else {
          animatedActiveIndex.value = withTiming(activeIndex, {
            duration: DURATION,
            easing: Easing.out(Easing.quad),
          });
        }
      }
    });

  const handleNavigateToLogin = useCallback(() => {
    console.log("Navigate to Login");
  }, []);

  const isLastSlide = activeIndex === MAX_INDEX;
  return (
    <SafeAreaView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.content}>
          {/* TITLE */}
          <View style={styles.slideTitleContainer}>
            {titles.map((title, index) => (
              <AnimatedTitle
                key={title}
                title={title}
                index={index}
                totalSlides={titles.length}
                animatedActiveIndex={animatedActiveIndex}
              />
            ))}
          </View>
          {/* TILES */}
          <View
            style={styles.animationContainer}
            onLayout={({ nativeEvent: { layout } }) =>
              setAnimationContainerLayout(layout)
            }
          >
            {animationContainerLayout ? (
              <IntroSlides
                animatedActiveIndex={animatedActiveIndex}
                tiles={tiles}
              />
            ) : null}
          </View>
        </View>
      </GestureDetector>
      <View style={styles.footer}>
        {!isLastSlide ? (
          <Button
            onPress={() => handleNav("next")}
            // translateTitle
            title="onboarding.next"
            // RightIcon={<ArrowRight fill={theme.colors.white} />}
          />
        ) : (
          <Button
            onPress={handleNavigateToLogin}
            // translateTitle
            title="onboarding.get_started"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    paddingBottom: 10,
  },
  //   backButton: { paddingLeft: theme.paddings.contentPaddingHorizontal },
  //   skipButton: { padding: SKIP_BUTTON_PADDING },
  //   skipButtonContainer: {
  //     marginRight: theme.paddings.contentPaddingHorizontal - SKIP_BUTTON_PADDING,
  //   },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  //   alignEnd: {
  //     alignItems: "flex-end",
  //   },
  //   header: {
  //     flexDirection: "row",
  //     height: 46,
  //     alignItems: "center",
  //   },
  //   headerButtonContainer: {
  //     width: 70,
  //   },
  animationContainer: {
    flex: 1,
    position: "relative",
  },
  //   progressDotsContainer: {
  //     flex: 1,
  //     alignItems: "center",
  //   },
  slideTitleContainer: {
    width: "100%",
    height: 150,
    position: "relative",
  },
  footer: {
    paddingHorizontal: 24,
  },
});
