import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Upload } from 'antd';
import { DEPARTMENTLEVEL } from '../../config/enums';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { ADDDEPT, UPDATEDEPT, DELETEDEPT } from '../../config/authconstant';
import styles from './DeviceInfo.less';
import DeviceUpload from './DeviceUpload';

const { Dragger } = Upload.Dragger;
class DeviceMonitorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DeviceUploadVisible: false, // 警员信息选择窗口
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  onPoliceInfoSelect = (police) => {
    const { form } = this.props;
    this.setState({ DeviceUploadVisible: false });
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
    const { codeList } = this.props;
    const { DeviceUploadVisible } = this.state;
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
        title: '设备状态',
        width: '25%',
        dataIndex: 'devicestate',
        key: 'nlevel',
        align: 'center',
        render: (text) => {
          return (
            <span>
              {this.getEnumValue(DEPARTMENTLEVEL, text)}
            </span>
          );
        },
      }, {
        title: '报警类型',
        width: '25%',
        dataIndex: 'devicename',
        key: 'devicename',
        // key: 'cdepartmentname',
        align: 'center',
      }, {
        title: '有效识别率',
        width: '25%',
        align: 'center',
        key: 'action',
      }];
    const {
      loading,
      departmentlist,
      pagination,
      onPageChange,
      onAdd, onDelete,
      onView,
      selectedKeys,
      changeSelected,
      currentId,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys) => {
        changeSelected(selectedRowKeys);
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
                <HiatmpAuthorized {...authorizedProps} code={ADDDEPT}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={() => onAdd()}><i className="table-right icon iconfont icon-tianjia" />新增</Button>
                </HiatmpAuthorized>
                <HiatmpAuthorized {...authorizedProps} code={DELETEDEPT}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={() => onDelete(ids)}><i className="table-right icon iconfont icon-delete-tab" />批量删除</Button>
                </HiatmpAuthorized>
                <HiatmpAuthorized {...authorizedProps} code={ADDDEPT}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={this.showDeviceUpload}><i className="table-right icon iconfont icon-import" />批量导入</Button>
                </HiatmpAuthorized>
              </Col>
            </Row>
          </div>
          <Table
            columns={columns}
            rowClassName={
              (record, index) => {
                if (record.deviceid === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }}
            loading={loading}
            dataSource={departmentlist}
            rowSelection={rowSelection}
            pagination={pagination}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                onClick: () => onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 550 }}
            rowKey="deviceid"
          />
        </div>
        <DeviceUpload
          visible={DeviceUploadVisible}
          onClose={() => { this.setState({ DeviceUploadVisible: false }); }}
          onOk={this.onPoliceInfoSelect}
        />
      </div>
    );
  }
}
DeviceMonitorList.prototypes = {
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
export default Form.create()(DeviceMonitorList);
