import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Cards } from "../components";

import { SortableList } from "./SortableList";

const { width } = Dimensions.get("window");
const ITEM_HEIGHT = 70;

export const ListWithSort = () => {
  const list = [...new Array(115)].map(() => Cards.Card1);
  return (
    <View style={{ height: 500, borderWidth: StyleSheet.hairlineWidth * 3 }}>
      <SortableList item={{ width, height: ITEM_HEIGHT }}>
        {list.map((_, index) => (
          <View style={styles.itemContainer} key={index}>
            <View style={styles.itemTitleContainer}>
              <Text>ITEM</Text>
              <Text>{index}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Feather name="align-justify" size={28} color="black" />
            </View>
          </View>
        ))}
      </SortableList>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: ITEM_HEIGHT,
    flex: 1,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitleContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    height: "100%",
  },
});
