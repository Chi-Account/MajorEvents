$(function () {
  function addPrefix(number) {
    if (number >= 10) {
      return number.toString();
    } else {
      return `0${number}`;
    }
  }

  template.defaults.imports.formatDate = function (date) {
    var tempDate = new Date(date);

    var year = tempDate.getFullYear();
    var month = tempDate.getMonth() + 1;
    var day = tempDate.getDate();

    var hours = tempDate.getHours();
    var minutes = tempDate.getMinutes();
    var seconds = tempDate.getSeconds();

    return `${year}-${addPrefix(month)}-${addPrefix(day)} ${addPrefix(
      hours
    )}:${addPrefix(minutes)}:${addPrefix(seconds)}`;
  };

  var params = {
    pagenum: 1,
    pagesize: 2,
    cate_id: "",
    state: "",
  };

  $("#filter-form").on("submit", function (event) {
    event.preventDefault();
    var cate_id = $("#category-select").val();
    var state = $("#state-select").val();
    params.cate_id = cate_id;
    params.state = state;
    getArticleList(params);
  });

  $("#tbody").on("click", "#delete-button", function () {
    var id = $(this).attr("data-id");
    layer.confirm("确认删除？", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: `/my/article/delete/${id}`,
        success: (result) => {
          layer.msg(result.message);
          if (result.status === 0) {
            // 删除文章分类成功
            layer.close(index);
            // 根据删除按钮的数量，判断是否已经是最后一页，且删除了最后一条数据
            if ($("#delete-button").length == 1) {
              params.pagenum = params.pagenum == 1 ? 1 : params.pagenum - 1;
            }
            getArticleList(params);
          }
        },
      });
    });
  });

  getArticleList(params);

  getCategory();
});

/*
 * 获取文章列表
 */
function getArticleList(params) {
  $.ajax({
    type: "GET",
    url: "/my/article/list",
    data: params,
    success: (result) => {
      if (result.status === 0) {
        // TODO 张智琦
        for (var i = 0; i < params.pagesize; i++) {
          result.data.push({
            Id: 1,
            title: `猫哥：${params.pagenum} ${i + 1}`,
            pub_date: "2020-01-03 12:19:57.690",
            state: "已发布",
            cate_name: "最新",
          });
        }
        result.total = 100;

        var html = template("tbody-template", result);
        $("#tbody").html(html);
        renderPager(params, result.total);
      } else {
        layui.layer.msg(result.message);
      }
    },
  });
}

function renderPager(params, total) {
  layui.use("laypage", function () {
    var laypage = layui.laypage;

    //执行一个laypage实例
    laypage.render({
      elem: "pager",
      count: total, //数据总数，从服务端得到
      limit: params.pagesize,
      limits: [2, 3, 5, 10],
      curr: params.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      jump: function (obj, first) {
        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        console.log(obj.limit); //得到每页显示的条数

        //首次不执行
        if (!first) {
          params.pagenum = obj.curr;
          params.pagesize = obj.limit;
          getArticleList(params);
        }
      },
    });
  });
}

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
