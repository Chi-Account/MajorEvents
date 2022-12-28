$(function () {
  getUserInfo();

  $("#logout").on("click", function () {
    var layer = layui.layer;
    layer.confirm(
      "确定退出登录？",
      { icon: 3, title: "提示" },
      function (index) {
        localStorage.removeItem("token");
        location.href = "/login.html";
        layer.close(index);
      }
    );
  });
});

function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    success: (result) => {
      if (result.status === 0) {
        showUserInfo(result.data);
      }
    },
  });
}

function showUserInfo(userInfo) {
  var username = userInfo.nickname || userInfo.username;
  $(".username-span").html(username);

  if (userInfo.user_pic === null) {
    // 显示文字头像
    $(".layui-nav-img").hide();
    var portraitText = username[0].toUpperCase();
    $(".text-portrait").html(portraitText).show();
  } else {
    // 显示头像
    $(".layui-nav-img").attr("src", userInfo.user_pic).show();
    $(".text-portrait").hide();
  }
}
