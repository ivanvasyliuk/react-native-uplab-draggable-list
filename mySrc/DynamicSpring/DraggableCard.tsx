import Animated, { withDecay, useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { Card, Cards, CARD_WIDTH, CARD_HEIGHT } from "../components";
import { useTranslate } from "../components/AnimatedHelpers";

interface ValueVector {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
}

interface DraggableCardProps {
  translate: ValueVector;
  width: number;
  height: number;
}

export const DraggableCard = ({
  translate,
  width,
  height,
}: DraggableCardProps) => {
  const boundX = width - CARD_WIDTH;
  const boundY = height - CARD_HEIGHT;

  const context = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.x.value = translate.x.value;
      context.y.value = translate.y.value;
    })
    .onUpdate((e) => {
      translate.x.value = context.x.value + e.translationX;
      translate.y.value = context.y.value + e.translationY;
    })
    .onEnd(({ velocityX, velocityY }) => {
      translate.x.value = withDecay({
        velocity: velocityX,
        clamp: [0, boundX],
      });
      translate.y.value = withDecay({
        velocity: velocityY,
        clamp: [0, boundY],
      });
    });
  const style = useTranslate(translate);
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...{ style }}>
        <Card card={Cards.Card1} />
      </Animated.View>
    </GestureDetector>
  );
};
