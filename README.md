# React Native Uplab Draggable List

A drag-and-drop-enabled ScrollList component for React Native.
Fully native interactions powered by Reanimated and React Native Gesture Handler.

![Draggable list](https://i.imgur.com/uo5rILu.gif)

## Installation

```sh
npm install react-native-uplab-draggable-list
```

## Start

```JavaScript
import DraggableList from "react-native-uplab-draggable-list";

...

    return(
        <DraggableList item={{ width: ITEM_WIDTH, height: ITEM_HEIGHT }}>
            {list.map((item) => <ListItem {...{item}} />)}
        </DraggableList>
    )
```
