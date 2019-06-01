/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Upload, Tag, Input, Modal } from 'antd';
// import Highlighter from 'react-highlight-words';
import { DEV_TYPE, STATE } from '../../config/enums';
import { OCT_DEVICE_MANAGEMENT, OCT_DEVICE_FTP } from '../../config/authconstant';

const { confirm: confirmx } = Modal;
const { Dragger } = Upload.Dragger;
const { Search } = Input;
class GisDeviceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '2', // 2代表浏览，1代表编辑
      selID: null, // 已选择的device id
      searchText: '',
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  getSelectedDeviceInfo = () => {
    const { selID } = this.state;
    return selID;
  }

  getSelectedDeviceID = () => {
    const { selID } = this.state;
    const { deviceid } = selID;
    return deviceid;
  }

  getSelectedDeviceLng = () => {
    const { selID } = this.state;
    const { longitude } = selID;
    return longitude;
  }

  getSelectedDeviceLat = () => {
    const { selID } = this.state;
    const { latitude } = selID;
    return latitude;
  }

  getEnumValue(enumtypeid, enumvalue) {
    const { enumList } = this.props;
    for (let i = 0; i < enumList.length; i += 1) {
      const enumObj = enumList[i];
      if (enumObj.enumtypeid === enumtypeid && enumObj.enumvalue === enumvalue) {
        return enumObj.enumname;
      }
    }
  }

  // 编辑信息
  EditDeviceInfoSelect = (record) => {
    const { startInit, startEdit } = this.props;
    // this.setState({
    //   selID: record,
    // });
    if (record.latitude == null) {
      confirmx({
        title: '确认新增',
        content: '该设备尚未设置经纬度，将会通过点击地图设置新增设备经纬度。是否继续？',
        okText: '继续',
        cancelText: '取消',
        onOk() {
          startInit(record);
        },
        onCancel() {
        },
      });
    } else {
      confirmx({
        title: '确认变更位置',
        content: '确认变更该设备经纬度信息？',
        okText: '继续',
        cancelText: '取消',
        onOk() {
          startEdit(record);
        },
        onCancel() {
        },
      });
    }
  }

  // 查看信息
  showDeviceInfoSelect = (record) => {
    const { startInit, showMarker, changeSelected } = this.props;
    if (record.latitude == null) {
      confirmx({
        title: '确认新增',
        content: '该设备尚未设置经纬度，请通过编辑按钮进行经纬度设置',
        okText: '继续',
        cancelText: '取消',
        onOk() {
        },
        onCancel() {
        },
      });
    } else {
      showMarker(record, true);
    }
  }

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = () => {
    // clearFilters();
    this.setState({ searchText: '' });
  }

  searchChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  render() {
    const { codeList, dispatch, enumList, onAdd, onEdit, startInit,
      loading, devicelist, deviceCount, onPageChange, selectedKeys,
      currentId, dosearch } = this.props;
    const { DeviceUploadVisible, visible, entity, flag, ftpvisible, searchText } = this.state;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '设备编号',
        width: '25%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
      }, {
        title: '设备类型',
        width: '15%',
        dataIndex: 'devicetype',
        key: 'devicetype',
        align: 'center',
        render: (text) => {
          if (text) {
            const result = text.toString();
            return (<span>{this.getEnumValue(DEV_TYPE, result)}</span>);
          } else {
            return '';
          }
        },
      }, {
        title: '设备位置',
        width: '50%',
        dataIndex: 'installaddress',
        key: 'installaddress',
        align: 'center',
        render: (text, record, index) => {
          if (record.latitude == null) {
            const tagConst = <Tag color="magenta">未指定地图位置</Tag>;
            return tagConst;
          } else {
            return record.installaddress;
          }
        },
      }, {
        title: '操作',
        width: '10%',
        align: 'center',
        key: 'action',
        render: (record) => {
          const { onDelete, onVideo, onFTP } = this.props;
          return (
            <span>
              <Icon
                type="search"
                onClick={(e) => { this.showDeviceInfoSelect(record); }}
                style={{
                  fontSize: '18px',
                  marginLeft: '4px',
                  cursor: 'pointer',
                }}
                title="定位"
              />
              <Icon
                type="edit"
                style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                onClick={(e) => { this.EditDeviceInfoSelect(record); }}
                title="编辑位置"
              />
            </span>
          );
        },
      }];

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={10}>
                <div>搜索结果 共<span className="allNumLight">{deviceCount}</span> 条</div>
              </Col>
              <Col span={10} offset={4}>
                <Search
                  placeholder="请输入设备编号"
                  value={searchText}
                  onSearch={value => dosearch(value)}
                  onChange={this.searchChange}
                  style={{ width: 200 }}
                />
              </Col>
            </Row>
          </div>
          <Table
            rowClassName={
              (record, index) => {
                if (record.deviceid === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }}
            columns={columns}
            loading={loading}
            dataSource={devicelist}
            pagination={false}
            // onChange={onPageChange}
            onRow={(record) => {
              return {
                // onClick: () => onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 300 }}
            rowKey="deviceid"
          />
        </div>
      </div>
    );
  }
}
GisDeviceList.prototypes = {
  devicelist: PropTypes.array,
};
export default Form.create()(GisDeviceList);
