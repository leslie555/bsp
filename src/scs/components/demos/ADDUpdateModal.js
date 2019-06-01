/**
 * Created by jingzy on 2018/1/09 .
 */
import PropTypes from 'prop-types';
import React from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  Input,
  Select,
  Upload,
  Switch,
  Radio,
  DatePicker,
} from 'antd';
import CommCarNumberInput from 'components/common/CommCarNumberInput';
import ScsCard from 'components/common/CommCard';
import CustomInput from 'components/common/CustomInput';
import { carNumRegExp, mobileNumRegExp } from 'utils/util';

import styles from './ADDUpdateModal.less';
import { CSYSNUM } from '../../config/enums';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option } = Select;

function AddUpdateModal({
  resetCallback,
  editMode = 'add',
  enumList = [],
  form,
  record = {},
  visible,
  onCancel,
  addAndUpdateCallback,
}) {
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
  };
  const { carno, cartype } = record;
  if (editMode) {
    form.resetFields();
  }

  function okHandler() {
    form.validateFields((err, values = {}) => {
      if (!err) {
        console.log(` 上传数据  ${JSON.stringify(values)}`);
        addAndUpdateCallback(editMode === 'add' ? 'add' : 'update', { ...values, id: record.id });
      }
    });
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
  const controlscopeop = [{ value: '1', label: '全市' }, { value: '2', label: '本辖区' }]; // 范围
  const pushdptmtop = [{ value: '10', label: '全市' }, { value: '20', label: '本单位' }];
  return (
    <Modal
      title={editMode === 'add' ? '添加' : '修改'}
      visible={visible}
      record={record}
      onOk={okHandler}
      onCancel={onCancel}
      width="1400px"
      maskClosable
      footer={[
        <Button
          type="primary"
          onClick={() => {}}
          style={{ display: editMode !== 'add' ? 'none' : '' }}
        >
          保存
        </Button>,
        <Button
          type="primary"
          onClick={() => resetCallback()}
          style={{ display: editMode !== 'add' ? 'none' : '' }}
        >
          重置
        </Button>,
        <Button type="primary" onClick={() => resetCallback()}>
          关闭
        </Button>,
      ]}
    >
      <div className={editMode !== 'add' ? styles.noDelet : ''}>
        <ScsCard bordered={false} modal>
          <div className="alertMainCardTitle">车辆信息</div>
          <Form>
            <Row gutter={40}>
              <Col span={6}>
                <FormItem {...formItemLayout} label="号牌种类">
                  {getFieldDecorator('cartype', {
                    initialValue: cartype,
                    rules: [{ required: true, message: '号牌种类不能为空！' }],
                  })(
                    <Select placeholder="--请选择--" showSearch>
                      <Option value="lucy">Lucy</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="号牌号码">
                  {getFieldDecorator('carno', {
                    initialValue: carno,
                    rules: [
                      { required: true, message: '号牌号码格式不正确！', pattern: carNumRegExp() },
                    ],
                  })(<CommCarNumberInput maxLength={8} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="车辆品牌">
                  {getFieldDecorator('carbrand', { initialValue: '' })(
                    <Select placeholder="--请选择--">
                      <Option value="lucy">Lucy</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="车身颜色">
                  {getFieldDecorator('carcolor', { initialValue: [] })(
                    <Select placeholder="--请选择--">{handleGenEnumOption(CSYSNUM)}</Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </ScsCard>
        <ScsCard bordered={false} modal>
          <div className="alertMainCardTitle">信息</div>
          <Form>
            <Row gutter={40}>
              <Col span={6}>
                <FormItem {...formItemLayout} label="类型">
                  {getFieldDecorator('controltype', {
                    rules: [{ required: true, message: '类型不能为空！' }],
                  })(<Select placeholder="--请选择--">{handleGenEnumOption(CSYSNUM)}</Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="级别">
                  {getFieldDecorator('controllevel', {
                    initialValue: '04',
                    rules: [{ required: true, message: '级别不能为空！' }],
                  })(<Select placeholder="--请选择--">{handleGenEnumOption(CSYSNUM)}</Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="性质">
                  {getFieldDecorator('controlprop', {
                    initialValue: '10',
                    rules: [{ required: true, message: '性质不能为空！' }],
                  })(<Select placeholder="--请选择--">{handleGenEnumOption(CSYSNUM)}</Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="报警手机">
                  {getFieldDecorator('pushphone', { initialValue: '' })(<CustomInput />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={12} />
              <Col span={6}>
                <FormItem {...formItemLayout} label="联系人">
                  {getFieldDecorator('contact', { initialValue: '' })(
                    <Input placeholder="" maxLength="15" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="联系方式">
                  {getFieldDecorator('telphone', {
                    initialValue: '',
                    rules: [{ pattern: mobileNumRegExp(), message: '请输入正确的联系方式！' }],
                  })(<Input maxLength="13" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={6}>
                <FormItem {...formItemLayout} label="范围">
                  {getFieldDecorator('controlscope', { initialValue: '1' })(
                    <RadioGroup options={controlscopeop} />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="报警对象">
                  {getFieldDecorator('pushdptmt', { initialValue: '10' })(
                    <RadioGroup options={pushdptmtop} />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="专项治理">
                  {getFieldDecorator('pushuser', { initialValue: false, valuePropName: 'checked' })(
                    <Switch checkedChildren="是" unCheckedChildren="否" />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </ScsCard>
        <ScsCard bordered={false} modal>
          <div className="alertMainCardTitle">案件信息</div>
          <Form>
            <Row gutter={48}>
              <Col span={12}>
                <FormItem>
                  <div>特征描述:</div>
                  <div>
                    {getFieldDecorator('charcdesc', { initialValue: '' })(
                      <TextArea rows={3} maxLength="300" />
                    )}
                  </div>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem>
                  <div>案情描述:</div>
                  <div>
                    {getFieldDecorator('matterdetail', { initialValue: '' })(
                      <TextArea rows={3} maxLength="300" />
                    )}
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </ScsCard>
        <ScsCard bordered={false} modal>
          <div className="alertMainCardTitle">照片</div>
          <Form>
            <Row>
              <Col>
                <Upload
                  action="/HiatmpPro/scs/scsUploadImg/uploadImg"
                  listType="picture-card"
                  fileList={[]}
                  accept="image/*"
                />
              </Col>
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
