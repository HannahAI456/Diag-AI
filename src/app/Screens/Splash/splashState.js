import { atom } from 'recoil';

export const splashDataState = atom({
  key: 'splashDataState',
  default: {
    loading: false,
    data: null,
    error: null,
  },
});
