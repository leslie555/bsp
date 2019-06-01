/**
 * Created by Administrator on 2018/7/25.
 */
import React from 'react';
import {
  Form,
  Row,
  Col,
  Button,
  Input,
  Select,
  message,
  DatePicker,
} from 'antd';
import { carNumRegExp, mobileNumRegExp } from 'utils/util';
import moment from 'moment';
import styles from './PoliceInfo.less';
import { POLICESTATUS, POLICETYPE, RANKTYPE, RANKNAME } from '../../config/enums';
import { checkGPSUnique } from '../../services/policeManage/policeManageService';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
// 不可选择未来日期
function disabledDate(current) {
  return current > moment();
}

class PoliceInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rankType: '-1',
    };
    this.handleGenEnumOption = this.handleGenEnumOption.bind(this);
    this.rankSelectOnChange = this.rankSelectOnChange.bind(this);
    this.hasGpsSelectOnChange = this.hasGpsSelectOnChange.bind(this);
    this.onSaveHandle = this.onSaveHandle.bind(this);
    this.onCancelHandle = this.onCancelHandle.bind(this);
    this.onAuditHandle = this.onAuditHandle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { form, recordInfo } = this.props;
    if (nextProps.recordInfo !== recordInfo) {
      form.resetFields();
    }
  }

  // 确定保存
  onSaveHandle() {
    const { form, handleAddOrEdit, editMode, recordInfo, gpsSelectList } = this.props;
    const oldgpsList = gpsSelectList.concat();
    const sortList = oldgpsList.sort();
    form.validateFieldsAndScroll((err, values) => {
      // let GpsEquipmentIdtring = '';
      console.log(values);
      if (!err) {
        for (let i = 0; i < sortList.length - 1; i += 1) {
          if (sortList[i] === sortList[i + 1]) {
            message.error('GPS设备信息重复，请重新选择！');
            return;
          }
        }

        const GpsEquipmentIdString = sortList.toString();

        if (GpsEquipmentIdString !== '') {
          checkGPSUnique({
            GpsEquipmentId: GpsEquipmentIdString,
            currPoliceId: recordInfo.policeid,
          }).then((record) => {
            if (record.result.result) {
              const newValues = values;
              for (let i = 0; i < gpsSelectList.length; i += 1) {
                if (i === 0) {
                  newValues.deviceid = gpsSelectList[i];
                } else {
                  newValues[`deviceid${i + 1}`] = gpsSelectList[i];
                }
              }
              let worktimestr = '';
              if (newValues.worktime) {
                worktimestr = newValues.worktime.format('YYYY-MM-DD');
              }
              const data = { ...newValues, worktime: worktimestr };
              if (editMode === '1') {
                handleAddOrEdit(data);
              } else if (editMode === '3') {
                handleAddOrEdit({ ...data, uuid: recordInfo.uuid });
              }
            } else {
              message.error(record.result.info);
            }
          });
        } else {
          const newValues = values;
          for (let i = 0; i < gpsSelectList.length; i += 1) {
            if (i === 0) {
              newValues.deviceid = gpsSelectList[i];
            } else {
              newValues[`deviceid${i + 1}`] = gpsSelectList[i];
            }
          }
          let worktime = null;
          if (newValues.worktime) {
            worktime = newValues.worktime.format('YYYY-MM-DD');
          }

          console.log(worktime);
          const data = { ...newValues, worktime };
          if (editMode === '1') {
            handleAddOrEdit(data);
          } else if (editMode === '3') {
            handleAddOrEdit({ ...data, uuid: recordInfo.uuid });
          }
        }
      }
    });
  }

  // 取消按钮
  onCancelHandle() {
    const { form, onCancel } = this.props;
    form.resetFields();
    onCancel();
  }

  // 审批
  onAuditHandle(state) {
    const { form, onAudit, recordInfo } = this.props;
    const fields = ['suggestion'];
    form.validateFieldsAndScroll(fields, (err) => {
      if (!err) {
        if (state === 9 && form.getFieldValue('suggestion') === '') {
          message.warn('驳回时审批意见不能为空！');
          return;
        }
        onAudit({ suggestion: form.getFieldValue('suggestion'), state, uuid: recordInfo.uuid });
      }
    });
  }

  // 获取枚举值
  handleGenEnumOption(enumsid) {
    const options = [];
    const { enumList } = this.props;
    for (let i = 0; i < enumList.length; i += 1) {
      if (enumList[i].enumtypeid === (enumsid || '')) {
        options.push(
          <Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue} title={enumList[i].enumname}>
            {enumList[i].enumname}

          </Option>);
      }
    }
    return options;
  }

  // 获取枚举值
  handleDeptOption() {
    const options = [];
    const { allDepartmentList } = this.props;
    for (let i = 0; i < allDepartmentList.length; i += 1) {
      options.push(
        <Option
          key={`enuma-${allDepartmentList[i].cdepartmentid}`}
          value={allDepartmentList[i].cdepartmentid}
          title={allDepartmentList[i].deptshortname}
        >

          {allDepartmentList[i].deptshortname}
        </Option>
      );
    }
    return options;
  }

  // 获取枚举值
  handleGPSOption() {
    const options = [];
    const { gpsList } = this.props;
    for (let i = 0; i < gpsList.length; i += 1) {
      options.push(
        <Option key={`enuma-${gpsList[i].deviceid}`} value={gpsList[i].deviceid} title={gpsList[i].gpscarno}>
          {gpsList[i].gpscarno}

        </Option>);
    }
    return options;
  }

  // 获取枚举值
  handleRankEnumOption(enumsid, rankType) {
    const options = [];
    const { enumList } = this.props;
    for (let i = 0; i < enumList.length; i += 1) {
      if (enumList[i].enumtypeid === (enumsid || '')) {
        if (rankType === '-1') {
          options.push(
            <Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue} title={enumList[i].enumname}>
              {enumList[i].enumname}
            </Option>);
        } else if (rankType === '1' && enumList[i].enumvalue === '1') {
          options.push(
            <Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue} title={enumList[i].enumname}>
              {enumList[i].enumname}
            </Option>);
        } else if (rankType === '2' && ['2', '3', '4', '5'].includes(enumList[i].enumvalue)) {
          options.push(
            <Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue} title={enumList[i].enumname}>
              {enumList[i].enumname}
            </Option>);
        } else if (rankType === '3' && ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'].includes(enumList[i].enumvalue)) {
          options.push(
            <Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue} title={enumList[i].enumname}>
              {enumList[i].enumname}
            </Option>);
        } else if (rankType === '4' && ['17', '18', '19'].includes(enumList[i].enumvalue)) {
          options.push(
            <Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue} title={enumList[i].enumname}>
              {enumList[i].enumname}
            </Option>);
        } else if (rankType === '5' && ['20', '21'].includes(enumList[i].enumvalue)) {
          options.push(
            <Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue} title={enumList[i].enumname}>

              {enumList[i].enumname}
            </Option>);
        }
      }
    }
    return options;
  }

  rankSelectOnChange(value) {
    const { form } = this.props;
    this.setState({ rankType: value }, () => {
      form.resetFields(['positionlevelname']);
    });
  }

  hasGpsSelectOnChange(value) {
    const { setGpsListState } = this.props;
    if (value === '0') {
      setGpsListState(['']);
    } else {
      setGpsListState([]);
    }
  }

  render() {
    const { editMode, recordInfo, form, gpsSelectList, setGpsListState } = this.props;
    const { getFieldDecorator } = form;
    const { rankType } = this.state;
    const formItemLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 12 },
    };
    const gpsformItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const idcardformItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 13 },
    };
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row style={{ display: editMode === '2' ? 'none' : 'block' }}>
              <Col span={24}>
                {editMode !== '4'
                  ? (
                    <FormItem style={{ textAlign: 'right' }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ margin: '0 5px' }}
                        onClick={() => this.onSaveHandle()}
                      >保存
                      </Button>
                      <Button
                        type="primary"
                        style={{ margin: '0 3px' }}
                        onClick={() => this.onCancelHandle()}
                      >取消
                      </Button>
                    </FormItem>
                  )
                  : (
                    <FormItem style={{ textAlign: 'right' }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ margin: '0 5px' }}
                        onClick={() => this.onAuditHandle(1)}
                      >同意
                      </Button>
                      <Button
                        type="primary"
                        style={{ margin: '0 3px' }}
                        onClick={() => this.onAuditHandle(9)}
                      >驳回
                      </Button>
                    </FormItem>
                  )
                }
              </Col>
            </Row>
            {editMode === '4' ? (
              <Row>
                <Col span={24}>
                  <FormItem>
                    {getFieldDecorator('suggestion', {
                      initialValue: '',
                    })(
                      <TextArea placeholder="请填写审批意见" maxLength={500} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            ) : ''
            }
            <h3 className={styles.detailInfoTitle}>详情信息</h3>
            <div className={styles.detailInfo}>
              <Form>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="警员姓名">
                      {getFieldDecorator('policename', {
                        initialValue: recordInfo.policename,
                        rules: [{
                          required: true,
                          message: '请输入警员姓名！',
                        }],
                      })(
                        <Input placeholder="" maxLength="7" disabled={editMode === '2' || editMode === '4'} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="所属部门">
                      {getFieldDecorator('depid', {
                        initialValue: recordInfo.depid,
                        rules: [{
                          required: true,
                          message: '请选择所属部门！',
                        }],
                      })(
                        <Select
                          showSearch
                          disabled={editMode === '2' || editMode === '4'}
                          filterOption={
                            (input, option) => option.props.children
                              .indexOf(input)
                            >= 0
                          }
                        >
                          {this.handleDeptOption()}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="警员警号">
                      {getFieldDecorator('policeid', {
                        initialValue: recordInfo.policeid,
                        rules: [{
                          pattern: new RegExp('^[a-zA-Z0-9]{6,}$'),
                          required: true,
                          message: '请输入6位警员警号！',
                        }],
                      })(
                        <Input
                          placeholder=""
                          maxLength="6"
                          disabled={editMode === '2'
                        || editMode === '3' || editMode === '4'}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="警员类型">
                      {getFieldDecorator('policetype', {
                        initialValue: recordInfo.policetype,
                        rules: [{
                          required: true, message: '请选择警员类型！',
                        }],
                      })(
                        <Select disabled={editMode === '2' || editMode === '4'}>{this.handleGenEnumOption(POLICETYPE)}</Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="警员状态">
                      {getFieldDecorator('is_effective', {
                        initialValue: recordInfo.is_effective,
                        rules: [{
                          required: true, message: '请选择警员状态！',
                        }],
                      })(
                        <Select disabled={editMode === '2' || editMode === '4'}>{this.handleGenEnumOption(POLICESTATUS)}</Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="性别">
                      {getFieldDecorator('sex', {
                        initialValue: recordInfo.sex,
                      })(
                        <Select
                          disabled={editMode === '2' || editMode === '4'}
                        >
                          <Option key="0" value="0">男</Option>
                          <Option key="1" value="1">女</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="职级类别">
                      {getFieldDecorator('positionleveltype', {
                        initialValue: recordInfo.positionleveltype,
                      })(
                        <Select onChange={this.rankSelectOnChange} disabled={editMode === '2' || editMode === '4'}>
                          {this.handleGenEnumOption(RANKTYPE)}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="职级名称">
                      {getFieldDecorator('positionlevelname', {
                        initialValue: recordInfo.positionlevelname,
                      })(
                        <Select disabled={editMode === '2' || editMode === '4'}>{
                          this.handleRankEnumOption(RANKNAME, rankType)
                        }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="是否有GPS">
                      {getFieldDecorator('hasgps', {
                        initialValue: recordInfo.hasgps,
                      })(
                        <Select
                          disabled={editMode === '2' || editMode === '4'}
                          onChange={this.hasGpsSelectOnChange}
                        >
                          <Option key="0" value="0">是</Option>
                          <Option key="1" value="1">否</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  {
                    gpsSelectList.map((data, i) => {
                      return (
                        <Col span={24}>
                          <FormItem {...gpsformItemLayout} label={i === 0 ? 'GPS主设备' : 'GPS副设备'}>
                            {getFieldDecorator(`gpsinfo${i}`, {
                              initialValue: data,
                              rules: [{
                                required: true, message: '请选择GPS设备！',
                              }],
                            })(
                              <Select
                                disabled={editMode === '2' || editMode === '4'}
                                className={styles.gpsSelect}
                                showSearch
                                filterOption={
                              (input, option) => option.props.children
                                .indexOf(input) >= 0}
                                onChange={(value) => {
                                  gpsSelectList[i] = value;
                                  setGpsListState(gpsSelectList);
                                }}
                              >{this.handleGPSOption()}
                              </Select>
                            )}
                            {
                            i === 0 ? (
                              <Button
                                icon="plus"
                                disabled={editMode === '2' || editMode === '4'}
                                className={styles.gpsBtn}
                                onClick={() => {
                                  if (gpsSelectList.length === 4) {
                                    message.warn('最多添加4个GPS设备！');
                                    return;
                                  }
                                  gpsSelectList.push('');
                                  setGpsListState(gpsSelectList);
                                }}
                              />
                            ) : (
                              <Button
                                icon="delete"
                                disabled={editMode === '2' || editMode === '4'}
                                className={styles.gpsBtn}
                                onClick={() => {
                                  gpsSelectList.splice(i, 1);
                                  setGpsListState(gpsSelectList);
                                }}
                              />
                            )
                          }
                          </FormItem>
                        </Col>
                      );
                    }
                    )
                  }
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="参加工作时间">
                      {getFieldDecorator('worktime', { initialValue: !recordInfo.worktime ? '' : moment(recordInfo.worktime, 'YYYY-MM-DD') })(
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD"
                          disabledDate={disabledDate}
                          style={{ width: '200px' }}
                          disabled={editMode === '2' || editMode === '4'}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="电话">
                      {getFieldDecorator('phone', {
                        initialValue: recordInfo.phone,
                        rules: [{
                          pattern: new RegExp('^[0-9]*$'),
                          message: '请输入正确的电话号码！',
                        }],
                      })(
                        <Input placeholder="" maxLength="15" disabled={editMode === '2' || editMode === '4'} title={recordInfo.phone} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="公休假天数">
                      {getFieldDecorator('publicholiday', {
                        initialValue: recordInfo.publicholiday,
                        rules: [{
                          pattern: new RegExp('^[0-9]*$'),
                          message: '请输入正确公休假天数！',
                        }],
                      })(
                        <Input placeholder="" maxLength="3" disabled={editMode === '2' || editMode === '4'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <FormItem {...idcardformItemLayout} label="身份证号">
                      {getFieldDecorator('idcard', {
                        rules: [{
                          pattern: new RegExp('^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$'),
                          message: '请输入正确的身份证号！',
                        }],
                        initialValue: recordInfo.idcard,
                      })(
                        <Input placeholder="" maxLength="20" disabled={editMode === '2' || editMode === '4'} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem {...idcardformItemLayout} label="电子邮箱">
                      {getFieldDecorator('email', {
                        initialValue: recordInfo.email,
                        rules: [{
                          pattern: new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'),
                          message: '请输入正确的电子邮箱!',
                        }],
                      })(
                        <Input
                          placeholder=""
                          maxLength="100"
                          disabled={editMode === '2' || editMode === '4'}
                          title={recordInfo.email}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PoliceInfo.propTypes = {
};
PoliceInfo.defaultProps = {
};
export default Form.create()(PoliceInfo);
