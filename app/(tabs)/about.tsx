import { useLanguageStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, Text, View } from "react-native";
const Logo = require("@/assets/images/logo.png")



const About = () => {
  const language = useLanguageStore((state) => state.language);
const features = language === "english"
  ? [
      "📸 Scan crops using your phone camera",
      "🌿 Detect crop diseases and health status",
      "🧪 Get organic and chemical treatment advice",
      "💾 Save analysis reports (for logged-in users)",
      "📶 Works even with poor internet (limited mode)",
    ]
  : [
      "📸 Ɗaukar amfanin gona ta kameran waya",
      "🌿 Gano cututtukan amfanin gona da ƙarancin lafiya",
      "🧪 Samun shawarwari na magani na organiki da chemikal",
      "💾 Ajiye rahoton bincike (don manoma da shiga)",
      "📶 Yana aiki kuma da wajen da hanyar internet (hanyar ƙaranci)",
    ];

  return (
    <ScrollView className="w-full bg-gray-50 px-6 pt-10">

      {/* App Icon / Logo */}
      <View className="w-full flex items-center mb-6">
        <View className="w-40 h-40 bg-green-500/10 rounded-3xl flex items-center justify-center mb-3">
          <Image source={Logo} style={{ width: 80, height: 80 }} />
        </View>
        <Text className="text-3xl font-bold text-gray-800">FarmLook</Text>
        <Text className="text-gray-500 text-center mt-2 text-lg">
          {language === "english"
            ? "AI-Powered Crop Disease Detection 🌱"
            : language === "hausa" && "Gano Cututtukan Amfanin Gona ta AI 🌱"} 
        </Text>
      </View>

      {/* About Card */}
      <View className="bg-white rounded-3xl p-6 mb-6 border border-gray-100">
        <Text className="text-xl font-semibold text-gray-700 mb-3">
          {language === "english" ? "About FarmLook" : "Game da FarmLook"}
        </Text>
        <Text className="text-gray-500 text-[16px] leading-7">
          {language === "english"
            ? "FarmLook is an innovative mobile application designed to help farmers quickly identify crop diseases using AI technology. By simply taking a photo of their crops, farmers can receive instant analysis and treatment recommendations to protect their yields and ensure healthy growth."
            : language === "hausa" &&
            "FarmLook wani manhaja ne na wayar hannu wanda aka ƙirƙira don taimakawa manoma gano cututtukan amfanin gona cikin sauri ta amfani da fasahar AI. Ta hanyar ɗaukar hoto na amfanin gonarsu, manoma za su iya samun bincike nan take da shawarwari na magani don kare amfanin gonarsu da tabbatar da lafiyar gona."}
        </Text>
      </View>

      {/* Mission */}
      <View className="bg-white rounded-3xl p-6 mb-6 border border-gray-100">
        <View className="flex flex-row items-center mb-3">
          <Ionicons name="heart" size={22} color="#22C55E" />
          <Text className="ml-2 text-xl font-semibold text-gray-700">
            {language === "english" ? "Our Mission" : "Manufarmu"}
          </Text>
        </View>
        <Text className="text-gray-500 text-[16px] leading-7">
          {language === "english"
            ? "To empower farmers worldwide with accessible AI tools that enable rapid crop disease detection and effective treatment solutions, ultimately enhancing food security and agricultural sustainability."
            : language === "hausa" &&
            "Don taimakawa manoma cikin gano cututtukan amfanin gona ta AI wanda za su iya samun bincike da shawarwari na magani don kare amfanin gonarsu da tabbatar da lafiyar gona."}
        </Text>
      </View>

      {/* Features */}
      <View className="bg-white rounded-3xl p-6 mb-6 border border-gray-100">
        <Text className="text-xl font-semibold text-gray-700 mb-4">
          {language === "english" ? "Key Features" : "Manyan Fasaloli"}
        </Text>

        {features.map((feature, index) => (
          <Text
            key={index}
            className="text-gray-500 text-[16px] mb-2"
          >
            {feature}
          </Text>
        ))}
      </View>

      {/* Footer */}
      <View className="flex items-center mt-10 mb-20">
        <Text className="text-gray-400 text-sm">
          Version 1.0.0
        </Text>
        <Text className="text-gray-400 text-sm mt-1">
          Built for farmers ❤️
        </Text>
      </View>

    </ScrollView>
  );
};

export default About;
