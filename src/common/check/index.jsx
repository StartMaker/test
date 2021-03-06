import React from 'react';
import Checkbox from '@beisen-phoenix/checkbox';
import classNames from 'classnames';

import './index.scss';

export default function Check(props) {
  const { title, label, value, checked, showCheck, onChange } = props;
  return (
    <div className="department-check">
      {
        typeof title !== 'undefined' &&
        <span className="department-check-title">{title}</span>
      }
      {
        showCheck &&
        <Checkbox
          label={label}
          value={value}
          checked={checked}
          onChange={onChange}
        />
      }
    </div>
  )
}