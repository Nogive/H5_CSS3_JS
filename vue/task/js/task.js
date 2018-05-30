var list = [
  {
    title: "完成xxx",
    finished: false
  },
  {
    title: "吃饭睡觉打豆豆",
    finished: true
  },
  {
    title: "学习xxx",
    finished: false
  }
];
new Vue({
  data() {
    return {
      list: list,
      title: ""
    };
  },
  computed: {
    total: function() {
      let i = 0;
      this.list.forEach(e => {
        if (!e.finished) {
          i++;
        }
      });
      return i;
    }
  },
  methods: {
    add() {
      if (this.title != "") {
        list.push({
          title: this.title,
          finished: false
        });
      }
      this.title = "";
    },
    remove(item) {
      let idx = this.list.indexOf(item);
      this.list.splice(idx, 1);
    }
  }
}).$mount("#app");
