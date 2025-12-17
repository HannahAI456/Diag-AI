import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Dimensions,
  ScrollView,
  Animated,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {WebView} from 'react-native-webview';
import {RootNavigation} from '../../Common/RootNavigation';
import {AppColors} from '../../Common/AppColor';
import Utilities from '../../Common/Utilities';
import Global from '../../LocalData/Global';
import Axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {decode} from 'base-64';
import {showToast} from '../../Components/ToastConfig';
import {getMenu, getPermission, getAppInfo} from '../../Api/Actions';
import {useRecoilState} from 'recoil';
import {authState, menuState} from '../../Common/authAtom';
import {saveAuthToStorage} from '../../Common/authStorage';

global.atob = decode;

const {width, height} = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSSOWebView, setShowSSOWebView] = useState(false);

  // Recoil states
  const [auth, setAuth] = useRecoilState(authState);
  const [menu, setMenu] = useRecoilState(menuState);

  // Animation valueslog
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Generate IV for encryption
      const Iv = Utilities.generateIV();

      // Call login API
      const result = await Axios.post(
        Global.API_URL + '/api/TokenAuth/Authenticate',
        {
          username: email.trim(),
          password: Utilities.encrypt(password, Iv),
        },
        {
          headers: {
            Iv: Iv,
            'Content-Type': 'application/json',
          },
        },
      );

      if (result.status === 200 && result.data.result) {
        // Save access token
        Global.accessToken = result.data.result.accessToken;

        // Decode JWT token to get user info
        const user = jwtDecode(result.data.result.accessToken);
        Global.user = user;

        console.log('Login successful:', user);

        // Fetch menu, permissions, and app info
        const [menuData] = await Promise.all([
          getMenu(),
          getPermission(),
          getAppInfo(),
        ]);

        // Cập nhật Recoil state
        const authData = {
          isLoggedIn: true,
          user: user,
          accessToken: result.data.result.accessToken,
        };
        setAuth(authData);
        setMenu(menuData || []);

        // Lưu vào AsyncStorage để tự động đăng nhập lần sau
        await saveAuthToStorage(authData);

        showToast('success', 'Thành công', 'Đăng nhập thành công!');

        // Navigate to main app
        setTimeout(() => {
          RootNavigation.navigate('Home');
        }, 500);
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
        showToast('error', 'Lỗi', 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);

      // Handle specific error messages
      if (error.response?.data?.error?.message) {
        setError(error.response.data.error.message);
        showToast('error', 'Lỗi', error.response.data.error.message);
      } else if (error.response?.status === 401) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
        showToast('error', 'Lỗi', 'Tên đăng nhập hoặc mật khẩu không đúng');
      } else if (error.message === 'Network Error') {
        setError('Không thể kết nối đến máy chủ');
        showToast('error', 'Lỗi', 'Không thể kết nối đến máy chủ');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        // showToast('error', 'Lỗi', 'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = async () => {
    setError('');
    // Mở WebView để đăng nhập SSO
    setShowSSOWebView(true);
  };

  const handleWebViewNavigationStateChange = async navState => {
    const {url} = navState;
    console.log('WebView URL:', url);

    // Kiểm tra xem có phải là callback URL không
    // URL có thể chứa token hoặc redirect về app
    if (url.includes('/auth/callback') || url.includes('token=')) {
      try {
        setLoading(true);

        // Parse token từ URL
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const token = urlParams.get('token');

        if (token) {
          // Lưu token
          Global.accessToken = token;

          // Decode JWT để lấy thông tin user
          const user = jwtDecode(token);
          Global.user = user;

          console.log('SSO Login successful:', user);

          // Đóng WebView
          setShowSSOWebView(false);

          // Lấy menu, permissions và app info
          const [menuData] = await Promise.all([
            getMenu(),
            getPermission(),
            getAppInfo(),
          ]);

          // Cập nhật Recoil state
          const authData = {
            isLoggedIn: true,
            user: user,
            accessToken: token,
          };
          setAuth(authData);
          setMenu(menuData || []);

          // Lưu vào AsyncStorage
          await saveAuthToStorage(authData);

          showToast('success', 'Thành công', 'Đăng nhập SSO thành công!');

          // Navigate về Home
          setTimeout(() => {
            RootNavigation.navigate('Home');
          }, 500);
        }
      } catch (error) {
        console.error('SSO callback error:', error);
        setShowSSOWebView(false);
        showToast('error', 'Lỗi', 'Đăng nhập SSO thất bại');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleWebViewMessage = async event => {
    try {
      // Lấy data từ WebView message
      let data = event.nativeEvent.data;
      console.log('WebView Message:', data);

      // Loại bỏ dấu ngoặc kép nếu có
      if (typeof data === 'string') {
        data = data.trim().replace(/^["']|["']$/g, '');
      }

      // Kiểm tra xem data có phải là UUID không (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (data && typeof data === 'string' && uuidRegex.test(data)) {
        const code = data;
        console.log('Valid SSO code received:', code);

        setLoading(true);

        // Gọi API VerifyCode để lấy token
        const verifyResponse = await Axios.post(
          Global.API_URL + '/api/TokenAuth/VerifyCode',
          {
            code: code,
            redirectUri: 'https://nongnghiep.csctech.vn/auth/login-mobile',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (verifyResponse.status === 200 && verifyResponse.data.result) {
          const {accessToken, userId, roles, roleIds} =
            verifyResponse.data.result;

          // Lưu token
          Global.accessToken = accessToken;

          // Decode JWT để lấy thông tin user
          const user = jwtDecode(accessToken);
          Global.user = user;

          console.log('SSO Login successful:', {
            userId,
            roles,
            roleIds,
            user,
          });

          // Đóng WebView
          setShowSSOWebView(false);

          // Lấy menu, permissions và app info
          const [menuData] = await Promise.all([
            getMenu(),
            getPermission(),
            getAppInfo(),
          ]);

          // Cập nhật Recoil state
          const authData = {
            isLoggedIn: true,
            user: user,
            accessToken: accessToken,
          };
          setAuth(authData);
          setMenu(menuData || []);

          // Lưu vào AsyncStorage
          await saveAuthToStorage(authData);

          showToast('success', 'Thành công', 'Đăng nhập SSO thành công!');

          // Navigate về Home
          setTimeout(() => {
            RootNavigation.navigate('Home');
          }, 500);
        } else {
          throw new Error('Không thể xác thực code từ SSO');
        }

        setLoading(false);
      } else {
        // Nếu không phải UUID, có thể là message khác từ WebView (bỏ qua hoặc log)
        console.log(
          'WebView message is not a valid UUID code, ignoring:',
          data,
        );
      }
    } catch (error) {
      console.error('WebView message error:', error);
      setShowSSOWebView(false);

      // Xử lý lỗi chi tiết
      let errorMessage = 'Đăng nhập SSO thất bại';
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast('error', 'Lỗi', errorMessage);
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1080',
      }}
      style={styles.backgroundImage}
      blurRadius={1}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 80 : 20,
          left: 20,
          zIndex: 10,
          backgroundColor: 'rgba(255,255,255,0.3)',
          padding: 8,
          borderRadius: 100,
        }}
        onPress={() => {
          // Handle back action
          RootNavigation.goBack();
        }}>
        <Icon name="arrow-left" size={28} color="#fff" />
      </TouchableOpacity>
      <LinearGradient
        colors={[`${AppColors.WhiteGreen}99`, `${AppColors.MainColor}CC`]}
        style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}>
              <Animated.View
                style={[
                  styles.innerContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{translateY: slideAnim}, {scale: scaleAnim}],
                  },
                ]}>
                {/* Glass Card Container */}
                <View style={styles.glassCard}>
                  {/* Logo Section */}
                  <View style={styles.logoContainer}>
                    <Image
                      style={{width: 60, height: 60}}
                      source={require('../../../asset/Image/Splash/QuocHuy.png')}
                    />
                  </View>
                  <View style={{marginBottom: 20}}>
                    <Text
                      style={[
                        styles.title,
                        {
                          textAlign: 'center',
                          fontWeight: '800',
                          color: AppColors.MainColor,
                          fontSize: 20,
                        },
                      ]}>
                      SỞ NÔNG NGHIỆP VÀ MÔI TRƯỜNG TỈNH CÀ MAU
                    </Text>
                    <Text
                      style={[
                        styles.title,
                        {
                          textAlign: 'center',
                          color: '#5f5f5f',
                          fontSize: 17,
                          fontWeight: '800',
                        },
                      ]}>
                      CƠ SỞ DỮ LIỆU CHUYÊN NGÀNH
                    </Text>
                  </View>
                  {/* Email Input */}
                  <View
                    style={[
                      styles.inputContainer,
                      emailFocused && styles.inputContainerFocused,
                    ]}>
                    <Icon
                      name="mail"
                      size={20}
                      color={emailFocused ? '#667eea' : '#999'}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Tên đăng nhập"
                      placeholderTextColor="#999"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </View>

                  {/* Password Input */}
                  <View
                    style={[
                      styles.inputContainer,
                      passwordFocused && styles.inputContainerFocused,
                    ]}>
                    <Icon
                      name="lock"
                      size={20}
                      color={passwordFocused ? '#667eea' : '#999'}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Mật khẩu"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.showHideBtn}>
                      <Icon
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#667eea"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Error Message */}
                  {error ? (
                    <Animated.View style={styles.errorContainer}>
                      <Icon name="alert-circle" size={16} color="#ff6b6b" />
                      <Text style={styles.errorText}>{error}</Text>
                    </Animated.View>
                  ) : null}

                  {/* Remember Me & Forgot Password */}
                  <View style={styles.optionsContainer}>
                    {/* <TouchableOpacity style={styles.rememberContainer}>
                      <Icon name="check-square" size={18} color="#667eea" />
                      <Text style={styles.rememberText}>Nhớ mật khẩu</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity>
                      <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                    </TouchableOpacity> */}
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={styles.loginBtnContainer}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                    disabled={loading}>
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.loginBtn}>
                      {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.loginBtnText}>Đăng nhập</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Social Login */}
                  <View style={styles.socialContainer}>
                    <View style={styles.dividerContainer}>
                      <View style={styles.divider} />
                      <Text style={styles.dividerText}>
                        Hoặc đăng nhập bằng
                      </Text>
                      <View style={styles.divider} />
                    </View>

                    {/* <View style={styles.socialButtons}>
                      <TouchableOpacity style={styles.socialBtn}>
                        <Icon name="facebook" size={24} color="#3b5998" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.socialBtn}>
                        <MaterialIcon name="google" size={24} color="#ea4335" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.socialBtn}>
                        <Icon name="github" size={24} color="#333" />
                      </TouchableOpacity>
                    </View> */}
                    <TouchableOpacity
                      style={styles.loginBtnContainer}
                      onPress={handleSSOLogin}
                      activeOpacity={0.8}
                      disabled={loading}>
                      <LinearGradient
                        colors={['#9FC5E8', '#c39977']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.loginBtn}>
                        {loading ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <Text style={styles.loginBtnText}>Đăng nhập SSO</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  {/* Sign Up Link */}

                  {/* <View style={styles.signupContainer}>
                    <Text style={styles.signupTextNormal}>
                      Chưa có tài khoản?
                    </Text>
                    <TouchableOpacity>
                      <Text style={styles.signupText}> Đăng ký ngay</Text>
                    </TouchableOpacity>
                  </View> */}
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>

      {/* SSO WebView Modal */}
      <Modal
        visible={showSSOWebView}
        animationType="slide"
        onRequestClose={() => setShowSSOWebView(false)}>
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={styles.webViewHeader}>
            <TouchableOpacity
              onPress={() => setShowSSOWebView(false)}
              style={styles.webViewCloseButton}>
              <Icon name="x" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.webViewTitle}>Đăng nhập SSO</Text>
            <View style={{width: 40}} />
          </View>
          {loading && (
            <View style={styles.webViewLoading}>
              <ActivityIndicator size="large" color={AppColors.MainColor} />
              <Text style={{marginTop: 10, color: '#666'}}>
                Đang xử lý đăng nhập...
              </Text>
            </View>
          )}
          <WebView
            source={{uri: 'https://nongnghiep.csctech.vn/auth/login-mobile'}}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            onMessage={handleWebViewMessage}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator
                size="large"
                color={AppColors.MainColor}
                style={{marginTop: 20}}
              />
            )}
            style={{flex: 1}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            sharedCookiesEnabled={true}
          />
        </SafeAreaView>
      </Modal>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  glassCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 49,
    height: 49,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#636e72',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    transition: 'all 0.3s',
  },
  inputContainerFocused: {
    borderColor: '#667eea',
    backgroundColor: '#fff',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    paddingVertical: 0,
  },
  showHideBtn: {
    padding: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    color: '#636e72',
    fontSize: 14,
    marginLeft: 6,
  },
  forgotText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  loginBtnContainer: {
    width: '100%',
    marginBottom: 24,
  },
  loginBtn: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe0e0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#ff6b6b',
    marginLeft: 6,
    fontSize: 14,
    flex: 1,
  },
  socialContainer: {
    width: '100%',
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#dfe6e9',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#636e72',
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupTextNormal: {
    color: '#636e72',
    fontSize: 15,
  },
  signupText: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 15,
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  webViewCloseButton: {
    padding: 8,
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  webViewLoading: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 40,
  },
});
