import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Table, Modal, Input, Button, Row, Col, Icon } from 'antd';
import { Link, routerRedux, Route, Switch, Redirect } from 'dva/router';
import { PoliceDeployMap, policeDeployMapinit } from '../../components/common/HiMap';
import ScsLine, { Line } from '../../components/policeDeploy/PointLine';
import AlertMapLayer from '../../components/policeDeploy/AlertMapLayer';
import { getPoliceInfoHtml } from '../../components/policeDeploy/PointLineUtils';
// import { elementDrag } from '../../utils/elementDrag';
import styles from './BaseInfo.less';
/* eslint-disable   react/destructuring-assignment */
const barrage = null;
let currentPoliceList = [];
const testpoliceslist = [
  {
    positiontypename: 'GPS',
    deptid: '370200T00000',
    policename: '高哥',
    deptshortname: 'xx部门',
    usercard: '006614',
    devicetypebig: '6',
    decarlong: '120.310539',
    decarlat: '36.066817',
    positiontype: '1',
    policeid: '3702000',
  },
  {
    positiontypename: 'GPS',
    deptid: '370200T00000',
    policename: '孙建利',
    deptshortname: 'xx部门',
    usercard: '006613',
    devicetypebig: '6',
    decarlong: '120.331631',
    decarlat: '36.102179',
    positiontype: '1',
    policeid: '37020000',
  },
  {
    positiontypename: 'GPS',
    deptid: '370200050800',
    policename: '祖军',
    deptshortname: 'xx部门',
    usercard: '17726',
    devicetypebig: '6',
    decarlong: '120.379600',
    decarlat: '36.064038',
    positiontype: '1',
    policeid: '37020000',
  },
];
class BaseInfo extends Component {
  static contextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      ifMapReady: false,
      policeForces: false, // 警力标志位
      videoDisplay: true,
      videoFull: false,
    };

    this.onreadyhandler = this.onreadyhandler.bind(this);
  }

  componentDidMount() {
    // barrage = new Line();
    // barrage.show(40, 400, {});
    // elementDrag('taskVideoDiv', '0px', '0px');
  }

  onreadyhandler(_MapApp) {
    this.setState({
      ifMapReady: true,
    });
  }

  onChangeMapLayer = (data, e) => {
    if (data == '警力') {
      this.setState({ policeForces: e });
      if (!e) {
        for (const policelist of currentPoliceList) {
          window.trafficMap.removeMonitor(policelist);
        }
        currentPoliceList = [];
      } else {
        for (const policelist of currentPoliceList) {
          window.trafficMap.removeMonitor(policelist);
        }
        currentPoliceList = [];

        const policeList = testpoliceslist;
        if (policeList.length > 0) {
          for (let l = 0; l < policeList.length; l += 1) {
            const police = policeList[l];
            if (police.phone == null || police.phone == '') {
              police.phone = '--';
            }
            police.imgurl = require('../../assets/gpspolice/gpspolice.png');
            police.width = 30;
            police.height = 50;
            police.showtitle = true;
            police.centable = false;
            police.title = police.policename;
            police.strcoords = `${police.decarlong},${police.decarlat}`;
            police.infohtml = getPoliceInfoHtml(police, window.trafficMap);
            currentPoliceList.push(window.trafficMap.showMonitor(police));
          }
        }
      }
    }
  };

  onmapready = _MapApp => {
    this.setState({});
    window.MyMapApp = _MapApp;
    window.trafficMap = _MapApp; // 路况的
    console.log(_MapApp);
    this.onreadyhandler();
    this.onChangeMapLayer('警力', true);
    policeDeployMapinit();
  };

  render() {
    const mapProps = {
      onready: this.onmapready,
      visible: false,
      maptype: 'arcgisDark',
      ifmStyle: {
        border: 'none',
        width: '100%',
        height: '99%',
      },
      myStyle: {
        width: '100%',
        height: '99%',
        position: 'absolute',
        top: 0,
        background: 'radial-gradient(#0A2656 20%, #081F4C 45%, #020A2C 80%)',
      },
    };

    const { match, routerData, location } = this.props;
    const { policeForces } = this.state;
    const { breadcrumbNameMap } = this.context;
    const baseComponent = breadcrumbNameMap.filter(x => x.path == match.path)[0];
    const { ifMapReady } = this.state;
    return (
      <div className={styles.normal}>
        <div className={styles.content}>
          <div
            style={{
              minHeight: '100px',
              width: '400',
              position: 'absolute',
              left: '0px',
            }}
          >
            {ifMapReady && (
              <Switch>
                {baseComponent.children.map(item => (
                  <Route
                    key={item.key}
                    path={`${match.path}/${item.path}`}
                    component={item.component}
                    exact
                  />
                ))}

                <Redirect exact from="/view/police" to="/view/police/station" />
              </Switch>
            )}
          </div>

          <div style={{ width: '100%', height: '100%' }}>
            {/*       <HiMap
              {...{
                maptype: 'arcgisDark',
                ifmStyle: { width: '100%', height: '100%' },
                myStyle: {
                  width: '100%',
                  height: '100%',

                  top: '60px',
                  zIndex: '1',
                  background: 'radial-gradient(#0A2656 20%, #081F4C 45%, #020A2C 80%)',
                },
              }}
              onready={_MapApp => {
                window.trafficMap = _MapApp;
                this.onreadyhandler();
              }}
            /> */}
            <PoliceDeployMap {...mapProps} />
            <div
              id="taskVideoDiv"
              className={this.state.videoFull ? styles.taskVideoFull : styles.taskVideo}
              style={{ display: this.state.videoDisplay ? 'block' : 'none' }}
            >
              <div className={styles.taskVideoCloseBtn}>
                <Switch
                  defaultChecked
                  style={{ float: 'left', cursor: 'pointer', display: 'block' }}
                  onChange={checked => {
                    this.ifShowAr(checked);
                  }}
                />
                <div style={{ float: 'left', fontSize: '14px', display: 'block' }}>AR标签</div>
                <Icon
                  type={!this.state.videoFull ? 'up-square-o' : 'down-square-o'}
                  onClick={e => {
                    if (e.preventDefault) {
                      e.stopPropagation();
                    } else {
                      e.cancelBubble = true;
                    }
                    this.setState(
                      prevState => ({
                        videoFull: !prevState.videoFull,
                      }),
                      () => {
                        const dragDiv = document.getElementById('taskVideoDiv');
                        if (this.state.videoFull) {
                          dragDiv.style.left = '20px';
                          dragDiv.style.top = '10px';
                        } else {
                          dragDiv.style.left = '0px';
                          dragDiv.style.top = '0px';
                        }
                      }
                    );
                  }}
                />
                <Icon
                  type="close"
                  onClick={() => {
                    if (this.videoTimeInterval) {
                      window.clearInterval(this.videoTimeInterval);
                      this.videoTimeInterval = null;
                    }
                    this.setState({
                      videoDisplay: false,
                    });
                  }}
                />
              </div>
            </div>

            <div style={{ position: 'absolute', width: 160, top: 15, right: 20, zIndex: 99 }}>
              <AlertMapLayer onChange={this.onChangeMapLayer} policeForces />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(BaseInfo);
