import { useAnalysisStore } from '@/db/store';
import { useLanguageStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TouchableOpacity, View } from 'react-native';

const ConfirmAnalyzePicture = ({
  imageUri,
  setImageUri,
  cropType,
  selectedCrop,
  onCancel,
}: {
  imageUri: string;
  setImageUri: (uri: string | null) => void;
  cropType: string;
  selectedCrop: string;
  onCancel: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const { setAnalysisResult } = useAnalysisStore()

  if (!imageUri) return null;

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      // 2. Prepare the image and type
      const image = imageUri.split("/").pop() || "plant_photo.jpg";
      const ext = image.split(".").pop() || "jpg";
      const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`; // Fix jpg -> jpeg

      // 3. Create FormData
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: mimeType,
        name: image,
      } as any);
      formData.append("cropType", selectedCrop);
      formData.append("language", language);

      console.log("Sending:", { selectedCrop, image, language });

      const API_URL = "https://farmlook.onrender.com";
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setAnalysisResult(result.data)

      // Save to Zustand
      const parsedData = JSON.parse(
        result.data.replace(/```json|```/g, "").trim()
      );

      setAnalysisResult(parsedData);

      console.log("Response:", result);

      // 5. Handle result
      if (response.ok && result.success) {
        router.push({
          pathname: "/(tabs)/result",
          params: {
            imageUri: imageUri,
          },
        });

      } else {
        Alert.alert(
          "Analysis Failed",
          result.error || "Could not analyze the image."
        );
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert(
        "Network Error:Cannot connect to server. Check internet and backend URL."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable className="bg-black/40 w-full fixed top-0 left-0 h-screen">
      <View className=" w-full flex-1 h-[550px] bg-gray-100 rounded-t-3xl items-center justify-center px-8 relative bottom-0 left-0">
        <TouchableOpacity
          onPress={() => setImageUri(null)}
          disabled={isLoading}
          className="absolute top-8 left-16 z-10"
        >
          <Ionicons
            name="close-circle"
            size={40}
            color="gray"
            className="absolute top-2 right-2 z-10"
            onPress={() => onCancel()}
          />
        </TouchableOpacity>
        <View style={{ position: 'relative', width: '95%', height: 300 }} className=" flex items-center justify-center mb-6 rounded-2xl border-2 border-green-500/80 p-4 bg-white overflow-hidden">
          <Image
            source={{ uri: imageUri }}
            style={{ width: 300, height: 400 }}
            className="w-[100%] h-[100%] rounded-2xl"
          />
          {isLoading && (
            <View className="absolute ">
              <ActivityIndicator size="large" color={'rgb(211, 255, 209)'} />
            </View>
          )}

          <View className="absolute bottom-0 mb-2 left-[5px] bg-green-500/50 px-3 py-1 rounded-full flex flex-row items-center justify-center">
            <Text className="text-sm text-white">{cropType}</Text>
          </View>
        </View>
        <Text className="text-2xl font-semibold text-gray-700 mb-4 text-center">
          {language === "english"
            ? "Confirm and Analyze Picture"
            : language === "hausa" && "Tabbatar da Bincika Hoto"}
        </Text>
        <Text className="text-xl font-medium text-gray-400 mb-10 text-center">
          {language === "english"
            ? "Ensure the picture is clear and well-lit for accurate analysis."
            : language === "hausa" &&
            "Tabbatar cewa hoton yana da kyau kuma yayi haske don cikakken bincike."}
        </Text>
        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={isLoading}
          className={`w-full px-6 py-4 flex flex-row items-center justify-center rounded-xl
            ${isLoading ? ' bg-gray-400' : ' bg-green-600'}  
          `}
        >

          <Text className="text-gray-100 text-lg font-semibold">
            {isLoading
              ? language === "english"
                ? "Analyzing..."
                : language === "hausa"
                  ? "Ana Bincike..."
                  : "Analyzing..."
              : language === "english"
                ? "Analyze"
                : "Bincika"}
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default ConfirmAnalyzePicture