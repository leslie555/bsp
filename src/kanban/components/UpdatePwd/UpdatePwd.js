/**
 * Created by Administrator on 2018/7/24.
 */
import { Modal, Form, Button, Row, Input } from 'antd';
import React from 'react';
import styles from './UpdatePwd.less';
import { updatePwdForOperator } from '../../services/commonService';

const sha512 = require('js-sha512');

const FormItem = Form.Item;

class UpdatePwd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveLoading: false,
    };
  }

  onClose = () => {
    const { onClose, form } = this.props;
    onClose();
    form.resetFields();
  }

  savePwd = () => {
    const { form, userid, userpwd } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (values.cuserpwdnew !== values.cuserpwdnew2) {
          Modal.info({ title: '提示', content: '新密码与确认密码不一致，请重新输入' });
        } else {
          this.setState({ saveLoading: true });
          updatePwdForOperator({
            nuserid: userid,
            cuserpwdnew: sha512(values.cuserpwdnew + userid),
            cuserpwdold: sha512(values.cuserpwd + userid),
          }).then(data => {
            this.setState({ saveLoading: false });
            if (data && data.result == 1) {
              Modal.success({ title: '成功', content: '密码修改成功' });
              this.onClose();
            } else if (data && data.result === '-99') {
              Modal.error({ title: '失败', content: data.msg });
            } else if (data && data.result === '-98') {
              Modal.error({ title: '失败', content: data.msg });
            } else if (data && data.result === '-97') {
              Modal.error({ title: '失败', content: data.msg });
            } else {
              Modal.error({ title: '失败', content: '密码修改失败，请联系管理员' });
            }
          });
        }
      }
    });
  }

  render() {
    const { visible, form, userid, pwdComplexity } = this.props;
    const { saveLoading } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };
    return (
      <Modal
        title="修改密码"
        maskClosable="false"
        visible={visible}
        onCancel={this.onClose}
        width="25%"
        footer={[
          <Form layout="inline">
            <FormItem>
              <Button
                type="primary"
                onClick={() => {
                  this.savePwd();
                }}
                loading={saveLoading}
              >
                保存
              </Button>
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.onClose} loading={saveLoading}>
                取消
              </Button>
            </FormItem>
          </Form>,
        ]}
      >
        <Form hideRequiredMark="true">
          <Row gutter={20} className={styles.disableInput}>
            <FormItem {...formItemLayout} label="用户名">
              {getFieldDecorator('nuserid', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input maxLength="6" disabled="true" />)}
            </FormItem>
          </Row>
          <Row gutter={20}>
            <FormItem {...formItemLayout} label="原密码">
              {getFieldDecorator('cuserpwd', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请输入原密码',
                  },
                ],
              })(<Input type="password" autocomplete="off" />)}
            </FormItem>
          </Row>
          <Row gutter={20}>
            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator('cuserpwdnew', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message:
                      pwdComplexity === '1'
                        ? '密码必须是包含大小写字母、数字、特殊字符至少两种组合在内的8~16个字符!'
                        : '请输入中文除外的1-16位密码',
                    pattern:
                      pwdComplexity === '1'
                        ? new RegExp('^(?![0-9]*$)(?![a-z]*$)(?![A-Z]*$)(?![^a-zA-Z0-9]*$).{8,16}$')
                        : new RegExp('^[^\u4e00-\u9fa5]{1,16}$'),
                  },
                ],
              })(<Input type="password" autocomplete="off" />)}
            </FormItem>
          </Row>
          <Row gutter={20}>
            <FormItem {...formItemLayout} label="确认密码">
              {getFieldDecorator('cuserpwdnew2', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message:
                      pwdComplexity === '1'
                        ? '密码必须是包含大小写字母、数字、特殊字符至少两种组合在内的8~16个字符!'
                        : '请输入中文除外的1-16位密码',
                    pattern:
                      pwdComplexity === '1'
                        ? new RegExp('^(?![0-9]*$)(?![a-z]*$)(?![A-Z]*$)(?![^a-zA-Z0-9]*$).{8,16}$')
                        : new RegExp('^[^\u4e00-\u9fa5]{1,16}$'),
                  },
                ],
              })(<Input type="password" autocomplete="off" />)}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    );
  }
}
function mapPropsToFields(props) {
  const { userid } = props;
  return {
    nuserid: Form.createFormField({
      value: userid || '',
    }),
  };
}

export default Form.create({ mapPropsToFields })(UpdatePwd);
