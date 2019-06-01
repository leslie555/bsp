import React from 'react';
import { connect } from 'dva';
import StationSearch from '../../components/policeDeploy/Search';
import styles from './Station.less';

const Station = ({ dispatch, loading }) => {
  return (
    <div className={styles.normal} style={{ minHeight: '0px', position: 'absolute', left: '0px' }}>
      <div style={{ height: '100%', marginTop: '5px' }}>
        <div className={styles.search}>{/* <StationSearch /> */}</div>
        <div className={styles.list} />
      </div>
    </div>
  );
};

function mapStateToProps({ StationModel, common, loading }) {
  return { StationModel, common, loading: loading.models.StationModel };
}

// export default Lists;
export default connect(mapStateToProps)(Station);
