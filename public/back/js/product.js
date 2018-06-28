/**
 * Created by dell on 2018/6/28.
 */

$(function () {

  // 1.声明全局变量
  var currentPage = 1;
  var pageSize = 5;
  var picArr = []; // 用于保存上传照片地址

  // 2.获取产品信息渲染到页面
  function render() {
    $.ajax({
      type : 'get',
      url : '/product/queryProductDetailList',
      data : {
        page : currentPage,
        pageSize : pageSize
      },
      dataType : 'json',
      success : function (info) {
        $('tbody').html(template('productTpl', info));
        $('#pagintor').bootstrapPaginator({
          bootstrapMajorVersion : 3,
          totalPages : Math.ceil(info.total / info.size),
          pageSize : info.size,
          onPageClicked : function (a, b, c, page) {
            currentPage = page;
            render();
          },
          itemTexts : function (type, page, current) {
            switch (type) {
              case 'first':
                return '首页';
              case 'prev':
                return '上一页';
              case 'page':
                return page;
              case 'next':
                return '下一页';
              case 'last':
                return '尾页';
            }
          },
          tooltipTitles : function (type, page, current) {
            switch (type) {
              case 'first':
                return '首页';
              case 'prev':
                return '上一页';
              case 'page':
                return '前往' + page + '页';
              case 'next':
                return '下一页';
              case 'last':
                return '尾页';
            }
          },
          useBootstrapTooltip :true
        });
      }
    });
  }
  render();
  
  // 3.点击添加按钮显示模态框,并将获取二级分类数据添加给模态框下拉列表
  $('.btn-add').on('click', function () {
    $('#productMoal').modal('show');
    $.ajax({
      type : 'get',
      url : '/category/querySecondCategoryPaging',
      data : {
        page : 1,
        pageSize : 1000
      },
      dataType : 'json',
      success : function (info) {
        $('.dropdown-menu').html(template('selectTpl', info));
      }
    })
  });

  // 4.将模态框下拉列表选中的id存入categoryId,值存入category
  $('.dropdown-menu').on('click', 'a', function () {
    $('#category').text($(this).text());
    $('#categoryId').val($(this).attr('data-id'));
    $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID');
  });

  // 5.上传图片
  $('#fileupload').fileupload({
    dataType : 'json',
    done : function (e, data) {
      picArr.unshift(data.result);
      $('.imgbox').prepend('<img src="' + data.result.picAddr + '" alt="" width="100" height="100">');
      if (picArr.length > 3) {
        picArr.pop();
        $('.imgbox img:last-of-type').remove();
      }
      if (picArr.length === 3) {
        $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID');
      }
    }
  });

  // 6.表单校验
  $('#form').bootstrapValidator({
    // 需要对隐藏域进行校验, 所以配置一下
    excluded: [],
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    fields : {
      brandId : {
        validators : {
          notEmpty : {
            message : '请选择二级分类'
          }
        }
      },
      proName : {
        validators : {
          notEmpty : {
            message : '请输入商品名称'
          }
        }
      },
      proDesc : {
        validators : {
          notEmpty : {
            message : '请输入商品描述'
          }
        }
      },
      num : {
        validators : {
          notEmpty : {
            message : '请输入商品库存'
          },
          regexp : {
            regexp : /^[1-9]\d*$/,
            message : '商品库存必须是非0开头数字'
          }
        }
      },
      size : {
        validators : {
          notEmpty : {
            message : '请输入商品尺码'
          },
          regexp : {
            regexp : /^\d{2}-\d{2}$/,
            message : '尺码必须是 XX-XX 格式'
          }
        }
      },
      oldPrice : {
        validators : {
          notEmpty : {
            message : '请输入商品原价'
          },
          regexp : {
            regexp : /^[1-9]\d*$/,
            message : '商品价格必须是非0开头数字'
          }
        }
      },
      price : {
        validators : {
          notEmpty : {
            message : '请输入商品现价'
          },
          regexp : {
            regexp : /^[1-9]\d*$/,
            message : '商品价格必须是非0开头数字'
          }
        }
      },
      picStatus : {
        validators : {
          notEmpty : {
            message : '请上传三张图片'
          }
        }
      }
    }
  });

  // 7.提交添加信息到后台,关闭模态框,重置表单
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault();

    var data = $('#form').serialize();
    data += '&picName1=' + picArr[0].picName + '&picAddr1=' + picArr[0].picAddr;
    data += '&picName2=' + picArr[1].picName + '&picAddr2=' + picArr[1].picAddr;
    data += '&picName3=' + picArr[2].picName + '&picAddr3=' + picArr[2].picAddr;
    $.ajax({
      type : 'post',
      url : '/product/addProduct',
      data : data,
      dataType : 'json',
      success : function (info) {
        if (info.success) {
          $('#productMoal').modal('hide');
          $('#form').data('bootstrapValidator').resetForm(true);
          $('.category').text('');
          $('.imgbox img').remove();
          currentPage = 1;
          render();
        }
      }
    })
  })

});