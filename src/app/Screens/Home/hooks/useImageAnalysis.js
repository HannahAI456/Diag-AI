import React from 'react';
import {Alert} from 'react-native';

export const useImageAnalysis = () => {
  const [analyzing, setAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState(null);

  const analyzeImage = async (imageData, onSuccess, language = 'vi') => {
    if (!imageData) return;

    setAnalyzing(true);

    try {
      // TODO: Tích hợp API phân tích hình ảnh thật ở đây
      // const formData = new FormData();
      // formData.append('image', {
      //   uri: imageData.uri,
      //   type: imageData.type,
      //   name: imageData.name,
      // });
      // formData.append('language', language);
      // const response = await axios.post('YOUR_API_URL', formData);

      // Giả lập phân tích (xóa sau khi có API thật)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock data theo ngôn ngữ
      const mockResult = language === 'vi' ? {
        diagnosis: 'Viêm da tiếp xúc',
        confidence: 85,
        description:
          'Có dấu hiệu viêm da tiếp xúc nhẹ. Khuyến nghị gặp bác sĩ da liễu để được tư vấn cụ thể.',
        recommendations: [
          'Tránh tiếp xúc với các chất gây kích ứng',
          'Giữ da sạch và khô ráo',
          'Sử dụng kem dưỡng ẩm phù hợp',
          'Gặp bác sĩ nếu triệu chứng không cải thiện',
        ],
      } : {
        diagnosis: 'Contact Dermatitis',
        confidence: 85,
        description:
          'Signs of mild contact dermatitis detected. It is recommended to consult a dermatologist for specific advice.',
        recommendations: [
          'Avoid contact with irritants',
          'Keep skin clean and dry',
          'Use appropriate moisturizer',
          'See a doctor if symptoms do not improve',
        ],
      };

      setAnalysisResult(mockResult);
      
      if (onSuccess) {
        onSuccess(mockResult);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Lỗi', 'Không thể phân tích hình ảnh. Vui lòng thử lại.');
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
