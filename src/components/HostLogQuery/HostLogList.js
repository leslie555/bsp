/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Tooltip } from 'antd';
import styles from './HostLogList.less';
import { LOGTYPE } from '../../config/enums';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { EXPORTLOG } from '../../config/authconstant';

class HostLogList extends React.Component {
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
        title: '事件描述',
        width: '10%',
        dataIndex: 'eventdesc',
        key: 'eventdesc',
        align: 'center',
      }, {
        title: '记录生成时间',
        width: '25%',
        dataIndex: 'creationtime',
        key: 'creationtime',
        align: 'center',
      }, {
        title: '事件发生时间',
        width: '25%',
        dataIndex: 'eventtime',
        key: 'eventtime',
        align: 'center',
      }, {
        title: '入库时间',
        width: '25%',
        dataIndex: 'inserttime',
        key: 'inserttime',
        align: 'center',
      }, {
        title: '备注',
        width: '8%',
        dataIndex: 'note',
        key: 'note',
        align: 'center',
      }];
    const { loading, hostloglist, pagination, onPageChange, onExport, codeList, onView, currentId }
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
                if (record.id === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }}
            loading={loading}
            dataSource={hostloglist}
            pagination={pagination}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                onClick: () => onView(record),
              };
            }}
            scroll={{ y: 515 }}
            locale={{ emptyText: '暂无数据' }}
            rowKey="id"
            size="big"
          />
        </div>
      </div>
    );
  }
}
HostLogList.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  dictionarylist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  currentId: PropTypes.string,
};
export default Form.create()(HostLogList);
