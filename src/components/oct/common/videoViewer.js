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
      transStyle: 'rotate(0deg)',
    });
  }

  //  点击选择  设置当前current旋转角度为上一次+90°
  translate = () => {
    const { current } = this.state;
    this.setState({
      current: (current + 90) % 360,
      transStyle: `rotate(${current}deg)`,
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
              const str = `<!DOCTYPE html><html><body ><img src=${previewImage}/></body></html>`;
              const a = window.open('', '_blank');
              a.document.write(str);
            }
          }
        >查看原图
        </Button>
        <span style={{ marginLeft: 6 }}>
          <Button
            onClick={this.translate}
          >
            旋转<Icon type="reload" theme="outlined" />
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
        >
          <div style={{ marginTop: 20, height: 470, transform: transStyle, display: 'flex', alignItems: 'center' }}>
            <video width={30}>
              <track kind="captions" default />
              <source src={previewImage} type="video/mp4" />
            </video>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ImageViewer);
