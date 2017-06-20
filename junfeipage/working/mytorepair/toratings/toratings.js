// junfeipage/working/mytorepair/toratings/toratings.js
const requireUrl = require('../../../../config.js');
const tips = require('../../../../utils/util.js').tips;
let app = getApp();
Page({
  data: {
    startlist: [0, 1, 2, 3, 4],
    startsrc: "../../../../images/start.png",
    startselectedsrc: "../../../../images/startselected.png",
    key1: 0,
    key2: 0,
    key3: 0,
    key4: 0,
    id: '',
    memo: ''
  },
  onLoad: function (options) {
    new app.WeToast();
    this.setData({
      id: options.param
    })
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
  startlist1: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key1: key

    })
  },
  startlist2: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key2: key

    })
  },
  startlist3: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key3: key

    })
  },
  startlist4: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key4: key

    })
  },
  getMemo: function (e) {
    var that = this;
    that.setData({
      memo: e.detail.value
    })
  },
  submit: function () {
    var that = this;
    var param = {
      evaluation: {
        RepairNeedId: that.data.id,
        Overall: that.data.key1,
        Attitude: that.data.key2,
        Ability: that.data.key3,
        Speed: that.data.key4,
        Memo: that.data.memo
      },
      sessionid: wx.getStorageSync('sessionid')
    }
    wx.request({
      url: requireUrl.schoolratingsUrl,
      data: param,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res);
        if (res.data.flag == 1) {
          tips(that, '评价成功', 1000, '../../index');
        } else if (res.data.flag == -1) {
          that.wetoast.toast({
            title: '登录超时',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: '../../../startup/index',
              })
            }
          });
        } else if (res.data.flag == 0) {
          that.wetoast.toast({
            title: res.data.msg,
            duration: 1000,
          });
        }
      },
      fail: function () {
        console.log('请求失败')
      }
    })
  }
})