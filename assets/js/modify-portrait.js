$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  $("#choose-image-button").on("click", function (event) {
    $("#choose-image-input").click();
  });

  $("#choose-image-input").on("change", function (event) {
    var files = event.target.files;
    if (files.length !== 0) {
      var url = URL.createObjectURL(files[0]);
      $image
        .cropper("destroy") // 销毁旧的裁剪区域
        .attr("src", url) // 重新设置图片路径
        .cropper(options); // 重新初始化裁剪区域
    } else {
      layui.layer.msg("请选择图片！");
    }
  });

  $("#confirm-button").on("click", function (event) {
    var url = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    $.ajax({
      type: "POST",
      url: "/my/update/avatar",
      data: {
        avatar: url,
      },
      success: (result) => {
        layui.layer.msg(result.message);
        if (result.status === 0) {
          // 修改头像成功
          window.parent.getUserInfo();
        }
      },
    });
  });
});
