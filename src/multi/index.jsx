import React from 'react';
import Search from '@beisen-phoenix/search';
import Button from '@beisen-phoenix/button';
import Tree from '../common/tree';
import List from '../common/list';
import Check from '../common/check';
import Arrow from './arrow';
import Table from './table';
import Count from './count';

import './index.scss';

export default class Multi extends React.Component {
  constructor(props) {
    super();
    const showDisableCheck = typeof props.showDisableCheck === 'boolean' ? props.showDisableCheck : true;
    this.state = {
      showDisableCheck,
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
    }), );
  }

  render() {
    const { 
      treeData,
      searchValue,
      searchData,
      showDisableCheck,
      showDisable,
      tableData,
      selectedData,
      treeLoading,
      searchLoading,
      leftTitle,
      rightTitle,
      maxCount,
      columns,
      onExpand,
      onSelect,
      onSelectSibling,
      onDoubleClick,
      onSearchChange,
      onMove,
      onCheck,
      onCancel,
      onSubmit
    } = this.props;
    const showSearchList = !!searchValue;
    return (
      <div className="department-multi">
        <div className="department-multi-top">
          <div className="department-multi-left">
            <div className="department-multi-check">
              <Check
                title={leftTitle || '可选组织'}
                label={"显示停用"}
                showCheck={showDisableCheck}
                checked={showDisable}
                onChange={this.onShowDisableChange}
              />
            </div>
            <div className="department-multi-search">
              <Search
                prefix="Search"
                placeholder="搜索"
                value={searchValue}
                onChange={onSearchChange}
              />
            </div>
            <div className="department-multi-wrap">
              <div className="department-multi-tree">
                <Tree
                  multi={true}
                  treeData={treeData}
                  loading={treeLoading}
                  showDisable={showDisable}
                  onSelect={onSelect}
                  onExpand={onExpand}
                  onSelectSibling={onSelectSibling}
                  onDoubleClick={onDoubleClick}
                />
              </div>
              {
                // 搜索关键字不为空时显示列表
                showSearchList &&
                <div className="department-multi-list">
                  <List
                    multi={true}
                    searchValue={searchValue}
                    searchData={searchData}
                    loading={searchLoading}
                    showDisable={showDisable}
                    onDoubleClick={onDoubleClick}
                    onSelect={onSelect}
                  />
                </div>
              }
            </div>
          </div>
          <div className="department-multi-center">
            <Arrow
              showList={showSearchList}
              treeSelected={selectedData.tree.length}
              searchSelected={selectedData.search.length}
              tableSelected={selectedData.table.length}
              isMax={tableData.length >= maxCount}
              onMove={onMove}
            />
          </div>
          <div className="department-multi-right">
            <Count
              title={rightTitle || '已选组织'}
              selectedCount={tableData.length}
              maxCount={maxCount}
            />
            <Table
              data={tableData}
              columns={columns}
              onSelect={onSelect}
              onCheck={onCheck}
              onDoubleClick={onDoubleClick}
            />
          </div>
        </div>
        <div className="department-multi-bottom">
          <Button
            size="small"
            type="normal"
            margin="0 8px 0 0"
            onClick={onCancel}
          >取消</Button>
          <Button
            size="small"
            onClick={onSubmit}
          >确定</Button>
        </div>
      </div>
    )
  }
}