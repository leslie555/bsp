/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Form, Input, Select, Row, Col, Tabs, Icon, message, notification } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './DeviceSelect.less';
import { updateFtp } from '../../../services/octDeviceInfo';

const FormItem = Form.Item;
let oldId = '';

class FtpInfoSelect extends React.Component {
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
    // const { onOk } = this.props;
    // onOk();
    const { form, entity } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { deviceid } = entity;
        const value = { ...values, deviceid };
        updateFtp({ department: { ...value, deviceid } }).then((data) => {
          this.onClose();
          if (data && data.result) {
            message.info(data.info);
          }
        }).catch((erro) => {
          notification.error({ message: `查询出错：${JSON.stringify(erro)}` });
          // this.setState({
          //   visible: false,
          // });
        });
      }
    });
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
    const { ftpvisible, form, entity } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const { deviceid } = entity;
    const modalTitle = `FTP相关信息信息 设备编号：${deviceid}`;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRows = selectedRows;
      },
    };
    return (
      <div>
        <Modal
          title={modalTitle}
          visible={ftpvisible}
          dataSource={entity}
          onCancel={this.onClose}
          onOk={this.onOk}
          width="40%"
          wrapClassName={styles.policeSelect}
        >
          <Form
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="FTP用户名">
                  {getFieldDecorator('ftpuser', {
                    initialValue: entity.ftpuser,
                  })(<Input style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="FTP密码">
                  {getFieldDecorator('ftppwd', {
                    initialValue: entity.ftppwd,
                  })(<Input style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="FTP端口">
                  {getFieldDecorator('ftpport', {
                    initialValue: entity.ftpport,
                  })(<Input style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="主机用户名">
                  {getFieldDecorator('hostname', {
                    initialValue: entity.hostname,
                  })(<Input style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="主机密码">
                  {getFieldDecorator('hostpwd', {
                    initialValue: entity.hostpwd,
                  })(<Input style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
FtpInfoSelect.prototypes = {
  enumList: PropTypes.array.isRequired,
};

export default Form.create()(FtpInfoSelect);
