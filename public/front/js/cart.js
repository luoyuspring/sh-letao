/**
 * Created by dell on 2018/7/2.
 */

$(function () {

  // 功能一: 进入页面发送ajax请求,获取购物车数据,渲染到页面
  // 1.封装ajax请求数据渲染页面函数
  function render() {
    $.ajax({
      type: 'get',
      url : '/cart/queryCart',
      dataType : 'json',
      success : function (info) {
        if (info.error) {
          location.href = 'login.html?url=' + location.href;
        }
        $('.mui-table-view').html(template('cartTpl', {info : info}));

        // 停止下拉刷新
        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
      }
    });
  }
  // 2. 配置下拉刷新
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",
      down : {
        auto: true,// 首次加载自动下拉刷新一次
        callback: function() {
          // 发送ajax请求, 渲染页面
          render();
        }
      }
    }
  });

  // 功能二: 点击删除按钮删除本条数据
  $('.lt-main').on('tap', '.btn-delete', function () {
    $.ajax({
      type : 'get',
      url : '/cart/deleteCart',
      data : {
        id : [$(this).data('id')]
      },
      dataType : 'json',
      success : function (info) {
        if (info.success) {
          mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
        }
      }
    })
  });


  // 功能三: 修改数据
  // 1.点击修改按钮弹出修改面板
  $('.lt-main').on('tap', '.btn-edit', function () {
    // 获取模板数据
    var obj = {
      id : $(this).data('id'),
      size : $(this).data('size'),
      num : $(this).data('num'),
      productSize : $(this).data('productsize'),
      productNum : $(this).data('productnum'),
    }

    mui.confirm( template('editTpl', obj).replace(/\n/g, ''), '编辑商品', ['确认', '取消'], function (e) {
      // 2.如果点击的是左侧确定按钮,发送ajax请求,修改数据,并重新下拉刷新页面
      if (e.index === 0) {
        $.ajax({
          type : 'post',
          url : '/cart/updateCart',
          data : {
            id : obj.id,
            size : $('.lt-size span.current').text(),
            num : $('.mui-numbox-input').val()
          },
          dataType : 'json',
          success : function (info) {
            if (info.success) {
              mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
            }
          }
        })
      }
    })
    // 3.开启数字输入框
    mui('.mui-numbox').numbox();

  });
  // 4.点击span选择尺码,并开启计数
  $('body').on('click', '.lt-size span', function () {
    $(this).addClass('current').siblings().removeClass('current');
  });


  // 功能四: 点击复选框获取价格累加给totalText
  $('body').on('click', '.ck', function () {
    var total = 0;
    $('.ck:checked').each(function (i, v) {
      total += $(this).data('price') * $(this).data('num');
    })
    total = total.toFixed(2);
    $('#totalText').text(total);
  })


});