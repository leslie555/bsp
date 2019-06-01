/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button } from 'antd';
import { DEPARTMENTLEVEL } from '../../config/enums';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { ADDDEPT, UPDATEDEPT, DELETEDEPT } from '../../config/authconstant';
import styles from './DepartmentInfo.less';

class DepartmentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getEnumValue = this.getEnumValue.bind(this);
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
    const { codeList } = this.props;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '部门编码',
        width: '25%',
        dataIndex: 'cdepartmentcode',
        key: 'cdepartmentcode',
        align: 'center',
      }, {
        title: '部门全称',
        width: '40%',
        dataIndex: 'cdepartmentname',
        key: 'cdepartmentname',
        align: 'center',
      }, {
        title: '部门级别',
        width: '25%',
        dataIndex: 'nlevel',
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
        title: '操作',
        width: '10%',
        align: 'center',
        key: 'action',
        render: (text, record) => {
          const { onEdit, onDelete } = this.props;
          return (
            <span>
              <HiatmpAuthorized {...authorizedProps} code={UPDATEDEPT}>
                <Icon
                  type="edit"
                  style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                  onClick={(e) => { onEdit(record); e.stopPropagation(); }}
                  title="编辑"
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={DELETEDEPT}>
                <Icon
                  type="delete"
                  onClick={() => onDelete(record.cdepartmentid)}
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                  }}
                  title="删除"
                />
              </HiatmpAuthorized>
            </span>
          );
        },
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
              <Col span={18}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <HiatmpAuthorized {...authorizedProps} code={ADDDEPT}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={() => onAdd()}><i className="table-right icon iconfont icon-tianjia" />新增</Button>
                </HiatmpAuthorized>
                <HiatmpAuthorized {...authorizedProps} code={DELETEDEPT}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={() => onDelete(ids)}><i className="table-right icon iconfont icon-delete-tab" />批量删除</Button>
                </HiatmpAuthorized>
              </Col>
            </Row>
          </div>
          <Table
            columns={columns}
            rowClassName={
              (record, index) => {
                if (record.cdepartmentid === currentId) {
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
            rowKey="cdepartmentid"
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
  onDelete: PropTypes.func,
  currentId: PropTypes.string,
};
export default Form.create()(DepartmentList);
