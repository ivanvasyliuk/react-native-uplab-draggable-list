import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withDecay,
} from "react-native-reanimated";
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { PanGestureHandler } from "react-native-gesture-handler";
import { clamp, withBouncing } from "react-native-redash";

import { Card, Cards, CARD_WIDTH, CARD_HEIGHT } from "../components";

interface IMyPanGestureProps {
  width: number;
  height: number;
}

export const MyPanGesture = ({ width, height }: IMyPanGestureProps) => {
  const boundX = width - CARD_WIDTH;
  const boundY = height - CARD_HEIGHT;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      offsetX: number;
      offsetY: number;
    }
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = translateX.value;
      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = clamp(ctx.offsetX + event.translationX, 0, boundX);
      translateY.value = clamp(ctx.offsetY + event.translationY, 0, boundY);
    },
    onEnd: ({ velocityX, velocityY }) => {
      translateX.value = withBouncing(
        withDecay({
          velocity: velocityX,
        }),
        0,
        boundX
      );
      translateY.value = withBouncing(
        withDecay({
          velocity: velocityY,
        }),
        0,
        boundY
      );
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View {...{ animatedStyle }}>
          <Card card={Cards.Card1} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
