import Axios from 'axios';
import Global from '../LocalData/Global';

export function getApi(url, params = {}, authen = true) {
  return Axios.get(Global.API_URL + url, {
    params: params,
    headers: {
      Authorization: authen ? `Bearer ${Global.accessToken}` : '',
    },
  });
}

export function getApi2(url, params = {}, authen = true) {
  return Axios.get(url, {
    params: params,
    headers: {
      Authorization: authen ? `Bearer ${Global.accessToken}` : '',
    },
  });
}

export function getApiWithAccessToken(url, params = {}, accessToken) {
  return Axios.get(url, {
    params: params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function postApi(url, form, authen = true) {
  return Axios.post(Global.API_URL + url, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: authen ? `Bearer ${Global.accessToken}` : '',
    },
  });
}

export function postJson(url, json, authen = true) {
  return Axios.post(Global.API_URL + url, json, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authen ? `Bearer ${Global.accessToken}` : '',
    },
  });
}
export function getApiById(url, id, authen = true) {
  return Axios.get(Global.API_URL + url + '/' + id, {
    headers: {
      Authorization: authen ? `Bearer ${Global.accessToken}` : '',
    },
  });
}

export function DeleteById(url, id, authen = true) {
  return Axios.delete(Global.API_URL + url + '/' + id, {
    headers: {
      Authorization: authen ? `Bearer ${Global.accessToken}` : '',
    },
  });
}

export function EditById(url, id, form, authen = true) {
  return Axios.put(Global.API_URL + url + '/' + id, form, {
    headers: {
      Authorization: authen ? `Bearer ${Global.accessToken}` : '',
    },
  });
}

export function delList(url, id, authen = true) {
  return Axios.delete(Global.API_URL + url + '/' + id, {
    headers: {
      Authorization: authen ? `Bearer ${Global.accessToken}` : '',
    },
  });
}

export function putJson(url, params, authen = true) {
  return Axios.put(Global.API_URL + url, params, {
    headers: {
      Accept: 'application/json',
      Authorization: authen ? `Bearer ${Global.accessToken}` : '',
    },
  });
}

export function putApi(url, form, authen = true) {
  return Axios.put(Global.API_URL + url, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: authen ? `Bearer ${Global.accessToken}` : '',
    },
  });
}

export function postApiById(url, id, authen = true) {
  return Axios.post(Global.API_URL + url + '/' + id, {
    headers: {
      Authorization: authen ? `Bearer ${Global.accessToken}` : '',
    },
  });
}
