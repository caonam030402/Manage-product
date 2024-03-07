import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          router.push("/add-product/");
        }}
        className="w-full h-[52px] bg-black my-4 flex items-center justify-center rounded-2xl"
      >
        <View className="flex flex-row items-center gap-1">
          <Ionicons className="" name="add" size={17} color="white" />
          <Text className="text-white text-[16px]">Add Product</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
