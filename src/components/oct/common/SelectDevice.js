/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Table, Form, Input, Button, Row, Col, message, Tree } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import Ellipsis from '../../Ellipsis';
import styles from './DeviceSelect.less';
import { DEV_TYPE } from '../../../config/enums';
import { findDeviceById, addDeviceToGroup, addTest } from '../../../services/octDeviceGroup';

const FormItem = Form.Item;
const { TreeNode } = Tree;
// function onOnOK() {
//   return new Promise((resolve, reject) => {
//     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
//   });
// }
function getAllChildren(arr, v) {
  arr.push(v.props.areaId);
  if (v.props.children) {
    v.props.children.forEach(x => {
      getAllChildren(arr, x);
    });
  }
}

let nowDevice = [];
let searchDevice;
class SelectDevice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devicelist: [],
      searchLoading: false,
      selectedKeys: [],
      searchValue: '', // 搜索值
      filterArea: [],
      filterDevideID: '',
      selectedNodes: [], // 选中的树节点
      selAllOrNot: true, // 选择所有设备或者取消选择所有设备
      // selectedRowKeys: [], // Check here to configure the default column
    };
    this.renderResourceTreeNodes = this.renderResourceTreeNodes.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { dispatch, devicelistsum } = this.props;
    const { devicelist } = this.state;
    console.log(devicelistsum);
    this.setState({
      devicelist: devicelistsum,
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  onClose = () => {
    const { onClose } = this.props;
    // this.selectedRows = [];
    this.setState({ selectedKeys: [] });
    onClose();
  }

  // 添加设备到分组
  onOk = () => {
    const { onOk, nodeInfo, deviceid, dispatch } = this.props;
    const { selectedKeys } = this.state;
    this.setState({ selectedKeys: deviceid });
    console.log(nodeInfo.id);
    console.error('添加到分组');
    console.log(selectedKeys);
    const values = selectedKeys.join(',');
    // const deviceid = selectedkeys;
    const { id } = nodeInfo;
    onOk(id, values);
    this.setState({ selectedKeys: [], devicelist: [] });
  }

  onSelectChange = (deviceid) => {
    console.log('selectedKeys changed: ', deviceid);
    this.setState({ selectedKeys: deviceid });
  }

  // 根据枚举值获取枚举名
  getEnumValue(enumtypeid, enumvalue) {
    const { enumList } = this.props;
    for (let i = 0; i < enumList.length; i += 1) {
      const enumObj = enumList[i];
      if (enumObj.enumtypeid === enumtypeid && enumObj.enumvalue === enumvalue) {
        return enumObj.enumname;
      }
    }
  }

  getAllRoadList(selRoad) {
    const { roadtree } = this.props;
    if (selRoad && selRoad.length > 0) {
      const allRoadID = [];
      return allRoadID;
    } else {
      return [];
    }
  }

  getFilter = () => {
    nowDevice = [];
    const { devicelist, filterArea, filterDevideID } = this.state;
    // deviceaddress: "凤凰高架路进城K2+185处"
    // deviceid: "3013-284003"
    // sectionid: "10201"
    if (filterArea.length > 0) {
      devicelist.forEach(v => {
        if (filterArea.indexOf(v.sectionid) >= 0) {
          nowDevice.push(v);
        }
      });
    } else if (filterDevideID) {
      devicelist.forEach(v => {
        if (v.deviceid.indexOf(filterDevideID) > 0) {
          nowDevice.push(v);
        }
      });
    } else {
      nowDevice = devicelist;
      return nowDevice;
    }
    return nowDevice;
  }

  changeSelected = (keys) => {
    this.setState({
      // selectDevice: keys,
    });
  }

  // 选择所有设备
  selAll = (e) => {
    const { devicelist, selAllOrNot } = this.state;
    const selKeys = [];
    if (selAllOrNot) {
      this.getFilter().forEach(v => {
        selKeys.push(v.deviceid);
      });
    }
    this.setState({
      selectedKeys: selKeys,
      selAllOrNot: !selAllOrNot,
    });
  }

  //  按下查询按钮
  handleSearch = (e) => {
    // this.getFilter();
    // this.setState({ searchLoading: true });
    const { form } = this.props;
    const deviceid = form.getFieldValue('deviceid');
    const { devicelist, searchValue } = this.state;
    const myList = devicelist;
    // findDeviceById({ deviceid }).then((data) => {
    //   console.log(data.list);
    //   this.setState({ searchLoading: false });
    //   if (data && data.result) {
    //     this.setState({ devicelist: data.list });
    //   }
    // }).catch((err) => {
    //   console.error(`设备查询出错：${JSON.stringify(err)}`);
    //   this.setState({ searchLoading: false });
    // });
    console.log('nowdevice', nowDevice);
    searchDevice = nowDevice.filter(item => item.deviceid.indexOf(searchValue) > -1);
    console.log('searchdevice', searchDevice);
    this.setState({ searchValue: '' });
  }

  // handleFocus = () => {
  //   this.setState({
  //     searchValue: '',
  //   });
  // }

  DeviceTreeSelect(selectedKeysNode, e) {
    const { form } = this.props;
    form.setFieldsValue({
      deviceid: '',
    });
    this.setState({ selectedNodes: selectedKeysNode });
    if (selectedKeysNode) {
      const selKeys = [];
      const nodeChildren = e.node.getNodeChildren();
      if (nodeChildren && nodeChildren.length > 0) {
        nodeChildren.forEach(v => {
          getAllChildren(selKeys, v);
        });
      }
      selKeys.push(e.node.props.areaId);
      this.setState({
        filterArea: selKeys,
      });
    } else {
      this.setState({
        filterArea: [],
      });
    }
  }

  // 构建资源树
  renderResourceTreeNodes(data) {
    if (data) {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode {...item}>
              {this.renderResourceTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...item} />;
      });
    }
  }

  render() {
    const { visible, form, currentId, nodeInfo, roadtree, devicelistsum } = this.props;
    const {
      searchLoading,
      selectedNodes,
      selectedKeys,
      selAllOrNot,
      searchValue,
      devicelist,
      filterArea,
      filterDevideID } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const columns = [
      {
        align: 'center',
        title: '设备id',
        dataIndex: 'deviceid',
        width: '30%',
        render: (text) => {
          return (
            <Ellipsis tooltip lines={1}>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        align: 'center',
        title: '设备位置',
        dataIndex: 'deviceaddress',
        width: '70%',
        render: (text) => {
          return (
            <Ellipsis tooltip length={5} lines={1}>
              {text}
            </Ellipsis>
          );
        },
      },
    ];
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: this.onSelectChange,
    };
    // const hasSelected = selectedkeys.length > 0;
    const okBtnProp = {
      // disabled: !hasSelected,
      nodeInfo,
      selectedKeys,
    };
    const selAllTitle = selAllOrNot ? '选择所有设备' : '取消选择所有设备';
    return (
      <div>
        <Form layout="inline">
          <FormItem {...formItemLayout} label="设备编号" className={styles.formitem}>
            <Input maxLength="12" value={searchValue} onChange={(e) => { this.setState({ searchValue: e.target.value.trim() }); }} />
          </FormItem>
          <FormItem>
            <Button
              onClick={this.handleSearch}
              loading={searchLoading}
            >
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.selAll}>{selAllTitle}</Button>
          </FormItem>
          <FormItem>
            <span>已选择{selectedKeys.length}个设备</span>
          </FormItem>
        </Form>
        <Row>
          <Col span={6}>
            <Tree
              autoExpandParent
              selectedKeys={selectedNodes}
              onSelect={
                (selectedKeysNode, e) => {
                  searchDevice = null;
                  this.DeviceTreeSelect(selectedKeysNode, e);
                  this.getFilter();
                  // this.handleSearch();
                }}
            >
              {this.renderResourceTreeNodes(roadtree)}
            </Tree>
          </Col>
          <Col span={18}>
            <Table
              rowKey="deviceid"
              columns={columns}
              // pagination={pagination}
              loading={searchLoading}
              // onChange={onPageChange}
              dataSource={searchDevice || this.getFilter()}
              rowSelection={rowSelection}
              rowClassName={
                (record, index) => {
                  if (record.deviceid === currentId) {
                    return 'selectRow';
                  } else {
                    return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                  }
                }
              }
              // onRow={(record) => {
              //   return {
              //     onClick: () => {
              //       this.setState({ selectedkeys: deviceid });
              //     },
              //   };
              // }}
              scroll={{ y: 650 }}
              locale={{ emptyText: '暂无数据' }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
SelectDevice.prototypes = {
  devicelist1: PropTypes.array,
  // loading: PropTypes.bool,
  // enumList: PropTypes.array.isRequired,
  // departmentlist: PropTypes.array,
  // selectedKeys: PropTypes.array,
  // pagination: PropTypes.object,
  // onPageChange: PropTypes.func,
  // changeSelected: PropTypes.func,
  // onView: PropTypes.func,
  // onEdit: PropTypes.func,
  // onAdd: PropTypes.func,
  // onDelete: PropTypes.func,
  currentId: PropTypes.string,
};

export default Form.create()(SelectDevice);
