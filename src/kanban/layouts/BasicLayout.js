import React from 'react';
import PropTypes from 'prop-types';
import {
  Layout,
  Menu,
  Icon,
  Dropdown,
  Spin,
  Modal,
  message,
  Badge,
  Tooltip,
  Card,
  Radio,
} from 'antd';
import { connect } from 'dva';
import { Link, Route, Redirect, Switch } from 'dva/router';

import DragContainer from './RightConfigContainer';
import LeftConfigContainer from './LeftConfigContainer';
import NoticeShow from '../components/NoticeShow';
import AnnounceInfoModal from '../components/BDragComponents/AnnounceInfoModal';
import SectionPills from '../routes/SectionPills';
import equal from '../components/Charts/equal';
import { initmenu4Use, initChartId } from '../utils/dragUtils';
import { openPage, showHtmlApp, openReactPage } from '../utils/menuFrame.js';
import {
  extraArrayThirdInfo,
  getPageInfo,
  isArrayHave,
  deleteMenus,
  unionMenus,
  findfromArray, isIe,
} from '../utils/utils';
import styles from './BasicLayout.less';
import '../components/DragComponent/Table.less';
import { THEMES } from '../config/constant';
import UpdatePwd from '../components/UpdatePwd/UpdatePwd';
import { writeLogForLogout } from '../services/commonService';

const R = require('ramda');
// 定义哪些图表需要配置
const needConfigComponent = ['B4'];
const { Header, Sider, Content } = Layout;
function resetTimer() {
  window.localStorage.setItem('timer', new Date().getTime());
  if (message) {
    message.destroy();
  }
}


/**
 * 每过 5 秒主动释放内存
 */
