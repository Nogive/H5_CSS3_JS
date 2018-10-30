var _html = document.getElementsByTagName("html")[0];
var ch = document.documentElement.clientWidth;
ch > 640
  ? (_html.style.fontSize = "40px")
  : (_html.style.fontSize = ch / 16 + "px");
