$(function () {

    // 首先要判断是如何进入到list.html页面的
    let param = location.search.split("=")[0];
    let key = location.search.split("=")[1];
    // 把关键词解码 decodeURI();
    key = decodeURI(key);
    // 判断:如果直接输入网址list.html进入这个页面，那么将直接回到前台首页
    searchArticle(param, key);

    function searchArticle(param, key) {
        if (param == "") {
            location.href = "./index.html";
        } else if (param == "?search") {
            // $(".setfr>.list_title h3").text("关键词：" + key);
            // 发送ajax请求
            $.ajax({
                type: "get",
                url: "http://localhost:8089/api/v1/index/search",
                data: {
                    key,
                },
                success: function (backdata) {
                    if (backdata.data.data.length > 0) {
                        let res = template("category_list", backdata.data);
                        $(".setfr").html(
                            `<div class="list_title"><h3>关键词:${key}</h3></div>` +
                            res)
                        // 分页插件方法
                        $("#pagination").pagination({
                            currentPage: 1,
                            totalPage: Math.ceil(backdata.data.totalCount /
                                6), //总页数=总条数/每页显示条数  向上取整
                            callback: function (current) { //点击页码的回调函数，current为当前页
                                console.log(current);

                                // 发送ajax请求
                                $.ajax({
                                    type: "get",
                                    url: "http://localhost:8089/api/v1/index/search",
                                    data: {
                                        key: key,
                                        page: current
                                    },
                                    success: function (backdata) {
                                        let res = template(
                                            "category_list",
                                            backdata.data);
                                        $(".setfr").html(
                                            `<div class="list_title"><h3>关键词:${key}</h3></div>` +
                                            res)
                                    }
                                })
                            }
                        });
                    } else {
                        $(".setfr").html(`<h1>没有数据</h1>`);
                    }

                }
            })
        } else if (param == "?categoryId") {
            // 发送ajax请求
            $.ajax({
                type: "get",
                url: "http://localhost:8089/api/v1/index/search",
                data: {
                    type: key,
                },
                success: function (backdata) {
                    console.log(backdata);
                    if (backdata.data.data.length > 0) {
                        let res = template("category_list", backdata.data);
                        $(".setfr").html(
                            `<div class="list_title"><h3>${backdata.data.data[0].category}</h3></div>` +
                            res)
                        // 分页插件方法
                        $("#pagination").pagination({
                            currentPage: 1,
                            totalPage: Math.ceil(backdata.data.totalCount /
                                6), //总页数=总条数/每页显示条数  向上取整
                            callback: function (current) { //点击页码的回调函数，current为当前页
                                console.log(current);

                                // 发送ajax请求
                                $.ajax({
                                    type: "get",
                                    url: "http://localhost:8089/api/v1/index/search",
                                    data: {
                                        type: key,
                                        page: current
                                    },
                                    success: function (backdata) {
                                        let res = template(
                                            "category_list",
                                            backdata.data);
                                        $(".setfr").html(
                                            `<div class="list_title"><h3>${backdata.data.data[0].category}</h3></div>` +
                                            res)
                                    }
                                })
                            }
                        });

                    } else { //没有数据
                        $(".setfr").html(`<h1>没有数据</h1>`);
                    }

                }
            })
        }
    }



    // 文章搜索
    $(".search_txt").on("focus", function () {
        $(window).on("keypress", function (e) {
            if (e.keyCode == 13) {
                $(".search_btn").trigger("click");
            }
        })
    })
    $(".search_txt").on("blur", function () {
        $(window).off("keypress")
    })

    $(".search_btn").on("click", function () {
        // 获取输入的关键词
        let searchTxt = $(".search_txt").val().trim();
        // 非空判断
        if (searchTxt == "") {
            alert("搜索的内容不能为空");
            return;
        }
        // 调用封装好的ajax方法
        searchArticle("?search", searchTxt);
        // 跳转到list.html页面，并把关键词传过去
        // location.href = "./list.html?search=" + searchTxt;
    })
    // 文章类别
    $.ajax({
        type: "get",
        url: "http://localhost:8089/api/v1/index/category",
        success: function (backdata) {
            if (backdata.code == 200) {
                // 设置竖着的文章类别列表
                let res = template("category_temp", backdata);
                $(".level_two").html("<li class='up'></li>" + res) //竖着的需要拼接一个up li标签
                // 设置横着的文章类别列表
                $(".left_menu").html(res)

            }
        }
    })

})