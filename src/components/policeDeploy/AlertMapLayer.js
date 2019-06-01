import React, { Component } from 'react';

import { Select, Input, Upload, Icon, Tag, Button, Divider, Switch, List } from 'antd';
import PropTypes from 'prop-types';
import styles from './AlertMapLayer.less';

/**
 * 页面地图图层组件
 */

class AlertMapLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: ['报警弹幕', '警力', '摄像机', '信号机'],
      layerVisible: false,
      iconChange: true,
    };
  }

  handleName = (name, e) => {
    const { onChange } = this.props;
    onChange(name, e);
  };

  render() {
    const { layerVisible, iconChange, category } = this.state;
    return (
      <div className={styles.outStyle}>
        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={() => {
              this.setState({
                layerVisible: !layerVisible,
                iconChange: !iconChange,
              });
            }}
            style={{
              width: 120,
              height: 36,
              borderRadius: 0,
              fontSize: 16,
              background: layerVisible ? '#1788D6' : '#112852',
              borderColor: layerVisible ? '#1788D6' : '#1788D6',
            }}
          >
            图层
            <Icon
              style={{ marginLeft: 15, color: layerVisible ? '#0D1F4C' : '#0D88D9' }}
              type={iconChange ? 'caret-down' : 'caret-up'}
            />
          </Button>
        </div>
        <div
          className={styles.layerStyle}
          style={{
            height: 180,
            width: 180,
            marginTop: 4,
            paddingTop: 10,
            background: '#1C437E',
            display: layerVisible ? 'block' : 'none',
          }}
        >
          <div style={{ marginLeft: 10, marginRight: 10 }}>
            <List
              bordered
              dataSource={category}
              renderItem={item => (
                <List.Item>
                  <span className={styles.spanStyle}>{item}</span>
                  <Switch
                    defaultChecked={item === '报警弹幕' || item === '警力'}
                    onChange={this.handleName.bind(this, item)}
                    style={{ marginLeft: 10 }}
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}
AlertMapLayer.propTypes = {};
export default AlertMapLayer;
