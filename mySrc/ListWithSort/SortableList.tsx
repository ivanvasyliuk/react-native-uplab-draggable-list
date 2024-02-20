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

import SortableItem, { ScrollDirection } from "./SortableItem";
import { listToObject } from "./utils";
import { AbsoluteItem } from "./AbsoluteItem";
interface ISortableListProps {
  children: ReactElement[];
  item: { width: number; height: number };
}

export const SortableList = ({
  children,
  item: { height, width },
}: ISortableListProps) => {
  // const [list, setList] = useState(() =>
  //   children.map((child) => ({
  //     id: uuidv4(),
  //     child,
  //   }))
  // );
  const list = useMemo(
    () =>
      children.map((child) => ({
        id: uuidv4(),
        child,
      })),
    [children]
  );

  const positions = useSharedValue(listToObject(list));

  const scrollY = useSharedValue(0);
  const autoScroll = useSharedValue(ScrollDirection.None);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const activeItemId = useSharedValue("");
  const [_, setActiveGesture] = useState(false);
  const draggableItemPosition = useSharedValue(0);

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => {
      scrollTo(scrollViewRef, 0, scrolling, false);
    }
  );

  const [animationContainerLayout, setAnimationContainerLayout] = useState<
    LayoutRectangle | undefined
  >();

  const headerHeight = useHeaderHeight();
  const contentHeight = height * children.length;
  const topAbsolutePadding = useMemo(
    () =>
      (Platform.OS === "ios"
        ? Number(StatusBar.currentHeight)
        : -Number(StatusBar.currentHeight)) +
      headerHeight +
      Number(animationContainerLayout?.x),
    [animationContainerLayout?.x, headerHeight]
  );

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // const onRemove = useCallback(
  //   (id: string) => {
  //     setList((prev) => {
  //       const newList = prev.filter((i) => i.id !== id);
  //       positions.value = listToObject(newList);
  //       return newList;
  //     });
  //   },
  //   [positions]
  // );

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
            y={draggableItemPosition}
            containerHeight={animationContainerLayout.height}
            {...{ item: { height, width } }}
            items={list}
          />
          <Animated.ScrollView
            ref={scrollViewRef}
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              height: contentHeight + 400,
            }}
            layout={Layout}
            onScroll={onScroll}
          >
            {list.map(({ id, child }) => (
              <SortableItem
                key={id}
                id={id}
                activeId={activeItemId}
                setActiveGesture={setActiveGesture}
                positions={positions}
                lowerBound={scrollY}
                draggableItemPosition={draggableItemPosition}
                autoScrollDirection={autoScroll}
                itemsCount={children.length}
                containerHeight={animationContainerLayout?.height}
                {...{
                  topAbsolutePadding,
                  item: { height, width },
                }}
              >
                {child}
              </SortableItem>
            ))}
          </Animated.ScrollView>
        </>
      ) : null}
    </View>
  );
};
