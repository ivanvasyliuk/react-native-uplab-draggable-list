import { View, StyleSheet } from "react-native";
import { ReText, round } from "react-native-redash";
import type Animated from "react-native-reanimated";
import { useDerivedValue } from "react-native-reanimated";

import { StyleGuide } from "../../components";

const styles = StyleSheet.create({
  date: {
    ...StyleGuide.typography.title3,
    textAlign: "center",
  },
  price: {
    ...StyleGuide.typography.title2,
    textAlign: "center",
  },
});

console.log({ styles });

export interface DataPoint {
  coord: {
    x: number;
    y: number;
  };
  data: {
    x: number;
    y: number;
  };
}

interface LabelProps {
  point: Animated.SharedValue<DataPoint>;
}

export const Label = ({ point }: LabelProps) => {
  const date = useDerivedValue(() =>
    new Date(point.value.data.x).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  const price = useDerivedValue(() => {
    return `$ ${round(point.value.data.y, 2).toLocaleString("en-US", {
      currency: "USD",
    })}`;
  });
  return (
    <View>
      <ReText style={styles.date} text={date} />
      <ReText style={styles.price} text={price} />
    </View>
  );
};
