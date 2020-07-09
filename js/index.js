$(function () {

    // 进入首页就发送请求，请求最新咨询
    $.ajax({
        type: "get",
        url: "http://localhost:8089/api/v1/index/latest",
        success: function (backdata) {
            // 调用模板引擎方法
            let res = template("latest_temp", backdata);
            // console.log(res);
            $(".common_news").html(res)
        }
    })

    // 热点图新闻
    $.ajax({
        type: "get",
        url: "http://localhost:8089/api/v1/index/hotpic",
        success: function (backdata) {
            // 调用模板引擎方法
            let res = template("hotpic_temp", backdata);
            // console.log(res);
            $(".focus_list").html(res)
        }
    })

    // 周热点排行
    $.ajax({
        type: "get",
        url: "http://localhost:8089/api/v1/index/rank",
        success: function (backdata) {
            // console.log(backdata);
            let res = template("hotrank_temp", backdata);
            // console.log(res);
            $(".hotrank_list").html(res)
        }
    })

    // 最新评论
    $.ajax({
        type: "get",
        url: "http://localhost:8089/api/v1/index/latest_comment",
        success: function (backdata) {
            // console.log(backdata);
            let res = template("comment_temp", backdata);
            // console.log(res);
            $(".comment_list").html(res)
        }
    })

    // 焦点关注
    $.ajax({
        type: "get",
        url: "http://localhost:8089/api/v1/index/attention",
        success: function (backdata) {
            // console.log(backdata);
            let res = template("attention_temp", backdata);
            // console.log(res);
            $(".guanzhu_list").html(res)
        }
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
        if(searchTxt == ""){
            alert("搜索的内容不能为空");
            return;
        }
        // 跳转到list.html页面，并把关键词传过去
        location.href = "./list.html?search="+searchTxt;
    })
    

})