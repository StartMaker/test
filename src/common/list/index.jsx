import React from 'react';
import Tooltip from '@beisen-phoenix/tooltip';
import { ChrysanthemumLoading } from '@beisen-phoenix/loading';
import { NoData } from '@beisen-phoenix/icon';
import classNames from 'classnames';

import './index.scss';

export default function List(props) {
  const { searchValue, searchData, loading, multi, showDisable, onSelect, onDoubleClick } = props;
  const listClass = classNames({
    'department-list': true,
    'department-list-multi': multi
  });
  return (
    <div
      className={listClass}
    >
      {
        // loading
        loading ?
          <ChrysanthemumLoading />
          :
          // 结果数量大于0时才显示列表，否则显示“空”图标
          searchData.length > 0 ?
            searchData.map(item => 
              (showDisable || item.departmentStatus) ?
              <ListItem 
                key={item.departmentId}
                item={item}
                multi={multi}
                searchValue={searchValue}
                onDoubleClick={onDoubleClick}
                onSelect={onSelect}
              /> : null
            )
            :
            // 此处是无搜索结果的“空”图标
            <div className="department-list-void">
              <NoData
                className="department-list-void-icon"
              />
              <div className="department-list-void-title">
                {'这里什么都没有...'}
              </div>
            </div>
      }
    </div>
  )
}

function ListItem(props) {
  const { item, searchValue, onSelect, onDoubleClick, multi } = props;
  const { selected, departmentId, departmentName, departmentStatus, parentDepartmentName } = item;
  const itemClass = classNames({
    'department-list-text': true,
    'department-list-text-multi': multi,
    'department-list-text-selected': selected
  });
  const nameText = getHighlightText(departmentName, searchValue);
  const parentText = parentDepartmentName ? `<span class="department-list-parent">(${parentDepartmentName})</span>` : '';
  const statusText = departmentStatus ? '' : '<span class="department-list-status">(已停用)</span>';
  const tooltipText = `${departmentName}(${parentDepartmentName})(${departmentStatus ? '' : '已停用'})`
  const text = nameText + parentText + statusText
  const onClick = e => {
    e.stopPropagation();
    onSelect && onSelect(item, !selected, 'search');
  };
  return (
    <div
      key={departmentId} className="department-list-item"
      onDoubleClick={() => onDoubleClick && onDoubleClick(item, 'search')}
    >
      <Tooltip title={tooltipText} showOverflowTooltip={true}>
        <div
          className={itemClass}
          onClick={onClick}
          dangerouslySetInnerHTML={{
            __html: text
          }}
        ></div>
      </Tooltip>
    </div>
  )
}

function getHighlightText(text, value) {
  return text.replace(new RegExp(value), $0 => $0 ? `<span class="department-list-highlight">${$0}</span>` : '');
}