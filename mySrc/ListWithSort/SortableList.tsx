import { type ReactElement } from "react";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { SortableItem } from "./SortableItem";
interface ISortableListProps {
  children: ReactElement[];
  item: { width: number; height: number };
}

export const SortableList = ({
  children,
  item: { height, width },
}: ISortableListProps) => {
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const offsets = children.map((data, i) => ({
    // eslint-disable-next-line react-hooks/rules-of-hooks
    y: useSharedValue(i * height),
    data,
  }));

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const contentHeight = height * children.length;

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      bounces={false}
      scrollEventThrottle={16}
      contentContainerStyle={{
        height: contentHeight,
      }}
      onScroll={onScroll}
    >
      {children.map((child, index) => (
        <SortableItem
          scrollViewRef={scrollViewRef}
          scrollY={scrollY}
          key={index}
          containerHeight={400}
          contentHeight={contentHeight}
          {...{ offsets, index, item: { height, width } }}
        >
          {child}
        </SortableItem>
      ))}
    </Animated.ScrollView>
  );
};