function clearRAMInterval() {
  if (isIe()) {
    console.log('定时清理ie缓存');
    if (CollectGarbage) CollectGarbage(); // IE 特有 释放内存
  }
}
class BasicLayout extends React.PureComponent {
  static contextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.array,
  };

  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项
    this.menus = [];
    const { allCharts, userTheme } = props;
    this.state = {
      openKeys: ['home'],
      visible: false,
      workbenchVisible: false,

      selectedMenus: [],
      allCharts,
      bottomSelectableMenus: [], // 左下角全局菜单可选项从后台返回数据抽取第三层，即有跳转路径的
      noticeDetailVisible: false, // 通知详情
      tongzhiDetail: {},
      themeVisible: false,
      themeValue: '',
      isRefresh: true,
      updatePwdShow: false, // 修改密码窗口
    };
    this.interval = null;
    this.interval = null;
    this.getNavMenuItems = this.getNavMenuItems.bind(this);
    this.queryData = this.queryData.bind(this);
    // 用户长时间不操作自动退出xxx
    this.experTime = 30; // 超时时间，单位分钟
    this.checkLogin = this.checkLogin.bind(this);
    this.clearSth = this.clearSth.bind(this);
    this.onDropMenuCallback = this.onDropMenuCallback.bind(this);
    window.openPage = openPage;
    window.openReactPage = openReactPage;
    window.showHtmlApp = showHtmlApp;
  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'user/getUserTheme',
    }).then((data) => {
      /* 非默认的修改主题 */
      if (data?.themeId == THEMES.light) {
        this.colorChange(data?.themeId);
      }
      this.setState({
        themeValue: data?.themeId,
      });
    });

    dispatch({
      type: 'global/fetchCommonInfo',
    });
    dispatch({
      type: 'user/getAllCharts',
    });
    dispatch({
      type: 'user/getMapUrl',
    });
    /* ({
      type: 'user/getPwdComplexityParam',
    }); */
  }

  componentDidMount() {
    if (window.location.href.indexOf('/HiatmpPro/logout?logoutfromlocal=CAS') > 0) {
      return;
    }
    this.loginTimer = setInterval(this.checkLogin, 1000);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('beforeunload', (e) => {
      this.clearSth();
    });

    this.queryData();

    this.interval = setInterval(this.queryData, 30000);
    this.clearRAMIntervalId = setInterval(clearRAMInterval, 5000);
  }

  componentWillReceiveProps(nextProps) {
    const { allCharts, embedPage, userTheme } = this.props;

    if (!equal(this.props, nextProps)) {
      this.setState({
        selectedMenus: nextProps.currentUser.selectedMenus,
        bottomSelectableMenus: extraArrayThirdInfo(nextProps.leftMenus || []),
        allCharts,
      });
      if (embedPage !== nextProps.embedPage) {
        this.setState({
          openKeys: nextProps.embedPage ? nextProps.embedPage.activeKey || '' : '',
        });
      }
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('beforeunload', (e) => {
      this.clearSth();
    });
    clearInterval(this.interval);
    clearTimeout(this.resizeTimeout);
    clearInterval(this.clearRAMIntervalId);
    this.clearSth();
  }

  /**
   * 增加菜单选项时候调用  如果有第二个参数，是减掉菜单的回调
   * @param array
   */
  onDropMenuCallback(array = [], type = '') {
    const { bottomSelectableMenus, selectedMenus } = this.state;
    const aa = bottomSelectableMenus.filter(x => isArrayHave(x.menuName, array));
    // 加是合并 减是只取新的
    const tmpselectedMenus = type == 'delete' ? deleteMenus(selectedMenus, aa) : unionMenus(selectedMenus, aa);

    this.setState({
      selectedMenus: tmpselectedMenus,
    });
  }

  onDropBoxCallback = (array = [], apayload, bpayload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/boxUpdate',
      apayload,
      bpayload,
    });
  };

  onWorkbenchVisibleCallback = () => {
    const { dispatch } = this.props;
    const { workbenchVisible } = this.state;

    this.setState({
      workbenchVisible: !workbenchVisible,
    });
    dispatch({
      type: 'user/fetchCurrent',
    });
    const { rightCollapsed } = this.props;
    dispatch({
      type: 'global/changeRightCollapsed',
      payload: !rightCollapsed,
    });
  };

  onCollapse = (collapsed) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
  };

  onCollapseRight = (collapsed) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeRightCollapsed',
      payload: !collapsed,
    });
  };

  onCollapseSetMenu = (collapsed) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeSetMenuCollapsed',
      payload: !collapsed,
    });
  };

  onMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key == 'relogin') {
      writeLogForLogout({}).then((data) => {
        if (data.result === '0') {
          console.log('用户退出日志记录失败');
        } else {
          console.log('用户退出日志记录成功');
        }
        window.open('/HiatmpPro/logout?logoutfromlocal=CAS', '_self', '');
      });
    } else if (key == 'logout') {
      writeLogForLogout({}).then((data) => {
        if (data.result === '0') {
          console.log('用户退出日志记录失败');
        } else {
          console.log('用户退出日志记录成功');
        }
        window.open('/HiatmpPro/logout?logoutfromlocal=CAS', '_self', '');
        window.close();
      });
    } else if (key == 'updatePwd') {
      dispatch({
        type: 'user/getPwdComplexityParam',
      });
      this.setState({ updatePwdShow: true });
    }
  };

  onSetClick = ({ key }) => {
    if (key == 'themeConfig') {
      this.setState({
        themeVisible: true,
      });
    } else if (key == 'workBenchConfig') {
      this.toggleRight();
    }
  };

  onChange = (e) => {
    this.setState({
      themeValue: e.target.value,
    });
  };

  onThemeSaveHandler = () => {
    const { dispatch, userTheme } = this.props;
    const { themeValue } = this.state;
    if (userTheme.themeId == themeValue) {
      message.error('正在使用该主题.', 6);
      return;
    }
    const themeId = { ...{ themeId: themeValue } };
    dispatch({
      type: 'user/saveUserTheme',
      payload: { queryobj: themeId },
    })
      .then((data) => {
        if (data.returnCode == 0) {
          this.hideModelHandler();
          this.colorChange(themeValue);
        } else {
          Modal.error({
            title: '提示',
            content: '主题配置失败!',
          });
        }
      })
      .catch((e) => {});
  };

  // 遍历节点，拼接地址1
  getMenuData = (data, parentPath) => {
    let arr = [];
    data.forEach((item) => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name });
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`));
      }
    });
    return arr;
  };

  getCurrentMenuSelectedKeys() {
    const { openKeys } = this.state;
    return openKeys;
  }

  /**
   * 左侧menu展示：如果菜单栏设置状态，只展示首页
   * */
  getNavMenuItems(menusData, parentPath = '', selectedMenus = []) {
    const { currentUser, setMenuCollapsed, location } = this.props;
    // 在设置快捷菜单时候不展示
    if (!setMenuCollapsed) {
      return null;
    }
    if (!menusData) {
      return [];
    }
    // 判断用户是否有相关页面的配置
    const isContained = R.curry((menuName, nemus) => nemus.menuName == menuName);
    const isMenuContained = (nemus, name) => {
      const selected = R.filter(isContained(name), nemus);
      return !R.isEmpty(selected);
    };

    const dynamicMenus = initmenu4Use(currentUser.selectedMenus || []);
    //  原版是根据menusData循环的，做了修改 2017/12/21
    return dynamicMenus.map((item) => {
      if (!item.name || (item.name !== '首页' && !isMenuContained(selectedMenus, item.name))) {
        return null;
      }
      let itemPath;
      if (item.path.indexOf('http') == 0) {
        itemPath = item.path; // 处理新开tab页方式打开
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }

      const icon = item.icon && <Icon type={item.icon} />;
      return (
        <Menu.Item key={item.key || item.name}>
          {/^https?:\/\//.test(itemPath) ? (
            <a href={itemPath} target={item.target}>
              {icon}
              <span>{item.name}</span>
            </a>
          ) : (
            <Tooltip placement="right" title={item.name}>
              <Link
                to={{
                  pathname: itemPath,
                  search: `?url=${encodeURIComponent(item.name || item.url)}`,
                  state: { fromDashboard: true },
                }}
                target={item.target}
                replace={itemPath == location.pathname}
              >
                {icon}
                <span>
                  {item.name.length <= '6'
                    ? item.name.substring(0, 6)
                    : `${item.name.substring(0, 6)}...`}
                </span>
              </Link>
            </Tooltip>
          )}
        </Menu.Item>
      );
    });
  }

  /* eslint-disable   no-undef */
  colorChange = (themeId) => {
    const themeVariables = themeId == '1' ? themeVariables1 : themeVariables2;
    const changeVariables = R.pick([
      '@tabs-card-head-background',
      '@primary-color',
      '@text-white',
      '@text-color',
      '@text-color-secondary',
      '@commonLightColor',
      '@alertdarkfontColor',
      '@border-radius-base',
      '@border-color-base',
      '@border-color-split',
      '@body-background',
      '@background-color-light',
      '@component-background',
      '@layout-body-background',
      '@tabs-card-active-color',
    ])(themeVariables);
    const hideMessage = message.loading('正在编译主题！', 0);
    setTimeout(() => {
      window.less
        .modifyVars(changeVariables)
        .then(() => {
          hideMessage();
        })
        .catch(() => {
          message.error('Failed to update theme');
        });
    }, 200);
  };

  handleOpenChange = (openKeys) => {};

  /*
   *左侧菜单栏  被选中时调用
   */
  handleOnSelect = ({ item, key, selectedKeys }) => {
    const { dispatch, currentUser } = this.props;
    let selectedDetail = {};
    if (key == 'home') {
      selectedDetail = {
        name: '首页',
        icon: 'home',
        path: 'embedPage',
        key: 'home',
        search: 'home',
      };
      // 刷新一次首页图表中的数据
      this.queryData();
    } else {
      selectedDetail = findfromArray(key, currentUser.selectedMenus); // 从props是没问题的。新加的也得保存后才能点
    }
    // 晓冰哥说的 可以menu 多个动作, 现在是没有拼前缀,所以都是 localhost:8002 开头....可以让写onclick 字段时候写全路径,先给注释了
    if (selectedDetail.onClick) {
      // evil(selectedDetail.onClick);
    }
    this.setState({
      openKeys: selectedKeys,
    });
    dispatch({
      type: 'embedPage/add',
      payload: { selectedObj: selectedDetail, activeKey: selectedKeys },
    });
  };

  toggle = () => {
    const { collapsed, dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
    this.resizeTimeout = setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    }, 600);
  };

  toggleRight = () => {
    const { rightCollapsed, dispatch, acomponent, bComponent } = this.props;
    const { workbenchVisible } = this.state;
    if (rightCollapsed == true) {
      dispatch({
        type: 'global/changeRightCollapsed',
        payload: !rightCollapsed,
      });
      this.resizeTimeout = setTimeout(() => {
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
      }, 600);
      this.setState({
        workbenchVisible: !workbenchVisible,
      });
      dispatch({
        type: 'user/saveparameterconfig',
        payload: [],
      });
    }
  };

  menuSettingHandler = () => {
    const { setMenuCollapsed, dispatch } = this.props;
    const { visible, isRefresh } = this.state;
    dispatch({
      type: 'global/changeSetMenuCollapsed',
      payload: !setMenuCollapsed,
    });
    this.setState({
      visible: !visible,
      isRefresh: !isRefresh,
    });
  };

  /**
   * 左侧菜单保存
   */
  menuSubmitHandler = () => {
    const { dispatch, currentUser } = this.props;
    const { selectedMenus } = this.state;
    dispatch({
      type: 'user/menusSaveUpdate',
      payload: {
        userId: currentUser.userId,
        menuIds: selectedMenus.map(x => x.menuId).join(','),
      },
    }).then((data) => {
      if (data.returnCode == 0) {
        message.success('菜单设置成功！', 6);
        dispatch({
          type: 'user/fetchCurrent',
        });
        this.menuSettingHandler();
      } else {
        Modal.error({
          title: '保存失败，请重试',
          content: JSON.stringify(data.msg),
        });
      }
    });
  };

  popoverDisplayRender = (label) => {
    return label[label.length - 1];
  };

  workbenchSubmitHandler = (saveAbox, saveBboxSource, bcompoentSize) => {
    const saveBbox = Object.assign([], saveBboxSource);
    const { dispatch, currentUser, parameterconfig } = this.props;
    const { workbenchVisible } = this.state;
    const saveSize = bcompoentSize.filter((element) => {
      return element.lastDroppedItem !== null;
    });
    let chartInfo = [];
    for (
      let i = 0;
      i < (saveBbox.length < saveSize.length ? saveBbox.length : saveSize.length);
      i += 1
    ) {
      saveBbox[i].nsize = saveSize[i].nsize;
    }
    const needConfig = saveBbox.filter((element) => {
      for (const i of needConfigComponent) {
        if (element.componentName === i) {
          return true;
        }
      }
      return false;
    });
    // 保存图表配置，needConfigComponent定义哪些图表需要配置
    if (
      parameterconfig.length === needConfig.length
      || needConfigComponent.length === 0
      || needConfig.length === 0
    ) {
      for (let i = 0; i < parameterconfig.length; i += 1) {
        for (let k = 0; k < saveBbox.length; k += 1) {
          if (saveBbox[k].componentName === parameterconfig[i].componentName) {
            const config = JSON.stringify(parameterconfig[i]);
            saveBbox[k].parameterconfig = JSON.stringify(parameterconfig[i]);
          }
        }
      }

      chartInfo = [...saveAbox, ...saveBbox];
      dispatch({
        type: 'global/saveUserCharts',
        payload: {
          userId: currentUser.userId,
          queryobj: { chartInfo },
        },
      }).then((data) => {
        if (data.returnCode < 0) {
          Modal.error({
            title: '提示',
            content: '保存失败,请重试.',
          });
          return false;
        }
        message.success('工作区设置成功！', 6);
        dispatch({
          type: 'user/fetchCurrent',
        });
        this.setState({
          workbenchVisible: !workbenchVisible,
        });
        const { rightCollapsed } = this.props;
        dispatch({
          type: 'global/changeRightCollapsed',
          payload: !rightCollapsed,
        });
      });
    } else {
      Modal.error({
        title: '提示',
        content: '请选择配置并保存',
        okText: '确定',
      });
    }
  };

  // 保存B区域的大小size
  bcompmentSizeAddHandler = (sizePayload, saveBBoxNames, saveABoxNames) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/bcompmentSizeUpdate',
      sizePayload,
      saveBBoxNames,
      saveABoxNames,
    });
  };

  menuSelectedHandler = (value) => {
    const { dispatch } = this.props;
    const { bottomSelectableMenus } = this.state;
    const info = getPageInfo(value, bottomSelectableMenus);
    if (info) {
      dispatch({
        type: 'embedPage/add',
        payload: { selectedObj: info, activeKey: info.key },
      });
      dispatch({
        type: 'user/toggleMenuShowType',
      });
    }
  };

  // 通知取消显示
  hideAnnounceInfoModalHandler = () => {
    this.setState({
      noticeDetailVisible: false,
    });
  };

  rowClickCallback = (record) => {
    const { dispatch } = this.props;
    // 更改为已读
    dispatch({
      type: 'user/updateNoticeReadStatus',
      payload: { queryobj: { noticeId: record.id } },
    }).then((x) => {
      console.log(`updateNoticeReadStatusupdateNoticeReadStatus ${x}`);
    });

    this.setState({
      noticeDetailVisible: true,
      tongzhiDetail: record,
    });
  };

  hideModelHandler = () => {
    const { userTheme } = this.props;
    this.setState({
      themeVisible: false,
      themeValue: userTheme.themeId,
    });
  };

  openHelpDoc = () => {
    window.open('http://10.16.1.55:666/HiatmpPro/helpDoc/帮助文档.html');
  };

  ToggleMenuShowType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/toggleMenuShowType',
    });
  };

  checkLogin() {
    const timer = window.localStorage.getItem('timer');
    if (timer) {
      const passtime = new Date().getTime() - timer;
      const countDown = parseInt((this.experTime * 60000 - passtime) / 1000, 10); // 倒计时
      if (countDown <= 0) {
        // 注销
        window.location.href = '/HiatmpPro/logout?logoutfromlocal=CAS';
        this.clearSth();
      } else if (countDown <= 5) {
        // 倒计时
        message.destroy();
        message.warning(
          <span>
            您长时间未操作，系统将在{' '}
            <span style={{ fontSize: '14px', color: 'red' }}>{countDown}</span> 秒后自动注销
          </span>,
          5
        );
      } else {
        message.destroy();
      }
    } else {
      resetTimer();
    }
  }

  queryData() {
    const { dispatch } = this.props;
    const { isRefresh, updatePwdShow } = this.state;
    // 更新代码时候也不查数据
    if (!isRefresh || updatePwdShow) {
      clearInterval(this.interval);
      this.interval = setInterval(this.queryData, 30000);
    } else {
      dispatch({
        type: 'user/getNoticeList',
      });
    }
  }

  clearSth() {
    clearInterval(this.loginTimer);
    window.localStorage.removeItem('timer');
  }

  render() {
    const {
      menuShowType,
      currentUser,
      collapsed,
      rightCollapsed,
      setMenuCollapsed,
      match,
      leftMenus,
      tongzhiData,
      bcomponent,
      acomponent,
      bcompoentSize,
      userTheme,
      bcomponentNum,
      pwdComplexity,
    } = this.props;

    const {
      openKeys,
      selectedMenus,
      themeVisible,
      bottomSelectableMenus,
      visible,
      allCharts,
      workbenchVisible,
      noticeDetailVisible,
      tongzhiDetail,
      themeValue,
      updatePwdShow,
    } = this.state;

    const { breadcrumbNameMap = [] } = this.context;
    const baseComponent = breadcrumbNameMap.filter(x => x.path == match.path)[0];
    const baseComponentChild = baseComponent ? baseComponent.children : [];
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Divider />
        <Menu.Item key="relogin">
          <Icon type="login" />重新登录
        </Menu.Item>
        <Menu.Item key="updatePwd">
          <Icon type="key" />修改密码
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    const set = (
      <Menu className={styles.setList} selectedKeys={[]} onClick={this.onSetClick}>
        <Menu.Item key="workBenchConfig">工作区配置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="themeConfig">主题配置</Menu.Item>
      </Menu>
    );

    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : { openKeys };
    const menuStyle = visible
      ? { margin: '0', width: '100%' }
      : { margin: '0', width: '100%', height: '100%' };

    const layout = (
      <Layout style={{ overflow: 'hidden' }}>
        <Header className={styles.header}>
          <span style={{ fontSize: '30px', paddingLeft: '20px' }} />
          <div className={styles.right}>
            <Dropdown
              placement="bottomCenter"
              overlay={
                <NoticeShow tongzhiData={tongzhiData} rowClickCallback={this.rowClickCallback} />
              }
            >
              <span className={`${styles.action} ${styles.rightUser}`}>
                <Badge offset={[-4, 6]} count={tongzhiData.length}>
                  <Icon type="bell" style={{ color: 'white' }} />
                </Badge>
              </span>
            </Dropdown>
            {/* <Tooltip title="工作区配置"> */}
            <Dropdown overlay={set} placement="bottomCenter">
              <span className={`${styles.action} ${styles.rightUser}`}>
                <Icon type="setting" style={{ color: 'white' }} />
              </span>
            </Dropdown>
            {/* </Tooltip> */}
            {currentUser.name ? (
              <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.rightUser}`}>{currentUser.name}</span>
              </Dropdown>
            ) : (
              <Spin size="small" style={{ marginLeft: 8 }} />
            )}
          </div>
        </Header>
        <Layout>
          {/* 左边栏目 */}
          <div style={{ marginTop: setMenuCollapsed ? '0px' : '10px' }}>
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              breakpoint="md"
              onCollapse={this.onCollapse}
              width={143}
              className={styles.leftSider}
            >
              <Menu
                theme={userTheme.themeId == THEMES.dark ? 'dark' : 'light'}
                mode="inline"
                {...menuProps}
                onSelect={this.handleOnSelect}
                onOpenChange={this.handleOpenChange}
                selectedKeys={this.getCurrentMenuSelectedKeys()}
                style={menuStyle}
              >
                {this.getNavMenuItems(this.menus, '/kanban/kanban/', selectedMenus)}
              </Menu>
              <LeftConfigContainer
                selectedMenus={selectedMenus}
                visible={visible}
                ContainerType="left"
                onDropMenuCallback={this.onDropMenuCallback}
              />

              <div className={styles.setIcon} onClick={this.menuSettingHandler}>
                <Tooltip title="菜单配置">
                  <span style={{ display: collapsed ? 'none' : '' }}>
                    <img
                      alt="setting1"
                      src={
                        userTheme.themeId == THEMES.light
                          ? require('../assets/设置2.png')
                          : require('../assets/设置1.png')
                      }
                    />
                  </span>
                </Tooltip>
              </div>
              <div className={styles.menuIcon} onClick={this.ToggleMenuShowType}>
                <img
                  alt="menu"
                  src={
                    userTheme.themeId == THEMES.light
                      ? require('../assets/菜单2.png')
                      : require('../assets/菜单.png')
                  }
                />
              </div>
            </Sider>
          </div>
          {/* 左边栏目扩展第二个1 */}
          <div style={{ display: setMenuCollapsed ? 'none' : '' }}>
            <Sider
              trigger={null}
              collapsible
              collapsed={setMenuCollapsed}
              breakpoint="md"
              onCollapse={this.onCollapseSetMenu}
              width={300}
              className={styles.leftSider2}
            >
              <LeftConfigContainer
                selectedMenus={selectedMenus}
                flattedLeftMenus={bottomSelectableMenus}
                leftMenus={leftMenus}
                visible={visible}
                ContainerType="right"
                submitHandler={this.menuSubmitHandler}
                menuSettingHandler={this.menuSettingHandler}
              />
            </Sider>
          </div>
          {/* 中间展示主体部分 */}
          <Content className={styles.spinmask}>
            <Spin spinning={!setMenuCollapsed} size="small" indicator={<span />}>
              {workbenchVisible == true ? (
                <DragContainer
                  allCharts={allCharts}
                  acomponent={acomponent}
                  bcomponent={bcomponent}
                  bcomponentNum={bcomponentNum}
                  workbenchVisible={workbenchVisible}
                  ContainerType="WorkbenchConfigLeft"
                  onDropBoxCallback={this.onDropBoxCallback}
                  bcompmentSizeAddHandler={this.bcompmentSizeAddHandler}
                />
              ) : (
                <Switch>
                  {baseComponentChild.map(item => (
                    <Route
                      exact
                      key={item.path}
                      path={`${match.path}/${item.path}`}
                      component={item.component}
                    />
                  ))}
                  <Redirect exact from="/kanban/" to="/kanban/home" />
                </Switch>
              )}
            </Spin>
          </Content>

          {/* 右边扩展栏 */}
          <Sider
            trigger={null}
            collapsible
            collapsed={rightCollapsed}
            breakpoint="md"
            onCollapse={this.onCollapseRight}
            width={194}
            className={styles.rightSider}
          >
            <Spin spinning={!setMenuCollapsed} size="small" indicator={<span />}>
              <DragContainer
                allCharts={allCharts}
                bcomponent={bcomponent}
                acomponent={acomponent}
                bcompoentSize={bcompoentSize}
                workbenchVisible={workbenchVisible}
                workbenchVisibleCallback={this.onWorkbenchVisibleCallback}
                ContainerType="WorkbenchConfigRight"
                droppedAboxNamesDeleted={initChartId(acomponent)}
                droppedBboxNamesDeleted={initChartId(bcomponent)}
                workbenchSubmitHandler={this.workbenchSubmitHandler}
              />
            </Spin>
          </Sider>
        </Layout>
        <AnnounceInfoModal
          visible={noticeDetailVisible}
          record={tongzhiDetail}
          recordNoticeType="2"
          onCancel={this.hideAnnounceInfoModalHandler}
        />
      </Layout>
    );

    return (
      <div className={styles.base}>
        <div style={{ display: menuShowType == 'pingpu' ? 'none' : 'block' }}>{layout}</div>
        <div style={{ display: menuShowType == 'pingpu' ? 'block' : 'none' }}>
          <SectionPills
            ToggleMenuShowType={this.ToggleMenuShowType}
            leftMenus={leftMenus}
            menuSelectedHandler={this.menuSelectedHandler}
          />
        </div>
        {/* <SettingDarwer /> */}

        <Modal
          title="主题配置"
          visible={themeVisible}
          onOk={this.onThemeSaveHandler}
          onCancel={this.hideModelHandler}
          width="640px"
        >
          <div>
            <span style={{ display: 'inline-block', paddingLeft: '30px' }}>
              <Card
                style={{ width: '250px', height: '189px' }}
                bodyStyle={{ padding: 0 }}
                cover={<img alt="example" src={require('../assets/classthem.PNG')} />}
                actions={[
                  <Radio
                    defaultChecked={themeValue == THEMES.light}
                    checked={themeValue == THEMES.light}
                    onChange={this.onChange}
                    value="2"
                  >
                    经典主题
                  </Radio>,
                ]}
              />
            </span>
            <span style={{ display: 'inline-block', paddingLeft: '30px' }}>
              <Card
                style={{ width: '250px', height: '189px' }}
                bodyStyle={{ padding: 0 }}
                cover={<img alt="example" src={require('../assets/yaheitheme.PNG')} />}
                actions={[
                  <Radio
                    defaultChecked={themeValue == THEMES.dark}
                    checked={themeValue == THEMES.dark}
                    onChange={this.onChange}
                    value="1"
                  >
                    雅黑主题
                  </Radio>,
                ]}
              />
            </span>
          </div>
        </Modal>
        <UpdatePwd
          visible={updatePwdShow}
          onClose={() => {
            this.setState({ updatePwdShow: false });
          }}
          userid={currentUser?.userId}
          userpwd={currentUser?.userpwd}
          pwdComplexity={pwdComplexity}
        />
      </div>
    );
  }
}

export default connect(({ user, global, embedPage }) => ({
  currentUser: user.currentUser,
  menuShowType: user.menuShowType,
  userTheme: user.userTheme,
  bcomponentNum: user.bcomponentNum,
  allCharts: user.allCharts,
  bcompoentSize: user.bcompoentSize,
  bcomponent: user.bcomponent,
  acomponent: user.acomponent,
  parameterconfig: user.parameterconfig,
  pwdComplexity: user.pwdComplexity,
  collapsed: global.collapsed,
  leftMenus: global.leftMenus,
  rightCollapsed: global.rightCollapsed,
  setMenuCollapsed: global.setMenuCollapsed,
  fetchingNotices: global.fetchingNotices,
  notices: global.notices,
  tongzhiData: user.tongzhiData, // 通知数据
  embedPage,
  toDoPagination: user.toDoPagination,
}))(BasicLayout);
