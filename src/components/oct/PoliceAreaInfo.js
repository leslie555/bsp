/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, Icon, Input, DatePicker, Modal, Cascader } from 'antd';
import moment from 'moment';
import { DEVICE_GROUP_ENUM } from '../../config/enums';
import 'antd/dist/antd.css';
import { addRoad, deleteRoad, editRoad } from '../../services/octPoliceArea';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const endTime = moment();
const { Option } = Select;
const { confirm } = Modal;

class PoliceAreaInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // displayName: 'none',
      infoSelectGroupId: '0',
      addOrUpdateGroupFlag: 'edit',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { selectGroupId, nodeInfo } = this.props;
    if (this.props && nextProps) {
      if (nodeInfo !== nextProps.nodeInfo) {
        console.log('this.props.nodeInfo');
        console.log(nodeInfo);
        nextProps.form.resetFields();
      }
      if (selectGroupId !== nextProps.selectGroupId) {
        nextProps.form.resetFields();
        this.setState({ infoSelectGroupId: nextProps.selectGroupId });
        if (nextProps.selectGroupId === '0') {
          this.setState({ addOrUpdateGroupFlag: 'add' });
          console.log('addMenu');
        } else {
          console.log('updateMenu');
          this.setState({ addOrUpdateGroupFlag: 'edit' });
        }
      }
    }
  }

  addSon= () => {
    const { nodeInfo } = this.props;
    this.setState({ addOrUpdateGroupFlag: 'add', infoSelectGroupId: nodeInfo.policeId });
    const { dispatch } = this.props;
    dispatch({
      type: 'octPoliceArea/addSon',
      // payload: { pid: groupinfo.id }
    });
  };

  savaOrUpdateGroup = () => {
    const dateinfo = ['name', 'fullname', 'areaid', 'level'];
    const { form, onNeedRefresh, nodeInfo } = this.props;
    const { infoSelectGroupId, addOrUpdateGroupFlag } = this.state;
    const data = form.getFieldsValue(dateinfo);
    const addid = infoSelectGroupId;
    const basethis = this;
    form.validateFields(dateinfo, { force: true },
      (err) => {
        if (!err) {
          console.info('success');
          if (addOrUpdateGroupFlag === 'add') {
            if (addid === '0') {
              data.policeId = 'no1';
            } else {
              data.policeId = addid;
            }
            basethis.setState({ loading: true });
            // 增加设备分组++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            console.log(nodeInfo.policeId);
            addRoad({
              policeParentId: addid,
              name: data.name,
              fullname: data.fullname,
              areaid: data.areaid,
              level: data.level,
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
            editRoad({
              policeId: nodeInfo.policeId,
              name: data.name,
              fullname: data.fullname,
              areaid: data.areaid,
              level: data.level,
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
  };

  deleteGroup= () => {
    console.error('----------------');
    const { nodeInfo, onNeedRefresh } = this.props;
    console.log(nodeInfo);
    const basethis = this;
    confirm({
      title: '分组删除确认',
      content: '确定要删除该分组么？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        basethis.setState({ loading: true });
        // const dateinfo = ['name', 'desc'];
        // const datainfo = form.getFieldsValue(dateinfo);
        deleteRoad({ policeId: nodeInfo.policeId }).then((result) => {
          if (result && result.result) {
            Modal.success({
              title: '提示信息',
              content: '删除分组成功',
            });
            // onNeedRefresh();
          } else {
            Modal.error({
              title: '提示信息',
              content: '删除分组失败，该分组下还有子分组！',
            });
          }
          basethis.setState({ loading: false });
          onNeedRefresh();
        });
      },
      onCancel() {
      },
    });
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
      options.push(<Option value="">未选择</Option>);
    }
    for (let i = 0; i < enumList.length; i += 1) {
      if (enumList[i].enumtypeid === (enumsid || '')) {
        options.push(<Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue}>{enumList[i].enumname}</Option>);
      }
    }
    return options;
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      style: { height: '50px' },
    };
    const { form, codeList, nodeInfo, onDelete, onAdd, nodeSelected } = this.props;
    const { getFieldDecorator } = form;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    const reg = new RegExp('^[0-9]*$');
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Button
                type="primary"
                style={{ margin: '0 20px 0 5px' }}
                disabled={!nodeSelected}
                onClick={this.addSon}
              ><Icon type="plus" />添加子警务区
              </Button>
              <Button
                type="primary"
                style={{ marginRight: '20px' }}
                disabled={!nodeSelected}
                onClick={this.savaOrUpdateGroup}
              ><Icon type="save" />保存
              </Button>
              <Button
                type="primary"
                style={{ margin: '0 20px 0 5px' }}
                disabled={!nodeSelected}
                onClick={this.deleteGroup}
              ><Icon type="delete" />删除
              </Button>
            </Row>
            <Form>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="警务区名称">
                    {getFieldDecorator('name', {
                      initialValue: nodeInfo.policeName,
                      rules: [
                        { required: true },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="警务区全名">
                    {getFieldDecorator('fullname', {
                      initialValue: nodeInfo.fullname,
                      rules: [
                        { required: true },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="序号">
                    {getFieldDecorator('level', {
                      initialValue: nodeInfo.level,
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="AreaID">
                    {getFieldDecorator('areaid', {
                      initialValue: nodeInfo.areaid,
                      rules: [
                        { required: true },
                      ] })(
                        <Input />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
PoliceAreaInfo.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(PoliceAreaInfo);
