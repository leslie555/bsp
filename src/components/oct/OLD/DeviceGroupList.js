/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Table, Select, Radio, Icon, Input, Button, message } from 'antd';
import styles from './DeviceGroupList.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
class DeviceGroupInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.onSaveHandle = this.onSaveHandle.bind(this);
    this.onCancelHandle = this.onCancelHandle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { form, departmentinfo } = this.props;
    if (nextProps.departmentinfo !== departmentinfo) {
      form.resetFields();
    }
  }

  // 确定保存
  onSaveHandle() {
    const { form, handleAddOrEdit, flag, departmentinfo } = this.props;
    const fields = [
      'cdepartmentcode',
      'departmentflag',
      'cdepartmentname',
      'deptshortname',
      'nlevel',
      'innerdeptflag',
      'dataauthority',
      'equipdeptflag',
    ];
    if (form.getFieldValue('cdepartmentcode')) {
      if (form.getFieldValue('nlevel') == '1') {
        form.validateFieldsAndScroll(fields, (err, values) => {
          if (!err) {
            if (flag === '1') {
              handleAddOrEdit({
                ...values,
                cdepartmentid: values.cdepartmentcode,
                parentdepartment: values.cdepartmentcode,
              });
            } else if (flag === '3') {
              handleAddOrEdit({ ...values, cdepartmentid: departmentinfo.cdepartmentid });
            }
          }
        });
      } else {
        form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            if (flag === '1') {
              handleAddOrEdit({ ...values, cdepartmentid: values.cdepartmentcode });
            } else if (flag === '3') {
              handleAddOrEdit({ ...values, cdepartmentid: departmentinfo.cdepartmentid });
            }
          }
        });
      }
    } else {
      message.error('请添加部门信息');
    }
  }

  // 取消按钮
  onCancelHandle() {
    const { form, onCancel } = this.props;
    form.resetFields();
    onCancel();
  }

  render() {
    const {
      loading,
      pagination,
      onPageChange,
      onAdd,
      onView,
      selectedKeys,
      changeSelected,
      currentId,
      form,
      departmentinfo,
      flag,
      resultlist,
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '30px' },
    };
    const { codeList } = this.props;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys) => {
        changeSelected(selectedRowKeys);
      },
    };
    // 列表
    const columns = [
      {
        title: '分组',
        width: '70%',
        dataIndex: 'groupname',
        key: 'id',
        align: 'center',
      }, {
        title: '操作',
        width: '30%',
        align: 'center',
        key: 'action',
        render: (text, record) => {
          const { onEdit, onDelete } = this.props;
          return (
            <span>
              <Icon
                type="edit"
                style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                onClick={(e) => { onEdit(record); e.stopPropagation(); }}
                title="编辑"
              />
              <Icon
                type="delete"
                onClick={() => onDelete(record.id)}
                style={{
                  fontSize: '18px',
                  marginLeft: '4px',
                  cursor: 'pointer',
                }}
                title="删除"
              />
            </span>
          );
        },
      }];
    const reg = new RegExp('^\\d{12,}$');
    const telreg = new RegExp('^[0-9]*$');
    const title = '设备分组';
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <h3 className={styles.detailInfoTitle}>{title}</h3>
            <Table
              columns={columns}
              rowClassName={
                (record, index) => {
                  if (record.id === currentId) {
                    return 'selectedRow';
                  } else {
                    return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                  }
                }}
              dataSource={resultlist}
              rowSelection={rowSelection}
              onRow={(record) => {
                return {
                  onClick: () => onView(record),
                };
              }}
              locale={{ emptyText: '暂无设备分组' }}
              scroll={{ y: 550 }}
              rowKey="id"
            />
            <div className={styles.detailInfo}>
              <Form>
                <FormItem style={{ textAlign: 'right', marginBottom: 0 }}>
                  <Button
                    type="primary"
                    style={{ margin: '0 5px', visibility: flag === '2' ? 'hidden' : 'visible' }}
                    onClick={() => { this.onSaveHandle(); }}
                  >保存
                  </Button>
                  <Button
                    type="primary"
                    style={{ margin: '0 3px', visibility: flag === '2' ? 'hidden' : 'visible' }}
                    onClick={() => { this.onCancelHandle(); }}
                  >取消
                  </Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
DeviceGroupInfo.prototypes = {
  loading: PropTypes.bool,
  list: PropTypes.array,
  enumList: PropTypes.array,
  flag: PropTypes.string,
  departmentinfo: PropTypes.object,
  onCancel: PropTypes.func,
  onSelectChange: PropTypes.func,
  handleAddOrEdit: PropTypes.func,
};
export default Form.create()(DeviceGroupInfo);
