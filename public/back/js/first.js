/**
 * Created by dell on 2018/6/26.
 */

$(function () {

  // 1.声明全局变量
  var currentPage = 1;
  var pageSize = 3;

  // 2.封装请求数据并渲染到页面与实现分页的函数
  function render() {
    $.ajax({
      type : 'get',
      url : '/category/queryTopCategoryPaging',
      data : {
        page : currentPage,
        pageSize : pageSize
      },
      dataType : 'json',
      success : function (info) {
        // 2.1 将数据渲染到页面
        $('tbody').html(template('tmp', info));
        // 2.2 实现分页
        $('#pagintor').bootstrapPaginator({
          bootstrapMajorVersion : 3,
          currentPage : info.page,
          totalPages : Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page){
            currentPage = page;
            render();
          }
        });
      }
    })
  }

  // 3.执行一次render渲染第一页
  render();

  // 4.点击禁用和启用按钮,显示模态框
  $('.btn-add').on('click', function () {
    $('#firstMoal').modal('show');
  })

  // 5.表单验证
  $('#form').bootstrapValidator({
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置字段
    fields: {
      categoryName: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            message: "一级分类名称不能为空"
          }
        }
      }
    }
  });

  // 6.点击模态框确定按钮,阻止默认提交成功,利用ajax提交添加数据,并重新渲染页面
  $('#form').on('success.form.bv', function (e) {
    console.log(1);
    e.preventDefault();
    $.ajax({
      type : 'post',
      url : '/category/addTopCategory',
      data : $('#form').serialize(),
      dataType : 'json',
      success : function (info) {
        console.log(info);
        $('#firstMoal').modal('hide');
        $('#form').data('bootstrapValidator').resetForm( true );
        currentPage = 1;
        render();
      }
    });
  });




});