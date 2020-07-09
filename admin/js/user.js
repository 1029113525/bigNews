$(function () {

    // 一进到用户信息页面就发送ajax请求
    $.ajax({
        type: "get",
        url: BigNew.user_detail,
        success: function (backdata) {
            for (let key in backdata.data) {
                $("." + key).val(backdata.data[key]);
            }
            $(".user_pic").attr("src", backdata.data.userPic)
        }
    })

    // 图片预览
    // 1.给选中图像的input标签设置值改变change事件
    // 2.获取选中的这个头像
    // 3.给这个头像文件设置一个url
    // 4.把这个url赋值给预览用的img的src属性
    $("#userPic").on("change", function () {
        // console.log(this.files[0]);
        // console.log(URL.createObjectURL(this.files[0]));
        let url = URL.createObjectURL(this.files[0]);
        $(".user_pic").attr("src", url)
    })


    // 点击修改修改个人信息
    $(".btn-edit").on("click", function (e) {
        // 阻止submit的默认跳转
        e.preventDefault();
        // 发送的是formdata数据
        let fd = new FormData(document.getElementById("form"));
        console.log(fd.get("userPic"));
        // 发送ajax请求
        $.ajax({
            type: "post",
            url: BigNew.user_edit,
            data: fd,
            //ajax2.0可以不用设置请求头，但是jq帮我们自动设置了，这样的话需要我们自己取消掉
            contentType: false,
            //取消帮我们格式化数据，是什么就是什么
            processData: false,
            success: function (backdata) {
                console.log(backdata);
                if (backdata.code == 200) {
                    alert("修改成功")
                    // 更新父窗口中的信息(刷新页面)
                    parent.window.location.reload();
                } else {
                    alert("修改失败")
                }
            }
        })


    })



})