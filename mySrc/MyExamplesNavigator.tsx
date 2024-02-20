import { createStackNavigator } from "@react-navigation/stack";

import type { MyRoutes } from "./MyRoutes";
import { MyExamples } from "./Examples";
import { MyHeartOfTheMatter } from "./MyHeartOfTheMatter/MyHeartOfTheMatter";
import { MyTransitions } from "./Transitions";
import { PanGesture } from "./PanGesture";
import { CircularSlider } from "./CircularSlider";
import { Animations } from "./Animations";
import { DragToSort } from "./DragToSort";
import { DynamicSpring } from "./DynamicSpring";
import { MySwiping } from "./Swiping";
import { Accordion } from "./Accordion";
import { Bezier } from "./Bezier";
import { Wallet } from "./Wallet";
import { Graph } from "./Graph";
import { Onboarding } from "./Onboarding";
import { ListWithSort } from "./ListWithSort";
import { AppleMusic } from "./AppleMusicDragToSort";
import { SkiaGraph } from "./SkiaGraph";
import { SkiaGraphWallet } from "./SkiaWalletGraph";

const Stack = createStackNavigator<MyRoutes>();

export const MyExamplesNavigator = () => {
  return (
    <Stack.Navigator
    //  initialRouteName="SkiaGraph"
    >
      <Stack.Screen
        name="Examples"
        component={MyExamples}
        options={{
          title: "👨‍💻 My Work",
        }}
      />
      <Stack.Screen
        name="MyTheHeartOfTheMatter"
        component={MyHeartOfTheMatter}
        options={{
          title: "My The Heart of the Matter",
        }}
      />
      <Stack.Screen
        name="MyPanGesture"
        component={PanGesture}
        options={{
          title: "PanGesture",
        }}
      />
      <Stack.Screen
        name="MyTransitions"
        component={MyTransitions}
        options={{
          title: "Transitions",
        }}
      />
      <Stack.Screen
        name="MySwiping"
        component={MySwiping}
        options={{
          title: "Swiping",
        }}
      />
      <Stack.Screen
        name="MyCircularSlider"
        component={CircularSlider}
        options={{
          title: "Swiping",
        }}
      />
      <Stack.Screen
        name="MyGraph"
        component={Graph}
        options={{
          title: "Swiping",
        }}
      />
      <Stack.Screen
        name="Animations"
        component={Animations}
        options={{
          title: "Animations",
        }}
      />
      <Stack.Screen
        name="DragToSort"
        component={DragToSort}
        options={{
          title: "Drag To Sort",
        }}
      />
      <Stack.Screen
        name="DynamicSpring"
        component={DynamicSpring}
        options={{
          title: "Dynamic Spring",
        }}
      />
      <Stack.Screen
        name="Accordion"
        component={Accordion}
        options={{
          title: "Accordion",
        }}
      />
      <Stack.Screen
        name="Bezier"
        component={Bezier}
        options={{
          title: "Bezier",
        }}
      />
      <Stack.Screen
        name="Wallet"
        component={Wallet}
        options={{
          title: "Wallet",
        }}
      />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{
          title: "Onboarding",
        }}
      />
      <Stack.Screen
        name="ListWithSort"
        component={ListWithSort}
        options={{
          title: "List with sort",
        }}
      />
      <Stack.Screen
        name="AppleMusic"
        component={AppleMusic}
        options={{
          title: "Apple music",
        }}
      />
      <Stack.Screen
        name="SkiaGraph"
        component={SkiaGraph}
        options={{
          title: "Skia Graph",
        }}
      />
      <Stack.Screen
        name="SkiaGraphWallet"
        component={SkiaGraphWallet}
        options={{
          title: "Skia Graph",
        }}
      />
    </Stack.Navigator>
  );
};
