import Axios from 'axios';
import Utilities from '../Common/Utilities';
import Global from '../LocalData/Global';
import {getApi, postApi, postJson} from './Api';
import Constant from './Constants';
import {jwtDecode} from 'jwt-decode';
import {decode} from 'base-64';
global.atob = decode;

function post(url, data, headers = null, params = null, responseType = null) {
  const options = buildOptions(headers, params);
  if (responseType) {
    options['responseType'] = responseType;
  }
  return Axios.post(url, data, options);
}

function buildOptions(headers, params) {
  const options = {
    headers: headers
      ? headers
      : {'Content-Type': 'application/json; charset=utf8', platform: 'web'},
  };

  if (params) {
    options.params = params;
  }

  return options;
}

function mapMenuFieldsInPlace(item) {
  if (!item || typeof item !== 'object') return item;

  item.Ten = item.name;
  item.LienKet = item.path;
  item.Ma = item.code;
  item.BieuTuong = item.image;

  if (Array.isArray(item.children) && item.children.length) {
    item.children.forEach(mapMenuFieldsInPlace);
  }
  return item;
}

export const getMenu = async () => {
  try {
    const res = await getApi(Constant.ACTION_GETMENU, {});
    const items = res.data || [];
    items.forEach(mapMenuFieldsInPlace);

    Global.menu = items;
    return Global.menu;
  } catch (err) {
    console.log('getMenu error:', err);
  }
};

export const getPermission = async () => {
  const params = {};

  try {
    const res = await getApi(Constant.ACTION_PERMISSION, params);
    return res.data;
  } catch (err) {
    throw new Error(`Failed to fetch permission: ${err.message}`);
  }
};

export const guestLogin = async (username = 'guest', password = '1q2w3E*') => {
  const Iv = Utilities.generateIV();
  try {
    const result = await post(
      Global.API_URL + '/api/TokenAuth/Authenticate',
      {
        username,
        password: Utilities.encrypt(password, Iv),
      },
      {Iv},
    );
    if (result.status === 200) {
      Global.accessToken = result.data.result.accessToken;
      let user = jwtDecode(result.data.result.accessToken);

      return {success: true, user: user, data: result.data};
    } else {
      return {success: false, error: result.data};
    }
  } catch (error) {
    return {success: false, error};
  }
};

export const getDanhSachTauChay = async () => {
  const params = {};
  try {
    const res = await getApi(Global.apiTauCa + 'api/app/tauCaDangKy', params);
    return res.data;
  } catch (err) {
    console.log(Global.apiTauCa + 'api/app/tauCaDangKy', err);
  }
};

export const loginTauCa = async () => {
  console.log('========|Tau Ca Login|=========');
  const iv = Utilities.generateIV();
  try {
    const result = await post(
      Global.apiTauCa + 'api/TokenAuth/Authenticate',
      {
        userName: 'pmnongnghiep',
        password: Utilities.encrypt('1q2w3E*', iv),
      },
      {iv},
    );
    console.log('========|Tau Ca Login|=========', result);
    if (result.status == 200) {
      Global.StaticTokenTauCa = result.data.result.accessToken;
      // StaticTokenTauCa.setToken(result.data.result.accessToken);
      // console.log(result.data.result.accessToken)
      return result.data.result.accessToken;
    }
    return null;
  } catch (error) {
    console.log('========|Tau Ca Login|=========');

    console.log(error);
    return null;
  }
};

export const getAppInfo = async () => {
  try {
    const result = await getApi('api/app/shared-parameter/by-key?key=AppInfo');
    if (result.status == 200) {
      console.log('AppInfo', JSON.parse(result.data?.value));
      Global.appInfo = JSON.parse(JSON.parse(result.data?.value));
      return;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getProvince = async () => {
  try {
    const result = await getApi(
      'api/app/geo-commune/commune-in-province?isActive=true',
    );
    if (result.status == 200) {
      Global.province = result.data;
      return;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateMyProfile = async (profileData) => {
  try {
    const result = await Axios.put(
      Global.API_URL + '/api/account/my-profile',
      profileData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Global.accessToken}`,
        },
      },
    );
    if (result.status === 200) {
      return {success: true, data: result.data};
    } else {
      return {success: false, error: result.data};
    }
  } catch (error) {
    console.log('updateMyProfile error:', error);
    return {success: false, error: error.message};
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  const iv = Utilities.generateIV();
  try {
    const result = await Axios.post(
      Global.API_URL + '/api/account/my-profile/change-password',
      {
        currentPassword: Utilities.encrypt(currentPassword, iv),
        newPassword: Utilities.encrypt(newPassword, iv),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Global.accessToken}`,
          Iv: iv,
        },
      },
    );
    if (result.status === 200) {
      return {success: true, data: result.data};
    } else {
      return {success: false, error: result.data};
    }
  } catch (error) {
    console.log('changePassword error:', error);
    return {success: false, error: error.response?.data || error.message};
  }
};
