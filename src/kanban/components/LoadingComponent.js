import React from 'react';

import { Spin } from 'antd';

function LoadingComponent(props) {
  if (props.error) {
    return <div>Error!</div>;
  } else {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Spin tip="正在加载" />,
      </div>
    );
  }
}

export default LoadingComponent;
