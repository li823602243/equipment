// junfeipage/working/mtresponse/mtresponse.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const getStatuz = require('../../../utils/util.js').getStatuz;

let app = getApp();
var Getlist = function (that, url, param, method) {
  wx.request({
    url: url,
    data: param,
    method: method,
    success: function (res) {
      console.log(res);
      if (res) {
        that.setData({
          loading: false
        })
        if (res.data.flag == 1) {
          if (that.data.Start == 0) {
            that.setData({
              list: JSON.parse(res.data.data.rows),
              total: res.data.data.total
            })
          } else {
            that.setData({
              list: that.data.list.concat(JSON.parse(res.data.data.rows)),
              total: res.data.data.total
            })
          }
        } else if (res.data.flag == -1) {
          that.wetoast.toast({
            title: '登录超时',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: '../../login/index',
              })
            }
          });
        } else if (res.data.flag == 0) {
          that.wetoast.toast({
            title: res.data.msg,
            duration: 1000,
          });
        }
      } else {
        that.setData({
          loading: true
        })
      }
      if (that.data.list.length == 0) {
        that.setData({
          nodata: true
        })
      } else {
        that.setData({
          nodata: false
        })
      }
      that.setData({
        Start: that.data.Start + 10
      })
    },
    fail: function (res) {
      console.log('请求失败')
    }
  })
}

Page({
  data: {
    list: '',
    statuz: '',
    unitid: '',
    hidden: true,
    hasMore: true,
    total: '',
    PageLength: 10,
    Start: 0,
    nodata: false,
    loading: true
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    that.setData({
      unitid: wx.getStorageSync('unittype')
    })
    // 学校维修响应
    if (that.data.unitid == 3) {
      var param = {
        Start: that.data.Start,
        PageLength: that.data.PageLength,
        key: '',
        SessionId: wx.getStorageSync('sessionid')
      }
      Getlist(that, requireUrl.mtresUrl, param, 'POST');
    } else if (that.data.unitid == 4) {
      //企业维修响应
      var param2 = {
        start: that.data.Start,
        pageLength: that.data.PageLength,
        sessionId: wx.getStorageSync('sessionid'),
        key: '',
        statuz: 40
      }
      Getlist(that, requireUrl.bussreslistUrl, param2, 'GET')
    }



  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  gotoDetail: function (event) {
    var param = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'mtresDetail/mtresDetail?param=' + param,
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    console.log(that.data.Start)
    that.setData({
      Start: 0,
      hidden: true,
      hasMore: true
    })
    if (that.data.unitid == 3) {
      var param = {
        Start: 0,
        PageLength: that.data.PageLength,
        key: '',
        SessionId: wx.getStorageSync('sessionid')
      }
      Getlist(that, requireUrl.mtresUrl, param, 'POST');
    } else if (that.data.unitid == 4) {
      //企业维修响应
      var param2 = {
        start: 0,
        pageLength: that.data.PageLength,
        sessionId: wx.getStorageSync('sessionid'),
        key: '',
        statuz: 40
      }
      Getlist(that, requireUrl.bussreslistUrl, param2, 'GET')
    }
    wx.stopPullDownRefresh();
  },
  //上拉加载更多
  onReachBottom: function () {
    //上拉加载   
    var that = this;
    that.setData({
      Start: that.data.Start,
      hidden: false
    })
    console.log(that.data.Start)
    if (that.data.unitid == 3) {
      var param = {
        Start: that.data.Start,
        PageLength: that.data.PageLength,
        key: '',
        SessionId: wx.getStorageSync('sessionid')
      }
      if (that.data.list.length >= that.data.total) {
        that.setData({
          hasMore: false,
        })
      } else {
        setTimeout(function () {
          Getlist(that, requireUrl.mtresUrl, param, 'POST');
        }, 2000)
      }
    } else if (that.data.unitid == 4) {
      //企业维修响应
      var param2 = {
        start: that.data.Start,
        pageLength: that.data.PageLength,
        sessionId: wx.getStorageSync('sessionid'),
        key: '',
        statuz: 40
      }
      Getlist(that, requireUrl.bussreslistUrl, param2, 'GET')
    }
  },
})