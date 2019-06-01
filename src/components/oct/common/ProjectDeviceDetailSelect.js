/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Table, Form, Input, Button, Row, Col, Tabs, Icon, Tooltip, InputNumber } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './DeviceSelect.less';
import { PSFX, CARCOLOR, CAR_C, CARMARK, ENUM_ILLEGAL, CARTYPE, NUMCOLOR, NUMBERTYPE } from '../../../config/enums';

const FormItem = Form.Item;
const { TabPane } = Tabs;

class ProjectDeviceDetailSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  // 根据枚举值获取枚举名
  getEnumValue(enumtypeid, enumvalue) {
    const { enumList } = this.props;
    for (let i = 0; i < enumList.length; i += 1) {
      const enumObj = enumList[i];
      if (enumObj.enumtypeid === enumtypeid && enumObj.enumvalue === enumvalue) {
        return enumObj.enumname;
      }
    }
  }

  handleSubmit() {
    const { form, onSave } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        onSave(values);
        console.log(onSave);
      }
    });
  }

  render() {
    const { form, columns,
      title, detailevisible,
      onCancel, dataSource,
      flag, pagination,
      obj1, onPageChange, onDownload } = this.props;
    console.log(pagination);
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    if (flag == '1') {
      return (
        <div>
          <Modal
            title="设置指标"
            visible={detailevisible}
            onCancel={onCancel}
            width="40%"
            wrapClassName={styles.policeSelect}
            footer={[
              <Button key="back" onClick={onCancel}>取消</Button>,
              <Button key="submit" type="primary" htmlType="submit" onClick={() => { this.handleSubmit(); }}>
                保存
              </Button>,
            ]}
          >
            <Form>
              <Row>
                <Col span={20}>
                  <FormItem {...formItemLayout} label="无牌率">
                    {getFieldDecorator('ratio_wupai', {
                      initialValue: '',
                      // rules: [{ required: true }],
                    })(
                      <InputNumber min={0} style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={20}>
                  <FormItem {...formItemLayout} label="上传率">
                    {getFieldDecorator('ratio_shangchuan', {
                      initialValue: '',
                      // rules: [{ required: true }],
                    })(
                      <InputNumber min={0} style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={20}>
                  <FormItem {...formItemLayout} label="速度异常率">
                    {getFieldDecorator('ratio_sudu', {
                      initialValue: '',
                      // rules: [{ required: true }],
                    })(
                      <InputNumber min={0} style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={20}>
                  <FormItem {...formItemLayout} label="非号牌规则">
                    {getFieldDecorator('ratio_feihaopai', {
                      initialValue: '',
                      // rules: [{ required: true }],
                    })(
                      <InputNumber min={0} style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={20}>
                  <FormItem {...formItemLayout} label="流量过车差异率">
                    {getFieldDecorator('ratio_chayi', {
                      initialValue: '',
                      // rules: [{ required: true }],
                    })(
                      <InputNumber min={0} style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
      );
    } else {
      return (
        <div>
          <Modal
            title={title}
            visible={detailevisible}
            onCancel={onCancel}
            width="80%"
            wrapClassName={styles.policeSelect}
            footer={[
              <Button key="back" onClick={onCancel}>关闭</Button>,
            ]}
          >
            <Row>
              <Col span={18} />
              <Col span={4} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '2px' }} onClick={onDownload}><i className="table-right icon iconfont" />批量导出</Button>
              </Col>
            </Row>
            <Row>
              <Table
                columns={columns}
                dataSource={dataSource}
                onChange={onPageChange}
                pagination={pagination}
                locale={{ emptyText: '暂无数据' }}
              />
            </Row>
          </Modal>
        </div>
      );
    }
  }
}

ProjectDeviceDetailSelect.prototypes = {
  list: PropTypes.array,
  enumList: PropTypes.array,
  onCancel: PropTypes.func,
};
export default Form.create()(ProjectDeviceDetailSelect);
