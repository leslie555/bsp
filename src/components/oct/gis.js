/**
 * Created by Administrator on 2018/7/12.
 */
/* eslint-disable */
import { Row, Tree } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './gis.less';
const TreeNode2 = Tree.TreeNode;



class GisInfo extends React.Component {
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
    const {menuList} = this.props;
    const { expandedKeys } = this.state;
    console.log(menuList);
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode2 key={item.id}  title={item.name} dataRef={item}>
            {loop(item.children)}
          </TreeNode2>
        );
      }
      return <TreeNode2 key={item.id} title={item.name} dataRef={item} />;
    });

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className={styles.menuList}>
            <Row type="flex" justify="space-around" align="middle" className={styles.header}>地图展示</Row>
            <Row className={styles.treeStyle}>
              <Tree
                expandedKeys={expandedKeys}
                onSelect={this.onNodeSelect}
                onExpand={this.onExpend}
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
GisInfo.propTypes = {
  menuList: PropTypes.array,
};
GisInfo.defaultProps = {
  expandedKeys:['0'],
  menuList: [],

};
export default GisInfo;
