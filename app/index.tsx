import { useLanguageStore } from "@/store";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import "./global.css";
const onboardingImage = require("@/assets/images/onboarding.jpg");

export default function App() {
  const language = useLanguageStore((state) => state.language);

  return (
    <View
      style={{ flex: 1 }}
      className="flex-1 items-center justify-center bg-gray-50 px-8"
    >
      <Text className="font-semibold text-2xl text-green-500 mb-8">
        FarmLook
      </Text>
      <View className="mb-4 rounded-3xl overflow-hidden w-[200px] h-[200px] flex items-center justify-center border-2 border-green-600/50">
        <Image
          source={onboardingImage}
          className="w-full h-full"
        />
      </View>
      {/* <Image
          source={logoimage}
          className="w-12 h-12"
        /> */}
      <Text className="text-3xl font-bold text-green-600 text-center mt-8">
        {language === "english"
          ? "Identify Diseases Fast!"
          : language === "hausa" && "Gano Cututtuka Cikin Sauri!"}
      </Text>
      <Text className="text-xl font-medium mt-4 text-center px-8 text-gray-400">
        {language === "english"
          ? "Scan leaves to detect diseases immidiately and protect your farm."
          : language === "hausa" &&
          "Duba shukanka don gano cututtuka nan da nan kuma ya kare gonarka."}
      </Text>
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity className="mt-12 bg-green-600 px-6 py-4 rounded-full flex flex-row justify-center items-center w-full ">
          <Text className="text-white text-lg font-semibold">
            {language === "english"
              ? "Get Started"
              : language === "hausa" && "Fara Amfani"}
          </Text>
          <FontAwesome5
            name="arrow-right"
            size={16}
            color="#FFFFFF"
            className="ml-3"
          />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
