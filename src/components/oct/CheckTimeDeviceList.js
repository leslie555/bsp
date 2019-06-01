/*eslint-disable*/
/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Upload, notification, message, Spin } from 'antd';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { OCT_DEVICE_ADDNEW, OCT_DEVICE_MODIFY, OCT_DEVICE_DEL, OCT_DEVICE_FTP, OCT_DEVICE_MANAGEMENT } from '../../config/authconstant';
import styles from './DeviceInfo.less';

class DepartmentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
    };
  }

  onSelectChange = (deviceid) => {
    // console.log('selectedKeys changed: ', deviceid);
    this.setState({ selectedKeys: deviceid });
  }

  render() {
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
    };
    const { codeList, dispatch } = this.props;
    const { selectedKeys } = this.state;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '设备编号',
        width: '10%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
      }, {
        title: '设备名称',
        width: '20%',
        dataIndex: 'devicename',
        key: 'deviceiname',
        align: 'center',
        render:
          (text, record) => (
            <div title={record.devicename} className={styles.colClass}>{record.devicename}</div>
          ),
      }, {
        title: '设备时间',
        width: '15%',
        dataIndex: 'devicetime',
        key: 'devicetime',
        align: 'center',
      }, {
        title: '服务器时间',
        width: '15%',
        dataIndex: 'servertime',
        key: 'servertime',
        align: 'center',
      }, {
        title: '时间差异',
        width: '10%',
        dataIndex: 'diff',
        key: 'diff',
        align: 'center',
      }, {
        title: 'url状态',
        width: '15%',
        dataIndex: 'urlstate',
        key: 'urlstate',
        align: 'center',
      }, {
        title: '校时状态',
        width: '15%',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
      }];
    const {
      loading,
      departmentlist,
      pagination,
      onPageChange,
      onDownload,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: this.onSelectChange,
      // onChange: (selectedRowKeys) => {
      //   changeSelected(selectedRowKeys);
      // },
    };
    // for (const item in departmentlist) {
    //   // if (0 <= item.diff && 1 >= item.diff) {
    //   //   item.status = '无需校时';
    //   // } else {
    //   //   item.status = '需要校时';
    //   // }
    //   console.log(item);
    // }
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={10}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              {/* <Col span={14} style={{ textAlign: 'right' }}>
                <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_ADDNEW}>
                  <Button type="primary" style={{ margin: '0 5px' }} disabled={(pagination.total == null) || (pagination.total <= 0)} onClick={onDownload}><i className="table-right icon iconfont icon-export" />批量导出</Button>
                </HiatmpAuthorized>
              </Col> */}
            </Row>
          </div>
          <Table
            columns={columns}
            rowClassName={(record, index) => {
              let className;
              if (record.status === '需要校时') className = 'lightRow';
              return className;
            }}
            loading={loading}
            dataSource={departmentlist}
            // rowSelection={rowSelection}
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
  currentId: PropTypes.string,
};
export default Form.create()(DepartmentList);
