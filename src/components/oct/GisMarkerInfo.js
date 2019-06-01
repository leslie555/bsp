/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Row, Button } from 'antd';
import styles from './GisMarkerInfo.less';

class MarkerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  test() {
    const { onTestClick } = this.props;
    onTestClick();
  }

  render() {
    const { markerinfo } = this.props;
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <h3 className={styles.detailInfoTitle}>设备详情</h3>
            <div className={styles.detailInfo}>
              <h4 className={styles.detailInfoTitle}>基础信息</h4>
              <Form>
                <Row>
                  <Col span={12}>用户名称：</Col>
                  <Col span={12}>{markerinfo.username}</Col>
                </Row>
                <Row>
                  <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.test()}>测试</Button>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
MarkerInfo.prototypes = {
};
export default Form.create()(MarkerInfo);
