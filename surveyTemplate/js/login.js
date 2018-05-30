$(function() {
  var pubKey =
    "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIGetsuNPeHHbKWutJYmpz2aB6F/3uqq/5HhzuI8Sicz32g9ZkpgelcWJeFNBocfEYzpLgp0fHDz+/PStp23ClUCAwEAAQ==";
  $("#goLogin").click(function() {
    signIn(pubKey);
  });
  //回车事件
  document.onkeydown = function(e) {
    var ev = document.all ? window.event : e;
    if (ev.keyCode == 13) {
      signIn(pubKey);
    }
  };
});
function signIn(pubKey) {
  opts.showLoading();
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(pubKey);
  var encrypted = encrypt.encrypt($("#passw").val());
  var validate = $("#loginBox").validate({
    messages: {
      userName: "*请输入正确的账号。",
      password: "*请输入正确的登录密码。"
    },
    errorPlacement: function(error, element) {
      element.before(error);
    },
    debug: true
  });
  if (validate.form()) {
    $.ajax({
      url: $g.API_URL.AUTHENTICATION.compose(host),
      type: "POST",
      contentType: "application/x-www-form-urlencoded",
      dataType: "json",
      data: {
        account: $("#user").val(),
        password: encrypted
      },
      success: function(data) {
        if (data.code == 0) {
          $.cookie("token", data.data.token, { expires: 7, path: "/" });
          storage.setStorage("user", JSON.stringify(data.data));
          opts.hideLoading();
          window.location.href = "index";
        } else {
          codeError(data, "登录失败");
        }
      }
    });
  }
}
