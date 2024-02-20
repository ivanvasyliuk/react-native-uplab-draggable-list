import type { SharedValue } from "react-native-reanimated";
import { useSharedValue, withDecay } from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { useMemo } from "react";

export const useGraphTouchHandler = (x: SharedValue<number>, width: number) => {
  const contextPositionX = useSharedValue(0);
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          contextPositionX.value = x.value;
        })
        .onUpdate((e) => {
          x.value = contextPositionX.value + e.translationX;
        })
        // .onChange((pos) => {
        //   x.value += pos.x;
        // })
        .onEnd(({ velocityX }) => {
          x.value = withDecay({ velocity: velocityX, clamp: [0, width] });
        }),
    [contextPositionX, width, x]
  );
  return gesture;
};
