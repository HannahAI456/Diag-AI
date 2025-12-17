const Constant = {
  ACTION_GETMENU:
    '/api/app/menu-management/hierarchy-public?MenuGroup=mobile&isActive=true',
  ACTION_GUITHIETBI: '/api/app/mobileDevice',
  //Application Info
  ACTION_APPINFO: '/api/app/shared-parameter',
  ACTION_PERMISSION:
    '/api/abp/application-configuration?includeLocalizationResources=false',
  ACTION_LOGIN: '/dang-nhap-nguoi-dung',
  // ACTION_PHANANH: '/api/app/phan-anh',
  ACTION_PHANANH: '/api/app/phan-anh/nguoi-dan-danh-sach-cua-toi',
  ACTION_PHANANH_XULY: '/api/app/phan-anh',
  ACTION_PHANANH_THEODOI: '/api/app/phan-anh/don-vi',
  ACTION_DANHMUC: '/api/app/danh-muc',
  ACTION_PHANANH_CUATOI: '/api/app/phan-anh/nguoi-dan-danh-sach-mobile-cua-toi',
  ACTION_PHANANH_GUIPHANANH: '/api/app/phan-anh/nguoi-dan-gui-phan-anh',
  ACTION_PHANANH_CHITIET: '/api/app/phan-anh',
};
export default Constant;
