import React from 'react';
import classNames from 'classnames';
import { Left, Right } from '@beisen-phoenix/icon';

import './index.scss';

const Arrow = props => {
  const { onMove, showList, treeSelected, searchSelected, tableSelected } = props;
  const rightSelected = tableSelected;
  const leftSelected = showList ? searchSelected : treeSelected;
  const leftClass = rightSelected ? '' : ' disable';
  const rightClass = leftSelected ? '' : ' disable';
  return (
    <div className="department-arrow">
      <div className={'department-arrow-btn' + leftClass} onClick={() => onMove('remove')}>
        <Left width="14" height="14" color="white"/>
      </div>
      <div className={'department-arrow-btn' + rightClass} onClick={() => onMove('add')}>
        <Right width="14" height="14" color="white"/>
      </div>
    </div>
  );
};

export default Arrow;