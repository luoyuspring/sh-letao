/**
 * Created by dell on 2018/6/25.
 */

$(function () {

  // 6.验证登录状态,没有登录退回登录页
  if (location.href.indexOf('login.html') === -1) {
    $.ajax({
      type : 'get',
      url : '/employee/checkRootLogin',
      dataType : 'json',
      success : function (info ) {
        if (info.error === 400) {
          location.href = 'login.html';
        }
      }
    })
  }

  // 1.实现进度条
  // 1.1 第一个ajax发送时, 开启进度条
  $(document).ajaxStart(function() {
    NProgress.start();
  });
  // 1.2 所有的ajax请求完成时调用, 关闭进度条
  $(document).ajaxStop(function() {
    setTimeout(function() {
      NProgress.done();
    }, 500)
  });

  // 2.点击侧边栏分类管理切换二级菜单显示和隐藏
  $('.lt-aside .category').on('click', function () {
    $('.lt-aside .child').stop().slideToggle();
  })

  // 3.点击主题区域头部左侧按钮显示隐藏侧边导航栏
  $('.lt_topbar .icon-menu').on('click', function () {
    $('.lt-aside').toggleClass('menuHide');
    $('.lt-main').toggleClass('menuHide');
    $('.lt_topbar').toggleClass('menuHide');
  })

  // 4.点击退出按钮显示模态框
  $('.lt_topbar .icon-logout').on('click', function () {
    $('#logoutModal').modal('show');
  })

  // 5.点击模态框退出按钮退出登录
  $('#logoutBtn').on('click', function () {
    $.ajax({
      type : "get",
      url : '/employee/employeeLogout',
      dataType : 'json',
      success : function (info) {
        if (info.success) {
          location.href = 'login.html';
        }
      }
    })
  })

});