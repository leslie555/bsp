/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Tooltip } from 'antd';
import styles from './DeviceLogList.less';
import { LOGTYPE } from '../../config/enums';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { EXPORTLOG } from '../../config/authconstant';

class DeviceLogList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getEnumValue = this.getEnumValue.bind(this);
    this.getFirstMenuName = this.getFirstMenuName.bind(this);
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

  // 根据一级菜单ID获取菜单名称
  getFirstMenuName(id) {
    const { menus } = this.props;
    for (let i = 0; i < menus.length; i += 1) {
      const menu = menus[i];
      if (menu.id === id) {
        return menu.name;
      }
    }
    return id;
  }

  render() {
    const noMatch = '';
    // 列表
    const columns = [
      {
        title: '序号',
        width: '8%',
        key: (text, record, index) => `${index + 1}`,
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      }, {
        title: '设备编号',
        width: '10%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
      }, {
        title: '设备ip地址',
        width: '10%',
        dataIndex: 'ip_address',
        key: 'ip_address',
        align: 'center',
      }, {
        title: 'CPU温度(°C)',
        width: '8%',
        dataIndex: 'cpu_temp',
        key: 'cpu_temp',
        align: 'center',
      }, {
        title: 'CPU风扇速度',
        width: '10%',
        dataIndex: 'cpu_fan_speed',
        key: 'cpu_fan_speed',
        align: 'center',
      }, {
        title: '剩余物理内存',
        width: '8%',
        dataIndex: 'free_memory',
        key: 'free_memory',
        align: 'center',
      }, {
        title: '线程计数',
        width: '8%',
        dataIndex: 'thread_count',
        key: 'thread_count',
        align: 'center',
      }, {
        title: '上次通信状态',
        width: '8%',
        dataIndex: 'is_normal',
        key: 'is_normal',
        align: 'center',
        render: (text) => {
          let result = '正常';
          if (text != 'ok') {
            result = '异常';
          }
          return (<span> {result} </span>);
        },
      }, {
        title: '操作',
        width: '5%',
        dataIndex: 'none',
        key: 'none',
        align: 'center',
      }];
    const { loading, loglist, pagination, onPageChange, onDownload, codeList, onView, currentId }
      = this.props;
    const authorizedProps = {
      codeList,
      noMatch,
    };
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={18}>
                <div>搜索结果 共<span className="allNumLight">{loglist.length}</span> 条</div>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <HiatmpAuthorized {...authorizedProps} code={EXPORTLOG}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={onDownload}><i className="table-right icon iconfont icon-export" />导出</Button>
                </HiatmpAuthorized>
              </Col>
            </Row>
          </div>
          <Table
            rowKey={(record, index) => `${record.deviceid}${index + 1}`}
            className={styles.logTable}
            columns={columns}
            rowClassName={
              (record, index) => {
                if (record.nid === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }}
            loading={loading}
            dataSource={loglist}
            pagination={pagination}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                onClick: () => onView(record),
              };
            }}
            scroll={{ y: 515 }}
            locale={{ emptyText: '暂无数据' }}
            size="big"
          />
        </div>
      </div>
    );
  }
}
DeviceLogList.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  dictionarylist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  currentId: PropTypes.string,
};
export default Form.create()(DeviceLogList);
