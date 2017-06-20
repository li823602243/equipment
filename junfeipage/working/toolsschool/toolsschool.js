// junfeipage/working/toolsschool/toolsschool.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
let app = getApp();
function toolsSchoolData(isRefresh, that) {
  isRefresh = isRefresh || false;
  var toolsschooldata = {
    key: that.data.inputVal,
    sessionId: wx.getStorageSync('sessionid'),
    pageLength: 10,
    start: 0
  }
  //调用学校查询接口
  requiredata.toolsschool(requireUrl.toolsschoolUrl, toolsschooldata, function (res) {
    console.log("学校查询", toolsschooldata, res.data)
    if (res.data.flag == "-1") {
      that.wetoast.toast({
        title: '登录超时',
        duration: 1000,
        success(data) {
          wx.redirectTo({
            url: '../../login/index'
          })
        }
      });
    } else if (res.data.flag == "1") {
      var rows = JSON.parse(res.data.data.rows);
      if (rows.length == 0) {
        that.setData({
          hasnodata: true
        })
      } else {
        that.setData({
          hasnodata: false
        })
      }
      if (that.data.start == 0) {
        that.setData({
          wxSearchData: rows,
          total: res.data.data.total
        })
      }
      else {
        that.setData({
          wxSearchData: that.data.wxSearchData.concat(rows),
          total: res.data.data.total
        })
      }

      that.setData({
        start: that.data.start + 10
      })
      if (isRefresh) {
        wx.stopPullDownRefresh()
      }
    } else {
      that.wetoast.toast({
        title: res.data.msg,
        duration: 1000
      });

    }
  }, function (res) {

  })
}
Page({
  data: {
    start: 0,
    total: "",
    hasMore: true,
    hasnodata: false,
    hidden: true,
    ishidden: false,
    inputShowed: false,
    inputVal: "",
    wxSearchData: [],

  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
  },
  onPullDownRefresh: function () {
    //下拉刷新
    var that = this;
    that.setData({
      start: 0,
      hidden: true,
      hasMore: true
    })
    toolsSchoolData(true, that);
  },
  onReachBottom: function () {
    //上拉加载
    var that = this;
    that.setData({
      hidden: false,
      start: that.data.start
    })
    console.log(that.data.start, that.data.wxSearchData.length)
    if (that.data.total == that.data.wxSearchData.length) {
      that.setData({
        hasMore: false
      })
      return;
    } else {
      //加载数据
      toolsSchoolData(false, that);

    }
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  searchconfirm: function (e) {
    var that = this;
    that.setData({
      start: 0
    })
    that.setData({
      inputVal: e.detail.value
    });
    toolsSchoolData(false, that);

  }

})