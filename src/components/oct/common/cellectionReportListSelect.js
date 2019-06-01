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

class CellectionReportListSelect extends React.Component {
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
    const imgTag = [];
    const imgarr = [];
    const videoarr = [];
    console.log(imgs, isImg);
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
        imgTag.push(<Col span={8}><ImageViewer {...ImageViewerProps} /></Col>);
        return imgTag;
      }
    } else {
      imgs.forEach(e => {
        if (!e) {
          console.log(e, '!e');
        } else {
          console.log(e, 'e');
          const fname = e.split('.');
          console.log(fname[fname.length - 1]);
          if (fname[fname.length - 1] == 'avi' || fname[fname.length - 1] == 'mp4') {
            videoarr.push(e);
          } else if (fname[fname.length - 1] == 'jpg') {
            imgarr.push(e);
          } else {
            // alert('错误');
          }
        }
      });
    }
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
        imgTag.push(<Col span={8}><ImageViewer {...ImageViewerProps} /></Col>);
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

  // 根据枚举值获取枚举名
  getEnumValue(enumtypeid, enumvalue) {
    const { enumList } = this.props;
    // console.log(enumList);
    // debugger;
    for (let i = 0; i < enumList.length; i += 1) {
      const enumObj = enumList[i];
      if (enumObj.enumtypeid === enumtypeid && enumObj.enumvalue === enumvalue) {
        return enumObj.enumname;
      }
    }
  }

  render() {
    const { deviceSelectVisible, form, entity, img, imgvideo, getImgVideo } = this.props;
    // console.log(imgvideo);
    // console.log(img);
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
          title="详情"
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
        haha
        </Modal>
      </div>
    );
  }
}
CellectionReportListSelect.prototypes = {
  enumList: PropTypes.array.isRequired,
};

export default Form.create()(CellectionReportListSelect);
