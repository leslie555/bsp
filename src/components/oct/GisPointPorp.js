/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Row, Button, Tabs, Tree, Tooltip } from 'antd';
import { QUERYUSER } from '../../config/authconstant';
import styles from './GisMarkerInfo.less';

const { TabPane } = Tabs;
const TreeNode2 = Tree.TreeNode;

class GisPointProp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: 1,
    };
  }

  onCheckLuDuan = (checkedKeys) => {
    const { onLuDuan } = this.props;
    onLuDuan(checkedKeys.join(','), '1');
  }

  onCheckWeiHu = (checkedKeys) => {
    const { onLuDuan } = this.props;
    onLuDuan(checkedKeys.join(','), '2');
  }

  onpolice = (checkedKeys) => {
    const { onLuDuan } = this.props;
    onLuDuan(checkedKeys.join(','), '3');
  }

  onNodeSelect = (selectedKeys, e) => {
  }

  onExpend = (expandedKeys, epNode) => {
    this.setState({ expandedKeys });
  }

  callback(key) {
    const { flag } = this.state;
    alert(flag);
    // console.log(key);
  }

  test() {
    const { onTestClick } = this.props;
    onTestClick();
  }

  render() {
    const { pt, departmentList, departmentListwh, menuList, policearea, weihu,
      onChange, checkedKeys, checkedKeys1, checkedKeys2 } = this.props;
    const { expandedKeys } = this.state;
    const loopRoad = data => data.map((item) => {
      // console.log(item);
      if (item.lstSubGroup && item.lstSubGroup.length) {
        return (
          <TreeNode2 key={item.areaid} title={item.name} dataRef={item}>
            {loopRoad(item.lstSubGroup)}
          </TreeNode2>
        );
      }
      return <TreeNode2 key={item.areaid} title={item.name} dataRef={item} />;
    });
    const loopPolice = data => data.map((item) => {
      if (item.listPolice && item.listPolice.length) {
        return (
          <TreeNode2 key={item.areaid} title={item.policeName} dataRef={item}>
            {loopPolice(item.listPolice)}
          </TreeNode2>
        );
      }
      return <TreeNode2 key={item.areaid} title={item.policeName} dataRef={item} />;
    });
    const loopWeihu = data => data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode2 key={item.id} title={item.name} dataRef={item}>
            {loopWeihu(item.children)}
          </TreeNode2>
        );
      }
      return <TreeNode2 key={item.id} title={item.name} dataRef={item} />;
    });
    return (
      <div className="outline-out" style={{ height: 'calc(100% - 406px)', overflow: 'auto' }}>
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Tabs style={{ height: 'calc(100% - 506px)' }} onChange={onChange}>
              <TabPane tab="路段" key="1">
                <Tree
                  checkable
                  checkedKeys={checkedKeys}
                  onCheck={this.onCheckLuDuan}
                >
                  {loopRoad(menuList)}
                </Tree>
              </TabPane>
              <TabPane tab="警务区域" key="2" style={{ height: 470, overflow: 'auto' }}>
                <Tree
                  checkable
                  checkedKeys={checkedKeys1}
                  onCheck={this.onpolice}
                >
                  {loopPolice(policearea)}
                </Tree>
              </TabPane>
              <TabPane tab="维护施工单位" key="3">
                <Tree
                  checkable
                  checkedKeys={checkedKeys2}
                  onCheck={this.onCheckWeiHu}
                >
                  {loopWeihu(weihu)}
                </Tree>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
GisPointProp.prototypes = {
};
export default Form.create()(GisPointProp);
