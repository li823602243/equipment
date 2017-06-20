// junfeipage/working/proacceptance/proacceptance.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const timeout = require('../../../utils/util.js').timeout;
let app = getApp();
function getaccept(isRefresh, that) {
  isRefresh = isRefresh || false;
  var proacceptdata = {
    Statuz: "3",
    start: that.data.start,
    pageLength: 10,
    sessionId: wx.getStorageSync('sessionid'),
    key: "",
  }
  requiredata.getschoolprojectlist(requireUrl.getschoolprojectlistUrl, proacceptdata, function (res) {
    if (res.data.flag == "1") {
      console.log("验收", res.data)
      var rows = JSON.parse(res.data.data.rows);
      if (rows.length == 0) {
        that.setData({
          hasnodata: true
        })
      } else {
        that.setData({
          hasnodata: false
        })
     
      if (that.data.start == 0) {
        that.setData({
          proacceptlist: rows,
          total: res.data.data.total
        })
      }
      else {
        that.setData({
          proacceptlist: that.data.proacceptlist.concat(rows),
          total: res.data.data.total
        })
      }

      that.setData({
        start: that.data.start + 10
      })
      if (isRefresh) {
        wx.stopPullDownRefresh()
      }
       }
    } else if (res.data.flag == "-1") {
      timeout(that, "../../login/index")
    }
  }, function (res) {

  })
}
Page({
  data: {
    proacceptlist: [],
    start: 0,
    total: "",
    hasMore: true,
    hasnodata: false,
    hidden: true,
    ishidden: false
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast()
    getaccept(false, that);

  },
  onPullDownRefresh: function () {
    //下拉刷新
    var that = this;
    that.setData({
      start: 0,
      hidden: true,
      hasMore: true
    })
    getaccept(true, that);
  },
  onReachBottom: function () {
    //上拉加载
    var that = this;
    that.setData({
      hidden: false,
      start: that.data.start,
      hasMore: true
    })
    console.log(that.data.start, that.data.proacceptlist.length)
    if (that.data.total == that.data.proacceptlist.length) {
      that.setData({
        hasMore: false
      })
      return;
    } else {
      //加载数据
      getaccept(false, that);

    }
  },
  proaccepttap: function (event) {
    var pritemid = event.currentTarget.dataset.pritemid;
    var projectid=event.currentTarget.dataset.projectid
    console.log(pritemid);
    wx.navigateTo({
      url: 'proacceptancedetail/proacceptancedetail?pritemid=' + pritemid+'&projectid='+projectid
    })
  }
})