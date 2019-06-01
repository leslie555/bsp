import React, { Component } from 'react';
import { Table, Icon, Button, Form, notification, Card, Row, Col, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { saveLayerConfig } from '../../services/layerConfig';
import styles from './layerConfigList.less';

const CheckboxGroup = Checkbox.Group;
class layerConfigList extends Component {
  constructor(props) {
    console.log('com');
    const {
      showJtsb = [],
      showJtlk = [],
      showQwfq = [],
      showJgxx = [],
      showJtss = [],
      showJjxq = [],
      showJtjc = [],
      showYjzy = [],
    } = props;
    super(props);
    // const { selectedRowKeys } = this.props;
    this.state = {
      jtsbCheckedList: showJtsb, // 交通设备 ,存储所有被选中的选项的数组
      jtlkCheckedList: showJtlk, // 交通路况
      qwfqCheckedList: showQwfq, // 勤务分区
      jgxxCheckedList: showJgxx, // 交管信息
      jtssCheckedList: showJtss, // 交通设施
      jjxqCheckedList: showJjxq, // 交警辖区
      jtjcCheckedList: showJtjc, // 交通基础
      yjzyCheckedList: showYjzy, // 应急资源
      jtsbIndeterminate: !!showJtsb.length & showJtsb.length < 12, // 是否被选中，仅影响样式
      jtlkIndeterminate: !!showJtlk.length & showJtlk.length < 8, // 是否被选中，仅影响样式
      qwfqIndeterminate: !!showQwfq.length & showQwfq.length < 4, // 是否被选中，仅影响样式
      jgxxIndeterminate: !!showJgxx.length & showJgxx.length < 2, // 是否被选中，仅影响样式
      jtssIndeterminate: !!showJtss.length & showJtss.length < 5, // 是否被选中，仅影响样式
      jjxqIndeterminate: !!showJjxq.length & showJjxq.length < 3, // 是否被选中，仅影响样式
      jtjcIndeterminate: !!showJtjc.length & showJtjc.length < 6, // 是否被选中，仅影响样式
      yjzyIndeterminate: !!showYjzy.length & showYjzy.length < 9, // 是否被选中，仅影响样式
      jtsbCheckAll: showJtsb.length == 12, // 当前总选项是否被全选。
      jtlkCheckAll: showJtlk.length == 8, // 当前总选项是否被全选。
      qwfqCheckAll: showQwfq.length == 4,
      jgxxCheckAll: showJgxx.length == 2,
      jtssCheckAll: showJtss.length == 5,
      jjxqCheckAll: showJjxq.length == 3,
      jtjcCheckAll: showJtjc.length == 6,
      yjzyCheckAll: showYjzy.length == 9,
    };
  }

  // componentDidMount() {
  //   console.log('DidMount');
  //   console.log(this.props);
  //   const {
  //     showJtsb,
  //   } = this.props;
  //   this.setState({
  //     jtsbCheckedList: showJtsb, // 判断当前被选中选项
  //     // 当前 是否为半选中状态，空和全选状态为false；
  //     jtsbIndeterminate: !!showJtsb.length && showJtsb.length < 12,
  //     // 当前是否为全选状态，不是为false，全选为true
  //     jtsbCheckAll: showJtsb.length == 12,
  //   });
  // }

  componentWillReceiveProps(nextProps) {
    console.log('123');
    const {
      showJtsb,
      showJtlk,
      showQwfq,
      showJgxx,
      showJtss,
      showJjxq,
      showJtjc,
      showYjzy,
    } = this.props;
    if (nextProps && nextProps.showJtsb && nextProps.showJtsb != showJtsb) {
      this.setState({
        jtsbCheckedList: nextProps.showJtsb, // 判断当前被选中选项
        // 当前是否为半选中状态，空和全选状态为false；
        jtsbIndeterminate: !!nextProps.showJtsb.length && nextProps.showJtsb.length < 12,
        // 当前是否为全选状态，不是为false，全选为true
        jtsbCheckAll: nextProps.showJtsb.length == 12,
      });
    }
    if (nextProps && nextProps.showJtlk && nextProps.showJtlk != showJtlk) {
      this.setState({
        jtlkCheckedList: nextProps.showJtlk,
        jtlkIndeterminate: !!nextProps.showJtlk.length && nextProps.showJtlk.length < 8,
        jtlkCheckAll: nextProps.showJtlk.length == 8,
      });
    }
    if (nextProps && nextProps.showQwfq && nextProps.showQwfq != showQwfq) {
      this.setState({
        qwfqCheckedList: nextProps.showQwfq,
        qwfqIndeterminate: !!nextProps.showQwfq.length && nextProps.showQwfq.length < 4,
        qwfqCheckAll: nextProps.showQwfq.length == 4,
      });
    }
    if (nextProps && nextProps.showJgxx && nextProps.showJgxx != showJgxx) {
      this.setState({
        jgxxCheckedList: nextProps.showJgxx,
        jgxxIndeterminate: !!nextProps.showJgxx.length && nextProps.showJgxx.length < 2,
        jgxxCheckAll: nextProps.showJgxx.length == 2,
      });
    }
    if (nextProps && nextProps.showJtss && nextProps.showJtss != showJtss) {
      this.setState({
        jtssCheckedList: nextProps.showJtss,
        jtssIndeterminate: !!nextProps.showJtss.length && nextProps.showJtss.length < 5,
        jtssCheckAll: nextProps.showJtss.length == 5,
      });
    }
    if (nextProps && nextProps.showJjxq && nextProps.showJjxq != showJjxq) {
      this.setState({
        jjxqCheckedList: nextProps.showJjxq,
        jjxqIndeterminate: !!nextProps.showJjxq.length && nextProps.showJjxq.length < 3,
        jjxqCheckAll: nextProps.showJjxq.length == 3,
      });
    }
    if (nextProps && nextProps.showJtjc && nextProps.showJtjc != showJtjc) {
      this.setState({
        jtjcCheckedList: nextProps.showJtjc,
        jtjcIndeterminate: !!nextProps.showJtjc.length && nextProps.showJtjc.length < 6,
        jtjcCheckAll: nextProps.showJtjc.length == 6,
      });
    }
    if (nextProps && nextProps.showYjzy && nextProps.showYjzy != showYjzy) {
      this.setState({
        yjzyCheckedList: nextProps.showYjzy,
        yjzyIndeterminate: !!nextProps.showYjzy.length && nextProps.showYjzy.length < 9,
        yjzyCheckAll: nextProps.showYjzy.length == 9,
      });
    }
  }

  // 交通设备复选框设置
  jtsbOnChange = (jtsbCheckedList) => {
    const { jtsbLayer } = this.props;
    console.log('jtsbCheckedList');
    console.log(jtsbCheckedList);
    this.setState({
      jtsbCheckedList,
      jtsbIndeterminate: !!jtsbCheckedList.length && jtsbCheckedList.length < jtsbLayer.length,
      jtsbCheckAll: jtsbCheckedList.length === jtsbLayer.length,
    });
  };

  jtlkOnChange = (jtlkCheckedList) => {
    const { jtlkLayer } = this.props;
    this.setState({
      jtlkCheckedList,
      jtlkIndeterminate: !!jtlkCheckedList.length && jtlkCheckedList.length < jtlkLayer.length,
      jtlkCheckAll: jtlkCheckedList.length === jtlkLayer.length,
    });
  };

  qwfqOnChange = (qwfqCheckedList) => {
    const { qwfqLayer } = this.props;
    this.setState({
      qwfqCheckedList,
      qwfqIndeterminate: !!qwfqCheckedList.length && qwfqCheckedList.length < qwfqLayer.length,
      qwfqCheckAll: qwfqCheckedList.length === qwfqLayer.length,
    });
  };

  jgxxOnChange = (jgxxCheckedList) => {
    const { jgxxLayer } = this.props;
    this.setState({
      jgxxCheckedList,
      jgxxIndeterminate: !!jgxxCheckedList.length && jgxxCheckedList.length < jgxxLayer.length,
      jgxxCheckAll: jgxxCheckedList.length === jgxxLayer.length,
    });
  };

  jtssOnChange = (jtssCheckedList) => {
    const { jtssLayer } = this.props;
    this.setState({
      jtssCheckedList,
      jtssIndeterminate: !!jtssCheckedList.length && jtssCheckedList.length < jtssLayer.length,
      jtssCheckAll: jtssCheckedList.length === jtssLayer.length,
    });
  };

  jjxqOnChange = (jjxqCheckedList) => {
    const { jjxqLayer } = this.props;
    this.setState({
      jjxqCheckedList,
      jjxqIndeterminate: !!jjxqCheckedList.length && jjxqCheckedList.length < jjxqLayer.length,
      jjxqCheckAll: jjxqCheckedList.length === jjxqLayer.length,
    });
  };

  jtjcOnChange = (jtjcCheckedList) => {
    const { jtjcLayer } = this.props;
    this.setState({
      jtjcCheckedList,
      jtjcIndeterminate: !!jtjcCheckedList.length && jtjcCheckedList.length < jtjcLayer.length,
      jtjcCheckAll: jtjcCheckedList.length === jtjcLayer.length,
    });
  };

  yjzyOnChange = (yjzyCheckedList) => {
    const { yjzyLayer } = this.props;
    this.setState({
      yjzyCheckedList,
      yjzyIndeterminate: !!yjzyCheckedList.length && yjzyCheckedList.length < yjzyLayer.length,
      yjzyCheckAll: yjzyCheckedList.length === yjzyLayer.length,
    });
  };

  jtsbCheckAllChange = (e) => {
    const { jtsbLayer } = this.props;
    const checkedValues = [];
    for (let i = 0; i < jtsbLayer.length; i += 1) {
      checkedValues.push(jtsbLayer[i].value);
    }
    this.setState({
      jtsbCheckedList: e.target.checked ? checkedValues : [],
      jtsbIndeterminate: false,
      jtsbCheckAll: e.target.checked,
    });
  };

  jtlkCheckAllChange = (e) => {
    const { jtlkLayer } = this.props;
    const checkedValues = [];
    for (let i = 0; i < jtlkLayer.length; i += 1) {
      checkedValues.push(jtlkLayer[i].value);
    }
    this.setState({
      jtlkCheckedList: e.target.checked ? checkedValues : [],
      jtlkIndeterminate: false,
      jtlkCheckAll: e.target.checked,
    });
  };

  qwfqCheckAllChange = (e) => {
    const { qwfqLayer } = this.props;
    const checkedValues = [];
    for (let i = 0; i < qwfqLayer.length; i += 1) {
      checkedValues.push(qwfqLayer[i].value);
    }
    this.setState({
      qwfqCheckedList: e.target.checked ? checkedValues : [],
      qwfqIndeterminate: false,
      qwfqCheckAll: e.target.checked,
    });
  };

  jgxxCheckAllChange = (e) => {
    const { jgxxLayer } = this.props;
    const checkedValues = [];
    for (let i = 0; i < jgxxLayer.length; i += 1) {
      checkedValues.push(jgxxLayer[i].value);
    }
    this.setState({
      jgxxCheckedList: e.target.checked ? checkedValues : [],
      jgxxIndeterminate: false,
      jgxxCheckAll: e.target.checked,
    });
  };

  jtssCheckAllChange = (e) => {
    const { jtssLayer } = this.props;
    const checkedValues = [];
    for (let i = 0; i < jtssLayer.length; i += 1) {
      checkedValues.push(jtssLayer[i].value);
    }
    this.setState({
      jtssCheckedList: e.target.checked ? checkedValues : [],
      jtssIndeterminate: false,
      jtssCheckAll: e.target.checked,
    });
  };

  jjxqCheckAllChange = (e) => {
    const { jjxqLayer } = this.props;
    const checkedValues = [];
    for (let i = 0; i < jjxqLayer.length; i += 1) {
      checkedValues.push(jjxqLayer[i].value);
    }
    this.setState({
      jjxqCheckedList: e.target.checked ? checkedValues : [],
      jjxqIndeterminate: false,
      jjxqCheckAll: e.target.checked,
    });
  };

  jtjcCheckAllChange = (e) => {
    const { jtjcLayer } = this.props;
    const checkedValues = [];
    for (let i = 0; i < jtjcLayer.length; i += 1) {
      checkedValues.push(jtjcLayer[i].value);
    }
    this.setState({
      jtjcCheckedList: e.target.checked ? checkedValues : [],
      jtjcIndeterminate: false,
      jtjcCheckAll: e.target.checked,
    });
  };

  yjzyCheckAllChange = (e) => {
    const { yjzyLayer } = this.props;
    const checkedValues = [];
    for (let i = 0; i < yjzyLayer.length; i += 1) {
      checkedValues.push(yjzyLayer[i].value);
    }
    this.setState({
      yjzyCheckedList: e.target.checked ? checkedValues : [],
      yjzyIndeterminate: false,
      yjzyCheckAll: e.target.checked,
    });
  };

  // 重置
  layerReset = () => {
    const {
      showJtsb,
      showJtlk,
      showQwfq,
      showJgxx,
      showJtss,
      showJjxq,
      showJtjc,
      showYjzy,
    } = this.props;
    this.setState({
      jtsbCheckedList: showJtsb,
      jtlkCheckedList: showJtlk,
      qwfqCheckedList: showQwfq,
      jgxxCheckedList: showJgxx,
      jtssCheckedList: showJtss,
      jjxqCheckedList: showJjxq,
      jtjcCheckedList: showJtjc,
      yjzyCheckedList: showYjzy,
      jtsbIndeterminate: !!showJtsb.length && showJtsb.length < 12,
      jtsbCheckAll: showJtsb.length === 12,
      jtlkIndeterminate: !!showJtlk.length && showJtlk.length < 8,
      jtlkCheckAll: showJtlk.length === 8,
      qwfqIndeterminate: !!showQwfq.length && showQwfq.length < 4,
      qwfqCheckAll: showQwfq.length === 4,
      jgxxIndeterminate: !!showJgxx.length && showJgxx.length < 2,
      jgxxCheckAll: showJgxx.length === 2,
      jtssIndeterminate: !!showJtss.length && showJtss.length < 5,
      jtssCheckAll: showJtss.length === 5,
      jjxqIndeterminate: !!showJjxq.length && showJjxq.length < 3,
      jjxqCheckAll: showJjxq.length === 3,
      jtjcIndeterminate: !!showJtjc.length && showJtjc.length < 6,
      jtjcCheckAll: showJtjc.length === 6,
      yjzyIndeterminate: !!showYjzy.length && showYjzy.length < 9,
      yjzyCheckAll: showYjzy.length === 9,
    });
  };

  // 保存 格式[1:true,101:false] string 型
  // 先取出1-8的总的数据，将剩余的数据与修改后的对比，存在的即为选中的--true，
  // 不存在的即为未选中的--false,再对个位数总的的进行判断 。
  layerSave = () => {
    const {
      jtsbCheckedList,
      jtlkCheckedList,
      qwfqCheckedList,
      jgxxCheckedList,
      jtssCheckedList,
      jjxqCheckedList,
      jtjcCheckedList,
      yjzyCheckedList,
    } = this.state;
    const { allLayer } = this.props;
    const arr = jtsbCheckedList
      .concat(jtlkCheckedList)
      .concat(qwfqCheckedList)
      .concat(jgxxCheckedList)
      .concat(jtssCheckedList)
      .concat(jjxqCheckedList)
      .concat(jtjcCheckedList)
      .concat(yjzyCheckedList);
    console.log(arr);
    const saveAll = []; // 存储的所有的图层
    const showAll = [];
    for (let a = 0; a < allLayer.length; a += 1) {
      if (allLayer[a].length > 1) {
        showAll.push(allLayer[a]);
      }
    }
    // 对每个小项进行保存
    for (let i = 0; i < showAll.length; i += 1) {
      if (arr.length < 1) {
        //  如果所有图层都为false
        for (let e = 0; e < showAll.length; e += 1) {
          let temp = '';
          temp = `${showAll[i]}:false`;
          saveAll.push(temp);
        }
      } else {
        for (let j = 0; j < arr.length; j += 1) {
          let temp = '';
          if (showAll[i] == arr[j]) {
            if (saveAll.length == i) {
              temp = `${showAll[i]}:true`;
              saveAll.push(temp);
              break;
            } else {
              temp = `${showAll[i]}:true`;
              saveAll.splice(i, 1, temp);
              break;
            }
          }
          if (saveAll.length == i) {
            temp = `${showAll[i]}:false`;
            saveAll.push(temp);
          } else {
            temp = `${showAll[i]}:false`;
            saveAll.splice(i, 1, temp);
          }
        }
      }
    }
    // 对每个大项进行保存
    if (jtsbCheckedList.length > 0) {
      saveAll.push('1:true');
    } else {
      saveAll.push('1:false');
    }
    if (jtlkCheckedList.length > 0) {
      saveAll.push('2:true');
    } else {
      saveAll.push('2:false');
    }
    if (qwfqCheckedList.length > 0) {
      saveAll.push('3:true');
    } else {
      saveAll.push('3:false');
    }
    if (jgxxCheckedList.length > 0) {
      saveAll.push('4:true');
    } else {
      saveAll.push('4:false');
    }
    if (jtssCheckedList.length > 0) {
      saveAll.push('5:true');
    } else {
      saveAll.push('5:false');
    }
    if (jjxqCheckedList.length > 0) {
      saveAll.push('6:true');
    } else {
      saveAll.push('6:false');
    }
    if (jtjcCheckedList.length > 0) {
      saveAll.push('7:true');
    } else {
      saveAll.push('7:false');
    }
    if (yjzyCheckedList.length > 0) {
      saveAll.push('8:true');
    } else {
      saveAll.push('8:false');
    }
    const saveStr = saveAll.toString();
    saveLayerConfig({ saveStr })
      .then((data) => {
        if (data.result) {
          notification.success({ message: '保存成功！需要在地图页面刷新，配置方可生效' });
          const { query } = this.props;
          query();
        } else {
          notification.error({ message: '保存失败！' });
        }
      })
      .catch((e) => {
        notification.error({ message: '保存失败！' });
      });
  };

  render() {
    const {
      jtsbLayer,
      jtlkLayer,
      qwfqLayer,
      jgxxLayer,
      jtssLayer,
      jjxqLayer,
      jtjcLayer,
      yjzyLayer,
      flag,
    } = this.props;
    const {
      jtsbCheckedList,
      jtlkCheckedList,
      qwfqCheckedList,
      jgxxCheckedList,
      jtssCheckedList,
      jjxqCheckedList,
      jtjcCheckedList,
      yjzyCheckedList,
      jtsbIndeterminate,
      jtlkIndeterminate,
      qwfqIndeterminate,
      jgxxIndeterminate,
      jtssIndeterminate,
      jjxqIndeterminate,
      jtjcIndeterminate,
      yjzyIndeterminate,
      jtsbCheckAll,
      jtlkCheckAll,
      qwfqCheckAll,
      jgxxCheckAll,
      jtssCheckAll,
      jjxqCheckAll,
      jtjcCheckAll,
      yjzyCheckAll,
    } = this.state;
    console.log(jtsbCheckedList);

    return (
      <div style={{ width: '100%' }} className={styles.rowStyle}>
        <Row style={{ width: '100%', display: flag ? '' : 'none' }}>
          <Card style={{ width: '100%' }} className={styles.cardStyle}>
            <Col
              span={3}
              style={{ textAlign: 'center' }}
              className={styles.colStyle}
            >
              <div className={styles.left_card_title_wrapper}>
                <div className={styles.left_card_title_img}>
                  <img
                    src={require('../../assets/layerConfig/jtsb.png')}
                    alt="无法显示图片"
                    height="40px"
                    width="40px"
                    style={{ bottom: '1px' }}
                  />
                </div>
                <div className={styles.left_card_title_checkbox}>
                  <Checkbox
                    indeterminate={jtsbIndeterminate}
                    onChange={this.jtsbCheckAllChange}
                    checked={jtsbCheckAll}
                  />
                </div>
              </div>
              <div className={styles.boxStyle}>交通设备</div>
            </Col>
            <Col span={1} />
            <Col span={20} className={styles.small_button}>
              <CheckboxGroup
                options={jtsbLayer}
                style={{ width: '100%', textAlign: 'left' }}
                value={jtsbCheckedList}
                onChange={this.jtsbOnChange}
              />
            </Col>
          </Card>
        </Row>
        <Row style={{ width: '100%', display: flag ? '' : 'none' }}>
          <Card style={{ width: '100%' }} className={styles.cardStyle}>
            <Col
              span={3}
              style={{ textAlign: 'center' }}
              className={styles.colStyle}
            >
              <div className={styles.left_card_title_wrapper}>
                <div className={styles.left_card_title_img}>
                  <img
                    src={require('../../assets/layerConfig/jtlk.png')}
                    alt="无法显示图片"
                    height="40px"
                    width="40px"
                    style={{ bottom: '1px' }}
                  />
                </div>
                <div className={styles.left_card_title_checkbox}>
                  <Checkbox
                    indeterminate={jtlkIndeterminate}
                    onChange={this.jtlkCheckAllChange}
                    checked={jtlkCheckAll}
                  />
                </div>
              </div>
              <div className={styles.boxStyle}>交通路况</div>
            </Col>
            <Col span={1} />
            <Col span={20}>
              <CheckboxGroup
                options={jtlkLayer}
                style={{ width: '100%', textAlign: 'left' }}
                value={jtlkCheckedList}
                onChange={this.jtlkOnChange}
              />
            </Col>
          </Card>
        </Row>
        <Row style={{ width: '100%', display: flag ? '' : 'none' }}>
          <Card style={{ width: '100%' }} className={styles.cardStyle}>
            <Col
              span={3}
              style={{ textAlign: 'center' }}
              className={styles.colStyle}
            >
              <div className={styles.left_card_title_wrapper}>
                <div className={styles.left_card_title_img}>
                  <img
                    src={require('../../assets/layerConfig/qwfq.png')}
                    alt="无法显示图片"
                    height="40px"
                    width="40px"
                    style={{ bottom: '1px' }}
                  />
                </div>
                <div className={styles.left_card_title_checkbox}>
                  <Checkbox
                    indeterminate={qwfqIndeterminate}
                    onChange={this.qwfqCheckAllChange}
                    checked={qwfqCheckAll}
                  />
                </div>
              </div>
              <div className={styles.boxStyle}>勤务分区</div>
            </Col>
            <Col span={1} />
            <Col span={20}>
              <CheckboxGroup
                options={qwfqLayer}
                style={{ width: '100%', textAlign: 'left' }}
                value={qwfqCheckedList}
                onChange={this.qwfqOnChange}
              />
            </Col>
          </Card>
        </Row>
        <Row style={{ width: '100%', display: flag ? '' : 'none' }}>
          <Card style={{ width: '100%' }} className={styles.cardStyle}>
            <Col
              span={3}
              style={{ textAlign: 'center' }}
              className={styles.colStyle}
            >
              <div className={styles.left_card_title_wrapper}>
                <div className={styles.left_card_title_img}>
                  <img
                    src={require('../../assets/layerConfig/jgxx.png')}
                    alt="无法显示图片"
                    height="40px"
                    width="40px"
                    style={{ bottom: '1px' }}
                  />
                </div>
                <div className={styles.left_card_title_checkbox}>
                  <Checkbox
                    indeterminate={jgxxIndeterminate}
                    onChange={this.jgxxCheckAllChange}
                    checked={jgxxCheckAll}
                  />
                </div>
              </div>
              <div className={styles.boxStyle}>交管信息</div>
            </Col>
            <Col span={1} />
            <Col span={20}>
              <CheckboxGroup
                options={jgxxLayer}
                style={{ width: '100%', textAlign: 'left' }}
                value={jgxxCheckedList}
                onChange={this.jgxxOnChange}
              />
            </Col>
          </Card>
        </Row>
        <Row style={{ width: '100%', display: flag ? '' : 'none' }}>
          <Card style={{ width: '100%' }} className={styles.cardStyle}>
            <Col
              span={3}
              style={{ textAlign: 'center' }}
              className={styles.colStyle}
            >
              <div className={styles.left_card_title_wrapper}>
                <div className={styles.left_card_title_img}>
                  <img
                    src={require('../../assets/layerConfig/jtss.png')}
                    alt="无法显示图片"
                    height="40px"
                    width="40px"
                    style={{ bottom: '1px' }}
                  />
                </div>
                <div className={styles.left_card_title_checkbox}>
                  <Checkbox
                    indeterminate={jtssIndeterminate}
                    onChange={this.jtssCheckAllChange}
                    checked={jtssCheckAll}
                  />
                </div>
              </div>
              <div className={styles.boxStyle}>交通设施</div>
            </Col>
            <Col span={1} />
            <Col span={20}>
              <CheckboxGroup
                options={jtssLayer}
                style={{ width: '100%', textAlign: 'left' }}
                value={jtssCheckedList}
                onChange={this.jtssOnChange}
              />
            </Col>
          </Card>
        </Row>
        <Row style={{ width: '100%', display: flag ? '' : 'none' }}>
          <Card style={{ width: '100%' }} className={styles.cardStyle}>
            <Col
              span={3}
              style={{ textAlign: 'center' }}
              className={styles.colStyle}
            >
              <div className={styles.left_card_title_wrapper}>
                <div className={styles.left_card_title_img}>
                  <img
                    src={require('../../assets/layerConfig/jjxq.png')}
                    alt="无法显示图片"
                    height="40px"
                    width="40px"
                    style={{ bottom: '1px' }}
                  />
                </div>
                <div className={styles.left_card_title_checkbox}>
                  <Checkbox
                    indeterminate={jjxqIndeterminate}
                    onChange={this.jjxqCheckAllChange}
                    checked={jjxqCheckAll}
                  />
                </div>
              </div>
              <div className={styles.boxStyle}>交警辖区</div>
            </Col>
            <Col span={1} />
            <Col span={20}>
              <CheckboxGroup
                options={jjxqLayer}
                style={{ width: '100%', textAlign: 'left' }}
                value={jjxqCheckedList}
                onChange={this.jjxqOnChange}
              />
            </Col>
          </Card>
        </Row>
        <Row style={{ width: '100%', display: flag ? '' : 'none' }}>
          <Card style={{ width: '100%' }} className={styles.cardStyle}>
            <Col
              span={3}
              style={{ textAlign: 'center' }}
              className={styles.colStyle}
            >
              <div className={styles.left_card_title_wrapper}>
                <div className={styles.left_card_title_img}>
                  <img
                    src={require('../../assets/layerConfig/jtjc.png')}
                    alt="无法显示图片"
                    height="40px"
                    width="40px"
                    style={{ bottom: '1px' }}
                  />
                </div>
                <div className={styles.left_card_title_checkbox}>
                  <Checkbox
                    indeterminate={jtjcIndeterminate}
                    onChange={this.jtjcCheckAllChange}
                    checked={jtjcCheckAll}
                  />
                </div>
              </div>
              <div className={styles.boxStyle}>交通基础</div>
            </Col>
            <Col span={1} />
            <Col span={20}>
              <CheckboxGroup
                options={jtjcLayer}
                style={{ width: '100%', textAlign: 'left' }}
                value={jtjcCheckedList}
                onChange={this.jtjcOnChange}
              />
            </Col>
          </Card>
        </Row>
        <Row style={{ width: '100%', display: flag ? '' : 'none' }}>
          <Card style={{ width: '100%' }} className={styles.cardStyle}>
            <Col
              span={3}
              style={{ textAlign: 'center' }}
              className={styles.colStyle}
            >
              <div className={styles.left_card_title_wrapper}>
                <div className={styles.left_card_title_img}>
                  <img
                    src={require('../../assets/layerConfig/yjzy.png')}
                    alt="无法显示图片"
                    height="40px"
                    width="40px"
                    style={{ bottom: '1px' }}
                  />
                </div>
                <div className={styles.left_card_title_checkbox}>
                  <Checkbox
                    indeterminate={yjzyIndeterminate}
                    onChange={this.yjzyCheckAllChange}
                    checked={yjzyCheckAll}
                  />
                </div>
              </div>
              <div className={styles.boxStyle}>应急资源</div>
            </Col>
            <Col span={1} />
            <Col span={20}>
              <CheckboxGroup
                options={yjzyLayer}
                style={{ width: '100%', textAlign: 'left' }}
                value={yjzyCheckedList}
                onChange={this.yjzyOnChange}
              />
            </Col>
          </Card>
        </Row>
        <Row style={{ width: '100%', display: flag ? '' : 'none' }} className={styles.buttonStyle}>
          <Col span={22} />
          <Col span={1}>
            <Button
              type="primary"
              onClick={this.layerSave}
              // style={{ display: editMode !== 'add' ? 'none' : '' }}
            >
              保存
            </Button>
          </Col>
          <Col span={1}>
            <Button
              type="primary"
              onClick={this.layerReset}
              // style={{ display: editMode !== 'add' ? 'none' : '' }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
layerConfigList.propTypes = {};
layerConfigList.defaultProps = {};
// export default List;
export default Form.create()(layerConfigList);
