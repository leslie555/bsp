/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Table, Form, Input, Button, Row, Col, Tabs, Icon, Tooltip } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './DeviceSelect.less';
import { PSFX, CARCOLOR, CAR_C, CARMARK, ENUM_ILLEGAL, CARTYPE, NUMCOLOR, NUMBERTYPE } from '../../../config/enums';
import ImageViewer from './ImageViewer';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const tabContent = [
  <span><Icon type="video-camera" />设备详情</span>,
  <span><Icon type="form" />违法信息详情</span>,
  <span><Icon type="picture" />图片详情</span>,
];
// let oldId = '';

class BreakSelect extends React.Component {
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

  onClose = () => {
    const { onClose } = this.props;
    onClose();
  }

  onOk = () => {
    const { onOk } = this.props;
    onOk();
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

  getPicture = (entity) => {
    const { enumList } = this.props;
    console.log(entity);
    // const imgarr = [entity.picurl1, entity.picurl2, entity.picurl3];
    const imgarr = [];
    if (entity.picurl1) {
      imgarr.push(entity.picurl1);
    }
    if (entity.picurl2) {
      imgarr.push(entity.picurl2);
    }
    if (entity.picurl3) {
      imgarr.push(entity.picurl3);
    }
    const noimgarr = ['/HiatmpPro/tpm/img/nopic.jpg', '/HiatmpPro/tpm/img/nopic.jpg', '/HiatmpPro/tpm/img/nopic.jpg'];
    const imgTag = [];
    console.log(imgarr);
    const array = { array: noimgarr };
    if (!imgarr || imgarr.length == 0) {
      noimgarr.forEach(e => {
        const ImageViewerProps = {
          ListImages: [{
            uid: '-1',
            status: 'done',
            name: e,
            url: e,
          }],
        };
        imgTag.push(<Col span={8}><ImageViewer {...ImageViewerProps} {...array} /></Col>);
      });
      return imgTag;
    } else {
      imgarr.forEach(e => {
        const ImageViewerProps = {
          ListImages: [{
            uid: '-1',
            status: 'done',
            name: e,
            url: e,
          }],
        };
        imgTag.push(<Col span={8}><ImageViewer {...ImageViewerProps} /></Col>);
      });
      return imgTag;
    }
  }

  render() {
    const { form, entity, imglist } = this.props;
    const { getFieldDecorator } = form;
    const { pic } = entity;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <div>
        <Modal
          title="涉嫌违法详情"
          visible
          // visible={visible}
          dataSource={entity}
          onCancel={this.onClose}
          // onOk={this.onOk}
          width="60%"
          wrapClassName={styles.policeSelect}
          footer={[
            <Button key="back" onClick={this.onClose}>关闭</Button>,
          ]}
        >
          <Row>
            <Form layout="inline">
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="所属路段">
                    {getFieldDecorator('roadname', {
                      initialValue: entity.roadname,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="设备编号">
                    {getFieldDecorator('deviceid', {
                      initialValue: entity.deviceid,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                {/* <Col span={8}>
                  <FormItem {...formItemLayout} label="设备名字">
                    {getFieldDecorator('devicename', {
                      initialValue: entity.devicename,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col> */}
                <Col span={8}>
                  <FormItem {...formItemLayout} label="电警编号">
                    {getFieldDecorator('policedevid', {
                      initialValue: entity.policedevid,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="设备位置">
                    {getFieldDecorator('devicepos', {
                      initialValue: entity.devicepos,
                    })(<Input style={{ width: '100%' }} title={entity.devicepos} disabled />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="违法时间">
                    {getFieldDecorator('eventtime', {
                      initialValue: entity.eventtime,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="违法类型">
                    {getFieldDecorator('eventtype', {
                      initialValue: this.getEnumValue(ENUM_ILLEGAL, entity.illegalid),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="车牌号码">
                    {getFieldDecorator('plateno', {
                      initialValue: entity.plateno,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="拍摄方向">
                    {getFieldDecorator('direction', {
                      initialValue: this.getEnumValue(PSFX, entity.direction),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="车辆颜色">
                    {getFieldDecorator('vehiclecolor', {
                      initialValue: this.getEnumValue(CARCOLOR, entity.vehiclecolor),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="车辆种类">
                    {getFieldDecorator('vehicleclass', {
                      initialValue: this.getEnumValue(CAR_C, entity.vehicleclass),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                {/* <Col span={8}>
                  <FormItem {...formItemLayout} label="车辆标志">
                    {getFieldDecorator('vehiclelogo', {
                      initialValue: this.getEnumValue(CARMARK, entity.vehiclelogo),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col> */}
                <Col span={8}>
                  <FormItem {...formItemLayout} label="车辆类型">
                    {getFieldDecorator('vehicletype', {
                      initialValue: this.getEnumValue(CARTYPE, entity.vehicletype),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="号牌颜色">
                    {getFieldDecorator('platecolor', {
                      initialValue: this.getEnumValue(NUMCOLOR, entity.platecolor),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="号牌类型">
                    {getFieldDecorator('platetype', {
                      initialValue: this.getEnumValue(NUMBERTYPE, entity.platetype),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="车道编号">
                    {getFieldDecorator('laneno', {
                      initialValue: entity.laneno,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="限制速度">
                    {getFieldDecorator('limitspeed', {
                      initialValue: entity.limitspeed,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="行驶速度">
                    {getFieldDecorator('speed', {
                      initialValue: entity.speed,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label="限速最高值">
                    {getFieldDecorator('maxlimitspeed', {
                      initialValue: entity.maxlimitspeed,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="红灯开始时间" style={{ marginLeft: '-12px' }}>
                    {getFieldDecorator('rlontime', {
                      initialValue: entity.rlontime,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="红灯结束时间" style={{ paddingRight: '12px' }}>
                    {getFieldDecorator('rlofftime', {
                      initialValue: entity.rlofftime,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                {/* <Col span={8}>
                  <FormItem {...formItemLayout} label="图片总数">
                    {getFieldDecorator('piccount', {
                      initialValue: entity.piccount,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col> */}
              </Row>
              <Row gutter={18}>
                {this.getPicture(entity)}
              </Row>
            </Form>
          </Row>
        </Modal>
      </div>
    );
  }
}

BreakSelect.prototypes = {
  list: PropTypes.array,
  enumList: PropTypes.array,
  onCancel: PropTypes.func,
};
export default Form.create()(BreakSelect);
