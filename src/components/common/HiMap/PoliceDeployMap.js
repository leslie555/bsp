import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'antd';
import { position, offset } from 'utils/domOper';
import pgis from './pgis.html';
import arcgis from './arcgis.html';
import arcgisDark from './arcgisDark.html';
import { maxOrReduceVideoDiv, closeVideoDiv, closeMsgDiv } from './dtpms/msgtomds';
import {
  openVideo,
  openAudio,
  sendCaseToApp,
  showSendMsgAppDiv,
  policeDeployMapinit,
  msgFocus,
  msgBlur,
  sendMsg,
} from './dtpms/expert';
import styles from './PoliceDeployMap.less';

const R = require('ramda');

let onreadyL = null;
const onmaploadMap = {};

let policeDeployMap = false;

/* eslint-disable   no-underscore-dangle */
/* eslint-disable   jsx-a11y/label-has-for */
window.onmapload = function onmapload(mid) {
  if (typeof mid === 'undefined') {
    policeDeployMap = window.mapfrm1.contentWindow._MapApp;
    window.policeDeployMap = policeDeployMap;
    window.openVideo = R.curry(openVideo)(R.__, R.__, R.__, R.__, policeDeployMap);
    window.openAudio = R.curry(openAudio)(R.__, R.__, R.__, R.__, policeDeployMap);
    onreadyL(policeDeployMap);
  } else {
    policeDeployMap = window[mid].contentWindow._MapApp;
    window.policeDeployMap = policeDeployMap;
    window.openVideo = R.curry(openVideo)(R.__, R.__, R.__, R.__, policeDeployMap);
    window.openAudio = R.curry(openAudio)(R.__, R.__, R.__, R.__, policeDeployMap);
    onmaploadMap[mid](window[mid].contentWindow._MapApp);
  }
};

class HiMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { onchange, onready, mapid } = this.props;
    onmaploadMap[mapid] = onready;
    onreadyL = onready;
    window.sendCaseToApp = sendCaseToApp;
    window.showSendMsgAppDiv = showSendMsgAppDiv;
    window.maxOrReduceVideoDiv = maxOrReduceVideoDiv;
    window.closeVideoDiv = closeVideoDiv;
  }

  render() {
    const { maptype, mapid: mid } = this.props;
    let { myStyle, ifmStyle } = this.props;

    myStyle = myStyle || {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
    };
    ifmStyle = ifmStyle || {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0px',
      left: '0px',
    };

    let ifmsrc = pgis;
    switch (maptype) {
      case 'pgis':
        ifmsrc = pgis;
        break;
      case 'arcgis':
        ifmsrc = arcgis;
        break;
      case 'arcgisDark':
        ifmsrc = arcgisDark;
        break;
      default:
        ifmsrc = arcgis;
    }

    const renderHTML = (
      <iframe
        src={`${ifmsrc}?mid=${mid}`}
        style={ifmStyle}
        ref={mapfrm1 => {
          window[mid] = mapfrm1;
        }}
        id="mapIframe"
        title="mapIframe"
      />
    );
    return (
      <div id="_HiMapDiv" style={{ height: '100%' }}>
        <div id="mapdiv1" style={myStyle}>
          {renderHTML}
        </div>
        <div id="msgDiv" className={styles.msgbody}>
          <div className={styles.msgcontent}>
            <table>
              <tr style={{ height: '22%' }}>
                <td className={styles.receiver}>收件人&nbsp;&nbsp;</td>
                <td>
                  <div className={styles.receivelabel}>
                    {/* <label id="receiveMsgPerson" /> */}
                  </div>
                </td>
              </tr>
              <tr style={{ height: '77%' }}>
                <td className={styles.info}>
                  <div style={{ marginTop: '10px' }}>短信内容&nbsp;&nbsp;</div>
                </td>
                <td>
                  <textarea
                    id="msg"
                    rows="6"
                    style={{ width: '250px', color: 'blue' }}
                    onFocus={msgFocus}
                    onBlur={msgBlur}
                    /* onKeyUp="validateMsg()"
                    onKeyDown="validateMsg()"
                    onPaste="validateMsg()" */
                  />
                </td>
              </tr>
            </table>
          </div>
          <div className={styles.oper}>
            <input
              type="button"
              id="sendSmsId"
              value="发送"
              onClick={sendMsg}
              className={styles.send}
            />&nbsp;&nbsp;
            <input type="button" value="关闭" onClick={closeMsgDiv} className={styles.send} />
          </div>
        </div>
      </div>
    );
  }
}

HiMap.propTypes = {
  mapid: PropTypes.string,
  maptype: PropTypes.string, // 地图类型，如:'pgis' 、 'arcgis'
  onready: PropTypes.func.isRequired, // 回调函数，返回_MapApp对象
  onchange: PropTypes.func.isRequired, // 回调函数
};

HiMap.defaultProps = {
  mapid: 'mapfrm1',
  maptype: 'arcgis',
};
export default HiMap;
export { policeDeployMapinit };
