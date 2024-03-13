import { GestureDetector } from "react-native-gesture-handler";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { type ReactElement } from "react";

import { ListItem } from "./ListItem";
import {
  type DraggableItemGestureProps,
  useDraggableGesture,
} from "./useDraggableGesture";

interface ISortableItemProps extends DraggableItemGestureProps {
  children: ReactElement;
}

export const DraggableItem = ({ children, ...props }: ISortableItemProps) => {
  const { gesture, top, gestureActive } = useDraggableGesture(props);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: top.value,
      zIndex: gestureActive.value ? 2 : withTiming(1),
    };
  }, []);

  return (
    <GestureDetector gesture={gesture}>
      <ListItem style={animatedStyle}>{children}</ListItem>
    </GestureDetector>
  );
};
