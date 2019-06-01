/**
 * Created by Administrator on 2018/7/23.
 */
import {
  Modal,
  Form,
  Row,
  Button,
  Input,
  notification,
  message,
} from 'antd';
import React from 'react';
// import { message } from 'antd/lib/index';
import styles from './IPEditModal.less';
import { IPAdd, IpEdit } from '../../services/accmservice';

const FormItem = Form.Item;

class IPEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.checkIpIlleagle = this.checkIpIlleagle.bind(this);
  }

  // 添加保存
  IPSave = () => {
    const { form, editMode, record, onRefreshData } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const segmentName = values.SEGMENT_NAME;
        const startAddress = values.START_ADDRESS;
        const endAddress = values.END_ADDRESS;
        const userId = values.USER_ID;
        const result = this.checkIpIlleagle(startAddress, endAddress);
        if (result === '1') {
          message.error('起始、结束地址不在同一网段内！');
          return;
        } else if (result === '2') {
          message.error('起始地址大于结束地址！');
          return;
        }
        if (editMode == 1) {
          IPAdd({
            loginrestrict: { segmentName, startAddress, endAddress, userId },
          }).then((data) => {
            if (data && data.result == 'success') {
              notification.success({ message: '保存成功！' });
              onRefreshData();
              this.IPClose();
            } else if (data && data.result == 'repeat') {
              notification.error({ message: '保存失败,网段名称冲突！' });
            } else {
              notification.error({ message: '保存失败！' });
            }
          }).catch((e) => {
            notification.error({ message: '保存失败！' });
          });
        } else if (editMode == 2) {
          // 修改后
          const des = {
            segmentName: values.SEGMENT_NAME,
            startAddress: values.START_ADDRESS,
            endAddress: values.END_ADDRESS,
            userId: values.USER_ID,
            lrpkid: record.lrpkid,
            operatingTime: record.operating_time,
            recoeder: record.recorder,
          };
          // src 是修改前
          IpEdit({ des, src: record }).then((data) => {
            if (data) {
              notification.success({ message: '保存成功！' });
              onRefreshData();
              this.IPClose();
            } else {
              notification.error({ message: '保存失败！' });
            }
          }).catch((e) => {
            notification.error({ message: '保存失败！' });
          });
        }
      }
    });
  }

  // IP校验
  checkIpIlleagle = (startIp, endIp) => {
    const startIpArr = startIp.split('.');
    const endIpArr = endIp.split('.');
    for (let i = 0; i < 4; i += 1) {
      if (i === 3 && parseInt(startIpArr[i], 10) > parseInt(endIpArr[i], 10)) {
        return '2';// 不符合开始ip段小于等于结束IP段
      }

      if (i < 3 && startIpArr[i] !== endIpArr[i]) {
        return '1';// 不符合在同一网段
      }
    }
    return '0';// 符合要求
  }

  // 重置数据
  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
  }

  // 关闭
  IPClose = () => {
    const { form, resetCallback } = this.props;
    form.resetFields();
    resetCallback();
  }

  render() {
    const { visible, nuserid, editMode, record, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };
    const regExp = new RegExp(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/);
    return (
      <div className={styles.ipEditModal}>
        <Modal
          title={`${editMode === 0 ? '' : (editMode === 1 ? '添加' : '修改')}登录IP`}
          maskClosable="false"
          visible={visible}
          onCancel={this.IPClose}
          width="25%"
          footer={[
            <Form layout="inline">
              <FormItem>
                <Button
                  type="primary"
                  onClick={() => { this.IPSave(); }}
                >
                  保存
                </Button>
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.IPClose}>
                  取消
                </Button>
              </FormItem>
            </Form>,
          ]}
        >
          <Form onSubmit={this.IPSave}>
            <Row gutter={20}>
              <FormItem {...formItemLayout} label="网段名称">
                {getFieldDecorator('SEGMENT_NAME', {
                  initialValue: editMode === 2 ? record.segment_name : '',
                  rules: [{
                    required: true,
                    pattern: '^[\u4E00-\u9FA5a-zA-Z0-9_]{1,30}$',
                    message: '请输入网段名称(中英文数字下划线，最多30个字符)!',
                  }],
                })(<Input />)}
              </FormItem>
            </Row>
            <Row gutter={20}>
              <FormItem {...formItemLayout} label="起始地址">
                {getFieldDecorator('START_ADDRESS', {
                  initialValue: editMode === 2 ? record.start_address : '',
                  rules: [{
                    required: true,
                    message: '请输入正确起始地址!',
                    pattern: regExp,
                  }],
                })(<Input />)}
              </FormItem>
            </Row>
            <Row gutter={20}>
              <FormItem {...formItemLayout} label="结束地址">
                {getFieldDecorator('END_ADDRESS', {
                  initialValue: editMode === 2 ? record.end_address : '',
                  rules: [{
                    required: true,
                    message: '请输入正确结束地址!',
                    pattern: regExp,
                  }],
                })(<Input />)}
              </FormItem>
            </Row>
            <Row gutter={20} className={styles.ipEditModal}>
              <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('USER_ID', {
                  initialValue: nuserid,
                  rules: [{ required: true }],
                })(<Input disabled="true" />)}
              </FormItem>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}


export default Form.create()(IPEditModal);
