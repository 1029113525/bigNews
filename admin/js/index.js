$(function () {
    // 进入首页就应该获取登录者的个人信息，显示在页面上
    $.ajax({
        type: "get",
        url: BigNew.user_info,
        // 设置请求头信息，将token传过去验证。
        // 在jquery全局做了设置
        success: function (backdata) {
            // console.log(backdata);
            if (backdata.code == 200) {
                // 修改人物姓名和头像
                $(".username").text(backdata.data.nickname);
                $(".user_info>img").attr("src", backdata.data.userPic);
                $(".user_center_link>img").attr("src", backdata.data.userPic);
            }

        }
    })

    // 给登出按钮绑定点击事件：实现登出功能
    $(".logout").on("click", function () {
        if (confirm("你确定要退出吗")) {
            localStorage.removeItem("token");
            location.href = "./login.html"
        }
    })

    // 给左侧栏添加点击显示 样式切换事件
    $(".menu .level01").on("click", function () {
        $(this).addClass("active").siblings(".level01").removeClass("active");
        $(this).children().children("b").toggleClass("rotate0");
        if($(this).index(".level01")!=$(".menu .level01:eq(1)").index(".level01")){
            $(".menu .level02>li").removeClass("active")
        }
    })
    $(".menu .level01:eq(1)").on("click", function () {
        $(".menu .level02").slideToggle()
        
    })
    $(".menu .level02>li").on("click", function () {
        $(this).addClass("active").siblings("li").removeClass("active")
        $(".menu .level01:eq(1)").addClass("active").siblings(".level01").removeClass("active")
    })

    

})