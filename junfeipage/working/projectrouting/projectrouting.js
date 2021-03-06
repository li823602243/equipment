// junfeipage/working/projectrouting/projectrouting.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const timeout = require('../../../utils/util.js').timeout;
let app = getApp();
function proRout(isRefresh, that) {
  isRefresh = isRefresh || false;
  var getproroutdata = {
    start: that.data.start,
    pageLength: 10,
    sessionId: wx.getStorageSync('sessionid'),
    key: "",
  }
  requiredata.getinspectionlist(requireUrl.getinspectionlistUrl, getproroutdata, function (res) {
    if (res.data.flag == "1") {
      console.log("巡检总列表", res.data)
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
            proroutList: rows,
            total: res.data.data.total
          })
        }
        else {
          that.setData({
            proroutList: that.data.proroutList.concat(rows),
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
    proroutList: [],
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
    proRout(false, that);

  },
  onPullDownRefresh: function () {
    //下拉刷新
    var that = this;
    that.setData({
      start: 0,
      hidden: true,
      hasMore: true
    })
    proRout(true, that);
  },
  onReachBottom: function () {
    //上拉加载
    var that = this;
    that.setData({
      hidden: false,
      start: that.data.start,
      hasMore: true
    })
    console.log(that.data.start, that.data.proroutList.length)
    if (that.data.total == that.data.proroutList.length) {
      that.setData({
        hasMore: false
      })
      return;
    } else {
      //加载数据
      proRout(false, that);

    }
  },
  fillrecord: function (e) {
    var routdetailid = e.currentTarget.dataset.routdetailid;
    var proitemid = e.currentTarget.dataset.proitemid;
    var schoolid = e.currentTarget.dataset.schoolid;
    var companyid = e.currentTarget.dataset.companyid;
    var projectid = e.currentTarget.dataset.projectid;
    wx.navigateTo({
      url: 'fillrecord/fillrecord?routdetailid=' + routdetailid + '&proitemid=' + proitemid + '&schoolid=' + schoolid + '&companyid=' + companyid + '&projectid=' + projectid
    })
  },
  proroutlisttap: function (e) {
    wx.navigateTo({
      url: 'proroutlist/proroutlist?projectcode=' + e.currentTarget.dataset.projectcode
    })
  }
})