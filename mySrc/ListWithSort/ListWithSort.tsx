import { Dimensions, StyleSheet, Text, View } from "react-native";

import { Cards } from "../components";

import { SortableList } from "./SortableList";

const { width } = Dimensions.get("window");
const ITEM_HEIGHT = 70;

export const ListWithSort = () => {
  const list = [...new Array(20)].map(() => Cards.Card1);
  return (
    <View style={{ height: 400 }}>
      <SortableList item={{ width, height: ITEM_HEIGHT }}>
        {list.map((_, index) => (
          <View style={styles.card} key={index}>
            <Text>ITEM</Text>
          </View>
        ))}
      </SortableList>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: ITEM_HEIGHT,
    // width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // marginVertical: 16,
    // backgroundColor: "red",
  },
});
