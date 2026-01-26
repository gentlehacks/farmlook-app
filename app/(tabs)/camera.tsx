import CameraGuide from "@/components/CameraGuide";
import ConfirmAnalyzePicture from "@/components/ConfirmAnalyzePicture";
import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";

import ImagePickerComponents from "@/components/ImagePickerComponents";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"; // Removed Platform import

import { useLanguageStore } from "@/store";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showCameraGuide, setShowCameraGuide] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const language = useLanguageStore((state) => state.language);

  const { crop, selectedCrop } = useLocalSearchParams<{
    crop: string;
    selectedCrop: string;
  }>();

  if (!permission) {
    return (
      <View className="w-full flex-1 h-screen justify-center items-center">
        <View className="loader" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="w-full flex-1 h-screen">
        <Text className="text-center mt-20 mb-4">
          {language === "english"
            ? "We need your permission to access the camera."
            : language === "hausa" && "Muna buƙatar izinin ku don samun damar kyamara."}
        </Text>
        <TouchableOpacity onPress={requestPermission} className="px-4 py-2 bg-blue-500 rounded-md self-center">
          <Text className="text-white">
            {language === "english"
              ? "Grant Permission"
              : language === "hausa" && "Ba da Izini"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleImagePicker = () => {
    setShowImagePicker(true);
  };

  // FIXED: Camera uses 0-1 for both platforms
  const handleCapture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.9, // Simple 0-1 value works for both Android and iOS
      skipProcessing: true,
      base64: true,
    });

    if (photo) {
      console.log("Captured URI:", photo.uri);
      setImageUri(photo.uri);
    }
  };

  if (imageUri) {
    return (
      <ConfirmAnalyzePicture
        imageUri={imageUri}
        setImageUri={setImageUri}
        cropType={crop}
        selectedCrop={selectedCrop}
        onCancel={() => setImageUri(null)}
      />
    );
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View className="w-full flex-1 h-screen">
      {showImagePicker && (
        <ImagePickerComponents
          setShowImagePicker={setShowImagePicker}
          setImageUri={setImageUri}
        />
      )}
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <View className="absolute top-10 left-4">
        <TouchableOpacity
          onPress={handleGoBack}
          className="w-12 h-12 flex-1 items-center justify-center bg-gray-900/50 rounded-full"
        >
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {/* Help */}
      <TouchableOpacity
        onPress={() => setShowCameraGuide(!showCameraGuide)}
        className="absolute top-10 right-4 w-12 h-12 flex-1 items-center justify-center bg-gray-900/50 rounded-full"
      >
        <Ionicons name="help-circle" size={30} color="white" />
      </TouchableOpacity>
      {showCameraGuide && (
        <CameraGuide setShowCameraGuide={setShowCameraGuide} />
      )}

      {/* Controls */}
      <View className=" w-full flex flex-row items-center justify-between px-10 py-4 rounded-full bg-black/30 backdrop-filter backdrop-blur-md absolute bottom-8 left-0 right-0 mx-auto">
        <TouchableOpacity
          className="flex flex-col items-center justify-center"
          onPress={handleImagePicker}
        >
          <Ionicons name="image" size={40} color="white" />
          <Text className="text-white text-sm text-center mt-2">
            {language === "english"
              ? "Gallery"
              : language === "hausa" && "Gidan Hoto"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-col items-center justify-center"
          onPress={handleCapture}
        >
          <View className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center">
            <View className="w-12 h-12 bg-green-500 rounded-full" />
          </View>

          <Text className="text-white text-sm text-center mt-2">
            {language === "english"
              ? "Capture"
              : language === "hausa" && "Dauka Hoto"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-col items-center justify-center"
          onPress={toggleCameraFacing}
        >
          <Ionicons name="camera-reverse" size={40} color="white" />
          <Text className="text-white text-sm text-center mt-2">
            {language === "english"
              ? "Flip"
              : language === "hausa" && "Juyawa"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  }
});