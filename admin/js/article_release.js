$(function () {

    // 头像预览
    $("#inputCover").on("change", function () {
        let file = this.files[0];
        let url = URL.createObjectURL(file);
        $(".article_cover").attr("src", url);

    })

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
                $(".category").html(res)
            }
        }
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

    // 点击发布按钮 发送ajax请求
    $(".btn-release").on("click", function (e) {
        e.preventDefault();
        let fd = new FormData(document.querySelector("form"))
        // 往fd对象中追加富文本编辑器的正文和已发布
        fd.append("content", editor2.txt.html());
        fd.append("state", "已发布");

        // 发送ajax请求
        $.ajax({
            type: "post",
            url: BigNew.article_publish,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backdata) {
                console.log(backdata);
                if (backdata.code == 200) {
                    alert("发布成功！")
                    parent.$("ul.level02>li:eq(0)").click();
                    location.href = "./article_list.html"
                }
            }
        })
    })

    // 点击存为草稿按钮
    $(".btn-draft").on("click", function (e) {
        e.preventDefault();
        let fd = new FormData(document.querySelector("form"))
        // 往fd对象中追加富文本编辑器的正文和已发布
        fd.append("content", editor2.txt.html());
        // fd.append("state", "已发布");

        // 发送ajax请求
        $.ajax({
            type: "post",
            url: BigNew.article_publish,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backdata) {
                console.log(backdata);
                if (backdata.code == 200) {
                    alert("保存成功！")
                    parent.$("ul.level02>li:eq(0)").click();
                    location.href = "./article_list.html"
                }
            }
        })
    })

})