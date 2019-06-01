import React, { Component } from 'react';
import update from 'immutability-helper';
import ProtoTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Button, Row, Col } from 'antd';
import Dustbin from './Dustbin';
import LeftSecondConfigContainer from './LeftSecondConfigContainer';
import ItemTypes from './ItemTypes';
import { initMenus, initMenuBoxes } from '../utils/dragUtils';
import { isNotNil, deepClone } from '../utils/utils';
import equal from '../components/Charts/equal';
import styles from './Container.less';

@DragDropContext(HTML5Backend)
class LeftConfigContainer extends Component {
  constructor(props) {
    super(props);

    const { selectedMenus } = this.props;
    this.state = {
      userSelectedMenus: [],
      secondSilderboxes: [] /* 第二个silder 初始化菜单 */,
      droppedBoxMenuNames: [],
      selectedMenus, // menus初始设置
    };
    this.onMenuDeleteCallback = this.onMenuDeleteCallback.bind(this);
    this.isDropped = this.isDropped.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!equal(this.props, nextProps)) {
      const obj = {};
      if (isNotNil(nextProps.selectedMenus)) {
        obj.userSelectedMenus = initMenus(
          nextProps.selectedMenus,
          { id: '10', accepts: [ItemTypes.MENU], lastDroppedItem: null },
          10
        );
        obj.selectedMenus = nextProps.selectedMenus; // menus初始设置
        obj.droppedBoxMenuNames = nextProps.selectedMenus.map(x => x.menuName);
      }
      if (isNotNil(nextProps.flattedLeftMenus)) {
        obj.secondSilderboxes = initMenuBoxes(nextProps.flattedLeftMenus); // 第二个silder 初始化菜单
      }

      this.setState(obj);
    }
  }

  /** .ant-tree-node-content-wrapper
   * 删除菜单的时候的处理
   * @param index
   * @param item
   */
  onMenuDeleteCallback(index, item) {
    const { droppedBoxMenuNames } = this.state;
    const { onDropMenuCallback } = this.props;
    const cc = droppedBoxMenuNames.filter((element) => {
      return element !== item;
    });
    update(this.state, {
      userSelectedMenus: {
        [index]: {
          lastDroppedItem: {
            $set: null,
          },
        },
      },
    });
    const { userSelectedMenus } = this.state;
    userSelectedMenus[index] = {
      ...userSelectedMenus[index],
      accepts: [ItemTypes.MENU],
      lastDroppedItem: null,
    };
    this.setState({ userSelectedMenus });
    this.setState({
      droppedBoxMenuNames: cc,
    });
    onDropMenuCallback(cc, 'delete');
  }

  isDropped(name) {
    const { droppedBoxMenuNames } = this.state;
    return droppedBoxMenuNames.indexOf(name) > -1;
  }

  /* eslint-disable react/no-access-state-in-setstate */
  /* eslint-disable   react/destructuring-assignment */
  /**
   * 左侧菜单栏添加用户选择
   * @param index
   * @param item
   */
  handleDropMenu(index, item) {
    const { name } = item;
    const { onDropMenuCallback } = this.props;
    const droppedBoxMenuNames = name ? { $push: [name] } : {};
    this.setState(
      update(this.state, {
        userSelectedMenus: {
          [index]: {
            lastDroppedItem: {
              $set: item,
            },
          },
        },
        droppedBoxMenuNames,
      })
    );
    onDropMenuCallback(this.state.droppedBoxMenuNames);
  }

  /* eslint-disable  no-unused-expressions */
  render() {
    const { secondSilderboxes, userSelectedMenus } = this.state;
    const { visible, ContainerType, leftMenus, submitHandler, menuSettingHandler } = this.props;
    return (
      <div>
        {do {
          if (visible && ContainerType === 'left') {
            /* 左侧第一个栏 数据接收 */
            <div style={{ overflow: 'hidden', clear: 'both' }}>
              {userSelectedMenus.map((dustbin, index) => (
                <Dustbin
                  id={dustbin.id}
                  accepts={ItemTypes.MENU}
                  lastDroppedItem={dustbin.lastDroppedItem}
                  onDrop={item => this.handleDropMenu(index, item)}
                  onMenuDeleteCallback={this.onMenuDeleteCallback}
                  key={dustbin.id}
                  index={index}
                />
              ))}
            </div>;
          } else if (visible && ContainerType === 'right') {
            /* 左侧第二个可隐藏栏 数据源 */
            <div className={styles.rightContainer}>
              <div className={styles.rightContainerTitle}>
                <div className={styles.container}>
                  <Row gutter={0}>
                    <Col span={10} offset={1} style={{ fontSize: '16px' }}>
                      自定义菜单
                    </Col>
                    <Col span={9} offset={4}>
                      <Button
                        style={{ marginRight: '0.5px', position: 'inline-block' }}
                        size="small"
                        type="primary"
                        onClick={submitHandler}
                      >
                        保存
                      </Button>&nbsp;&nbsp;
                      <Button
                        style={{ marginRight: '0.5px', position: 'inline-block' }}
                        size="small"
                        ghost
                        onClick={menuSettingHandler}
                      >
                        取消
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className={styles.rightContain}>
                {/*   {secondSilderboxes
                  .filter(element => {
                    let cc = true;
                    for (const i of selectedMenus) {
                      if (element.menuName == i.menuName) {
                        cc = false;
                      }
                    }
                    return cc;
                  })
                  .map(({ id, menuName, type }, index) => (
                    <Box
                      id={id}
                      menuName={menuName}
                      type={ItemTypes.MENU}
                      isDropped={this.isDropped(menuName)}
                      key={id}
                      index={index}
                    />
                  ))} */}

                <LeftSecondConfigContainer treeData={leftMenus} isDropped={this.isDropped} />
              </div>
            </div>;
          }
        }}
      </div>
    );
  }
}
LeftConfigContainer.prototypes = {
  ContainerType: ProtoTypes.string,
};
LeftConfigContainer.defaultProps = {
  ContainerType: 'right',
};
export default LeftConfigContainer;
