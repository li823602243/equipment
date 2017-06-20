// junfeipage/working/Equipinfo/Equipinfo.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const tips = require('../../../utils/util.js').tips;
let app = getApp();
Page({
  data: {
    list: '',
    show: [true, false, false, false],
    project: '',
    roleid:false,
    Assetcode:'',
    unitid:''
  },
  onLoad: function (options) {
    console.log(wx.getStorageSync('unittype'));
    console.log(wx.getStorageSync('RoleIds'));
    var that = this;
    that.setData({
       Assetcode:options.param,
       unitid:wx.getStorageSync('unittype')
    })
    var roleids=wx.getStorageSync('RoleIds');
    if(roleids.indexOf(36)!=-1){
       console.log('资产管理员')
       that.setData({
          roleid:true
       })
    }else{
      console.log('普通人')
      that.setData({
          roleid:false
       })
    }
    

    new app.WeToast();
    var getsnoinfodata = {
      sno: options.param,
      sessionId: wx.getStorageSync('sessionid')
    }
    requiredata.getsnoinfo(requireUrl.getsnoinfoUrl, getsnoinfodata, function (res) {
      console.log(res);
      if (res.data.flag == -1) {
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
      } else if (res.data.flag == 1) {
        if (res.data.msg == '-') {
          that.wetoast.toast({
            title: '该编码暂未绑定',
            duration: 1000,
          });
        }else{
           that.setData({
             list:JSON.parse(res.data.data.footer)
           })
        }
      }
    }, function (res) {

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
  toggle: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    that.data.show[idx] = !that.data.show[idx];
    that.setData({
      show: that.data.show
    })
  },
  repairbyschool:function(){
     var param = this.data.Assetcode;
     wx.redirectTo({
       url: '../schoolrepair/schoolrepair?Assetcode='+param
     })
  },
  repairbybuss:function(){
     var param = this.data.Assetcode;
     wx.redirectTo({
       url: '../enterpriserepair/enterpriserepair?Assetcode='+param
     })
  }
})