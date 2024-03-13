import { type ReactElement } from "react";
import { type ViewProps, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

interface IListItemProps extends Animated.AnimateProps<ViewProps> {
  children?: ReactElement;
}

export const ListItem = (props: IListItemProps) => {
  return (
    <Animated.View style={[styles.container, props.style]}>
      {props.children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
