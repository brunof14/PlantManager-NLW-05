import { Feather } from "@expo/vector-icons";
import React from "react";

import { StyleSheet, Text, View, Animated } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { SvgFromUri } from "react-native-svg";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface PlantProps extends RectButtonProps {
  data: {
    name: string;
    photo: string;
    hour: string;
  };
  handleRemove: () => void;
}

export function PlantCardSecondary({
  data,
  handleRemove,
  ...rest
}: PlantProps) {
  const { name, photo, hour } = data;

  return (
    <Swipeable
      overshootRight={false}
      containerStyle={{
        overflow: 'visible'
      }}
      renderRightActions={() => (
        <Animated.View style={styles.containerAnimated}>
          <RectButton style={styles.buttonRemove} onPress={handleRemove}>
            <Feather name="trash" size={32} color={colors.white} />
          </RectButton>
        </Animated.View>
      )}
    >
      <RectButton style={styles.container} {...rest}>
        <SvgFromUri uri={photo} width={50} height={50} />
        <Text style={styles.title}>{name}</Text>
        <View style={styles.details}>
          <Text style={styles.timeLabel}>Regar às</Text>
          <Text style={styles.time}>{hour}</Text>
        </View>
      </RectButton>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.shape,
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.heading,
  },
  details: {
    alignItems: "flex-end",
  },
  timeLabel: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.body_light,
  },
  time: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.body_dark,
  },
  buttonRemove: {
    width: 100,
    height: '100%',
    backgroundColor: colors.red,
    
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 24,
  },
  containerAnimated: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -30
  },
});
