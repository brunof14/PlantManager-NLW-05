import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, FlatList, Alert } from "react-native";
import { Header } from "../components/Header";
import colors from "../styles/colors";

import waterDrop from "../assets/waterdrop.png";
import {
  loadPlants,
  LocalPlantsProps,
  PlantProps,
  removePlant,
} from "../libs/storage";
import { formatDistance } from "date-fns";
import { pt } from "date-fns/locale";
import fonts from "../styles/fonts";
import { PlantCardSecondary } from "../components/PlantCardSecondary";
import { Load } from "../components/Load";

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<LocalPlantsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  async function loadStorageData() {
    const plantsStorage = await loadPlants();
    if (!plantsStorage) {
      setLoading(false);
      return;
    }

    const [firstPlant] = plantsStorage;

    const nextTime = formatDistance(
      new Date(firstPlant.dateTimeNotification).getTime(),
      new Date().getTime(),
      { locale: pt }
    );

    setNextWatered(`Regue sua ${firstPlant.name} daqui a ${nextTime}.`);
    setMyPlants(plantsStorage);
    setLoading(false);
  }

  useEffect(() => {
    loadStorageData();
  }, []);

  function handleRemove(plant: PlantProps) {
    Alert.alert("Remover", `Deseja remover a ${plant.name}`, [
      {
        text: "Não 🙏",
        style: "cancel",
      },
      {
        text: "Sim 😥",
        onPress: async () => {
          try {
            await removePlant(String(plant.id));
            setMyPlants((prevPlants) =>
              prevPlants.filter(({ id }) => id !== plant.id)
            );
          } catch (error) {
            Alert.alert("Não foi possível remover! 😥");
          }
        },
      },
    ]);
  }

  return (
    <Load isLoading={loading}>
      <View style={styles.container}>
        <View style={styles.wrapperPadding}>
          <Header title="Minhas" subtitle="Plantinhas" />
        </View>

        <View style={styles.wrapperPadding}>
          <View style={styles.spotlight}>
            <Image source={waterDrop} style={styles.spotlightImage} />
            <Text style={styles.spotlightText}>{nextWatered}</Text>
          </View>
        </View>

        <View style={styles.plants}>
          <View style={styles.wrapperPadding}>
            <Text style={styles.plantsTitle}>Próximas regadas</Text>
          </View>

        
          <FlatList
            keyExtractor={(item) => String(item.id)}
            data={myPlants}
            contentContainerStyle={{
              paddingHorizontal: 30
            }}
            renderItem={({ item }) => (
              <PlantCardSecondary
                data={item}
                handleRemove={() => handleRemove(item)}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ margin: 6 }}></View>}
            showsVerticalScrollIndicator={false}
          />
        
        </View>
      </View>
    </Load>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
  },
  wrapperPadding: {
    paddingHorizontal: 30,
    width: "100%",
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: "100%",
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
