/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Table, Form, Input, Button, Row, Col, Tabs, Icon, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'moment';
import QuerydetailSave from './querydetailSave';
import styles from './DeviceSelect.less';
import Search from './QueryDetailSearch';
import List from './QueryDetailList';
import { PSFX, CARCOLOR, CAR_C, CARMARK, ENUM_ILLEGAL, CARTYPE, NUMCOLOR, NUMBERTYPE } from '../../../config/enums';


class Querydetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savevisible: false,
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  componentDidMount() {
    const { dispatch, danweiID, query, title } = this.props;
    const { pagination } = query;
    const page = { ...pagination, current: 1 };
    if (title === '项目分类统计 历史记录') {
      dispatch({
        type: 'query/gethistoryById',
        payload: { project_id: 'projectCount', pagination: page },
      });
    } else {
      dispatch({
        type: 'query/gethistoryById',
        payload: { project_id: danweiID, pagination: page },
      });
    }
  }

  onClose = () => {
    const { onClose } = this.props;
    onClose();
  }

  onOk = () => {
    const { onClose } = this.props;
    onClose();
  }

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

  render() {
    const { title, danweiID, query, enumList, dispatch, onRefresh, records, loading } = this.props;
    const { danweiHistory, pagination, queryobj } = query;
    const { savevisible } = this.state;
    const QuerydetailSaveProps = {
      onClose: () => {
        this.setState({ savevisible: false });
      },
    };
    const searchprops = {
      queryobj,
      enumList,
      onSearch: (q) => {
        const page = { ...pagination, current: 1 };
        const { dt } = q;
        if (title === '项目分类统计 历史记录') {
          dispatch({
            type: 'query/gethistoryById',
            payload: { ...q, project_id: 'projectCount', pagination: page },
          });
        } else {
          dispatch({
            type: 'query/gethistoryById',
            payload: { ...q, project_id: danweiID, pagination: page },
          });
        }
      },
    };
    const listprops = {
      records,
      pagination,
      title,
      loading,
      danweiHistory,
      enumList,
      onSave: (value) => {
        dispatch({
          type: 'query/saveCustomData',
          payload: {
            project_id: danweiID,
            jianshe: value.jianshe,
            tongdian: value.tongdian,
          },
          callback: (response) => {
            onRefresh();
          },
        });
      },
    };
    return (
      <div>
        <Modal
          title={title}
          visible
          onCancel={this.onClose}
          width="60%"
          wrapClassName={styles.policeSelect}
          footer={[
            <Button key="back" onClick={this.onClose}>关闭</Button>,
          ]}
        >
          <div>
            <Row>
              <Col span={24} style={{ width: '100%', paddingBottom: '0' }}>
                <Search {...searchprops} />
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ width: '100%', paddingTop: '0' }}>
                <List {...listprops} />
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}

Querydetail.prototypes = {
  list: PropTypes.array,
  enumList: PropTypes.array,
  onCancel: PropTypes.func,
};
function mapStateToProps({ query, common }) {
  return { query, common };
}
export default connect(mapStateToProps)(Querydetail);
