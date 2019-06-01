/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import { Form, Row, Col, Tabs, Input, Table, Button, Icon, Modal } from 'antd';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TextArea } = Input;
class SysParamInfo extends React.Component {
  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  // 系统确认修改
  handleOk() {
    const { form, recordInfo, onUpdateRecord } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onUpdateRecord({ ...values, paramcode: recordInfo.paramcode, paramstate: '0' }, recordInfo);
      } else {
        return err;
      }
    });
  }

  // 系统参数取消修改
  handleCancel() {
    const { onCloseModal, form } = this.props;
    form.resetFields();
    onCloseModal();
  }

  render() {
    const { form, sysparaminfovisible, recordInfo, key } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      style: { height: '20px' },
    };

    return (
      <Modal
        title="系统参数修改"
        visible={sysparaminfovisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        key={key}
      >
        <Form style={{ height: '220px' }}>
          <FormItem {...formItemLayout} label="参数代码">
            {getFieldDecorator('paramcode', { initialValue: '' })(
              <span>{recordInfo.paramcode}</span>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="参数名称">
            {getFieldDecorator('paramname', {
              initialValue: recordInfo.paramname,
              rules: [{
                required: true, message: '请输入参数名称!',
              }],
            })(
              <Input placeholder="" maxLength="100" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="参数值">
            {getFieldDecorator('paramvalue', {
              initialValue: recordInfo.paramvalue,
              rules: [{
                required: true, message: '请输入参数值!',
              }],
            })(
              <Input placeholder="" maxLength="2000" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="参数描述">
            {getFieldDecorator('paramcontent', { initialValue: recordInfo.paramcontent })(
              <TextArea rows={3} maxLength="250" />
            )}
          </FormItem>
        </Form>
      </Modal>

    );
  }
}
SysParamInfo.prototypes = {};
export default Form.create()(SysParamInfo);
