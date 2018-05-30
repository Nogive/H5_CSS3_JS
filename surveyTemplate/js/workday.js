"use strict";
$(document).ready(function() {
  let file;
  $("#inputfile").change(function() {
    file = this.files[0];
    $(".fileTip")
      .hide()
      .removeClass("required");
  });
  $("#upload").click(function() {
    if (file == undefined) {
      $(".fileTip")
        .addClass("required")
        .show();
    } else {
      console.log(file);
      opts.showLoading();
      var formData = new FormData();
      formData.append("file", file);
      $.ajax({
        url: $g.API_URL.SETTING_WORKDAY_UPLOAD.compose(host),
        type: "POST",
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        success: function(data) {
          if (data.code == $g.API_CODE.OK) {
            file = undefined;
            $("#inputfile").val("");
            opts.hideLoading();
            showNotify("success", "成功啦", "上传文件成功");
          } else {
            codeError(data, "上传出错了");
          }
        },
        error: function(xhr) {
          failResponse(xhr, "上传失败");
        }
      });
    }
  });
});
