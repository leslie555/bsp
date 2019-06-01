/**
 * Created by Administrator on 2018/7/25.
 */
import React, { Component } from 'react';
import { Table, Icon, Button, Form, message, Tooltip } from 'antd';
import { POLICESTATUS, POLICETYPE, AUDITSTATE } from '../../config/enums';
import styles from './PoliceList.less';
import RenderAuthorized from '../Authorized';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { ADDPOLICE, UPDATEPOLICE, DELETEPOLICE, POLICESUBMIT, POLICEAUDIT } from '../../config/authconstant';

class PoliceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedKeys: [],
      // selectedRows: [],
    };
  }

  // 提交审核校验
  onSubmit() {
    const { selectedRows, selectedKeys } = this.props;
    const { onAuditSubmit, updateSelectState } = this.props;
    let flag = 1;
    for (let i = 0; i < selectedRows.length; i += 1) {
      const row = selectedRows[i];
      if (row.auditstate !== '3' && row.auditstate !== '9') {
        message.warn('只有未提交审核和审批驳回状态的警员才可以提交审核');
        flag = 0;
        break;
      }
    }
    if (flag === 1) {
      onAuditSubmit(selectedKeys.join(','));
      updateSelectState({ selectedKeys: [], selectedRows: [] });
      // this.setState({
      //   selectedKeys: [],
      //   selectedRows: [],
      // });
    }
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

  render() {
    const { loading, onAuditSubmit, onEdit, onDelete, onAdd, policeList,
      onAudit, codeList, pagination, onPageChange, onView, currentId, updateSelectState,
      selectedRows, selectedKeys } = this.props;

    const AddAuthorized = RenderAuthorized(ADDPOLICE);
    const UpdateAuthorized = RenderAuthorized(UPDATEPOLICE);
    const DeleteAuthorized = RenderAuthorized(DELETEPOLICE);
    const AuditAuthorized = RenderAuthorized(POLICEAUDIT);
    const SubmitAuthorized = RenderAuthorized(POLICESUBMIT);

    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };

    // const { selectedKeys } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys, xxx) => {
        updateSelectState({ selectedKeys: selectedRowKeys, selectedRows: xxx });
        // this.setState({
        //   selectedKeys: selectedRowKeys,
        //   selectedRows,
        // });
      },
    };
    const ids = selectedKeys.join(',');
    const columns = [
      {
        title: '警员姓名',
        width: '11%',
        dataIndex: 'policename',
        key: 'policename',
        align: 'center',
      },
      {
        title: '警员警号',
        width: '10%',
        dataIndex: 'policeid',
        key: 'policeid',
        align: 'center',
      },
      {
        title: '所属部门',
        width: '20%',
        dataIndex: 'deptshortname',
        align: 'center',
        key: 'deptshortname',
        render: (text) => {
          return (

            <div className={styles.textOverflow} title={text}>
              <span>{text}</span>
            </div>
          );
        },
      },
      {
        title: '警员类型',
        width: '11%',
        dataIndex: 'policetype',
        align: 'center',
        key: 'policetype',
        render: (text) => {
          return (
            <span>
              {this.getEnumValue(POLICETYPE, text)}
            </span>
          );
        },
      },
      {
        title: '警员状态',
        width: '11%',
        align: 'center',
        dataIndex: 'is_effective',
        key: 'is_effective',
        render: (text) => {
          return (
            <span>
              {this.getEnumValue(POLICESTATUS, text)}
            </span>
          );
        },
      },
      {
        title: '审批状态',
        width: '11%',
        align: 'center',
        dataIndex: 'auditstate',
        key: 'auditstate',
        render: (text) => {
          return (
            <span>
              {this.getEnumValue(AUDITSTATE, text)}
            </span>
          );
        },
      },
      {
        title: '审批人',
        width: '10%',
        dataIndex: 'auditname',
        align: 'center',
        key: 'auditname',
      },
      {
        title: '操作',
        width: '16%',
        align: 'center',
        key: 'action',
        render: (text, record) => {
          const data = { ...record };
          return (
            <span>
              <HiatmpAuthorized {...authorizedProps} code={UPDATEPOLICE}>
                <Icon
                  type="edit"
                  style={{ fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                    display: data.auditstate === '0' ? 'none' : '' }}
                  onClick={(e) => { onEdit(data); e.stopPropagation(); }}
                  title="编辑"
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={DELETEPOLICE}>
                <Icon
                  type="delete"
                  style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                  onClick={(e) => { onDelete(data.uuid); e.stopPropagation(); }}
                  title="删除"
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={POLICESUBMIT}>
                <Icon
                  type="solution"
                  onClick={(e) => { onAuditSubmit(data.uuid); e.stopPropagation(); }}
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                    display: data.auditstate === '3' || data.auditstate === '9' ? '' : 'none',
                  }}
                  title="提交审批"
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={POLICEAUDIT}>
                <Icon
                  type="solution"
                  onClick={(e) => { onAudit(data); e.stopPropagation(); }}
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                    display: data.auditstate === '0' ? '' : 'none',
                  }}
                  title="审批"
                />
              </HiatmpAuthorized>
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
                    搜索结果 共 <span className="allNumLight">{pagination.total}</span> 条
                    </div>
                  </td>
                  <td style={{ width: '40%', textAlign: 'right' }}>
                    <HiatmpAuthorized {...authorizedProps} code={POLICESUBMIT}>
                      <Button
                        type="primary"
                        style={{ margin: '0 20px 0 5px', width: 130 }}
                        onClick={() => this.onSubmit()}
                      >
                        <i className="table-right icon iconfont icon-revoke" />批量提交审批
                      </Button>
                    </HiatmpAuthorized>
                    <HiatmpAuthorized {...authorizedProps} code={ADDPOLICE}>
                      <Button
                        type="primary"
                        style={{ margin: '0 5px' }}
                        onClick={() => {
                          onAdd();
                        }}
                      >
                        <i className="table-right icon iconfont icon-tianjia" />新增
                      </Button>
                    </HiatmpAuthorized>
                    <HiatmpAuthorized {...authorizedProps} code={DELETEPOLICE}>
                      <Button type="primary" style={{ margin: '0 5px' }} onClick={() => onDelete(ids)}>
                        <i className="table-right icon iconfont icon-delete-tab" />批量删除
                      </Button>
                    </HiatmpAuthorized>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Table
            columns={columns}
            className={styles.tableList}
            rowClassName={(record, index) => {
              if (record.uuid === currentId) {
                return 'selectedRow';
              } else {
                return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
              }
              // return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
            }}
            // pagination={{
            //   pageSize: 15,
            //   showSizeChanger: true,
            //   showQuickJumper: true,
            //   pageSizeOptions: ['10', '15', '20', '25', '30', '35', '40'],
            //   total: policeList.length,
            // }}
            pagination={pagination}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                onClick: () => onView(record),
              };
            }}
            scroll={{ y: 645 }}
            loading={loading}
            dataSource={policeList}
            rowSelection={rowSelection}
            locale={{ emptyText: '暂无数据' }}
            rowKey="uuid"
            size="big"
          />
        </div>
      </div>
    );
  }
}


PoliceList.propTypes = {
};
PoliceList.defaultProps = {
};
// export default List;
export default Form.create()(PoliceList);
