/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Tabs, Input, Table, Button, Icon, Modal, message, Tooltip } from 'antd';
import styles from './DictionaryInfo.less';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { QUERYDICTMEMBER, ADDDICTMEMBER, UPDATEDICTMEMBER, DELETEDICTMEMBER } from '../../config/authconstant';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TextArea } = Input;
const reg = new RegExp('^[0-9]*$');
const idreg = new RegExp('^[1-9]\\d*$');
class DictionaryInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      member: {},
      memFlag: '', // 0--新增 1--修改
    };
    this.onSaveHandle = this.onSaveHandle.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { form, dictionaryinfo } = this.props;
    if (nextProps.dictionaryinfo !== dictionaryinfo) {
      const fields = ['typeno', 'typename', 'typedescribe', 'memtypeno', 'memtypename', 'memtypevalue', 'enumMemName'];
      form.resetFields(fields);
    }
  }

  // 查询枚举描述
  onSearch() {
    const { form, onEnumMemSearch } = this.props;
    if (form.getFieldValue('typeno')) {
      const query = {
        enumMemName: form.getFieldValue('enumMemName'),
      };
      onEnumMemSearch(query);
    } else {
      message.error('请选择一条枚举类型数据');
    }
  }

  // 枚举详情保存
  onSaveHandle() {
    const { form, flag, handleAdd, handleEdit, dictionaryinfo } = this.props;
    const fields = ['typeno', 'typename', 'typedescribe'];
    form.validateFieldsAndScroll(fields, (err, values) => {
      if (!err) {
        const data = {
          enumtypeid: values.typeno,
          enumname: values.typename,
          enumdescribe: values.typedescribe,
        };
        if (flag === '1') {
          handleAdd(data);
        } else if (flag === '3') {
          handleEdit(dictionaryinfo, data);
        }
      }
    });
  }

  // 枚举详情取消
  onCancleHandle() {
    const { form, handleCancle } = this.props;
    form.resetFields();
    handleCancle();
  }

  // 新增枚举成员
  onAdd() {
    const { form, dictionaryinfo } = this.props;
    if (form.getFieldValue('typeno') !== null && form.getFieldValue('typeno') !== undefined && form.getFieldValue('typeno') !== '') {
      if (dictionaryinfo.enumtypeid !== null && dictionaryinfo.enumtypeid !== undefined && dictionaryinfo.enumtypeid !== '') {
        const fields = ['memtypeno', 'memtypename', 'memtypevalue'];
        this.setState({
          member: {
            memtypeno: dictionaryinfo.enumtypeid,
            memenumvalue: '',
            memenumname: '',
          },
          memFlag: '0',
          visible: true,
        }, () => {
          form.resetFields(fields);
        });
      } else {
        message.error('请先保存枚举类型信息');
      }
    } else {
      message.error('请先保存枚举类型信息');
    }
  }

  // 枚举成员编辑
  onEdit(record) {
    const { form, dictionaryinfo } = this.props;
    const fields = ['memtypeno', 'memtypename', 'memtypevalue'];
    this.setState({
      member: {
        memtypeno: dictionaryinfo.enumtypeid,
        memenumvalue: record.enumvalue,
        memenumname: record.enumname,
      },
      memFlag: '1',
      visible: true,
    }, () => {
      form.resetFields(fields);
    });
  }

  handleOk() {
    const { form, handleAddMem, handleEditMem } = this.props;
    const { memFlag, member } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          enumtypeid: values.memtypeno,
          enumname: values.memtypename,
          enumvalue: values.memtypevalue,
        };
        if (memFlag === '0') {
          handleAddMem(data);
        } else if (memFlag === '1') {
          const srcObj = {
            enumtypeid: member.memtypeno,
            enumname: member.memenumname,
            enumvalue: member.memenumvalue,
          };
          handleEditMem(srcObj, data);
        }
        this.setState({
          visible: false,
        });
      }
    });
  }

  // 枚举描述取消修改、新增
  handleCancel() {
    this.setState({
      visible: false,
      memFlag: '',
    });
  }

  render() {
    const noMatch = '';
    const {
      dictionaryinfo,
      flag,
      handleDeleteMem,
      form,
      loading,
      paginationMem,
      onMemPageChange,
      codeList,
      queryMemObj,
    } = this.props;
    const authorizedProps = {
      codeList,
      noMatch,
    };
    const { visible, member, memFlag } = this.state;
    const columns = [
      {
        title: '枚举值',
        width: 80,
        dataIndex: 'enumvalue',
        key: 'enumvalue',
        align: 'center',
      }, {
        title: '枚举描述',
        width: 80,
        dataIndex: 'enumname',
        key: 'enumname',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow}>
              <Tooltip title={text}>
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '操作',
        width: 80,
        colSpan: flag === '2' ? 0 : 1,
        className: flag === '2' ? styles.operateTdDisplayNone : styles.operateTdDisplayBlock,
        align: 'center',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <HiatmpAuthorized {...authorizedProps} code={UPDATEDICTMEMBER}>
                <Icon
                  type="edit"
                  style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                  title="编辑"
                  onClick={() => this.onEdit(record)}
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={DELETEDICTMEMBER}>
                <Icon
                  type="delete"
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                  }}
                  title="删除"
                  onClick={() => handleDeleteMem(record)}
                />
              </HiatmpAuthorized>
            </span>
          );
        },
      },
    ];
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      style: { height: '20px' },
    };
    const title = flag === '1' ? '新增枚举类型' : (flag === '2' ? '枚举详情信息' : '编辑枚举类型');
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <h3 className={styles.detailInfoTitle}>{title}</h3>
            <div className={styles.detailInfo}>
              <Form>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="类型编号">
                      {getFieldDecorator('typeno', {
                        initialValue: dictionaryinfo.enumtypeid,
                        rules: [{
                          pattern: idreg,
                          required: true,
                          message: '请输入纯数字的类型编号，不能以数字0开头！',
                        }],
                      })(
                        <Input placeholder="" maxLength="8" disabled={flag === '2' || flag === '3'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="类型名称">
                      {getFieldDecorator('typename', {
                        initialValue: dictionaryinfo.enumname,
                        rules: [{
                          required: true, message: '请输入类型名称！',
                        }],
                      })(
                        <Input placeholder="" maxLength="100" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="类型描述">
                      {getFieldDecorator('typedescribe', {
                        initialValue: dictionaryinfo.enumdescribe,
                      })(
                        <TextArea maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{ display: flag === '2' ? 'none' : 'block' }}>
                  <Col span={24}>
                    <FormItem style={{ textAlign: 'right', margin: '10px 0 0 0' }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ margin: '0 5px' }}
                        onClick={() => this.onSaveHandle()}
                      >保存
                      </Button>
                      <Button
                        type="primary"
                        style={{ margin: '0 3px' }}
                        onClick={() => this.onCancleHandle()}
                      >取消
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div className="outline-inner-padding">
            <Tabs type="card">
              <TabPane tab="枚举描述" key="1">
                <Row>
                  <Col span={12}>
                    <FormItem>
                      {getFieldDecorator('enumMemName', {
                        initialValue: queryMemObj.enumMemName,
                      })(<Input maxLength="50" placeholder="输入枚举描述查询" />)}
                    </FormItem>
                  </Col>
                  <Col span={10} offset={2}>
                    <FormItem style={{ textAlign: 'right' }}>
                      <HiatmpAuthorized {...authorizedProps} code={QUERYDICTMEMBER}>
                        <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.onSearch()}>查询</Button>
                      </HiatmpAuthorized>
                      <HiatmpAuthorized {...authorizedProps} code={ADDDICTMEMBER}>
                        <Button type="primary" style={{ margin: '0 3px', visibility: flag === '2' ? 'hidden' : 'visible' }} onClick={() => this.onAdd()}>新增</Button>
                      </HiatmpAuthorized>
                    </FormItem>
                  </Col>
                </Row>
                <div className={styles.memberDiv}>
                  <Table
                    columns={columns}
                    rowClassName={
                      (record, index) => { return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow'; }}
                    loading={loading}
                    dataSource={dictionaryinfo.members}
                    pagination={paginationMem}
                    onChange={onMemPageChange}
                    locale={{ emptyText: '暂无数据' }}
                    rowKey="nid"
                  />
                </div>
              </TabPane>
            </Tabs>
            <Modal
              title={memFlag === '0' ? '新增枚举成员' : '编辑枚举成员'}
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Form style={{ height: '180px' }}>
                <FormItem {...formItemLayout} label="类型编号">
                  {getFieldDecorator('memtypeno', {
                    initialValue: member.memtypeno,
                    rules: [{
                      required: true,
                      message: '请保存枚举类型！',
                    }],
                  })(
                    <Input placeholder="" maxLength="15" disabled />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="枚举值">
                  {getFieldDecorator('memtypevalue', {
                    initialValue: member.memenumvalue,
                    rules: [{
                      pattern: reg,
                      required: true,
                      message: '请输入纯数字的枚举值！',
                    }],
                  })(
                    <Input placeholder="" maxLength="20" />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="枚举描述">
                  {getFieldDecorator('memtypename', {
                    initialValue: member.memenumname,
                    rules: [{
                      required: true, message: '请输入枚举描述！',
                    }],
                  })(
                    <Input placeholder="" maxLength="1000" />
                  )}
                </FormItem>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
DictionaryInfo.prototypes = {

};
export default Form.create()(DictionaryInfo);
