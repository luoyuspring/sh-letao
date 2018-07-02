/**
 * Created by dell on 2018/7/2.
 */

$(function () {
   
  // 1.发送ajax请求,获取用户信息,渲染到页面
  $.ajax({
    type : 'get',
    url : '/user/queryUserMessage',
    dataType : 'json',
    success : function (info) {
      if (info.error === 400) {
        location.href = 'login.html?url=' + location.href;
      } else {
        $('.lt-main .mui-media').html(template('userTpl', info));
      }
    }
  });

  // 2.点击退出按钮退出登录
  $('.logoutBtn').on('click', function () {
    $.ajax({
      type : 'get',
      url : '/user/logout',
      dataType : 'json',
      success : function (info) {
        if (info.success) {
          location.href = 'login.html?url=' + location.href;
        }
      }
    })
  })
  
});