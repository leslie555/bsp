/**
 * Created by Administrator on 2018/7/11.
 */
import { Row, Tree } from 'antd';
import React from 'react';

import styles from './DepartmentTree.less';

const TreeNode2 = Tree.TreeNode;

class DepartmentTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [], // 展开节点
    };
  }

  componentWillReceiveProps(nextProps) {
    const { departmentList } = this.props;
    if (!departmentList.length > 0 && nextProps.departmentList.length > 0) {
      const { expandedKeys } = nextProps;
      this.setState({ expandedKeys });
    }
  }

  onNodeSelect = (selectedKeys, e) => {
    const { onTreeSelect } = this.props;
    const { dataRef } = e.node.props;
    const deptid = dataRef.id;
    onTreeSelect(deptid);
  }

  onExpend = (expandedKeys, epNode) => {
    this.setState({ expandedKeys });
  }

  render() {
    const { departmentList } = this.props;
    const { expandedKeys } = this.state;

    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode2
            key={item.id}
            title={item.name}
            dataRef={item}
          >{loop(item.children)}
          </TreeNode2>
        );
      }
      return <TreeNode2 key={item.id} title={item.name} dataRef={item} />;
    });

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className={styles.department}>
            <Row type="flex" justify="space-around" align="middle" className={styles.header}>组织架构</Row>
            {/* <Row className={styles.headerInter}>内设机构</Row> */}
            <Row className={styles.treeStyle}>
              <Tree
                expandedKeys={expandedKeys}
                onSelect={this.onNodeSelect}
                onExpand={this.onExpend}
              >
                {loop(departmentList)}
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


export default DepartmentTree;
