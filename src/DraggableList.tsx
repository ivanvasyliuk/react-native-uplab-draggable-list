import { useState, type ReactElement, useMemo } from "react";
import Animated, {
  Layout,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { type LayoutRectangle, StatusBar, View, Platform } from "react-native";
import { useHeaderHeight } from "@react-navigation/stack";

import { AbsoluteItem } from "./AbsoluteItem";
import { DraggableItem } from "./DraggableItem";
import { listToObject } from "./utils";
import { ScrollDirection } from "./useDraggableGesture";

interface ISortableListProps {
  children: ReactElement[];
  item: { width: number; height: number };
}

export const DraggableList = ({
  children,
  item: { height, width },
}: ISortableListProps) => {
  const list = useMemo(
    () =>
      children.map((child) => ({
        id: uuidv4(),
        child,
      })),
    [children]
  );

  const positions = useSharedValue(listToObject(list));

  const [_, setActiveGesture] = useState(false);
  const [animationContainerLayout, setAnimationContainerLayout] = useState<
    LayoutRectangle | undefined
  >();

  const scrollY = useSharedValue(0);
  const autoScroll = useSharedValue(ScrollDirection.None);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const activeItemId = useSharedValue("");
  const absoluteItemPosition = useSharedValue(0);

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => {
      scrollTo(scrollViewRef, 0, scrolling, false);
    }
  );

  const headerHeight = useHeaderHeight();
  const topAbsolutePadding = useMemo(
    () =>
      (Platform.OS === "ios"
        ? Number(StatusBar.currentHeight)
        : -Number(StatusBar.currentHeight)) +
      headerHeight +
      Number(animationContainerLayout?.x),
    [animationContainerLayout?.x, headerHeight]
  );
  const contentHeight = useMemo(
    () => height * children.length,
    [children.length, height]
  );

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View
      onLayout={({ nativeEvent: { layout } }) =>
        setAnimationContainerLayout(layout)
      }
    >
      {animationContainerLayout ? (
        <>
          <AbsoluteItem
            activeId={activeItemId}
            y={absoluteItemPosition}
            containerHeight={animationContainerLayout.height}
            item={{ height, width }}
            items={list}
          />
          <Animated.ScrollView
            ref={scrollViewRef}
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              height: contentHeight,
            }}
            layout={Layout}
            onScroll={onScroll}
          >
            {list.map(({ id, child }) => (
              <DraggableItem
                key={id}
                id={id}
                activeId={activeItemId}
                setActiveGesture={setActiveGesture}
                positions={positions}
                lowerBound={scrollY}
                absoluteItemPosition={absoluteItemPosition}
                autoScrollDirection={autoScroll}
                containerHeight={animationContainerLayout?.height}
                topAbsolutePadding={topAbsolutePadding}
                item={{ height }}
              >
                {child}
              </DraggableItem>
            ))}
          </Animated.ScrollView>
        </>
      ) : null}
    </View>
  );
};
