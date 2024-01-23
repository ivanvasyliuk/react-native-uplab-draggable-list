import { createStackNavigator } from "@react-navigation/stack";

import type { MyRoutes } from "./MyRoutes";
import { MyExamples } from "./Examples";
import { MyHeartOfTheMatter } from "./MyHeartOfTheMatter/MyHeartOfTheMatter";
import { MyTransitions } from "./Transitions";
import { MySwiping } from "./Swiping";
import { PanGesture } from "./PanGesture";
import { CircularSlider } from "./CircularSlider/CircularSlider";

const Stack = createStackNavigator<MyRoutes>();

export const MyExamplesNavigator = () => {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
};
