/**
 * Created by Administrator on 2018/7/12.
 */
/* eslint-disable */
import { Row, Tree } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from '../menuManage/MenuManageList.less';
const TreeNode2 = Tree.TreeNode;



class PoliceAreaList extends React.Component {
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
  // 来自菜单管理list
  // onNodeSelect = (selectedKeys, e) => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'octPoliceArea/selectedRowKeys',
  //     payload: { nodeInfo: e.node.props.dataRef},
  //   });
  // };

  // onExpend = (expandedKeys) => {
  //   this.setState({ expandedKeys });
  // };


  render() {
    const {menuList, onNodeSelect} = this.props;
    const { expandedKeys } = this.state;
    const loop = data => data.map((item) => {
      if (item.listPolice && item.listPolice.length) {
        return (
          <TreeNode2 key={item.policeId}  title={item.policeName} dataRef={item}>
            {loop(item.listPolice)}
          </TreeNode2>
        );
      }
      return <TreeNode2 key={item.policeId} title={item.policeName} dataRef={item} />;
    });

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className={styles.menuList}>
            <Row type="flex" justify="space-around" align="middle" className={styles.header}>警务区管理</Row>
            <Row className={styles.treeStyle}>
              <Tree
                autoExpandParent={true}
                // expandedKeys={expandedKeys}
                onSelect={onNodeSelect}
                // onExpand={this.onExpend}
              >
                {loop(menuList)}
              </Tree>
            </Row>
            {/* <Row className={styles.headerUnder}>直属机构</Row>
         <Row>
         <Tree

         defaultExpandedKeys={expandedKeys2}
         >
         {loop(deptsUnder)}
         </Tree>
         </Row> */}
          </div>
        </div>
      </div>
    );
  }
}
PoliceAreaList.propTypes = {
  menuList: PropTypes.array,
};
PoliceAreaList.defaultProps = {
  expandedKeys:['0'],
  menuList: [],
};
export default PoliceAreaList;
