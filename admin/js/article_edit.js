$(function () {

    // 头像预览
    $("#inputCover").on("change", function () {
        let file = this.files[0];
        let url = URL.createObjectURL(file);
        $(".article_cover").attr("src", url);

    })

    /* 日期插件方法 */
    jeDate("#testico", {
        isinitVal: true, //初始化事件
        format: "YYYY-MM-DD",
        isTime: false,
        minDate: "2014-09-19 00:00:00"
    })
    /* 富文本编辑器 */
    var E = window.wangEditor
    var editor2 = new E('#editor')
    editor2.create()

    // 一进到页面发送ajax请求，请求文章类别的数量
    $.get({
        url: BigNew.category_list,
        success: function (backdata) {
            if (backdata.code == 200) {
                // 调用模板引擎的template方法
                // console.log(backdata);
                let res = template("category_item", backdata);
                // console.log(res);
                $(".category").html(res)
            }
        }
    })

    let id = null;
    new Promise((resolve, reject) => {
        $.get({
            url: BigNew.category_list,
            success: function (backdata) {
                if (backdata.code == 200) {
                    // 调用模板引擎的template方法
                    // console.log(backdata);
                    let res = template("category_item", backdata);
                    // console.log(res);
                    $(".category").html(res);
                    resolve();
                } else {
                    reject(backdata.msg);
                }
            }
        })
    }).then(function () {
        // 获取传递过来的需要编辑的文章id，然后发送ajax请求发送该文章的信息
        id = location.search.split("=")[1];
        $.ajax({
            type: "get",
            url: BigNew.article_search,
            data: {
                id
            },
            success: function (backdata) {
                console.log(backdata.data);
                if (backdata.code == 200) {
                    // 显示数据到编辑页面中
                    $("#inputTitle").val(backdata.data.title);
                    $(".category").val(backdata.data.categoryId);
                    $(".article_cover").attr("src", backdata.data.cover);
                    $(".jeinput").val(backdata.data.date);
                    editor2.txt.html(backdata.data.content);
                }
            }
        })
    }, function (msg) {
        console.log(msg);
    })


    // 点击修改已发布按钮 发送ajax请求
    $(".btn-edit").on("click", function (e) {
        e.preventDefault();
        let fd = new FormData(document.querySelector("form"))
        // 往fd对象中追加富文本编辑器的正文和已发布，还有id
        fd.append("content", editor2.txt.html());
        fd.append("id", id)
        fd.append("state", "已发布");

        // 发送ajax请求
        $.ajax({
            type: "post",
            url: BigNew.article_edit,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backdata) {
                console.log(backdata);
                if (backdata.code == 200) {
                    alert("修改成功！")
                    history.back(); //因为用户编辑页都是用户从文章页进来里的，所以回退就直接回去了
                    // parent.$("ul.level02>li:eq(0)").click();
                    // location.href = "./article_list.html"
                }
            }
        })
    })

    // 点击修改保存为草稿按钮
    $(".btn-draft").on("click", function (e) {
        e.preventDefault();
        let fd = new FormData(document.querySelector("form"))
        // 往fd对象中追加富文本编辑器的正文和已发布 还有文章id
        fd.append("content", editor2.txt.html());
        fd.append("id", id);
        // fd.append("state", "草稿");//为空就默认为草稿

        // 发送ajax请求
        $.ajax({
            type: "post",
            url: BigNew.article_edit,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backdata) {
                console.log(backdata);
                if (backdata.code == 200) {
                    alert("修改成功！")
                    history.back(); //因为用户编辑页都是用户从文章页进来里的，所以回退就直接回去了
                }
            }
        })
    })

})