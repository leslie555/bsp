import React, { Component } from 'react';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';
import { Tag, Row, Col } from 'antd';
import Abox from './Abox';
import Bbox from './Bbox';

import Adustbin from './Adustbin';
import Bdustbin from './Bdustbin';
import ItemTypes from './ItemTypes';
import { ABOXES, BBOXES } from '../config/constant';
import { initAcomponent, initBcomponent, initChartId } from '../utils/dragUtils';
import { isNotNil, getCanChooseAbox, getCanChooseBbox, deepClone } from '../utils/utils';
import equal from '../components/Charts/equal';
import styles from './Container.less';

/* eslint-disable camelcase */
/* eslint-disable react/no-access-state-in-setstate */

@DragDropContext(HTML5Backend)
class RightDragContainer extends Component {
  constructor(props) {
    super(props);

    const { acomponent, bcomponent, allCharts } = this.props;
    this.state = {
      userSelectedAcomponent: initAcomponent(
        acomponent,
        {
          id: '4',
          accepts: [ItemTypes.AWORKBENCH],
          lastDroppedItem: null,
          nsize: '1',
          position: '1',
        },
        5
      ),
      userSelectedBcomponent: initBcomponent(
        bcomponent,
        {
          id: '6',
          accepts: [ItemTypes.BWORKBENCH],
          lastDroppedItem: null,
          nsize: '1',
          position: '1',
        },
        10
      ),
      allCharts,
      droppedABoxNames: initChartId(acomponent),
      droppedBBoxNames: initChartId(bcomponent),
      saveABoxNames: acomponent,
      saveBBoxNames: bcomponent,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!equal(this.props, nextProps)) {
      const obj = {};
      if (nextProps.acomponent) {
        obj.userSelectedAcomponent = initAcomponent(
          nextProps.acomponent,
          {
            id: '4',
            accepts: [ItemTypes.AWORKBENCH],
            lastDroppedItem: null,
            size: '1',
            position: '1',
          },
          5
        );
      }
      if (nextProps.bcomponent) {
        obj.userSelectedBcomponent = initBcomponent(
          nextProps.bcomponent,
          {
            id: '6',
            accepts: [ItemTypes.BWORKBENCH],
            lastDroppedItem: null,
            size: '1',
            position: '1',
          },
          10
        );
      }

      this.setState(obj);
    }
  }

  onSizeCallBack = (index, nsize) => {
    const { userSelectedBcomponent: bb, saveBBoxNames, saveABoxNames } = this.state;
    const { bcompmentSizeAddHandler } = this.props;

    bb[index].nsize = nsize;
    this.setState({
      userSelectedBcomponent: bb,
    });

    bcompmentSizeAddHandler(bb, saveBBoxNames, saveABoxNames);
  };

  onAboxDeleteCallback = (index, item) => {
    const { droppedABoxNames, saveABoxNames, saveBBoxNames } = this.state;

    const { onDropBoxCallback } = this.props;
    const aa = droppedABoxNames.filter(element => {
      return element != item;
    });
    const saveAbox = saveABoxNames.filter(element => {
      return element.component_id != item;
    });
    this.setState(
      update(this.state, {
        userSelectedAcomponent: {
          [index]: {
            lastDroppedItem: {
              $set: null,
            },
          },
        },
      })
    );
    this.setState({
      droppedABoxNames: aa,
      saveABoxNames: saveAbox,
    });
    onDropBoxCallback(aa, saveAbox, saveBBoxNames);
  };

  onBboxDeleteCallback = (index, item) => {
    const { droppedBBoxNames, saveBBoxNames, saveABoxNames } = this.state;
    const { onDropBoxCallback } = this.props;
    const bb = droppedBBoxNames.filter(element => {
      return element != item;
    });
    const saveBbox = saveBBoxNames.filter(element => {
      return element.component_id != item;
    });
    this.setState(
      update(this.state, {
        userSelectedBcomponent: {
          [index]: {
            lastDroppedItem: {
              $set: null,
            },
          },
        },
      })
    );
    this.setState({
      droppedBBoxNames: bb,
      saveBBoxNames: saveBbox,
    });
    onDropBoxCallback(bb, saveABoxNames, saveBbox);
  };

  saveWorkbench = () => {
    const { workbenchSubmitHandler, acomponent, bcomponent, bcompoentSize } = this.props;
    workbenchSubmitHandler(acomponent, bcomponent, bcompoentSize);
  };

  handleDropBdustbin(index, item) {
    const { onDropBoxCallback } = this.props;
    const { saveBBoxNames, droppedBBoxNames, saveABoxNames } = this.state;
    const { ChartId, componentName, nsize } = item;
    const chartIdArr = [`${ChartId}`];
    const saveBBoxNamesClone = deepClone(saveBBoxNames);
    const aa = {
      component_id: `${ChartId}`,
      componentName,
      nsize,
      type: ItemTypes.BWORKBENCH,
      position: index + 1,
      parameterconfig: null,
    };
    saveBBoxNamesClone.push(aa);
    this.setState(
      update(this.state, {
        userSelectedBcomponent: {
          [index]: {
            lastDroppedItem: {
              $set: ChartId,
            },
          },
        },
        droppedBBoxNames: {
          $push: chartIdArr,
        },
        saveBBoxNames: {
          $set: saveBBoxNamesClone,
        },
      })
    );

    onDropBoxCallback(droppedBBoxNames, saveABoxNames, saveBBoxNamesClone);
  }

