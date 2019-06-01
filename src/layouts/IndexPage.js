/**
 * 开发集成页面
 * create by jingzy
 * 2018-07-02
 */
import React from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Layout, Tabs, Row, Col, Menu, Icon, Button, Badge, Dropdown, Modal } from 'antd';
import DocumentTitle from 'react-document-title';

import SiderMenu from 'components/SiderMenu';
import SettingDarwer from '../components/SettingDrawer';

import styles from './IndexPage.less';
import NotFound from '../routes/Exception/404';
import UpdatePwd from '../components/AccountManage/UpdatePwd';
import { getCurrentUserInfo } from '../services/accmservice';
// import DefaultRoute from '../routes/AccountManage/AccountManage';

const { Header, Content } = Layout;

class IndexPage extends React.Component {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      siderMenuActiveKey: '1', // 侧边Menu默认页
      tabActiveKey: '1', // tab默认页
      userDrop: false, // 用户下拉菜单是否打开
      messageCount: 0,
      updatePwdShow: false, // 修改密码窗口显示
      userInfo: {}, // 当前登录用户信息
    };
    this.handleChangeTabs = this.handleChangeTabs.bind(this);
    this.onUserMenuClick = this.onUserMenuClick.bind(this);
  }

  getChildContext() {
    const { location, getRouteData } = this.props;
    return {
      location,
      breadcrumbNameMap: getRouteData('BasicLayout'),
    };
  }

  componentDidMount() {
    /* getCurrentUserInfo().then((result) => {
      if (result && result.user) {
        this.setState({ userInfo: result.user });
        if (result.user.firstflag == 1) {
          Modal.info({
            title: '提示',
            content: '当前账号为新建账号，密码过于简单，请及时修改密码。',
          });
        }
      }
    }); */
  }

  onUserMenuClick(e) {
    const { userDrop } = this.state;
    const url = window.location.href;
    switch (e.key) {
      case '1': // 重新登录
        if (url.indexOf('?') > -1) {
          window.location.href = `${window.location.href}&logoutfromlocal=CAS`;
        } else {
          window.location.href = `${window.location.href}logout?logoutfromlocal=CAS`;
        }
        break;
      case '2': // 修改密码
        this.setState({ updatePwdShow: true });
        break;
      case '3': // 退出
        window.open('logout?logoutfromlocal=CAS', '_self', '');
        window.close();
        break;
      default:
        break;
    }
  }

  getPageTitle() {
    const { location, getRouteData } = this.props;
    const { pathname } = location;
    let title = '管控5.8';
    getRouteData('BasicLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name}`;
      }
    });
    return title;
  }

  // Tab改变时
  handleChangeTabs(key) {
    this.setState({ tabActiveKey: key, siderMenuActiveKey: key });
  }

  render() {
    const {
      tabPanels,
      siderMenuActiveKey,
      tabActiveKey,
      userDrop,
      messageCount,
      updatePwdShow,
      userInfo,
    } = this.state;
    const { collapsed, getRouteData, navData, location, dispatch } = this.props;

    const menu = (
      <Menu onClick={this.onUserMenuClick}>
        <Menu.Item key="1">重新登录</Menu.Item>
        <Menu.Item key="2">修改密码</Menu.Item>
        <Menu.Item key="3">退出</Menu.Item>
      </Menu>
    );

    const layout = (
      <Layout style={{ height: '100%' }}>
        <Header className={styles.headerStyle}>
          <Row type="flex" justify="space-between">
            <Col span={12} className={styles.title}>
              管控5.8系统
            </Col>
            <Col>
              <Button>
                <Badge dot={messageCount} showZero>
                  <Icon type="bulb" style={{ fontsize: 16 }} />
                </Badge>
              </Button>
              <Button>
                <Icon type="setting" style={{ fontsize: 16 }} />
              </Button>
              <Dropdown overlay={menu}>
                <Button>
                  <Icon type="user" />
                  {userInfo.username}
                  <Icon type={userDrop ? 'up' : 'down'} />
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Layout>
          <SiderMenu
            collapsed={collapsed}
            navData={navData}
            location={location}
            dispatch={dispatch}
            handleChangeSideMenu={this.handleChangeSideMenu}
          />
          <Layout>
            <Content>
              <Switch>
                {getRouteData('BasicLayout').map(item => (
                  <Route
                    exact={item.exact}
                    path={`${item.path}`}
                    key={item.path}
                    component={item.component}
                  />
                ))}
                {/* <Redirect exact from="/view" to="/view" /> */}

                <Route component={NotFound} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.normal}>
          {layout}
          {/* <SettingDarwer /> */}
          <UpdatePwd
            visible={updatePwdShow}
            onClose={() => {
              this.setState({ updatePwdShow: false });
            }}
            userid={userInfo.userid}
            userpwd={userInfo.userpwd}
          />
        </div>
      </DocumentTitle>
    );
  }
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
