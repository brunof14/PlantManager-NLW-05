import React, { memo } from "react";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { View, Text, Image, StyleSheet } from "react-native";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface HeaderProps {
  name: string;
}

export const Header = memo(function Header({ name }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{name}</Text>
      </View>
      <Image
        style={styles.image}
        source={{
          uri: "https://source.unsplash.com/random",
          height: 70,
          width: 70,
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  userName: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
});
