$(function () {
  var form = layui.form;
  form.verify({
    nickname: function (value, item) {
      //value：表单的值、item：表单的DOM对象
      if (value.length < 1 || value.length > 6) {
        return "昵称长度必须在 1 ~ 6 个字符之间！";
      }
    },
  });

  $("#reset-button").on("click", function (event) {
    event.preventDefault();
    getUserInfo();
  });

  $("#user-info-form").on("submit", function (event) {
    event.preventDefault();
    var data = $(this).serialize();

    $.ajax({
      type: "POST",
      url: "/my/userinfo",
      data: data,
      success: (result) => {
        var layer = layui.layer;
        layer.msg(result.message);
        if (result.status === 0) {
            window.parent.getUserInfo();
        }
      },
    });
  });

  getUserInfo();
});

function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    success: (result) => {
      var layer = layui.layer;
      if (result.status === 0) {
        //给表单赋值
        var form = layui.form;
        form.val("user-info-form", result.data);

        //获取表单区域所有值
        // var data1 = form.val("formTest");
      } else {
        layer.msg(result.message);
      }
    },
  });
}
