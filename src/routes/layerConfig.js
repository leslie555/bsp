import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal, message } from 'antd';
import List from '../components/layerConfig/layerConfigList';


class layerConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      editMode: '', // 'add'：添加，2：详情，'edit'：编辑
      begindate: moment(), // 添加界面初始时间
      record: [], // 每条数据
    };
  }

  // componentWillMount() {
  //   const { dispatch } = this.props;
  //   dispatch({ type: 'layerConfigModel/queryAllLayers', payload: { } });
  // }

  render() {
    console.log(this.props);
    const { layerConfigModel } = this.props;
    const { editMode, visible, begindate, record } = this.state;
    const jtsbLayer = [
      // 交通设备图层图层
      { label: '视频监控', value: '101' },
      { label: '公路卡口', value: '102' },
      { label: '电子警察', value: '103' },
      { label: '超速检测', value: '104' },
      { label: '交通诱导', value: '105' },
      { label: '交通信号', value: '106' },
      { label: '流量检测', value: '107' },
      { label: '事件检测', value: '108' },
      { label: '视频抓拍', value: '109' },
      { label: '喊话设备', value: '110' },
      { label: '雾区防撞设备', value: '111' },
      { label: '气象检测设备', value: '112' },
    ];
    const jtlkLayer = [
      // 交通路况图层
      { label: '路况信息', value: '201' },
      { label: '交通事件', value: '202' },
      { label: 'GPS警力', value: '203' },
      { label: '积水点', value: '207' },
      { label: '积雪路段', value: '208' },
      { label: '积雪区域', value: '209' },
      { label: '警务通', value: '210' },
      { label: '单警终端', value: '211' },
    ];
    const qwfqLayer = [
      // 勤务分区图层
      { label: '警区', value: '301' },
      { label: '警区勤务警力', value: '302' },
      { label: '中队勤务警力', value: '303' },
      { label: '高峰事故警力', value: '304' },
    ];
    const jgxxLayer = [
      // 交管信息图层
      { label: '占路施工', value: '401' },
      { label: '交通管制', value: '402' },
    ];
    const jtssLayer = [
      // 交通设施图层
      { label: '高速公路设施', value: '501' },
      { label: '信号灯', value: '502' },
      { label: '护栏', value: '503' },
      { label: '道路交通标志', value: '504' },
      { label: '道路交通标线', value: '505' },
    ];
    const jjxqLayer = [
      // 交警辖区分界
      { label: '大队管辖区域', value: '601' },
      { label: '中队管辖区域', value: '602' },
      { label: '警区管辖区域', value: '603' },
    ];
    const jtjcLayer = [
      // 交通基础信息
      { label: '隧道', value: '701' },
      { label: '互通立交', value: '702' },
      { label: '高速服务区', value: '703' },
      { label: '高速出入口', value: '704' },
      { label: '高速收费站', value: '705' },
      { label: '高速执法站', value: '706' },
    ];
    const yjzyLayer = [
      // 应急资源图层
      { label: '高速公路管理部门', value: '801' },
      { label: '交通管理部门', value: '802' },
      { label: '路政管理部门', value: '803' },
      { label: '公安', value: '804' },
      { label: '消防(119)', value: '805' },
      { label: '应急办', value: '806' },
      { label: '医疗救护', value: '807' },
      { label: '安检', value: '808' },
      { label: '其它', value: '809' },
    ];
    const { enums, queryobj, list, info, pagination, checkedarr, selectedrows,
      showJtsb, // 交通设备
      showJtlk, // 交通路况
      showQwfq, // 勤务分区
      showJgxx, // 交管信息
      showJtss, // 交通设施
      showJjxq, // 交警辖区
      showJtjc, // 交通基础
      showYjzy, // 应急资源
      allLayer, // 所有的图层
      allJtsb, // 所有的交通设备
      allJtlk,
      allQwfq,
      allJgxx,
      allJtss,
      allJjxq,
      allJtjc,
      allYjzy,
      flag, // 权限标记，用于判断页面内容是否显示
    } = layerConfigModel;
    const { dispatch, loading } = this.props;
    // 列表组件用到的props
    const listprops = {
      flag, // 权限标记
      jtsbLayer, // 交通设备图层图层
      jtlkLayer, // 交通路况图层
      qwfqLayer, // 勤务分区图层
      jgxxLayer, // 交管信息图层
      jtssLayer, // 交通设施图层
      jjxqLayer, // 交警辖区分界
      jtjcLayer, // 交通基础信息
      yjzyLayer, // 应急资源图层
      showJtsb, // 交通设备
      showJtlk, // 交通路况
      showQwfq, // 勤务分区
      showJgxx, // 交管信息
      showJtss, // 交通设施
      showJjxq, // 交警辖区
      showJtjc, // 交通基础
      showYjzy, // 应急资源
      allLayer, // 所有的图层
      allJtsb, // 所有的交通设备
      allJtlk,
      allQwfq,
      allJgxx,
      allJtss,
      allJjxq,
      allJtjc,
      allYjzy,
      enums,
      pagination,
      list,
      info,
      checkedarr,
      selectedrows,
      loading,
      // 分页
      query() {
        dispatch({
          type: 'layerConfigModel/queryAllLayers',
          payload: { },
        });
      },
    };

    return (
      <div className="router_layer_size" style={{ padding: '10px' }}>
        <List {...listprops} />
      </div>
    );
  }
}

function mapStateToProps({ layerConfigModel, common, loading }) {
  return { layerConfigModel, common, loading: loading.models.layerConfigModel };
}

export default connect(mapStateToProps)(layerConfig);
