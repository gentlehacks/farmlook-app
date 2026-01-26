import { create } from 'zustand';

// 1. Define the internal structure of analysis data
interface Diagnosis {
  problemName: string;
  description: string;
  symptoms: string[];
}

export interface AnalysisData {
  analysisStatus: string;
  cropIdentified: string;
  healthAssessment: string;
  confidenceScore: number;
  primaryDiagnosis: Diagnosis;
  treatmentPlan: {
    immediateActions: string[];
    organicRemedies: Array<{ product: string; application: string }>;
    chemicalControls: Array<{ product: string; application: string }>;
  };
}

// 2. Define the Store's state and actions
interface AnalysisState {
  currentResult: AnalysisData | null;
  setAnalysisResult: (data: AnalysisData) => void;
  clearResult: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentResult: null,
  setAnalysisResult: (data) => set({ currentResult: data }),
  clearResult: () => set({ currentResult: null }),
}));
