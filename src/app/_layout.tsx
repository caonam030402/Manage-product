import "../global.css";
import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import Toast from "react-native-toast-message";
import { toastConfig } from "./configs/toast-config";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
      <Toast config={toastConfig as any} />
    </QueryClientProvider>
  );
}
