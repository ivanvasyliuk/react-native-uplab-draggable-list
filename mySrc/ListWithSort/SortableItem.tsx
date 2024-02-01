import { Feather } from "@expo/vector-icons";
import type { ReactElement, RefObject } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  scrollTo,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { clamp } from "react-native-redash";

interface ISortableItemProps {
  children: ReactElement;
  offsets: { y: Animated.SharedValue<number> }[];
  item: { height: number; width: number };
  scrollViewRef: RefObject<Animated.ScrollView>;
  scrollY: Animated.SharedValue<number>;
  containerHeight: number;
  contentHeight: number;
  index: number;
}

export const SortableItem = (props: ISortableItemProps) => {
  const {
    children,
    offsets,
    index,
    containerHeight,
    contentHeight,
    scrollY,
    scrollViewRef,
    item: { height, width },
  } = props;

  const gestureActive = useSharedValue(false);
  const gestureFinishing = useSharedValue(false);
  const offset = offsets[index];
  const y = useSharedValue(offset.y.value);
  const contextOffsetY = useSharedValue(0);

  // const longPressGesture = Gesture.LongPress().onStart(() => {
  //   gestureActive.value = true;
  // });
  // useAnimatedReaction(
  //   () => offsets[index].y.value,
  //   (newOrder) => {
  //     console.log("newOrder", newOrder);
  //     if (!gestureActive.value) {
  //       y.value = withTiming(offset.y.value, {});
  //     }
  //   }
  // );
  useAnimatedReaction(
    () => offset.y.value,
    () => {
      if (!gestureActive.value) {
        // const pos = getPosition(newOrder);
        y.value = withTiming(offset.y.value, {
          easing: Easing.inOut(Easing.ease),
          duration: 350,
        });
        // translateY.value = withTiming(pos.y, animationConfig);
      }
    }
  );

  const gesture = Gesture.Pan()
    .onStart(() => {
      gestureActive.value = true;
      contextOffsetY.value = offset.y.value;
    })
    .onUpdate((e) => {
      y.value = clamp(
        contextOffsetY.value + e.translationY,
        0,
        contentHeight - height
      );
      const offsetY = Math.round(y.value / height) * height;
      offsets.forEach((o, i) => {
        if (o.y.value === offsetY && index !== i) {
          const tmp = o.y.value;
          o.y.value = offset.y.value;
          offset.y.value = tmp;
        }
      });

      // Scroll up and down if necessary
      const lowerBound = scrollY.value;
      const upperBound = lowerBound + containerHeight - height;
      const maxScroll = contentHeight - containerHeight;
      const leftToScrollDown = maxScroll - scrollY.value;
      if (y.value < lowerBound) {
        const diff = Math.min(lowerBound - y.value, lowerBound);
        scrollY.value -= diff;
        scrollTo(scrollViewRef, 0, scrollY.value, false);
        contextOffsetY.value -= diff;
        y.value = contextOffsetY.value + e.translationY;
      }
      if (y.value > upperBound) {
        const diff = Math.min(y.value - upperBound, leftToScrollDown);
        scrollY.value += diff;
        scrollTo(scrollViewRef, 0, scrollY.value, false);
        contextOffsetY.value += diff;
        y.value = contextOffsetY.value + e.translationY;
      }
    })
    .onEnd(() => {
      gestureActive.value = false;
      offset.y.value = withSpring(
        offset.y.value,
        {},
        () => (gestureFinishing.value = false)
      );
    });
  // .simultaneousWithExternalGesture(longPressGesture);

  const composedGesture = gesture;
  // Gesture.Race(gesture, longPressGesture);

  const translateY = useDerivedValue(() => {
    return withSpring(gestureActive.value ? y.value : offset.y.value);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // ...(gestureActive.value || gestureFinishing.value
      //   ? styles.shadow
      //   : undefined),
      zIndex: gestureActive.value || gestureFinishing.value ? 100 : 0,
      transform: [
        { translateY: translateY.value },
        { scale: withTiming(gestureActive.value ? 1.04 : 1) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, { height, width }, animatedStyle]}>
      <>
        {children}
        <GestureDetector gesture={composedGesture}>
          <View style={styles.iconContainer}>
            <Feather name="align-justify" size={28} color="black" />
          </View>
        </GestureDetector>
      </>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    // borderLeftWidth: 2,
  },
  // shadow: {
  //   ...Platform.select({
  //     ios: {
  //       shadowOpacity: 0.3,
  //       shadowRadius: 5,
  //       shadowColor: "red",
  //       // shadowOffset: { height: -1, width: 0 },
  //     },
  //     android: {
  //       elevation: 15,
  //     },
  //   }),
  // },

  container: {
    borderWidth: 0.2,
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
  },
});
