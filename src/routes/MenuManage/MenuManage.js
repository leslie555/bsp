import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Menu, Breadcrumb, Icon } from 'antd';
import MenuManageList from '../../components/menuManage/MenuManageList';
import MenuManageInfo from '../../components/menuManage/MenuManageInfo';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class MenuManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'MenuManageModel/queryMenuList', payload: { } });
  }

  render() {
    const { MenuManageModel, dispatch, loading } = this.props;

    const {
      menuList = [],
      expandedKeys,
      selectMenuInfo,
      currOperateList,
      operateRight,
      selectMenuId,
      selectMenuLevel,
    } = MenuManageModel;

    const ListProps = {
      menuList,
      dispatch,
      expandedKeys,
      loading,
    };


    const OperateProps = {
      dispatch,
      menuList,
      loading,
      selectMenuInfo,
      currOperateList,
      operateRight,
      selectMenuId,
      selectMenuLevel,
      onNeedRefresh: () => {
        dispatch({ type: 'MenuManageModel/queryMenuList', payload: { } });
      },
    };
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Col span={4} style={{ height: '100%' }}>
          <MenuManageList {...ListProps} />
        </Col>
        <Col span={20} style={{ height: '100%', width: '80%', margin: '0 1%' }}>
          <MenuManageInfo {...OperateProps} />
        </Col>

      </div>

    );
  }
}

function mapStateToProps({ MenuManageModel, loading }) {
  console.log(MenuManageModel);
  return { MenuManageModel, loading: loading.models.MenuManageModel };
}

export default connect(mapStateToProps)(MenuManage);
