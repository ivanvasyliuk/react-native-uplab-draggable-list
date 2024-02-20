import type Animated from "react-native-reanimated";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { type ReactElement } from "react";
import { clamp } from "react-native-redash";

import { ListItem } from "./ListItem";

export enum ScrollDirection {
  None,
  Up,
  Down,
}

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
      shadowColor: "black",
      shadowRadius: 10,
      shadowOffset: {
        height: 0,
        width: 0,
      },
      elevation: 3,
    };
  }, [activeId.value]);

  const children = items.find((i) => i.id === activeId.value)?.child;

  return children ? (
    <ListItem style={animatedStyle}>
      {items.find((i) => i.id === activeId.value)?.child}
    </ListItem>
  ) : null;
};
