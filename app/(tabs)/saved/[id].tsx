import { useLanguageStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View
} from "react-native";

export interface Remedy {
  product: string;
  application: string;
}

export interface TreatmentPlan {
  immediateActions: string[];
  organicRemedies: Remedy[];
  chemicalControls: Remedy[];
}

export interface PrimaryDiagnosis {
  problemName: string;
  description: string;
  symptoms: string[];
}

export interface AnalysisData {
  image_url: string;
  crop: string;
  result: {
    health: string;
    confidence: number;
    diagnosis: PrimaryDiagnosis;
    treatmentPlan: TreatmentPlan;
  }

}

const SavedReportDetails = () => {
  const language = useLanguageStore((state) => state.language);

  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await fetch(
          `https://farmlook.onrender.com/analysis/report/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setReport(data.report);
        console.log(data)
        if (!data.success) {
          alert(data.error || "Failed to load report");
          router.back();
          return;
        }


      } catch (error) {
        console.log("Error loading report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);


  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={40} color="#10B981" />
      </View>
    );
  }

  if (!report) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500 text-lg">
          {language === "english"
            ? "Report not found"
            : language === "hausa" && "Ba a sami rahoton ba"}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-6 pt-6">
        {/* Status */}
        <View className="bg-white p-6 rounded-3xl mb-6">
          <Text className="text-3xl font-bold text-green-600 text-center mb-4">
            {report?.result?.health}
          </Text>

          <Text className="text-center text-gray-500 text-lg font-medium">
            {report?.result?.diagnosis?.description}
          </Text>
        </View>

        {/* Image */}
        <View className="bg-white p-4 rounded-3xl mb-6">
          <Image
            source={{ uri: report?.image_url }}
            style={{ width: "100%", height: 220, borderRadius: 20 }}
          />
        </View>

        {/* Confidence */}
        <View className="wfull flex flex-row items-center justify-between bg-white p-6 rounded-3xl mb-6">
          <View className="flex flex-col items-center justify-center w-[50%]  border-r-2 border-gray-200">
            <Text className="text-gray-500 text-lg">
              {language === "english" ? "Confidence" : language === "hausa" && "Amincewa"}
            </Text>
            <Text className="text-2xl font-semibold text-green-600">
              {report?.result?.confidence}%
            </Text>
          </View>
          <View className="flex flex-col items-center justify-center w-[50%]">
            <Text className="text-gray-500 text-lg">
              {language === "english" ? "Crop Type" : language === "hausa" && "Amfanin gona"}
            </Text>
            <Text className="text-2xl font-semibold text-green-600">
              {report?.crop}
            </Text>
          </View>

        </View>

        {/* ActionPlan */}
        <View className="w-full mt-5 mb-5 p-5 bg-white rounded-3xl border border-gray-100 flex flex-col">
          <View className="flex flex-row items-center">
            <Ionicons name="leaf" size={25} style={{ color: 'rgb(0,200,10)' }} />
            <Text className="ml-3 font-bold text-2xl text-gray-500">
              {language === "english" ? "Treatment Plan" : language === "hausa" && "Shirin Magani"}
            </Text>
          </View>
          {/* immediate action */}
          <View className="w-full mt-10 flex flex-col gap-5">
            <Text className="font-semibold text-lg text-gray-400 mb-1">
              {language === "english" ? "Immediate Actions" : language === "hausa" && "Matakan Gaggawa"}
            </Text>
            {report?.result?.treatmentPlan?.immediateActions.map((a, index) => (
              <View key={index} className="w-full flex flex-row items-center">
                <Ionicons name="leaf" size={25} className="mr-2"
                  style={{ color: 'rgb(0, 200, 10)' }} />
                <Text className="w-[93%] text-[17px] font-medium text-gray-500">{a}</Text>
              </View>
            ))}
          </View>
          {/* Organic Remedies */}
          <View className="w-full mt-20 flex flex-col gap-5">
            <Text className="font-semibold text-lg text-gray-400 mb-3">
              {language === "english" ? "Organic Remedies" : language === "hausa" && "Magungunan Halitta"}
            </Text>
            {report?.result?.treatmentPlan?.organicRemedies.map((o, index) => (
              <View key={index} className="w-full bg-yellow-600/5 border border-gray-100 rounded-[30px] p-3 flex flex-col items-center">
                <View className="flex flex-row items-center mb-3">
                  <Ionicons name="flask" size={25}
                    style={{ color: 'rgb(0, 200, 10)' }} />
                  <Text className="w-[93%] text-xl ml-2 font-semibold text-gray-600">{o?.product}</Text>
                </View>
                <Text className="text-[15px] font-medium text-gray-500">{o.application}</Text>
              </View>
            ))}
          </View>
          {/* Chemical Controls */}
          <View className="w-full mt-12 flex flex-col gap-5">
            <Text className="font-semibold text-lg text-gray-400 mb-1">
              {language === "english" ? "Chemical Controls" : language === "hausa" && "Kula da Sinadarai"}
            </Text>
            {report?.result?.treatmentPlan?.chemicalControls.map((o, index) => (
              <View key={index} className="w-full bg-yellow-600/5 border border-gray-100 rounded-[30px] p-3 flex flex-col">
                <Text className="text-xl mb-3 font-semibold text-gray-600 ">{o.product}</Text>
                <Text className="text-[15px] font-medium text-gray-500">{o.application}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SavedReportDetails;
