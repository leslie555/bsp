/**
 * Created by Administrator on 2018/1/26 0026.
 */
/* eslint-disable   */
import React, { Component } from 'react';
import { Modal, Form, Input, Collapse, Row, Col, DatePicker, Radio, Select, Icon, Button, Cascader, AutoComplete,
  Popover, Tooltip, Table } from 'antd';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
class ThemeModal extends Component {
  constructor(props) {
    super(props);


    this.state = {
      visible: this.props.visible,

    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.props.form.resetFields();
    this.setState({
      visible: true,
    });
  };


  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.LKMC == null || values.LKMC == '') {
          Modal.error({
            title: '错误',
            content: '请输入路口名称',
          });
        } else if (values.LKDM === null || values.LKDM == '') {
          Modal.error({
            title: '错误',
            content: '路口代码不能为空',
          });
        } else {
          console.log(` 上传  ${JSON.stringify(values)}`);
          onOk(values, this.hideModelHandler);
        }
      }
    });
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 13 },
    };
    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="添加路口"
          visible={this.state.visible}
          // onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          width="40%"
        >
          caoyu
        </Modal>
      </span>
    );
  }
}

const mapPropsToFields = ({ user }) => {
  return user;
};
export default Form.create(mapPropsToFields)(ThemeModal);
