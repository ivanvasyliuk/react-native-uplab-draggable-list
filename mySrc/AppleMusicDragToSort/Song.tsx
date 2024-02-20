import { Image, Text, View } from "react-native";

import { SONG_HEIGHT } from "./config";

interface ISongProps {
  title: string;
  artist: string;
  cover: string;
}

export const Song = ({ title, artist, cover }: ISongProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: SONG_HEIGHT,
        padding: 10,
      }}
    >
      <Image
        source={{ uri: cover }}
        style={{ height: 50, width: 50, borderRadius: 4 }}
      />
      <View
        style={{
          marginLeft: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {title}
        </Text>

        <Text style={{ fontSize: 12, color: "gray" }}>{artist}</Text>
      </View>
    </View>
  );
};
