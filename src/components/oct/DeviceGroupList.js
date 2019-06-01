/**
 * Created by Administrator on 2018/7/12.
 */
/* eslint-disable */
import { Row, Tree } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from '../menuManage/MenuManageList.less';
const TreeNode2 = Tree.TreeNode;



class DeviceGroupList extends React.Component {
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

  // onNodeSelect = (selectedKeys, e) => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'octDeviceGroup/selectedRowKeys',
  //     payload: { menuId: e.node.props.dataRef.id, nLevel: e.node.props.dataRef.grade,menuInfo:e.node.props.dataRef.info},
  //   });
  // };
  onExpend = (expandedKeys, epNode) => {
    this.setState({ expandedKeys });
  };


  render() {
    const {menuList, onNodeSelect} = this.props;
    const { expandedKeys } = this.state;
    const loop = data => data.map((item) => {
      if (item.lstSubGroup && item.lstSubGroup.length) {
        return (
          <TreeNode2 key={item.id}  title={item.name} dataRef={item}>
            {loop(item.lstSubGroup)}
          </TreeNode2>
        );
      }
      return <TreeNode2 key={item.id} title={item.name} dataRef={item} />;
    });

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className={styles.menuList}>
            <Row type="flex" justify="space-around" align="middle" className={styles.header}>菜单结构</Row>
            <Row className={styles.treeStyle}>
              <Tree
                defaultExpandAll={true}
                expandedKeys={expandedKeys}
                onSelect={onNodeSelect}
                onExpand={this.onExpend}
              >
                {loop(menuList)}
              </Tree>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
DeviceGroupList.propTypes = {
  menuList: PropTypes.array,
};
DeviceGroupList.defaultProps = {
  expandedKeys:['0'],
  menuList: [],
};
export default DeviceGroupList;
