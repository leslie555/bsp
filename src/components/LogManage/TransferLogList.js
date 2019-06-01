/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Tooltip } from 'antd';
import styles from './TransferLogList.less';
import { LOGTYPE } from '../../config/enums';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { EXPORTLOG } from '../../config/authconstant';

class TransferLogList extends React.Component {
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
        width: '9%',
        key: 'id',
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      }, {
        title: '服务器IP',
        width: '10%',
        dataIndex: 'requestsysip',
        key: 'requestsysip',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '8em' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '记录时间',
        width: '15%',
        dataIndex: 'recordtime',
        key: 'recordtime',
        align: 'center',
      }, {
        title: '传输文件名',
        width: '22%',
        dataIndex: 'xmlname',
        key: 'xmlname',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '6em' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '失败原因描述',
        width: '34%',
        dataIndex: 'errormsg',
        key: 'errormsg',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '28em', textAlign: 'left' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }];
    const { loading, loglist, pagination, onPageChange, onExport, codeList, onView, currentId }
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
            rowKey="nid"
            size="big"
          />
        </div>
      </div>
    );
  }
}
TransferLogList.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  dictionarylist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  currentId: PropTypes.string,
};
export default Form.create()(TransferLogList);
