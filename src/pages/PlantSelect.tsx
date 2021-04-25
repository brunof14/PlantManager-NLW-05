import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import colors from "../styles/colors";

import api from "../services/api";

import { Header } from "../components/Header";
import { EnvironmentButton } from "../components/EnvironmentButton";
import { PlantCardPrimary } from "../components/PlantCardPrimary";

import { Load } from "../components/Load";

import fonts from "../styles/fonts";
import { useNavigation } from "@react-navigation/native";
import { loadUserName, PlantProps } from "../libs/storage";

interface EnvironmentProps {
  key: string;
  title: string;
}

const DEFAULT_ENVIRONMENT_SELECTED = { key: "all", title: "Todos" };

export function PlantSelect() {
  const [userName, setUserName] = useState("")
  const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [environmentSelected, setEnvironmentSelected] = useState(
    DEFAULT_ENVIRONMENT_SELECTED.key
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [maxPagination, setMaxPagination] = useState(0);

  const navigation = useNavigation();

  async function fetchPlants() {
    const limit = 8;
    const arrivedAtMaximumPagination = page > maxPagination;

    if (arrivedAtMaximumPagination && maxPagination) {
      setLoadingMore(false);
      return;
    }

    const { data, headers } = await api.get(
      `plants?_sort=name&_order=asc&_page=${page}&_limit=${limit}`
    );

    const maximumPaginate = Math.ceil(Number(headers["x-total-count"]) / limit);
    const notLoadMaxPaginateFromApi = maxPagination !== maximumPaginate;

    if (notLoadMaxPaginateFromApi) {
      setMaxPagination(maximumPaginate);
    }

    setPlants((prevPlants) => [...prevPlants, ...data]);
    setPage((prevPage) => prevPage + 1);

    setLoading(false);
    setLoadingMore(false);
  }

  async function fetchEnvironments() {
    const { data } = await api.get(
      "plants_environments?_sort=title&_order=asc"
    );

    setEnvironments([DEFAULT_ENVIRONMENT_SELECTED, ...data]);
  }

  async function loadAndSetUserName() {
    const name = await loadUserName()
    setUserName(name)
  }

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentSelected(environment);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) return;

    setLoadingMore(true);
    fetchPlants();
  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate("PlantSave", { plant });
  }

  function getFilteredPlants(environment: string) {
    if (environment === DEFAULT_ENVIRONMENT_SELECTED.key) return plants;

    return plants.filter((plant) => plant.environments.includes(environment));
  }

  useEffect(() => {
    loadAndSetUserName()
    fetchEnvironments();
    fetchPlants();
  }, []);

  return (
    <Load isLoading={loading}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Olá," subtitle={userName}/>

          <Text style={styles.title}>Em qual ambiente</Text>
          <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
        </View>
        <View>
          <FlatList
            data={environments}
            keyExtractor={(item) => String(item.key)}
            renderItem={({ item }) => (
              <EnvironmentButton
                title={item.title}
                active={item.key === environmentSelected}
                onPress={() => handleEnvironmentSelected(item.key)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.environmentList}
          />
        </View>

        <View style={styles.plants}>
          <FlatList
            data={getFilteredPlants(environmentSelected)}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <PlantCardPrimary
                data={item}
                onPress={() => handlePlantSelect(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            onEndReachedThreshold={0.1}
            onEndReached={({ distanceFromEnd }) =>
              handleFetchMore(distanceFromEnd)
            }
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  style={styles.activityIndicator}
                  color={colors.green}
                />
              ) : (
                <></>
              )
            }
          />
        </View>
      </View>
    </Load>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  environmentList: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 5,
    marginRight: 32,
    paddingLeft: 20,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  activityIndicator: {
    marginVertical: 30,
    padding: 20,
  },
});
