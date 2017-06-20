// junfeipage/working/equiptree/equiptree.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
let app = getApp();
Page({
  data: {
    list: '',
    equiplist:''
  },
  onLoad: function (options) {
    new app.WeToast();
    var that = this;
    var getEquipTreedata = wx.getStorageSync('sessionid');
    console.log(getEquipTreedata);
    requiredata.getEquipTree(requireUrl.getEquipTreeUrl, getEquipTreedata, function (res) {
      if (res.data.flag == 1) {
        console.log(res.data.data.rows)
        that.setData({
          list: JSON.parse(res.data.data.rows)
        })
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

    }, function (res) {
      console.log("失败", res);
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
  chooseChildren:function(e){
     console.log(e);
     var idex = e.currentTarget.dataset.idx;
     console.log(this.data.list[idex].Children)
     this.setData({
        equiplist:this.data.list[idex].Children
     })
  },
  chooseEquip: function (e) {
    console.log(e);
    var equip = e.currentTarget.dataset.equip;
    console.log(equip);
    wx.setStorageSync('equip', equip);
    wx.setStorageSync('pid',e.currentTarget.dataset.pid);
    wx.setStorageSync('equipId', e.currentTarget.dataset.equid)
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面       
    })
  }
})