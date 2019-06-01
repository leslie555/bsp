import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button } from 'antd';
import { ENUM_ILLEGAL } from '../../config/enums';

class DeviceEventShieldList extends React.Component {
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
    for (let i = 0; i < enumList.length; i = 1) {
      const enumObj = enumList[i];
      if (enumObj.enumtypeid === enumtypeid && enumObj.enumvalue === enumvalue) {
        return enumObj.enumname;
      }
    }
  }

  // 截取字符串
  getPicture(value) {
    const { enumList } = this.props;
    let a = value;
    if (a.length > 8) {
      a = ''.concat(a.substr(0, 7), '...');
    }
    return a;
  }

  showDeviceUpload = () => {
    // this.setState({ displayName: 'block' });
  }

  render() {
    const { codeList } = this.props;
    const { DeviceUploadVisible, src } = this.state;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '设备ID',
        width: '25%',
        dataIndex: 'devicepos',
        key: 'devicepos',
        align: 'center',
      }, {
        title: '设备名称',
        width: '25%',
        dataIndex: 'eventtime',
        key: 'eventtime,',
        align: 'center',
      }, {
        title: '设备状态',
        width: '25%',
        dataIndex: 'eventtime',
        key: 'eventtime,',
        align: 'center',
      }, {
        title: '操作',
        width: '20%',
        dataIndex: 'picname1',
        key: 'picname1',
        align: 'center',
      }];
    const {
      loading,
      resultlist,
      pagination,
      onPageChange,
      onAdd,
      onDownload,
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

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={14}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              <Col span={10} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '0 5px' }} disabled={(pagination.total == null) || (pagination.total <= 0)} onClick={onDownload}><i className="table-right icon iconfont icon-export" />批量导出</Button>
              </Col>
            </Row>
          </div>
          <Table
            columns={columns}
            rowClassName={
              (record, index) => {
                console.log(resultlist);
                if (record.deviceid === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }
            }
            loading={loading}
            dataSource={resultlist}
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
        </div>
      </div>
    );
  }
}
DeviceEventShieldList.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  selectedKeys: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  changeSelected: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  currentId: PropTypes.string,
  onDownload: PropTypes.func,
};
export default Form.create()(DeviceEventShieldList);
