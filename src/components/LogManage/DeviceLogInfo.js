/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Row } from 'antd';
import styles from './LogInfo.less';
import { LOGTYPE } from '../../config/enums';

class LogInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  render() {
    const { loginfo } = this.props;
    const className = `${styles.logInfoDiv} outline-out`;
    return (
      <div className={className}>
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <h3 className={styles.logInfoTitle}>详情信息</h3>
            <div className={styles.logInfo}>
              <Row>
                <Col span={7}>设备编号:</Col>
                <Col span={17}>{loginfo.deviceid}</Col>
              </Row>
              <Row>
                <Col span={7}>设备ip地址:</Col>
                <Col span={17}>{loginfo.ip_address}</Col>
              </Row>
              <Row>
                <Col span={7}>cpu温度:</Col>
                <Col span={17}>{loginfo.cpu_temp}</Col>
              </Row>
              <Row>
                <Col span={8}>cpu风扇速度:</Col>
                <Col span={16}>{loginfo.cpu_fan_speed}</Col>
              </Row>
              <Row>
                <Col span={8}>剩余物理内存:</Col>
                <Col span={16}>{loginfo.free_memory}</Col>
              </Row>
              <Row>
                <Col span={7}>线程计数:</Col>
                <Col span={17}>{loginfo.thread_count}</Col>
              </Row>
              <Row>
                <Col span={9}>上次通信状态:</Col>
                <Col span={15}>{loginfo.is_normal == null ? '' : (loginfo.is_normal === 'ok' ? '正常' : '异常')}</Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
LogInfo.prototypes = {
  loading: PropTypes.bool,
  dictionarylist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
};
export default Form.create()(LogInfo);
