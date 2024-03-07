import { Link, router } from "expo-router";

import React, { useRef, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import CardProduct, { Product } from "@/components/card-product";
import { MenuProvider } from "react-native-popup-menu";

import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

type SheetType = {
  open: () => void;
};

export default function Page() {
  const [idProduct, setIdProduct] = useState("");
  const sheet = useRef<ActionSheetRef>(null);

  const mutation = useMutation({
    onSuccess: () => {
      refetch();
      Toast.show({
        type: "success",
        text1: "Delete success",
      });
    },
    mutationFn: (id: string) => {
      return axios.delete(
        `https://65e76c2f53d564627a8eca2b.mockapi.io/product/${id}`
      );
    },
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      fetch("https://65e76c2f53d564627a8eca2b.mockapi.io/product").then((res) =>
        res.json()
      ),
  });

  const products: Product[] = data;

  const filteredProducts =
    products &&
    Array.isArray(products) &&
    products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <MenuProvider>
      <ActionSheet
        ref={sheet as any}
        containerStyle={{
          padding: 20,
        }}
      >
        <View>
          <Text className="text-center text-xl font-bold">Delete Product</Text>
          <Text className="text-center text-gray-600 mt-2">
            Are you sure if you delete the product it will be permanently
            deleted
          </Text>
          <TouchableOpacity
            onPress={() => {
              mutation.mutate(idProduct);
              sheet.current.hide();
            }}
            className="w-full h-[52px] bg-red-700 my-4 flex items-center justify-center rounded-2xl"
          >
            <View className="flex flex-row items-center gap-1">
              <Text className="text-white text-[16px]">Delete</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              sheet.current.hide();
            }}
            className="w-full h-[52px] bg-black flex items-center justify-center rounded-2xl"
          >
            <View className="flex flex-row items-center gap-1">
              <Text className="text-white text-[16px]">Cancle</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ActionSheet>
      <View className="flex flex-1 px-4 lg:px-6 bg-[#F6F6F6]">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {filteredProducts && (
          <ScrollView>
            <View className="flex-1 flex-col flex gap-y-4">
              {filteredProducts.map((item, index) => {
                return (
                  <CardProduct
                    setIdProduct={setIdProduct}
                    sheet={sheet}
                    refetch={refetch}
                    id={item.id}
                    category={item.category}
                    image={item.image}
                    name={item.name}
                    quantity={item.quantity}
                    price={item.price}
                    description={item.description}
                    key={index}
                  />
                );
              })}
            </View>
          </ScrollView>
        )}
        <Footer />
      </View>
    </MenuProvider>
  );
}
