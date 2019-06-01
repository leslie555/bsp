/**
 * Created by Administrator on 2018/7/12.
 */
import { Form, Col, Input, Button, Icon, Divider, Table, Modal, Row, Spin } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './MenuManageInfo.less';
import stylesx from '../AccountManage/AccountInfo.less';
import {
  addOperateService, addSonService, deleteMenuListService,
  updateMenuListService, updateOperate, deleteOperateService,
} from '../../services/menuManage/MenuManageService';

const FormItem = Form.Item;
const { confirm } = Modal;

class MenuManageInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoSelectMenuId: '0',
      addOrUpdateMenuFlag: 'add',
      addOrUpdateOperateFlag: 'add',
      loading: false,
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { selectMenuInfo, selectMenuId, operateRight } = this.props;
    if (this.props && nextProps) {
      if (selectMenuInfo !== nextProps.selectMenuInfo) {
        console.log('this.props.selectMenuInfo');
        console.log(selectMenuInfo);
        nextProps.form.resetFields();
      }
      if (selectMenuId !== nextProps.selectMenuId) {
        nextProps.form.resetFields();
        this.setState({ infoSelectMenuId: nextProps.selectMenuId });
        if (nextProps.selectMenuId === '0') {
          this.setState({ addOrUpdateMenuFlag: 'add' });
          console.log('addMenu');
        } else {
          console.log('updateMenu');
          this.setState({ addOrUpdateMenuFlag: 'update' });
        }
      }
      if (operateRight !== nextProps.operateRight) {
        nextProps.form.resetFields();
        if (!nextProps.operateRight.ID) {
          console.log('addOperate');
          this.setState({ addOrUpdateOperateFlag: 'add' });
        } else {
          console.log('UpdateOperate');
          this.setState({ addOrUpdateOperateFlag: 'update' });
        }
      }
    }
  }

  addSon= () => {
    const { selectMenuId, selectMenuInfo, selectMenuLevel } = this.props;
    if (selectMenuLevel === null) {
      Modal.error({
        title: '提示信息',
        content: '请选择要在哪个菜单下添加子菜单',
      });
    } else if (selectMenuLevel < 3) {
      this.setState({ addOrUpdateMenuFlag: 'add' });
      console.log('selectMenuLevel');
      const { dispatch } = this.props;
      dispatch({
        type: 'MenuManageModel/addSon',
      });
    } else {
      Modal.error({
        title: '提示信息',
        content: '已是终级项，无法添加子菜单。',
      });
    }
    // dispatch({
    //   type: 'MenuManageModel/selectOneOperate',
    //   payload: { selectOneOperate: record },
    // });
  };

  savaOrUpdateMenu = () => {
    const dateinfo = ['align', 'altImage', 'createdBy', 'delFlag', 'description', 'height', 'id', 'image',
      'lastModifiedAt', 'lastModifiedBy', 'location', 'name', 'onDbclick', 'onMouseover', 'orderId', 'page',
      'parentId', 'onClick', 'roles', 'target', 'title', 'tooltip', 'url', 'version', 'width', 'fastId'];
    const { form, onNeedRefresh } = this.props;
    const { infoSelectMenuId, addOrUpdateMenuFlag } = this.state;
    const data = form.getFieldsValue(dateinfo);
    const addid = infoSelectMenuId;
    const basethis = this;
    form.validateFields(dateinfo, { force: true },
      (err) => {
        if (!err) {
          console.info('success');
          if (addOrUpdateMenuFlag === 'add') {
            if (addid === '0') {
              data.id = 'no1';
            } else {
              data.id = addid;
            }

            basethis.setState({ loading: true });
            addSonService({ parentid: addid, menuNewInfo: data }).then((result) => {
              this.setState({ infoSelectMenuId: null });
              if (result && result.result) {
                Modal.success({
                  title: '提示信息',
                  content: '添加菜单成功',
                });
                onNeedRefresh();
              } else {
                Modal.error({
                  title: '提示信息',
                  content: '添加菜单失败',
                });
              }
              basethis.setState({ loading: false });
            });
          } else {
            basethis.setState({ loading: true });
            // TODO
            updateMenuListService({ menuNewInfo: data }).then((result) => {
              if (result && result.result) {
                Modal.success({
                  title: '提示信息',
                  content: '修改菜单信息成功',
                });
                onNeedRefresh();
              } else {
                Modal.error({
                  title: '提示信息',
                  content: '修改菜单失败',
                });
              }
              basethis.setState({ loading: false });
            });
          }
        } else {
          console.log('输入数据有误');
        }
      },
    );
  };

  deleteMenu= () => {
    const { form, onNeedRefresh } = this.props;
    const data = form.getFieldsValue(['id']);
    if (!data) {
      Modal.info({ title: '提示信息', content: '请填写ID！' });
      return;
    }
    const basethis = this;
    confirm({
      title: '菜单项删除确认',
      content: '确定要删除该菜单么？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        basethis.setState({ loading: true });
        const dateinfo = ['align', 'altImage', 'createdBy', 'delFlag', 'description', 'height', 'id', 'image',
          'lastModifiedAt', 'lastModifiedBy', 'location', 'name', 'onDbclick', 'onMouseover', 'orderId', 'page',
          'parentId', 'onClick', 'roles', 'target', 'title', 'tooltip', 'url', 'version', 'width', 'fastId'];
        const datainfo = form.getFieldsValue(dateinfo);

        // TODO
        deleteMenuListService({ menuNewInfo: data }).then((result) => {
          if (result && result.result) {
            Modal.success({
              title: '提示信息',
              content: '删除菜单成功',
            });
            onNeedRefresh();
          } else {
            Modal.error({
              title: '提示信息',
              content: '删除菜单失败',
            });
          }
          basethis.setState({ loading: false });
        });
      },
      onCancel() {
      },
    });
  }

  showOperateInfo = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MenuManageModel/selectOneOperate',
      payload: { selectOneOperate: record },
    });
  };


  addOperate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MenuManageModel/addOperate',
    });
  };

  saveOrUpdateOperate= () => {
    const dateinfo = ['TITLE', 'NAME', 'ORDER_ID', 'ID'];

    const { form } = this.props;
    const { addOrUpdateOperateFlag, infoSelectMenuId } = this.state;
    const data = form.getFieldsValue(dateinfo);


    data.id = infoSelectMenuId;
    if (infoSelectMenuId === '0') {
      Modal.error({
        title: '提示信息',
        content: '总菜单下无法添加权限功能',
      });
      return;
    }

    form.validateFields(dateinfo, { force: true },
      (err) => {
        if (!err) {
          console.log('success');

          if (addOrUpdateOperateFlag === 'add') {
            addOperateService({ operateInfo: data }).then((result) => {
              if (result && result.result) {
                Modal.success({
                  title: '提示信息',
                  content: '添加权限成功',
                });
              } else {
                Modal.error({
                  title: '提示信息',
                  content: '添加权限失败',
                });
              }
            });
          } else if (addOrUpdateOperateFlag === 'update') {
            updateOperate({ operateInfo: data }).then((result) => {
              if (result && result.result) {
                Modal.success({
                  title: '提示信息',
                  content: '添加权限成功',
                });
              } else {
                Modal.error({
                  title: '提示信息',
                  content: '添加权限失败',
                });
              }
            });
          }
        } else {
          console.log('fail');
        }
      }
    );
  };

  deleteOperate= () => {
    const dateinfo = ['id', 'TITLE', 'NAME', 'ORDER_ID', 'ID'];
    const { form } = this.props;
    const data = form.getFieldsValue(dateinfo);
    if (!data.ID) {
      Modal.error({
        title: '提示信息',
        content: '请选择删除权限',
      });
    } else {
      deleteOperateService({ operateInfo: data }).then((result) => {
        if (result && result.result) {
          Modal.success({
            title: '提示信息',
            content: '删除权限成功',
          });
        } else {
          Modal.error({
            title: '提示信息',
            content: '删除权限失败',
          });
        }
      });
    }
  }


  render() {
    const { form, selectMenuInfo, currOperateList, operateRight, selectMenuId } = this.props;
    const { getFieldDecorator } = form;
    const { addOrUpdateOperateFlag, addOrUpdateMenuFlag } = this.state;
    const operateButton = addOrUpdateOperateFlag;
    const { loading } = this.state;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { height: '20px' },
    };

    const columns = [
      {
        title: 'ID',
        width: '25%',
        dataIndex: 'ID',
        key: 'ID',
        align: 'center',
        sorter: (a, b) => a.ID - b.ID,
      },
      {
        title: 'NAME',
        width: '25%',
        dataIndex: 'NAME',
        key: 'NAME',
        align: 'center',
        sorter: (a, b) => a.NAME.length - b.NAME.length,
      },
      {
        title: 'TITLE',
        width: '25%',
        dataIndex: 'TITLE',
        key: 'TITLE',
        align: 'center',
        sorter: (a, b) => a.TITLE.length - b.TITLE.length,
      },
      {
        title: 'ORDER_ID',
        width: '25%',
        dataIndex: 'ORDER_ID',
        key: 'ORDER_ID',
        align: 'center',
        sorter: (a, b) => a.ORDER_ID - b.ORDER_ID,
      },
    ];

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Button
                type="primary"
                style={{ margin: '0 20px 0 5px' }}
                onClick={this.addSon}
              ><Icon type="plus" />添加子菜单
              </Button>
              <Button
                type="primary"
                style={{ margin: '0 20px 0 5px' }}
                onClick={this.savaOrUpdateMenu}
              ><Icon type="save" />保存
              </Button>
              <Button
                type="primary"
                style={{ margin: '0 20px 0 5px' }}
                onClick={this.deleteMenu}
              ><Icon type="delete" />删除
              </Button>
            </Row>
            <Form>
              <Row gutter={40}>
                {/* 第1行 */}
                <Col span={7}>
                  <FormItem {...formItemLayout} label="id">
                    {getFieldDecorator('id', {
                      initialValue: selectMenuInfo.id ? selectMenuInfo.id : '',
                      rules: [
                        { required: false },

                      ] })(
                        <Input disabled />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="name">
                    {getFieldDecorator('name', {
                      initialValue: selectMenuInfo.name ? selectMenuInfo.name : '',
                      rules: [
                        { required: true },
                        { max: 100 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="title">
                    {getFieldDecorator('title', {
                      initialValue: selectMenuInfo.title ? selectMenuInfo.title : '',
                      rules: [
                        { required: true },
                        { max: 100 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} />
              </Row>
              {/* 第2行 */}
              <Row gutter={40}>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="onClick">
                    {getFieldDecorator('onClick', {
                      initialValue: selectMenuInfo.onClick ? selectMenuInfo.onClick : '',
                      rules: [
                        { required: false },
                        { max: 500 },
                      ] })(
                        <Input style={{ width: '250%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col span={7} />
                <Col span={7}>
                  <FormItem {...formItemLayout} label="fastId">
                    {getFieldDecorator('fastId', {
                      initialValue: selectMenuInfo.fastId ? `${selectMenuInfo.fastId}` : '',
                      rules: [
                        { required: false,
                          type: 'string',
                          message: 'input is not a number',
                          pattern: /^[0-9]+$/,
                        },
                        { max: 10 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} />
              </Row>
              {/* 第3行 */}
              <Row gutter={40}>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="orderId">
                    {getFieldDecorator('orderId', {
                      initialValue: selectMenuInfo.orderId ? `${selectMenuInfo.orderId}` : '',
                      rules: [
                        { required: false,
                          type: 'string',
                          message: 'input is not a number',
                          pattern: /^[0-9]+$/,
                        },
                        { max: 15 },
                      ] })(<Input disabled />)
                }
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="version">
                    {getFieldDecorator('version', {
                      initialValue: selectMenuInfo.version ? `${selectMenuInfo.version}` : '',
                      rules: [
                        { required: true,
                          type: 'string',
                          message: 'input is not a number',
                          pattern: /^[0-9]+$/,
                        },
                        { max: 15 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="align">
                    {getFieldDecorator('align', {
                      initialValue: selectMenuInfo.align ? selectMenuInfo.align : '',
                      rules: [
                        { required: false },
                        { max: 15 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} />
              </Row>
              {/* 第3行 */}
              <Row gutter={40}>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="alt_Image">
                    {getFieldDecorator('altImage', {
                      initialValue: selectMenuInfo.altImage ? selectMenuInfo.altImage : '',
                      rules: [
                        { required: false },
                        { max: 100 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="description">
                    {getFieldDecorator('description', {
                      initialValue: selectMenuInfo.description ? selectMenuInfo.description : '',
                      rules: [
                        { required: false },
                        { max: 255 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="width">
                    {getFieldDecorator('width', {
                      initialValue: selectMenuInfo.width ? `${selectMenuInfo.width}` : '',
                      rules: [
                        { required: false,
                          type: 'string',
                          message: 'input is not a number',
                          pattern: /^[0-9]+$/,
                        },
                        { max: 6 },

                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} />
              </Row>
              {/* 第4行 */}
              <Row gutter={40}>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="height">
                    {getFieldDecorator('height', {
                      initialValue: selectMenuInfo.height ? `${selectMenuInfo.height}` : '',
                      rules: [
                        { required: false,
                          type: 'string',
                          message: 'input is not a number',
                          pattern: /^[0-9]+$/,
                        },
                        { max: 6 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="image">
                    {getFieldDecorator('image', {
                      initialValue: selectMenuInfo.image ? selectMenuInfo.image : '',
                      rules: [
                        { required: false },
                        { max: 100 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="on_Dbclick">
                    {getFieldDecorator('onDbclick', {
                      initialValue: selectMenuInfo.onDbclick ? selectMenuInfo.onDbclick : '',
                      rules: [
                        { required: false },
                        { max: 200 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} />
              </Row>
              {/* 第5行 */}
              <Row gutter={40}>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="on_Mouseover">
                    {getFieldDecorator('onMouseover', {
                      initialValue: selectMenuInfo.onMouseover ? selectMenuInfo.onMouseover : '',
                      rules: [
                        { required: false },
                        { max: 200 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="page">
                    {getFieldDecorator('page', {
                      initialValue: selectMenuInfo.page ? `${selectMenuInfo.page}` : '',
                      rules: [
                        { required: false,
                          type: 'string',
                          message: 'input is not a number',
                          pattern: /^[0-9]+$/,
                        },
                        { max: 100 },

                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="location">
                    {getFieldDecorator('location', {
                      initialValue: selectMenuInfo.location ? selectMenuInfo.location : '',
                      rules: [
                        { required: false },
                        { max: 100 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} />
              </Row>
              {/* 第6行 */}
              <Row gutter={40}>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="target">
                    {getFieldDecorator('target', {
                      initialValue: selectMenuInfo.target ? selectMenuInfo.target : '',
                      rules: [
                        { required: false },
                        { max: 15 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="roles">
                    {getFieldDecorator('roles', {
                      initialValue: selectMenuInfo.roles ? selectMenuInfo.roles : '',
                      rules: [
                        { required: false },
                        { max: 100 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="tooltip">
                    {getFieldDecorator('tooltip', {
                      initialValue: selectMenuInfo.tooltip ? selectMenuInfo.tooltip : '',
                      rules: [
                        { required: false },
                        { max: 255 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} />
              </Row>
              {/* 第7行 */}
              <Row gutter={40}>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="url">
                    {getFieldDecorator('url', {
                      initialValue: selectMenuInfo.url ? selectMenuInfo.url : '',
                      rules: [
                        { required: false },
                        { max: 255 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="parent_Id">
                    {getFieldDecorator('parentId', {
                      initialValue: selectMenuInfo.parentId ? selectMenuInfo.parentId : '',
                      rules: [
                        { required: false },
                        { max: 20 },
                      ] })(
                        <Input disabled />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="del_Flag">
                    {getFieldDecorator('delFlag', {
                      initialValue: selectMenuInfo.delFlag ? `${selectMenuInfo.delFlag}` : '',
                      rules: [
                        { required: false,
                          type: 'string',
                          message: 'input is not a number',
                          pattern: /^[0-9]+$/,
                        },
                        { max: 1 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} />
              </Row>
              {/* 第8行 */}
              <Row gutter={40}>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="created_By">
                    {getFieldDecorator('createdBy', {
                      initialValue: selectMenuInfo.createdBy ? selectMenuInfo.createdBy : '',
                      rules: [
                        { required: false },
                        { max: 20 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="last_Modified_By">
                    {getFieldDecorator('lastModifiedBy', {
                      initialValue: selectMenuInfo.lastModifiedBy ? `${selectMenuInfo.lastModifiedBy}` : '',
                      rules: [
                        { required: false,
                          type: 'string',
                          message: 'input is not a number',
                          pattern: /^[0-9]+$/,
                        },
                        { max: 20 },

                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="last_Modified_At">
                    {getFieldDecorator('lastModifiedAt', {
                      initialValue: selectMenuInfo.lastModifiedAt ? `${selectMenuInfo.lastModifiedAt}` : '',
                      rules: [
                        { required: false,
                          type: 'string',
                          message: 'input is not a number',
                          pattern: /^[0-9]+$/,
                        },
                        { max: 15 },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} />
              </Row>
            </Form>
            <Divider />
            <Row gutter={40}>
              <Col span={21}>
                <Row gutter={40}>
                  <Col span={16}>

                    <Table
                      columns={columns}
                      className={styles.tableList}
                      scroll={{ y: 265 }}
                      dataSource={currOperateList}
                      rowKey="id"
                      size="little"

                      locale={{ emptyText: '暂无数据' }}
                      pagination={false}
                  // rowSelection={rowSelection}
                      onRowClick={(record, index) => {
                        this.showOperateInfo(record, index);
                      }}
                    />

                  </Col>
                  <Col span={8}>
                    <Form layout="horizontal">
                      <FormItem {...formItemLayout} label="ID">
                        {getFieldDecorator('ID', { initialValue: operateRight.ID ? operateRight.ID : '',
                          rules: [{ required: false, message: '请填写名称!' },
                            { max: 100 },
                          ],
                        })(
                          <Input disabled placeholder="" maxLength="15" />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="NAME">
                        {getFieldDecorator('NAME', { initialValue: operateRight.NAME ? operateRight.NAME : '',
                          rules: [{ required: true, message: '请填写NAME!' },
                            { max: 100 },
                          ] })(

                            <Input placeholder="" maxLength="15" />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="TITLE">
                        {getFieldDecorator('TITLE', { initialValue: operateRight.TITLE ? operateRight.TITLE : '',
                          rules: [{ required: true, message: '请填写TITLE!' },
                            { max: 50 },
                          ] })(

                            <Input placeholder="" maxLength="15" />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="ORDER_ID">
                        {getFieldDecorator('ORDER_ID', { initialValue: (operateRight.ORDER_ID || operateRight.ORDER_ID === 0) ? `${operateRight.ORDER_ID}` : '',
                          rules: [
                            { required: true,
                              type: 'string',
                              message: 'input is not a number',
                              pattern: /^[0-9]+$/,
                            },
                            { max: 10 },
                          ] })(
                            <Input placeholder="" maxLength="15" />
                        )}
                      </FormItem>

                    </Form>
                  </Col>
                </Row>
              </Col>

              <Col span={3}>
                <Row>
                  <Button
                    type="primary"
                    style={{ margin: '5px 0 5px 0' }}
                    onClick={this.addOperate}
                  ><Icon type="plus" />添加
                  </Button>
                </Row>
                <Row>
                  <Button
                    type="primary"
                // style={{ display: this.state.visibleAll }}
                    style={{ margin: '5px 0 5px 0' }}
                    onClick={this.saveOrUpdateOperate}
                  ><Icon type="save" />保存
                  </Button>
                </Row>
                <Row>
                  <Button
                    type="primary"
                    style={{ margin: '5px 0 5px 0' }}
                    onClick={this.deleteOperate}
                  ><Icon type="delete" />删除
                  </Button>
                </Row>
              </Col>
            </Row>
          </div>
          <div style={{ display: loading ? '' : 'none' }} className={stylesx.loadingDiv}>
            <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
          </div>
        </div>
      </div>


    );
  }
}
MenuManageInfo.propTypes = {
  menuList: PropTypes.array,
  selectMenuInfo: PropTypes.object,
};
MenuManageInfo.defaultProps = {
  menuList: [],
  selectMenuInfo: {},
};

function mapPropsToFields(props) {
  console.log('mapPropsToFields', props);
  return {
    // email: createFormField(props.formState.email),
  };
}

export default Form.create(mapPropsToFields)(MenuManageInfo);
