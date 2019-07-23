import React from 'react';
import './index.scss';

export default function(props) {
  const { title, selectedCount, maxCount } = props;
  return (
    <div className="department-count">
      <span className="department-count-title">{title}</span>
      <span className="department-count-selected">{selectedCount}</span>
      <span className="department-count-total">/{maxCount}</span>
    </div>
  )
}