/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button } from 'antd';

class QueryEquipmentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  onPoliceInfoSelect = (police) => {
    const { form } = this.props;
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
        title: '设备分组',
        width: '40%',
        dataIndex: 'groupname',
        key: 'groupname',
        align: 'center',
      }, {
        title: '设备数量',
        width: '30%',
        dataIndex: 'alldevice',
        key: 'alldevice,',
        align: 'center',
      }, {
        title: '采集数量',
        width: '30%',
        dataIndex: 'okdevice',
        key: 'okdevice',
        align: 'center',
      }];
    const {
      loading,
      resultlist,
      excel,
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
                {/* <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div> */}
              </Col>
            </Row>
          </div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={resultlist}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                // onClick: () => onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 550 }}
            bordered
            rowKey="id"
          />
        </div>
      </div>
    );
  }
}
QueryEquipmentList.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  selectedKeys: PropTypes.array,
  onPageChange: PropTypes.func,
  changeSelected: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  currentId: PropTypes.string,
  onDownload: PropTypes.func,
};
export default Form.create()(QueryEquipmentList);
