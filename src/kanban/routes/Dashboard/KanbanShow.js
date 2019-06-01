/**
 * kanban 的a b 组件展示抽出来
 * Created by jzy on 2018/9/18 .
 *
 */

import React, { Component } from 'react';

import { Row, Col } from 'antd';
import DragComponent from '../../components/DragComponent/DragComponent';

import styles from './Analysis.less';

class WarppedComponent extends Component {
  render() {
    const { acomponent, topColResponsiveProps, bcomponent,
      handleAcomponentClick, kanbanMode } = this.props;

    return (

      <span>
        {kanbanMode && (
        <div className={styles.normal} key="kanbanshow1">
          <Row gutter={24} type="flex" justify="start" className={styles.arow}>
            {acomponent.map((a, index) => (
              <Col
                {...topColResponsiveProps}
                span={acomponent.length == 5 ? (index == 4 ? 4 : 5) : 5}
                key={a.component_id}
              >
                <DragComponent
                  component_id={a.component_id}
                  handleAcomponentClick={handleAcomponentClick}
                  componentName={a.componentName}
                  position={a.position}
                  type={a.type}
                  nsize={a.nsize}
                  key={a.component_id}
                  index={index}
                />
              </Col>
            ))}
          </Row>
          <Row gutter={16} type="flex" justify="start" className={styles.brow}>
            {bcomponent.map((b, index) => {
              const size = 8 * parseInt(b.nsize, 10);
              return (
                <Col key={b.component_id} className={styles.bcol} span={size}>
                  <DragComponent
                    component_id={b.component_id}
                    componentName={b.componentName}
                    position={b.position}
                    type={b.type}
                    nsize={b.nsize}
                    key={b.component_id}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
        ) }
      </span>
    );
  }
}
export default WarppedComponent;
