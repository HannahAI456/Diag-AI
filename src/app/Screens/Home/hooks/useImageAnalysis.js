import React from 'react';
import {Alert} from 'react-native';
import diseaseTranslations from '../diseaseTranslations.json';

const API_URL = 'http://diagai.csctech.vn/api/inference';

export const useImageAnalysis = () => {
  const [analyzing, setAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState(null);

  const analyzeImage = async (imageData, onSuccess, language = 'vi') => {
    if (!imageData) return;

    setAnalyzing(true);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('image', {
        uri: imageData.uri,
        type: imageData.type || 'image/jpeg',
        name: imageData.fileName || 'image.jpg',
      });

      // Call API
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      if (data.result && data.result.success && data.result.predictions) {
        // Get top prediction
        const topPrediction = data.result.predictions[0];
        const topDiseaseLabel = topPrediction.label;
        const topConfidence = Math.round(topPrediction.confidence * 100);

        console.log('Top disease label:', topDiseaseLabel);
        console.log('Language:', language);
        console.log('Translation:', diseaseTranslations[topDiseaseLabel]);

        // Get translation for top disease name
        const topTranslatedName = diseaseTranslations[topDiseaseLabel]?.[language] || topDiseaseLabel;
        console.log('Translated name:', topTranslatedName);

        // Translate all predictions
        const translatedPredictions = data.result.predictions.map(pred => {
          const translated = diseaseTranslations[pred.label]?.[language] || pred.label;
          console.log(`Translating ${pred.label} to ${translated}`);
          return {
            label: translated,
            originalLabel: pred.label,
            confidence: Math.round(pred.confidence * 100),
          };
        });

        const result = {
          diagnosis: topTranslatedName,
          originalDiagnosis: topDiseaseLabel, // Store original label for re-translation
          confidence: topConfidence,
          predictions: translatedPredictions, // All predictions with translations
          originalPredictions: data.result.predictions, // Store original for re-translation
        };

        setAnalysisResult(result);
        
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = language === 'vi' 
        ? 'Không thể phân tích hình ảnh. Vui lòng thử lại.'
        : 'Unable to analyze image. Please try again.';
      Alert.alert(language === 'vi' ? 'Lỗi' : 'Error', errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
  };

  return {
    analyzing,
    analysisResult,
    analyzeImage,
    resetAnalysis,
  };
};
