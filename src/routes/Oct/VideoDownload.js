import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Modal, message, Row, Col, Button, Input, DatePicker, Form, notification } from 'antd';
import moment from 'moment';
import codeMessage from '../../utils/request';

const { confirm } = Modal;
const { TextArea } = Input;
const FormItem = Form.Item;

class VideoDownload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  onClose = () => {
  }

  download = () => {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/videoDownload/downloadFile';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        const myvalues = {
          ...values,
          startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
          endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
        };
        inputElement.value = JSON.stringify(myvalues);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);

        confirm({
          title: '导出确认',
          content: '导出视频需要一定时间，确认导出？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            formElement.submit();
            document.body.removeChild(formElement);
          },
          onCancel() {
            // alert('操作取消');
          },
        });
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const startTime = moment(`${moment().add(-5, 'minutes').format('YYYY/MM/DD HH:mm:ss')}`);
    const endTime = moment(`${moment().format('YYYY/MM/DD HH:mm:ss')}`);
    return (
      <div>
        <Form className="form-outline-inner-padding">
          <Row>
            <Col span={6}>
              <FormItem {...formItemLayout} label="开始时间">
                {getFieldDecorator('startTime', {
                  initialValue: startTime,
                  rules: [{
                    required: true,
                    message: '请输入开始时间！',
                  }],
                })(<DatePicker
                  showTime
                  style={{ width: '100%' }}
                  maxLength="12"
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间"
                // onChange={onChange}
                // onOk={onOk}
                />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label="结束时间">
                {getFieldDecorator('endTime', {
                  initialValue: endTime,
                  rules: [{
                    required: true,
                    message: '请输入结束时间！',
                  }],
                })(<DatePicker
                  showTime
                  style={{ width: '100%' }}
                  maxLength="12"
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="结束时间"
                // onChange={onChange}
                // onOk={onOk}
                />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label="设备编号">
                {getFieldDecorator('deviceid', {
                  initialValue: '',
                  rules: [{
                    required: true,
                    message: '请输入设备编号！',
                  }],
                })(<Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Button onClick={this.download}>下载</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

function mapStateToProps({ octVersionUpload, common, loading }) {
  return ({
    octVersionUpload,
    common,
    loading: loading.models.octVersionUpload,
  });
}
export default connect(mapStateToProps)(Form.create()(VideoDownload));
