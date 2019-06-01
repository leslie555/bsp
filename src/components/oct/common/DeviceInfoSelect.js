import { Divider, Button, Modal, Upload, message, Form, Input, Select, Row, Col, Icon, Anchor, TreeSelect, AutoComplete, Tooltip, InputNumber } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'zrender/lib/core/util';
import { DEV_TYPE, SGDW, PSWZ, PSFX, SSXM, ISCOVER, ENUM_STATUS, XZQY, STATE, SBTGS, ANNULAR_REGION, DIRECTION, MAINTENAN_UNIT, SBWZ, SBTS } from '../../../config/enums';
// import styles from './DeviceSelect.less';
import Dialog from './GISMap';

const FormItem = Form.Item;
const { Option } = Select;
const { Link } = Anchor;
const { confirm, info } = Modal;

const preURLImage = '/HiatmpPro';
function renderOption(item) {
  return (
    <AutoComplete.Option key={item.deviceid} text={item.deviceid}>
      {item.deviceid}
      <br />
      <span style={{ fontWeight: 'bold', whiteSpace: 'pre-line', wordBreak: 'break-all' }}> {item.devicename}</span>
    </AutoComplete.Option>
  );
}

const handleClick = (e, link) => {
  e.preventDefault();
  console.log(link);
};

class DeviceInfoSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // picloading: false,
      loading: false,
      mapVisible: false,
      luduanValue: undefined,
      jingwuValue: undefined,
      previewVisible: false,
      previewImage: '',
      fileList: [], // 附件
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileList5: [],
      fileList6: [],
      file: {
        DeviceID: '3344',
        Title: '',
        Desc: '',
        PicType: '1',
      },
      QFG: 0, // 是否全覆盖
      SBSL: 0, // 设备套数
      gisInfo: null, // GIS信息
    };
  }

  componentWillMount() {
    const { entity: { departmentid } } = this.props;

    this.setState({ jingwuValue: departmentid });
  }

  componentDidMount() {
    const { entity } = this.props;
    const { auximage, aux } = entity;
    if (auximage == null) return;
    this.setImageURL(auximage, aux);
  }

  componentWillReceiveProps(nextProps) {
    // debugger;
  }

  onChange = (value) => {
    // console.log(value);
    // this.setState({ luduanValue: value });
  }

  onChangeJ = (value) => {
    // console.log(value);
    this.setState({ jingwuValue: value });
  }

  onClose = () => {
    const { onClose } = this.props;
    onClose();
  }

  setImageURL(auximage, aux) {
    const { fileList, fileList1, fileList2, fileList3,
      fileList4, fileList5, fileList6 } = this.state;
    const imageList = [];
    if (aux.length > 0) {
      const fujian = [];
      for (let k = 0; k < aux.length; k += 1) {
        const f = {
          uid: k,
          name: aux[k].title,
          status: 'done',
          url: `/HiatmpPro${aux[k].image_url}`,
        };
        fujian.push(f);
      }
      this.setState({ fileList: fujian });
    }
    for (let i = 0; i <= 5; i += 1) {
      if (auximage[i] != null) {
        const imagex = [];
        const j = {
          uid: i,
          name: auximage[i].id,
          status: 'done',
          url: `/HiatmpPro${auximage[i].image_url}`,
        };
        imagex.push(j);
        imageList.push(imagex);
      } else {
        imageList.push([]);
      }
    }
    console.log(imageList);
    if (fileList1.length == 0) {
      this.setState({ fileList1: imageList[0] });
    }
    if (fileList2.length == 0) {
      this.setState({ fileList2: imageList[1] });
    }
    if (fileList3.length == 0) {
      this.setState({ fileList3: imageList[2] });
    }
    if (fileList4.length == 0) {
      this.setState({ fileList4: imageList[3] });
    }
    if (fileList5.length == 0) {
      this.setState({ fileList5: imageList[4] });
    }
    if (fileList6.length == 0) {
      this.setState({ fileList6: imageList[5] });
    }
  }

  getAvatar(entity) {
    const { loading } = this.state;
    const status = entity.devicestatus;
    const x = `<Tooltip placement="right" title="设备状态：${status}"><Icon type="check-circle" style={{ color: 'green', fontSize: 40 }} /></Tooltip>`;
    return x;
  }

  handleOk = () => {
    const { form, handleAddOrEdit, flag, departmentinfo } = this.props;
    const { gisInfo, fileList, fileList1, fileList2, fileList3,
      fileList4, fileList5, fileList6 } = this.state;
    const fileInfo = {
      fileList,
      fileList1,
      fileList2,
      fileList3,
      fileList4,
      fileList5,
      fileList6,
    };
    if (form.getFieldValue('deviceid')) {
      form.validateFieldsAndScroll((err, values) => {
        // debugger;
        if (!err) {
          if (flag === '1') {
            // 判断是否有经纬度
            if (gisInfo == null) {
              message.error('经纬度是新增设备必须的，请先选择！');
              return;
            }
            handleAddOrEdit({ ...values, ...gisInfo, ...fileInfo });
          } else if (flag === '3') {
            handleAddOrEdit({ ...values, ...gisInfo, ...fileInfo });
          }
        }
      });
    } else {
      message.error('请添加设备编号');
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  handleChange1 = ({ fileList }) => this.setState({ fileList1: fileList })

  handleChange2 = ({ fileList }) => this.setState({ fileList2: fileList })

  handleChange3 = ({ fileList }) => this.setState({ fileList3: fileList })

  handleChange4 = ({ fileList }) => this.setState({ fileList4: fileList })

  handleChange5 = ({ fileList }) => this.setState({ fileList5: fileList })

  handleChange6 = ({ fileList }) => this.setState({ fileList6: fileList })

  imageRemove = () => {
    return new Promise((resolve, reject) => {
      const { flag } = this.props;
      if (flag == '2') {
        info({
          title: '不能删除',
          contgent: '浏览状态不能删除图片',
        });
        reject();
      } else {
        confirm({
          title: '删除确认',
          content: '确定要删除该图片吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            resolve(true);
          },
          onCancel() {
            reject();
          },
        });
      }
    });
  }

  imageRemovex = () => {
    return new Promise((resolve, reject) => {
      const { flag } = this.props;
      if (flag == '2') {
        info({
          title: '不能删除',
          contgent: '浏览状态不能删除文件',
        });
        reject();
      } else {
        confirm({
          title: '删除确认',
          content: '确定要删除该文件吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            resolve(true);
          },
          onCancel() {
            reject();
          },
        });
      }
    });
  }

  showMap = () => {
    this.setState({
      mapVisible: true,
    });
  }

  handleChangeQFG = (value) => {
    this.setState({ QFG: value });
  }

  handleChangeSB = (value) => {
    this.setState({ SBSL: value });
  }

  // 获取枚举值
  handleEnumOption(enumsid) {
    const options = [];
    const { enumList } = this.props;
    if (enumList.length > 0) {
      // options.push(<Option value="">全部类型</Option>);
    }
    for (let i = 0; i < enumList.length; i += 1) {
      if (enumList[i].enumtypeid === (enumsid || '')) {
        options.push(<Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue}>{enumList[i].enumname}</Option>);
      }
    }
    return options;
  }

  render() {
    const {
      form,
      entity,
      visible,
      treeData,
      flag,
      treeDataJ,
      dataSource,
      handleSearch,
    } = this.props;
    const { loading, luduanValue, jingwuValue, mapVisible, file, QFG, SBSL,
    }
      = this.state;
    const {
      latitude,
      longitude,
      ziran_code: ziranCode,
      ziran_name: ziranName,
      fabu_code: fabuCode,
      fabu_name: fabuName,
      deviceid,
      devicename,
      epdeviceid,
    } = entity;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
      style: { height: '25px' },
    };
    const uploadprops = {
    };
    const mapProp = {
      lng: longitude,
      lat: latitude,
      zrid: ziranCode,
      zrname: ziranName,
      fbid: fabuCode,
      fbname: fabuName,
      visible: mapVisible,
      deviceid,
      devicedesc: `设备编号：<b>${deviceid}</b><br>电警编号：<b>${epdeviceid}</b><br>设备名称：<b>${devicename}</b>`,
      flag,
      onClose: () => {
        this.setState({ mapVisible: false });
      },
      onOk: (lng, lat, zrid, zrname, fbid, fbname) => {
        this.setState({ mapVisible: false });
        debugger;
        if (lng != null && lat != null) {
          this.setState({
            gisInfo: { lat, lng, zrid, zrname, fbid, fbname },
          });
        }
      },
    };

    const { previewVisible, previewImage } = this.state;
    const { fileList, fileList1,
      fileList2, fileList3, fileList4,
      fileList5, fileList6 } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">点击上传</div>
      </div>
    );
    const ipreg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    const macreg = /([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}/;
    // var szDesc = '';
    // var szTitle = '';
    // var szDeviceID = '';
    // var szImageType = 1;
    const urlfile = `/HiatmpPro/bsp/octdevice/insertMultiFile?desc=${file.Desc}&title=${file.Title}&id=${deviceid}&pictype=0`;
    const url1 = `/HiatmpPro/bsp/octdevice/insertMultiFile?desc=${file.Desc}&title=${file.Title}&id=${deviceid}&pictype=1`;
    const url2 = `/HiatmpPro/bsp/octdevice/insertMultiFile?desc=${file.Desc}&title=${file.Title}&id=${deviceid}&pictype=2`;
    const url3 = `/HiatmpPro/bsp/octdevice/insertMultiFile?desc=${file.Desc}&title=${file.Title}&id=${deviceid}&pictype=3`;
    const url4 = `/HiatmpPro/bsp/octdevice/insertMultiFile?desc=${file.Desc}&title=${file.Title}&id=${deviceid}&pictype=4`;
    const url5 = `/HiatmpPro/bsp/octdevice/insertMultiFile?desc=${file.Desc}&title=${file.Title}&id=${deviceid}&pictype=5`;
    const url6 = `/HiatmpPro/bsp/octdevice/insertMultiFile?desc=${file.Desc}&title=${file.Title}&id=${deviceid}&pictype=6`;
    const title = (flag == 1 ? '新增设备' : (flag == 2 ? '查看设备详情' : '编辑设备详情'));
    // const options = this.entity.map(renderOption);
    return (
      <div
        style={{
          width: '800px',
        }}
      >
        <Modal
          destroyOnClose
          title={title}
          width={990}
          visible
          onCancel={this.onClose}
          footer={[
            <Button key="back" onClick={this.onClose}>返回</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk} disabled={flag == 2}>
              提交
            </Button>,
          ]}
        // style={{
        //   // overflow: 'auto',
        //   height: '90%',
        //   marginTop: '-5%',
        //   paddingBottom: '108px',
        // }}
        >
          <Anchor
            affix={false}
            showInkInFixed
            onClick={handleClick}
            style={{
              position: 'absolute',
              left: '5px',
              top: '780',
            }}
            getContainer={() => document.getElementById('mainForm')}
          >
            <Link href="#basic" title="基础信息" />
            <Link href="#network" title="网络信息" />
            <Link href="#position" title="位置信息" />
            <Link href="#other" title="其他信息" />
            <Link href="#aux" title="附件信息" />
          </Anchor>,
          <Form
            id="mainForm"
            layout="vertical"
            style={{
              marginLeft: '100px',
              marginTop: '-20px',
              overflow: 'auto',
              maxHeight: '500px',
              padding: '0px 8px',
            }}
          >
            <Row gutter={16} visible={flag == 2 || flag == 3}>
              <Col span={(flag == 1) ? 0 : 12}>
                <div>
                  <Tooltip placement="right" title="设备编号">
                    <span style={{ fontSize: 28 }}>{entity.deviceid}</span>
                  </Tooltip>
                  <div>
                    <Tooltip placement="right" title="设备名称">
                      <span>{entity.devicename}</span>
                    </Tooltip>
                  </div>
                </div>
              </Col>
              <Col span={(flag == 1) ? 0 : 12}>
                <span style={{ paddingRight: 15 }}>设备状态：正常</span>
                <Tooltip placement="right" title="设备状态：正常"><Icon type="check-circle" style={{ color: 'green', fontSize: 40 }} /></Tooltip>
                {/* {this.getAvatar(entity)} */}
              </Col>
            </Row>
            <Divider orientation="left" id="basic">基础信息</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备类型">
                  {getFieldDecorator('devicetype', {
                    initialValue: entity.devicetype,
                    // rules: [{ required: true }],
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(DEV_TYPE)}</Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="设备编号">
                  {getFieldDecorator('deviceid', {
                    initialValue: entity.deviceid,
                    rules: [{ required: true }],
                  })(
                    <Input
                      disabled={flag == 2 || flag == 3}
                      placeholder=""
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备名称">
                  {getFieldDecorator('devicename', {
                    initialValue: entity.devicename,
                    rules: [{ required: true, message: '请输入设备名称' }],
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="电警编号">
                  {getFieldDecorator('epdeviceid', {
                    initialValue: entity.epdeviceid,
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备状态">
                  {getFieldDecorator('devicestatus', {
                    initialValue: entity.devicestatus,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(ENUM_STATUS)}</Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="使用状态">
                  {getFieldDecorator('servicestatus', {
                    initialValue: entity.servicestatus,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(STATE)}</Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备型号">
                  {getFieldDecorator('devicemodel', {
                    initialValue: entity.devicemodel,
                  })(
                    <Input
                      disabled={flag == 2}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备分辨率">
                  {getFieldDecorator('deviceresolution', {
                    initialValue: entity.deviceresolution,
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="实时视频路径">
                  {getFieldDecorator('rtspurl', {
                    initialValue: entity.rtspurl,
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="拍摄位置">
                  {getFieldDecorator('camerapos', {
                    initialValue: entity.camerapos,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(PSWZ)}</Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left" id="network">网络信息</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备IP地址">
                  {getFieldDecorator('deviceip', {
                    initialValue: entity.deviceip,
                    rules: [{ pattern: ipreg, message: '请输入正确的IP地址' }],
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备MAC地址">
                  {getFieldDecorator('devicemac', {
                    initialValue: entity.devicemac,
                    rules: [{ pattern: macreg, message: '请输入正确的MAC地址' }],
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备网关">
                  {getFieldDecorator('gatewayip', {
                    initialValue: entity.gatewayip,
                    rules: [{ pattern: ipreg, message: '请输入正确的IP地址' }],
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="接口服务器ip">
                  {getFieldDecorator('interfaceip', {
                    initialValue: entity.interfaceip,
                    rules: [{ pattern: ipreg, message: '请输入正确的IP地址' }],
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备提供商">
                  {getFieldDecorator('provider', {
                    initialValue: entity.provider,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(SBTGS)}</Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left" id="position">位置信息</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="行政区域">
                  {getFieldDecorator('districtid', {
                    initialValue: entity.districtid,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(XZQY)}</Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="环形区域">
                  {getFieldDecorator('annularid', {
                    initialValue: entity.annularid,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(ANNULAR_REGION)}</Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="路段">
                  {getFieldDecorator('sectionid', {
                    initialValue: entity.sectionid,
                    rules: [{ required: true, message: '请选择所属路段' }],
                  })(
                    <TreeSelect
                      disabled={flag == 2}
                      dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                      treeData={treeData}
                      placeholder="请选择路段"
                      treeDefaultExpandAll
                    // onChange={this.onChange}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="警务区域">
                  {getFieldDecorator('departmentid')(
                    <TreeSelect
                      disabled={flag == 2}
                      defaultValue={jingwuValue}
                      dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                      treeData={treeDataJ}
                      placeholder="请选择警务区域"
                      treeDefaultExpandAll
                      onChange={this.onChangeJ}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备位置">
                  {getFieldDecorator('installaddress', {
                    initialValue: entity.installaddress,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(SBWZ)}</Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="所在道路：">
                  {getFieldDecorator('inroad', {
                    initialValue: entity.inroad,
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="行驶方向">
                  {getFieldDecorator('drivedirection', {
                    initialValue: entity.drivedirection,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(DIRECTION)}</Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="安装高度">
                  {getFieldDecorator('installationaltitude', {
                    initialValue: entity.installationaltitude,
                  })(
                    <InputNumber
                      disabled={flag == 2}
                      placeholder="单位：米"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="水平角度">
                  {getFieldDecorator('horizontalangle', {
                    initialValue: entity.horizontalangle,
                  })(
                    <InputNumber
                      disabled={flag == 2}
                      placeholder="单位：度"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="仰视角度">
                  {getFieldDecorator('pitchangle', {
                    initialValue: entity.pitchangle,
                  })(
                    <InputNumber
                      disabled={flag == 2}
                      placeholder="单位：度"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="拍摄方向">
                  {getFieldDecorator('cameradirection', {
                    initialValue: entity.cameradirection,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(PSFX)}</Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="安装经纬度：">
                  {getFieldDecorator('lng_lat', {
                    initialValue: entity.lng_lat,
                    rules: [{ required: false, message: '' }],
                  })}
                  <Button
                    // disabled={flag == 2}
                    // type="environment"
                    onClick={(e) => { this.showMap(); }}
                  // style={{
                  //   fontSize: 20,
                  // }}
                  >显示地图
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left" id="other">其他信息</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备桩号">
                  {getFieldDecorator('devicepileid', {
                    initialValue: entity.devicepileid,
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="汇聚箱编号">
                  {getFieldDecorator('convergenceid', {
                    initialValue: entity.convergenceid,
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="所属项目">
                  {getFieldDecorator('belongtoproj', {
                    initialValue: entity.belongtoproj,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(SSXM)}</Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="施工单位">
                  {getFieldDecorator('developer', {
                    initialValue: entity.developer,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(SGDW)}</Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="维护单位">
                  {getFieldDecorator('maintaindepart', {
                    initialValue: entity.maintaindepart,
                  })(<Select disabled={flag == 2}>{this.handleEnumOption(MAINTENAN_UNIT)}</Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="匝道车道号">
                  {getFieldDecorator('ramplanenum', {
                    initialValue: entity.ramplanenum,
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="公交车道号">
                  {getFieldDecorator('buslanenum', {
                    initialValue: entity.buslanenum,
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="非机动车道号">
                  {getFieldDecorator('nonmotorizedlanenum', {
                    initialValue: entity.nonmotorizedlanenum,
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="断面车道数量">
                  {getFieldDecorator('lanenum', {
                    initialValue: entity.lanenum,
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="是否全覆盖">
                  {getFieldDecorator('istoll', {
                    initialValue: entity.istoll,
                  })(
                    <Select disabled={flag == 2} onChange={(v) => this.handleChangeQFG(v)}>
                      {this.handleEnumOption(ISCOVER)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设备套数">
                  {getFieldDecorator('devicegroupcount', {
                    initialValue: entity.devicegroupcount,
                  })(
                    <Select disabled={flag == 2} onChange={(v) => this.handleChangeSB(v)}>
                      {this.handleEnumOption(SBTS)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="关联设备">
                  {getFieldDecorator('relationdevice', {
                    initialValue: entity.relationdevice,
                  })(
                    <AutoComplete
                      disabled={flag == 2 || !(SBSL > 1)}
                      dataSource={dataSource.map(renderOption)}
                      onSearch={handleSearch}
                      placeholder="输入关联设备编号"
                      optionLabelProp="text"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="直行设备">
                  {getFieldDecorator('straightlinedevice', {
                    initialValue: entity.straightlinedevice,
                  })(
                    <AutoComplete
                      disabled={flag == 2}
                      dataSource={dataSource.map(renderOption)}
                      onSearch={handleSearch}
                      placeholder="请输入设备编号"
                      optionLabelProp="text"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="掉头设备">
                  {getFieldDecorator('turnaround', {
                    initialValue: entity.turnaround,
                  })(
                    <AutoComplete
                      disabled={flag == 2}
                      dataSource={dataSource.map(renderOption)}
                      onSearch={handleSearch}
                      placeholder="请输入设备编号"
                      optionLabelProp="text"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="左转设备">
                  {getFieldDecorator('leftdevice', {
                    initialValue: entity.leftdevice,
                  })(
                    <AutoComplete
                      disabled={flag == 2}
                      dataSource={dataSource.map(renderOption)}
                      onSearch={handleSearch}
                      placeholder="请输入设备编号"
                      optionLabelProp="text"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="右转设备">
                  {getFieldDecorator('rightdevice', {
                    initialValue: entity.rightdevice,
                  })(
                    <AutoComplete
                      disabled={flag == 2}
                      dataSource={dataSource.map(renderOption)}
                      onSearch={handleSearch}
                      placeholder="请输入设备编号"
                      optionLabelProp="text"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="覆盖车道数量">
                  {getFieldDecorator('camaralanenum', {
                    initialValue: entity.camaralanenum,
                  })(
                    <InputNumber
                      min={0}
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="覆盖车道详情">
                  {getFieldDecorator('camaralanedetail', {
                    initialValue: entity.camaralanedetail,
                  })(
                    <Input
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="直行距离">
                  {getFieldDecorator('distanceStraight', {
                    initialValue: entity.straight,
                  })(
                    <InputNumber
                      disabled={flag == 2}
                      placeholder="单位：米"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="掉头距离">
                  {getFieldDecorator('distanceTurnaround', {
                    initialValue: entity.distanceturnaround,
                  })(
                    <InputNumber
                      disabled={flag == 2}
                      placeholder="单位：米"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="左转距离">
                  {getFieldDecorator('distanceLeft', {
                    initialValue: entity.left,
                  })(
                    <InputNumber
                      disabled={flag == 2}
                      placeholder="单位：米"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="右转距离">
                  {getFieldDecorator('distanceRight', {
                    initialValue: entity.right,
                  })(
                    <InputNumber
                      disabled={flag == 2}
                      placeholder="单位：米"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="路口距离">
                  {getFieldDecorator('distanceIntersection', {
                    initialValue: entity.intersection,
                  })(
                    <InputNumber
                      disabled={flag == 2}
                      placeholder="单位：米"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="路口中心点距离">
                  {getFieldDecorator('distanceCenterpoint', {
                    initialValue: entity.centerpoint,
                  })(
                    <InputNumber
                      disabled={flag == 2}
                      placeholder="单位：米"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="补光灯个数">
                  {getFieldDecorator('complementarylampcount', {
                    initialValue: entity.complementarylampcount,
                  })(
                    <InputNumber
                      disabled={flag == 2}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left" id="aux">附件信息</Divider>
            <Row gutter={16} style={{ 'padding-bottom': '15px' }}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="审核附件">
                  <Upload
                    action={urlfile}
                    fileList={fileList}
                    onChange={this.handleChange}
                    onRemove={this.imageRemovex}
                  >
                    <Button disabled={flag == 2}>
                      <Icon type="upload" />选择文件
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="外场图片1">
                  {getFieldDecorator('pic1', {
                  })(
                    <div className="clearfix">
                      <Upload
                        name="images"
                        action={url1}
                        accept="image/*"
                        listType="picture-card"
                        fileList={fileList1}
                        // beforeUpload={beforeUpload}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange1}
                        onRemove={this.imageRemove}
                      >
                        {/* {url ? <img src={url} alt="1" title="123" /> : uploadButton} */}
                        {((fileList1.length >= 1) || flag == 2) ? null : uploadButton}
                      </Upload>
                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                    </div>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="外场图片2">
                  {getFieldDecorator('pic2', {
                  })(
                    <div className="clearfix">
                      <Upload
                        name="images"
                        action={url2}
                        accept="image/*"
                        listType="picture-card"
                        fileList={fileList2}
                        // beforeUpload={beforeUpload}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange2}
                        onRemove={this.imageRemove}
                      >
                        {/* {url ? <img src={url} alt="1" title="123" /> : uploadButton} */}
                        {((fileList2.length >= 1) || flag == 2) ? null : uploadButton}
                      </Upload>
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="内场图片">
                  {getFieldDecorator('pic1', {
                  })(
                    <div className="clearfix">
                      <Upload
                        name="images"
                        action={url3}
                        accept="image/*"
                        listType="picture-card"
                        fileList={fileList3}
                        // beforeUpload={beforeUpload}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange3}
                        onRemove={this.imageRemove}
                      >
                        {/* {url ? <img src={url} alt="1" title="123" /> : uploadButton} */}
                        {((fileList3.length >= 1) || flag == 2) ? null : uploadButton}
                      </Upload>
                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                    </div>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设计图片">
                  {getFieldDecorator('pic2', {
                  })(
                    <div className="clearfix">
                      <Upload
                        name="images"
                        action={url4}
                        accept="image/*"
                        listType="picture-card"
                        fileList={fileList4}
                        // beforeUpload={beforeUpload}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange4}
                        onRemove={this.imageRemove}
                      >
                        {/* {url ? <img src={url} alt="1" title="123" /> : uploadButton} */}
                        {((fileList4.length >= 1) || flag == 2) ? null : uploadButton}
                      </Upload>
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="曲化图片">
                  {getFieldDecorator('pic1', {
                  })(
                    <div className="clearfix">
                      <Upload
                        name="images"
                        action={url5}
                        accept="image/*"
                        listType="picture-card"
                        fileList={fileList5}
                        // beforeUpload={beforeUpload}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange5}
                        onRemove={this.imageRemove}
                      >
                        {/* {url ? <img src={url} alt="1" title="123" /> : uploadButton} */}
                        {((fileList5.length >= 1) || flag == 2) ? null : uploadButton}
                      </Upload>
                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                    </div>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="预留图片">
                  {getFieldDecorator('pic2', {
                  })(
                    <div className="clearfix">
                      <Upload
                        name="images"
                        action={url6}
                        accept="image/*"
                        listType="picture-card"
                        fileList={fileList6}
                        // beforeUpload={beforeUpload}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange6}
                        onRemove={this.imageRemove}
                      >
                        {/* {url ? <img src={url} alt="1" title="123" /> : uploadButton} */}
                        {((fileList6.length >= 1) || flag == 2) ? null : uploadButton}
                      </Upload>
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Dialog {...mapProp} />
      </div>
    );
  }
}
DeviceInfoSelect.prototypes = {
  enumList: PropTypes.array.isRequired,
};

export default Form.create()(DeviceInfoSelect);
