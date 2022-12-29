$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var addCategoryDialogIndex;
  $("#add-category-button").on("click", function () {
    addCategoryDialogIndex = layui.layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#add-category-dialog").html(), //这里content是一个普通的String
    });
  });

  $("body").on("submit", "#add-category-form", function (event) {
    event.preventDefault();
    var data = $(this).serialize();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: data,
      success: (result) => {
        layui.layer.msg(result.message);
        if (result.status === 0) {
          // 添加分类成功
          layui.layer.close(addCategoryDialogIndex);
          getCategory();
        }
      },
    });
  });

  var editCategoryDialogIndex;
  $("#tbody").on("click", "#edit-button", function (event) {
    var id = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: `/my/article/cates/${id}`,
      success: (result) => {
        if (result.status === 0) {
          // 获取数据成功，绑定数据
          editCategoryDialogIndex = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#edit-category-dialog").html(), //这里content是一个普通的String
          });
          form.val("edit-category-form", result.data);
        } else {
          layer.msg(result.message);
        }
      },
    });
  });

  $("body").on("submit", "#edit-category-form", function (event) {
    event.preventDefault();
    var data = $(this).serialize();
    // 修改文章分类
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: data,
      success: (result) => {
        layer.msg(result.message);
        if (result.status === 0) {
          // 修改文章分类成功
          layer.close(editCategoryDialogIndex);
          getCategory();
        }
      },
    });
  });

  $("#tbody").on("click", "#delete-button", function () {
    var id = $(this).attr("data-id");
    layer.confirm("确认删除？", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: `/my/article/deletecate/${id}`,
        success: (result) => {
          layer.msg(result.message);
          if (result.status === 0) {
            // 删除文章分类成功
            layer.close(index);
            getCategory();
          }
        },
      });
    });
  });

  getCategory();
});

function getCategory() {
  $.ajax({
    type: "GET",
    url: "/my/article/cates",
    success: (result) => {
      if (result.status === 0) {
        var html = template("tbody-template", result);
        $("#tbody").html(html);
      } else {
        layui.layer.msg(result.message);
      }
    },
  });
}
