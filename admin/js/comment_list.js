$(function () {
    $("tbody").text("请求中...");

    // 定义一个currentPage存当前页
    let currentPage = 1;
    // 一、发送ajax请求请求文章搜索评论接口

    function showCommtens(page, callback) {
      $.ajax({
        type: "get",
        url: BigNew.comment_list,
        data: {
          page: page,
          perpage: 10
        },
        success: function (backdata) {
          // 1.1将请求的数据渲染到页面
          let res = template("comments_item", backdata.data);
          $("tbody").html(res);

          // 分页数据判断
          if (backdata.data.data.length != 0) { //如果有数据
            $(".showTitle").hide().siblings().show();
            typeof callback === "function" ? callback(backdata) : null
          } else if (backdata.data.data
            .length == 0 && currentPage == 1) { //如果没有数据并且是第一页
            $(".showTitle").show().siblings().hide();
          } else if (backdata.data.totalPage == currentPage - 1 && backdata.data.data
            .length == 0) { //如果点击删除数据当前页(800页)的数据都没了，此时总页数为799页当前页还为800页，因此重绘页面
            currentPage -= 1;
            // 重新绘制分页结构
            $("#pagination").twbsPagination("changeTotalPages", backdata.data
              .totalPage, currentPage)
          }
        }
      })
    }

    function showPages(backdata) {
      //1.2、请求成功之后写 绘制分页插件
      $('#pagination').twbsPagination({
        totalPages: backdata.data.totalPage, //总页数
        visiblePages: 10, //最大可见页数
        first: "首页",
        prev: "上一页",
        next: "下一页",
        last: "尾页",
        onPageClick: function (event, page) { //点击触发这个回调函数
          // 点击页面跳转的时候给currentPage当前页赋值
          currentPage = page;

          showCommtens(currentPage, null);
        }
      })
    }
    showCommtens(currentPage, function (backdata) {
      showPages(backdata)
    });


    // 二、通过
    $("tbody").on("click", ".btn-ok", function () {
      let id = $(this).data("id");

      // 发送ajax请求
      $.ajax({
        type: "post",
        url: BigNew.comment_pass,
        data: {
          id
        },
        success: function (backdata) {
          if (backdata.code == 200) {
            alert("审核通过")
            showCommtens(currentPage, null);
          }
        }
      })

    })
    // 三、删除
    $("tbody").on("click", ".btn-delete", function () {
      let id = $(this).data("id");

      if (confirm("你确定要删除这条评论吗？")) {
        // 发送ajax请求
        $.ajax({
          type: "post",
          url: BigNew.comment_delete,
          data: {
            id
          },
          success: function (backdata) {
            if (backdata.code == 200) {
              alert("删除成功")
              showCommtens(currentPage, function (backdata) {
                $("#pagination").twbsPagination(
                  "changeTotalPages", backdata.data.totalPage,
                  currentPage)
              });
            }
          }
        })
      }

    })
    // 四、拒绝
    $("tbody").on("click", ".btn-refuse", function () {
      let id = $(this).data("id");

      // 发送ajax请求
      $.ajax({
        type: "post",
        url: BigNew.comment_reject,
        data: {
          id
        },
        success: function (backdata) {
          if (backdata.code == 200) {
            alert("已拒绝")
            showCommtens(currentPage, null);
          }
        }
      })

    })



  })