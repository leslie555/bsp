/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Form, Input, Select, Row, Col, Tabs, Icon, Button } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { PSFX, PLATE_TYPE, CARCOLOR, CARTYPE, NUMCOLOR, CAR_C, CARMARK } from '../../../config/enums';
import styles from './DeviceSelect.less';
import ImageViewer from './ImageViewer';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const tabContent = [
  <span><Icon type="video-camera" />设备详情</span>,
  <span><Icon type="picture" />过车图片</span>,
];
let oldId = '';

class CarRecordSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  componentDidMount() {
    const { entity } = this.props;
    console.log(entity);
  }

  componentWillReceiveProps(value) {
    // const { detail } = this.state;
    // queryVehicleRecordByDetail({ id: value.entity.id }).then((data) => {
    //   console.log(data);
    //   if (data && data.result) {
    //     this.setState({ detail: data.domel });
    //     console.log(detail);
    //     console.log(detail.speed);
    //   }
    // }).catch((err) => {
    //   console.error(`查询出错：${JSON.stringify(err)}`);
    //   this.setState({ detail: {} });
    // });
  }

  componentDidUpdate(nextProps, nextState) {
    const { entity } = nextProps;
    if (entity.id != oldId) {
      oldId = entity.id;
    } else {
      // console.log(entity);
    }
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
    const szEnumValue = String(enumvalue);
    for (let i = 0; i < enumList.length; i += 1) {
      const enumObj = enumList[i];
      if (enumObj.enumtypeid === enumtypeid && enumObj.enumvalue === szEnumValue) {
        return enumObj.enumname;
      }
    }
  }

  dealPic = (picPath) => {
    const imgTag = [];
    console.log(picPath.pic1path);
    if (!picPath.pic1path) {
      imgTag.push(<div>暂无图片</div>);
    } else {
      const szPrefix = '';
      const szStart = '/cifspool/';
      // let szOut = String(picPath.pic1path).replace(szStart, '');
      // szOut = szPrefix + szOut;
      // debugger;
      const szOut = picPath.pic1path.trim();
      // szOut = 'http://4.zhuamm.com:3456/fakeimg/SF_ZNJT_YQ/FTPROOT/VEH_PHOTO/3050-285006/20190117/00/Z_3050-285006_1_20190117000439984_21_%E5%B7%9DAQ03S9.JPG'; // 测试图片
      // return szOut;
      console.log(szOut);
      const ImageViewerProps = {
        ListImages: [{
          uid: '-1',
          status: 'done',
          name: szOut,
          url: szOut,
        }],
      };
      imgTag.push(<ImageViewer {...ImageViewerProps} style={{ padding: '0', margin: '0 auto' }} />);
    }
    return imgTag;
  }

  render() {
    const { visible, form, entity } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    // 一行只有两个控件的情况
    const formItemLayout2 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRows = selectedRows;
      },
    };
    return (
      <div>
        <Modal
          title="过车记录详情"
          visible={visible}
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
            <Form>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="所属路段">
                    {getFieldDecorator('roadname', {
                      initialValue: entity.roadname,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={15} offset={1}>
                  <FormItem {...formItemLayout2} label="设备位置">
                    {getFieldDecorator('cap_address', {
                      initialValue: entity.cap_address,
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
                <Col span={15} offset={1}>
                  <FormItem {...formItemLayout2} label="电警编号">
                    {getFieldDecorator('epdevice_id', {
                      initialValue: entity.epdevice_id,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="过车时间">
                    {getFieldDecorator('dcollectiondate', {
                      initialValue: entity.dcollectiondate,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={7} offset={1}>
                  <FormItem {...formItemLayout} label="车牌号码">
                    {getFieldDecorator('ori_plate_no', {
                      initialValue: entity.ori_plate_no,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={7} offset={1}>
                  <FormItem {...formItemLayout} label="行驶方向">
                    {getFieldDecorator('direction', {
                      initialValue: this.getEnumValue(PSFX, entity.direction),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="车道编号">
                    {getFieldDecorator('laneno', {
                      initialValue: entity.laneno,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={7} offset={1}>
                  <FormItem {...formItemLayout} label="行驶速度">
                    {getFieldDecorator('speed', {
                      initialValue: entity.speed,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={7} offset={1}>
                  <FormItem {...formItemLayout} label="车牌颜色">
                    {getFieldDecorator('ori_plate_color', {
                      initialValue: this.getEnumValue(NUMCOLOR, entity.ori_plate_color),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="车辆类型">
                    {getFieldDecorator('vehicle_type', {
                      initialValue: this.getEnumValue(CARTYPE, entity.vehicle_type),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={7} offset={1}>
                  <FormItem {...formItemLayout} label="车辆颜色">
                    {getFieldDecorator('carcolor', {
                      initialValue: this.getEnumValue(CARCOLOR, entity.carcolor),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                {/* <Col span={7} offset={1}>
                  <FormItem {...formItemLayout} label="车辆标志">
                    {getFieldDecorator('vehicle_logo', {
                      initialValue: this.getEnumValue(CARMARK, entity.vehicle_logo),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col> */}
              </Row>
              <Row>
                {/* <Col span={8}>
                  <FormItem {...formItemLayout} label="车辆种类">
                    {getFieldDecorator('vehicle_style', {
                      initialValue: this.getEnumValue(CAR_C, entity.vehicle_type),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col> */}
                <Col span={8}>
                  {/* <FormItem {...formItemLayout} label="图片总数">
                    {getFieldDecorator('pic.total', {
                      initialValue: '3',
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem> */}
                </Col>
              </Row>
              <Row>
                <Col span={8} style={{ border: '1px grey', width: '30%', height: '40%' }}>
                  {/* {this.dealPic(entity)} */}
                </Col>
                <Col span={8} style={{ border: '1px grey', width: '30%', height: '40%' }}>
                  {this.dealPic(entity)}
                </Col>
                <Col span={8} style={{ border: '1px grey', width: '30%', height: '40%' }}>
                  {/* {this.dealPic(entity)} */}
                </Col>
              </Row>
            </Form>
          </Row>
        </Modal>
      </div>
    );
  }
}
CarRecordSelect.prototypes = {
  enumList: PropTypes.array.isRequired,
};

export default Form.create()(CarRecordSelect);
