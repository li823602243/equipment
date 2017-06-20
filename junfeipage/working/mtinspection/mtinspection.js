// junfeipage/working/mtinspection/mtinspection.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const getStatuz = require('../../../utils/util.js').getStatuz;
let app = getApp();
function inspectionData(isRefresh, that) {
  isRefresh = isRefresh || false;
  var param = {
    start: that.data.start,
    pageLength: 10,
    sessionId: wx.getStorageSync('sessionid'),
    key: '',
    statuz: 60,
    callType:2
  }
  requiredata.getinspactionlist(requireUrl.repairviewUrl, param, function (res) {
    console.log("11", res.data)
    if (res.data.flag == "-1") {
      that.wetoast.toast({
        title: '登录超时',
        duration: 1000,
        success(data) {
          wx.redirectTo({
            url: '../../startup/index'
          })
        }
      });
    } else if (res.data.flag == 1) {
      var rows = JSON.parse(res.data.data.rows);
      for(var i =0;i<rows.length;i++){
        rows[i].Statuz = getStatuz(rows[i].Statuz,rows[i].CompanyName);
      }
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
          list: rows,
          total: res.data.data.total
        })
      }
      else {
        console.log('加载' + res.data)
        that.setData({
          list: that.data.list.concat(rows),
          total: res.data.data.total
        })
      }

      that.setData({
        start: that.data.start + 10
      })
      if (isRefresh) {
        wx.stopPullDownRefresh()
      }
    }else if(res.data.flag==0){
      that.wetoast.toast({
        title: res.data.msg,
        duration: 1000,
      });
    }
  }, function (res) {

  })
}

Page({
  data: {
    list: [],
    nodata: false,
    start: 0,
    total: "",
    hasMore: true,
    hasnodata: false,
    hidden: true,
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    inspectionData(false, that);
  },
  gotoDetail: function (e) {
    var param = e.currentTarget.dataset.id;
    var statuz = e.currentTarget.dataset.statuz
    wx.navigateTo({
      url: 'mtinspectionDetail/mtinspectionDetail?param=' + param + '&statuz=' + statuz,
    })
  },
  onPullDownRefresh: function () {
    //下拉刷新
    var that = this;
    that.setData({
      start: 0,
      hidden: true,
      hasMore: true
    })
    inspectionData(false, that);
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    //上拉加载
    var that = this;
    that.setData({
      hidden: false,
      start: that.data.start
    })
    console.log(that.data.start, that.data.list.length)
    if (that.data.total == that.data.list.length) {
      that.setData({
        hasMore: false
      })
      return;
    } else {
      //加载数据
      inspectionData(false, that);

    }
  },
})
