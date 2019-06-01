/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Spin, notification, Input, Modal } from 'antd';
import { ENUM_ILLEGAL } from '../../config/enums';
// import BreakSelect from './BreakSelect';

class VersionStatusSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getEnumValue = this.getEnumValue.bind(this);
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

  saveEditconfig = (v) => {
    const { form, saveEditconfig } = this.props;
    form.validateFields((err, value) => {
      if (!err) {
        console.log(value);
        saveEditconfig(value);
      }
    });
  }

  render() {
    const {
      serverdata,
      form,
      oldip,
      editconfig,
      ditconfigclose,
    } = this.props;
    const { getFieldDecorator } = form;
    // 修改配置文件Modalprops
    const editconfigModalprops = {
      title: `修改${oldip}的配置文件`,
      visible: editconfig,
      onCancel: ditconfigclose,
      width: '60%',
      footer: [
        <Button onClick={this.saveEditconfig}>保存</Button>,
        <Button onClick={ditconfigclose}>取消</Button>,
      ],
    };
    const { TextArea } = Input;
    return (
      <div>
        <Modal {...editconfigModalprops}>
          <Form style={{ marginTop: '20px' }}>
            <Row>
              <Col span={24}>
                {getFieldDecorator('servervalue', {
                  initialValue: serverdata,
                  // rules: [{ required: true }],
                })(
                  <TextArea
                    placeholder="请输入配置文件内容"
                    autosize
                    style={{ width: '100%' }}
                  />
                )}
              </Col>
            </Row>
          </Form>
        </Modal>

      </div>
    );
  }
}
VersionStatusSelect.prototypes = {
  // loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  selectedKeys: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  changeSelected: PropTypes.func,
  onView: PropTypes.func,
  currentId: PropTypes.string,
  onDownload: PropTypes.func,
};
export default Form.create()(VersionStatusSelect);
