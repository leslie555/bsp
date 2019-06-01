import React, { Component } from 'react';
import { Table, Icon, Button, Form } from 'antd';
import PropTypes from 'prop-types';

import styles from './List.less';

class List extends Component {
  constructor(props) {
    super(props);
    const { selectedRowKeys } = this.props;
    this.state = {
      selectedRowKeys,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selectedRowKeys } = this.props;

    if (selectedRowKeys !== nextProps.selectedRowKeys) {
      this.setState({
        selectedRowKeys: nextProps.selectedRowKeys,
      });
    }
  }

  render() {
    const { loading, list, pagination, onPageChange, onAdd } = this.props;
    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
    };

    // 列表
    const columns = [
      {
        title: '号牌号码',
        width: 120,
        dataIndex: 'carno',
        key: 'carno',
        align: 'center',
      },
      {
        title: '级别',
        width: 90,
        dataIndex: 'controllevel',
        key: 'controllevel',
        align: 'center',
      },
      {
        title: '车辆品牌',
        width: 120,
        dataIndex: 'carbrand',
        align: 'center',
        key: 'carbrand',
      },
      {
        title: '车身颜色',
        width: 90,
        dataIndex: 'carcolor',
        align: 'center',
        key: 'carcolor',
      },
      {
        title: '开始时间',
        width: 170,
        align: 'center',
        dataIndex: 'btime',
        key: 'btime',
      },
      {
        title: '结束时间',
        width: 170,
        align: 'center',
        dataIndex: 'etime',
        key: 'etime',
      },
      {
        title: '状态',
        width: 120,
        align: 'center',
        dataIndex: 'infostatus',
        key: 'infostatus',
      },
      {
        title: '报警状态',
        width: 120,
        align: 'center',
        dataIndex: 'alarmstatus',
        key: 'alarmstatus',
      },
      {
        title: '查扣状态',
        width: 120,
        align: 'center',
        dataIndex: 'interceptflag',
        key: 'interceptflag',
      },
      {
        title: '操作',
        width: 110,
        align: 'center',
        key: 'action',
        render: (text, record) => {
          const data = { ...record };
          return (
            <span>
              <Icon
                type="file"
                style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                onClick={() => {}}
                title="详情"
              />
              <Icon
                type="edit"
                style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                onClick={() => {}}
                title="编辑"
              />
              <Icon
                type="rollback"
                onClick={() => {}}
                style={{
                  fontSize: '18px',
                  marginLeft: '4px',
                  cursor: 'pointer',
                  display: data.infostatus === '已撤控' ? 'none' : '',
                }}
                title="撤控"
              />
            </span>
          );
        },
      },
    ];

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <table style={{ width: '100%' }}>
              <tbody>
                <tr style={{ width: '100%' }}>
                  <td style={{ width: '60%' }}>
                    <div>
                      搜索结果 共 <span className={styles.test}>{pagination.total}</span> 条
                    </div>
                  </td>
                  <td style={{ width: '40%', textAlign: 'right' }}>
                    <Button type="primary" style={{ margin: '0 5px' }} onClick={() => {}}>
                      <i className="table-right icon iconfont icon-import" />导入
                    </Button>
                    <Button type="primary" style={{ margin: '0 5px' }} onClick={() => {}}>
                      <i className="table-right icon iconfont icon-export" />导出
                    </Button>
                    <Button
                      type="primary"
                      style={{ margin: '0 5px' }}
                      onClick={() => {
                        onAdd();
                      }}
                    >
                      <i className="table-right icon iconfont icon-tianjia" />添加
                    </Button>
                    <Button
                      type="primary"
                      style={{ margin: '0 20px 0 5px', width: 100 }}
                      onClick={() => {}}
                    >
                      <i className="table-right icon iconfont icon-revoke" />批量撤控
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Table
            columns={columns}
            className={styles.tableList}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
            }}
            scroll={{ x: 1800, y: 360 }}
            loading={loading}
            dataSource={list}
            pagination={pagination}
            onChange={onPageChange}
            rowSelection={rowSelection}
            locale={{ emptyText: '暂无数据' }}
            rowKey="nid"
            size="big"
          />
        </div>
      </div>
    );
  }
}
List.propTypes = {
  loading: PropTypes.bool,
  list: PropTypes.array,
  pagination: PropTypes.object,
};
List.defaultProps = {
  list: [],
  loading: false,
  pagination: {},
};
// export default List;
export default Form.create()(List);
