import React, { useState } from "react";
import {
  Button,
  Image,
  ScrollView,
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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";

export const dataCategory = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
];

export default function Page() {
  const [urlImage, setUrlImage] = useState("");
  const { top } = useSafeAreaInsets();

  const [valueCategory, setValueCategory] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  console.log(valueCategory);

  const mutation = useMutation({
    onSuccess: () => {
      console.log("success");
      reset();
      setValueCategory(dataCategory[0].value);
      setUrlImage("");
      Toast.show({
        type: "success",
        text1: "Sửa thành công",
        text2: "Bạn có thể xem lại ở giỏ hàng 👋",
      });
    },
    mutationFn: (newProduct) => {
      return axios.post(
        "https://65e76c2f53d564627a8eca2b.mockapi.io/product",
        newProduct
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
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const dataPost = { ...data, image: urlImage, category: valueCategory };
    mutation.mutate(dataPost);
  };

  return (
    <ScrollView>
      <View
        className="flex items-center flex-1 px-4 lg:px-6 bg-[#F6F6F6]"
        style={{ padding: top + 10 }}
      >
        <View className="flex flex-row items-center justify-between w-full mb-2">
          <Link href="/">
            <Ionicons className="" name="chevron-back" size={20} />
          </Link>
          <Text className="text-2xl">Add Product</Text>
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
              name="quanlity"
            />
          </View>
        </View>
        <View className="mt-5 w-full">
          <Text className="mb-4">Category *</Text>

          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dataCategory}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "" : "..."}
            searchPlaceholder="Search..."
            value={valueCategory}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValueCategory(item.value);
              setIsFocus(false);
            }}
          />
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
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="w-full mt-10 h-14 bg-black my-4 flex items-center justify-center rounded-2xl"
        >
          <View>
            <View className="flex flex-row items-center gap-1">
              <Ionicons className="" name="add" size={17} color="white" />
              <Text className="text-white text-[14px]">Add Product</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    fontSize: 16,
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
