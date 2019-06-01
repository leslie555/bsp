/**
 '' * Created by Administrator on 2018/7/12.
 * 设备分组统计查询的中间设备分组
 */
/* eslint-disable */
import { Row, Tree, Button, Col } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from '../menuManage/MenuManageList.less';
const TreeNode2 = Tree.TreeNode;



class DeviceGroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [], // 展开节点
      // value: [], //选中的设备分组
    };

  }

  componentWillMount() {
  }

  componentDidMount() {
  }
  
  onExpend = (expandedKeys, epNode) => {
    this.setState({ expandedKeys });
  };
  //保存
  onSaveHandle() {
    const { onSave } = this.props;
    console.log('保存');
    onSave();
    // this.setState({  });
  }

  onCheck = (checkedKeys, e) => {
    const { onChange } = this.props;
    console.log(checkedKeys);
    onChange(checkedKeys);
  }

  render() {
    const {menuList, onNodeSelect, tree } = this.props;
    const { expandedKeys } = this.state;
    let exp_keys = [];
    const loop = data => data.map((item) => {
      if (item.lstSubGroup && item.lstSubGroup.length) {
        exp_keys.push(item.id);
        return (
          <TreeNode2 key={item.id}  title={item.name} dataRef={item} value={item.id}>
            {loop(item.lstSubGroup)}
          </TreeNode2>
        );
      }
      return <TreeNode2 key={item.id} title={item.name} dataRef={item} disableCheckbox />;
    });

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className={styles.menuList}>
            <Row type="flex" justify="space-around" align="middle" className={styles.header}>设备分组</Row>
            <Row className={styles.treeStyle}>
              <Col span={20}>
                <Tree
                  checkable
                  defaultExpandedKeys={["8e6fb077fb1049ba8d0ea68970d2a1d6"]}
                  value={["8e6fb077fb1049ba8d0ea68970d2a1d6"]}
                  onCheck={this.onCheck}
                >
                  {loop(menuList)}
                </Tree>
              </Col>
              <Col sapn={2}>
                <Button
                type="primary"
                onClick={() => { this.onSaveHandle(); }}   
                style={{ marginTop: '2%' }}             
              >保存
              </Button>
              </Col>
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
DeviceGroupList.propTypes = {
  menuList: PropTypes.array,
};
DeviceGroupList.defaultProps = {
  expandedKeys:['0'],
  menuList: [],
};
export default DeviceGroupList;