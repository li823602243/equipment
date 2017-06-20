// junfeipage/working/schoolrepair/schoolrepair.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const tips = require('../../../utils/util.js').tips;

//获取设备品牌
function getBrands(that) {
  var param = {
    DeviceCodeId: that.data.DeviceCodeId,
    sessionid: wx.getStorageSync('sessionid')
  }
  requiredata.getmtBrand(requireUrl.getmtBrandUrl, param, function (res) {
    console.log(res);
    var models = JSON.parse(res.data.data.rows);
    for (var i = 0; i < models.length; i++) {
      that.data.Models.push(models[i].Name)
    }
    that.setData({
      Models: that.data.Models
    })
    console.log(that.data.Models);
  }, function (res) {

  })
}


//获取二维码信息
function getonesweepData(sno, that) {
  var getsnoinfodata = {
    sno: sno,
    sessionId: wx.getStorageSync('sessionid')
  }
  requiredata.getsnoinfo(requireUrl.getsnoinfoUrl, getsnoinfodata, function (res) {
    if (res.data.flag == 1) {
      wx.removeStorageSync('equip');
      wx.removeStorageSync('equipId');
      wx.removeStorageSync('addrName');
      wx.removeStorageSync('addrId');
      wx.removeStorageSync('otheraddress');
      if (res.data.msg == '-') {
        that.wetoast.toast({
          title: '该编码暂未绑定',
          duration: 1000,
        });
        that.setData({
          DeviceCodeName: '',
          DeviceCodeId: '',
          Address: '',
          AddressId: '',
          Brand: '',
          model: '',
          Models: []
        })
      } else {
        var rows = JSON.parse(res.data.data.rows)
        if (rows.SchoolId == wx.getStorageSync('Unitid')) {
          that.setData({
            DeviceCodeName: rows.Name,
            DeviceCodeId: rows.RepairDeviceId,
            Address: rows.Address,
            AddressId: rows.AdressId,
            Brand: rows.Brand,
            model: rows.Model,
            Models: []
          })
          getBrands(that)
        } else {
          that.wetoast.toast({
            title: '未找到数据',
            duration: 1000,
          });
          that.setData({
            DeviceCodeName: '',
            DeviceCodeId: '',
            Address: '',
            AddressId: '',
            Brand: '',
            model: '',
            Models: []
          })

        }
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
      that.setData({
        DeviceCodeName: '',
        DeviceCodeId: '',
        Address: '',
        AddressId: '',
        Brand: '',
        model: ''
      })
    }
  }, function (res) {

  })
}


let app = getApp();
Page({
  data: {
    Id: '',
    AssetCode: '',
    DeviceCodeId: '',
    DeviceCodeName: '',
    OtherDeviceName: '',
    Address: '',
    AddressId: '',
    OtherAddressName: '',
    Brand: '',//品牌
    model: '',//型号
    RawUserId: 0,
    Fault: '',//故障描述
    hasOther: false,
    Models: ['请先选择设备'],
    role: 0  //修改还是直接报修
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    wx.removeStorageSync('equip');
    wx.removeStorageSync('equipId');
    wx.removeStorageSync('addrName');
    wx.removeStorageSync('addrId');
    wx.removeStorageSync('otheraddress');
    //扫码进来报修
    if (options.Assetcode) {
      that.setData({
        AssetCode: options.Assetcode
      })
      getonesweepData(options.Assetcode, that);
    }

    if (options.role) {
      console.log('修改')
      that.setData({
        Id: options.param,
        role: 1
      })
      var param = {
        id: that.data.Id,
        t: 3,
        sessionid: wx.getStorageSync('sessionid')
      }
      requiredata.getresDetail(requireUrl.mtresdtUrl, param, function (res) {
        console.log(res);
        if (res.data.flag == 1) {
          var maplist = JSON.parse(res.data.data.rows);
          that.setData({
            Id: maplist.Id,
            DeviceCodeName: maplist.DeviceCodeName,
            DeviceCodeId: maplist.DeviceCodeId,
            Address: maplist.FullAddress,
            AddressId: maplist.AddressId,
            Fault: maplist.Fault,
            Brand: maplist.Brand,
            model: maplist.Model,
            pid: maplist.DeviceCodeId2,
            Models: []
          })
          getBrands(that);
        }
        console.log(that.data.index + ',,,' + that.data.pid);
      }, function () {

      })
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    var that = this;
    if (wx.getStorageSync('equipId')) {
      that.setData({
        DeviceCodeName: wx.getStorageSync('equip'),
        DeviceCodeId: wx.getStorageSync('equipId'),
        pid: wx.getStorageSync('pid'),
      })
    }
    if (wx.getStorageSync('addrId')) {
      that.setData({
        Address: wx.getStorageSync('addrName'),
        AddressId: wx.getStorageSync('addrId')
      })
    }
    //获取设备品牌

    if (that.data.DeviceCodeName != '') {
      console.log(1111);
      that.setData({
        Models: []
      })
      getBrands(that)
    }
    //获取其他地址
    if (wx.getStorageSync('otheraddress')) {
      that.setData({
        Address: '其他',
        AddressId: -1,
        hasOther: true
      })
    } else {
      that.setData({
        hasOther: false
      })
    }
  },
  getOtherAddress: function (e) {
    this.setData({
      OtherAddressName: e.detail.value
    })
  },
  onHide: function () {
    // 页面隐藏
    wx.removeStorageSync('addrName');
    wx.removeStorageSync('addrId');
    wx.removeStorageSync('otheraddress');
  },
  onUnload: function () {
    // 页面关闭
  },
  getCode: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log("二维码信息", res.result)
        var scancodename = res.result.substr(-8);
        scancodename = scancodename.replace('/', '');
        console.log(scancodename);
        that.setData({
          AssetCode: scancodename
        })
        console.log("444", that.data.AssetCode)
        getonesweepData(that.data.AssetCode, that)
      }
    })

  },
  gotoEquipTree: function () {
    var that = this;
    if (that.data.role == 0) {
      wx.navigateTo({
        url: '../equiptree/equiptree',
      })
    }
  },
  gotoAddress: function () {
    var that = this;
    if (that.data.role == 0) {
      wx.navigateTo({
        url: '../address/address',
      })
    }
  },
  getOtheraddress: function (e) {
    var that = this;
    that.setData({
      OtherAddressName: e.detail.value
    })
  },
  getAssetcode: function (e) {
    var that = this;
    that.setData({
      AssetCode: e.detail.value
    })
    getonesweepData(e.detail.value, that);
  },
  getFault: function (e) {
    var that = this;
    that.setData({
      Fault: e.detail.value
    })
  },
  getBrand: function (e) {
    var that = this;
    that.setData({
      Brand: e.detail.value
    })
  },
  BrandChange: function (e) {
    this.setData({
      Brand: this.data.Models[e.detail.value],
    });
  },
  getModel: function (e) {
    var that = this;
    that.setData({
      model: e.detail.value
    })
  },
  submit: function (e) {
    console.log(e);
    var that = this;
    if (that.data.role == 0) {
      console.log('直接报修')
      var param = {
        repairNeedEquipmentIn: {
          FormId: e.detail.formId,
          AssetCode: that.data.AssetCode,
          DeviceCodeId: that.data.DeviceCodeId,
          DeviceCodeName: that.data.DeviceCodeName,
          OtherDeviceName: that.data.OtherDeviceName,
          Address: that.data.Address,
          OtherAddressName: that.data.OtherAddressName,
          Fault: that.data.Fault,
          Model: that.data.model,
          RawUserId: that.data.RawUserId,
          AddressId: that.data.AddressId,
          Brand: that.data.Brand
        },
        SessionId: wx.getStorageSync('sessionid')
      }
      console.log(param);
      if (that.data.DeviceCodeName == '' || (that.data.Address == '' && that.data.OtherAddressName == '') || that.data.Fault == '') {
        that.wetoast.toast({
          title: '信息填写不完整',
          duration: 1000,
        })
      } else {
        requiredata.schoolrp(requireUrl.schoolrpUrl, param, function (res) {
          if (res.data.flag == 1) {
            tips(that, '报修成功', 1000, '../index')
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
      }
    } else {
      console.log('修改');
      var param = {
        repairNeedEdit: {
          Id: that.data.Id,
          Fault: that.data.Fault,
          Model: that.data.model,
          Brand: that.data.Brand
        },
        sessionid: wx.getStorageSync('sessionid')
      }
      console.log(param);
      requiredata.getEditschool(requireUrl.editSchoolUrl, param, function (res) {
        console.log(res);
        if (res.data.flag == 1) {
          tips(that, '修改成功', 1000, '../index')
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
    }


  }
})