/**
 * Created by dell on 2018/7/2.
 */

$(function () {

  // 功能一: 获取地址栏传入id,通过ajax请求数据库,获取数据渲染到页面
  var id = getSearch('key');
  $.ajax({
    type : 'get',
    url : '/product/queryProductDetail',
    data : { id : id },
    dataType : 'json',
    success : function (info) {
      $('.mui-scroll').html(template('productTpl', info));

      // 开启轮播图
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:4000//自动轮播周期，若为0则不自动播放，默认为0；
      });
      // 开启数字输入框
      mui('.lt-num .mui-numbox').numbox();
    }
  });

  // 功能二: 点击尺码按钮,切换类型,显示选中
  $('body').on('click', '.lt-size span', function () {
    $(this).addClass('current').siblings().removeClass('current');
  });

  // 功能三: 加入购物车功能
  $('.add-cart').on('click', function () {
    var num = mui('.lt-num .mui-numbox').numbox().getValue();
    var size = $('.lt-size span.current').text();
    if (!size) {
      mui.toast('请选择尺码!');
      return;
    }
    $.ajax({
      type : 'post',
      url : '/cart/addCart',
      data : {
        productId : id,
        num : num,
        size : size
      },
      dataType : 'json',
      success : function (info) {
        if (info.success) {
          mui.confirm('添加成功', '温馨提示', ['去购物车', '继续浏览'], function (e) {
            if (e.index === 0) {
              location.href = 'cart.html';
            }
          });
        }
        if (info.error === 400) {
          // 跳转到登录页,需要携带当前地址,登录成功跳回
          location.href = 'login.html?url=' + location.href;
        }
      }
    })
  });

});