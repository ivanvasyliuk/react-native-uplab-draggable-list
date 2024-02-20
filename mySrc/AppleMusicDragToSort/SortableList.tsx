import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MovableSong } from "./MovableSong";
import { SONGS } from "./data";
import { listToObject } from "./utilities";
import { ScrollDirection } from "./types";
import { SONG_HEIGHT } from "./config";

export const SortableList = () => {
  const positions = useSharedValue(listToObject(SONGS));
  const scrollY = useSharedValue(0);
  const autoScroll = useSharedValue(ScrollDirection.None);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  console.log("positions", positions.value);

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => {
      scrollTo(scrollViewRef, 0, scrolling, false);
    }
  );

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const contentHeight = SONGS.length * SONG_HEIGHT;
  const containerHeight = dimensions.height - insets.top - insets.bottom;

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: "white",
      }}
      contentContainerStyle={{
        height: contentHeight,
      }}
    >
      {SONGS.map((song) => (
        <MovableSong
          key={song.id}
          id={song.id}
          artist={song.artist}
          cover={song.cover}
          title={song.title}
          positions={positions}
          lowerBound={scrollY}
          autoScrollDirection={autoScroll}
          songsCount={SONGS.length}
          containerHeight={containerHeight}
        />
      ))}
    </Animated.ScrollView>
  );
};
