import { useAnalysisStore } from "@/db/store";
import { useLanguageStore } from "@/store";
import { imageToBase64 } from "@/utils/imageConverter";
import { Ionicons } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

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
  analysisStatus: string;
  cropIdentified: string;
  healthAssessment: string;
  confidenceScore: number;
  primaryDiagnosis: PrimaryDiagnosis;
  treatmentPlan: TreatmentPlan;
}

export interface MetaData {
  crop: string;
  imageSize: number;
  originalSize: number;
  modelUsed: string;
  timestamp: string;
}

export interface ApiResponse {
  success: boolean;
  data: AnalysisData;
  meta: MetaData;
}

const Result = () => {
  const language = useLanguageStore((state) => state.language);

  const [token, setToken] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [reportName, setReportName] = useState<string>("");
  const [saveError, setSaveError] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [checkingToken, setCheckingToken] = useState<boolean>(false);

  const params = useLocalSearchParams<{
    result: string;
    imageUri: string;
    cropType: string;
  }>();

  const currentResult = useAnalysisStore(state => state.currentResult);
  const imageUri = params.imageUri;

  // Load token once when component mounts
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };

    loadToken();
  }, []);

  // Open Save analysis Modal
  const openSaveReportModal = async () => {
    setSaveError("");
    setCheckingToken(true);

    try {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);

      if (!storedToken) {
        Alert.alert(
          language === "english" ? "Not Logged In" : "Ba a Shiga ba",
          language === "english" ? "You must be logged in to save an analysis report." : "Sai ka shiga kafin ajiye rahoton bincike.",
          [
            {
              text: language === "english" ? "Login" : "Shiga",
              onPress: () => router.push("/login"),
            },
            {
              text: language === "english" ? "Cancel" : "Soke",
              style: "cancel",
            },
          ]
        );
        return;
      }

      setOpenModal(true);
    } catch (error) {
      console.error("Error checking token:", error);
      Alert.alert("Error", "Failed to check login status");
    } finally {
      setCheckingToken(false);
    }
  };

  // Handle Save Analysis Report
  const handleSaveReport = async () => {
    if (!reportName.trim()) {
      setSaveError(
        language === "english"
          ? "Report name cannot be empty!"
          : "Sunan rahoto ba zai iya zama fanko ba!"
      );
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      // Get fresh token each time to ensure it's not expired
      const freshToken = await AsyncStorage.getItem("token");

      if (!freshToken) {
        Alert.alert(
          language === "english" ? "Not Logged In" : "Ba a Shiga ba",
          language === "english" ? "You must be logged in to save an analysis report." : "Sai ka shiga kafin ajiye rahoton bincike.",
          [
            {
              text: language === "english" ? "Login" : "Shiga",
              onPress: () => router.push("/login"),
            },
            {
              text: language === "english" ? "Cancel" : "Soke",
              style: "cancel",
            },
          ]
        );
        return;
      }

      // Validate currentResult exists
      if (!currentResult) {
        setSaveError("No analysis data available to save");
        return;
      }

      console.log("Saving report:", reportName);

      // ✅ CONVERT IMAGE TO BASE64
      console.log("Converting image to base64...");
      const imageBase64 = await imageToBase64(imageUri);
      console.log("Image converted, size:", Math.round(imageBase64.length / 1024), "KB");

      // ✅ SEND SAVE REQUEST
      const response = await fetch(
        "https://farmlook.onrender.com/analysis/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${freshToken}`,
          },
          body: JSON.stringify({
            name: reportName,
            crop: currentResult.cropIdentified,
            imageUrl: imageToBase64,
            result: {
              health: currentResult.healthAssessment,
              confidence: currentResult.confidenceScore,
              diagnosis: currentResult.primaryDiagnosis,
              treatmentPlan: currentResult.treatmentPlan,
            },
          }),
        }
      );

      const data = await response.json();
      console.log("Save response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to save report");
      }

      // Success
      setOpenModal(false);
      setReportName("");

      Alert.alert(
        language === "english" ? "Success" : "Nasara",
        language === "english" ? "Report saved successfully!" : "An ajiye rahoton cikin nasara!",
        [{ text: "OK" }]
      );

    } catch (err: any) {
      console.error("Save error:", err);
      setSaveError(
        err.message ||
        (language === "english"
          ? "Network error, try again"
          : "Kuskuren cibiyar sadarwa, sake gwadawa")
      );
    } finally {
      setSaving(false);
    }
  };

  if (!currentResult) {
    return (
      <View className="w-full flex items-center justify-center">
        <Text>An error occured!</Text>
      </View>
    );
  }

  if (currentResult?.analysisStatus === "IMAGE_REJECTED") {
    return (
      <View className="w-full h-screen p-6 flex flex-col items-center justify-center">
        <Text className="text-xl font-medium text-center text-red-400 ">
          {language === "hausa"
            ? " Hoton bai bayyana ba, da fatan za a sake ɗaukar hoton amfanin gona."
            : "Image is unclear, please retake a clear crop picture."}
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full flex flex-col bg-gray-50">

      {/* Contents */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-4 w-full flex flex-col pt-8 mb-22">
        {/* currentResultCard */}
        <View className="full flex flex-col items-center justify-center p-5 bg-white shadow-slate-200 rounded-3xl ">
          <View className={`px-6 py-3 flex flex-row items-center justify-center border border-gray-300 bg-gray-100 rounded-full
            ${currentResult?.healthAssessment === 'Healthy' ? 'bg-green-500/20' : 'bg-yellow-500/20'}  
          `}>
            <MaterialCommunityIcons size={20} name="check-circle" style={{ color: currentResult?.healthAssessment === 'Healthy' ? "rgb(24, 209, 30)" : 'rgb(184, 197, 2)' }} />
            <Text className="ml-2 font-semibold uppercase text-lg text-gray-670">
              {currentResult?.healthAssessment === 'Healthy' ? 'Excellent condition' : 'Moderate Health'}
            </Text>
          </View>
          <Text className="text-3xl text-green-600 font-semibold mt-8 mb-8">
            {currentResult?.healthAssessment === 'Healthy' ? 'Healthy Plant' : 'Moderate Health'}
          </Text>
          <Text className="text-center text-gray-500 leading-[1.8] text-xl font-medium">
            {currentResult?.primaryDiagnosis?.description}
          </Text>

          <View className="w-full flex flex-row items-center justify-between border border-gray-200 bg-gray-50 rounded-full mt-8 overflow-hidden">
            {/* Confidence score */}
            <View className="w-[50%] flex flex-col items-center justify-center border-r-2 border-gray-200 p-4">
              <Text className="text-gray-700 text-xl font-semibold mb-4">
                {language === "english"
                  ? "Confidence"
                  : language === "hausa" && " Ƙwarin Gwiwa"}
              </Text>
              <Text className={`text-2xl font-semibold mb-4
              ${currentResult?.healthAssessment === 'Healthy' ? 'text-green-500 ' : 'text-gray-500 '}  
              `}>
                {currentResult?.confidenceScore}%
              </Text>
            </View>
            {/* CropType */}
            <View className="w-[50%] flex flex-col items-center justify-center">
              <Text className="text-gray-700 text-center text-xl font-semibold mb-4">
                {language === "english"
                  ? "Crop Type"
                  : language === "hausa" && "Nau'in Amfanin Gona"}
              </Text>
              <Text className={`text-gray-500 text-center text-2xl font-semibold mb-4
                ${currentResult?.healthAssessment === 'Healthy' ? 'text-green-500 ' : 'text-gray-500 '} 
              `}>
                {currentResult?.cropIdentified}
              </Text>
            </View>
          </View>
          {/* Key Observations */}
          <View className="w-full p-4 border border-gray-100 rounded-2xl flex flex-col gap-3 mt-8">
            <Text className="text-gray-400 text-xl font-semibold mb-4">Key Observations</Text>
            {currentResult?.primaryDiagnosis?.symptoms.map((s, index) => (
              <View key={index} className="w-full flex flex-row items-center">
                <Ionicons name="leaf" size={17} className="mr-2"
                  style={{
                    color: currentResult.healthAssessment === "Healthy"
                      ? 'rgb(0, 200, 10)' :
                      'rgb(212, 236, 77)'
                  }} />
                <Text className="text-[17px] font-medium text-gray-500">{s}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Visual Analysis */}
        <View className="w-full mt-5 p-5  rounded-3xl flex flex-col">
          <View className="flex flex-row items-center mb-2">
            <FontAwesome name="photo" size={20} style={{ color: 'rgb(116, 113, 113)' }} className="mr-2" />
            <Text className="text-2xl font-semibold text-gray-500">
              {language === "english"
                ? "Visual Analysis"
                : language === "hausa" && "Binc iken Hoto"}
            </Text>
          </View>
          <View className="w-full flex flex-row items-center justify-between">
            <View className="w-[48%] h-[150px] flex items-center jsutify-center relative border border-gray-200 rounded-3xl overflow-hidden">
              <Image
                source={{ uri: imageUri }}
                style={{ width: "100%", height: "100%" }}
              />
              <View className="absolute z-100 bottom-2 left-2 flex items-center justify-center px-2 py-1 bg-green-600/50 rounded-full">
                <Text className="text-lg font-medium text-gray-100">
                  {language === "english" ? "Your Crop" : "Amfanin Gonanka"}
                </Text>
              </View>
            </View>
            <View className="w-[48%] h-[150px] flex items-center jsutify-center relative border border-gray-200 rounded-3xl overflow-hidden">
              <Image
                source={{ uri: `${imageUri}` }}
                style={{ width: "100%", height: "100%" }}
              />
              <View className="absolute bottom-2 left-2 flex items-center justify-center px-2 py-1 bg-gray-700/50 rounded-full">
                <Text className="text-lg font-medium text-gray-100">
                  {language === "english" ? "Reference" : "Madaidaici"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ActionPlan */}
        <View className="w-full mt-5 mb-5 p-5 bg-white rounded-3xl border border-gray-100 flex flex-col">
          <View className="flex flex-row items-center">
            <Ionicons name="leaf" size={25} style={{ color: 'rgb(0,200,10)' }} />
            <Text className="ml-3 font-bold text-2xl text-gray-500">
              {language === "english" ? "Action Plan" : "Matakin Gwaji"}
            </Text>
          </View>
          {/* immediate action */}
          <View className="w-full mt-10 flex flex-col gap-5">
            <Text className="font-semibold uppercase text-lg text-gray-400 mb-1">
              {language === "english" ? "Immediate Action" : "Gwaji na Gaba"}
            </Text>
            {currentResult?.treatmentPlan?.immediateActions.map((a, index) => (
              <View key={index} className="w-full flex flex-row items-center">
                <Ionicons name="leaf" size={25} className="mr-2"
                  style={{ color: 'rgb(0, 200, 10)' }} />
                <Text className="w-[93%] text-[17px] font-medium text-gray-500">{a}</Text>
              </View>
            ))}
          </View>
          {/* Organic Remedies */}
          <View className="w-full mt-20 flex flex-col gap-5">
            <Text className="font-semibold uppercase text-lg text-gray-400 mb-3">
              {language === "english" ? "Organic Remedies" : "Matakin Gwaji na Halitta"}
            </Text>
            {currentResult?.treatmentPlan?.organicRemedies.map((o, index) => (
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
            <Text className="font-semibold uppercase text-lg text-gray-400 mb-1">
              {language === "english" ? "Chemical Controls" : "Kula da Sinadarai"}
            </Text>
            {currentResult?.treatmentPlan?.chemicalControls.map((o, index) => (
              <View key={index} className="w-full bg-yellow-600/5 border border-gray-100 rounded-[30px] p-3 flex flex-col ">
                <Text className="text-xl mb-3 font-semibold text-gray-600 ">{o.product}</Text>
                <Text className="text-[15px] font-medium text-gray-500">{o.application}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Save Analysis Modal */}
      {openModal && (
        <Modal animationType="slide" transparent={true}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="w-[90%] bg-white px-6 py-8 rounded-3xl border border-gray-200">
              <TouchableOpacity
                onPress={() => setOpenModal(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full"
              >
                <Feather name="x" size={25} style={{ color: 'rgb(65, 65, 65)' }} />
              </TouchableOpacity>

              <Text className="text-2xl mb-6 font-bold text-green-600 text-center">
                {language === "english" ? "Save Analysis Report" : "Ajiye Rahoton Bincike"}
              </Text>

              <TextInput
                value={reportName}
                onChangeText={setReportName}
                placeholder={language === "english" ? "Enter report name" : "Shigar da sunan rahoto"}
                placeholderTextColor={'rgb(202, 202, 202)'}
                autoFocus={true}
                autoCapitalize='words'
                onSubmitEditing={handleSaveReport}
                className="px-4 py-4 text-[16px] text-gray-600 font-medium border border-gray-300 rounded-2xl w-full"
              />

              {saveError ? (
                <Text className="text-red-500 mt-2 text-sm">{saveError}</Text>
              ) : null}

              <TouchableOpacity
                disabled={saving}
                onPress={handleSaveReport}
                className={`px-4 py-3 mt-6 w-full rounded-full flex items-center justify-center
                  ${saving ? "bg-gray-400" : "bg-green-600"}
                `}
              >
                <Text className="text-lg font-medium text-white">
                  {saving
                    ? (language === "english" ? "Saving..." : "Ajiye...")
                    : (language === "english" ? "Save Report" : "Ajiye Rahoto")
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Footer */}
      <View className="w-full absolute z-20 bottom-0 left-0 flex flex-row items-center justify-between bg-white p-5">
        <TouchableOpacity
          onPress={() => router.push("/select")}
          className="w-[40%] px-4 py-3 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full"
        >
          <Ionicons name="camera" size={20} />
          <Text className="ml-2 text-gray-600 font-medium text-sm">
            {language === "english" ? "New Scan" : "Sabon Duba"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openSaveReportModal}
          disabled={checkingToken}
          className="w-[55%] px-4 py-3 flex items-center justify-center bg-green-600 border-2 border-gray-300 rounded-full"
        >
          {checkingToken ? (
            <Text className="text-white text-sm">Checking...</Text>
          ) : (
            <>
              <Ionicons name="bookmark" size={20} style={{ color: 'white' }} />
              <Text className="text-white text-sm font-medium ml-2">
                {language === "english" ? "Save Report" : "Ajiye Bincike"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Result;