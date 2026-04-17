import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  Image,
  ActivityIndicator,
  ScrollView,
  Touchable,
  TouchableOpacity,
  Alert,
  Modal,
  Text,
} from 'react-native';
import RenderHtml, {useInternalRenderer} from 'react-native-render-html';
import TableRenderer, {tableModel} from '@native-html/table-plugin'; // Import đúng từ plugin
import WebView from 'react-native-webview'; // Cần cho table rendering
import Global from '../LocalData/Global';
import {MAX_H, MAX_W} from '../Common/GlobalStyles';
import Button from './Button';
import ImageViewer from './ImageViewer';
// import {ScrollView} from 'react-native-gesture-handler';

function joinUrl(base, path) {
  const b = base?.endsWith('/') ? base.slice(0, -1) : base || '';
  const p = path?.startsWith('/') ? path.slice(1) : path || '';
  return `${b}/${p}`;
}

function rewriteRelativeUrls(html, baseUrl) {
  if (!html || !baseUrl) return html || '';
  return html.replace(
    /(?:(src|href))\s*=\s*(['"])(.*?)\2/gi,
    (m, attr, quote, url) => {
      const lower = (url || '').trim().toLowerCase();
      const isAbsolute =
        lower.startsWith('http://') ||
        lower.startsWith('https://') ||
        lower.startsWith('//') ||
        lower.startsWith('data:') ||
        lower.startsWith('mailto:') ||
        lower.startsWith('tel:') ||
        lower.startsWith('sms:') ||
        lower.startsWith('ftp:') ||
        lower.startsWith('ws:') ||
        lower.startsWith('wss:');
      if (isAbsolute) return m;
      const newUrl = joinUrl(baseUrl, url);
      return `${attr}=${quote}${newUrl}${quote}`;
    },
  );
}

/* ---------------- helpers so khớp đuôi ---------------- */

function stripQueryHash(u) {
  if (!u) return '';
  let out = u;
  const hashIdx = out.indexOf('#');
  if (hashIdx >= 0) out = out.slice(0, hashIdx);
  const qIdx = out.indexOf('?');
  if (qIdx >= 0) out = out.slice(0, qIdx);
  return out;
}

function tryDecode(u) {
  try {
    return decodeURIComponent(u);
  } catch {
    return u;
  }
}

function basename(path) {
  if (!path) return '';
  const i = path.lastIndexOf('/');
  return i >= 0 ? path.slice(i + 1) : path;
}

// tạo các token đuôi để so khớp: bản gốc, bản decode, và basename của mỗi bản
function buildSuffixTokens(suffixes) {
  const list = Array.isArray(suffixes) ? suffixes : [suffixes];
  const tokens = new Set();
  list.forEach(s => {
    if (!s) return;
    let t = stripQueryHash(String(s).trim().toLowerCase());
    if (!t) return;

    const tDec = tryDecode(t);
    const b1 = basename(t);
    const b2 = basename(tDec);

    tokens.add(t);
    tokens.add(tDec);
    tokens.add(b1);
    tokens.add(b2);
  });
  return Array.from(tokens).filter(Boolean);
}

// xóa <img> nếu src kết thúc bằng bất kỳ token nào
function removeImagesBySuffix(html, suffixes) {
  if (!html || !suffixes) return html;

  const tokens = buildSuffixTokens(suffixes);
  if (tokens.length === 0) return html;

  const imgRegex = /<img\b[^>]*\bsrc=['"]([^'"]+)['"][^>]*>/gi;
  let out = html;
  let m;
  while ((m = imgRegex.exec(html))) {
    const fullTag = m[0];
    const srcRaw = (m[1] || '').toLowerCase();
    const srcNorm = tryDecode(stripQueryHash(srcRaw)); // bỏ query/hash + decode

    const matched = tokens.some(tok => srcNorm.endsWith(tok));
    if (matched) {
      out = out.replace(fullTag, '');
    }
  }
  return out;
}

/* ---------------- loại ảnh hỏng bằng prefetch ---------------- */

async function stripBrokenImages(html) {
  if (!html) return '';

  const imgRegex = /<img\b[^>]*\bsrc=['"]([^'"]+)['"][^>]*>/gi;
  const tags = [];
  let m;
  while ((m = imgRegex.exec(html))) {
    tags.push({full: m[0], url: m[1]});
  }
  if (tags.length === 0) return html;

  const MAX_CHECK = 30; // tránh spam request
  const toCheck = tags.slice(0, MAX_CHECK);

  const results = await Promise.allSettled(
    toCheck.map(async t => {
      const lower = (t.url || '').toLowerCase();
      // skip vài scheme không cần check
      if (
        lower.startsWith('data:') ||
        lower.startsWith('mailto:') ||
        lower.startsWith('tel:') ||
        lower.startsWith('sms:')
      ) {
        return {ok: true, tag: t.full};
      }
      try {
        const ok = await Image.prefetch(t.url);
        return {ok, tag: t.full};
      } catch {
        return {ok: false, tag: t.full};
      }
    }),
  );

  let out = html;
  results.forEach(r => {
    if (r.status === 'fulfilled' && !r.value.ok) {
      out = out.replace(r.value.tag, '');
    }
  });

  return out;
}

/* ---------------- Component ---------------- */

/**
 * Props:
 * - data: string (HTML)
 * - img?: string | string[] (các đuôi/tên file cần ẩn, ví dụ: "avatar.jpg" hoặc "/path/to/abc.png")
 */
const RenderHtmlCustom = ({data, img}) => {
  const {width} = useWindowDimensions();
  const [processedHtml, setProcessedHtml] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const rewritten = useMemo(
    () => rewriteRelativeUrls(data, Global.WebviewUrl) || '',
    [data],
  );

  useEffect(() => {
    let cancelled = false;
    setIsProcessing(true);
    (async () => {
      // B2: xóa ảnh trùng đuôi theo props `img`
      let htmlStep = removeImagesBySuffix(rewritten, img);

      // B3: tiếp tục loại ảnh hỏng (prefetch fail)
      htmlStep = await stripBrokenImages(htmlStep);

      if (!cancelled) {
        setProcessedHtml(htmlStep);
        setIsProcessing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [rewritten, img]);

  if (isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  const tableDefaultStyle = {
    flex: 1,
    justifyContent: 'flex-start',
  };
  const tableColumnStyle = {
    ...tableDefaultStyle,
    flexDirection: 'column',
    alignItems: 'stretch',
  };

  const tableRowStyle = {
    ...tableDefaultStyle,
    flexDirection: 'row',
    alignItems: 'stretch',
  };

  const tdStyle = {
    //...tableDefaultStyle,
    flex: 1,
    justifyContent: 'flex-start',
    padding: 2,
    borderWidth: 0.5,
    borderColor: 'black',
  };

  const thStyle = {
    ...tdStyle,
    backgroundColor: '#CCCCCC',
    alignItems: 'center',
  };

  const imgStyle = {
    width: MAX_W * 0.9,
    maxWidth: MAX_W * 0.9,
    height: MAX_H * 0.5,
  };
  function H1Renderer({TDefaultRenderer, ...props}) {
    const onPress = () => console.log(props);
    return <TDefaultRenderer {...props} onPress={onPress} />;
  }

  const renderers = {
    table: (x, c) => <View style={tableColumnStyle}>{c}</View>,
    col: (x, c) => <View style={tableColumnStyle}>{c}</View>,
    colgroup: (x, c) => <View style={tableRowStyle}>{c}</View>,
    tbody: (x, c) => <View style={tableColumnStyle}>{c}</View>,
    tfoot: (x, c) => <View style={tableRowStyle}>{c}</View>,
    th: (x, c) => <View style={thStyle}>{c}</View>,
    thead: (x, c) => <View style={tableRowStyle}>{c}</View>,
    caption: (x, c) => <View style={tableColumnStyle}>{c}</View>,
    tr: (x, c) => <View style={tableRowStyle}>{c}</View>,
    td: (x, c) => <View style={tdStyle}>{c}</View>,
    img: (x, c) => (
      <Image style={imgStyle} source={{uri: x.src}} resizeMode={'contain'} />
    ),
    //label: (x, c) => <Text style={txtStyle}>{c}</Text>
  };
  const tableConfig = {
    tableStyleSpecs: {
      borderCollapse: 'collapse',
      borderColor: '#ccc',
    },
  };
  const tagsStyles = {
    img: {
      alignSelf: 'center',
    },
  };
  function CustomImageRenderer(props) {
    const {Renderer, rendererProps} = useInternalRenderer('img', props);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const onPress = () => setIsViewerOpen(true);
    const onViewerClose = () => setIsViewerOpen(false);
    const uri = rendererProps.source.uri;
    const thumbnailSource = {
      ...rendererProps.source,

      // You could change the uri here, for example to provide a thumbnail.
      // uri: uri.replace('1200', '300').replace('800', '200'),
    };
    return (
      <View style={{alignItems: 'center', marginVertical: 10}}>
        <Renderer
          {...rendererProps}
          source={thumbnailSource}
          onPress={onPress}
          style={{width: MAX_W}}
        />
        <ImageViewer
          visible={isViewerOpen}
          images={[{uri}]}
          index={0}
          onRequestClose={onViewerClose}
        />
      </View>
    );
  }
  // đặt trên cùng file (gần CustomImageRenderer)
  const TableWithHorizontalScroll = props => {
    return (
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator
        contentContainerStyle={{flexGrow: 1}}>
        <TableRenderer {...props} />
      </ScrollView>
    );
  };

  return (
    <ScrollView
      scrollEnabled={false}
      style={{flex: 1}}
      contentContainerStyle={{flexGrow: 1}}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled">
      <View style={{flex: 1}}>
        <RenderHtml
          contentWidth={width}
          source={{html: processedHtml}}
          WebView={WebView}
          renderers={{
            // dùng wrapper thay vì TableRenderer trực tiếp
            table: TableWithHorizontalScroll,
            img: CustomImageRenderer,
          }}
          customHTMLElementModels={{
            table: tableModel,
          }}
          tagsStyles={tagsStyles}
          renderersProps={{
            img: {enableExperimentalPercentWidth: true},
            table: tableConfig,
          }}
        />
      </View>
    </ScrollView>
  );
};

export default RenderHtmlCustom;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
});
