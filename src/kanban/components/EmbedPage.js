import React from 'react';
import ReactDom from 'react-dom';
import { Spin } from 'antd';
import { isIe } from '../utils/utils';

import styles from './EmbedPage.less';

/* function EmbedPagebak({ page, match = {} }) {
  return (
    <div className={styles.page}>
      <iframe
        name="embedPages"
        title={`menuPage${page.menuId}`}
        frameBorder="0"
        className={styles.frameContain}
        // src={`${page.url}${(page.url.indexOf('.html') >= 0) ? '' :
        // (page.url.indexOf('?') >= 0) ? '&_w=1370&_h=800' : '?_w=1370&_h=800'}`}
        src={page.url}
        scrolling="yes"
      />
    </div>
  );
} */
/**
 * 每个tab 页面 ，包含跳转信息
 * @param embedPage
 * @param match
 * @returns {*}
 * @constructor
 */
class EmbedPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.iframeNode = null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { activeKey, page } = nextProps;
    if (activeKey != page?.menuId) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    const { page } = this.props;
    let iframe = null;
    try {
      // iframe = ReactDom.findDOMNode(this.iframeNode);
      iframe = this.iframeNode;
      // iframe = document.querySelector(`[title=menuPage${page.menuId}]`);
      iframe.src = 'about:blank';
      iframe.contentWindow.document.write(''); // 清空frame的内容
      iframe.contentWindow.document.clear();
      iframe.contentWindow.close(); // 避免frame内存泄漏
      console.log(' frame 卸载 成功!!');
    } catch (e) {
      console.log(` frame 卸载${e} `);
    }
    try {
      if (isIe()) {
        if (window.CollectGarbage) {
          // 把iframe从页面移除
          iframe.parentNode.removeChild(iframe);
          window.CollectGarbage(); // IE 特有 释放内存
        }
      }
    } catch (e) {
      console.log(` frame removeChild ${e} `);
    }
  }

  refcaller = (node) => {
    console.log('refrefrefref ');
    this.iframeNode = node;
    this.setState({});
  };

  render() {
    const { page, activeKey } = this.props;
    console.log(`+++ ${page.key} renderrenderrender`);
    return (
      <React.Fragment>
        {!this.iframeNode && <Spin size="large" tip="正在加载" className="global-spin" />}
        <div
          className={styles.page}
          key={`iframepage${page.key}`}
          style={
            this.iframeNode ? { width: '100%', height: '100%' } : { width: '0%', height: '0%' }
          }
        >
          <iframe
            name="embedPages"
            title={`menuPage${page.menuId}`}
            frameBorder="0"
            className={styles.frameContain}
            src={page.url}
            scrolling="yes"
            ref={this.refcaller}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default EmbedPage;
