/* eslint no-underscore-dangle: 0 */
import { connect } from 'dva';
import React from 'react';
import moment from 'moment';
import { uniqBy } from 'lodash';
// import { createForm } from 'rc-form';
// import Button from '@material-ui/core/Button';
// import DatePicker, { registerLocale } from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import zhCN from 'date-fns/locale/zh-CN';
import { Form, message, Row, Col, Input, Modal, Tooltip, Tabs, Button, Icon, Table, Radio, DatePicker } from 'antd';
import HiMap from '../../components/common/HiMap/HiMap';
import HiatmpAuthorized from '../../components/Authorized/HiatmpAuthorized';
import { OCT_DEVICE_ADDNEW } from '../../config/authconstant';
import styles from '../../components/DictionaryManage/DictionaryInfo.less';
import { downloadPic } from '../../services/octRoadSection';
import { getRoadInfo, queryDevices } from '../../services/octGIS';

// registerLocale('zh-CN', zhCN);
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { confirm } = Modal;
const { TabPane } = Tabs;
let Car = null;
let allList = [];
function callback(strcoords) {
  alert(strcoords);
}
// let oldMarker = null;
let displayMarker = [];
let prevDeviceList = null;
let LayerNew = null; // 新增加的路网图层
let myCar;
let carPlayOldIndex = null;
// 车辆数组
let plateArr = [];

function disabledDate(current) {
  return current > moment();
}

function clearMap(themap) {
  themap.clear();
  themap.clearOverlays();
  themap.closeInfoWindow();
}
function firstLoadMarker(themap, theData) {

}

class GisTrackReplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devicelist: null,
      plateNo: '',
      startTime: moment().startOf('day'),
      endTime: moment().endOf('day'),
      queryobj: {},
      // timeValue: [moment().startOf('day'), moment().endOf('day')],
      pause: false,
      radioValue: 2,
      isloading: false,
      rowSelectedIndex: null,
      // selectedLongitude: null,
      // selectedLatitude: null,
      // markers: null,
      choseCar: false,
      map: null,
      visible: false,
      visiblePic: false,
      deviceUrl: [],
      loadingDevice: true,
      info: null,
    };
    this.onmapready = this.onmapready.bind(this);
  }

  componentWillReceiveProps = (nextProps) => {
    const { isloading } = this.state;
    this.setState({ devicelist: nextProps.propsdevicelist, isloading: nextProps.loading });
    // 获取每个车牌号数组(不知道怎么根据两个字段去重)
    plateArr = uniqBy(nextProps.propsdevicelist, 'plateno');
    allList = nextProps.propsdevicelist;
  }

  // 清除所有marker
  onClearMarker = () => {
    const { map } = this.state;
    displayMarker.forEach(v => {
      if (v != null) {
        map.removeMonitor(v);
      }
    });
    displayMarker = [];
  }

  // 批量导出
  onDownload = (record) => {
    const { devicelist, queryobj } = this.state;
    const formElement = document.createElement('form');
    formElement.style.display = 'display:none;';
    formElement.method = 'post';
    formElement.action = '/HiatmpPro/bsp/vehiclerecord/downloadFile';
    formElement.target = 'callBackTarget';
    const inputElement = document.createElement('input');
    inputElement.type = 'hidden';
    inputElement.name = 'params';
    inputElement.value = JSON.stringify(queryobj);
    formElement.appendChild(inputElement);
    document.body.appendChild(formElement);
    if (devicelist.length < 1000) {
      formElement.submit();
      document.body.removeChild(formElement);
    } else if (devicelist.length < 100000) {
      confirm({
        title: '导出确认',
        content: '由于数据量很大导出需要一定时间，确认导出？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          formElement.submit();
          document.body.removeChild(formElement);
        },
        onCancel() {
          // alert('操作取消');
        },
      });
    } else {
      message.warning('数据大于100000条,禁止导出');
    }
  }

  // 点击url下载图片
  onDownloadPic = (record) => {
    const { devicelist, queryobj } = this.state;
    // OLD
    // console.log(searchprops.queryobj);
    // const formElement = document.createElement('form');
    // formElement.style.display = 'display:none;';
    // formElement.method = 'post';
    // formElement.action = '/HiatmpPro/bsp/vehiclerecord/downloadFilePic';
    // formElement.target = 'callBackTarget';
    // const inputElement = document.createElement('input');
    // inputElement.type = 'hidden';
    // inputElement.name = 'params';
    // inputElement.value = JSON.stringify(searchprops.queryobj);
    // formElement.appendChild(inputElement);
    // document.body.appendChild(formElement);
    // if (pagination.total < 1000) {
    //   formElement.submit();
    //   document.body.removeChild(formElement);
    // } else if (pagination.total < 100000) {
    //   confirm({
    //     title: '导出确认',
    //     content: '由于数据量很大导出需要一定时间，确认导出？',
    //     okText: '确定',
    //     cancelText: '取消',
    //     onOk() {
    //       formElement.submit();
    //       document.body.removeChild(formElement);
    //     },
    //     onCancel() {
    //       // alert('操作取消');
    //     },
    //   });
    // } else {
    //   message.warning('数据大于100000条,禁止导出');
    // }
    // OLD至此
    const that = this;
    if ((devicelist || []).length < 100000) {
      confirm({
        title: '导出确认',
        content: '由于数据量很大导出需要一定时间，确认导出？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          // formElement.submit();
          // document.body.removeChild(formElement);
          that.setState({
            visiblePic: true,
            loadingDevice: true,
          });
          const picqueryobj = {
            ...queryobj,
            type: 'guiji',
            carType: '',
            carcolor: '',
            deviceID: '',
            lane_no: '',
            ori_plate_color: '',
            forroad: '',
          };
          downloadPic(picqueryobj).then((r) => {
            // debugger;
            if (r.result) {
              that.setState({
                deviceUrl: r.list,
                visiblePic: true,
                loadingDevice: false,
              });
            }
          }).catch((e) => {
          });
        },
        onCancel() {
          // alert('操作取消');
        },
      });
    } else {
      message.warning('数据大于100000条,禁止导出');
    }
  }

  onMapChange = () => {
    const { map } = this.state;
    if (map.getZoomLevel() == map.getMaxLevel()) {
      if (!LayerNew) {
        const mapurlRoad = 'http://20.5.11.12/arcgis/rest/services/cd_road_84/MapServer';
        // LayerNew = new esri.layers.ArcGISDynamicMapServiceLayer(mapurl_road);
        // map.map.addLayer(LayerNew);
        // alert('加载新图层啦！');
      }
    } else if (LayerNew) {
      map.map.removeLayer(LayerNew);
      LayerNew = null;
    }
  };

  // 地图加载完后会调用onmapready方法
  onmapready = (_MapApp) => {
    this.setState({
      map: _MapApp,
    });
    const { markers } = this.state;
    const { lat, lng, text, desc } = this.props;
    setTimeout(() => {
      this.setState({
        map: _MapApp,
      });
      _MapApp.addMapChangeListener(this.onMapChange);
    }, 500);
  };

  handleClear = () => {
    const { map, choseCar } = this.state;
    if (Car) {
      Car.clear();
    }
    this.setState({ choseCar: false, pause: false });
    this.onClearMarker();
    clearMap(map);
    // Car.start();
  }

  // 轨迹函数
  showRoute = (startupPosition, allPosition, plateNo, times) => {
    const { map } = this.state;
    // console.log('mappppp', map);
    const monitor = map.showMonitor({
      strcoords: startupPosition,
      title: plateNo,
      // imgurl: myCar.indexOf('小') > -1 ? '/HiatmpPro/assets/gis/car.png' : '',
      imgurl: '/HiatmpPro/assets/gis/car.png',
      width: 24,
      height: 24,
      infowindow: 'infowindow',
      centable: true,
      titlebgcolor: null,
      showtitle: true,
      titlecolor: null,
    });
    let preangle = 0;
    const srccoords = allPosition;
    Car = new map.TrackPlay(map, monitor, srccoords, {
      smoothmove: true,
      showtrack: true,
      timeInterval: 50,
      stepdistance: 0.0005,
      times,
      callbackEND: (obj) => {
        const nowMarker = displayMarker[displayMarker.length - 1];
        // console.log('nowMarkerEnd', nowMarker);

        nowMarker.changeImg('/HiatmpPro/assets/gis/track_red.png', 30, 30);
        displayMarker[carPlayOldIndex].changeImg('/HiatmpPro/assets/gis/track_blue.png', 30, 30);
        if (!nowMarker.ljf.titleShown) {
          nowMarker.showTitle();
          nowMarker.ljf.titleShown = true;
        }
        // for (let i = 0; i < nowMarker.clickFunc.length; i += 1) {
        //   if (nowMarker.clickFunc[i]) {
        //     nowMarker.clickFunc[i].call();
        //   }
        // }
        setTimeout(() => {
          this.setState({ rowSelectedIndex: -1 });
          nowMarker.changeImg('/HiatmpPro/assets/gis/track_blue.png', 30, 30);
          carPlayOldIndex = null;
          map.closeInfoWindow();
          message.info('轨迹播放完毕');
        }, 1000);
      },
      callback: (obj) => {
        if (obj.isnode == true && typeof (obj.angle) != 'undefined') { // 节点处调整车头方向
          const angle = -obj.angle;
          if (angle == preangle) {
            return;
          }
          // 设置marker
          const nowMarker = displayMarker[obj.currstep - 1];
          // console.log('nowmarker', nowMarker, typeof (nowMarker));
          nowMarker.changeImg('/HiatmpPro/assets/gis/track_red.png', 30, 30);
          if (!nowMarker.ljf.titleShown) {
            nowMarker.showTitle();
            nowMarker.ljf.titleShown = true;
          }
          if (carPlayOldIndex != null) {
            displayMarker[carPlayOldIndex].changeImg('/HiatmpPro/assets/gis/track_blue.png', 30, 30);
          }
          carPlayOldIndex = obj.currstep - 1;


          // 计算弹窗位置：左或者右
          let direction = 'upperright';
          if (obj.angle <= 90 || obj.angle >= 270) {
            direction = 'upperleft';
          }
          // 重新设置marker点击事件
          nowMarker.clickFunc = [];
          nowMarker.clickFunc.push(() => {
            const html =
              `<div>
                <p>设备编号: ${nowMarker.ljf.deviceid}</p>
                <p>设备位置: ${nowMarker.ljf.cap_address} </p>
                <p>拍摄时间: ${nowMarker.ljf.dcollectiondate}</p>
                <p>设备经纬度: ${nowMarker.params.strcoords}</p>
                <div><img src=${nowMarker.ljf.pic1_path}  width='200px' onclick='window.open(this.src);' /></div>
              </div>`;
            this.setState({ rowSelectedIndex: nowMarker.ljf.index });
            map.openInfoWindowEx(nowMarker.params.strcoords, html, `设备编号：${nowMarker.ljf.deviceid}`, direction);
          });
          // 模拟点击，目前需求不需要在播放轨迹的时候显示弹窗了
          // for (let i = 0; i < nowMarker.clickFunc.length; i += 1) {
          //   console.log('nnnnnnnnn', nowMarker.clickFunc.length);
          //   if (nowMarker.clickFunc[i]) {
          //     nowMarker.clickFunc[i].call();
          //   }
          // }

          const a = angle - preangle;
          let count = 0;
          const carRotate = (i) => { Car.marker.rotate(i); };
          if (a > 0) {
            for (let i = preangle; i <= angle; i += 0.5) {
              count += 1;
              // (function (i, count) {
              //   setTimeout(function () {
              //     Car.marker.rotate(i);
              //   }, count);
              // })(i, count);
              setTimeout(carRotate(i), count);
            }
          } else {
            for (let i = preangle; i >= angle; i -= 0.5) {
              count += 1;
              // (function (i, count) {
              //   setTimeout(()=> {
              //     Car.marker.rotate(i);
              //   }, count);
              // })(i, count);
              // (i,count)=>{
              setTimeout(carRotate(i), count);
              // }
            }
          }
          preangle = angle;
        }
      },
    });
    // console.log(Car);
    setTimeout(() => {
      Car.clear();
      Car.play();
      // map.TrackPlay.prototype.play(100);
      // console.log(map.TrackPlay);
    }, 1000);
  }

  // 点击播放轨迹按钮播放轨迹
  carTrackPlay = () => {
    const { plateNo, devicelist, map } = this.state;
    if (Car) { Car.clear(); }
    this.showDevicelist();
    // clearMap(map);
    // this.onClearMarker();
    const allPositionArr = [];
    const timesArr = [];
    let startupPosition;
    for (let i = 0; i < devicelist.length; i += 1) {
      allPositionArr.push(`${devicelist[i].longitude} , ${devicelist[i].latitude}`);
      timesArr.push(devicelist[i].cap_address);
      if (i == 0) {
        startupPosition = `${devicelist[i].longitude} , ${devicelist[i].latitude}`;
      }
    }
    const allPosition = allPositionArr.join(',');
    const timesString = timesArr.join(',');
    this.showRoute(startupPosition, allPosition, plateNo, timesString);
  }

  // 选车函数
  chooseCar = (e) => {
    // const { devicelist } = this.state;
    myCar = e.target.innerText;
    const myCarList = (allList || []).filter(item => item.plateno == myCar);
    this.setState({ devicelist: myCarList, choseCar: true }, this.showDevicelist);
    setTimeout(this.carTrackPlay, 0);
    // if (e.target.id == 'little') {
    //   carType = 'littleCar';
    //   this.setState({ devicelist: little, choseCar: true }, this.showDevicelist);
    //   setTimeout(this.carTrackPlay, 0);
    // } else if (e.target.id == 'big') {
    //   // this.showDevicelist;
    //   carType = 'bigCar';
    //   this.setState({ devicelist: big, choseCar: true }, this.showDevicelist);
    //   setTimeout(this.carTrackPlay, 0);
    // }
  }

  // 描点函数
  showDevicelist = () => {
    const { map, devicelist } = this.state;
    clearMap(map);
    prevDeviceList = devicelist;
    this.onClearMarker();
    const ddd = [];
    devicelist.forEach(ea => {
      if (ea.latitude != null && ea.longitude != null) {
        ddd.push(ea);
      }
    });
    if (ddd.length > 0) {
      map.Tools.largeArrayProcess(ddd, (devices) => {
        for (let i = 0; i < devices.length; i += 1) {
          if (devices[i].latitude != null && devices[i].longitude != null) {
            const strPosition = `${devices[i].longitude},${devices[i].latitude}`;
            const m = map.showMonitor({
              strcoords: strPosition,
              imgurl: '/HiatmpPro/assets/gis/null.png',
              width: 30,
              height: 30,
              title: `${i + 1}`,
              titlecolor: '#FFF',
              titleOffsetY: 24,
              fontsize: 12,
              showtitle: true,
            });
            m.hideTitle();
            m.ljf = {
              deviceid: devices[i].deviceid,
              cap_address: devices[i].cap_address,
              dcollectiondate: devices[i].dcollectiondate,
              pic1_path: devices[i].pic1_path,
              index: i,
              titleShown: false,
            };
            m.clickFunc.push(() => {
              const html =
                `<div>
                  <p>设备编号: ${m.ljf.deviceid}</p>
                  <p>设备位置: ${m.ljf.cap_address} </p>
                  <p>拍摄时间: ${m.ljf.dcollectiondate}</p>
                  <p>设备经纬度: ${m.params.strcoords}</p>
                  <div><img src=${m.ljf.pic1_path}  width='200px' onclick='window.open(this.src);' /></div>
                </div>`;
              this.setState({ rowSelectedIndex: m.ljf.index });
              map.openInfoWindowEx(strPosition, html, `设备编号：${m.ljf.deviceid}`);
            });
            displayMarker.push(m);
          }
        }
      }, 3000);
    }
  }

  showMarker = (lat, lng, centerMap) => {
    const { map } = this.state;
    displayMarker.forEach(e => {
      if (e.params.latitude == lat && e.params.longitude == lng) {
        e.changeImg('/HiatmpPro/assets/gis/track_red.png', 30, 30);
        if (!e.ljf.titleShown) {
          e.showTitle();
          e.ljf.titleShown = true;
        }
        if (centerMap) {
          for (let i = 0; i < e.clickFunc.length; i += 1) {
            if (e.clickFunc[i]) {
              e.clickFunc[i].call();
              map.setCenter(e.params.strcoords);
            }
          }
        }
      } else {
        e.changeImg('/HiatmpPro/assets/gis/track_blue.png', 30, 30);
      }
    });
  }
  // mouseoperate = (maker, point) => {
  //   // console.log(maker);
  //   // console.log(point);
  //   this.setState({
  //     currentId: point.deviceid,
  //   });
  // }

  title = () => '点位列表'

  handleQuery = () => {
    const { dispatch, form } = this.props;
    const { radioValue } = this.state;
    this.handleClear();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (radioValue == 2) {
          const myobj = {
            ...values,
            plate: values.plate.trim().toLocaleUpperCase(),
            // startTime: values.startTime.format(),
            // endtime: values.endtime.format(),
            ismh: false,
          };
          const myobj2 = {
            ...values,
            plate: values.plate.trim().toLocaleUpperCase(),
            // startTime: values.startTime.format(),
            // endtime: values.endtime.format(),
          };
          this.setState({ queryobj: myobj2 });
          dispatch({ type: 'octGisTrackReplay/queryDeviceList', payload: myobj });
        } else {
          const myobj = {
            ...values,
            plate: values.plate.trim().toLocaleUpperCase(),
            // startTime: values.startTime.format(),
            // endtime: values.endtime.format(),
            ismh: true,
          };
          const myobj2 = {
            ...values,
            plate: values.plate.trim().toLocaleUpperCase(),
            // startTime: values.startTime.format(),
            // endtime: values.endtime.format(),
          };
          this.setState({ queryobj: myobj2 });
          dispatch({ type: 'octGisTrackReplay/queryDeviceList', payload: myobj });
        }
      }
    });
  }

  handlePlate = (e) => {
    this.setState({ plateNo: e.target.value });
  }

  // pickTime = (value, dateString) => {
  //   // console.log(dateString[0], dateString[1]);
  //   this.setState({
  //     startTime: dateString[0],
  //     endTime: dateString[1],
  //   });
  // }
  handleStartChange = (stime) => {
    console.log(stime);
    this.setState({ startTime: stime });
  }

  handleEndChange = (etime) => {
    this.setState({ endTime: etime });
  }

  changeRadio = (e) => {
    this.setState({ radioValue: e.target.value });
  }

  // showInfoBox = (info) => {
  //   const { map } = this.state;
  //   this.setState({ info, visible: true });
  //   map.setCenter(`${info.longitude},${info.latitude}`);
  // }

  showBigPic = (info) => {
    window.open(info.pic1_path);
  }

  handlePause = () => {
    const { pause } = this.state;
    if (pause == false) {
      Car.pause();
    } else {
      Car.proceed();
    }
    this.setState({ pause: !pause });
  }

  handleClose = () => {
    this.setState({ visible: false });
  }

  handleCloseUrl = () => {
    this.setState({ visiblePic: false });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      // style: { height: '20px' },
    };
    const h3Layout = {
      style: { padding: '1rem 0 0 1rem' },
    };
    const space1Rem = {
      marginLeft: '1rem',
    };
    const spaceBottom = {
      marginBottom: '1rem',
    };
    const { form: { getFieldDecorator } }
      = this.props;
    const {
      devicelist,
      pause,
      plateNo,
      startTime,
      endTime,
      radioValue,
      visible,
      visiblePic,
      deviceUrl,
      loadingDevice,
      info,
      choseCar,
      isloading,
      rowSelectedIndex,
    }
      = this.state;
    const mapProps = {
      maptype: 'arcgis',
      ifmStyle: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
      },
      myStyle: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '0',
        background: '#020A2C',
      },
    };
    const columns = [
      {
        title: '序号',
        width: '10%',
        dataIndex: '',
        key: 'deviceindex',
        align: 'center',
        render: (value, data, index) => {
          return index + 1;
        },
      }, {
        title: '位置',
        width: '40%',
        dataIndex: 'cap_address',
        key: 'location',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '时间',
        width: '35%',
        dataIndex: 'dcollectiondate',
        key: 'time',
        align: 'center',
      }, {
        title: '操作',
        width: '15%',
        dataIndex: 'operator',
        key: 'operator',
        align: 'center',
        render: (text, record, index) => {
          return (
            <span>
              <Icon
                type="picture"
                onClick={() => { this.showBigPic(record); }}
                style={{
                  fontSize: '18px',
                  marginLeft: '4px',
                  cursor: 'pointer',
                }}
                title="查看大图"
              />
              <Icon
                type="environment"
                onClick={(e) => { this.showMarker(record.latitude, record.longitude, true); }}
                style={{
                  fontSize: '18px',
                  marginLeft: '4px',
                  cursor: 'pointer',
                }}
                title="定位信息"
              />
            </span>
          );
        },
      },
    ];

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Col span={8} style={{ height: '100%' }}>
          <Row style={spaceBottom}>
            <h3 {...h3Layout}>车牌号模糊查询</h3>
            <RadioGroup onChange={this.changeRadio} value={radioValue}>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </RadioGroup>
          </Row>
          <Row>
            {
              radioValue == 2 ?
                (
                  <Col span={10}>
                    <FormItem {...formItemLayout} label="车牌号">
                      {getFieldDecorator('plate', {
                        initialValue: plateNo,
                      })(
                        <Input
                          placeholder="请输入车牌号"
                          onChange={this.handlePlate}
                          style={{ textTransform: 'uppercase' }}
                        />
                      )}
                    </FormItem>
                  </Col>
                )
                :
                (
                  <Col span={10}>
                    <FormItem {...formItemLayout} label="车牌号">
                      {getFieldDecorator('plate', {
                        initialValue: plateNo,
                      })(
                        <Input
                          placeholder="请输入车牌号"
                          onChange={this.handlePlate}
                          style={{ textTransform: 'uppercase' }}
                        />
                      )}
                    </FormItem>
                  </Col>
                )
            }
          </Row>
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label="开始时间">
                {getFieldDecorator('startTime', {
                  initialValue: startTime,
                })(
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime
                    style={{ width: '100%' }}
                    placeholder="请选择开始时间"
                    // onChange={onChange}
                    // onOk={onOk}
                    disabledDate={disabledDate}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem {...formItemLayout} label="结束时间">
                {getFieldDecorator('endtime', {
                  initialValue: endTime,
                })(
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    showTime
                    placeholder="请选择结束时间"
                    // onChange={onChange}
                    // onOk={onOk}
                    disabledDate={disabledDate}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ margin: '1rem auto' }}>
            <Col span={4} offset={2}>
              <Button
                onClick={this.handleQuery}
                disabled={!(Boolean(plateNo) && Boolean(startTime) && Boolean(endTime))}
              >
                查询
              </Button>
            </Col>
            <Button
              style={{ marginLeft: '2rem' }}
              onClick={this.carTrackPlay}
              disabled={((devicelist || []).length < 2) || !choseCar}
            >
              播放轨迹
            </Button>
            <Button
              onClick={this.handlePause}
              style={space1Rem}
              disabled={!choseCar}
            >
              {pause ? '继续播放' : '暂停'}
            </Button>
            <Button onClick={this.handleClear} style={space1Rem} disabled={!choseCar}>清除</Button>
          </Row>
          <div>
            {(devicelist || []).length > 0 && <p>请选择车辆:</p>}
            <div style={{ backgroundColor: 'rgba(160,160,160,0.2)', height: '10rem', border: '1px solid black', overflow: 'auto' }}>
              {/* 展示模糊查询车辆结果 */}
              {plateArr.map(item =>
                (
                  <Col span={6} style={{ margin: '0.5rem 0' }}>
                    <Button onClick={this.chooseCar} style={{ width: '80%' }}>
                      {item.plateno}
                    </Button>
                  </Col>
                )
              )}
            </div>
          </div>
          {/* <div style={{ height: '40%' }}> */}
          <div className="outline-out">
            <div className="outline-inner">
              <div className="outline-inner-padding">
                <Row>
                  <Col span={10}>
                    <div>搜索结果 共<span className="allNumLight">{(devicelist || []).length}</span> 条记录</div>
                  </Col>
                  <Col span={14} style={{ textAlign: 'right' }}>
                    {/* <HiatmpAuthorized code={OCT_DEVICE_ADDNEW}> */}
                    <Button type="primary" style={{ margin: '0 5px' }} disabled={devicelist == null} onClick={this.onDownload}><i className="table-right icon iconfont icon-export" />批量导出</Button>
                    <Button type="primary" style={{ margin: '0 5px' }} disabled={devicelist == null} onClick={this.onDownloadPic}><i className="table-right icon iconfont icon-export" />导出图片</Button>
                    {/* </HiatmpAuthorized> */}
                  </Col>
                </Row>
              </div>
              <Table
                loading={isloading}
                columns={columns}
                dataSource={devicelist}
                // title={this.title}
                pagination={false}
                scroll={{ y: 450 }}
                rowKey={(record) => record.dcollectiondate + Math.random()}
                rowClassName={(record, index) => {
                  let className;
                  if (index === rowSelectedIndex) className = 'lightRow';
                  return className;
                }}
                onRow={(record, index) => {
                  return {
                    onClick: (e) => {
                      this.setState({
                        rowSelectedIndex: index,
                        // selectedLatitude: record.latitude,
                        // selectedLongitude: record.longitude,
                      });
                      this.showMarker(record.latitude, record.longitude);
                      // this.showInfoBox(record);
                      // setTimeout(this.showDevicelist, 0);
                    },
                  };
                }}
              />
            </div>
          </div>
          <Row>
            <Modal
              visible={visible}
              footer={null}
              title="当前点位信息"
              // cancelText="关闭"
              onCancel={this.handleClose}
            >
              <p>设备编号: {(info || {}).deviceid}</p>
              <p>拍摄时间: {(info || {}).dcollectiondate}</p>
              <p>拍摄时间: {(info || {}).cap_address}</p>
              <p>经纬度: {(info || {}).longitude},{(info || {}).latitude}</p>
              <div style={{ paddingBottom: '1rem', paddingLeft: '5rem' }}>
                <img src={(info || {}).pic1_path} alt="pic" style={{ cursor: 'pointer', width: '300px' }} onClick={this.showBigPic} />
              </div>
            </Modal>
            <Modal
              visible={visiblePic}
              footer={null}
              title="下载地址"
              // cancelText="关闭"
              onCancel={this.handleCloseUrl}
            >
              <div style={{ paddingBottom: 20 }}>
                {
                  loadingDevice ? (
                    <div>正在打包中，请稍等</div>
                  )
                    :
                    (
                      deviceUrl.map((item, index) =>
                        (
                          <p>
                            <span>地址{index + 1}:</span>
                            <a href={`/HiatmpPro${item}`} target="_blank" rel="noopener noreferrer">{item}</a>
                          </p>
                        )
                      )
                    )
                }
              </div>
            </Modal>
          </Row>
        </Col>

        <Col span={16} style={{ height: '100%' }}>
          <HiMap {...mapProps} onready={this.onmapready} />
        </Col>
      </div>

    );
  }
}

function mapStateToProps({ octGisTrackReplay, loading }) {
  const { devicelist } = octGisTrackReplay;
  return { propsdevicelist: devicelist, loading: loading.models.octGisTrackReplay };
}


export default connect(mapStateToProps)(Form.create()(GisTrackReplay));
