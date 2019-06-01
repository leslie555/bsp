/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Table, Form, Input, Button, Row, Col, Upload, Icon } from 'antd';
import React from 'react';

const FormItem = Form.Item;
class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      policeList: [],
      loading: false,
      selectPolice: {},
      uploadresult: {},
    };
  }

  onClose = () => {
    const { onClose } = this.props;
    // this.selectedRows = [];
    this.setState({ policeList: [], loading: false, selectPolice: {} });
    onClose();
  }

  onOk = () => {
    const { onOk } = this.props;
    const { selectPolice } = this.state;
    onOk(selectPolice);
    this.setState({ policeList: [], loading: false, selectPolice: {} });
  }

  onChange (info) {
    const res = info.file.response;
    this.setState({ uploadresult: res });
  }

  uploadresultInfo () {
    // 上传结果
    const { uploadresult } = this.state;
    const arr = [];
    if (uploadresult === undefined) {
      // console.log('暂时没有数据');
    } else {
      arr.push(<div>{uploadresult.info}</div>);
      arr.push(<div>{uploadresult.error}</div>);
      return <div className="red uploadinfo">{arr}</div>;
    }
    // 上传文件列表
    const uploadlistitem = document.getElementsByClassName('ant-upload-list-item-info');
    for (let i = 0; i < uploadlistitem.length; i += 1) {
      if (i == uploadlistitem.length - 1) {
        break;
      } else {
        uploadlistitem[i].innerHTML = '';
      }
    }
  }

  render() {
    const {
      name,
      action,
      showUploadList,
      accept,
      downloadTemplate,
      width,
      visible,
      form,
      type,
      iscallback,
      onChange,
    } = this.props;
    const { policeList, loading, selectPolice } = this.state;
    const props = {
      name,
      action,
      showUploadList,
      accept,
      onChange: iscallback ? onChange : (info) => {
        this.onChange(info);
      },
    };
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <div>
        <Modal
          visible={visible}
          onCancel={this.onClose}
          onOk={this.onOk}
          width={width}
        >
          <Row>
            <Upload.Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或者拖曳进行上传</p>
            </Upload.Dragger>
            {this.uploadresultInfo()}
            {type == 'hide' ? null : <a href={downloadTemplate}>下载模板</a>}
          </Row>
        </Modal>
      </div>
    );
  }
}


export default Form.create()(FileUpload);
