/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'antd';
import pgis from './pgis.html';
import arcgis from './arcgis.html';
import arcgisDark from './arcgisDark.html';

import HiVideoOnMap from './HiVideoOnMap';


const onready = null;
const popvisible = false;
let videoflag = 0;
let videoUrl = '';
let isActiveObject = false;

let mapUniqueID = null;
let onmaploadMap = {};
let videoObj = {};

window.onmapload = function onmapload(mid) {
  if (typeof mid === 'undefined') {
    videoUrl = window.mapfrm.contentWindow._MapApp.mapConfig.viderService;
    onready(window.mapfrm.contentWindow._MapApp);
  } else {
    videoUrl = window[mid].contentWindow._MapApp.mapConfig.viderService;
    onmaploadMap[mid](window[mid].contentWindow._MapApp);
  }
};


class HiMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myVideo: {},
      preset: props.preset || [],
      yuntai: 0,
      presentptz: 0,
    };
    window.playVideoFromPop = this.playVideoFromPop.bind(this);
    this.onVideoReady = this.onVideoReady.bind(this);
  }

  componentDidMount() {
    const { mapid, onready, onvideoclick } = this.props;
    mapUniqueID = mapid === null ? 'mapfrm' : mapid;
    onmaploadMap[mapUniqueID] = onready;
    this.dragvideoDivOnMap();
  }

  playVideoFromPop(obj) {
    const thirdcode = obj.thirdsyscode;
    const deviceid = obj.deviceid;
    /* document.getElementById("_playVideoFromPop").style.display = '';
     let videoWindowWidth = document.getElementById("_HiMapDiv").offsetWidth ;
     document.getElementById("_playVideoFromPop").style.left = (videoWindowWidth-630)/2+'px';
 */
    if (!isActiveObject) {
      if (!(!!window.ActiveXObject || 'ActiveXObject' in window)) {
        alert('请用IE浏览器打开，并确认已经安装视频控件');
        return;
      }
      try {
        const myreadreg = new ActiveXObject('WScript.shell');
        const CurrentVersion = myreadreg.RegRead('HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\海信网络视频监控-通用视频控件\\DisplayVersion');
        console.log(CurrentVersion);
      } catch (e) {
        alert('请用安装视频控件');
        return;
      }
    }
    isActiveObject = true;
    document.getElementById("_playVideoFromPop").style.display = '';
    if (videoflag === 0 && this.state.myVideo.login) {
      this.state.myVideo.login(videoUrl, (params) => {
        if (params === 'success') {
          this.state.myVideo.SetLayout1();
          this.state.myVideo.playOne(thirdcode);
          videoflag += 1;
          let videoWindowWidth = document.getElementById("_HiMapDiv").offsetWidth;
          document.getElementById("_playVideoFromPop").style.left = (videoWindowWidth - 630) / 2 + 'px';
        } else {
          console.log('初始化失败');
        }
      });
    } else {
      this.state.myVideo.playOne(thirdcode);
    }
  }

  onVideoReady(video) {
    const { mapid } = this.props;
    const mid = mapid === null ? 'mapfrm' : mapid;
    videoObj[mid] = video;
    this.setState({ myVideo: video });

  }

  dragvideoDivOnMap() {
    let videoDivOnMap = document.getElementById("_playVideoFromPop");

    //以下部分实现弹出层的拖拽效果
    let posX = 0;
    let posY = 0;
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    let isChrome = userAgent.indexOf("Chrome") > -1;//是否chrome

    //鼠标按下响应方法
    videoDivOnMap.onmousedown = (e) => {
      if (isChrome) {
        posX = e.screenX - parseInt(videoDivOnMap.offsetLeft);
        posY = e.screenY - parseInt(videoDivOnMap.offsetTop);
      }
      else {
        //设置捕获范围
        if (videoDivOnMap.setCapture) {
          videoDivOnMap.setCapture();
        } else if (window.captureEvents) {
          window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        }

        posX = e.clientX - parseInt(videoDivOnMap.offsetLeft);
        posY = e.clientY - parseInt(videoDivOnMap.offsetTop);
      }

      window.document.onmousemove = (ev) => {
        if (isChrome) {
          videoDivOnMap.style.left = (ev.screenX - posX) + "px";
          videoDivOnMap.style.top = (ev.screenY - posY) + "px";
        }
        else {
          videoDivOnMap.style.left = (ev.clientX - posX) + "px";
          videoDivOnMap.style.top = (ev.clientY - posY) + "px";
        }
      };
    };

    //鼠标弹起响应方法
    window.document.onmouseup = () => {
      window.document.onmousemove = null;
      if (!isChrome) {
        if (videoDivOnMap.releaseCapture) {
          videoDivOnMap.releaseCapture();
        } else if (window.captureEvents) {
          videoDivOnMap.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        }
      }
    };
  }


  render() {
    const { maptype, myStyle, ifmStyle, mapid } = this.props;

    const mid = mapid === null ? 'mapfrm' : mapid;

    const mapmyStyle = myStyle || {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
    };
    const mapifmStyle = ifmStyle || {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0px',
      left: '0px',
      border: '0px',
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

    const renderHTML = (<iframe
      src={`${ifmsrc}?mid=${mid}`}
      style={mapifmStyle}
      title={`${mid}`}
      ref={(mapfrm) => { window[mid] = mapfrm; }}
      id="mapIframe"
    />
    );
    return (
      <div id="_HiMapDiv" style={{ height: '100%' }}>
        <div id="mapdiv" style={mapmyStyle}>{renderHTML}</div>
        <div
          id="_playVideoFromPop"
          style={{ display: 'none', position: 'absolute', top: '20%', left: '25%', width: '630px', height: '390px', backgroundColor: 'white', zIndex: '999' }}
        >
          <div style={{ height: '38px', backgroundColor: '#487AC3', position: 'relative' }}>
            <Icon
              type="close"
              style={{ color: 'white', position: 'absolute', right: '10px', top: '15px', cursor: 'pointer' }}
              onClick={() => { document.getElementById('_playVideoFromPop').style.display = 'none'; videoObj[mid].stopOne(); }}
            />
          </div>
          <div style={{ backgroundColor: '#000000', height: '100%', position: 'relative' }}>
            <HiVideoOnMap
              onready={this.onVideoReady}
            />
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
};

HiMap.defaultProps = {
  mapid: 'mapfrm',
  maptype: 'arcgis',
};
export default HiMap;
