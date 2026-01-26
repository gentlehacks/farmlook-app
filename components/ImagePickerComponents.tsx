import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native"; // Added Platform
import { useLanguageStore } from "@/store";
import React from "react";

interface Props {
  setShowImagePicker: (value: boolean) => void;
  setImageUri: (uri: string | null) => void;
}

export default function ImagePickerComponents({
  setShowImagePicker,
  setImageUri }: Props) {

  const language = useLanguageStore((state) => state.language);


  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        language === "english"
          ? "Permission to access the media library is required."
          : "Ana buƙatar izinin don samun damar cibiyar watsa labarai."
      );
      return;
    }

    // FIX: Platform-specific quality values
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: Platform.OS === 'android' ? 0.95 : 0.95,
      base64: true,
    });

    console.log("Image picker result:", result);

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setShowImagePicker(false);
    }
  };

  return (
    <View className="absolute top-0 left-0 z-50 w-full flex-1 items-center justify-center h-screen bg-black/50">
      <View className="bg-white p-6 rounded-2xl w-11/12 max-w-sm">
        <TouchableOpacity
          onPress={() => setShowImagePicker(false)}
          className="absolute top-4 right-4"
        >
          <Ionicons name="close-circle" size={30} color="gray" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold mb-4 text-center">
          {language === "english"
            ? "Select Crop Photo"
            : language === "hausa" && "Zaɓi Hoton Amfanin Gona"}
        </Text>

        <TouchableOpacity
          onPress={pickImage}
          className="px-6 py-4 bg-green-500 rounded-lg items-center mb-3"
        >
          <Ionicons name="images" size={24} color="white" />
          <Text className="text-white text-center mt-2 font-medium">
            {language === "english"
              ? "Pick from Gallery"
              : language === "hausa" && "Zaɓi daga Gidan Hoto"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowImagePicker(false)}
          className="px-6 py-3 border border-gray-300 rounded-lg items-center"
        >
          <Text className="text-gray-600">
            {language === "english"
              ? "Cancel"
              : language === "hausa" && "Soke"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}