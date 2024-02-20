import * as React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";

import type { MyRoutes } from "../MyRoutes";
import { StyleGuide } from "../../src/components";

export const examples = [
  {
    screen: "MyTheHeartOfTheMatter",
    title: "💚 The Heart of the Matter",
  },
  // {
  //   screen: "Worklets",
  //   title: "👩‍🏭 Worklets",
  // },
  {
    screen: "MyTransitions",
    title: "🔁 Transitions",
  },
  {
    screen: "MyPanGesture",
    title: "💳 PanGesture",
  },
  {
    screen: "Animations",
    title: "🐎 Animations",
  },
  {
    screen: "MyCircularSlider",
    title: "⭕️ Circular Slider",
  },
  {
    screen: "MyGraph",
    title: "📈 Graph Interactions",
  },
  {
    screen: "DynamicSpring",
    title: "👨‍🔬 Dynamic Spring",
  },
  {
    screen: "DragToSort",
    title: "📤 Drag To Sort",
  },
  {
    screen: "SkiaGraphWallet",
    title: "🪇 Skia Graph Wallet",
  },
  {
    screen: "MySwiping",
    title: "💚 Swiping",
  },
  {
    screen: "Bezier",
    title: "⤴️ Bézier",
  },
  // {
  //   screen: "ShapeMorphing",
  //   title: "☺️ Shape Morphing",
  // },
  {
    screen: "Accordion",
    title: "🗺 Accordion",
  },
  {
    screen: "SkiaGraph",
    title: "🎳 Skia Graph",
  },
  {
    screen: "Wallet",
    title: "👛 Wallet",
  },
  {
    screen: "Onboarding",
    title: "🧗‍♀️ Onboarding",
  },
  {
    screen: "ListWithSort",
    title: "🐥 List with sort",
  },
  {
    screen: "AppleMusic",
    title: "🎧 Apple music",
  },
] as const;

const styles = StyleSheet.create({
  container: {
    backgroundColor: StyleGuide.palette.background,
  },
  content: {
    paddingBottom: 32,
  },
  thumbnail: {
    backgroundColor: "white",
    padding: StyleGuide.spacing * 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: StyleGuide.palette.background,
  },
  title: {
    ...StyleGuide.typography.headline,
  },
});

export const MyExamples = () => {
  const { navigate } =
    useNavigation<StackNavigationProp<MyRoutes, "Examples">>();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {examples.map((thumbnail) => (
        <RectButton
          key={thumbnail.screen}
          onPress={() => navigate(thumbnail.screen)}
        >
          <View style={styles.thumbnail}>
            <Text style={styles.title}>{thumbnail.title}</Text>
          </View>
        </RectButton>
      ))}
    </ScrollView>
  );
};
