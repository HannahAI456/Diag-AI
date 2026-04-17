import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import TopNavigation from '../../Components/TopNavigation';
import {RootNavigation} from '../../Common/RootNavigation';
import RenderHtmlCustom from '../../Components/renderHtml';
import Global from '../../LocalData/Global';
import WebView from 'react-native-webview';

const WebViewDungChung = ({route}) => {
  const {item} = route.params;
  console.log('WebViewDungChung item:', item);
  return (
    <View style={{flex: 1}}>
      <TopNavigation title={item.Ten} navigation={RootNavigation} />
      <WebView
        source={{
          uri: item.LienKet.startsWith('http')
            ? item.LienKet
            : Global.API_URL + item.LienKet,
        }}
        style={{height: '100%', width: '100%'}}
      />
    </View>
  );
};

export default WebViewDungChung;
const styles = StyleSheet.create({});
