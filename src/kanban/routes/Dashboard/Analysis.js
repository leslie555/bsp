import React, { Component } from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import className from 'classnames';
import { Row, Col, Spin, message } from 'antd';

import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import SettingDarwer from '../../components/SetDrawer';
import KanbanShow from './KanbanShow';
import styles from './Analysis.less';

@connect(({ user, loading, setting, embedPage }) => ({
  user,
  loading: loading.models.user,
  hideSwitchMainpage: setting.hideSwitchMainpage,
  activeKey: embedPage.activeKey,
}))
class Analysis extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      kanbanMode: true,
      mapReady: false,
      mapUrl: '',
    };
    this.handleAcomponentClick = this.handleAcomponentClick.bind(this);
    this.OnMessage = this.OnMessage.bind(this);
  }

  componentDidMount() {
    // 初始化 当子-子窗口中地图加载完成时，开启topbarEffect功能
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

  // 地图模式和工作台模式切换
  @Bind()
  @Debounce(800)
  onSwitchModeHandler() {
    const { kanbanMode, mapReady, mapUrl } = this.state;
    const { user } = this.props;
    if (!mapReady && !kanbanMode) {
      message.error('地图未加载完成,请稍后...');
    } else {
      if (!mapUrl) {
        this.setState({
          mapUrl: `${user.mapUrl}/HiMap/index.html`,
        });
      }

      this.setState({
        kanbanMode: !kanbanMode,
      });
    }
  }

  OnMessage(e) {
    if (e.data == 'mapready') {
      console.log('mapreadymapreadymapreadymapready ');
      this.setState({
        mapReady: true,
      });
    }
  }

  /**
   * A 区域点击 可以打开页面
   * @param e
   */
  handleAcomponentClick(page) {
    if (!page?.data) {
      return;
    }
    const { dispatch } = this.props;
    const randomId = `acomponent${Math.floor(Math.random() * 1000)}`;
    const { key = randomId, menuId = randomId, menuName, url, onClick } = page.data;
    if (!!url && !!menuName) {
      dispatch({
        type: 'embedPage/add',
        payload: { selectedObj: { key, menuId, menuName, url, onClick } },
      });
    }
  }

  render() {
    const { kanbanMode, mapUrl } = this.state;
    const { user, loading, hideSwitchMainpage, activeKey } = this.props;
    const { acomponent = [], bcomponent = [], menuShowType = '' } = user;
    // const mapUrl = `${user.mapUrl}/HiMap/index.html`;
    const topColResponsiveProps = {
      style: { marginBottom: '12px' },
    };

    return (
      <div className="queue-demo">
        <div style={{ display: kanbanMode && !hideSwitchMainpage ? '' : 'none' }}>
          <img
            style={{ zIndex: '12' }}
            onClick={() => this.onSwitchModeHandler()}
            className={styles.mapButton}
            alt="example"
            src={require('../../assets/地图模式.png')}
          />
        </div>
        <div style={{ display: kanbanMode || hideSwitchMainpage ? 'none' : '' }}>
          <img
            style={{ zIndex: '12' }}
            className={styles.mapButton}
            alt="example"
            src={require('../../assets/工作台.png')}
            onClick={() => this.onSwitchModeHandler()}
          />
        </div>
        <QueueAnim key="map2normal" type={['right']} ease={['easeOutQuart', 'easeInOutQuart']}>
          {kanbanMode && (
            <div className={styles.normal}>
              <KanbanShow
                acomponent={acomponent}
                topColResponsiveProps={topColResponsiveProps}
                bcomponent={bcomponent}
                kanbanMode={kanbanMode}
                handleAcomponentClick={this.handleAcomponentClick}
                key="kanbanshow1"
              />
            </div>
          )}
          {
            <div
              key="kanbanshow2"
              style={{ display: kanbanMode ? 'none' : 'block', height: '100%', width: '100%' }}
            >
              <iframe
                title="mappart"
                frameBorder="0"
                className={styles.frameContain}
                src={mapUrl}
                scrolling="yes"
                key="b"
              />
              {activeKey == 'home' && !kanbanMode && menuShowType != 'pingpu' && <SettingDarwer />}
            </div>
          }
        </QueueAnim>
      </div>
    );
  }
}
export default Analysis;
