$(function () {

    // 一进到页面就发送请求查询文章类别
    function getDate() {
        $.get({
            type: "get",
            url: BigNew.category_list,
            success: function (backdata) {
                if (backdata.code == 200) {
                    // 调用模板引擎的template方法
                    let res = template("category_temp", backdata)
                    // console.log(res);
                    $("tbody").html(res);
                }
            }
        })
    }
    getDate();

    // 判断到底是新增分类弹出模态框还是编辑弹出的模态框
    // 也可以用show.bs.modal这个事件：在模态框显示的时候触发
    // 然后用e.relatedTarget属性进行判断点击的是哪一个按钮

    // 点击新增分类弹出对应的模态框
    $("#xinzengfenlei").on("click", function () {
        $("#recipient-name").val("");
        $("#message-text").val("");
        $("#myModal .modal-title").text("新增分类");
        $("#myModal .modal-footer button:eq(1)").text("新增");
        $("#myModal .modal-footer button:eq(1)").removeClass("btn-success");
    })
    // 点击编辑弹出对应的模态框
    $(".common_con tbody").on("click", ".editBtn", function () {
        $("#myModal .modal-title").text("编辑分类");
        $("#myModal .modal-footer button:eq(1)").text("编辑");
        $("#myModal .modal-footer button:eq(1)").addClass("btn-success");
        // 数据的回显 发送ajax请求将当前点击编辑的文章类别进行回显
        let id = $(this).data("id");
        $("#hideEditID").val(id);
        $.ajax({
            type: "get",
            url: BigNew.category_search,
            data: {
                id
            },
            success: function (backdata) {
                if (backdata.code == 200) {
                    $("#recipient-name").val(backdata.data[0].name);
                    $("#message-text").val(backdata.data[0].slug);
                }
            }
        })
    })

    // 给新增和编辑按钮绑定点击事件
    $("#addOredit-category").on("click", function () {
        // 使用文字内容判断点击的是新增还是编辑按钮
        if ($(this).text() == "新增") {
            // console.log('发送新增分类请求');
            let categoryName = $("#recipient-name").val().trim();
            let categorySlug = $("#message-text").val().trim();
            $.ajax({
                type: "post",
                url: BigNew.category_add,
                data: {
                    name: categoryName,
                    slug: categorySlug
                },
                success: function (backdata) {
                    if (backdata.code = 200) {
                        alert("新增成功");
                        // 刷新分类数据
                        getDate();
                        // 清楚新增分类模态框中input的值
                        $("#recipient-name").val("");
                        $("#message-text").val("");
                        // 隐藏模态框
                        $("#myModal").modal("hide");
                    }
                }
            })
        } else {
            // console.log('发送编辑分类请求');
            let id = $("#hideEditID").val();
            let categoryName = $("#recipient-name").val().trim();
            let categorySlug = $("#message-text").val().trim();
            $.ajax({
                type: "post",
                url: BigNew.category_edit,
                data: {
                    id:id,
                    name: categoryName,
                    slug: categorySlug
                },
                success: function (backdata) {
                    if (backdata.code == 200) {
                        alert("修改成功")
                        getDate();
                        // 清楚编辑分类模态框中input的值
                        $("#recipient-name").val("");
                        $("#message-text").val("");
                        // 隐藏模态框
                        $("#myModal").modal("hide");
                    }
                }
            })
        }
    })

    // 给删除按钮添加点击事件
    $(".common_con tbody").on("click", ".deleteBtn", function () {
        // 将id值传过来
        let id=$(this).data("id");
        // console.log(id);
        if(confirm("你确定要删除这个分类吗？")){
            // 发送ajax请求
            $.ajax({
                type:"post",
                url:BigNew.category_delete,
                data:{id},
                success:function(backdata){
                    alert(backdata.msg);
                    if(backdata.msg=="删除成功"){
                        getDate();
                    }
                }
            })
        }

    })

})