import Global from '../LocalData/Global';
import { getApi2 } from './Api';

export const getDanhSachCongWithPagination = async (params = {}) => {
  const {
    page = 1,
    pageSize = 20,
    search = '',
    sortBy = 'creationTime',
    sortDirection = 'desc',
    apiEndpoint = '/api/app/thuy-loi-cong', // Mặc định là đăng ký
  } = params;

  const apiParams = {
    SkipCount: (page - 1) * pageSize,
    MaxResultCount: pageSize,
    // Sorting: `${sortBy} ${sortDirection}`,
    ...(search && {Filter: search}),

    // Thêm filter nếu có search
  };

  try {
    const res = await getApi2(`${Global.API_URL + apiEndpoint}`, apiParams);
    console.log('getDanhSachTauChayWithPagination res:', res);
    return {
      items: res.data?.items || [],
      totalCount: res.data?.totalCount || 0,
      hasMore: res.data?.items?.length === pageSize,
    };
  } catch (err) {
    console.log('getDanhSachTauChayWithPagination error:', err);
    throw err;
  }
};
