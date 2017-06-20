// junfeipage/working/mtresponse/mtresponse.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
const tips = require('../../../../utils/util.js').tips;
let app = getApp();
Page({
  data: {
    list: '',
    show: [true, true],
    id: '',
    array: ['是', '否'],
    zhibao: '',
    appres: '',
    repairer: [],
    ruid:'',
    ruIds:[]
  },
  onLoad: function (options) {
    wx.removeStorageSync('repid')
    wx.removeStorageSync('repername')
    var that = this;
    new app.WeToast();
    that.setData({
      id: options.param,
    })
    var param = {
      Id: that.data.id,
      t: 6,
      sessionId: wx.getStorageSync('sessionid')
    }
    console.log(param);
    wx.request({
      url: requireUrl.mtresdtUrl,
      data: param,
      method: 'GET',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res)
        if (res.data.flag == 1) {
          that.setData({
            list: JSON.parse(res.data.data.rows),
            zhibao: that.data.array[JSON.parse(res.data.data.rows).IsWarranty]
          })
        } else if (res.data.flag == -1) {
          that.wetoast.toast({
            title: '登录超时',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: '../../../login/index',
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
    //获取本单位维修人
    var param2 = {
      sessionid: wx.getStorageSync('sessionid')
    }
    requiredata.getAddress(requireUrl.bussrepUrl, param2, function (res) {
      console.log(res)
      var maplist = JSON.parse(res.data.data.rows);
      for(var i=0;i<maplist.length;i++){
          that.data.repairer.push(maplist[i].Name),
          that.data.ruIds.push(maplist[i].Id)
      } 
      that.setData({
        repairer: that.data.repairer,
        ruIds:that.data.ruIds
      })
    }, function (res) {
      console.log("失败", res);
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
   
  },
  toggle: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    that.data.show[idx] = !that.data.show[idx];
    that.setData({
      show: that.data.show
    })
  },
  listenerPickerSelected:function(e){
     this.setData({
      ruid: this.data.ruIds[e.detail.value],
      appres: this.data.repairer[e.detail.value],
    });
  },
  submit: function (e) {
    console.log(e);
    var that = this;
    var param = {
      FormId: e.detail.formId,
      rnId: that.data.id,
      ruId: that.data.ruid,
      sessionId: wx.getStorageSync('sessionid')
    }
    if (that.data.appres == '') {
      that.wetoast.toast({
        title: '请选择维修人',
        duration: 1000,
      });
    } else {
      wx.request({
        url: requireUrl.bussdispatchUrl,
        data: param,
        method: 'GET',
        header: {
          'content-type': 'application/json',
        },
        success: function (res) {
          if (res.data.flag == 1) {
            tips(that, '派工成功', 1000, '../../index')
          } else if (res.data.flag == -1) {
            that.wetoast.toast({
              title: '登录超时',
              duration: 1000,
              success: function () {
                wx.redirectTo({
                  url: '../../../login/index',
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
  }
})