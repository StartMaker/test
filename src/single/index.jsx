import React from 'react';
import Search from '@beisen-phoenix/search';
import Tree from '../common/tree';
import List from '../common/list';
import Check from '../common/check';

import './index.scss';

export default class Single extends React.Component {
  constructor(props) {
    super();
    this.state = {
      withSub: true
    };
  }

  onShowDisableChange = (props, e) => {
    this.props.onShowDisabledData(e.target.checked)
  }

  onIncludSubChange = (props, e) => {
    this.setState({
      withSub: e.target.checked
    });
  }

  onSelect = department => {
    const { withSub } = this.state;
    this.props.onSelect(Object.assign({}, department, {
      withSub
    }));
  }

  render() {
    const { withSub } = this.state;
    const { treeData, searchValue, searchData, showDisableCheck, showDisable, treeLoading, searchLoading, onExpand, onSelectSibling, onDoubleClick, onSearchChange, onSelect } = this.props;
    return (
      <div className="department-single">
        <div className="department-single-hd">
          <Search
            prefix="Search"
            placeholder="搜索"
            value={searchValue}
            onChange={onSearchChange}
          />
        </div>
        <div className="department-single-bd">
          <div className="department-single-wrap">
            {
              showDisableCheck &&
              <div className="department-single-check">
                <Check
                  title=""
                  label={"显示停用"}
                  showCheck={showDisableCheck}
                  checked={showDisable}
                  onChange={this.onShowDisableChange}
                />
              </div>
            }
            <div className="department-single-tree">
              <Tree
                treeData={treeData}
                onExpand={onExpand}
                onSelect={this.onSelect}
                loading={treeLoading}
                // onSelectSibling={onSelectSibling}
                // onDoubleClick={onDoubleClick}
                showDisable={showDisable}
                multi={false}
              />
            </div>
          </div>
          {
            // 搜索关键字不为空时显示列表
            !!searchValue &&
            <div className="department-single-list">
              <List
                searchValue={searchValue}
                searchData={searchData}
                loading={searchLoading}
                onSelect={this.onSelect}
                multi={false}
              />
            </div>
          }
        </div>
        <div className="department-single-ft">
          <Check
            label={"包含下级数据"}
            checked={withSub}
            showCheck={true}
            onChange={this.onIncludSubChange}
          />
        </div>
      </div>
    )
  }
}