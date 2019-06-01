/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Table, Form, Input, Button, Row, Col, Tabs, Icon, Tooltip } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './DeviceSelect.less';
import { PSFX, CARCOLOR, CAR_C, CARMARK, ENUM_ILLEGAL, CARTYPE, NUMCOLOR, NUMBERTYPE } from '../../../config/enums';


class QuerydetailSave extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  componentDidMount() {
    const { entity, imglist, getImageList } = this.props;
  }

  componentWillReceiveProps(nextProps) {
    const { imglist } = nextProps;
  }

  onClose = () => {
    const { onClose } = this.props;
    onClose();
  }

  onOk = () => {
    const { onClose } = this.props;
    onClose();
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

  title = () => {
    // const { title } = this.props;
    // return `${title}详情`;
  }

  edit = (record) => {
    console.log(record);
  }

  render(record) {
    const title = 'hah';
    console.log(this.props);
    return (
      <div>
        <Modal
          title={title}
          visible
          // visible={visible}
          // dataSource={entity}
          onCancel={this.onClose}
          width="60%"
          wrapClassName={styles.policeSelect}
          footer={[
            <Button key="back" onClick={this.onClose}>关闭</Button>,
          ]}
        >
          <Form
            id="mainForm"
            layout="vertical"
            style={{
              marginLeft: '100px',
              marginTop: '-20px',
              overflow: 'auto',
              maxHeight: '500px',
              padding: '0px 8px',
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <div>
                  <Tooltip placement="right" title="设备编号">
                    <span style={{ fontSize: 28 }}>haha</span>
                  </Tooltip>
                  <div>
                    <Tooltip placement="right" title="设备名称">
                      <span>as</span>
                    </Tooltip>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

QuerydetailSave.prototypes = {
  list: PropTypes.array,
  enumList: PropTypes.array,
  onCancel: PropTypes.func,
};
export default Form.create()(QuerydetailSave);
