import { connect } from 'dva';
import React from 'react';
import { Form, Layout, Row, Col, Menu, Input, Modal, message } from 'antd';
import HiMap from '../../components/common/HiMap/HiMap';
import PointProp from '../../components/oct/GisPointPorp';
import PointDevice from '../../components/oct/GisDeviceList';
import { getRoadInfo, queryDevices } from '../../services/octGIS';

const { confirm } = Modal;
function callback(strcoords) {
  alert(strcoords);
}
let oldMarker = null;
let displayMarker = [];
let prevDeviceList = null;
let LayerNew = null; // 新增加的路网图层

function existInArray(arr, item) {
  if (arr || arr.length > 0) {
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i] && arr[i].infoTemplate && arr[i].infoTemplate.title) {
        const v = arr[i];
        if (v.infoTemplate.title == item.deviceid) {
          return i;
        }
      }
    }
  }
  return -1;
}

class GisManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pt: {},
      markers: null,
      map: null,
      lat: null,
      lng: null,
      selectedKeys: [],
      httpType: '',
      httpQuery: null,
      currentId: '', // 当前选中行的deviceid（selected）
      ziran: null, // 自然路段id
      ziranName: null, // 自然路段名称
      fabu: null, // 发布路段id
      fabuName: null, // 发布路段名称
      dList: [],
      dListOld: [],
      deviceCount: 0, // 结果共多少条
      searchText: '',
      checkedKeys: [], // 路段
      checkedKeys1: [], // 警务区
      checkedKeys2: [], // 维护
    };
    this.onmapready = this.onmapready.bind(this);
  }

  componentDidMount() {
    const { dispatch, common, accountmanage, octRoadSection, octGis } = this.props;
    dispatch({
      type: 'octGis/policeStruct', // 警务区域
    });
    dispatch({
      type: 'octGis/getWeiHu', // 施工或维护单位
    });
    dispatch({
      type: 'octRoadSection/queryMenuList', // 路段
      payload: {},
    });
    dispatch({
      type: 'octGis/queryAllDevices', // 拿到所有的设备
      payload: {},
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { dList } = this.state;
    if (prevState.dList && dList) {
      this.showDevicelist(dList);
    }
  }

  onRef = (ref) => {
    this.child = ref;
  }

  onGetDeviceID = () => {
    return this.child.getSelectedDeviceID();
  }

  onGetDeviceInfo = () => {
    return this.child.getSelectedDeviceInfo();
  }

  onShowMarker = (e, onlyone) => {
    const { map } = this.state;
    if (onlyone) {
      map.closeInfoWindow();
      map.setCenter(`${e.longitude},${e.latitude}`);
      // console.log(e0);
      const ziranid = (e.ziran_code == null ? '暂无' : e.ziran_code);
      const ziranname = (e.ziran_name == null ? '暂无' : e.ziran_name);
      const fabuid = (e.fabu_code == null ? '暂无' : e.fabu_code);
      const fabuname = (e.fabu_name == null ? '暂无' : e.fabu_name);
      setTimeout(() => {
        map.openInfoWindow(`${e.longitude},${e.latitude}`,
          `设备编号：<b>${e.deviceid}</b><br>电警编号：<b>${e.epdeviceid}</b><br>设备位置：<b>${e.deviceaddress}</b><br>` +
          `发布段编号：${fabuid}<br>发布段名称：${fabuname}<br>自然段编号：${ziranid}<br>自然段名称：${ziranname}`);
      }, 500);
    }
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

  onStartInit = (entity) => {
    const { dispatch } = this.props;
    const { map, lng, lat, httpQuery, httpType } = this.state;
    const that = this;
    // console.log(entity);
    const did = entity.deviceid;
    map.changeDragMode('drawPoint', null, null, (str) => {
      const x = str.split(',')[0];
      const y = str.split(',')[1];
      // console.log(str);
      oldMarker = map.showMonitor({
        strcoords: `${x},${y}`,
        title: '设置设备新位置',
        imgurl: '/HiatmpPro/assets/gis/red.png',
        // imgurl: '/src/assets/gis/red.png',
        width: 20,
        height: 30,
      });
      getRoadInfo(x, y).then((result) => {
        if (result.code != 200) {
          message.error(result.msg);
        } else {
          const zrID = result.results.自然路段.nearRoad.code;
          const zrName = result.results.自然路段.nearRoad.name;
          const fbID = result.results.发布路段.nearRoad.code;
          const fbName = result.results.发布路段.nearRoad.name;
          const szContent = `设备编号：<br>电警编号：<br>设备位置：<hr>经度：<br>纬度：<hr>该位置发布路段为：${fbName}<br>自然路段为：${zrName}`;
          confirm({
            title: '更改设备经纬度',
            content: `是否设置设备${did}经纬度到指定位置？\n该位置坐标为${x}, ${y}。发布路段名称为${fbName}\n自然路段为：${zrName}。`,
            okText: '继续',
            cancelText: '取消',
            onOk() {
              map.closeInfoWindow();
              dispatch({
                type: 'octGis/addOrUpdatePoint',
                payload: {
                  id: did,
                  longitude: x,
                  latitude: y,
                  zirancode: zrID,
                  ziranname: zrName,
                  fabucode: fbID,
                  fabuname: fbName,
                },
              }).then(data => {
                // console.log(data);
                // 清除原有marker，设置到新位置
                map.removeMonitor(oldMarker);
                queryDevices(httpQuery).then((r) => {
                  if (!r.result) {
                    message.error(r.msg);
                  } else {
                    that.setState({
                      dList: r.list,
                      dListOld: r.list,
                      deviceCount: r.list.length,
                    });
                  }
                }).catch((e) => {
                });
              });
              Modal.success({
                title: '设备设置地图位置成功！',
              });
            },
            onCancel() {
              map.removeMonitor(oldMarker);
            },
          });
        }
      }).catch((e) => {
        // console.error(JSON.stringify(e));
      });
    });
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

  showDevicelist = (devicelist) => {
    const { map } = this.state;
    if (prevDeviceList != devicelist) {
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
              const m = map.showMonitor({
                strcoords: `${devices[i].longitude},${devices[i].latitude}`,
                title: devices[i].deviceid,
                imgurl: '/HiatmpPro/assets/gis/green.png',
                // imgurl: '/src/assets/gis/green.png',
                width: 20,
                height: 25,
              });
              m.clickFunc.push(() => {
                const html = '<div><p>abc</p><p>abc</p></div>';
                // alert(html);
                m.openInfoWindowHtml(html);
              });
              displayMarker.push(m);
            }
          }
        }, 30);
      }
    }
  }

  mouseoperate = (maker, point) => {
    // console.log(maker);
    // console.log(point);
    this.setState({
      currentId: point.deviceid,
    });
  }

  render() {
    const { dispatch, common, accountmanage, octRoadSection, octGis, loading } = this.props;
    const { enumList } = common;
    const { pt, map, selectedKeys, currentId, ziran, ziranName, fabu, fabuName,
      modelContent, searchText,
      modalVisible, dList, dListOld, deviceCount, checkedKeys,
      checkedKeys1, checkedKeys2 } = this.state;
    const {
      departmentListwh,
    } = accountmanage;
    const {
      policearea,
      weihu, allDevice,
    } = octGis;
    // console.log(allDevice);
    const {
      menuList,
    } = octRoadSection;
    const {
      pagination,
      devicelist: devicelistx,
    } = octGis;

    const leftProps = {
      pt,
      policearea,
      weihu,
      departmentListwh,
      menuList,
      onLuDuan: (selKeys, type) => {
        const deviceArr = [];
        const arr = selKeys.split(',');
        if (selKeys.length) {
          if (type == 1) { // 路段
            this.setState({
              checkedKeys: arr,
            });
            for (let i = 0; i < arr.length; i += 1) {
              for (let j = 0; j < allDevice.length; j += 1) {
                if (
                  allDevice[j].sectionid && (arr[i] == allDevice[j].sectionid)
                ) {
                  deviceArr.push(allDevice[j]);
                }
              }
            }
          } else if (type == 2) { // developer 施工单位 maintaindepart 维护单位
            this.setState({
              checkedKeys2: arr,
            });
            const reg = /^0,/;
            // console.log('selKeys:', selKeys, 'selKeys.length:', selKeys.length);
            for (let i = 0; i < allDevice.length; i += 1) {
              if (
                allDevice[i].maintaindepart && (selKeys.indexOf(allDevice[i].maintaindepart) != -1)
              ) {
                deviceArr.push(allDevice[i]);
              } else if (
                allDevice[i].developer && (selKeys.indexOf(allDevice[i].developer) != -1)
              ) {
                deviceArr.push(allDevice[i]);
              } else if (
                (
                  (!allDevice[i].developer && !allDevice[i].maintaindepart) && (reg.test(selKeys))
                ) ||
                (
                  (selKeys == 0) && ((!allDevice[i].developer && !allDevice[i].maintaindepart))
                )
              ) {
                deviceArr.push(allDevice[i]);
              }
            }
          } else if (type == 3) { // 警务区域
            this.setState({
              checkedKeys1: arr,
            });
            for (let i = 0; i < arr.length; i += 1) {
              for (let j = 0; j < allDevice.length; j += 1) {
                if (
                  allDevice[j].departmentid && (arr[i] == allDevice[j].departmentid)
                ) {
                  deviceArr.push(allDevice[j]);
                }
              }
            }
          } else {
            console.log('else');
          }
          this.setState({
            dList: deviceArr,
            dListOld: deviceArr,
            deviceCount: deviceArr.length,
          });
        } else {
          this.setState({
            dList: [],
            dListOld: [],
            deviceCount: 0,
            checkedKeys: [],
            checkedKeys1: [],
            checkedKeys2: [],
          });
        }
      },
      onChange: () => {
        this.setState({
          dList: [],
          dListOld: [],
          deviceCount: 0,
          checkedKeys: [],
          checkedKeys1: [],
          checkedKeys2: [],
        });
      },
      checkedKeys, // 路段
      checkedKeys1, // 警务区
      checkedKeys2, // 维护
    };
    const deviceProps = {
      pagination,
      devicelist: dList,
      deviceCount,
      selectedKeys,
      loading,
      enumList,
      searchText,
      currentId,
      dosearch: (value) => {
        console.log(dListOld);
        if (value.length > 0) {
          const newList = [];
          dListOld.forEach(entity => {
            if (entity.deviceid.indexOf(value) >= 0) {
              newList.push(entity);
            }
          });
          this.setState({ dList: newList, deviceCount: newList.length });
        } else {
          this.setState({ dList: dListOld, deviceCount: dListOld.length });
        }
      },
      startInit: (e) => {
        this.onStartInit(e);
      },
      startEdit: (e) => {
        this.onStartInit(e);
      },
      showMarker: (markers, onlyone) => {
        this.onShowMarker(markers, onlyone);
      },
      onPageChange: (page) => {
        pagination.current += 1;
      },
      changeSelected: (keys) => {
        this.setState({
          selectedKeys: keys,
        });
      },
      onTestClick: () => {
        // console.log(map);
      },
    };
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
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Col span={10} style={{ height: '100%' }}>
          <PointProp {...leftProps} style={{ height: 500 }} />
          <PointDevice {...deviceProps} onRef={this.onRef} />
        </Col>
        <Col span={14} style={{ height: '100%' }}>
          <HiMap {...mapProps} onready={this.onmapready} />
        </Col>
        <Modal
          title="确认更改经纬度？"
          visible={modalVisible}
          onOk={this.okModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          {modelContent}
        </Modal>
      </div>

    );
  }
}

function mapStateToProps({ octGis, accountmanage, octRoadSection, common, loading }) {
  // if (!loading.models.octGis) {
  //   if (octGis.devicelist) {
  //     if (octGis.devicelist.length > 0) {
  //       showAllDevice(octGis.deviceList);
  //     } else {
  //       clearDevice();
  //     }
  //   }
  // }
  return { octGis, accountmanage, octRoadSection, common, loading: loading.models.octGis };
}

export default connect(mapStateToProps)(GisManage);
