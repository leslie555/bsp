/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Row } from 'antd';
import styles from './HostLogInfo.less';
import { LOGTYPE } from '../../config/enums';

class HostLogInfo extends React.Component {
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
    const { loginfo } = this.props;
    const className = `${styles.logInfoDiv} outline-out`;
    return (
      <div className={className}>
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <h3 className={styles.logInfoTitle}>详情信息</h3>
            <div className={styles.logInfo}>
              <Row>
                <Col span={8}>事件描述：</Col>
                <Col span={16}>{loginfo.eventdesc}</Col>
              </Row>
              <Row>
                <Col span={8}>生成时间：</Col>
                <Col span={16}>{loginfo.creationtime}</Col>
              </Row>
              <Row>
                <Col span={8}>发生时间：</Col>
                <Col span={16}>{loginfo.eventtime}</Col>
              </Row>
              <Row>
                <Col span={8}>入库时间：</Col>
                <Col span={16}>{loginfo.inserttime}</Col>
              </Row>
              <Row>
                <Col span={8}>操作结果：</Col>
                <Col span={16}>{Object.keys(loginfo).length !== 0 ? (loginfo.failcode ? '失败' : '成功') : ''}</Col>
              </Row>
              <Row>
                <Col span={8}>备注：</Col>
                <Col span={16} className={styles.logContent}>{loginfo.note}</Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
HostLogInfo.prototypes = {
  loading: PropTypes.bool,
  dictionarylist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
};
export default Form.create()(HostLogInfo);
