/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Table, Divider, Form, Input, Button, Row, Col, message } from 'antd';
import { getRoadInfo } from '../../../services/octGIS';
import HiMap from '../../common/HiMap/HiMap';

let oldMarker = null;
let originalMarker = null;

class GISMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markerinfo: {},
      markers: null,
      map: null,
      lati: null,
      lngi: null,
      ziran: null,
      ziranName: null,
      fabu: null,
      fabuName: null,
    };
    this.onmapready = this.onmapready.bind(this);
  }

  // 对话框：取消
  onClose = () => {
    const { onClose } = this.props;
    onClose();
  }

  // 对话框：确定
  onOk = () => {
    const { onOk, nodeInfo, deviceid, dispatch } = this.props;
    const { lngi, lati, ziran, ziranName, fabu, fabuName } = this.state;
    onOk(lngi, lati, ziran, ziranName, fabu, fabuName);
  }

  // 地图加载完后会调用onmapready方法
  onmapready = (_MapApp) => {
    this.setState({
      map: _MapApp,
    });
    const { markers } = this.state;
    const { lng, lat, zrid, zrname, fbid, fbname, deviceid, devicedesc } = this.props;
    // console.log('zzzz', zrid, zrname, fbid, fbname);
    setTimeout(() => {
      this.setState({
        map: _MapApp,
      });
      if (lng != null && lat != null) {
        originalMarker = _MapApp.showMonitor({
          strcoords: `${lng},${lat}`,
          title: '电子眼',
          imgurl: '/HiatmpPro/assets/gis/green.png',
          // imgurl: '/src/assets/gis/green.png',
          width: 30,
          height: 40,
        });
        this.setState({
          lati: lat,
          lngi: lng,
          ziran: zrid,
          ziranName: zrname,
          fabu: fbid,
          fabuName: fbname,
        });
        _MapApp.setCenter(`${lng},${lat}`);
        setTimeout(() => {
          _MapApp.openInfoWindowEx(`${lng},${lat}`, devicedesc, deviceid);
        }, 600);
      }
    }, 500);
  };

  selPoint = () => {
    const { map } = this.state;

    map.changeDragMode('drawPoint', null, null, (str) => {
      if (oldMarker != null) {
        map.removeMonitor(oldMarker);
      }
      const x = str.split(',')[0];
      const y = str.split(',')[1];
      console.log(str);
      oldMarker = map.showMonitor({
        strcoords: `${x},${y}`,
        title: '新增点位',
        imgurl: '/HiatmpPro/assets/gis/red.png',
        // imgurl: '/src/assets/gis/red.png',
        width: 30,
        height: 40,
      });
      getRoadInfo(x, y).then((result) => {
        // console.log('result', result);
        if (result.code != 200) {
          message.error(result.msg);
        } else {
          // console.log('result', result);
          this.setState({
            ziran: result.results.自然路段.nearRoad.code,
            ziranName: result.results.自然路段.nearRoad.name,
            fabu: result.results.发布路段.nearRoad.code,
            fabuName: result.results.发布路段.nearRoad.name,
          });
        }
      }).catch((e) => {
        console.error(JSON.stringify(e));
      });
      this.setState({
        lati: y,
        lngi: x,
      });
    });
  }

  render() {
    console.log(this.props);
    const { markerinfo, map, lati, lngi, ziran, ziranName, fabu, fabuName } = this.state;
    const { visible, flag } = this.props;
    const markerProps = {
      markerinfo,
    };
    const mapProps = {
      maptype: 'arcgis',
      ifmStyle: {
        width: '100%',
        height: '100%',
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
      <Modal
        title="选择设备经纬度"
        visible={visible}
        onCancel={this.onClose}
        footer={[
          <Button key="back" onClick={this.onClose}>返回</Button>,
          <Button key="submit" type="primary" onClick={this.onOk} disabled={flag == 2}>
            确认修改
          </Button>,
        ]}
        width={1000}
        destroyOnClose
      >
        <div style={{
          height: 500,
          marginLeft: 10,
        }}
        >
          <Col span={18} style={{ height: 500 }}>
            <HiMap {...mapProps} onready={this.onmapready} />
          </Col>
          <Col span={6} style={{ height: 500 }}>
            <Button key="back" onClick={this.selPoint} disabled={flag == 2}>选择点</Button>
            <Divider>经纬度</Divider>
            经度：{lngi}<br />纬度：{lati}
            <Divider>路段信息</Divider>
            自然段:{ziran}<br />自然段名称：{ziranName}
            <br />
            发布段:{fabu}<br />发布段名称:{fabuName}
          </Col>
        </div>
      </Modal>
    );
  }
}
GISMap.prototypes = {
};
export default Form.create()(GISMap);
