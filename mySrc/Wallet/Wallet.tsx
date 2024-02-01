import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { CARD_HEIGHT, cards } from "../components";

import { AnimatedCard } from "./AnimatedCard";

const DISTANCE = CARD_HEIGHT / 4;

export const Wallet = () => {
  const list = cards.slice(0, 4);

  const offsets = list.map((_, index) => ({
    // eslint-disable-next-line react-hooks/rules-of-hooks
    y: useSharedValue(index * DISTANCE),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    zIndex: useSharedValue(index),
  }));

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {list.map((card, index) => (
        <AnimatedCard
          key={card}
          distance={DISTANCE}
          {...{ offsets, index, card }}
        />
      ))}
    </View>
  );
};
