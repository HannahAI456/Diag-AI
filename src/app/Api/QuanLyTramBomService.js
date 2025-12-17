import {getApi} from './Api';

export const getDanhSachTramBomWithPagination = async ({
  page = 1,
  pageSize = 20,
  search = '',
}) => {
  try {
    const skipCount = (page - 1) * pageSize;
    let url = `/api/app/thuy-loi-tram-bom?SkipCount=${skipCount}&MaxResultCount=${pageSize}`;

    if (search && search.trim() !== '') {
      url += `&Filter=${encodeURIComponent(search.trim())}`;
    }

    const response = await getApi(url);

    if (response && response.data) {
      const {items = [], totalCount = 0} = response.data;
      return {
        items,
        totalCount,
        hasMore: skipCount + items.length < totalCount,
      };
    }

    return {items: [], totalCount: 0, hasMore: false};
  } catch (error) {
    console.error('Error fetching tram bom list:', error);
    throw error;
  }
};
