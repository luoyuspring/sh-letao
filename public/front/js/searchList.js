/**
 * Created by dell on 2018/6/29.
 */

$(function () {

  // 功能一: 进入页面根据传入数据渲染页面
  $('.search-input').val(getSearch('key'));
  function render() {
    // 补: 动态添加加载延时效果盒子
    $('.lt_product').html('<div class="loading"></div>');

    // 1.基本数据
    var data = {
      proName : $('.search-input').val(),
      page : 1,
      pageSize : 100,
    }
    // 2.判断是否需要排序,有current类的数据>0需要排序
    if ($('.sort .current').length > 0) {
      data[$('.sort .current').data('name')] = $('.sort .current').find('i').hasClass('fa-angle-down') ? 2 : 1;
    }

    // 3.通过ajax请求数据,并渲染页面
    $.ajax({
      type : 'get',
      url : '/product/queryProduct',
      data : data,
      dataType : 'json',
      success : function (info) {
        setTimeout(function () {
          $('.lt_product').html(template('tpl', info));
        }, 500)
      }
    });
  }
  render();

  // 功能二: 1.点击搜索按钮获取信息渲染到页面
  //         2.将搜索框内容保存到本地
  $('.btn-search').on('click', function () {
    var key = $('.search-input').val();
    // 获取信息渲染到页面
    if (!key) {
      mui.toast('请输入搜索内容!');
      return;
    }
    render();

    // 将搜索框内容保存到本地
    var arr = JSON.parse(localStorage.getItem('searchList') || []);
    if (arr.indexOf(key) > -1) {
      arr.splice(arr.indexOf(key), 1);
    }
    if (arr.length >= 10) {
      arr.pop();
    }
    arr.unshift(key);
    localStorage.setItem('searchList', JSON.stringify(arr));

    // 清除输入框数据
    $('.search-input').val('');
  })

  // 功能三: 点击价格和库存对应排序
  $('.sort a[data-name]').on('click', function () {
    $(this).addClass('current').siblings().removeClass('current');
    $(this).find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
    render();
  })

});