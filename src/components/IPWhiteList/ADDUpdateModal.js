/**
 * Created by jingzy on 2018/1/09 .
 */
import PropTypes from 'prop-types';
import React from 'react';
import {
  Modal,
  Form,
  Row,
  Button,
  Input,
  Select,
  notification,
  message,
} from 'antd';
import { IPAdd, IpEdit } from '../../services/IPWhiteList';
import ScsCard from '../common/CommCard';
import styles from './ADDUpdateModal.less';

const FormItem = Form.Item;
const { Option } = Select;
function AddUpdateModal({
  resetCallback,
  editMode = 'add',
  enumList = [],
  form,
  userList = [],
  record = [],
  visible,
  onCancel,
  onPageChange,
}) {
  const { getFieldDecorator, getFieldsValue, resetFields, validateFields } = form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 },
  };
  const segmentName = record.segment_name;
  const startAddress = record.start_address;
  const endAddress = record.end_address;
  const userId = record.user_id;
  const operatingTime = record.operating_time;
  const { lrpkid, recorder } = record;
  if (editMode) {
    // form.resetFields();
  }

  function okHandler() {

  }


  function checkIpIlleagle(startIp, endIp) {
    const startIpArr = startIp.split('.');
    const endIpArr = endIp.split('.');
    for (let i = 0; i < 4; i += 1) {
      if (i === 3 && parseInt(startIpArr[i], 10) > parseInt(endIpArr[i], 10)) {
        return '2';// 不 符合开始ip段小于等于结束IP段
      }

      if (i < 3 && startIpArr[i] !== endIpArr[i]) {
        return '1';// 不符合在同一网段
      }
    }
    return '0';// 符合要求
  }
  // 获取枚举值
  function handleGenEnumOption(enumsid = '') {
    const options = [];
    const enums = enumList;
    if (enums != null) {
      for (const i in enums) {
        if (enums[i].enumtypeid === enumsid) {
          options.push(
            <Option key={`enuma-${enums[i].enumvalue}`} value={enums[i].enumvalue}>
              {enums[i].enumname}
            </Option>
          );
        }
      }
      return options;
    }
  }
  // 查询 用户名
  function selectUser(queryUser) {
    const options = [];
    if (queryUser && queryUser.length) {
      queryUser.forEach((user) => {
        const { nuserid } = user;
        options.push(<Option key={nuserid} value={nuserid}>{nuserid}</Option>);
      });
    }
    return options;
  }
  // 添加保存
  function IPSave() {
    validateFields((err, values) => {
      if (!err) {
        const loginrestrict = getFieldsValue();
        const { segmentname, startaddress, endaddress, userid } = loginrestrict;
        const result = checkIpIlleagle(startaddress, endaddress);
        if (result === '1') {
          message.error('起始、结束地址不在同一网段内！');
          return;
        } else if (result === '2') {
          message.error('起始地址大于结束地址！');
          return;
        }
        IPAdd({ loginrestrict: { segmentName: segmentname,
          startAddress: startaddress,
          endAddress: endaddress,
          userId: userid } }).then((data) => {
          if (data && data.result === 'success') {
            console.log(data);
            message.success('保存成功！');
            // notification.success({ message: '保存成功！' });
            resetForm();
            resetCallback();
            onPageChange();
          } else if (data.result === 'repeat') {
            message.success('已存在相同名称、登记人的记录，保存失败！');
            resetForm();
            resetCallback();
          } else {
            message.error('保存失败！');
            // notification.error({ message: '保存失败！' });
            resetForm();
            resetCallback();
          }
        }).catch((e) => {
          message.error('保存失败！！');
          // notification.error({ message: '保存失败！' });
          resetForm();
          resetCallback();
        });
      }
    });
  }
  // 重置数据
  function resetForm() {
    resetFields();
  }
  // 关闭
  function IPClose() {
    resetFields();
    resetCallback();
  }
  // 提交
  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   validateFields((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //     }
  //   });
  // };
  // 修改
  function IPEdit() {
    validateFields(
      (err) => {
        if (!err) {
          // 获取修改后的form值
          const old = getFieldsValue();
          const { segmentname, startaddress, endaddress, userid } = old;
          const des = {
            segmentName: segmentname,
            startAddress: startaddress,
            endAddress: endaddress,
            userId: userid,
            lrpkid,
            operatingTime,
            recorder };
          // 获取修改前的form值， 用于后台日志记录
          const src = { segmentName,
            startAddress,
            endAddress,
            userId,
            lrpkid,
            operatingTime,
            recorder };
          const result = checkIpIlleagle(startaddress, endaddress);
          if (result === '1') {
            message.error('起始、结束地址不在同一网段内！');
            return;
          } else if (result === '2') {
            message.error('起始地址大于结束地址！');
            return;
          }
          IpEdit({ src, des }).then((data) => {
            if (data && data.result === 'success') {
              console.log(data);
              message.success('修改成功！');
              // notification.success({ message: '修改成功！' });
              resetForm();
              resetCallback();
              onPageChange();
            } else if (data.result === 'repeat') {
              message.success('已存在相同名称、登记人的记录，修改失败！');
              resetForm();
              resetCallback();
            } else {
              message.success('修改失败！');
              // notification.error({ message: '修改失败！' });
              resetForm();
              resetCallback();
            }
          }).catch((e) => {
            message.success('修改失败！');
            // notification.error({ message: '修改失败！' });
            resetForm();
            resetCallback();
          });
        }
      },
    );
  }
  return (
    <Modal
      title={editMode === 'add' ? '添加' : '修改'}
      visible={visible}
      record={record}
      onOk={okHandler}
      onCancel={IPClose}
      width="25%"
      maskClosable
      footer={[
        <Form layout="inline">
          <FormItem>
            <Button
              type="primary"
              onClick={() => {
                if (editMode === 'add') {
                  IPSave();
                } else {
                  IPEdit();
                }
              }}
            >
                      保存
            </Button>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              onClick={() => resetForm()}
            >
                      重置
            </Button>
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={() => IPClose()}>
                        关闭
            </Button>
          </FormItem>
        </Form>,
      ]}
    >
      <div className={editMode !== 'add' ? '' : 'styles.noDelet'}>
        <ScsCard bordered={false} modal>
          <div className="alertMainCardTitle" />
          <Form onSubmit={IPSave}>
            <Row gutter={20}>
              <FormItem {...formItemLayout} label="网段名称">
                {getFieldDecorator('segmentname', {
                  initialValue: editMode === 'edit' ? segmentName : '',
                  rules: [{
                    required: true,
                    message: '请输入网段名称!',
                  }, { validator: (rule, value, callback) => {
                    if (value.match("(?:')|(?:\\s)|(?:%)|(?:--)|(/\\*(?:.|[\\n\\r])*?\\*/)|(\\b(select|update|union|and|or|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute)\\b)")) {
                      callback('请不要包含特殊字符及命令');
                    }
                    callback();
                  },
                  }],
                })(<Input maxLength="30" />)}
              </FormItem>
            </Row>
            <Row gutter={20}>
              <FormItem {...formItemLayout} label="起始地址">
                {getFieldDecorator('startaddress', {
                  initialValue: editMode === 'edit' ? startAddress : '',
                  rules: [{
                    required: true,
                    message: '请输入正确起始地址!',
                    pattern: new RegExp(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/),
                  }],
                })(<Input maxLength="15" />)}
              </FormItem>
            </Row>
            <Row gutter={20}>
              <FormItem {...formItemLayout} label="结束地址">
                {getFieldDecorator('endaddress', {
                  initialValue: editMode === 'edit' ? endAddress : '',
                  rules: [{
                    required: true,
                    message: '请输入正确结束地址!',
                    pattern: new RegExp(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/),
                  }],
                })(<Input maxLength="15" />)}
              </FormItem>
            </Row>
            <Row gutter={20}>
              <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('userid', {
                  initialValue: editMode === 'edit' ? userId : '',
                  rules: [{
                    required: true,
                    message: '请选择用户名!' }],
                })(<Select showSearch>{selectUser(userList)}</Select>)}
              </FormItem>
            </Row>
          </Form>
        </ScsCard>
      </div>
    </Modal>
  );
}
AddUpdateModal.propTypes = {
  record: PropTypes.object,
};
AddUpdateModal.defaultProps = {
  record: [],
};
export default Form.create()(AddUpdateModal);
