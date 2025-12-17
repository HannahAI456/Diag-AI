import {atom, atomFamily} from 'recoil';

/**
 * Atom family để cache articles theo key (linhVucId + topicId)
 * Key format: "linhVucId-topicId" hoặc "linhVucId-all" cho tab Tất cả
 */
export const tinTucArticlesState = atomFamily({
  key: 'tinTucArticlesState',
  default: {
    items: [],
    totalCount: 0,
    page: 1,
    hasMore: true,
    lastUpdated: null,
  },
});

/**
 * Atom family để cache categories theo linhVucId
 */
export const tinTucCategoriesState = atomFamily({
  key: 'tinTucCategoriesState',
  default: {
    items: [],
    lastUpdated: null,
  },
});
