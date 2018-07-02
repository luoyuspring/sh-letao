/**
 * Created by dell on 2018/6/29.
 */

$(function () {

  var currentPage = 1;
  var pageSize = 2;

  // 功能一: 进入页面根据传入数据渲染页面
  $('.search-input').val(getSearch('key'));
  function render(callback) {
    // 补: 动态添加加载延时效果盒子
    //$('.lt_product').html('<div class="loading"></div>');

    // 1.基本数据
    var data = {
      proName : $('.search-input').val(),
      page : currentPage,
      pageSize : pageSize,
    }
    // 2.判断是否需要排序,有current类的数据>0需要排序
    if ($('.sort .current').length > 0) {
      data[$('.sort .current').data('name')] = $('.sort .current').find('i').hasClass('fa-angle-down') ? 2 : 1;
    }

    // 3.通过ajax请求数据,并渲染页面
    $.ajax({
      type : 'get',
      url : '/product/queryProduct',
      data : data,
      dataType : 'json',
      success : function (info) {
        callback && callback(info);
      }
    });
  }

  // 功能二: 下拉刷新和上拉加载
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      // 1.下拉刷新
      down : {
        auto: true,//可选,默认false.首次加载自动上拉刷新一次
        callback : function () {
          currentPage = 1;
          //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          function callback(info) {
            setTimeout(function () {
              $('.lt_product').html(template('tpl', info));
              mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
              mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
            }, 500);
          }
          render(callback);
        }
      },
      // 2.上拉加载
      up : {
        callback : function () {
          currentPage++;
          function callback(info) {
            if (info.data.length === 0) {
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
            } else {
              setTimeout(function () {
                $('.lt_product').append(template('tpl', info));
                mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
              }, 500);
            }
          }
          render(callback);
        }
      }
    }
  });

  // 功能三: 1.点击搜索按钮获取信息渲染到页面
  //         2.将搜索框内容保存到本地
  $('.btn-search').on('click', function () {
    var key = $('.search-input').val();
    // 获取信息渲染到页面
    if (!key) {
      mui.toast('请输入搜索内容!');
      return;
    }

    // 渲染页面
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();


    // 将搜索框内容保存到本地
    var arr = JSON.parse(localStorage.getItem('searchList') || []);
    if (arr.indexOf(key) > -1) {
      arr.splice(arr.indexOf(key), 1);
    }
    if (arr.length >= 10) {
      arr.pop();
    }
    arr.unshift(key);
    localStorage.setItem('searchList', JSON.stringify(arr));
  })

  // 功能四: 点击价格和库存对应排序
  $('.sort a[data-name]').on('tap', function () {
    $(this).addClass('current').siblings().removeClass('current');
    $(this).find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');

    // 重新渲染
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

  })

  // 功能五: 点击商品跳转到商品详情页面
  $('body').on('tap', '.lt_product_item a', function () {
    location.href = 'product.html?key=' + $(this).data('id');
  })

});