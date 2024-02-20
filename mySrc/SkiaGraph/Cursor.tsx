import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

const CURSOR = 100;

type PointData = {
  coord: {
    x: number;
    y: number;
  };
};

interface ICursorProps {
  point: Animated.SharedValue<PointData>;
}

export const Cursor = ({ point }: ICursorProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      zIndex: 1,
      width: CURSOR,
      height: CURSOR,
      left: point.value.coord.x - CURSOR / 2 + 15,
      top: point.value.coord.y - CURSOR / 2,
    };
  });

  return (
    <Animated.View style={[styles.cursorContainer, animatedStyle]}>
      <View style={styles.cursor} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cursorContainer: {
    width: CURSOR,
    height: CURSOR,
    justifyContent: "center",
    alignItems: "center",
  },
  cursor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#367be2",
    borderWidth: 4,
    backgroundColor: "white",
  },
});
