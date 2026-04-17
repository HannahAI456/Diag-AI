import {useState} from 'react';
import Axios from 'axios';
import Global from '../LocalData/Global';

/**
 * Custom hook để upload file lên server
 * @returns {object} - {uploadFile, uploading, error}
 */
const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Upload một file lên server
   * @param {object} file - File object with uri, name, type
   * @param {string} folder - Folder name to upload to
   * @returns {Promise<object>} - Uploaded file info
   */
  const uploadFile = async (file, folder = 'tong-hop') => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });

      const token = Global.accessToken;
      const baseUrl = Global.API_URL;
      const url = `${baseUrl}/api/app/file-upload/UploadSingle?folder=${folder}`;

      const response = await Axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setUploading(false);
      return response.data;
    } catch (err) {
      setUploading(false);
      const errorMessage =
        err?.response?.data?.message || err.message || 'Upload thất bại';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Upload nhiều file lên server
   * @param {Array<object>} files - Array of file objects
   * @param {string} folder - Folder name to upload to
   * @returns {Promise<Array<object>>} - Array of uploaded file info
   */
  const uploadMultipleFiles = async (files, folder = 'tong-hop') => {
    try {
      setUploading(true);
      setError(null);

      const uploadPromises = files.map(file => uploadFile(file, folder));
      const results = await Promise.all(uploadPromises);

      setUploading(false);
      return results;
    } catch (err) {
      setUploading(false);
      const errorMessage =
        err?.response?.data?.message || err.message || 'Upload thất bại';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    uploading,
    error,
  };
};

export default useFileUpload;
