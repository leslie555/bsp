/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Radio, Input, Button, message, Row, Col } from 'antd';
import { DEPARTMENTTYPE, DEPARTMENTLEVEL, DATAAUTHORITY, ENUM_STATUS, DEVICETYPE, ENUM_DIRECTION } from '../../config/enums';
import styles from './DeviceInfo.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
class DepartmentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleEnumOption = this.handleEnumOption.bind(this);
    this.onSaveHandle = this.onSaveHandle.bind(this);
    this.onCancelHandle = this.onCancelHandle.bind(this);
    this.onNLevelChange = this.onNLevelChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { form, departmentinfo } = this.props;
    if (nextProps.departmentinfo !== departmentinfo) {
      form.resetFields();
    }
  }

  // 确定保存
  onSaveHandle() {
    const { form, handleAddOrEdit, flag, departmentinfo } = this.props;
    const fields = [
      'deviceid',
      'devicetype',
      'devicename',
      'areaid',
      'departmentype',
      'departmentid',
      'developertype',
      'developerid',
      'sectionid',
      'direction',
      'manufacturer',
      'ipcip',
      'serverip',
      'deviceip',
      'devicepileid',
      'installaddress',
      'install_lng',
      'install_lat',
      'columnname',
      'columnpileid',
      'queuewarnthreshold',
      'stopwarnthreshold',
      'slowwarnthreshold',
      'trafficflowdetectinterval',
      'devicelogtransinterval',
      'syslogtransinterval',
      'devicestate',
    ];
    if (form.getFieldValue('deviceid')) {
      form.validateFieldsAndScroll(fields, (err, values) => {
        if (!err) {
          if (flag === '1') {
            handleAddOrEdit({
              ...values,
            });
          } else if (flag === '3') {
            handleAddOrEdit({ ...values });
          }
        }
      });
    } else {
      message.error('请添加设备编号');
    }
  }

  // 取消按钮
  onCancelHandle() {
    const { form, onCancel } = this.props;
    form.resetFields();
    onCancel();
  }

  // 修改设备级别触发上级设备下拉框数据源变化
  onNLevelChange(value) {
    const { onSelectChange, form } = this.props;
    const formValues = form.getFieldsValue();
    onSelectChange(value, formValues);
    form.resetFields(['parentdepartment']);
  }

  // 获取枚举值
  handleEnumOption(enumsid) {
    const options = [];
    const { enumList } = this.props;
    for (let i = 0; i < enumList.length; i += 1) {
      if (enumList[i].enumtypeid === (enumsid || '')) {
        options.push(<Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue}>{enumList[i].enumname}</Option>);
      }
    }
    return options;
  }

  render() {
    const { form, departmentinfo, flag, list } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '30px' },
    };
    const formItemLayout2 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '30px' },
    };
    const reg = new RegExp('^\\d+$');
    const title = flag === '1' ? '新增设备' : (flag === '2' ? '详情信息' : '编辑设备');
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <h3 className={styles.detailInfoTitle}>{title}</h3>
            <div className={styles.detailInfo}>
              <h4 className={styles.detailInfoTitle}>基础信息</h4>
              <Form>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="设备编号">
                      {getFieldDecorator('deviceid', {
                        initialValue: departmentinfo.deviceid,
                        rules: [{
                          // pattern: reg,
                          required: true,
                          message: '请输入纯数字的设备编号！',
                        }],
                      })(
                        <Input placeholder="" maxLength="12" disabled={flag === '2' || flag === '3'} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="设备类型">
                      {getFieldDecorator('devicetype', {
                        initialValue: departmentinfo.devicetype,
                        rules: [{
                          required: true,
                          message: '请选择设备类型！',
                        }],
                      })(
                        <Select disabled={flag === '2'}>{this.handleEnumOption(DEVICETYPE)}</Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="设备名称">
                      {getFieldDecorator('devicename', {
                        initialValue: departmentinfo.devicename,
                        rules: [{
                          required: true,
                          message: '请输入设备名称！',
                        }],
                      })(
                        <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="区域编号">
                      {getFieldDecorator('areaid', {
                        initialValue: departmentinfo.areaid,
                      })(
                        <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="管理机构类型">
                      {getFieldDecorator('departmentype', {
                        initialValue: departmentinfo.departmentype,
                      })(
                        <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="管理机构编号">
                      {getFieldDecorator('departmentid', {
                        initialValue: departmentinfo.departmentid,
                        rules: [{
                          required: true,
                          message: '请输入管理机构编号！',
                        }],
                      })(
                        <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="建设机构类型">
                      {getFieldDecorator('developertype', {
                        initialValue: departmentinfo.developertype,
                      })(
                        <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="建设机构编号">
                      {getFieldDecorator('developerid', {
                        initialValue: departmentinfo.developerid,
                      })(
                        <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="路段">
                      {getFieldDecorator('sectionid', {
                        initialValue: departmentinfo.sectionid,
                      })(
                        <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="方向">
                      {getFieldDecorator('direction', {
                        initialValue: departmentinfo.direction,
                      })(
                        <Select disabled={flag === '2'}>{this.handleEnumOption(ENUM_DIRECTION)}</Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="设备厂家">
                      {getFieldDecorator('manufacturer', {
                        initialValue: departmentinfo.manufacturer,
                      })(
                        <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <h4 className={styles.detailInfoTitle}>网络信息</h4>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="主机IP地址">
                      {getFieldDecorator('ipcip', {
                        initialValue: departmentinfo.ipcip,
                      })(
                        <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="接口服务器IP地址">
                      {getFieldDecorator('serverip', {
                        initialValue: departmentinfo.serverip,
                      })(
                        <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="设备IP地址">
                      {getFieldDecorator('deviceip', {
                        initialValue: departmentinfo.deviceip,
                      })(
                        <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <h4 className={styles.detailInfoTitle}>位置信息</h4>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="设备桩号">
                      {getFieldDecorator('devicepileid', {
                        initialValue: departmentinfo.devicepileid,
                      })(
                        <Input placeholder="" maxLength="20" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="设备位置">
                      {getFieldDecorator('installaddress', {
                        initialValue: departmentinfo.installaddress,
                      })(
                        <Input placeholder="" maxLength="40" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="安装位置（经度）">
                      {getFieldDecorator('install_lng', {
                        initialValue: departmentinfo.install_lng,
                      })(
                        <Input placeholder="" maxLength="20" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="安装位置（纬度）">
                      {getFieldDecorator('install_lat', {
                        initialValue: departmentinfo.install_lat,
                      })(
                        <Input placeholder="" maxLength="40" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="立柱名称">
                      {getFieldDecorator('columnname', {
                        initialValue: departmentinfo.columnname,
                      })(
                        <Input placeholder="" maxLength="20" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="立柱桩号">
                      {getFieldDecorator('columnpileid', {
                        initialValue: departmentinfo.columnpileid,
                      })(
                        <Input placeholder="" maxLength="40" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <h4 className={styles.detailInfoTitle}>设置</h4>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label="车辆排队报警阀值">
                      {getFieldDecorator('queuewarnthreshold', {
                        initialValue: departmentinfo.queuewarnthreshold,
                      })(
                        <Input placeholder="" maxLength="20" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label="车辆停驶时间报警阀值">
                      {getFieldDecorator('stopwarnthreshold', {
                        initialValue: departmentinfo.stopwarnthreshold,
                      })(
                        <Input placeholder="" maxLength="40" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label="车辆慢行报警阀值">
                      {getFieldDecorator('slowwarnthreshold', {
                        initialValue: departmentinfo.slowwarnthreshold,
                      })(
                        <Input placeholder="" maxLength="20" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label="交通流量检测统计时间间距">
                      {getFieldDecorator('trafficflowdetectinterval', {
                        initialValue: departmentinfo.trafficflowdetectinterval,
                      })(
                        <Input placeholder="" maxLength="40" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label="设备日志传输时间间距">
                      {getFieldDecorator('devicelogtransinterval', {
                        initialValue: departmentinfo.devicelogtransinterval,
                      })(
                        <Input placeholder="" maxLength="20" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label="系统日志传输时间间距">
                      {getFieldDecorator('syslogtransinterval', {
                        initialValue: departmentinfo.syslogtransinterval,
                      })(
                        <Input placeholder="" maxLength="40" disabled={flag === '2'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="状态">
                      {getFieldDecorator('devicestate', {
                        initialValue: departmentinfo.devicestate,
                        rules: [{
                          required: true,
                          message: '请输入状态！',
                        }],
                      })(
                        <Select disabled={flag === '2'}>{this.handleEnumOption(ENUM_STATUS)}</Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <FormItem style={{ textAlign: 'right', marginBottom: 0 }}>
                  <Button
                    type="primary"
                    style={{ margin: '0 5px', visibility: flag === '2' ? 'hidden' : 'visible' }}
                    onClick={() => { this.onSaveHandle(); }}
                  >保存
                  </Button>
                  <Button
                    type="primary"
                    style={{ margin: '0 3px', visibility: flag === '2' ? 'hidden' : 'visible' }}
                    onClick={() => { this.onCancelHandle(); }}
                  >取消
                  </Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
DepartmentInfo.prototypes = {
  loading: PropTypes.bool,
  list: PropTypes.array,
  enumList: PropTypes.array,
  flag: PropTypes.string,
  departmentinfo: PropTypes.object,
  onCancel: PropTypes.func,
  onSelectChange: PropTypes.func,
  handleAddOrEdit: PropTypes.func,
};
export default Form.create()(DepartmentInfo);
