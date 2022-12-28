$(function () {
  var form = layui.form; // 获得 form 模块对象
  form.verify({
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    password: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    newPassword: function (value) {
      var password = $("#password").val();
      if (value === password) {
        return "新密码不能和原密码一致！";
      }
    },
    confirmNewPassword: function (value) {
      var newPassword = $("#new-password").val();
      if (value !== newPassword) {
        return "两次输入的新密码不一致！";
      }
    },
  });

  $("#password-form").on("submit", function (event) {
    event.preventDefault();
    var data = {
      oldPwd: $("#password").val(),
      newPwd: $("#new-password").val(),
    };

    $.ajax({
      type: "POST",
      url: "/my/updatepwd",
      data: data,
      success: (result) => {
        var layer = layui.layer;
        layer.msg(result.message);
        if (result.status === 0) {
          // 密码修改成功
          $("#password-form")[0].reset();
        }
      },
    });
  });
});
