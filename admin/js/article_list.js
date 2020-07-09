$(function () {
    // 一进到页面发送ajax请求，请求文章类别的数量
    $.get({
        type: "get",
        url: BigNew.category_list,
        success: function (backdata) {
            if (backdata.code == 200) {
                // 调用模板引擎的template方法
                // console.log(backdata);
                let res = template("category_item", backdata);
                // console.log(res);
                $("#selCategory").html(res)
            }
        }
    })

    /* 
        封装ajax请求
        1.一进到页面发送ajax请求，渲染完成   后面传入分页方法
        2.在分页插件的onpageClick，渲染完成  后面没有反方
        3.点击筛选按钮发送ajax请求，渲染完成 根据新的页码重绘分页结构
     */
    let currentPage = null; //当前页码

    function showAritcleData(mypage, callback) {
        $.get({
            type: "get",
            url: BigNew.article_query,
            data: {
                type: $("#selCategory").val(),
                state: $("#selStatus").val(),
                page: mypage,
                perpage: 3
            },
            success: function (backdata) {
                console.log(backdata);
                if (backdata.code == 200) {
                    // 调用模板引擎的template方法
                    let res = template("article_item", backdata.data);
                    $("tbody").html(res)

                    // 分页数据判断
                    if (backdata.data.data.length != 0) {
                        $(".showTitle").hide().siblings().show();
                        typeof callback === "function" ? callback(backdata) : null
                    } else if (backdata.data.data
                        .length == 0 && currentPage == 1) {
                        $(".showTitle").show().siblings().hide();
                    } else if (backdata.data.totalPage == currentPage - 1 && backdata.data.data
                        .length == 0) {
                        currentPage -= 1;
                        // 重新绘制分页结构
                        // 第一个参数是事件的名字
                        // 第二个参数是改变后的总的页码
                        // 第三个参数是当前要显示的页码
                        $("#pagination").twbsPagination("changeTotalPages", backdata.data
                            .totalPage, currentPage)
                    }
                }
            }
        })
    }

    function showPages(backdata) {
        //请求成功之后写 分页插件
        $('#pagination').twbsPagination({
            totalPages: backdata.data.totalPage, //总页数
            visiblePages: 6, //最大可见页数
            first: "首页",
            prev: "上一页",
            next: "下一页",
            last: "尾页",
            onPageClick: function (event, page) { //点击触发这个回调函数
                // 给当前页码赋值
                currentPage = page;

                showAritcleData(page, null)
            }
        })
    }
    // 调用显示文章显示的方法，并传入回调函数执行分页方法
    showAritcleData(1, showPages);
    // 点击筛选按钮发送ajax请求进行筛选
    $("#btnSearch").on("click", function (e) {
        e.preventDefault();
        // 点击筛选需要把当前页改为1
        currentPage = 1;
        showAritcleData(1, function (backdata) {
            // 点击筛选之后由于改变了筛选条件，我们需要根据新的数据重新生成分页数
            $("#pagination").twbsPagination("changeTotalPages", backdata.data.totalPage, 1)
        })
    })


    // 点击删除删除文章：用委托给删除按钮绑定点击事件
    $("tbody").on("click", ".delete", function () {
        if (confirm("你确定要删除吗")) {
            let id = $(this).data("id");
            $.ajax({
                type: "post",
                url: BigNew.article_delete,
                data: {
                    id
                },
                success: function (backdata) {
                    if (backdata.code == 204) {
                        // alert("删除成功");
                        // 由于删除了数据，那么总页码就会减少，那就应该根据新的总页码重新生成分页结构
                        showAritcleData(currentPage, function (backdata) {
                            $("#pagination").twbsPagination(
                                "changeTotalPages", backdata.data.totalPage,
                                currentPage)
                        });
                    }
                }
            })
        }

    })
})

// 点击发表文章跳转到发表文章的iframe
$("#release_btn").on("click", function () {
    parent.$("ul.level02>li:eq(1)").click();
})

// 对下面的代码进行了封装
/* 
$.get({
        type: "get",
        url: BigNew.article_query,
        data: {
            type: $("#selCategory").val(),
            state: $("#selStatus").val(),
            page: 1,
            perpage: 6
        },
        success: function (backdata) {
            // console.log(backdata);
            if (backdata.code == 200) {
                // 调用模板引擎的template方法
                let res = template("article_item", backdata.data);
                $("tbody").html(res)


                //请求成功之后写 分页插件
                $('#pagination').twbsPagination({
                    totalPages: backdata.data.totalPage, //总页数
                    visiblePages: 6, //最大可见页数
                    first: "首页",
                    prev: "上一页",
                    next: "下一页",
                    last: "尾页",
                    onPageClick: function (event, page) { //点击触发这个回调函数
                        // console.log(page); //当前点击的页码数
                        $.get({
                            type: "get",
                            url: BigNew.article_query,
                            data: {
                                type: $("#selCategory").val(),
                                state: $("#selStatus").val(),
                                page: page, //将点击的页码穿过来再次发送ajax请求
                                perpage: 6
                            },
                            success: function (backdata) {
                                if (backdata.code == 200) {
                                    // 调用模板引擎的template方法
                                    let res = template(
                                        "article_item", backdata
                                        .data);
                                    $("tbody").html(res)
                                }
                            }
                        })
                    }
                })
            }
        }
    })
    // 点击筛选按钮发送ajax请求进行筛选
    $("#btnSearch").on("click", function (e) {
        e.preventDefault();
        $.get({
            type: "get",
            url: BigNew.article_query,
            data: {
                type: $("#selCategory").val(),
                state: $("#selStatus").val(),
                page: 1,
                perpage: 6
            },
            success: function (backdata) {
                console.log(backdata);
                if (backdata.code == 200) {
                    // 调用模板引擎的template方法
                    let res = template("article_item", backdata.data);
                    $("tbody").html(res)

                    // 点击筛选之后由于改变了筛选条件，我们需要根据新的数据重新生成分页数
                    $("#pagination").twbsPagination(
                        "changeTotalPages",
                        backdata.data.totalPage,
                        1)

                }
            }
        })

    }) 

 */