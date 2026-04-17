import {Dimensions, Platform, PermissionsAndroid} from 'react-native';
import CryptoJS from 'react-native-crypto-js';
import RNFS from 'react-native-fs';
// import Axios from 'axios';
import FileViewer from 'react-native-file-viewer';
import DeviceInfo from 'react-native-device-info';
import Global from '../LocalData/Global';
import cryptoJS from 'crypto-js';
// import {jwtDecode} from 'jwt-decode';
// import {decode as atob} from 'base-64';
// import base64String from 'react-native-base64';

export default class Utilities {
  static writeLog(fileName, methodName, error) {}

  static isIphoneXorAbove() {
    const dimen = Dimensions.get('window');
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (dimen.height === 812 ||
        dimen.width === 812 ||
        dimen.height === 896 ||
        dimen.width === 896)
    );
  }

  static generateIV = () =>
    (
      Math.random().toString(36).substring(2) +
      Math.random().toString(36).substring(2)
    ).substring(0, 16);

  static xoa_dau(str) {
    if (str == '' || str == null) return str;
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    return str;
  }

  static isEmpty(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  static encrypt(messageText, idNhomTraoDoi) {
    if (messageText == '') return '';
    return CryptoJS.AES.encrypt(
      messageText,
      idNhomTraoDoi + Global.key_private,
    ).toString();
  }

  // static encryptv2(password, iv) {
  //   return CryptoJS.AES.encrypt(password, CryptoJS.enc.Utf8.parse(Global.AES_KEY), {
  //     iv: CryptoJS.enc.Utf8.parse(iv),
  //   }).toString()
  // }
  static decrypt(messageEncrypt, idNhomTraoDoi) {
    try {
      if (messageEncrypt == '' || messageEncrypt == null) return '';
      if (
        messageEncrypt != '' &&
        messageEncrypt.search(Global.param_private) != -1
      ) {
        messageEncrypt = messageEncrypt.slice(5);
        let bytes = CryptoJS.AES.decrypt(
          messageEncrypt,
          idNhomTraoDoi + Global.key_private,
        );
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
      } else return messageEncrypt;
    } catch (error) {
      console.log('==============error======================');
      console.log(error);
      console.log('====================================');
      return '';
    }
  }

  static getImageFromExtensionFile(fileName) {
    try {
      var arr = fileName.toLowerCase().split('.');
      switch (arr[1]) {
        case 'pdf':
          return require('../Resource/Images/Mail/pdf.png');
        case 'xlsx':
        case 'xls':
          return require('../Resource/Images/Mail/excel.png');
        case 'doc':
        case 'docx':
          return require('../Resource/Images/Mail/word.png');
        case 'jpg':
        case 'png':
        case 'jpeg':
          return require('../Resource/Images/Mail/image.png');
        case 'mp4':
        case 'mov':
        case '3gp':
          return require('../Resource/Images/Mail/video.png');
        default:
          return require('../Resource/Images/Mail/attach.png');
      }
    } catch (error) {
      return '';
    }
  }

  static getIpPublic = async endpoint => {
    try {
      const response = await fetch(endpoint || 'https://api.ipify.org');
      const ip = response.text();
      return ip;
    } catch (e) {
      throw 'Unable to get IP address.';
    }
  };

  static xuLyLayChuCaiDau(value) {
    if (value != '' && value != null) {
      let arrTen = value.trim().split(' ');
      return arrTen.length > 0
        ? arrTen[arrTen.length - 1].substring(0, 1).normalize().toUpperCase()
        : '';
    }
  }

  static xuLyLayTen(value) {
    if (value == null || value == '') return '';
    let arrTen = value.trim().split(' ');
    return arrTen.length > 0 ? arrTen[arrTen.length - 1] : '';
  }

  static xuLyLayTenTapTin(value) {
    if (value == null || value == '') return '';
    let arrTen = value.trim().split('/');
    return arrTen.length > 0 ? arrTen[arrTen.length - 1] : '';
  }

  static getExtension = filename => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  static getExtFile(name) {
    if (name == '' || name == null) return '';
    var arr = name.split('.');
    return arr.length >= 2 ? '.' + arr[arr.length - 1] : '';
  }

  static xuLyLayDuoiTapTin = value => {
    if (value == null || value == '') return '';
    let arrTen = value.trim().split('.');
    return arrTen.length > 0 ? arrTen[arrTen.length - 1] : '';
  };

  static async hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  static getImageAttachment(uri_attachment, filename_attachment, callback) {
    const PictureDir =
      Platform.OS == 'android'
        ? RNFS.ExternalStorageDirectoryPath
        : RNFS.LibraryDirectoryPath;
    return new Promise((RESOLVE, REJECT) => {
      // Fetch attachment
      RNFetchBlob.fetch('GET', uri_attachment)
        .then(async response => {
          let base64Str = response.data;
          let imageLocation = PictureDir + '/' + filename_attachment;
          //Save image
          if (
            Platform.OS === 'android' &&
            !(await this.hasAndroidPermission())
          ) {
            return;
          }
          RNFS.writeFile(imageLocation, base64Str, 'base64')
            .then(res => {
              console.log('success:', res);
              // if (Platform.OS == 'ios') {
              CameraRoll.saveToCameraRoll(imageLocation).then(res => {
                console.log(res);
                if (res != null) {
                  callback();
                  // this.refs.ThongBao.show('Lưu hình ảnh thành công!');
                }
              });
              // }
            })
            .catch(err => console.log('fail:', err));
          console.log('FILE CREATED!!');
        })
        .catch(error => {
          // error handling
          console.log('Error:', error);
        });
    });
  }

  static async sendMessageErrorLog(message) {
    var token = '';
    var chat_id = '';
    ma = 'TramTruyenThanh';
    switch (ma) {
      case 'HauGiangApp':
        token = '1415393776:AAFrYmSo8MoMMOPmp0J2RDzrC2BSTw0b0A4';
        chat_id = '-324786675';
        break;
      case 'CaMauAgri':
        token = '1419566899:AAHfkfLY2zqohqmlpZadjzmLEahtK0pRldw';
        chat_id = '-1001460605775';
        break;
      case 'CaMauG':
        token = '1499445309:AAHgNVFeZofQeaBHLuRpLLxSMDm0eH5J19M';
        chat_id = '-386115740';
        break;
      case 'TramTruyenThanh':
        token = '1449879363:AAHU6e9RyNg2unPL8afv8ZKkfCmucR0wuro';
        chat_id = '-491839053';
        break;
      case 'CongChungCaMau':
        token = '1418676665:AAGZnktKV6Ovz9QtYzTAQmHYMA0ZbKMJvjQ';
        chat_id = '';
        break;

      default:
        break;
    }

    // !Global.PRODUCTION && console.log('ERROR============>', message);
    // if (Global.PRODUCTION) {
    //   var deviceName = await DeviceInfo.getDeviceName();
    //   var axios = Axios.create();
    //   return axios({
    //     method: 'get',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     url: `https://api.telegram.org/bot${token}/sendMessage`,
    //     params: {
    //       chat_id: chat_id,
    //       text: `[AppTramTruyenThanh-${Platform.OS}]
    //                         ${Global.url}
    //                         ${DeviceInfo.getVersion()}
    //                         DeviceId: ${DeviceInfo.getUniqueId()}
    //                         Tên thiết bị: ${deviceName}
    //                         System: ${
    //                           Platform.OS + ' ' + DeviceInfo.getSystemVersion()
    //                         }
    //                         DeviceId: ${DeviceInfo.getUniqueId()}
    //                         Người dùng: ${
    //                           // StaticData._currentUser != null
    //                           //   ? StaticData._currentUser.Ten + ' ' + StaticData._currentUser.Id
    //                           //   : ''
    //                           ''
    //                         }
    //                         ---***---
    //                         > ${message}`,
    //     },
    //   })
    //     .then(res => {})
    //     .catch(err => {});
    // }
  }

  static encrypt(password, iv) {
    return cryptoJS.AES.encrypt(
      password,
      cryptoJS.enc.Utf8.parse(Global.AES_KEY),
      {
        iv: cryptoJS.enc.Utf8.parse(iv),
      },
    ).toString();
  }

  static uploadFile = (file, params, uploadProgress, progress) => {
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
          ...params,
        },
      };
      const realPath =
        Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
      RNFetchBlob.fetch(
        'POST',
        // 'http://192.168.2.40:3003/api/upload/file',
        Global.url + '/api/UploadFile/PostFormData',
        // 'http://192.168.2.40:8082/api/upload/avatar',
        config.headers,
        [
          {
            name: 'file',
            filename: file.name,
            // Change BASE64 encoded data to a file path with prefix `RNFetchBlob-file://`.
            // Or simply wrap the file path with RNFetchBlob.wrap().
            // data: RNFetchBlob.wrap(realPath),
            data: RNFetchBlob.wrap(decodeURIComponent(realPath)),
            // input: RNFetchBlob.wrap(realPath)
          },
        ],
      )
        // listen to upload progress event
        .uploadProgress((written, total) => {
          // console.log('uploaded', written / total)
          uploadProgress(written / total);
        })
        // listen to download progress event
        .progress((received, total) => {
          // console.log('progress', received / total)
          progress(received / total);
        })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          console.log('====================================');
          console.log(err);
          console.log('====================================');
          reject(err);
        });
    });
  };

  static uploadMultipleFile = (files, params, uploadProgress, progress) => {
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
          ...params,
        },
      };
      RNFetchBlob.fetch(
        'POST',
        // 'http://192.168.2.40:3003/api/upload/file',
        Global.url + '/api/UploadFile/PostFormDataMultiFile',
        // 'http://192.168.2.40:8082/api/upload/avatar',
        config.headers,
        files,
      )
        // listen to upload progress event
        .uploadProgress((written, total) => {
          console.log('uploaded', written / total);
          uploadProgress(written / total);
        })
        // listen to download progress event
        .progress((received, total) => {
          console.log('progress', received / total);
          progress(received / total);
        })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          console.log('====================================');
          console.log(err);
          console.log('====================================');
          reject(err);
        });
    });
  };
  static uploadMultipleFileByKey = (
    files,
    params,
    uploadProgress,
    progress,
  ) => {
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
          ...params,
        },
      };
      RNFetchBlob.fetch(
        'POST',
        // 'http://192.168.2.40:3003/api/upload/file',
        Global.url + '/api/UploadFile/PostFormDataMultiFileByKey',
        // 'http://192.168.2.40:8082/api/upload/avatar',
        config.headers,
        files,
      )
        // listen to upload progress event
        .uploadProgress((written, total) => {
          console.log('uploaded', written / total);
          uploadProgress(written / total);
        })
        // listen to download progress event
        .progress((received, total) => {
          console.log('progress', received / total);
          progress(received / total);
        })
        .then(res => {
          console.log('=================res===================');
          console.log(res);
          console.log('====================================');
          resolve(res);
        })
        .catch(err => {
          console.log('===================err=================');
          console.log(err);
          console.log('====================================');
          reject(err);
        });
    });
  };

  static getDefautlImage(src = require('../../asset/Image/img1.jpg')) {
    return src;
  }

  static openFile = async (item, cb) => {
    try {
      var tenFile = item.DuongDan.split('/');
      const localFile = `${RNFS.DocumentDirectoryPath}/${
        tenFile[tenFile.length - 1]
      }`;
      const options = {
        fromUrl: Global.WebviewUrl + item.DuongDan,
        toFile: localFile,
      };
      let pathExist = await RNFS.exists(localFile);
      console.log('pathExist', pathExist);

      if (pathExist) {
        FileViewer.open(localFile, {
          showOpenWithDialog: true,
          displayName: item.Ten.slice(14),
        });
        cb(true);
      } else {
        RNFS.downloadFile(options)
          .promise.then(() => {
            cb(true);
            FileViewer.open(localFile, {
              showOpenWithDialog: true,
              displayName: item.Ten.slice(14),
            });
          })
          .then(() => {
            cb(true);
          })
          .catch(error => {
            cb(true);
          });
      }
    } catch (error) {
      cb(true);
    }
  };

  static hienThiHaiChuSo(value) {
    if (value <= 9) {
      return '0' + value;
    }
    return value;
  }

  static getDeviceUniqueId() {
    return DeviceInfo.getUniqueId() || '';
  }
  static convertPhoneNumber(text) {
    return text == null
      ? ''
      : text.replace(/(\d\d\d\d)(\d\d\d)(\d\d\d)/, '$1 $2 $3');
  }
  static convertSecondToFormat(secs) {
    function pad(num) {
      return ('0' + num).slice(-2);
    }

    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return pad(hours) + ':' + pad(minutes);
  }

  static formatDateTime(isoString) {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }
  static formatDateTimeNoTime(isoString) {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  static getParamFromQuery(qs, key) {
    if (typeof qs !== 'string' || qs.length === 0) return null;
    const qMark = qs.indexOf('?');
    if (qMark >= 0) qs = qs.slice(qMark + 1);
    const hash = qs.indexOf('#');
    if (hash >= 0) qs = qs.slice(0, hash);
    if (!qs) return null;
    const pairs = qs.split('&');
    for (let i = 0; i < pairs.length; i++) {
      const part = pairs[i];
      if (!part) continue;
      const eq = part.indexOf('=');
      let k = eq === -1 ? part : part.slice(0, eq);
      let v = eq === -1 ? '' : part.slice(eq + 1);
      k = k.replace(/\+/g, ' ');
      v = v.replace(/\+/g, ' ');
      try {
        k = decodeURIComponent(k);
      } catch {}
      try {
        v = decodeURIComponent(v);
      } catch {}

      if (k === key) return v;
    }
    return null;
  }
  static getYoutubeVideoId = input => {
    if (!input) return null;

    const str = String(input).trim();
    const ID_RE = /^[a-zA-Z0-9_-]{11}$/;
    if (ID_RE.test(str)) return str;

    const getParam = (url, key) => {
      const q = (url.split('?')[1] || '').split('#')[0];
      for (const seg of q.split('&')) {
        const [k, v = ''] = seg.split('=');
        if (k === key) return decodeURIComponent(v.replace(/\+/g, ' '));
      }
      return null;
    };

    let m = str.match(
      /(?:^|https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:[/?#&]|$)/,
    );
    if (m) return m[1];

    if (/youtube\.com\/watch/.test(str)) {
      const v = getParam(str, 'v');
      if (ID_RE.test(v)) return v;
    }

    m = str.match(
      /(?:^|https?:\/\/)?(?:[\w-]+\.)?youtube\.com\/(?:embed|v|shorts|live)\/([a-zA-Z0-9_-]{11})(?:[/?#&]|$)/,
    );
    if (m) return m[1];

    const v2 = getParam(str, 'v');
    if (ID_RE.test(v2)) return v2;

    m = str.match(/([a-zA-Z0-9_-]{11})(?![a-zA-Z0-9_-])/);
    return ID_RE.test(m?.[1]) ? m[1] : null;
  };

  static maskPhone(phone) {
    const last4 = phone.slice(-4);
    const masked = '*'.repeat(phone.length - 4) + last4;
    return masked;
  }

  static formatTimestamp = timestamp => {
    const date = new Date(timestamp * 1000);
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  // static DecodeToken(token) {
  //   if (!token || typeof token !== 'string') {
  //     console.log('Invalid token: Token is undefined or not a string');
  //     return null; // Hoặc throw new Error('Invalid token');
  //   }

  //   try {
  //     let base64String = token.split('.')[1];
  //     if (!base64String) {
  //       console.log('Invalid token: No payload found');
  //       return null; // Hoặc throw new Error('Invalid token format');
  //     }

  //     var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  //     var base64 = (base64String + padding)
  //       .replace(/-/g, '+')
  //       .replace(/_/g, '/');
  //     var rawData = atob(base64);
  //     return decodeURIComponent(escape(rawData));
  //   } catch (error) {
  //     console.log('Error decoding token:', error);
  //     return null; // Hoặc throw error tùy theo yêu cầu
  //   }
  // }
}
