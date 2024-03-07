import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { db } from "../../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useLocalSearchParams } from "expo-router";
import { Product } from "@/components/card-product";
import { dataCategory } from "../add-product";
import Toast from "react-native-toast-message";

export default function Page() {
  const productId = useLocalSearchParams().producId[0];

  const [urlImage, setUrlImage] = useState("");
  const [valueCategory, setValueCategory] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const { top } = useSafeAreaInsets();

  const {
    isPending,
    error,
    data: productData,
  } = useQuery<Product>({
    queryKey: ["products"],
    queryFn: () =>
      fetch(
        `https://65e76c2f53d564627a8eca2b.mockapi.io/product/${productId}`
      ).then((res) => res.json()),
  });

  const mutation = useMutation({
    onSuccess: () => {
      console.log("success");
      Toast.show({
        type: "success",
        text1: "Sửa thành công",
        text2: "Bạn có thể xem lại ở giỏ hàng 👋",
      });
      reset();
      setUrlImage("");
    },
    mutationFn: (newTodo) => {
      return axios.put(
        `https://65e76c2f53d564627a8eca2b.mockapi.io/product/${productId}`,
        newTodo
      );
    },
  });

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storageRef = ref(db, "images/" + new Date().getTime());
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      setUrlImage(downloadURL);
    } else {
      alert("You did not select any image.");
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const dataPost = { ...data, image: urlImage };
    mutation.mutate(dataPost);
  };

  useEffect(() => {
    if (productData) {
      setValue("name", productData.name);
      setValue("category", productData.category);
      setValue("description", productData.description);
      setValue("price", productData.price?.toString());
      setValue("quantity", productData.quantity?.toString());

      setValueCategory(productData.category);
      setUrlImage(productData.image);
    }
  }, [productData, setValue]);

  return (
    <View
      className="flex items-center flex-1 px-4 lg:px-6 bg-[#F6F6F6]"
      style={{ padding: top + 10 }}
    >
      <View className="flex flex-row items-center justify-between w-full mb-2">
        <Link href="/">
          <Ionicons className="" name="chevron-back" size={20} />
        </Link>
        <Text className="text-2xl">Edit Product</Text>
        <TouchableOpacity
          onPress={() => {
            reset();
            setUrlImage("");
          }}
        >
          <Ionicons className="" name="trash" size={20} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={pickImageAsync}
        className="w-full h-[200px] border border-dashed border-gray-300 bg-white my-4 flex items-center justify-center rounded-2xl"
      >
        {urlImage ? (
          <Image
            source={{ uri: urlImage }}
            className="w-full h-full rounded-md"
          />
        ) : (
          <Ionicons name="image-outline" size={40} color="black" />
        )}
      </TouchableOpacity>
      <Controller
        name="name"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text className="">Name *</Text>
            <View className=" mt-[10px] flex flex-row items-center border bg-white border-gray-300 h-[50px] w-full rounded-xl p-2 px-4 ">
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className="flex-1"
              />
            </View>
          </View>
        )}
      />

      <View className="flex flex-row mt-5 gap-5">
        <View className="flex-1">
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="">Price *</Text>
                <View className=" mt-[10px] flex flex-row items-center border bg-white border-gray-300 h-[50px] w-full rounded-xl p-2 px-4 ">
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="flex-1"
                  />
                </View>
              </View>
            )}
            name="price"
          />
        </View>

        <View className="w-[40%]">
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="">Quanlity *</Text>
                <View className=" mt-[10px] flex flex-row items-center border bg-white border-gray-300 h-[50px] w-full rounded-xl p-2 px-4 ">
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    className="flex-1"
                  />
                </View>
              </View>
            )}
            name="quantity"
          />
        </View>
      </View>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text className="mt-5">Description*</Text>
            <View className=" mt-[10px] flex flex-row items-center border bg-white border-gray-300 h-[50px] w-full rounded-xl p-2 px-4 ">
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className="flex-1"
              />
            </View>
          </View>
        )}
        name="description"
      />
      <View className="mt-5 w-full">
        <Text className="mb-4">Category *</Text>

        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={dataCategory}
          placeholder={valueCategory}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          searchPlaceholder="Search..."
          value={valueCategory}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValueCategory(item.value);
            setIsFocus(false);
          }}
          // renderLeftIcon={() => {}}
        />
      </View>
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="w-full mt-11 h-[52px] bg-black my-4 flex items-center justify-center rounded-2xl"
      >
        <View className="flex flex-row items-center gap-1">
          <Ionicons className="" name="add" size={17} color="white" />
          <Text className="text-white text-[14px]">Edit Product</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 52,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 0.3,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
