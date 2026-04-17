import React, { createContext, useContext, useState } from 'react';

const GlobalModalContext = createContext();

export const useGlobalModal = () => useContext(GlobalModalContext);

export const GlobalModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const showModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  return (
    <GlobalModalContext.Provider value={{ modalVisible, modalContent, showModal, hideModal }}>
      {children}
    </GlobalModalContext.Provider>
  );
};
