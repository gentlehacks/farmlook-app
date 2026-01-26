import { useLanguageStore } from '@/store';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from 'expo-image';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';


interface Report {
  id: string;
  name: string;
  crop: string;
  result: any;
  image_url: string;
  created_at: string;
}

const SavedReports = () => {
   const language = useLanguageStore((state) => state.language);

  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null)
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);

      try {
        const token = await AsyncStorage.getItem("token");
        setToken(token)
        if (!token) {
          return;
        }

        const response = await fetch(
          "https://farmlook.onrender.com/analysis/reports",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log(data)

        if (!data.success) {
          alert(data.error || "Failed to load reports");
          return;
        }

        setReports(data.reports);
      } catch (error) {
        console.log("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);


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
    )
  }

  return (
    <View className='w-full flex flex-col bg-gray-50 min-h-screen'>

      {/* Loading state */}
      {loading && (
        <View className=' w-full h-screen flex items-center justify-center'>
          <ActivityIndicator size={44} color="#10B981" />
        </View>
      )}

      <ScrollView className='w-full  flex flex-col pt-8'
        contentContainerStyle={{
          paddingBottom: 200, // Space after the last item
          paddingHorizontal: 15
        }}
      >
        {!loading && (
          <Text className='text-2xl font-bold text-gray-700 mb-6'>
            {reports.length}{" "}
            {language === "english"
              ? "Saved Reports"
              : language === "hausa" && "An Ajiye Rahotanni"}
              
          </Text>
        )}
        
        {reports.length > 0 && (

          reports.map((report) => (
            <TouchableOpacity
              key={report.id}
              onPress={() => router.push({
                pathname: "/saved/[id]",
                params: { id: report.id },
              })}
              className='w-full h-150 border border-green-600/20 p-4 my-1 flex flex-row items-center justify-between bg-white rounded-2xl'>
              {/* image */}
              <View className='w-[100px] h-[100px] flex items-center justify-center rounded-xl overflow-hidden'>
                <Image
                  source={{ uri: `${report.image_url}` }}
                  transition={1000}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              <View className='flex flex-col'>
                <Text className='text-xl font-semibold text-gray-700 mb-6'>
                  {report.name}
                </Text>
                {/* Date and Health */}
                <View className='flex flex-row items-center'>
                  {/* Date */}
                  <View className='flex flex-row items-center mr-3'>
                    <FontAwesome6 name="clock" color="#10B981" />
                    <Text className='text-sm text-center text-gray-500 ml-1'>
                      {new Date(report.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  {/* Health */}
                  <View className='flex flex-row items-center'>
                    <FontAwesome6 name="leaf" color="#10B981" />
                    <Text className={`text-sm text-center text-gray-500 ml-1
                    ${report.result?.health === 'Diseased' ? 'text-red-500' : ''}  
                  `}>
                      {report.result?.health}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))

        )}


        {/* IF no result */}
        {loading === false && reports.length === 0 && (
          <Text className="text-center text-gray-400 mt-20 text-lg">
            {language === "english"
              ? "No saved reports found. 🌱"
              : language === "hausa" && "Babu rahotannin da aka ajiye. 🌱"}
          </Text>
        )}

      </ScrollView>

      
    </View>
  )
}

export default SavedReports
