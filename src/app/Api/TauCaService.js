import {getApi2} from './Api';
import Global from '../LocalData/Global';


/* 
  HƯỚNG DẪN SỬ DỤNG PAGINATION:
  
  Backend thường sử dụng 2 format:
  1. PascalCase: SkipCount, MaxResultCount, Sorting, Filter
  2. camelCase: skipCount, maxResultCount, sorting, filter
  
  Hiện tại đang sử dụng PascalCase (format 1)
  Nếu API không hoạt động, hãy thử đổi sang camelCase bằng cách:
  - Thay getDanhSachTauChayWithPagination bằng getDanhSachTauChayWithPaginationCamelCase
  - Hoặc cập nhật apiParams trong hàm chính
*/

// API gốc như bạn cung cấp
export const getDanhSachTauChay = async () => {
  const params = {};
  try {
    const res = await getApi2(
      Global.apiTauCa + 'api/app/tauCaDangKy',
      params,
    );
    return res.data;
  } catch (err) {
    console.log(Global.apiTauCa + 'api/app/tauCaDangKy', err);
    throw err;
  }
};

// API mở rộng với pagination và search
export const getDanhSachTauChayWithPagination = async (params = {}) => {
  const {
    page = 1,
    pageSize = 20,
    search = '',
    sortBy = 'creationTime',
    sortDirection = 'desc',
    apiEndpoint = 'api/app/tauCaDangKy', // Mặc định là đăng ký
  } = params;

  const apiParams = {
    SkipCount: (page - 1) * pageSize,
    MaxResultCount: pageSize,
    CongSuatCVTu: 0,
    CongSuatCVDen: 0,
    CongSuatKWTu: 0,
    CongSuatKWDen: 0,
    ChieuDaiTu: 0,
    ChieuDaiDen: 0,
    IsDeleted: false,
    // Sorting: `${sortBy} ${sortDirection}`,
    ...(search && {Filter: search}),

    // Thêm filter nếu có search
  };

  try {
    const res = await getApi2(`${Global.apiTauCa}${apiEndpoint}`, apiParams);
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

// API tìm kiếm theo tên tàu, chủ tàu
export const searchTauCa = async (searchText, page = 1, pageSize = 20) => {
  return await getDanhSachTauChayWithPagination({
    page,
    pageSize,
    search: searchText,
  });
};

// Alternative API function nếu backend sử dụng camelCase
export const getDanhSachTauChayWithPaginationCamelCase = async (
  params = {},
) => {
  const {
    page = 1,
    pageSize = 20,
    search = '',
    sortBy = 'creationTime',
    sortDirection = 'desc',
  } = params;

  const apiParams = {
    skipCount: (page - 1) * pageSize,
    maxResultCount: pageSize,
    sorting: `${sortBy} ${sortDirection}`,
    ...(search && {filter: search}),
  };

  try {
    const res = await getApi2(
      Global.apiTauCa + 'api/app/tauCaDangKy',
      apiParams,
    );

    return {
      items: res.data?.items || [],
      totalCount: res.data?.totalCount || 0,
      hasMore: res.data?.items?.length === pageSize,
    };
  } catch (err) {
    console.log('getDanhSachTauChayWithPaginationCamelCase error:', err);
    throw err;
  }
};

// API lấy chi tiết tàu cá
export const getTauCaDetail = async id => {
  try {
    const res = await getApi2(
      `${Global.apiTauCa}api/app/tauCaDangKy/${id}`,
      {},
    );

    if (Global.logAPI) {
      console.log('getTauCaDetail res:', res);
    }

    return res.data;
  } catch (err) {
    console.log('getTauCaDetail error:', err);
    throw err;
  }
};