  /**
   * A被选择时候方法
   * @param index
   * @param item
   */
  handleDropAdustbin(index, item) {
    const { onDropBoxCallback } = this.props;
    const { saveBBoxNames, droppedABoxNames, saveABoxNames } = this.state;

    const { ChartId, componentName, nsize, type, position } = item;
    const chartIdArr = [`${ChartId}`];
    const saveABoxNamesClone = deepClone(saveABoxNames);
    const aa = {
      component_id: ChartId,
      componentName,
      nsize,
      type: ItemTypes.AWORKBENCH,
      position: index + 1,
      parameterconfig: null,
    };

    saveABoxNamesClone.push(aa);
    this.setState(
      update(this.state, {
        userSelectedAcomponent: {
          [index]: {
            lastDroppedItem: {
              $set: ChartId,
            },
          },
        },
        droppedABoxNames: {
          $push: chartIdArr,
        },
        saveABoxNames: {
          $set: saveABoxNamesClone,
        },
      })
    );

    onDropBoxCallback(droppedABoxNames, saveABoxNamesClone, saveBBoxNames);
  }

  render() {
    const { userSelectedAcomponent, userSelectedBcomponent } = this.state;
    const {
      workbenchVisible,
      ContainerType,
      droppedAboxNamesDeleted,
      droppedBboxNamesDeleted,
      allCharts,
      workbenchVisibleCallback,
    } = this.props;

    /* eslint-disable  no-unused-expressions */
    return (
      <div>
        {do {
          if (workbenchVisible && ContainerType === 'WorkbenchConfigRight') {
            /* 右侧可扩展栏 */
            <div className={styles.normal}>
              <div className={styles.rightSider}>
                <Row gutter={0}>
                  <Col span={11} style={{ fontSize: '16px' }}>
                    自定义首页
                  </Col>
                  <Col span={13} style={{ textAlign: 'right' }}>
                    <Tag style={{ marginRight: '1px' }} onClick={this.saveWorkbench}>
                      保存
                    </Tag>
                    <Tag style={{ marginRight: '1px' }} onClick={workbenchVisibleCallback}>
                      取消
                    </Tag>
                  </Col>
                </Row>
              </div>
              <div className={styles.mainContain}>
                <h4 className={styles.h41}>A区域</h4>
                <div style={{ border: '1px solid gray', width: '90%', marginLeft: '5%' }}>
                  {getCanChooseAbox(ABOXES, allCharts, droppedAboxNamesDeleted).map(
                    ({ name, ChartId, type, nsize, componentName, position }, index) => (
                      <Abox
                        componentName={componentName}
                        name={name}
                        type={type}
                        ChartId={ChartId}
                        nsize={nsize}
                        position={position}
                        key={ChartId}
                      />
                    )
                  )}
                </div>
                <div>
                  <h4 className={styles.h42}>B区域</h4>
                </div>
                <div className={styles.bcontain}>
                  {getCanChooseBbox(BBOXES, allCharts, droppedBboxNamesDeleted).map(
                    ({ name, ChartId, type, nsize, componentName, position }, index) => (
                      <Bbox
                        componentName={componentName}
                        name={name}
                        type={type}
                        nsize={nsize}
                        position={position}
                        ChartId={ChartId}
                        key={ChartId}
                      />
                    )
                  )}
                </div>
              </div>
            </div>;
          } else if (workbenchVisible && ContainerType === 'WorkbenchConfigLeft') {
            <div className={styles.workbenchContain}>
              <div>
                {userSelectedAcomponent.map((dustbin, index) => (
                  <Adustbin
                    id={dustbin.id}
                    accepts={ItemTypes.AWORKBENCH}
                    lastDroppedItem={dustbin.lastDroppedItem}
                    onDrop={item => this.handleDropAdustbin(index, item)}
                    onAboxDeleteCallback={this.onAboxDeleteCallback}
                    key={dustbin.id}
                    index={index}
                  />
                ))}
              </div>
              <div>
                <div>
                  {userSelectedBcomponent.map((dustbin, index) => (
                    <Bdustbin
                      id={dustbin.id}
                      accepts={ItemTypes.BWORKBENCH}
                      lastDroppedItem={dustbin.lastDroppedItem}
                      onDrop={item => this.handleDropBdustbin(index, item)}
                      onBboxDeleteCallback={this.onBboxDeleteCallback}
                      key={dustbin.id}
                      nsize={dustbin.nsize}
                      position={dustbin.position}
                      index={index}
                      onSizeCallBack={this.onSizeCallBack}
                      bigStyle={ContainerType === 'WorkbenchConfigLeft' ? 'small' : 'big'}
                    />
                  ))}
                </div>
              </div>
            </div>;
          }
        }}
      </div>
    );
  }
}

export default RightDragContainer;
