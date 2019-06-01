/**
 * Created by Administrator on 2018/7/11.
 */
import { Row, Tree, Tooltip } from 'antd';
import React from 'react';

import styles from './DepartmentTree.less';
import { QUERYUSER } from '../../config/authconstant';
import Ellipsis from '../Ellipsis';

const TreeNode2 = Tree.TreeNode;

class DepartmentTree extends React.Component {
  constructor(props) {
    const { expandedKeys = [] } = props;
    super(props);
    this.state = {
      expandedKeys, // 展开节点
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
    const { dispatch, queryParams, codeList } = this.props;
    // 权限判断
    let havePerssion = false;
    if (Array.isArray(codeList)) {
      if (codeList.indexOf(QUERYUSER) >= 0) {
        havePerssion = true;
      }
    }
    if (havePerssion) {
      dispatch({
        type: 'accountmanage/getOperatorList',
        payload: {
          ...queryParams,
          cdepartmentid: e.node.props.dataRef.id,
          nlevel: e.node.props.dataRef.grade,
        },
      });
    }
    dispatch({
      type: 'accountmanage/setSelDeptInfo',
      payload: {
        cdepartmentid: e.node.props.dataRef.id,
        nlevel: e.node.props.dataRef.grade,
      },
    });
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
            title={
              <Tooltip title={item.name}>
                {item.name}
              </Tooltip>
            }
            dataRef={item}
          >{loop(item.children)}
          </TreeNode2>
        );
      }
      return (
        <TreeNode2
          key={item.id}
          title={
            <Tooltip title={item.name}>
              {item.name}
            </Tooltip>
        }
          dataRef={item}
        />
      );
    });

    return (
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
    );
  }
}


export default DepartmentTree;
