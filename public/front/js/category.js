/**
 * Created by dell on 2018/6/29.
 */

$(function () {

  // 1. 一进入页面, 通过 ajax 请求一级分类的数据, 通过模板引擎渲染左侧列表
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: "json",
    success: function( info ) {
      console.log( info );
      var htmlStr = template( "tpl", info );
      $('.lt_category_left ul').html( htmlStr );

      // 应该根据第一个一级分类的 id, 进行渲染二级分类
      renderSecondById( info.rows[0].id );
    }
  });

  // 2.点击左侧列表获取数据展示到右侧
  $('.lt_category_left').on("click", "a", function() {
    var id = $(this).data("id");
    renderSecondById( id );

    // 让当前点击的 a 加上 current, 让其他的 a 移除 current
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");
  });

  // 3.获取二级分类数据,并渲染二级分类
  function renderSecondById( id ) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      dataType: "json",
      success: function( info ) {
        $('.lt_category_right ul').html(template( "rightTpl", info ));
      }
    })
  }



});