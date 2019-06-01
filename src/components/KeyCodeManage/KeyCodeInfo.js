/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import { Form, Row, Input, Modal, message } from 'antd';
import { keyCodeMap } from '../../config/enums';

const FormItem = Form.Item;
let currentHotKey = '';// 记录当前输入的keycode
class KeyCodeInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyInputValue: '',
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { form } = this.props;
    let hotkey = '';
    const key = `${nextProps.recordInfo.hotkey}`;
    currentHotKey = key;
    if (key.substring(0, 1) == 'A') {
      hotkey = 'Alt+';
      if (keyCodeMap[key.substring(1)]) {
        hotkey += keyCodeMap[key.substring(1)];
      } else {
        hotkey = '';
      }
    } else if (keyCodeMap[key]) {
      hotkey = keyCodeMap[key];
    }
    this.setState({
      keyInputValue: hotkey,
    }, () => {
      form.resetFields();
    });
  }

  onKeyUp(e) {
    const { form } = this.props;
    if (e && e.preventDefault) {
      e.preventDefault();
    } else {
      window.event.returnValue = false;
      return false;
    }
    const keyValue = [];
    if (e.altKey) {
      if (keyCodeMap[e.keyCode] && e.keyCode >= 65 && e.keyCode <= 90) {
        keyValue.push('Alt');
        keyValue.push(keyCodeMap[e.keyCode]);
        currentHotKey = `A${e.keyCode}`;
      } else if (keyCodeMap[e.keyCode] && (e.keyCode < 65 || e.keyCode > 90)) {
        message.warn('请设置数字、字母、标点符号及Alt+字母，不要使用中文输入法及英文全角输入法');
      }
    } else if (keyCodeMap[e.keyCode]) {
      keyValue.push(keyCodeMap[e.keyCode]);
      currentHotKey = `${e.keyCode}`;
    }
    if (keyValue.length > 0) {
      this.setState({
        keyInputValue: keyValue.join('+'),
      }, () => {
        form.resetFields();
      });
    } else if (!e.altKey) {
      message.warn('请设置数字、字母、标点符号及Alt+字母，不要使用中文输入法及英文全角输入法');
    }
  }

  // 系统确认修改
  handleOk() {
    const { form, recordInfo, onUpdateRecord, onCloseModal } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onUpdateRecord(currentHotKey, recordInfo);
      } else {
        return err;
      }
    });
  }

  // 系统参数取消修改
  handleCancel() {
    const { form, onCloseModal } = this.props;
    onCloseModal();
    form.resetFields();
    currentHotKey = '';
  }

  render() {
    const { form, keycodeinfovisible, recordInfo } = this.props;
    const { keyInputValue } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      style: { height: '20px' },
    };
    return (
      <Modal
        title="快捷键修改"
        visible={keycodeinfovisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <Row>
            <FormItem {...formItemLayout} label="所属界面">
              {getFieldDecorator('pagename', {
                initialValue: recordInfo.pagename,
              })(
                <Input maxLength={6} style={{ width: '300px' }} disabled />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem {...formItemLayout} label="页面元素">
              {getFieldDecorator('pageelement', {
                initialValue: recordInfo.pageelement,
              })(<Input maxLength={160} style={{ width: '300px' }} disabled />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem {...formItemLayout} label="快捷键">
              {getFieldDecorator('hotkey', {
                initialValue: keyInputValue,
                rules: [{
                  required: true,
                  message: '请输入正确的快捷键!',
                }],
              })(
                <Input onKeyDown={this.onKeyUp} maxLength={255} style={{ width: '300px' }} />)}
            </FormItem>
          </Row>
          <div style={{ paddingLeft: '19%', color: '#E2C835' }}><span>注：IE11下Alt+D已被占用，请设置其他快捷键</span></div>
        </Form>
      </Modal>
    );
  }
}
KeyCodeInfo.prototypes = {};
export default Form.create()(KeyCodeInfo);
