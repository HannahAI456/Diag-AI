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
  } = params;

  const apiParams = {
    LoaiTinTuc: loaiTinTuc,
    SkipCount: (page - 1) * pageSize,
    MaxResultCount: pageSize,
    linhVuc: linhVucId,
    duongDanChuDe: duongDanChuDe,
  };

  // Add danhSachChuDe if provided
  if (danhSachChuDe) {
    apiParams.danhSachChuDe = danhSachChuDe;
  }

  try {
    const res = await getApi2(
      Global.API_URL +
        '/api/app/tin-tuc-bai-viet/trang-ngoai/doc-danh-sach-phan-trang',
      apiParams,
    );
    return {
      items: res.data?.items || [],
      totalCount: res.data?.totalCount || 0,
      hasMore: res.data?.items?.length === pageSize,
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
