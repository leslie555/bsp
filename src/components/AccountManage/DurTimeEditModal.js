/**
 * Created by Administrator on 2018/8/29.
 */
import {
  Modal,
  Form,
  Row,
  Button,
  Input,
  notification,
  TimePicker,
} from 'antd';
import React from 'react';
import styles from './DurTimeEditModal.less';
import { IPAdd, IpEdit } from '../../services/accmservice';

const FormItem = Form.Item;

class DurTimeEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 添加保存
  IPSave = () => {
    const { form, editMode, record, onRefreshData } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const durTimeName = values.DURTIME_NAME;
        const startTime = values.START_TIME;
        const endTime = values.END_TIME;
        const userId = values.USER_ID;
        if (editMode == 1) {
          IPAdd({
            logindurtime: { durTimeName, startTime, endTime, userId },
          }).then((data) => {
            if (data && data.result == 'success') {
              notification.success({ message: '保存成功！' });
              onRefreshData();
              this.IPClose();
            } else if (data && data.result == 'repeat') {
              notification.error({ message: '保存失败,时间段名称冲突！' });
            } else {
              notification.error({ message: '保存失败！' });
            }
          }).catch((e) => {
            notification.error({ message: '保存失败！' });
          });
        } else if (editMode == 2) {
          // 修改后
          const des = {
            durTimeName: values.SEGMENT_NAME,
            startTime: values.START_TIME,
            endTime: values.END_TIME,
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
    return (
      <div>
        <Modal
          title={`${editMode === 0 ? '' : (editMode === 1 ? '添加' : '修改')}登录时间段`}
          maskClosable="false"
          visible={visible}
          onCancel={this.DurTimeClose}
          width="25%"
          className={styles.durTimeEditModal}
          footer={[
            <Form layout="inline">
              <FormItem>
                <Button
                  type="primary"
                  onClick={() => { this.DurTimeSave(); }}
                >
                  保存
                </Button>
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.DurTimeClose}>
                  取消
                </Button>
              </FormItem>
            </Form>,
          ]}
        >
          <Form onSubmit={this.DurTimeSave}>
            <Row gutter={20}>
              <FormItem {...formItemLayout} label="时间段名称">
                {getFieldDecorator('DURTIME_NAME', {
                  initialValue: editMode === 2 ? record.segment_name : '',
                  rules: [{
                    required: true,
                    pattern: '^[\u4E00-\u9FA5a-zA-Z0-9_]{1,30}$',
                    message: '请输入时间段名称(中英文数字下划线，最多30个字符)!',
                  }],
                })(<Input />)}
              </FormItem>
            </Row>
            <Row gutter={20}>
              <FormItem {...formItemLayout} label="起始时间">
                {getFieldDecorator('START_TIME', {
                  initialValue: editMode === 2 ? record.start_time : '',
                  rules: [{
                    required: true,
                    message: '请输入正确起始时间!',
                  }],
                })(<TimePicker />)}
              </FormItem>
            </Row>
            <Row gutter={20}>
              <FormItem {...formItemLayout} label="结束时间">
                {getFieldDecorator('END_TIME', {
                  initialValue: editMode === 2 ? record.end_time : '',
                  rules: [{
                    required: true,
                    message: '请输入正确结束时间!',
                  }],
                })(<TimePicker />)}
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

export default Form.create()(DurTimeEditModal);
