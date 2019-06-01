import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
// import Search from '../../components/oct/querysearch';
import List from '../../components/oct/querydatalist';
// import Echarts from '../../components/oct/echarts';

const { confirm } = Modal;

class QueryOriginal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'query/query',
      payload: {},
    });
  }

  render() {
    const { common,
      dispatch, loading, query } = this.props;
    const { list0, dataSource, paginations, pagination } = query;
    const { enumList, codeList } = common;
    const myThis = this;
    // const listprops = {
    //   name: '维护单位',
    //   resultlist: list0,
    //   enumList,
    //   loading,
    //   onRefresh: () => {
    //     dispatch({
    //       type: 'query/query',
    //       payload: {},
    //     });
    //   },
    // };
    const listprops2 = {
      name: '项目分类统计',
      enumList,
      loading,
      resultlist: list0,
      paginations,
      pagination,
      dataSource,
      dispatch,
      onRefresh: () => {
        dispatch({
          type: 'query/query',
          payload: {},
        });
      },
    };
    return (
      <div>
        <Row>
          <Col span={24} style={{ width: '100%', paddingTop: '1' }}>
            <List {...listprops2} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ query, common, loading }) {
  return { query, common, loading: loading.models.query };
}
export default connect(mapStateToProps)(QueryOriginal);
