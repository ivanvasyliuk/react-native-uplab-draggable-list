import { createStackNavigator } from "@react-navigation/stack";

import type { MyRoutes } from "./MyRoutes";
import { MyExamples } from "./Examples";
import { MyHeartOfTheMatter } from "./MyHeartOfTheMatter/MyHeartOfTheMatter";
import { MyPanGesture } from "./MyPanGesture";

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
        component={MyPanGesture}
        options={{
          title: "My The Heart of the Matter",
        }}
      />
    </Stack.Navigator>
  );
};
