// junfeipage/working/choosedevicename/choosedevicename.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
Page({
  data:{
      wxSearchData: []
  },
  onLoad:function(options){
     console.log("projectItemId", options.projectItemId)    
      var that = this;
    var getschoolequipmentlistdata={
      key:"",
      projectItemId:options.projectItemId,
      isNeedCode:1,
      sessionId:wx.getStorageSync('sessionid')
    }
      requiredata.getschoolequipmentlist(requireUrl.getschoolequipmentlistUrl,getschoolequipmentlistdata,function(res){
           console.log("二维码中设备名称成功",res.data)
            that.setData({
          wxSearchData: JSON.parse(res.data.data.rows)
        });
      },function(res){
        console.log("失败")
      })
  },
   prnumtap: function (event) {
    var that = this;
    wx.setStorageSync('projectcontaractlistid', event.currentTarget.dataset.projectcontaractlistid);
    wx.setStorageSync('barcodedicname', event.currentTarget.dataset.name);
    wx.navigateBack({
      delta: 1 // 回退前 delta(默认为1) 页面

    })

  }
})