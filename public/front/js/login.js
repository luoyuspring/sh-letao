/**
 * Created by dell on 2018/7/2.
 */

$(function () {


  $('#login').on('click', function () {
    // 表单验证
    var check = true;
    mui(".lt-main input").each(function() {
      // 若当前input为空，则alert提醒
      if(!this.value || this.value.trim() == "") {
        var label = this.previousElementSibling;
        mui.alert(label.innerText + "不允许为空");
        check = false;
        return false;
      }
    }); // 校验通过，继续执行业务逻辑
    if(check){
      // 发送ajax请求登录,并跳回上一页
      console.log($('#form').serialize());
      $.ajax({
        type : 'post',
        url : '/user/login',
        data : $('#form').serialize(),
        dataType : 'json',
        success : function (info) {
          // 如果成功跳转到对应页面
          if (info.success) {
            if (location.search.indexOf('url') > -1) {
              location.href = location.search.replace('?url=', '');
            } else {
              location.href = 'user.html';
            }
          }
          // 如果失败,提示用户名或密码错误
          if (info.error === 403) {
            mui.alert("用户名或密码错误", '温馨提示');
          }
        }
      })
    }

  })

});