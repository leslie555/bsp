/**
 * Created by jingzy on 2018/08/01 .
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { Icon, Tooltip } from 'antd';
import ItemTypes from './ItemTypes';
import { getBackgroundColor, getContainerTip } from '../utils/dragUtils';
import { dragcomponentsB } from '../config/constant';


const style = {
  height: '16rem',
  marginRight: '2%',
  marginLeft: '2%',
  marginBottom: '1rem',
  color: '#999',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: '15rem',
  float: 'left',
};
const bdustbinSource = {
  beginDrag(props) {
    const { id, index } = props;
    return {
      id, index,
    };
  },
};
const bdustbinTarget = {
  drop(props, monitor) {
    const { onDrop, index, moveDustbin } = props;
    onDrop(monitor.getItem());
  },
  canDrop(props, monitor) {
    const { lastDroppedItem = false } = props;
    return !lastDroppedItem;
  },
};


/* eslint-disable   react/destructuring-assignment */
@DropTarget(props => props.accepts, bdustbinTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
@DragSource(ItemTypes.AWORKBENCH, bdustbinSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  // dragDustbin: monitor.getItem(),
}))

/* eslint-disable   react/no-unused-prop-types */
export default class Bdustbin extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    lastDroppedItem: PropTypes.object,
    onDrop: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  static defaultProps ={
    lastDroppedItem: null,

  }

  constructor(props) {
    super(props);
    const { nsize } = this.props;
    this.state = {
      newStyle: style,
      width: nsize == '3' ? '96%' : nsize == '2' ? '62.6%' : '29.3%',
      nsize,
    };
  }


  deleteBWorkbench = () => {
    const { onBboxDeleteCallback, index, lastDroppedItem } = this.props;
    onBboxDeleteCallback(index, lastDroppedItem);
  };

  /* eslint-disable react/no-access-state-in-setstate */
  BWorkbenchRight = () => {
    const { onSizeCallBack, index } = this.props;
    const { width } = this.state;
    if (width == '29.3%') {
      this.setState({
        width: '62.6%',
        nsize: '2',
      });
      onSizeCallBack(index, 2);
    } else {
      this.setState({
        nsize: '3',
        width: '96%',
      });
      onSizeCallBack(index, 3);
    }
  };

  BWorkbenchLeft = () => {
    const { onSizeCallBack, index } = this.props;
    const { width } = this.state;
    if (width == '96%') {
      this.setState({
        nsize: '2',
        width: '62.6%',
      });
      onSizeCallBack(index, 2);
    } else {
      this.setState({
        nsize: '1',
        width: '29.3%',
      });
      onSizeCallBack(index, 1);
    }
  };

  render() {
    const {
      isOver,
      canDrop,
      isDragging,
      connectDropTarget,
      lastDroppedItem,
      index,
    } = this.props;
    const { width, newStyle, nsize } = this.state;
    const opacity = isDragging ? 0 : 1;
    const backgroundColor = getBackgroundColor(isOver, canDrop);

    let DragComponent = null;
    if (lastDroppedItem) {
      DragComponent = dragcomponentsB[lastDroppedItem];
    }
    return connectDropTarget(
      <div>
        <div style={{ ...newStyle, backgroundColor, opacity, width }}>
          <Tooltip title="增加一列">
            <Icon
              type={nsize == '3' ? 'right-circle-o' : 'right-circle'}
              style={{ float: 'right', width: '10px', height: '10px' }}
              onClick={this.BWorkbenchRight}
            />
          </Tooltip>
          {lastDroppedItem == null ? (
            ''
          ) : (
            <Tooltip title="删除">
              <Icon
                type="minus-circle"
                style={{ float: 'right', width: '10px', height: '10px', marginRight: '15px' }}
                onClick={this.deleteBWorkbench}
              />
            </Tooltip>
          )}
          <Tooltip title="减少一列">
            <Icon
              type={nsize == '1' ? 'left-circle-o' : 'left-circle'}
              style={{ float: 'right', width: '10px', height: '10px', marginRight: '15px' }}
              onClick={this.BWorkbenchLeft}
            />
          </Tooltip>
          {getContainerTip(isOver, canDrop, lastDroppedItem, 'B区域请添加')}
          {lastDroppedItem && (
            <div style={{ marginTop: '20px' }}>
              <DragComponent bigStyle="small" width={width} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
