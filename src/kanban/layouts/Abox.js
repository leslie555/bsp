/**
 * Created by Administrator on 2017/12/15 0015.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

const style = {
  fontSize: '10px',
  borderBottom: '1px solid gray',
  paddingTop: '0.5rem',
  paddingBottom: '0.2rem',
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  marginRight: '1rem',
  marginLeft: '1rem',
  marginTop: '0.4rem',
  marginBottom: '0.4rem',
  cursor: 'move',
};

const boxSource = {
  beginDrag(props) {
    /* return {
      ChartId: props.ChartId,
      componentName: props.componentName,
      name: props.name,
      nsize: props.nsize,
      type: props.type,
      position: props.position,
    }; */
    return ({ ...props });
  },
};
/* eslint-disable   react/destructuring-assignment */
@DragSource(props => props.type, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Abox extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    isDropped: PropTypes.bool.isRequired,
  }

  render() {
    const { name, isDropped, isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    return (isDragging || isDropped ? '' : connectDragSource(
      <div style={{ ...style, opacity }}>
        {name}
      </div>)
    );
  }
}
