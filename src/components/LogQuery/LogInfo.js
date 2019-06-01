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
                <Col span={5}>用户名称：</Col>
                <Col span={19}>{loginfo.username}</Col>
              </Row>
              <Row>
                <Col span={5}>部门名称：</Col>
                <Col span={19}>{loginfo.departmentname}</Col>
              </Row>
              <Row>
                <Col span={5}>IP地址：</Col>
                <Col span={19}>{loginfo.clientip}</Col>
              </Row>
              <Row>
                <Col span={5}>操作时间：</Col>
                <Col span={19}>{loginfo.logtime}</Col>
              </Row>
              <Row>
                <Col span={5}>日志类型：</Col>
                <Col span={19}>{this.getEnumValue(LOGTYPE, loginfo.logtype)}</Col>
              </Row>
              <Row>
                <Col span={5}>操作结果：</Col>
                <Col span={19}>{Object.keys(loginfo).length !== 0 ? (loginfo.failcode ? '失败' : '成功') : ''}</Col>
              </Row>
              <Row>
                <Col span={5}>功能名称：</Col>
                <Col span={19}>{loginfo.functionname}</Col>
              </Row>
              <Row>
                <Col span={5}>功能模块：</Col>
                <Col span={19}>{this.getFirstMenuName(loginfo.firstmenuid)}</Col>
              </Row>
              <Row>
                <Col span={5}>操作内容：</Col>
                <Col span={19} className={styles.logContent}>{loginfo.operatecontent}</Col>
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
