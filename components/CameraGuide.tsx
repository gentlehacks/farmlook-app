import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguageStore } from '@/store';

export default function CameraGuide({ setShowCameraGuide }: { setShowCameraGuide: (showCameraGuide: boolean) => void }) {
  const language = useLanguageStore((state) => state.language);
  
  return (
    <View className="w-full absolute bottom-[150px] left-0 flex flex-row items-center justify-center px-8 ">
      <View className="w-fit flex flex-row items-center justify-center  bg-black/30 backdrop-filter backdrop-blur-md rounded-full px-4 py-3">
        <Text className="text-white text-center">
          {language === "english"
            ? "Align the leaf within the frame and ensure good lighting for accurate detection."
            : language === "hausa" && "Daure ganyen a cikin huren ɗin kuma tabbatar da haske mai kyau don gano daidai."}
        </Text>
        <TouchableOpacity onPress={() => setShowCameraGuide(false)} className="self-center">
          <MaterialIcons
            name="cancel"
            size={20}
            color="white"
            className="ml-2"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}