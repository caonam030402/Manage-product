import { Image, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Header({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) {
  const { top } = useSafeAreaInsets();
  return (
    <View className="mb-6" style={{ paddingTop: top }}>
      <View className="flex flex-row items-center justify-between my-5 relative">
        <Ionicons name="menu" size={23} color="black" />
        <Text
          style={{
            transform: [{ translateX: -9 }],
          }}
          className="text-2xl text-center font-medium left-[50%]"
        >
          Product
        </Text>
        {/* <Ionicons className="" name="logo-apple" size={25} color="black" /> */}
        <Image
          source={{
            uri: "https://i.pinimg.com/originals/20/60/2d/20602d43cc993811e5a6bd1886af4f33.png",
          }}
          className="w-10 h-10"
          resizeMode="contain"
        />
      </View>
      <View className=" rounded-lg">
        <View className="flex mt-3 items-center flex-row justify-between ">
          <View className="flex flex-row items-center h-[48px] w-full rounded-xl p-2 px-4 bg-white">
            <TextInput
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
              className="flex-1"
              placeholder="Search..."
            />
            <Ionicons
              className=""
              name="search-outline"
              size={22}
              color="black"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
