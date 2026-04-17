import {atom} from 'recoil';

// State lưu thông tin đăng nhập
export const authState = atom({
  key: 'authState',
  default: {
    isLoggedIn: false, // true nếu đã login (không phải guest)
    user: null, // thông tin user từ JWT
    accessToken: null,
  },
});

// State lưu menu
export const menuState = atom({
  key: 'menuState',
  default: [],
});
