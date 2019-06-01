/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Tabs, Spin, Tooltip } from 'antd';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { OCT_DEVICE_MANAGEMENT } from '../../config/authconstant';
import styles from '../DictionaryManage/DictionaryInfo.less';
import { DIRECTION, PSFX } from '../../config/enums';
import HiMap from '../common/HiMap/HiMap';

const { TabPane } = Tabs;

function onVideoClick(xxx) {
  alert(xxx);
}

class AreaDetailList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DeviceUploadVisible: false, // 警员信息选择窗口
      map: null,
      markers: null,
      activeKey: '1',
      leftQueryOld: '',
      allMonitors: [], // 所有已显示的marker
    };
    this.getEnumValue = this.getEnumValue.bind(this);
    this.onmapready = this.onmapready.bind(this);
  }

  componentWillReceiveProps(nextprops) {
    const { leftQuery } = nextprops;
    const { leftQueryOld } = this.state;
    if (leftQuery != leftQueryOld) {
      this.setState({
        activeKey: '1',
        leftQueryOld: leftQuery,
      });
    }
  }

  onPoliceInfoSelect = (police) => {
    const { form } = this.props;
    this.setState({ DeviceUploadVisible: false });
  }

  // 地图加载完后会调用onmapready方法
  onmapready = (_MapApp) => {
    this.setState({
      map: _MapApp,
    });
    const { markers, map } = this.state;
    const { lat, lng, text, desc } = this.props;
    setTimeout(() => {
      this.setState({
        map: _MapApp,
      });
      // theMap = _MapApp;
      this.loadMapMarker(_MapApp);
    }, 1000);
  };

  // 根据枚举值获取枚举名
  getEnumValue(enumtypeid, enumvalue) {
    const { enumList } = this.props;
    for (let i = 0; i < enumList.length; i += 1) {
      const enumObj = enumList[i];
      if (enumObj.enumtypeid === enumtypeid && enumObj.enumvalue === enumvalue) {
        return enumObj.enumname;
      }
    }
  }

  // 截取字符串
  getPicture(value) {
    const { enumList } = this.props;
    let a = value;
    if (a.length > 2) {
      a = ''.concat(a.substr(0, 2), '');
    }
    return a;
  }

  getHtml = (device) => {
    // const href = 'javascript:;';
    const temp = (
      <div>
        <div>编号为：{device.deviceid}</div>
        <a href="" onClick={() => this.xxx(device.deviceid)}>点我</a>
      </div>
    );
    const divTemp = document.createElement('div');
    ReactDOM.render(temp, divTemp);
    const html = divTemp.innerHTML;
    return html;
  }

  xxx = (id) => {
    alert(id);
  }

  showDeviceUpload = () => {
    // this.setState({ displayName: 'block' });
  }

  changeTabCallback = (key) => {
    const { map } = this.state;
    this.setState({ activeKey: key });
    console.log('map', map);
    if (key == '2') {
      if (map) {
        this.loadMapMarker(map);
      }
    }
  }

  loadMapMarker = (theMap) => {
    const { resultlist, onVideo } = this.props;
    const { allMonitors } = this.state;
    if (theMap) {
      // 清除marker
      const makers = [];
      const makersID = [];
      if (resultlist) {
        resultlist.forEach(v => {
          console.log(v);
          if (makersID.indexOf(v.deviceid) < 0) {
            makersID.push(v.deviceid);
            makers.push(v);
          }
        });
      }
      allMonitors.forEach(v => {
        theMap.removeMonitor(v);
      });
      theMap.closeInfoWindow();
      if (makers) {
        theMap.Tools.largeArrayProcess(makers, (devices) => {
          const markersxx = [];
          for (let i = 0; i < devices.length; i += 1) {
            if (devices[i].latitude != null && devices[i].longitude != null) {
              const strPosition = `${devices[i].longitude},${devices[i].latitude}`;
              const m = theMap.showMonitor({
                strcoords: strPosition,
                imgurl: '/HiatmpPro/assets/gis/green.png',
                width: 30,
                height: 45,
              });
              m.clickFunc.push(() => {
                const html = `
                  <div>
                    <div style="float: left">
                      设备编号：${devices[i].deviceid}
                    </div>
                    <div style="float: right;">
                      <a onclick="onVideoClick('${devices[i].rtsp}')">
                        实时视频
                      </a>
                    </div>
                    <p>设备位置：${devices[i].deviceaddress}</p>
                    <p>检测时间：${devices[i].detection_time}</p>
                    <p>总流量：${devices[i].total_flow}</p>
                    <p>平均速度：${devices[i].speed}</p>
                    <p>道路名称：${devices[i].roadname}</p>
                  </div>
                `;
                // const html = this.getHtml(devices[i]);
                console.log(html);
                theMap.zoomTo(10);
                theMap.setCenter(m.params.strcoords);
                setTimeout(() => {
                  theMap.openInfoWindowEx(strPosition, html, `设备编号：${devices[i].deviceid}`);
                }, 500);
              });
              markersxx.push(m);
            }
          }
          this.setState({ allMonitors: markersxx });
        }, 30);
      }
    }
  }

  initState = () => {
    // this.setState({ activeKey: '1' });
  }

  footer = () => {
    const { statistics, resultlist } = this.props;
    return (
      <Row>
        <Col span={10}>
          <div>
            搜索结果 共
            <span className="allNumLight">
              {resultlist ? resultlist.length : 0}
            </span>
            条
          </div>
        </Col>
        <Col span={8}>
          <span style={{ marginRight: '5px' }}>
            平均车速:
          </span>
          <span className="allNumLight">
            {statistics ? statistics.speed_avg.toFixed(2) : null}
          </span>
        </Col>
      </Row>
    );
  }

  render() {
    const { codeList, loading, onVideo, statistics } = this.props;
    const { DeviceUploadVisible, src, activeKey } = this.state;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    this.initState();
    // 列表
    const columns = [
      {
        title: '序号',
        width: '5%',
        align: 'center',
        key: 'id',
        render: (text, record, index) => `${index + 1}`,
      }, {
        title: '路段',
        width: '10%',
        dataIndex: 'roadname',
        key: 'roadname',
        align: 'center',
      }, {
        title: '设备编号',
        width: '10%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
      }, {
        title: '设备位置',
        width: '20%',
        dataIndex: 'deviceaddress',
        key: 'deviceaddress',
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
        title: '统计时间',
        width: '13%',
        dataIndex: 'detection_time',
        key: 'detection_time',
        align: 'center',
      },
      {
        title: '总流量',
        width: '7%',
        dataIndex: 'total_flow',
        key: 'total_flow',
        align: 'center',
      }, {
        title: '大车',
        width: '5%',
        dataIndex: 'vehicle_flow1',
        key: 'vehicle_flow1',
        align: 'center',
      }, {
        title: '中车',
        width: '5%',
        dataIndex: 'vehicle_flow2',
        key: 'vehicle_flow2',
        align: 'center',
      }, {
        title: '小车',
        width: '5%',
        dataIndex: 'vehicle_flow3',
        key: 'vehicle_flow4',
        align: 'center',
      }, {
        title: '其他',
        width: '5%',
        dataIndex: 'vehicle_flow_other',
        key: 'vehicle_flow_other',
        align: 'center',
      }, {
        title: '车速',
        width: '5%',
        dataIndex: 'speed',
        key: 'speed',
        align: 'center',
      }, {
        title: '视频',
        width: '5%',
        dataIndex: 'rtsp',
        key: 'rtsp',
        align: 'center',
        render: (txt, record) => {
          return (
            <span>
              <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_MANAGEMENT}>
                <Icon
                  type="eye"
                  onClick={() => onVideo(record.rtsp)}
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                  }}
                  title="实时视频"
                />
              </HiatmpAuthorized>
            </span>
          );
        },
      },
    ];

    const mapProps = {
      maptype: 'arcgis',
      ifmStyle: {
        width: '100%',
        height: '700px',
        position: 'relative',
        top: '0',
        left: '0',
      },
      myStyle: {
        width: '100%',
        height: '700px',
        position: 'relative',
        top: '0',
        left: '0',
        zIndex: '0',
        background: '#020A2C',
      },
    };

    const {
      // loading,
      resultlist,
      pagination,
      onPageChange,
      onAdd,
      onDownload,
      selectedKeys,
      changeSelected,
      currentId,
    } = this.props;

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            {/* <Row>
              <Col span={14}>
              </Col>
            </Row> */}
          </div>
          <Tabs defaultActiveKey="1" activeKey={activeKey} onChange={this.changeTabCallback}>
            <TabPane tab="列表" key="1">
              <Table
                columns={columns}
                rowClassName={
                  (record, index) => {
                    return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                  }}
                loading={loading}
                dataSource={resultlist}
                // rowSelection={rowSelection}
                footer={() => this.footer()}
                pagination={pagination}
                onChange={onPageChange}
                onRow={(record) => {
                  return {
                    // onClick: () => onView(record),
                  };
                }}
                locale={{ emptyText: '暂无数据' }}
                scroll={{ y: 550 }}
                rowKey={record => record.deviceid + record.detection_time}
              />
            </TabPane>
            <TabPane tab="地图" key="2">
              <HiMap {...mapProps} onready={this.onmapready} />
            </TabPane>
          </Tabs>
        </div>
        {/* <div style={{ display: loading ? '' : 'none' }} className={styles.loadingDiv}>
          <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
        </div> */}
      </div>
    );
  }
}
AreaDetailList.prototypes = {
  // loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  selectedKeys: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  changeSelected: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  currentId: PropTypes.string,
  onDownload: PropTypes.func,
};
export default Form.create()(AreaDetailList);
