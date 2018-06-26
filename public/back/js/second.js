/**
 * Created by dell on 2018/6/26.
 */

$(function () {

  // 1.声明全局变量
  var currentPage = 1;
  var pageSize = 3;

  // 2.封装请求数据库,获取二级分类信息并渲染到页面方法
  function render() {
    $.ajax({
      type : 'get',
      url : '/category/querySecondCategoryPaging',
      data : {
        page : currentPage,
        pageSize : pageSize
      },
      dataType : 'json',
      success : function (info) {
        $('tbody').html(template('tmp-main', info));
        // 设置分页
        $('#pagintor').bootstrapPaginator({
          bootstrapMajorVersion : 3,
          currentPage : info.page,
          totalPages : Math.ceil(info.total / info.size),
          onPageClicked : function (a, b, c, page) {
            currentPage = page;
            render();
          }
        });
      }
    });
  }
  render();

  // 3.点击分类管理显示添加分类模态框,并获取分类添加给模态框下拉列表
  $('.btn-add').on('click', function () {
    $('#secondMoal').modal('show');

    // 获取分类添加给模态框下拉列表
    $.ajax({
      type : 'get',
      url : '/category/queryTopCategoryPaging',
      data : {
        page : 1,
        pageSize : 1000
      },
      dataType : 'json',
      success : function (info) {
        $('.dropdown-menu').html(template('tmp-select', info));
      }
    });
  });

  // 4.点击模态框下拉列表中元素,获取里面内容填充到button中,获取id添加给categoryId
  $('.dropdown-menu').on('click', 'a', function () {
    $('#category').text($(this).text());
    $('#categoryId').val($(this).attr('data-id'));
    // 清除校验状态
    $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');
  })

  // 5.点击图片上传按钮上传图片,将图片地址赋值给img的src和brandLogo
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      $('.modal-body img').attr('src', data.result.picAddr);
      $('#brandLogo').val(data.result.picAddr);
      // 清除校验状态
      $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
    }
  });

  // 6.表单校验
  $('#form').bootstrapValidator({
    excluded: [], // 取消默认校验筛选
    // 6.1 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    // 6.2 设置校验项
    fields : {
      categoryId : {
        validators : {
          notEmpty : {
            message : '请选择一级分类'
          }
        }
      },
      brandName : {
        validators : {
          notEmpty : {
            message : '请输入二级分类名称'
          }
        }
      },
      brandLogo : {
        validators : {
          notEmpty : {
            message : '请上传图片'
          }
        }
      }
    }
  });

  // 7.点击模态框添加按钮,阻止表单提交,用ajax提交添加数据到数据库,并关闭模态框,重置表单
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault();
    $.ajax({
      type : 'post',
      url : '/category/addSecondCategory',
      data : $('#form').serialize(),
      dataType : 'json',
      success : function (info) {
        if (info.success) {
          $('#secondMoal').modal('hide'); // 隐藏模态框
          $('#form').data('bootstrapValidator').resetForm(true); // 重置表单
          currentPage = 1;
          render(); // 重新渲染第一页
          $('#category').text("请选择一级分类");
          $('.modal-body img').attr("src", "images/none.png");
        }
      }
    })
  })
});