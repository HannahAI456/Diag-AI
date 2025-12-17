import { getApi } from './Api/Api';

export const fetchData = () => async dispatch => {
  dispatch({ type: 'FETCH_DATA_REQUEST' });
  try {
    const response = await getApi('/your-api-url');
    dispatch({ type: 'FETCH_DATA_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_DATA_FAILURE', error: error.message });
  }
};