// junfeipage/working/confirm/confirm.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
let app = getApp();
function confirmData(isRefresh, that) {
  isRefresh = isRefresh || false;
  var confirmdata = {
    start: that.data.start,
    pageLength: 10,
    sessionId: wx.getStorageSync('sessionid'),
    key: "",
  }
  requiredata.confirmList(requireUrl.confirmUrl, confirmdata, function (res) {
    console.log("借用确认", res.data)
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

        if (that.data.start == 0) {
          that.setData({
            confirmdataList: rows,
            total: res.data.data.total
          })
        }
        else {
          that.setData({
            confirmdataList: that.data.confirmdataList.concat(rows),
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
    confirmdataList: [],
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
    confirmData(false, that);
  },
  onPullDownRefresh: function () {
    //下拉刷新
    var that = this;
    that.setData({
      start: 0,
      hidden: true,
      hasMore: true
    })
    confirmData(true, that);
  },
  onReachBottom: function () {
    //上拉加载
    var that = this;
    that.setData({
      hidden: false,
      start: that.data.start
    })
    console.log(that.data.start, that.data.confirmdataList.length)
    if (that.data.total == that.data.confirmdataList.length) {
      that.setData({
        hasMore: false
      })
      return;
    } else {
      //加载数据
      confirmData(false, that);

    }
  },
  confirmdetail: function (e) {
    wx.navigateTo({
      url: 'confirmdetail/confirmdetail?id=' + e.currentTarget.dataset.id

    })
  }


})