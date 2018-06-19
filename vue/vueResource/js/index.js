new Vue({
  data: {
    myData: [],
    t1: "",
    now: -1
  },
  methods: {
    get: function(ev) {
      if (ev.keyCode == 38 || ev.keyCode == 40) return;

      if (ev.keyCode == 13) {
        window.open("https://www.baidu.com/s?wd=" + this.t1);
        this.t1 = "";
      }

      this.$http
        .jsonp(
          "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su",
          {
            wd: this.t1
          },
          {
            jsonp: "cb"
          }
        )
        .then(
          function(res) {
            this.myData = res.data.s;
          },
          function() {}
        );
    },
    changeDown: function() {
      this.now++;
      if (this.now == this.myData.length) this.now = -1;
      this.t1 = this.myData[this.now];
    },
    changeUp: function() {
      this.now--;
      if (this.now == -2) this.now = this.myData.length - 1;
      this.t1 = this.myData[this.now];
    }
  }
}).$mount("#app");
