/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Upload, notification, message, Spin } from 'antd';
import { ENUM_DIRECTION, STATE, SBWZ, DIRECTION, ENUM_STATUS } from '../../config/enums';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { OCT_DEVICE_ADDNEW, OCT_DEVICE_MODIFY, OCT_DEVICE_DEL, OCT_DEVICE_FTP, OCT_DEVICE_MANAGEMENT } from '../../config/authconstant';
import styles from './DeviceInfo.less';
import DeviceUpload from './DeviceUpload';
import { getFtp, getDeviceInfoByID } from '../../services/octDeviceInfo';
import DeviceInfoSelect from './common/DeviceInfoSelect';
import FtpInfoSelect from './common/FtpInfoSelect';

const { Dragger } = Upload.Dragger;
class DepartmentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      flag: '2',
      ftpvisible: false, // ftp管理弹窗
      visible: false, // 设备详情抽屉
      entity: {}, // 选择弹框的记录
      DeviceUploadVisible: false, // 批量上传弹窗
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  // 上传文件弹框的确定按钮
  onPoliceInfoSelect = (police) => {
    const { form } = this.props;
    this.setState({ DeviceUploadVisible: false });
  }

  onSelectChange = (deviceid) => {
    // console.log('selectedKeys changed: ', deviceid);
    this.setState({ selectedKeys: deviceid });
  }

  onDeviceInfoSelect = (device) => {
    this.setState({ visible: false });
  }

  onFtpInfoSelect = () => {
    this.setState({ visible: false });
  }

  // ftp信息
  onFTP = (record) => {
    const { deviceid } = record.deviceid;
    getFtp({ deviceid: record.deviceid }).then((data) => {
      if (data && data.result) {
        this.setState({
          entity: { ...data.list[0], deviceid },
          ftpvisible: true,
        });
      }
    }).catch((err) => {
      notification.error({ message: `查询出错：${JSON.stringify(err)}` });
      // this.setState({
      //   ftpvisible: false,
      // });
    });
  }

  // ftp信息
  onFTP = (record) => {
    // const { deviceid } = record.deviceid;
    // console.log(deviceid);
    getFtp({ deviceid: record.deviceid }).then((data) => {
      if (data && data.result) {
        this.setState({
          entity: { ...data.list[0] },
          ftpvisible: true,
        });
      }
    }).catch((err) => {
      notification.error({ message: `查询出错：${JSON.stringify(err)}` });
      // this.setState({
      //   ftpvisible: false,
      // });
    });
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

  FtpInfoSelect = () => {
    this.setState({ ftpvisible: false });
  }


  addshowDevice = (record) => {
    console.log(record);
    this.setState({
      visible: true,
      entity: { ...record },
      // flag: '1',
      // entity: { ...record, flag },
    });
  }

  // 查看信息
  showDeviceInfoSelect = (record) => {
    console.log(record);
    getDeviceInfoByID({ deviceid: record.deviceid }).then((data) => {
      if (data && data.result) {
        this.setState({
          entity: { ...data.list },
          visible: true,
          flag: '2',
        });
      }
    }).catch((err) => {
      notification.error({ message: `查询出错：${JSON.stringify(err)}` });
      this.setState({
        visible: false,
      });
    });
    console.log(record);
  }

  // 新增
  addDevice = () => {
    this.setState({
      visible: true,
      flag: '1',
      entity: {},
    });
  };

  // 编辑信息
  EditDeviceInfoSelect = (record) => {
    getDeviceInfoByID({ deviceid: record.deviceid }).then((data) => {
      if (data && data.result) {
        this.setState({
          entity: { ...data.list },
          visible: true,
          flag: '3',
        });
      }
    }).catch((err) => {
      notification.error({ message: `查询出错：${JSON.stringify(err)}` });
      this.setState({
        visible: false,
      });
    });
  }

  // 批量导入
  showDeviceUpload = () => {
    this.setState({ DeviceUploadVisible: true });
  }

  render() {
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
    };
    const { codeList, dispatch, enumList, onAdd, onEdit } = this.props;
    const { DeviceUploadVisible, visible, entity, flag, ftpvisible, selectedKeys } = this.state;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '路段',
        width: '12%',
        dataIndex: 'sectionid',
        key: 'sectionid',
        align: 'center',
      }, {
        title: '设备编号',
        width: '10%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
      }, {
        title: '电警编号',
        width: '13%',
        dataIndex: 'epdeviceid',
        key: 'epdeviceid',
        align: 'center',
      }, {
        title: '设备名称',
        width: '15%',
        dataIndex: 'devicename',
        key: 'deviceiname',
        align: 'center',
        render:
          (text, record) => (
            <div title={record.devicename} className={styles.colClass}>{record.devicename}</div>
          ),
      }, {
        title: '设备位置',
        width: '14%',
        dataIndex: 'installaddress',
        key: 'installaddress',
        align: 'center',
        render: (text) => {
          return (
            <span>
              {this.getEnumValue(SBWZ, text)}
            </span>
          );
        },
      }, {
        title: '设备IP',
        width: '10%',
        dataIndex: 'deviceip',
        key: 'deviceip',
        align: 'center',
      }, {
        title: '行驶方向',
        width: '8%',
        dataIndex: 'drivedirection',
        key: 'drivedirection',
        align: 'center',
        render: (text) => {
          return (
            <span>
              {this.getEnumValue(DIRECTION, text)}
            </span>
          );
        },
      }, {
        title: '设备状态',
        width: '4%',
        dataIndex: 'devicestatus',
        key: 'devicestatus',
        align: 'center',
        render: (text) => {
          return (
            <span>
              {this.getEnumValue(ENUM_STATUS, text)}
            </span>
          );
        },
      }, {
        title: '使用状态',
        width: '4%',
        dataIndex: 'servicestatus',
        key: 'servicestatus',
        align: 'center',
        render: (text) => {
          return (
            <span>
              {this.getEnumValue(STATE, text)}
            </span>
          );
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
              <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_MANAGEMENT}>
                <Icon
                  type="search"
                  onClick={(e) => { this.showDeviceInfoSelect(record); }}
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                  }}
                  title="查看详情"
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_MODIFY}>
                <Icon
                  type="edit"
                  style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                  // onClick={(e) => { onEdit(record); e.stopPropagation(); }}
                  onClick={(e) => { this.EditDeviceInfoSelect(record); }}
                  title="编辑"
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_DEL}>
                <Icon
                  type="delete"
                  onClick={() => onDelete(record.deviceid)}
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                  }}
                  title="删除"
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_FTP}>
                <Icon
                  type="file"
                  onClick={() => this.onFTP(record)}
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                  }}
                  title="FTP管理"
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_MANAGEMENT}>
                <Icon
                  type="eye"
                  onClick={() => onVideo(record.rtspurl)}
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                  }}
                  title="实时视频"
                />
              </HiatmpAuthorized>
            </span>
          );
        },
      }];
    const {
      loading,
      departmentlist,
      pagination,
      onPageChange,
      onDelete,
      // selectedKeys,
      changeSelected,
      treeData,
      treeDataJ,
      onAddNew,
      onAddEdit,
      handleSearch,
      dataSource,
      onDownload,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: this.onSelectChange,
      // onChange: (selectedRowKeys) => {
      //   changeSelected(selectedRowKeys);
      // },
    };
    // DeviceInfoSelect的props
    const deviceprops = {
      enumList,
      treeData,
      treeDataJ,
      entity,
      flag,
      dataSource,
      handleSearch: (value) => {
        handleSearch(value);
      },
      onClose: () => {
        this.setState({ visible: false });
      },
      onOk: () => {
        this.onDeviceInfoSelect();
      },
      // 添加或编辑设备确认按钮
      handleAddOrEdit: (department) => {
        // let dispatchType = '';
        if (flag === '1') {
          debugger;
          onAddNew(department);
          // dispatchType = 'octDeviceInfo/addDevice';
          this.setState({ visible: false });
        } else if (flag === '3') {
          onAddEdit(department);
          // dispatchType = 'octDeviceInfo/updateDevice';
          this.setState({ visible: false });
        }
      },
    };
    const ftpinfoprops = {
      entity,
      ftpvisible,
      onClose: () => {
        this.setState({ ftpvisible: false });
      },
      onOk: () => {
        this.onFtpInfoSelect();
      },
    };

    const ids = selectedKeys.join(',');
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={10}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              <Col span={14} style={{ textAlign: 'right' }}>
                <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_ADDNEW}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={this.addDevice}><i className="table-right icon iconfont icon-tianjia" />新增</Button>
                </HiatmpAuthorized>
                <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_DEL}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={() => onDelete(ids)}><i className="table-right icon iconfont icon-delete-tab" />批量删除</Button>
                </HiatmpAuthorized>
                <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_ADDNEW}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={this.showDeviceUpload}><i className="table-right icon iconfont icon-import" />批量导入</Button>
                </HiatmpAuthorized>
                <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_ADDNEW}>
                  <Button type="primary" style={{ margin: '0 5px' }} disabled={(pagination.total == null) || (pagination.total <= 0)} onClick={onDownload}><i className="table-right icon iconfont icon-export" />批量导出</Button>
                </HiatmpAuthorized>
              </Col>
            </Row>
          </div>
          <Table
            columns={columns}
            // rowClassName={
            //   (record, index) => {
            //     if (record.deviceid === currentId) {
            //       return 'selectedRow';
            //     } else {
            //       return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
            //     }
            //   }}
            loading={loading}
            dataSource={departmentlist}
            rowSelection={rowSelection}
            pagination={pagination}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                // onClick: () => onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 550 }}
            rowKey="deviceid"
          />
          {
            !visible ? null : <DeviceInfoSelect {...deviceprops} />
          }
        </div>
        <DeviceUpload
          visible={DeviceUploadVisible}
          onClose={() => { this.setState({ DeviceUploadVisible: false }); }}
          onOk={this.onPoliceInfoSelect}
          onChange={this.onChange}
        />
        <FtpInfoSelect
          {...ftpinfoprops}
        />
        {/* <div style={{ display: loading ? '' : 'none' }} className={styles.loadingDiv}>
          <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
        </div> */}
      </div>
    );
  }
}
DepartmentList.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  departmentlist: PropTypes.array,
  selectedKeys: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  changeSelected: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  currentId: PropTypes.string,
};
export default Form.create()(DepartmentList);
