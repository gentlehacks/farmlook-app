import { useLanguageStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface User {
  name: string;
  state: string;
}
const Settings = () => {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string | null>(null);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  // Get token from ASyncstorage and User data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // 1. Get token first
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);

        // 2. Get user data (only if needed for this screen)
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);


  // Delete token fron Localstorage
  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    router.replace("/login");
  };
  if (!token) {
    return (
      <View className="w-full h-screen flex flex-col items-center justify-center px-6">
        <Text className="text-xl font-medium text-gray-600 text-center mb-6">
          Please Create an account to get full access to all features!
        </Text>
        <TouchableOpacity onPress={() => router.push('/login')} className="px-6 py-3 rounded-full flex flex-row items-center justify-center bg-green-600">
          <Text className="text-white font-medium text-lg">Login or create an Account</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View className="w-full h-full flex flex-col bg-gray-50 ">
      {/* Contents */}
      <ScrollView className="pt-10 pb-200 w-full h-screen px-6 flex flex-col">
        {/* User Profile */}
        <View className="flex flex-col items-center justify-center">
          <View className="relative">
            <View className="w-[100px] h-[100px] rounded-full border border-green-300 overflow-hidden mb-4">
              <Image
                source={require("../../assets/images/avatar.png")}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
            <TouchableOpacity className="absolute bottom-[10px] right-[5px] bg-green-400 p-1 rounded-full border-[3px] border-white">
              <Ionicons name="camera" size={17} />
            </TouchableOpacity>
          </View>

          <Text className="text-2xl mb-2 text-gray-700 font-semibold">
            {user?.name}
          </Text>
          <Text className="mb-4 text-lg text-gray-500">
            {user?.state} State{" "}
          </Text>
          <View className="px-2 py-1 flex flex-row items-center justify-center border border-green-600 bg-green-500/10 rounded-full">
            <MaterialIcons
              name="verified"
              size={15}
              color="green"
              className=" mr-1"
            />
            <Text className="uppercase font-medium text-[12px] text-gray-500">
              {language === "english"
                ? "Verified Farmer"
                : language === "hausa" && "An Tabbatar da Manomi"}
            </Text>
          </View>
        </View>
        <View className="w-full relative mt-[100px] flex flex-col">
          {/* Settings Options */}
          <TouchableOpacity
            onPress={() => setShowLanguageOptions(!showLanguageOptions)}
            className=" w-full bg-white rounded-xl p-4 mb-4 flex flex-row items-center justify-between"
          >
            <View className="flex flex-row items-center ">
              <View className="bg-green-500/10 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                <Ionicons name="language" size={20} color="#008000" />
              </View>
              <Text className="text-lg font-medium text-gray-700">
                {language === "english"
                  ? "App Language"
                  : language === "hausa" && "Harshen App"}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            {showLanguageOptions && (
              <View
                className="absolute top-[-80px] right-0 p-2 w-[150px] rounded-xl bg-white gap-4 border border-gray-300 flex flex-col items-center"
                style={{ zIndex: 1000 }}
              >
                <TouchableOpacity
                  onPress={() => setLanguage("english")}
                  className="px-5 py-2 w-full rounded-md bg-gray-100 flex flex-row items-center"
                >
                  {language === "english" && (
                    <Ionicons
                      name="checkmark"
                      size={15}
                      color="green"
                      className="mr-1"
                    />
                  )}
                  <Text className="font-medium text-md text-gray-400">
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setLanguage("hausa")}
                  className="px-5 py-2 w-full rounded-md bg-gray-100 flex flex-row items-center"
                >
                  {language === "hausa" && (
                    <Ionicons
                      name="checkmark"
                      size={15}
                      color="green"
                      className="mr-1"
                    />
                  )}
                  <Text className="font-medium text-md text-gray-400">
                    Hausa
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/about")}
            className="w-full bg-white rounded-xl p-4 mb-4 flex flex-row items-center justify-between"
          >
            <View className="flex flex-row items-center ">
              <View className="bg-green-500/10 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                <FontAwesome6
                  name="circle-exclamation"
                  size={20}
                  color="#008000"
                />
              </View>
              <View>
                <Text className="text-lg font-medium text-gray-700">
                  About FarmLook
                </Text>
                <Text className="text-sm text-gray-500">Version 1.0.0</Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ backgroundColor: "rgb(252, 133, 133)" }}
          className="w-full mt-20 flex flex-row items-center justify-center border border-gray-400 px-6 py-4 rounded-full"
        >
          <Ionicons
            name="log-out-outline"
            size={30}
            color="#660000"
            className="self-center mr-2"
          />
          <Text className="text-center text-red-900 font-semibold text-lg">
            {language === "english"
              ? "Logout"
              : language === "hausa" && "Fita Waje"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Settings;
