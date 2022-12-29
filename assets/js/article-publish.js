$(function () {
  $("#choose-image-button").on("click", function (event) {
    $("#choose-image-input").click();
  });

  $("#choose-image-input").on("change", function (event) {
    var files = event.target.files;
    if (files.length !== 0) {
      var url = URL.createObjectURL(files[0]);
      var $image = $("#image");
      // 2. 裁剪选项
      var options = {
        aspectRatio: 400 / 280,
        preview: ".img-preview",
      };
      $image
        .cropper("destroy") // 销毁旧的裁剪区域
        .attr("src", url) // 重新设置图片路径
        .cropper(options); // 重新初始化裁剪区域
    } else {
      layui.layer.msg("请选择图片！");
    }
  });

  var state = null;
  $("#submit-button").on("click", function (event) {
    state = "已发布";
  });

  $("#storage-button").on("click", function (event) {
    state = "草稿";
  });

  $("#article-form").on("submit", function (event) {
    event.preventDefault();
    tinyMCE.triggerSave();

    var formData = new FormData($(this)[0]);

    var $image = $("#image");
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        formData.append("cover_img", blob);
        formData.append("state", state);
        publishArticle(formData);
      });
  });

  getCategory();

  // 初始化富文本编辑器
  initEditor();

  initCropper();
});

function getCategory() {
  $.ajax({
    type: "GET",
    url: "/my/article/cates",
    success: (result) => {
      if (result.status === 0) {
        var html = template("category-template", result);
        $("#category-select").html(html);
        layui.form.render();
      } else {
        layui.layer.msg(result.message);
      }
    },
  });
}

function initCropper() {
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);
}

function publishArticle(formData) {
  formData.forEach((element, key) => {
    console.log(key + "  " + element);
  });
  $.ajax({
    method: "POST",
    url: "/my/article/add",
    data: formData,
    // 不修改Content-Type, 使用FormData默认的Content-Type值
    contentType: false,
    // 不处理FormData中的数据，将其原样发送到服务器
    processData: false,
    success: (result) => {
      layui.layer.msg(result.message);
      if (result.status === 0) {
        // 发布成功
        // location.href = "/article/article-list.html";
      }
    },
  });
}
