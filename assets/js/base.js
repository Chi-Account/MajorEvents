$.ajaxPrefilter(function (options) {
  options.url = `http://www.liulongbin.top:3007${options.url}`;

  options.headers = {
    Authorization: localStorage.getItem("token") || "",
  };

  options.complete = (result) => {
    if (
      result.responseJSON.status === 1 &&
      result.responseJSON.message === "身份认证失败！"
    ) {
      // 身份认证失败
      localStorage.removeItem("token");
      location.href = "/login.html";
    }
  };
});
