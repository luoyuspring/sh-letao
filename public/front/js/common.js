/**
 * Created by dell on 2018/6/28.
 */

$(function () {

  // 1.获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
  });

  // 2.区域滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });

});

// 3.解析地址栏字符串方法封装
function getSearch(name) {
  var arr = decodeURI(location.search).slice(1).split('&');
  var obj = {};
  arr.forEach(function (v, i) {
    obj[v.split('=')[0]] = v.split('=')[1];
  })
  return obj[name];
}