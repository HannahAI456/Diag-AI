import React from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_STORAGE_KEY = '@skincheck_history';

export const useHistory = () => {
  const [history, setHistory] = React.useState([]);

  // Load history on mount
  React.useEffect(() => {
    loadHistory();
  }, []);

  // Load history from storage
  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  // Save history to storage
  const saveHistory = async newHistory => {
    try {
      await AsyncStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(newHistory),
      );
      setHistory(newHistory);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  // Add to history
  const addToHistory = async (imageData, result) => {
    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      image: imageData,
      result: result,
    };
    const newHistory = [historyItem, ...history];
    await saveHistory(newHistory);
  };

  // Clear all history
  const clearHistory = () => {
    Alert.alert('Xóa lịch sử', 'Bạn có chắc chắn muốn xóa toàn bộ lịch sử?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await saveHistory([]);
          Alert.alert('Thành công', 'Đã xóa toàn bộ lịch sử');
        },
      },
    ]);
  };

  // Delete single history item
  const deleteHistoryItem = id => {
    Alert.alert('Xóa mục này', 'Bạn có chắc chắn muốn xóa mục này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          const newHistory = history.filter(item => item.id !== id);
          await saveHistory(newHistory);
        },
      },
    ]);
  };

  return {
    history,
    addToHistory,
    clearHistory,
    deleteHistoryItem,
  };
};
