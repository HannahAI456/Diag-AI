import {getApi2} from './Api';
import Global from '../LocalData/Global';

/**
 * Service for managing news (tin tuc) APIs
 */

/**
 * Get list of news categories (chu de tin tuc) hierarchical
 * @param {Object} params - Query parameters from description field
 * @returns {Promise} API response with categories
 */
export const getTinTucChuDePhanCap = async params => {
  const {LinhVucId, LoaiTinTuc = 'tintuc', IsActive = true} = params;

  const apiParams = {
    LinhVucId,
    LoaiTinTuc,
    IsActive,
  };

  try {
    const res = await getApi2(
      Global.API_URL + '/api/app/tin-tuc-chu-de/phan-cap',
      apiParams,
    );

    if (Global.logAPI) {
      console.log('getTinTucChuDePhanCap res:', res);
    }
    console.log('getTinTucChuDePhanCap res:', res);

    return {
      items: res.data?.items || [],
      totalCount: res.data?.totalCount || 0,
    };
  } catch (err) {
    console.log('getTinTucChuDePhanCap error:', err);
    throw err;
  }
};

/**
 * Get paginated list of news articles (bai viet)
 * @param {Object} params - Pagination and filter parameters
 * @returns {Promise} API response with articles
 */
export const getTinTucBaiVietPhanTrang = async params => {
  const {
    page = 1,
    pageSize = 10,
    linhVucId,
    duongDanChuDe = '',
    loaiTinTuc = 'tintuc',
    danhSachChuDe = '',
    maxResultCount, // For direct maxResultCount parameter
    isActive, // For isActive filter
  } = params;

  // Determine which endpoint to use
  const useTheoLinhVucEndpoint =
    maxResultCount !== undefined || isActive !== undefined;

  let apiParams;
  let endpoint;

  if (useTheoLinhVucEndpoint) {
    // Use doc-danh-sach-theo-linh-vuc endpoint
    apiParams = {
      MaxResultCount: maxResultCount || pageSize,
      LoaiTinTuc: loaiTinTuc,
      IsActive: isActive !== undefined ? isActive : true,
    };
    endpoint =
      '/api/app/tin-tuc-bai-viet/trang-ngoai/doc-danh-sach-theo-linh-vuc';
  } else {
    // Use doc-danh-sach-phan-trang endpoint
    apiParams = {
      LoaiTinTuc: loaiTinTuc,
      SkipCount: (page - 1) * pageSize,
      MaxResultCount: pageSize,
      linhVuc: linhVucId,
      // duongDanChuDe: duongDanChuDe,
    };
    // Add danhSachChuDe if provided
    if (danhSachChuDe) {
      apiParams.danhSachChuDe = danhSachChuDe;
    }
    endpoint = '/api/app/tin-tuc-bai-viet/trang-ngoai/doc-danh-sach-phan-trang';
  }
  // console.log('getTinTucBaiVietPhanTrang apiParams:', apiParams);
  try {
    const res = await getApi2(Global.API_URL + endpoint, apiParams);
    // For theo-linh-vuc endpoint, it returns array directly
    const items = Array.isArray(res.data) ? res.data : res.data?.items || [];
    console.log('getTinTucBaiVietPhanTrang res:', res);
    return {
      items: items,
      totalCount: res.data?.totalCount || items.length,
      hasMore: useTheoLinhVucEndpoint ? false : items.length === pageSize,
    };
  } catch (err) {
    console.log('getTinTucBaiVietPhanTrang error:', err);
    throw err;
  }
};

export const getTinTucBaiVietPhanTrang2 = async params => {
  const {
    page = 1,
    pageSize = 10,
    linhVucId,
    duongDanChuDe = '',
    loaiTinTuc = 'tintuc',
    danhSachChuDe = '',
    maxResultCount, // For direct maxResultCount parameter
    isActive, // For isActive filter
  } = params;

  // Determine which endpoint to use
  const useTheoLinhVucEndpoint =
    maxResultCount !== undefined || isActive !== undefined;

  let apiParams;
  let endpoint;

  if (useTheoLinhVucEndpoint) {
    // Use doc-danh-sach-theo-linh-vuc endpoint
    apiParams = {
      MaxResultCount: maxResultCount || pageSize,
      LoaiTinTuc: loaiTinTuc,
      IsActive: isActive !== undefined ? isActive : true,
    };
    endpoint = '/api/app/tin-tuc-bai-viet/trang-ngoai/doc-danh-sach-phan-trang';
  } else {
    // Use doc-danh-sach-phan-trang endpoint
    apiParams = {
      LoaiTinTuc: loaiTinTuc,
      SkipCount: (page - 1) * pageSize,
      MaxResultCount: pageSize,
      linhVuc: linhVucId,
      chude: duongDanChuDe,
    };

    // Add danhSachChuDe if provided
    if (danhSachChuDe) {
      apiParams.danhSachChuDe = danhSachChuDe;
    }

    endpoint = '/api/app/tin-tuc-bai-viet/trang-ngoai/doc-danh-sach-phan-trang';
  }

  try {
    const res = await getApi2(Global.API_URL + endpoint, apiParams);
    console.log('getTinTucBaiVietPhanTrang2 res:', res);
    // For theo-linh-vuc endpoint, it returns array directly
    const items = Array.isArray(res.data) ? res.data : res.data?.items || [];

    return {
      items: items,
      totalCount: res.data?.totalCount || items.length,
      hasMore: useTheoLinhVucEndpoint ? false : items.length === pageSize,
    };
  } catch (err) {
    console.log('getTinTucBaiVietPhanTrang error:', err);
    throw err;
  }
};
/**
 * Parse description field to get query parameters
 * @param {String} description - Description field from menu
 * @returns {Object} Parsed parameters
 */
export const parseDescriptionParams = description => {
  if (!description) return {};

  const params = {};
  const pairs = description.split('&');

  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value) {
      params[key] = value;
    }
  });

  return params;
};
