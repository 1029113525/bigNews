$(function () {

    // 1.给登录按钮绑定点击事件
    $(".input_sub").on("click", function (e) {
      // 1.1阻止submit的默认跳转
      e.preventDefault();
      // 1.2获取用户输入的用户名和密码
      let username = $(".input_txt").val().trim();
      let password = $(".input_pass").val().trim();

      // 判断用户名和密码是否为空
      if (username.trim() == "" || password.trim() == "") {
        $('.modal').modal()
        $('.modal .modal-body>p').text("用户名或者密码不能为空！");
        return;
      }

      // 1.3发送ajax请求
      $.ajax({
        type: "post",
        url: BigNew.user_login,
        data: {
          username,
          password
        },
        success: function (data) {
          // console.log(data);
          // 1.4对返回的数据进行判断是否登录成功
          if (data.code == 400) {
            // alert("用户名或者密码错误");
            $('.modal').modal()
            $('.modal .modal-body>p').text("用户名或者密码错误");
            return;
          } else if (data.code == 200) {
            $('.modal').modal()
            $('.modal .modal-body>p').text("登录成功");
            $('.modal').on('hide.bs.modal', function (e) {
              // 将获取的token值保存在本地localstorage中
              localStorage.setItem("token",data.token);
              location.href = "./index.html";
            })
          }

        }
      })



    })



  })