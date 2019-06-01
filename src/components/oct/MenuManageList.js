/**
 * Created by Administrator on 2018/7/12.
 */
/* eslint-disable */
import { Row, Tree } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './MenuManageList.less';
const TreeNode2 = Tree.TreeNode;



class MenuManageInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0'], // 展开节点
    };

  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  onNodeSelect = (selectedKeys, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MenuManageModel/selectedRowKeys',
      payload: { menuId: e.node.props.dataRef.id, nLevel: e.node.props.dataRef.grade,menuInfo:e.node.props.dataRef.info},
    });
  };
  onExpend = (expandedKeys, epNode) => {
    this.setState({ expandedKeys });
  };


  render() {
    const {title} = this.props;
    const {menuList} = this.props;
    const { expandedKeys } = this.state;

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className={styles.menuList}>
            <Row type="flex" justify="space-around" align="middle" className={styles.header}>{title}</Row>
            <Row className={styles.treeStyle}>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
MenuManageInfo.propTypes = {
  // menuList: PropTypes.array,
};
MenuManageInfo.defaultProps = {
  expandedKeys:['0'],
  // menuList: [],
  title:'好吧'
};
export default MenuManageInfo;
