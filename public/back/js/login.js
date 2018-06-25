/**
 * Created by dell on 2018/6/25.
 */

/*
 * 1. 进行表单校验配置
 *    校验要求:
 *        (1) 用户名不能为空, 长度为2-6位
 *        (2) 密码不能为空, 长度为6-12位
 * */

$(function () {

  $('.form-horizontal').bootstrapValidator({
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
          }
        }
      }
    }
  })

});