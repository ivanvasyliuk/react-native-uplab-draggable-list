import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type Animated from "react-native-reanimated";
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import React, { type ReactElement } from "react";
import { clamp } from "react-native-redash";

import { objectMove } from "./utils";
import { ListItem } from "./ListItem";

export enum ScrollDirection {
  None,
  Up,
  Down,
}

// const AnimatedTouchableOpacity =
//   Animated.createAnimatedComponent(TouchableOpacity);
// const DELETE_RIGHT_PADDING = 70;

interface ISortableItemProps {
  id: string;
  topAbsolutePadding: number;
  positions: Animated.SharedValue<{ [id: string]: number }>;
  lowerBound: Animated.SharedValue<number>;
  draggableItemPosition: Animated.SharedValue<number>;
  autoScrollDirection: Animated.SharedValue<ScrollDirection>;
  itemsCount: number;
  item: { height: number; width: number };
  containerHeight: number;
  children: ReactElement;
  setActiveGesture: React.Dispatch<React.SetStateAction<boolean>>;
  activeId: Animated.SharedValue<string>;
  // onRemove: (id: string) => void;
}

// const AnimatedTouchableOpacity =
//   Animated.createAnimatedComponent(TouchableOpacity);

const SortableItem = (props: ISortableItemProps) => {
  const {
    id,
    topAbsolutePadding,
    children,
    setActiveGesture,
    activeId,
    draggableItemPosition,
    positions,
    lowerBound,
    containerHeight,
    itemsCount,
    autoScrollDirection,
    item: { height },
    // onRemove,
  } = props;
  const gestureActive = useSharedValue(id === activeId.value);
  // const removeGestureActive = useSharedValue(false);
  const positionY = useSharedValue(positions.value[id] * height);
  // const contextPositionX = useSharedValue(0);
  // const positionX = useSharedValue(0);
  const top = useSharedValue(positions.value[id] * height);
  const upperBound = useDerivedValue(() => lowerBound.value + containerHeight);
  const targetLowerBound = useSharedValue(lowerBound.value);
  const fingerPosition = useSharedValue(0);

  useAnimatedReaction(
    () => positionY.value,
    (positionYValue, previousValue) => {
      if (
        positionYValue !== null &&
        previousValue !== null &&
        positionYValue !== previousValue
      ) {
        if (gestureActive.value) {
          top.value = positionYValue;
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
              easing: Easing.inOut(Easing.bezierFn(0.07, -0.01, 0.61, 0.22)),
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
              easing: Easing.inOut(Easing.bezierFn(0.07, -0.01, 0.61, 0.22)),
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
          lowerBound.value = targetLowerBoundValue;
        }
      }
    }
  );

  // useAnimatedReaction(
  //   () => activeId.value,
  //   (newActiveId) => {
  //     removeGestureActive.value = newActiveId === id;
  //     if (removeGestureActive.value) {
  //       positionX.value = withSpring(DELETE_RIGHT_PADDING, {
  //         overshootClamping: true,
  //       });
  //     } else {
  //       positionX.value = withSpring(0, {
  //         overshootClamping: true,
  //       });
  //     }
  //   }
  // );

  // const removeGesture = Gesture.Pan()
  //   .activeOffsetX([-20, 20])
  //   .onStart(() => {
  //     activeId.value = id;
  //     contextPositionX.value = positionX.value;
  //   })
  //   .onChange((e) => {
  //     positionX.value = clamp(
  //       contextPositionX.value + e.translationX,
  //       -DELETE_RIGHT_PADDING,
  //       0
  //     );
  //   })
  //   .onEnd(({ velocityX }) => {
  //     if (positionX.value <= -DELETE_RIGHT_PADDING / 2) {
  //       positionX.value = withSpring(-DELETE_RIGHT_PADDING, {
  //         velocity: velocityX,
  //         overshootClamping: true,
  //       });
  //     } else {
  //       positionX.value = withSpring(0, {
  //         velocity: velocityX,
  //         overshootClamping: true,
  //       });
  //     }
  //   });

  const gesture = Gesture.Pan()
    .activateAfterLongPress(300)
    .onStart((e) => {
      runOnJS(setActiveGesture)(true);
      activeId.value = id;
      // positionX.value = 0;
      positionY.value = positions.value[id] * height;
      draggableItemPosition.value = positionY.value - lowerBound.value;
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
      draggableItemPosition.value = positionY.value - lowerBound.value;
    })
    .onEnd(() => {
      autoScrollDirection.value = ScrollDirection.None;
      const finishPosition = positions.value[id] * height;
      top.value = withTiming(finishPosition);
      activeId.value = "";
      gestureActive.value = false;
      runOnJS(setActiveGesture)(false);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: clamp(top.value, 0, (itemsCount - 1) * height),
      // transform: [{ translateX: positionX.value }],
      zIndex: gestureActive.value ? 2 : withTiming(1),
    };
  }, []);

  // const removeButtonStyle = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor: "red",
  //     height,
  //     width: DELETE_RIGHT_PADDING,
  //     justifyContent: "center",
  //     alignItems: "center",
  //     position: "absolute",
  //     top: top.value,
  //     right: 0,
  //     opacity: removeGestureActive.value ? 1 : 0,
  //   };
  // });

  return (
    <GestureDetector gesture={gesture}>
      <ListItem style={animatedStyle}>{children}</ListItem>
    </GestureDetector>
    //   <>
    //   <AnimatedTouchableOpacity
    //   onPress={() => onRemove(id)}
    //     style={removeButtonStyle}
    //   >
    //     <Text style={{ color: "white" }}>Remove</Text>
    //   </AnimatedTouchableOpacity>
    // </>
  );
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

// eslint-disable-next-line import/no-default-export
export default SortableItem;
// export default React.memo(SortableItem);
