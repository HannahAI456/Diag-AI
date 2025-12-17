/**
 * @format
 */
import {
  AppRegistry,
  Image,
  ImageBackground,
  Platform,
  Text,
  TextInput,
} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import FastImage from 'react-native-fast-image';

const PLACEHOLDER_IMG = require('./src/asset/Image/img1.jpg');
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = [Text.defaultProps.style, {color: '#191919'}];
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = [
  TextInput.defaultProps.style,
  {color: '#191919'},
];
TextInput.defaultProps.placeholderTextColor = '#9E9E9E';

Image.defaultProps = Image.defaultProps || {};
Image.defaultProps.source = PLACEHOLDER_IMG;
Image.defaultProps.defaultSource = PLACEHOLDER_IMG;
FastImage.defaultProps = FastImage.defaultProps || {};
FastImage.defaultProps.source = PLACEHOLDER_IMG;
FastImage.defaultProps.defaultSource = PLACEHOLDER_IMG;

Image.defaultProps.resizeMode = 'cover';
if (Platform.OS === 'android') {
  Image.defaultProps.fadeDuration = 0;
}

ImageBackground.defaultProps = ImageBackground.defaultProps || {};
ImageBackground.defaultProps.defaultSource = PLACEHOLDER_IMG;
ImageBackground.defaultProps.resizeMode = 'cover';

AppRegistry.registerComponent(appName, () => App);
