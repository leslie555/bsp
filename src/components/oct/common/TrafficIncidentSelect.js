/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Table, Form, Input, Button, Row, Col, Tabs, Icon, Select } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './DeviceSelect.less';
import { PSFX, TRAFFIC } from '../../../config/enums';
import ImageViewer from './ImageViewer';
import videoViewer from './videoViewer';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const tabContent = [
  <span><Icon type="video-camera" />交通事件详情</span>,
  <span><Icon type="form" />事件信息详情</span>,
  <span><Icon type="picture" />图片详情</span>,
];
// let oldId = '';

class TrafficIncidentSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  componentDidMount() {
    const { entity, imgvideo, getImgVideo } = this.props;
    getImgVideo(entity.id);
  }

  onClose = () => {
    const { onClose } = this.props;
    onClose();
  }

  onOk = () => {
    const { onOk } = this.props;
    onOk();
  }

  setImgVideo = (imgs, isImg) => {
    const { loding } = this.props;
    const imgTag = [];
    const imgarr = [];
    const videoarr = [];
    if (imgs == false || imgs == undefined || imgs == '') {
      if (isImg) {
        const ImageViewerProps = {
          ListImages: [{
            uid: '-1',
            status: 'done',
            name: '/HiatmpPro/tpm/img/nopic.jpg',
            url: '/HiatmpPro/tpm/img/nopic.jpg',
          }],
        };
        imgTag.push(<Col span={8}><ImageViewer {...ImageViewerProps} /></Col>);
        return imgTag;
      } else {
        const ImageViewerProps = {
          ListImages: [{
            uid: '-1',
            status: 'done',
            name: '/HiatmpPro/tpm/img/novideo.png',
            url: '/HiatmpPro/tpm/img/novideo.png',
          }],
        };
        imgTag.push(<Col span={8} loding={loding}><ImageViewer {...ImageViewerProps} /></Col>);
        return imgTag;
      }
    } else {
      imgs.forEach(e => {
        if (!e) {
          console.log(e, '!e');
        } else {
          const fname = e.split('.');
          if (fname[fname.length - 1] == 'avi' || fname[fname.length - 1] == 'mp4') {
            videoarr.push(e);
          } else if (fname[fname.length - 1] == 'jpg') {
            imgarr.push(e);
          } else {
            // alert('错误');
          }
        }
      });
      if (isImg) {
        imgarr.forEach(e => {
          const ImageViewerProps = {
            ListImages: [{
              uid: '-1',
              status: 'done',
              name: e,
              url: e,
            }],
          };
          imgTag.push(<Col span={8} loding={loding}><ImageViewer {...ImageViewerProps} /></Col>);
        });
        return imgTag;
      } else {
        videoarr.forEach(e => {
          const eachVideo = <video className="videoview" src={e} controls><track kind="captions" /></video>;
          imgTag.push(<Col span={8}>{eachVideo}</Col>);
        });
        return imgTag;
      }
    }
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

  render() {
    const { deviceSelectVisible, form, entity, img, imgvideo, getImgVideo } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const columns = [];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRows = selectedRows;
      },
    };
    return (
      <div>
        <Modal
          title="交通事件详情"
          visible
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
                <Col span={8}>
                  <FormItem {...formItemLayout} label="设备编号">
                    {getFieldDecorator('deviceid', {
                      initialValue: entity.deviceid,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="设备名称">
                    {getFieldDecorator('devicename', {
                      initialValue: entity.devicename,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="设备位置">
                    {getFieldDecorator('deviceaddress', {
                      initialValue: entity.deviceaddress,
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
                <Col span={8}>
                  <FormItem {...formItemLayout} label="事件类型">
                    {getFieldDecorator('eventtype', {
                      initialValue: this.getEnumValue(TRAFFIC, entity.eventtype),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="开始时间">
                    {getFieldDecorator('starttime', {
                      initialValue: entity.starttime,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="结束时间">
                    {getFieldDecorator('endtime', {
                      initialValue: entity.endtime,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="记录时间">
                    {getFieldDecorator('eventtime', {
                      initialValue: entity.et,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="拍摄方向">
                    {getFieldDecorator('direction', {
                      initialValue: this.getEnumValue(PSFX, entity.direction),
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="入库时间">
                    {getFieldDecorator('inserttime', {
                      initialValue: entity.inserttime,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  {/* <FormItem {...formItemLayout} label="图片总数">
                    {getFieldDecorator('picture_total', {
                      initialValue: '',
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem> */}
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="图像X坐标">
                    {getFieldDecorator('picx', {
                      initialValue: entity.picx,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="图像Y坐标">
                    {getFieldDecorator('picy', {
                      initialValue: entity.picy,
                    })(<Input style={{ width: '100%' }} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row className="TrafficIncident-img">
                {this.setImgVideo(imgvideo, true)}
              </Row>
              <Row className="TrafficIncident-video">
                {this.setImgVideo(imgvideo, false)}
              </Row>
            </Form>
          </Row>
        </Modal>
      </div>
    );
  }
}
TrafficIncidentSelect.prototypes = {
  enumList: PropTypes.array.isRequired,
};

export default Form.create()(TrafficIncidentSelect);
