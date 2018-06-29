/**
 * Created by dell on 2018/6/29.
 */

$(function () {

  // 功能一: 进入页面渲染历史记录
  // 1.读取localStoage中searchList数据
  function getHistory() {
    return JSON.parse(localStorage.getItem('searchList')) || [];
  }

  // 2.根据读取的数据渲染历史记录
  function render() {
    $('.history').html(template('historyTpl', {arr : getHistory()}));
  }
  render();

  // 功能二: 清空记录
  $('.history').on('click', '.btn-remove', function () {
    // 1.点击清空按钮,显示提示模态框
    mui.confirm('你是否要清空全部历史记录?','温馨提示', ['取消', '确定'], function (e) {
      // 2.点击确定按钮清空历史记录,并重新渲染页面
      if (e.index === 1) {
        localStorage.removeItem('searchList');
        render();
      }
    })
  });

  // 功能三: 删除单条记录
  // 1.封装设置历史记录到localStorage方法
  function setHistory(arr) {
    localStorage.setItem('searchList', JSON.stringify(arr))
  }
   //setHistory([ "耐克", "阿迪达斯", "李宁", "特步", '新百伦']);
  // 2.点击X获取当前记录索引,删除当前记录,并重新渲染
  $('.history').on('click', '.btn-delete', function () {
    mui.prompt('确定删除本条记录吗?');
    var arr = getHistory();
    arr.splice($(this).data('index'), 1)
    setHistory(arr);
    render();
  });

  // 功能四: 搜索功能
  $('.btn-search').on('click', function () {
    // 当输入框为空时显示提示信息并结束函数
    if (!$('.search-input').val()) {
      mui.toast('请输入搜索内容!');
      return;
    }

    // 1.将输入框的值存储到本地localStorage中
    var arr = getHistory();
    // 1.1 如果输入的数据在数组中已存在,则删除数组中该数据
    var index = arr.indexOf($('.search-input').val());
    if (index > -1) {
      arr.splice(index, 1);
    }
    // 1.2 判断如果arr数据超过10条,就删除最后一条
    if (arr.length >= 10) {
      arr.pop();
    }
    // 1.3 存储数据到本地,并重新渲染页面
    arr.unshift($('.search-input').val());
    console.log(arr);
    setHistory(arr);
    render();
    // 1.4 页面跳转到搜索列表页
    location.href = "searchList.html?key=" + $('.search-input').val();
  })

});