$(() => {
  $("#to-register").on("click", () => {
    $(".login-area").hide();
    $(".register-area").show();
  });

  $("#to-login").on("click", () => {
    $(".register-area").hide();
    $(".login-area").show();
  });

  var form = layui.form; // 获得 form 模块对象
  form.verify({
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    password: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repassword: function (value) {
      // 密码框内容
      var repassword = $(".register-area [name=password]").val();
      if (value !== repassword) {
        return "两次输入的密码不一致";
      }
    },
  });

  $("#register-form").on("submit", function (event) {
    event.preventDefault();
    var username = $("#register-form [name=username]").val();
    var password = $("#register-form [name=password]").val();
    // 注册
    $.post(
      "/api/reguser",
      {
        username: username,
        password: password,
      },
      (result) => {
        var layer = layui.layer;
        layer.msg(result.message);
        if (result.status === 0) {
          // 成功
          $("#to-login").click();
        }
      }
    );
  });

  $("#login-form").on("submit", function (event) {
    event.preventDefault();
    $.post("/api/login", $(this).serialize(), (result) => {
      var layer = layui.layer;
      layer.msg(result.message);
      if (result.status === 0) {
        // 登录成功，保存token, 跳转页面
        localStorage.setItem("token", result.token);
        location.href = "/index.html";
      }
    });
  });
});
