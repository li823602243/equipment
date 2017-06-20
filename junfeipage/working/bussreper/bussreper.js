// junfeipage/working/bussreper/bussreper.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
Page({
  data:{
    list:''
  },
  onLoad:function(options){
    var that = this;
    var param = {
      sessionid:wx.getStorageSync('sessionid')
    }
     requiredata.getAddress(requireUrl.bussrepUrl,param,function (res) {       
          console.log(res)
          that.setData({
              list:JSON.parse(res.data.data.rows)
          })
      }, function (res) {
        console.log("失败", res);
      })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  chooserepper:function(e){
     wx.setStorageSync('repername', e.currentTarget.dataset.repname);
      wx.setStorageSync('repid', e.currentTarget.dataset.id);
      wx.setStorageSync('reptel', e.currentTarget.dataset.tel)
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
      }) 
  }
})