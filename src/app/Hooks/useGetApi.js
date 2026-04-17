import {useState, useEffect, useCallback, useRef} from 'react';
import Axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import Global from '../LocalData/Global';
import {showToast} from '../Components/ToastConfig';

const useGetApi = (
  url,
  params = {},
  authen = true,
  autoFetch = true,
  useBaseUrl = true,
  recoilStateSetter = null,
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paramsRef = useRef(params);
  const abortRef = useRef(null);
  const mountedRef = useRef(false);
  const isFetchingRef = useRef(false);

  // update params when props change
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  // cleanup when unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // --------------------------------------------------------------------------------
  //  FETCH API (stable, NO dependencies => không bị recreate => không spam API)
  // --------------------------------------------------------------------------------
  const fetchData = useCallback(async (customParams = null) => {
    if (!url) {
      setError('URL is required');
      return;
    }

    if (isFetchingRef.current) return; // prevent multiple calls
    isFetchingRef.current = true;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const finalUrl = useBaseUrl ? Global.API_URL + url : url;
      const finalParams =
        customParams !== null ? customParams : paramsRef.current;

      const headers = {};
      if (authen && Global.accessToken) {
        headers.Authorization = `Bearer ${Global.accessToken}`;
      }

      const res = await Axios.get(finalUrl, {
        params: finalParams,
        headers,
        signal: controller.signal,
      });

      if (!mountedRef.current) return;

      setData(res.data);
      console.log('useGetApi Success:', {url: finalUrl, params: finalParams});
      recoilStateSetter?.(res.data);

      return res.data;
    } catch (err) {
      if (Axios.isCancel(err)) return; // ignore cancel
      if (!mountedRef.current) return;

      const msg = err.response?.data?.message || err.message || 'Unknown error';
      setError(msg);

      showToast('error', 'Đã có lỗi xảy ra, vui lòng thử lại sau.');

      if (Global.logAPI) {
        console.log('useGetApi Error:', {
          url,
          error: msg,
          status: err.response?.status,
        });
      }

      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, []); // ⭐ MUST: luôn rỗng → fetchData không bao giờ bị recreate

  // --------------------------------------------------------------------------------
  // FETCH LẦN ĐẦU (mount)
  // --------------------------------------------------------------------------------
  useEffect(() => {
    if (autoFetch) fetchData().catch(() => {});
  }, [autoFetch]);

  // --------------------------------------------------------------------------------
  // FETCH KHI FOCUS LẠI
  // --------------------------------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      if (autoFetch) fetchData().catch(() => {});
    }, [autoFetch]),
  );

  // --------------------------------------------------------------------------------
  // MANUAL REFETCH
  // --------------------------------------------------------------------------------
  const refetch = useCallback(
    (customParams = null) => {
      return fetchData(customParams);
    },
    [fetchData],
  );

  return {data, loading, error, refetch};
};

export default useGetApi;
