import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { getCropImage } from '@/db/cropImages'; 

interface CropProps {
  image: string;
  title: string;
  subtitle: string;
  id: string;
  selectedCrop: string | null;
  setSelectedCropId: (cropId: string) => void;
  setSelectedCrop: (cropTitle: string) => void;
}

const Crop = ({
  image,
  title,
  subtitle,
  id,
  selectedCrop,
  setSelectedCropId,
  setSelectedCrop,
}: CropProps) => {
  const handleSelect = () => {
    setSelectedCrop(title);
    setSelectedCropId(id);
  };

  // ✅ FIXED: Get image from mapping
  const cropImage = getCropImage(image);

  return (
    <TouchableOpacity
      onPress={handleSelect}
      className={`relative w-[50%] rounded-3xl bg-white p-4 
        ${selectedCrop === title ? "border-2 border-green-600/50" : "border-2 border-gray-200/20"}
     `}
    >
      <View className="w-full h-40 rounded-2xl overflow-hidden">
        {/* ✅ FIXED: Use the image from mapping */}
        <Image
          source={cropImage}
          className="w-full h-full rounded-xl"
          resizeMode="cover"
        />
      </View>

      <Text className="text-lg font-bold mt-2">{title}</Text>
      <Text className="text-gray-500">{subtitle}</Text>
      {selectedCrop === title && (
        <View className="absolute top-4 right-4 w-8 h-8 rounded-full bg-green-500 border-2 border-gray-100" />
      )}
    </TouchableOpacity>
  );
};

export default Crop;