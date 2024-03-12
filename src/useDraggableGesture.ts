import { useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import type Animated from "react-native-reanimated";
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { clamp } from "react-native-redash";

import { objectMove } from "./utils";

export enum ScrollDirection {
  None,
  Up,
  Down,
}

const AUTOSCROLL_EASING = Easing.inOut(
  Easing.bezierFn(0.07, -0.01, 0.61, 0.22)
);

export interface DraggableItemGestureProps {
  id: string;
  activeId: Animated.SharedValue<string>;
  lowerBound: Animated.SharedValue<number>;
  positions: Animated.SharedValue<{ [id: string]: number }>;
  autoScrollDirection: Animated.SharedValue<ScrollDirection>;
  absoluteItemPosition: Animated.SharedValue<number>;
  setActiveGesture: React.Dispatch<React.SetStateAction<boolean>>;
  topAbsolutePadding: number;
  containerHeight: number;
  item: { height: number };
}

export const useDraggableGesture = ({
  activeId,
  id,
  lowerBound,
  item: { height },
  positions,
  autoScrollDirection,
  absoluteItemPosition,
  topAbsolutePadding,
  containerHeight,
  setActiveGesture,
}: DraggableItemGestureProps) => {
  const gestureActive = useSharedValue(id === activeId.value);
  const positionY = useSharedValue(positions.value[id] * height);
  const top = useSharedValue(positions.value[id] * height);
  const upperBound = useDerivedValue(() => lowerBound.value + containerHeight);
  const targetLowerBound = useSharedValue(lowerBound.value);
  const fingerPosition = useSharedValue(0);

  const itemsCount = Object.keys(positions.value).length;

  useAnimatedReaction(
    () => positionY.value,
    (positionYValue, previousValue) => {
      if (
        positionYValue !== null &&
        previousValue !== null &&
        positionYValue !== previousValue
      ) {
        if (gestureActive.value) {
          top.value = clamp(positionYValue, 0, (itemsCount - 1) * height);
          setPosition(positionYValue, itemsCount, positions, id, height);
          setAutoScroll(
            positionYValue,
            lowerBound.value,
            upperBound.value,
            height,
            autoScrollDirection
          );
        }
      }
    }
  );

  // If another item is moving and changes this ones position, move to new position.
  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (
        currentPosition !== null &&
        previousPosition !== null &&
        currentPosition !== previousPosition
      ) {
        if (!gestureActive.value) {
          top.value = withSpring(currentPosition * height);
        }
      }
    },
    [gestureActive.value]
  );

  // If moving and scrolling, update position y.
  useAnimatedReaction(
    () => lowerBound.value,
    (currentLowerBound, previousLowerBound) => {
      if (
        currentLowerBound !== null &&
        previousLowerBound !== null &&
        currentLowerBound !== previousLowerBound &&
        gestureActive.value
      ) {
        const diff = previousLowerBound - currentLowerBound;
        positionY.value -= diff;
      }
    },
    [gestureActive.value]
  );

  // When the autoScrollDirection changes, set the target lower bound with timing.
  useAnimatedReaction(
    () => autoScrollDirection.value,
    (scrollDirection, previousValue) => {
      if (
        scrollDirection !== null &&
        previousValue !== null &&
        scrollDirection !== previousValue
      ) {
        switch (scrollDirection) {
          case ScrollDirection.Up: {
            targetLowerBound.value = lowerBound.value;
            if (targetLowerBound.value === 0) {
              break;
            }
            targetLowerBound.value = withTiming(0, {
              duration: top.value * 2.5,
              easing: AUTOSCROLL_EASING,
            });
            break;
          }
          case ScrollDirection.Down: {
            const contentHeight = itemsCount * height;
            const maxScroll = contentHeight - containerHeight;

            targetLowerBound.value = lowerBound.value;
            if (maxScroll === targetLowerBound.value) {
              break;
            }
            targetLowerBound.value = withTiming(maxScroll, {
              duration: (itemsCount * height - top.value) * 2.5,
              easing: AUTOSCROLL_EASING,
            });
            break;
          }
          case ScrollDirection.None: {
            targetLowerBound.value = lowerBound.value;
            break;
          }
        }
      }
    }
  );

  // When the target lower bound changes, update the lower bound value.
  useAnimatedReaction(
    () => targetLowerBound.value,
    (targetLowerBoundValue, previousValue) => {
      if (
        targetLowerBoundValue !== null &&
        previousValue !== null &&
        targetLowerBoundValue !== previousValue
      ) {
        if (gestureActive.value) {
          console.log("here");
          lowerBound.value = targetLowerBoundValue;
        }
      }
    }
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!activeId.value || activeId.value === id)
        .activateAfterLongPress(300)
        .onStart((e) => {
          runOnJS(setActiveGesture)(true);
          activeId.value = id;
          positionY.value = positions.value[id] * height;
          absoluteItemPosition.value = positionY.value - lowerBound.value;
          fingerPosition.value = e.y;

          gestureActive.value = true;
        })
        .onUpdate((e) => {
          positionY.value = clamp(
            e.absoluteY -
              topAbsolutePadding +
              lowerBound.value -
              fingerPosition.value,
            0,
            (itemsCount - 1) * height
          );
          absoluteItemPosition.value = positionY.value - lowerBound.value;
        })
        .onEnd(() => {
          autoScrollDirection.value = ScrollDirection.None;
          const finishPosition = positions.value[id] * height;
          top.value = withTiming(finishPosition);
          activeId.value = "";
          gestureActive.value = false;
          runOnJS(setActiveGesture)(false);
        }),
    [
      activeId,
      autoScrollDirection,
      absoluteItemPosition,
      fingerPosition,
      gestureActive,
      height,
      id,
      itemsCount,
      lowerBound.value,
      positionY,
      positions.value,
      setActiveGesture,
      top,
      topAbsolutePadding,
    ]
  );

  return { gesture, top, gestureActive };
};

function setPosition(
  positionY: number,
  songsCount: number,
  positions: Animated.SharedValue<{ [id: string]: number }>,
  id: string,
  itemHeight: number
) {
  "worklet";
  const newPosition = clamp(
    Math.round(positionY / itemHeight),
    0,
    songsCount - 1
  );
  if (newPosition !== positions.value[id]) {
    positions.value = objectMove(
      positions.value,
      positions.value[id],
      newPosition
    );
  }
}

function setAutoScroll(
  positionY: number,
  lowerBound: number,
  upperBound: number,
  scrollThreshold: number,
  autoScroll: Animated.SharedValue<ScrollDirection>
) {
  "worklet";
  if (positionY <= lowerBound) {
    autoScroll.value = ScrollDirection.Up;
  } else if (positionY >= upperBound - scrollThreshold) {
    autoScroll.value = ScrollDirection.Down;
  } else {
    autoScroll.value = ScrollDirection.None;
  }
}
