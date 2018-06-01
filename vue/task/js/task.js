/*var list = [
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
];*/

const storage = {
  setLocal: function(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  getLocal: function(key) {
    let value = window.localStorage.getItem(key);
    return JSON.parse(value);
  },
  setSession: function(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  },
  getSession: function(key) {
    let value = window.localStorage.getItem(key);
    return JSON.parse(value);
  },
  clearOneLocal: function(key) {
    window.localStorage.removeItem(key);
  },
  clearOneSession: function(key) {
    window.sessionStorage.removeItem(key);
  },
  clearAllLocal: function() {
    window.localStorage.clear();
  },
  clearAllSession: function() {
    window.sessionStorage.clear();
  }
};

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
      list: storage.getLocal("list") || [],
      title: "",
      editItem: "",
      oldTitle: "",
      oldList: storage.getLocal("list") || [],
      currentTab: "all"
    };
  },
  watch: {
    list: {
      handler: function() {
        storage.setLocal("list", this.list);
      },
      deep: true
    }
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
    },
    remove(item) {
      let idx = this.list.indexOf(item);
      this.list.splice(idx, 1);
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
