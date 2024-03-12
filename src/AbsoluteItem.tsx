import type Animated from "react-native-reanimated";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { type ReactElement } from "react";
import { clamp } from "react-native-redash";
import { Platform, StyleSheet } from "react-native";

import { ListItem } from "./ListItem";

interface IAbsoluteItemProps {
  y: Animated.SharedValue<number>;
  activeId: Animated.SharedValue<string>;
  items: { id: string; child: ReactElement }[];
  item: { height: number; width: number };
  containerHeight: number;
}

export const AbsoluteItem = (props: IAbsoluteItemProps) => {
  const {
    activeId,
    y,
    items,
    containerHeight,
    item: { height },
  } = props;
  const shadowOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    shadowOpacity.value = withTiming(activeId.value ? 0.2 : 0, {
      duration: 300,
    });
    return {
      top: clamp(y.value, 0, containerHeight - height),
      shadowOpacity: shadowOpacity.value,
      opacity: activeId.value ? 1 : 0,
      zIndex: withTiming(activeId.value ? 10 : -1),
      height,
    };
  }, [activeId.value]);

  const children = items.find((i) => i.id === activeId.value)?.child;

  return children ? (
    <ListItem style={[styles.containerShadow, animatedStyle]}>
      {children}
    </ListItem>
  ) : null;
};

const styles = StyleSheet.create({
  containerShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowRadius: 10,
        shadowOffset: {
          height: 0,
          width: 0,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
