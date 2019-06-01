/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import { Form, Row, Col, Input, Select, Modal } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;
class IllegalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  // 系统确认修改
  handleOk() {
    const { illegalinfoflag, onAddRecord, onUpdateRecord, form,
      onCloseModal, recordInfo } = this.props;
    if (illegalinfoflag == '1') {
      onCloseModal();
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (illegalinfoflag == '2') { // 编辑
          const beforeRecord = recordInfo;
          // 处理下划线格式数据
          beforeRecord.fkjeMin = beforeRecord.fkje_min;
          beforeRecord.fkjeMax = beforeRecord.fkje_max;
          beforeRecord.qzcsMin = beforeRecord.qzcs_min;
          beforeRecord.qzcsMax = beforeRecord.qzcs_max;
          beforeRecord.jlsjMin = beforeRecord.jlsj_min;
          beforeRecord.jlsjMax = beforeRecord.jlsj_max;
          onUpdateRecord(values, beforeRecord);
          form.resetFields();
        } else if (illegalinfoflag == '3') { // 新增
          onAddRecord(values);
        }
      } else {
        return err;
      }
    });
  }

  // 系统参数取消修改
  handleCancel() {
    const { form, onCloseModal } = this.props;
    form.resetFields();
    onCloseModal();
  }

  render() {
    const { form, illegalinfoflag, illegalinfovisible, recordInfo, key } = this.props;
    const { getFieldDecorator } = form;
    const reg = new RegExp('^[0-9]*$');
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      style: { height: '20px' },
    };
    return (
      <Modal
        title={illegalinfoflag == '1' ? '违法行为代码查看' : illegalinfoflag == '2' ? '违法行为代码修改' : '违法行为代码添加'}
        visible={illegalinfovisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={950}
        key={key}
      >
        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="违法代码">
                {getFieldDecorator('wfxw', {
                  initialValue: recordInfo.wfxw,
                  rules: [{
                    required: true, message: '请输入违法代码!',
                  }],
                })(
                  <Input maxLength={6} style={{ width: '300px' }} disabled={illegalinfoflag != '3'} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="违法内容简称">
                {getFieldDecorator('wfms', {
                  initialValue: recordInfo.wfms,
                  rules: [{
                    required: true, message: '请输入违法内容简称!',
                  }],
                })(<Input maxLength={160} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} title={recordInfo.wfms} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="违法内容">
                {getFieldDecorator('wfnr', {
                  initialValue: recordInfo.wfnr,
                  rules: [{
                    required: true, message: '请输入违法内容!',
                  }],
                })(
                  <Input maxLength={255} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} title={recordInfo.wfnr} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="罚款金额最小数">
                {getFieldDecorator('fkjeMin', {
                  initialValue: recordInfo.fkje_min,
                  rules: [{
                    pattern: reg,
                    required: true,
                    message: '请输入罚款金额最小数!',
                  }],
                })(<Input maxLength={6} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="违法规定">
                {getFieldDecorator('wfgd', {
                  initialValue: recordInfo.wfgd,
                  rules: [{
                    required: true, message: '请输入违法规定!',
                  }],
                })(
                  <Input maxLength={255} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} title={recordInfo.wfgd} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="罚款金额最大数">
                {getFieldDecorator('fkjeMax', {
                  initialValue: recordInfo.fkje_max,
                  rules: [{
                    pattern: reg,
                    required: true,
                    message: '请输入罚款金额最大数（数字）!',
                  }],
                })(<Input maxLength={6} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="处罚依据">
                {getFieldDecorator('fltw', {
                  initialValue: recordInfo.fltw,
                  rules: [{
                    required: true, message: '请输入处罚依据!',
                  }],
                })(
                  <Input maxLength={255} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} title={recordInfo.fltw} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="暂扣天数最小数">
                {getFieldDecorator('qzcsMin', {
                  initialValue: recordInfo.qzcs_min,
                  rules: [{
                    pattern: reg,
                    required: true,
                    message: '请输入暂扣天数最小数（数字）!',
                  }],
                })(<Input maxLength={4} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="违法记分">
                {getFieldDecorator('wfjfs', {
                  initialValue: recordInfo.wfjfs,
                  rules: [{
                    pattern: reg,
                    required: true,
                    message: '请输入违法记分(数字)!',
                  }],
                })(
                  <Input maxLength={2} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="暂扣天数最大数">
                {getFieldDecorator('qzcsMax', {
                  initialValue: recordInfo.qzcs_max,
                  rules: [{
                    pattern: reg,
                    required: true,
                    message: '请输入暂扣天数最大数（数字）!',
                  }],
                })(<Input maxLength={4} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="暂扣标记">
                {getFieldDecorator('zkbj', {
                  initialValue: recordInfo.zkbj,
                  rules: [{
                    required: true, message: '请选择暂扣标记!',
                  }],
                })(
                  <Select defaultValue="0" style={{ width: 300 }} disabled={illegalinfoflag == '1'}>
                    <Option value="0">否</Option>
                    <Option value="1">是</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="拘留天数最小数">
                {getFieldDecorator('jlsjMin', {
                  initialValue: recordInfo.jlsj_min,
                  rules: [{
                    pattern: reg,
                    required: true,
                    message: '请输入拘留天数最小数（数字）!',
                  }],
                })(<Input maxLength={4} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="拘留标记">
                {getFieldDecorator('jlbj', {
                  initialValue: recordInfo.jlbj,
                  rules: [{
                    required: true, message: '请选择拘留标记!',
                  }],
                })(
                  <Select defaultValue="0" style={{ width: 300 }} disabled={illegalinfoflag == '1'}>
                    <Option value="0">否</Option>
                    <Option value="1">是</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="拘留天数最大数">
                {getFieldDecorator('jlsjMax', {
                  initialValue: recordInfo.jlsj_max,
                  rules: [{
                    pattern: reg,
                    required: true,
                    message: '请输入拘留天数最大数（数字）!',
                  }],
                })(<Input maxLength={4} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="吊销标记">
                {getFieldDecorator('dxbj', {
                  initialValue: recordInfo.dxbj,
                  rules: [{
                    required: true, message: '请选择吊销标记!',
                  }],
                })(
                  <Select defaultValue="0" style={{ width: 300 }} disabled={illegalinfoflag == '1'}>
                    <Option value="0">否</Option>
                    <Option value="1">是</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="国标">
                {getFieldDecorator('gb', {
                  initialValue: recordInfo.gb,
                  rules: [{
                    required: true, message: '请输入国标!',
                  }],
                })(<Input maxLength={1} style={{ width: '300px' }} disabled={illegalinfoflag == '1'} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="撤销标记">
                {getFieldDecorator('cxbj', {
                  initialValue: recordInfo.cxbj,
                  rules: [{
                    required: true, message: '请输入撤销标记!',
                  }],
                })(
                  <Select defaultValue="0" style={{ width: 300 }} disabled={illegalinfoflag == '1'}>
                    <Option value="0">否</Option>
                    <Option value="1">是</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>

    );
  }
}
IllegalInfo.prototypes = {};
export default Form.create()(IllegalInfo);
