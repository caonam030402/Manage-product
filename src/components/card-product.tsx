import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import {
  QueryCache,
  QueryClient,
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import { ActionSheetRef } from "react-native-actions-sheet";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: Number;
  category: string;
  quantity: Number;
  image: string;
}

interface Props extends Product {
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
  sheet: React.MutableRefObject<ActionSheetRef>;
  setIdProduct: React.Dispatch<React.SetStateAction<string>>;
}

export default function CardProduct({
  sheet,
  id,
  category,
  image,
  name,
  price,
  quantity,
  setIdProduct,
  description,
  refetch,
}: Props) {
  return (
    <View
      style={{
        elevation: 2,
        backgroundColor: "white",
        shadowColor: "#ac9e9e",
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
      className="flex flex-row w-full gap-2 p-2 rounded-lg"
    >
      <Image
        className="w-24 h-24 rounded-lg"
        source={{
          uri: image,
        }}
      />
      <View className="flex-1 flex-col flex justify-between m-2">
        <View className="flex flex-row justify-between">
          <View className="">
            <Text className="text-lg font-bold">{name}</Text>
            <Text className="text-sm text-gray-500">{category}</Text>
          </View>
          <Menu>
            <MenuTrigger>
              <Ionicons name="ellipsis-vertical" size={18} color="black" />
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: { borderRadius: 10, padding: 5, width: 100 },
              }}
            >
              <MenuOption
                onSelect={() => {
                  setIdProduct(id);
                  sheet.current.show();
                }}
              >
                <Text>Delete</Text>
              </MenuOption>
              <View className="h-[0.5px] w-full bg-slate-600/50" />
              <MenuOption
                customStyles={{}}
                onSelect={() => {
                  router.push(`/edit-product/${id}`);
                }}
              >
                <Text>Edit</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
        <View>
          <View className="flex flex-row justify-between">
            <View className="">
              <Text className="text-sm">x{quantity.toString()}</Text>
            </View>
            <Text className="font-bold">
              <Text className="text-[14px]">$ </Text>
              <Text className="text-[14px]">{price.toString()}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
