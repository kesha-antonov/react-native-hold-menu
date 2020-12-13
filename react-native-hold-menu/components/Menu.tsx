import * as React from "react";
import { StyleSheet, View } from "react-native";

import Animated, {
  runOnJS,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import StyleGuide from "../components/StyleGuide";
import { MenuItemProps, MenuProps } from "../types";
import {
  CalculateMenuHeight,
  MenuAnimationAnchor,
  MENU_WIDTH,
} from "../utils/calculations";

import { MenuItem } from "./MenuItem";

export const MENU_CONTAINER_WIDTH =
  StyleGuide.dimensionWidth - StyleGuide.spacing * 4;

export const Menu = ({
  items,
  itemHeight,
  toggle,
  anchorPoint = "top-center",
  containerStyles = {},
  menuStyles = {},
}: MenuProps) => {
  const wasActive = React.useMemo(() => {
    return toggle ? true : false;
  }, [toggle]);

  const MenuHeight = React.useMemo(() => {
    return CalculateMenuHeight(items.length > 0 ? items.length : 1);
  }, [items]);

  const leftOrRight = React.useMemo(() => {
    return anchorPoint
      ? anchorPoint.includes("right")
        ? { right: 0 }
        : anchorPoint.includes("left")
        ? { left: 0 }
        : { left: -MENU_WIDTH / 4 }
      : {};
  }, [anchorPoint]);

  const topValue = React.useMemo(() => {
    return anchorPoint.split("-")[0] == "top"
      ? (itemHeight || 0) + StyleGuide.spacing
      : -1 * (MenuHeight + StyleGuide.spacing * 2);
  }, [anchorPoint, itemHeight, items]);

  const Translate = React.useMemo(() => {
    return MenuAnimationAnchor(anchorPoint || "top-right");
  }, [anchorPoint]);

  const messageStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: Translate.begginingTransformations.translateX },
        { translateY: Translate.begginingTransformations.translateY },
        {
          scale: wasActive ? 1 : 0,
        },
        { translateX: Translate.endingTransformations.translateX },
        { translateY: Translate.endingTransformations.translateY },
      ],
    };
  }, [wasActive]);

  return (
    <View
      style={[
        styles.wrapper,
        {
          ...leftOrRight,
          zIndex: toggle ? 5 : 10,
          top: topValue,
          ...containerStyles,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          { height: MenuHeight, ...leftOrRight, ...menuStyles },
          { ...messageStyles },
        ]}
      >
        {items && items.length > 0 ? (
          items.map((item: MenuItemProps, index: number) => {
            return <MenuItem key={index} item={item} />;
          })
        ) : (
          <MenuItem
            item={{ id: 0, title: "Empty List", icon: "help-circle" }}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: MENU_CONTAINER_WIDTH,
    zIndex: 150,
  },
  container: {
    position: "absolute",
    width: MENU_WIDTH,
    borderRadius: StyleGuide.spacing * 1.5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: StyleGuide.palette.common.white,
    overflow: "hidden",
  },
});
