/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col, Icom } from 'antd';
import List from '../../components/oct/RoadSectionList';
import Info from '../../components/oct/RoadSectionInfo';

const { confirm } = Modal;

class RoadSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '3', // 1：添加，3：编辑
      dataSource: [],
      nodeSelected: false, // 是否选中了node
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octRoadSection/queryMenuList',
      payload: {},
    });
  }

  RefreshTree() {
    const { dispatch } = this.props;
    dispatch({ type: 'octRoadSection/queryMenuList', payload: { } });
  }

  render() {
    const { dataSource, nodeSelected } = this.state;
    const { octRoadSection, common, dispatch, loading } = this.props;
    const {
      expandedKeys,
      menuList,
      nodeInfo,
    } = octRoadSection;
    const { enumList } = common;
    const { flag } = this.state;
    const that = this;

    const listprops = {
      menuList,
      dispatch,
      expandedKeys,
      loading,
      onNodeSelect: (selectedKeysNode, e) => {
        this.setState({
          nodeSelected: (selectedKeysNode.length > 0),
        });
        dispatch({
          type: 'octRoadSection/updateState',
          payload: { nodeInfo: e.node.props.dataRef },
        });
        console.error(this.props);
      },
    };
    const info = {
      nodeSelected,
      nodeInfo,
      dispatch,
      enumList,
      flag,
      onNeedRefresh: () => {
        dispatch({ type: 'octRoadSection/queryMenuList', payload: { } });
      },
    };
    return (
      <div>
        <Row>
          <Col span={6}>
            <List {...listprops} />
          </Col>
          <Col span={18} style={{ width: '70%', marginRight: '1%' }}>
            <Row>
              <Info {...info} />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ octRoadSection, common, loading }) {
  return { octRoadSection, common, loading: true };
}
export default connect(mapStateToProps)(RoadSection);
