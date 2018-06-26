/**
 * Created by dell on 2018/6/26.
 */

$(function () {

  // 1.声明全局变量
  var currentPage = 1;
  var pageSize = 5;
  var currentId; // 当前点击用户id
  var isDelete; // 切换状态的值

  // 2.封装请求数据并渲染到页面与实现分页的函数
  function render() {
    $.ajax({
      type : 'get',
      url : '/user/queryUser',
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
          onPageClicked(a, b, c, page){
            currentPage = page;
            render();
          }
        });
      }
    })
  }

  // 3.执行一次render渲染第一页
  render();

  // 4.点击禁用和启用按钮,显示模态框,点击模态框确定按钮修改数据,并重新渲染页面
  $('tbody').on('click', '.btn', function () {
    currentId = $(this).parent().data('id');
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    $('#userModal').modal('show');
  })
  $('#userPast').on('click', function () {
    $.ajax({
      type : 'post',
      url : '/user/updateUser',
      data : {
        id : currentId,
        isDelete : isDelete
      },
      dataType : 'json',
      success : function (info) {
        $('#userModal').modal('hide');
        render();
      }
    });
  })



});