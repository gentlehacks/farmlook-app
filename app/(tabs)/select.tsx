import Crop from '@/components/Crop';
import { useLanguageStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { crops } from '../../db/crops';


const Select = () => {
  const language = useLanguageStore((state) => state.language);

  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedCropEnglish = crops.find(crop => crop.id === selectedCropId)?.title.english;


  const handleGoToCamera = () => {
    if (!selectedCrop) return setErrorMessage(language === "english"
      ? "Please select a crop to continue."
      : "Ka zaɓi amfanin gona don ci gaba.");

    router.push({
      pathname: "/(tabs)/camera",
      params: {
        crop: selectedCrop,
        selectedCrop: selectedCropEnglish,
      },
    });

  };

  const handleGoToSettings = () => {
    router.push('/(tabs)/settings')
  }

  setTimeout(() => {
    setErrorMessage(null);
  }, 7000)

  const filteredCrops = crops.filter((crop) =>
    (typeof crop.title === 'string' ? crop.title : crop.title.english).toLowerCase().includes(search.toLowerCase())
  );



  return (
    <View className="relative w-full h-full p-6 flex flex-col bg-gray-50">
      {/* Header */}
      <View className="w-full flex flex-col bg-gray-100/30 backdrop-filter backdrop-blur-md  justify-center items-center pt-6">
        {/* Col1 */}
        <View className="w-full flex flex-row items-center justify-between mb-4">
          <View className="flex flex-col">
            <Text className="text-lg font-semibold text-gray-400 mb-1">
              {language === "english"
                ? "Hello, Farmer!"
                : language === "hausa" && "Sannu, Manomi!"}
            </Text>
            <Text className="text-xl font-bold text-gray-700">
              {language === "english"
                ? "What Are You Growing?"
                : language === "hausa" && "Me Kake Noma?"}
            </Text>
          </View>
          <View className='flex flex-row items-center gap-3'>
            <TouchableOpacity onPress={() => router.push("/savedReports")} className='relative bg-white p-2 rounded-full'>
              <MaterialCommunityIcons name="leaf-circle" size={30} color="#4B5563" />

            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGoToSettings}
              className="flex flex-col bg-white rounded-full p-2"
            >
              <Ionicons name="cog" size={30} color="#4B5563" />
            </TouchableOpacity>
          </View>

        </View>
        {/* Col2 */}
        <View className="w-full rounded-full mb-4">
          <TextInput
            value={search}
            onChangeText={(text) => setSearch(text)}
            placeholder={`${language === "english"
              ? "Search crops..."
              : language === "hausa" && "Nemo amfanin gona..."
              }`}
            placeholderTextColor="gray"
            className="px-6 pl-12 py-4 rounded-full bg-white border-1 border-gray-700"
          />
          <Ionicons
            name="search"
            size={20}
            color="#9CA3AF"
            className="absolute left-4 top-4"
          />
        </View>
      </View>
      {/* Crops List */}
      {!filteredCrops.length && (
        <Text className="text-gray-500 mt-10 text-center">
          No crops found for &quot;{search}&quot;
        </Text>
      )}
      <FlatList
        data={filteredCrops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Crop
            image={item.image}
            title={
              typeof item.title === "string"
                ? item.title
                : item.title[language === "hausa" ? "hausa" : "english"]
            }
            subtitle={item.subtitle}
            id={item.id}
            selectedCrop={selectedCrop}
            setSelectedCropId={setSelectedCropId}
            setSelectedCrop={setSelectedCrop}
          />
        )}
        contentContainerStyle={{ paddingBottom: 300 }}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 15,
        }}
        className="w-full gap-4"
      />
      {!selectedCrop && (
        <Text className="text-red-500 mb-2">{errorMessage}</Text>
      )}
      <TouchableOpacity
        onPress={handleGoToCamera}
        className="w-full fixed bottom-45 text-white left-0 px-6 py-4 bg-green-600 rounded-full flex flex-row items-center justify-center"
      >
        <Text className="text-white text-lg font-semibold flex flex-row items-center justify-center">
          {language === "english"
            ? "Continue with"
            : language === "hausa" && "Ci gaba da"}{" "}{selectedCrop}
        </Text>
        <FontAwesome5
          name="arrow-right"
          size={16}
          color="#FFFFFF"
          className="ml-2"
        />
      </TouchableOpacity>
    </View>
  );
}

export default Select