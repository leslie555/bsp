import React from 'react';
import ReactDom from 'react-dom';
import { connect } from 'dva';
import { Tabs, Button } from 'antd';
import Analysis from './Dashboard/Analysis';
import EmbedPage from '../components/EmbedPage';

import { isArrayObjHave } from '../utils/utils';
import styles from './Embedpages.less';

const { TabPane } = Tabs;


/* eslint-disable camelcase */
class EmbedPages extends React.Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    this.state = {};
    this.OnMessage = this.OnMessage.bind(this);
  }

  componentDidMount() {
    /**
     * 晓冰哥提的需求, iframe 可以给工作台 发通信,打开新的tabs页
     */
    if (window.addEventListener) {
      // all browsers except IE before version 9
      window.addEventListener('message', this.OnMessage, false);
    } else if (window.attachEvent) {
      // IE before version 9
      window.attachEvent('onmessage', this.OnMessage);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.OnMessage);
  }

  onChange = (activeKey) => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'embedPage/updateState',
      payload: { activeKey },
    });
    // 点击首页tab时刷新一次数据
    if (activeKey == 'home') {
      // 刷新待办事项
      dispatch({
        type: 'user/getToDoList',
        payload: {},
      });
    }
  };

  onEdit = (targetKey, action) => {
    // 这个调用的 remove!!!
    this[action](targetKey);
  };

  remove = (targetKey) => {
    const { dispatch, embedPage } = this.props;
    let { activeKey } = embedPage;
    let lastIndex;
    embedPage.list.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = embedPage.list.filter(pane => pane.key !== targetKey);
    if (lastIndex < 0 || activeKey !== targetKey) {
      lastIndex += 1;
    }
    if (panes[lastIndex]) {
      activeKey = panes[lastIndex].key;
    } else {
      activeKey = 'home';
    }
    dispatch({
      type: 'embedPage/updateState',
      payload: { list: panes, activeKey },
    });
  };

  /**
   * 子页面打开关闭tab页面
   * @param e
   * @constructor
   */
  OnMessage(e = {}) {
    const { dispatch } = this.props;
    const { key, menuId, menuName, url, onClick, type } = e.data;
    if (type == 'open') {
      console.log(`OnMessageOnMessageOnMessage  ${JSON.stringify(e.data)}`);
      if (!!url && !!menuName) {
        dispatch({
          type: 'embedPage/add',
          payload: { selectedObj: { key, menuId, menuName, url, onClick } },
        });
        window.localStorage.setItem(`${key}`, key);
      } else {
        console.error(`页面信息不全  ${JSON.stringify(e.data)}`);
      }
    } else {
      const { embedPage } = this.props;

      console.log(`OnMessageOnMessageOnMessage  ${JSON.stringify(e.data)}`);
      const exist = isArrayObjHave(embedPage.list, key, 'key');
      if (exist) {
        window.localStorage.removeItem(key);
        this.remove(key);
      } else {
        console.error(`页面主键不存在${key}`);
      }
    }
  }

  render() {
    const { embedPage, match } = this.props;
    return (
      <div className={styles.normal}>
        <div>
          <Tabs
            tabBarStyle={{ fontSize: 16 }}
            hideAdd
            onChange={this.onChange}
            activeKey={embedPage.activeKey || 'home'}
            type="editable-card"
            onEdit={this.onEdit}
            className={styles.contentStyle}
          >
            <TabPane tab="首页" key="home" closable={false}>
              <Analysis />
            </TabPane>
            {embedPage.list.map(page => (
              <TabPane tab={page.menuName} key={page.key}>
                <EmbedPage
                  page={page}
                  match={match}
                  key={`page${page.menuId}`}
                  activeKey={embedPage.activeKey || 'home'}
                />
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    embedPage: state.embedPage,
    currentUser: state.user.currentUser,
  };
}

export default connect(mapStateToProps)(EmbedPages);
