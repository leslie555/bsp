/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Tooltip } from 'antd';
import styles from './LogList.less';
import { ALARMTYPE } from '../../config/enums';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { EXPORTLOG } from '../../config/authconstant';

class AlarmList extends React.Component {
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
        title: '设备编号',
        width: '9%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '100%' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '报警时间',
        width: '17%',
        dataIndex: 'alarmtime',
        key: 'alarmtime',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '100%' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '报警类型',
        width: '8%',
        dataIndex: 'alarmtype',
        key: 'alarmtype',
        align: 'center',
        render: (text) => {
          return (
            <span>
              {this.getEnumValue(ALARMTYPE, text)}
            </span>
          );
        },
      }, {
        title: '处理机构',
        width: '8%',
        dataIndex: 'orgtype',
        key: 'orgtype',
        align: 'center',
      }, {
        title: '处理标志',
        width: '8%',
        dataIndex: 'dealflag',
        key: 'dealflag',
        align: 'center',
        render: (text) => {
          let result = '未处理';
          if (text !== '0' && text !== '1') {
            result = '简单处理';
          } else if (text == '1') {
            result = '误报处理';
          }
          return (<span> {result} </span>);
        },
      }, {
        title: '处理时间',
        width: '8%',
        dataIndex: 'dealtime',
        key: 'dealtime',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '100%', textAlign: 'left' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '操作人',
        width: '8%',
        dataIndex: 'operator',
        key: 'operator',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '100%' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '报警信息',
        width: '34%',
        dataIndex: 'alarminfo',
        key: 'alarminfo',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '100%', textAlign: 'left' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }];
    const { loading, alarmlist, pagination, onPageChange, onExport, codeList, onView, currentId }
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
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <HiatmpAuthorized {...authorizedProps} code={EXPORTLOG}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={() => onExport()}><i className="table-right icon iconfont icon-export" />导出</Button>
                </HiatmpAuthorized>
              </Col>
            </Row>
          </div>
          <Table
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
            dataSource={alarmlist}
            pagination={pagination}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                onClick: () => onView(record),
              };
            }}
            scroll={{ y: 515 }}
            locale={{ emptyText: '暂无数据' }}
            rowKey="nid"
            size="big"
          />
        </div>
      </div>
    );
  }
}
AlarmList.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  dictionarylist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  currentId: PropTypes.string,
};
export default Form.create()(AlarmList);
