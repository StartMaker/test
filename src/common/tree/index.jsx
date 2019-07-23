import React from 'react';
import { AddSquareS, ReduceSquares, Loading } from '@beisen-phoenix/icon';
import './index.scss';

const Item = props => {
  let expandClass = 'department-tree-collapse';
  const { multi, department, showDisable, onSelect, onSelectSibling, onExpand, onDoubleClick } = props;
  const { departmentName, departmentStatus, loading, hasChildrenEnable, hasChildrenDisabled, Children, level, expand, selected, parent } = department;
  const showExpand = expand && Children && Children.length > 0;
  const showSpace = !showDisable && !hasChildrenEnable || showDisable && !hasChildrenEnable && !hasChildrenDisabled;
  const selectedClass = ['department-tree-item'];
  selected && selectedClass.push('department-tree-item-selected');

  let ExpandIcon = AddSquareS;
  if (showExpand) {
    expandClass = 'department-tree-expand';
    ExpandIcon = ReduceSquares;
  }
  if (loading) {
    expandClass = 'department-tree-loading';
    ExpandIcon = Loading;
  }
  if (showSpace) {
    expandClass = 'department-tree-space';
    ExpandIcon = () => null;
  }
  const onExpandClick = e => {
    e.stopPropagation();
    if (showSpace) return;
    onExpand && onExpand(department, !showExpand);
  };
  const onClick = e => {
    e.stopPropagation();
    onSelect && onSelect(department, !selected, 'tree');
  };
  const onSiblingBtnClick = e => {
    e.stopPropagation();
    onSelectSibling && onSelectSibling(parent);
  };
  const { Children: sibling, allChildrenSelected } = parent;
  let childrenList = sibling;
  if (!showDisable) {
    childrenList = sibling.filter(child => {
      return child.departmentStatus;
    });
  }
  const btnText = allChildrenSelected ? '取消选中同级' : '选中同级';
  return (
    <div
      className={selectedClass.join(' ')}
      onDoubleClick={() => onDoubleClick && onDoubleClick(department, 'tree')}
    >
      <div
        className="department-tree-node"
        onClick={onClick}
      >
        <span
          style={{
            paddingLeft: `${ 20 * level }px`
          }}
        ></span>
        <span className={expandClass} onClick={onExpandClick} onDoubleClick={e => e.stopPropagation()}>
          <ExpandIcon width="14" height="14" />
        </span>
        <span
          className="department-tree-name"
        >
          {departmentName}
          {!departmentStatus && <span className="department-tree-status">(已停用)</span>}
        </span>
        {multi && childrenList.length > 1 && <span className="department-tree-sibling">
          <span className="department-tree-btn" onClick={onSiblingBtnClick}>{btnText}</span>
        </span>}
      </div>
    </div>
  );
};

const Tree = props => {
  const { multi, treeData, onExpand, onSelect, onSelectSibling, onDoubleClick, showDisable } = props;
  return (
    <div className="department-tree">
      <div className="department-tree-list">
      {
        treeData.map(department => {
          return (
            <Item
              key={department.departmentId}
              department={department}
              {...props}
            />
          );
        })
      }
      </div>
    </div>
  );
};

export default Tree;