/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import videoOnMap from './HiVideoOnMap.html';

let onReady = null;
let videoUniqueID = null;
const onVideoReadyObj = {};
window.onvideoloadOnMap = function onvideoloadOnMap(vid) {
  if (typeof vid === 'undefined') {
    onReady(window.videoOnMapFrm.contentWindow.videoOnMap);
  } else {
    onVideoReadyObj[vid](window[vid].contentWindow.videoOnMap);
  }
};

class HiVideoOnMap extends Component {
  componentDidMount() {
    const { videoid, onready } = this.props;
    videoUniqueID = videoid ||'videoOnMapFrm';
    onReady = onready;
    onVideoReadyObj[videoUniqueID] = onready;// 父组件传入的
  }

  render() {
    const { myStyle, ifmStyle, videoid } = this.props;
    const vid = videoid ||'videoOnMapFrm';
    // let ifmStyle = this.props.ifmStyle;
    const videomyStyle = myStyle || {
      width: '100%',
      height: '100%',
      // position: 'absolute',
      top: 0,
    };
    const videoifmStyle = ifmStyle || {
      width: '100%',
      height: '100%',
      // position: 'absolute',
      top: '0px',
      left: '0px',
    };
    const renderHTML = (
      <iframe
        src={`${videoOnMap}?vid=${vid}`}
        title={`${vid}`}
        style={videoifmStyle}
        ref={(videoOnMapFrm) => { window[vid] = videoOnMapFrm; }}
      />
    );
    return (<div style={videomyStyle}>{renderHTML}</div>);
  }
}

HiVideoOnMap.propTypes = {
  // vodeopid: 'videoOnMapFrm',
  // onready: PropTypes.func.isRequired, // 回调函数，返回_MapApp对象
};

HiVideoOnMap.defaultProps = {
  // vodeopid: 'videoOnMapFrm',
};
export default HiVideoOnMap;
