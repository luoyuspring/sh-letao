/**
 * Created by dell on 2018/6/25.
 */

$(function () {

  /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */
  $('#form').bootstrapValidator({
    // 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 指定校验字段
    fields : {
      // 1.校验用户名
      username : {
        validators : {
          // 1.1 用户名不能为空
          notEmpty : {
            message : '用户名不能为空'
          },
          // 1/2 长度校验
          stringLength : {
            min : 2,
            max : 6,
            message : '用户名长度为 2-6 位'
          },
          callback : {
            message : '用户名不存在!'
          }
        }
      },
      // 2.校验密码
      password : {
        validators : {
          // 2.1 密码不能为空
          notEmpty : {
            message : '密码不能为空'
          },
          // 2.1 长度校验
          stringLength : {
            min : 6,
            max : 12,
            message : '密码长度为 6-12 位'
          },
          callback : {
            message : '密码错误!'
          }
        }
      }
    }
  });


  // 2.注册表单提交成功事件
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault();
    $.ajax({
      type : 'post',
      url : '/employee/employeeLogin',
      data : $('#form').serialize(),
      dataType : 'json',
      success : function (info) {
        // 2.1 验证通过跳转主页
        if (info.success) {
          location.href = 'index.html';
        }
        // 2.2 错误1000,用户名不存在
        if (info.error === 1000) {
          $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
        }
        // 2.3 错误1001,密码错误
        if (info.error === 1001) {
          $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
        }
      }
    });
  });


  // 3.点击重置按钮,重置内容和样式
  $('[type="reset"]').on('click', function () {
    $('#form').data('bootstrapValidator').resetForm();
  })
});