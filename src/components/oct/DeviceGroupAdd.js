/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, Icon, Input, Divider, Spin, Cascader, Modal } from 'antd';
import moment from 'moment';
import { DYGX } from '../../config/enums';
import 'antd/dist/antd.css';
import { addSonService, deleteGroupService, updateGroupListService } from '../../services/octDeviceGroup';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

class DeviceGroupAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // displayName: 'none',
      infoSelectGroupId: '0',
      addOrUpdateGroupFlag: 'edit',
      allStatistics: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { selectGroupId, nodeInfo } = this.props;
    if (this.props && nextProps) {
      if (nodeInfo !== nextProps.nodeInfo) {
        nextProps.form.resetFields();
      }
      if (selectGroupId !== nextProps.selectGroupId) {
        nextProps.form.resetFields();
        this.setState({ infoSelectGroupId: nextProps.selectGroupId });
        if (nextProps.selectGroupId === '0') {
          this.setState({ addOrUpdateGroupFlag: 'add' });
        } else {
          this.setState({ addOrUpdateGroupFlag: 'edit' });
        }
      }
    }
  }

  onsave = () => {
    const { menuList, onSave, form } = this.props;
    onSave(form.getFieldValue('value').join());
  }

  getname = () => {
    const { menuList, nodeInfo } = this.props;
    const { allStatistics } = this.state;
    return this.handleEnumOption(DYGX);
    // if (nodeInfo.queryvalue !== null || nodeInfo.queryvalue !== undefined) {
    //   return this.handleEnumOption(DYGX);
    // }
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

  savaOrUpdateGroup = () => {
    const dateinfo = ['name', 'desc', 'levels'];
    const dateinfoP = ['name', 'desc', 'levels', 'queryvalue'];
    const { form, onNeedRefresh, nodeInfo } = this.props;
    const { infoSelectGroupId, addOrUpdateGroupFlag } = this.state;
    const data = form.getFieldsValue(dateinfo);
    const dataP = form.getFieldsValue(dateinfoP);
    const addid = infoSelectGroupId;
    const basethis = this;
    console.log('nodeInfo.pid:', nodeInfo.pid);
    if (nodeInfo.pid !== '8e6fb077fb1049ba8d0ea68970d2a1d6') {
      form.validateFields(dateinfo, { force: true },
        (err) => {
          if (!err) {
            if (addOrUpdateGroupFlag === 'add') {
              if (addid === '0') {
                data.id = 'no1';
              } else {
                data.id = addid;
              }
              basethis.setState({ loading: true });
              // 增加设备分组++++++++++++++++++++++++++++++++++++++++++++++++++++++
              addSonService({
                pid: addid,
                name: data.name,
                desc: data.desc,
                queryvalue: '',
                levels: data.levels,
              }).then((result) => {
                this.setState({ infoSelectGroupId: null });
                if (result && result.result) {
                  Modal.success({
                    title: '提示信息',
                    content: '添加分组成功',
                  });
                  onNeedRefresh();
                } else {
                  Modal.error({
                    title: '提示信息',
                    content: '添加分组失败',
                  });
                }
                basethis.setState({ loading: false, addOrUpdateGroupFlag: 'edit' });
              });
            } else {
              basethis.setState({ loading: true });
              // 编辑设备分组+++++++++++++++++++++++++++++++++++++++++++++++
              updateGroupListService({
                id: nodeInfo.id,
                name: data.name,
                desc: data.desc,
                queryvalue: '',
                levels: data.levels,
              }).then((result) => {
                if (result && result.result) {
                  Modal.success({
                    title: '提示信息',
                    content: '修改分组信息成功',
                  });
                  onNeedRefresh();
                } else {
                  Modal.error({
                    title: '提示信息',
                    content: '修改分组失败',
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
    } else {
      form.validateFields(dateinfoP, { force: true },
        (err) => {
          if (!err) {
            if (addOrUpdateGroupFlag === 'add') {
              if (addid === '0') {
                data.id = 'no1';
              } else {
                data.id = addid;
              }
              basethis.setState({ loading: true });
              // 增加设备分组++++++++++++++++++++++++++++++++++++++++++++++++++++++
              addSonService({
                pid: addid,
                name: dataP.name,
                desc: dataP.desc,
                queryvalue: dataP.queryvalue,
                levels: dataP.levels,
              }).then((result) => {
                this.setState({ infoSelectGroupId: null });
                if (result && result.result) {
                  Modal.success({
                    title: '提示信息',
                    content: '添加分组成功',
                  });
                  onNeedRefresh();
                } else {
                  Modal.error({
                    title: '提示信息',
                    content: '添加分组失败',
                  });
                }
                basethis.setState({ loading: false, addOrUpdateGroupFlag: 'edit' });
              });
            } else {
              basethis.setState({ loading: true });
              // 编辑设备分组+++++++++++++++++++++++++++++++++++++++++++++++
              updateGroupListService({
                id: nodeInfo.id,
                name: dataP.name,
                desc: dataP.desc,
                queryvalue: dataP.queryvalue,
                levels: dataP.levels,
              }).then((result) => {
                if (result && result.result) {
                  Modal.success({
                    title: '提示信息',
                    content: '修改分组信息成功',
                  });
                  onNeedRefresh();
                } else {
                  Modal.error({
                    title: '提示信息',
                    content: '修改分组失败',
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
    }
  };

  addSon = () => {
    const { selectGroupId, groupinfo, selectMenuLevel, nodeInfo } = this.props;
    this.setState({ addOrUpdateGroupFlag: 'add', infoSelectGroupId: nodeInfo.id });
    const { dispatch } = this.props;
    dispatch({
      type: 'octDeviceGroup/addSon',
      // payload: { pid: groupinfo.id }
    });
  };

  deleteGroup = () => {
    const { nodeInfo, form, onNeedRefresh, dispatch } = this.props;
    const basethis = this;
    confirm({
      title: '分组删除确认',
      content: '确定要删除该分组么？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        basethis.setState({ loading: true });
        deleteGroupService({ id: nodeInfo.id }).then((result) => {
          if (result && result.result) {
            Modal.success({
              title: '提示信息',
              content: '删除分组成功',
            });
          } else {
            Modal.error({
              title: '提示信息',
              content: '删除分组失败，该分组下还有子分组！',
            });
          }
          basethis.setState({ loading: false });
          onNeedRefresh();
          // dispatch({
          //   type: 'octDeviceGroup/queryAllGroup',
          //   // payload: { nodeInfo: {} },
          // });
        });
      },
      onCancel() {
      },
    });
  }

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
  }

  // 查询设备列表
  handleSubmit() {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onSearch(values);
      }
    });
  }

  // 获取枚举值
  handleEnumOption(enumsid) {
    const options = [];
    const { enumList } = this.props;
    if (enumList.length > 0) {
      for (let i = 0; i < enumList.length; i += 1) {
        if (enumList[i].enumtypeid === (enumsid || '')) {
          options.push(<Option key={`enuma-${enumList[i].enumvalue}`}>{enumList[i].enumname}</Option>);
        }
      }
    }
    return options;
  }

  render() {
    const { allStatistics } = this.state;
    const { nodeInfo, flag, menuList, form, handleChange, onSave, queryvalue } = this.props;
    console.log('nodeInfo:', nodeInfo);
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { height: '20px' },
    };
    const myformItemLayout = {
      labelCol: { span: 14 },
      wrapperCol: { span: 10 },
      style: { height: '20px' },
    };
    const formItemLayout2 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      style: { height: '20px' },
    };
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row style={{ marginBottom: '1rem' }}>
              <Button
                type="primary"
                style={{ margin: '0 20px 0 5px' }}
                onClick={this.addSon}
              ><Icon type="plus" />添加子分组
              </Button>
              <Button
                type="primary"
                style={{ marginRight: '20px' }}
                onClick={this.savaOrUpdateGroup}
              ><Icon type="save" />保存分组信息
              </Button>
              <Button
                type="primary"
                style={{ margin: '0 20px 0 5px' }}
                // onClick={deleteGroup}
                onClick={this.deleteGroup}
              ><Icon type="delete" />删除分组
              </Button>
            </Row>
            <Form>
              <Row gutter={40}>
                {/* 第1行 */}
                <Col span={6}>
                  <FormItem {...formItemLayout} label="分组名称">
                    {getFieldDecorator('name', {
                      initialValue: nodeInfo.name ? nodeInfo.name : '',
                      rules: [
                        { required: true },
                      ],
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="分组描述">
                    {getFieldDecorator('desc', {
                      initialValue: nodeInfo.desc ? nodeInfo.desc : '',
                      rules: [
                        { required: true },
                      ],
                    })(
                      <Input span={6} />
                    )}
                  </FormItem>
                </Col>
                <Col span={6} style={{ display: nodeInfo.pid !== '8e6fb077fb1049ba8d0ea68970d2a1d6' ? 'none' : 'block' }}>
                  <FormItem {...myformItemLayout} label="分组与查询对应值">
                    {getFieldDecorator('queryvalue', {
                      initialValue: nodeInfo.queryvalue ? nodeInfo.queryvalue : '',
                      rules: [
                        { required: true },
                      ],
                    })(
                      <Input
                        type="number"
                        min={1}
                        span={4}
                      // disabled={flag != 2 || Boolean(queryvalue)}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="序号">
                    {getFieldDecorator('levels', {
                      initialValue: nodeInfo.levels ? nodeInfo.levels : '',
                      // rules: [
                      //   { required: true },
                      // ],
                    })(
                      <Input
                        type="number"
                        min={1}
                        span={4}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Form>
              <Row gutter={40}>
                <Col span={14}>
                  <FormItem {...formItemLayout2} label="分组对应查询">
                    {getFieldDecorator('value', {
                      initialValue: nodeInfo.queryvalue ? String(nodeInfo.queryvalue).split(',') : [],
                      // initialValue: nodeInfo.queryvalue,
                      rules: [
                        { required: true },
                      ],
                    })(
                      <Select
                        mode="multiple"
                        initialValue={nodeInfo.queryvalue ? String(nodeInfo.queryvalue).split(',') : []}
                        // defaultValue={nodeInfo.queryvalue}
                        placeholder="请选择对应的统计查询"
                        disabled={flag != 2 || Boolean(queryvalue)}
                        onChange={handleChange}
                      >
                        {this.getname()}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <Button disabled={flag != 2 || Boolean(queryvalue)} onClick={this.onsave}>
                    保存分组对应查询
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
DeviceGroupAdd.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
  groupinfo: PropTypes.object,
};
DeviceGroupAdd.defaultProps = {
  // menuList: [],
  groupinfo: {},
};
export default Form.create()(DeviceGroupAdd);
