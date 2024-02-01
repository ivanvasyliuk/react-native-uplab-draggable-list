import type { Ref } from "react";
import React, { forwardRef, useImperativeHandle } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";

import type { ProfileModel } from "./Profile";
import { Profile, α } from "./Profile";

const { width, height } = Dimensions.get("window");

const A = Math.round(width * Math.cos(α) + height * Math.sin(α));
const snapPoints = [-A, 0, A];

export type SwipeHandler = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

interface SwiperProps {
  onSwipe: () => void;
  profile: ProfileModel;
  onTop: boolean;
  scale: Animated.SharedValue<number>;
}

const swipe = (
  translateX: Animated.SharedValue<number>,
  dest: number,
  velocity: number,
  cb: () => void
) => {
  "worklet";
  translateX.value = withSpring(
    dest,
    {
      velocity,
      overshootClamping: dest === 0 ? false : true,
      restSpeedThreshold: dest === 0 ? 0.01 : 100,
      restDisplacementThreshold: dest === 0 ? 0.01 : 100,
    },
    () => {
      if (dest !== 0) {
        runOnJS(cb)();
      }
    }
  );
};

export const Swipeable = forwardRef(
  ({ onSwipe, profile, onTop, scale }: SwiperProps, ref: Ref<SwipeHandler>) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const context = useSharedValue({ x: 0, y: 0 });

    useImperativeHandle(ref, () => ({
      swipeLeft: () => {
        swipe(translateX, -A, 5, onSwipe);
      },
      swipeRight: () => {
        swipe(translateX, A, 5, onSwipe);
      },
    }));

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value.x = translateX.value;
        context.value.y = translateY.value;
      })
      .onUpdate((e) => {
        translateX.value = e.translationX;
        translateY.value = e.translationY;
        scale.value = interpolate(
          translateX.value,
          [-width / 4, 0, width / 4],
          [1, 0.95, 1],
          Extrapolate.CLAMP
        );
      })
      .onEnd(({ velocityX, velocityY }) => {
        const dest = snapPoint(translateX.value, velocityX, snapPoints);
        swipe(translateX, dest, 5, onSwipe);
        translateY.value = withSpring(0, { velocity: velocityY });
      });

    return (
      <GestureDetector {...{ gesture }}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Profile
            profile={profile}
            translateX={translateX}
            translateY={translateY}
            scale={scale}
            onTop={onTop}
          />
        </Animated.View>
      </GestureDetector>
    );
  }
);
