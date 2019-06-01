/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Row } from 'antd';
import styles from './LogInfo.less';
import { ALARMTYPE } from '../../config/enums';

class AlarmInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleCancel = this.handleCancel.bind(this);
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

  // 根据一级菜单ID获取菜单名称
  getFirstMenuName(id) {
    const { menus } = this.props;
    for (let i = 0; i < menus.length; i += 1) {
      const menu = menus[i];
      if (menu.id === id) {
        return menu.name;
      }
    }
    return id;
  }

  // 关闭详情弹窗
  handleCancel() {
    const { onCloseModal } = this.props;
    onCloseModal();
  }

  render() {
    const { alarminfo } = this.props;
    const className = `${styles.logInfoDiv} outline-out`;
    return (
      <div className={className}>
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <h3 className={styles.logInfoTitle}>详情信息</h3>
            <div className={styles.logInfo}>
              <Row>
                <Col span={7}>设备编号：</Col>
                <Col span={17}>{alarminfo.deviceid}</Col>
              </Row>
              <Row>
                <Col span={7}>报警时间：</Col>
                <Col span={17}>{alarminfo.alarmtime}</Col>
              </Row>
              <Row>
                <Col span={7}>报警类型：</Col>
                <Col span={17}>{this.getEnumValue(ALARMTYPE, alarminfo.alarmtype)}</Col>
              </Row>
              <Row>
                <Col span={7}>处理标志：</Col>
                <Col span={17}>{alarminfo.dealflag == '' || alarminfo.dealflag == null ? '' : (alarminfo.dealflag == '1' ? '误报处理' : (alarminfo.dealflag == '0' ? '未处理' : '简单处理'))}</Col>
              </Row>
              <Row>
                <Col span={7}>处理机构：</Col>
                <Col span={17}>{alarminfo.orgtype}</Col>
              </Row>
              <Row>
                <Col span={7}>处理时间：</Col>
                <Col span={17}>{alarminfo.dealtime}</Col>
              </Row>
              <Row>
                <Col span={7}>操作人：</Col>
                <Col span={17}>{alarminfo.operator}</Col>
              </Row>
              <Row>
                <Col span={7}>报警内容：</Col>
                <Col span={17}>{alarminfo.alarminfo}</Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
AlarmInfo.prototypes = {
  loading: PropTypes.bool,
  dictionarylist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
};
export default Form.create()(AlarmInfo);
