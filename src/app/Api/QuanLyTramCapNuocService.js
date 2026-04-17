import Global from '../LocalData/Global';
import {getApi2} from './Api';

export const getDanhSachTramCapNuocWithPagination = async (params = {}) => {
  const {
    page = 1,
    pageSize = 20,
    search = '',
    sortBy = 'creationTime',
    sortDirection = 'desc',
    apiEndpoint = '/api/app/thuy-loi-tram-cap-nuoc',
  } = params;

  const apiParams = {
    SkipCount: (page - 1) * pageSize,
    MaxResultCount: pageSize,
    ...(search && {Filter: search}),
  };

  try {
    const res = await getApi2(`${Global.API_URL + apiEndpoint}`, apiParams);
    console.log('getDanhSachKeWithPagination res:', res);
    return {
      items: res.data?.items || [],
      totalCount: res.data?.totalCount || 0,
      hasMore: res.data?.items?.length === pageSize,
    };
  } catch (err) {
    console.log('getDanhSachKeWithPagination error:', err);
    throw err;
  }
};
