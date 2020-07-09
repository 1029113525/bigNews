$(function () {
    let id = location.search.split("=")[1];

    // 判断：如果id为undefined那么就回到首页
    if (!id) {
        location.href = "./index.html"
    }

    // 根据文章id发送ajax请求
    $.get({
        url: "http://localhost:8089/api/v1/index/article",
        data: {
            id
        },
        success: function (backdata) {
            // console.log(backdata);

            $(".breadcrumb").children("a:eq(1)").text(backdata.data.category);
            $(".article_title").text(backdata.data.title);
            $(".article_con").html(backdata.data.content);
            $(".article_info").html(template("article_info", backdata))

            if (backdata.data.prev == null) {
                $(".article_links a:eq(0)").text("无");
            } else {
                $(".article_links a:eq(0)").text(backdata.data.prev.title);
                $(".article_links a:eq(0)").attr("href", "./article.html?id=" + backdata
                    .data.prev.id);
            }
            if (backdata.data.next == null) {
                $(".article_links a:eq(1)").text("无");
            } else {
                $(".article_links a:eq(1)").text(backdata.data.next.title);
                $(".article_links a:eq(1)").attr("href", "./article.html?id=" + backdata
                    .data
                    .next.id);
            }

        }
    })

    // 展示该文章下的评论
    $.ajax({
        type: "get",
        url: "http://localhost:8089/api/v1/index/get_comment",
        data: {
            articleId: id
        },
        success: function (backdata) {
            $(".comment_count").text(backdata.data.length + "条评论");
            let res = template("comments_item", backdata);
            $(".comment_list_con").html(res);
        }
    })

    // 点击评论然后发表评论
    $(".comment_sub").on("click", function (e) {
        e.preventDefault();
        let commentname = $(".comment_name").val().trim();
        let commentcon = $(".comment_input").val().trim();
        if (commentname == "" || commentcon == "") {
            alert("用户名和内容不允许为空");
            return;
        }
        console.log(commentname,commentcon,id);
        // 发送ajax请求
        $.ajax({
            type: "post",
            url: "http://localhost:8089/api/v1/index/post_comment",
            data: {
                author: commentname,
                content: commentcon,
                articleId: id
            },
            success: function (backdata) {
                if (backdata.code == 201) {
                    alert("发表成功，等待管理员审核")
                    $(".comment_name").val("");
                    $(".comment_input").val("");
                }
            }
        })
    })


})