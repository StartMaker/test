
import React, { Component } from 'react'
import Default from '../../src'
import './index.scss';


import DATA from '../dep.json';
export default class extends Component {
  constructor(props){
    super();
    this.state = {
      searchValue: '',
      loading: false,
      searchData: [],
      treeData: [],
      tableData: []
    }

    this.getRootData();
  }

  getRootData = () => {
    setTimeout(() => {
      this.setState({
        treeData: this.formatTreeData(DATA.tree),
        tableData: this.formatTreeData(DATA.table)
      })
    }, 500);
  }

  formatTreeData = data => {
    return data.map(item => {
      const { DepartmentId, DepartmentName, ParentDepartmentId, ParentDepartmentName, DepartmentStatus, WithSub, WithSubEnable, HasChildrenEnable, HasChildrenDisabled } = item;
      return {
        departmentId: DepartmentId,
        departmentName: DepartmentName,
        parentDepartmentId: ParentDepartmentId,
        departmentStatus: DepartmentStatus,
        parentDepartmentName: ParentDepartmentName,
        withSub: WithSub,
        withSubEnable: WithSubEnable,
        hasChildrenEnable: HasChildrenEnable,
        hasChildrenDisabled: HasChildrenDisabled
      }
    })
  }

  getSubTreeData = department => {
    const arr = [];
    let count = Math.floor(Math.random() * 10) + 1;
    while(count-- > 0) {
      const id = department.departmentId +'.'+count
      arr.push({
        "departmentId": id,
        "departmentName": "部门-"+id,
        "departmentCode": id,
        "parentDepartmentId": department.departmentId,
        "departmentStatus": Math.random() < .5,
        "withSubEnable": true,
        "hasChildrenEnable": Math.random() < .5,
        "hasChildrenDisabled": Math.random() < .5
      })
    }
    return arr;
  }

  getSearchData = () => {
    let i = 0;
    const list = [];
    while (i++ < 15) {
      const ran = (Math.random()*4e3).toFixed(0).toString();
      list.push({
        departmentId: ran,
        departmentName: '名称'+ ran,
        parentDepartmentName: '父级'+ran,
        departmentStatus: ran < 2e3,
        selected: false
      })
    }
    return list
  }

  onChange = value => {
    this.setState({
      searchValue: value
    });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = this.getSearchData()
        resolve(list);
      }, 1e3);
    })
  }

  onExpand = department => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tree = this.getSubTreeData(department)
        resolve(tree);
      }, 1e3);
    })
  }
  onCancel = department => {
    console.log('onCancel');
  }
  onSubmit = departments => {
    console.log('onSubmit', departments);
  }

  render () {
    const { searchValue, searchData, treeData, tableData } = this.state;

    console.log('treeData0', treeData)
    return (
      <div className="multi-main">
        <Default
          searchValue={searchValue}
          onSearchChange={this.onChange}
          onExpand={this.onExpand}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
          treeData={treeData}
          tableData={tableData}
          multi={true}
          leftTitle="可选组织1"
          rightTitle="已选组织1"
          maxCount={100}
          columns={[]}
        />
      </div>
    )
  }
}
