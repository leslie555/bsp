/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Table, Form, Input, Button, Row, Col, Tabs, Icon, Upload } from 'antd';
import React from 'react';
import styles from './ImageViewer.less';

class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      previewImage: '',
      current: 90,
      transStyle: '',
    };
  }

  // 预览，设置查看的当前图片，设置弹框为展开
  preview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      visible: true,
    });
  }

  // 取消预览，这里需要将下一次旋转的初始值0,rotate(0deg)
  cancelPreview = () => {
    this.setState({
      visible: false,
      current: 90,
      transStyle: '',
    });
  }

  //  点击选择  设置当前current旋转角度为上一次+90°
  translate = () => {
    const { current } = this.state;
    this.setState({
      current: (current + 90) % 360,
      transStyle: `rotateZ(${current}deg) translateX(-50%) translateY(-50%)`,
    });
  }

  render() {
    const { ListImages } = this.props;
    const { transStyle, previewImage, visible } = this.state;
    const content = (
      <div style={{ textAlign: 'center' }}>
        <Button
          onClick={
            () => {
              const str = `<!DOCTYPE html><html><body style="margin: 0px; background: #0e0e0e;"><img src=${previewImage} /></body></html>`;
              const a = window.open(`${previewImage}`, '_blank');
              // a.document.write(str);
            }
          }
        >查看原图<Icon type="arrows-alt" />
        </Button>
        {/* <span style={{ marginLeft: 6 }}>
          <Button
            onClick={this.translate}
          >
            旋转<Icon type="reload" theme="outlined" />
          </Button>
        </span> */}
        <span style={{ marginLeft: 6 }}>
          <Button
            onClick={this.cancelPreview}
          >
            关闭<Icon type="close" theme="outlined" />
          </Button>
        </span>
      </div>
    );
    return (
      <div className={styles.hideDeleteBtn}>
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={ListImages}
          onPreview={this.preview.bind(this)}
        />
        <Modal
          visible={visible}
          footer={content}
          onCancel={this.cancelPreview.bind(this)}
          width="75%"
        >
          <div className={styles.imgdiv}>
            <Button
              onClick={this.cancelPreview}
              className={styles.preimg}
            >
              <Icon type="left" theme="outlined" />
            </Button>
            <Button
              onClick={this.cancelPreview}
              className={styles.nextimg}
            >
              <Icon type="right" theme="outlined" />
            </Button>
            <img
              alt="example"
              style={{ maxWidth: '100%', maxHeight: '100%', transform: transStyle }}
              src={previewImage}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ImageViewer);
