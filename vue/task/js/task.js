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
Vue.directive("focus", {
  update: function(el, binding) {
    if (binding.value) {
      el.focus();
    }
  }
});
new Vue({
  data() {
    return {
      list: list,
      title: "",
      editItem: "",
      oldTitle: "",
      oldList: list,
      currentTab: "all"
    };
  },
  computed: {
    total: function() {
      return this.list.filter(function(item) {
        return !item.finished;
      }).length;
    }
  },
  methods: {
    add() {
      if (this.title != "") {
        this.list.push({
          title: this.title,
          finished: false
        });
      }
      this.title = "";
      oldList = this.list;
    },
    remove(item) {
      let idx = this.list.indexOf(item);
      this.list.splice(idx, 1);
      oldList = this.list;
    },
    preEdit(item) {
      this.editItem = item;
      this.oldTitle = item.title;
    },
    editTask(item) {
      this.editItem = "";
    },
    cancleEdit(item) {
      item.title = this.oldTitle;
      this.editItem = "";
    },
    allList() {
      this.list = this.oldList;
      this.currentTab = "all";
    },
    notFinished() {
      this.list = this.oldList.filter(function(item) {
        return !item.finished;
      });
      this.currentTab = "notFinished";
    },
    finished() {
      this.list = this.oldList.filter(function(item) {
        return item.finished;
      });
      this.currentTab = "finished";
    }
  }
}).$mount("#app");
