// junfeipage/working/enterpriserepair/enterpriserepair.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const tips = require('../../../utils/util.js').tips;
let app = getApp();


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
    console.log(res);
    if (res.data.flag == 1) {
      wx.removeStorageSync('equip');
      wx.removeStorageSync('equipId');
      wx.removeStorageSync('compName');
      wx.removeStorageSync('compID');
      wx.removeStorageSync('tel');
      wx.removeStorageSync('pid');
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
          CompanyName: '',
          CompanyId: '',
          CompanyTel: '',
          Models: [],
          pid: '',
          index: '',
          zhibao: '',
        })
      } else {
        var rows = JSON.parse(res.data.data.rows)
        if (rows.SchoolId == wx.getStorageSync('Unitid')) {
          if (rows.Warranty) {
            var Warranty = (rows.Warranty).replace(/-/g, "/").substr(0, 10);
            var Warrantydate = new Date(Date.parse(Warranty));
            var currDate = new Date();
            if (Warrantydate >= currDate) {
              console.log('没过期')
              that.setData({
                index: 1,
                zhibao: that.data.array[1]
              });
            } else {
              console.log('过期')
              that.setData({
                index: 0,
                zhibao: that.data.array[0]
              });
            }
          }

          that.setData({
            DeviceCodeName: rows.Name,
            DeviceCodeId: rows.RepairDeviceId,
            Address: rows.Address,
            AddressId: rows.AdressId,
            Brand: rows.Brand,
            model: rows.Model,
            CompanyName: rows.CompanyName,
            CompanyId: rows.CompanyId,
            CompanyTel: rows.CompanyMobile,
            Models: [],
            pid: rows.RepairClassId
          })
          getBrands(that);
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
            CompanyName: '',
            CompanyId: '',
            CompanyTel: '',
            Models: [],
            pid: '',
            index: '',
            zhibao: '',
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
        model: '',
        CompanyName: '',
        CompanyId: '',
        CompanyTel: '',
        zhibao: '',
        SchoolId: ''
      })
    }
  }, function (res) {

  })
}



Page({
  data: {
    array: ['质保外', '质保内'],
    role: 0,
    Id: '',
    EquipmentId: '',
    index: -1,//是否过保
    zhibao: '',
    IsWarranty: '请选择',
    equip: '',
    addr: '',
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
    CompanyName: '',
    CompanyId: '',
    CompanyTel: '',
    hasOther: false,
    pid: '',
    Models: ['请先选择设备'],
    Telegraph: false,//转报或修改
    id: '',//报修单id
    Memo: '',
    SchoolId: ''//学校Id
  },
  onLoad: function (options) {
    var that = this;
    console.log(wx.getStorageSync('Unitid'));
    new app.WeToast();
    wx.removeStorageSync('equip');
    wx.removeStorageSync('equipId');
    wx.removeStorageSync('compName');
    wx.removeStorageSync('compID');
    wx.removeStorageSync('tel');
    wx.removeStorageSync('pid');
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

    //获取退回信息
    if (options.pass) {
      var param = {
        repairNeedId: options.param,
        statuz: options.pass,
        sessionId: wx.getStorageSync('sessionid')
      }
      requiredata.getpassInfo(requireUrl.getpassinfoUrl, param, function (res) {
        console.log(res);
        if (res.data.flag == 1) {
          var maplist = JSON.parse(res.data.data.rows);
          that.setData({
            Memo: maplist.Memo
          })
        }
      }, function (res) {

      })
    }
    if (options.role) {
      console.log('修改或转报')
      that.setData({
        Id: options.param,
        role: options.role
      })
    }
    if (that.data.Id != '') {
      var param = {
        id: that.data.Id,
        t: 1,
        sessionid: wx.getStorageSync('sessionid')
      }
      requiredata.getresDetail(requireUrl.mtresdtUrl, param, function (res) {
        console.log(res);
        if (res.data.flag == 1) {
          var maplist = JSON.parse(res.data.data.rows);
          that.setData({
            Id: maplist.Id,
            EquipmentId: maplist.EquipmentId,
            DeviceCodeName: maplist.DeviceCodeName,
            DeviceCodeId: maplist.DeviceCodeId,
            Address: maplist.FullAddress,
            AddressId: maplist.AddressId,
            Fault: maplist.Fault,
            Brand: maplist.Brand,
            model: maplist.Model,
            pid: maplist.DeviceCodeId2,
            CompanyName: maplist.CompanyName,
            CompanyTel:maplist.CompanyTel,
            CompanyId:maplist.CompanyId,
            index: maplist.IsWarranty,
            zhibao: that.data.array[maplist.IsWarranty],
            Models: [],
            AssetCode:maplist.AssetCode
          })
          getBrands(that);
        }
        console.log(that.data.index + ',,,' + that.data.DeviceCodeName);
      }, function () {

      })
    }
  },
  onShow: function () {
    var that = this;

    console.log('...' + that.data.DeviceCodeName)
    if (wx.getStorageSync('equipId')) {
      that.setData({
        DeviceCodeName: wx.getStorageSync('equip'),
        DeviceCodeId: wx.getStorageSync('equipId'),
        pid: wx.getStorageSync('pid'),
      })
    }
    if (wx.getStorageSync('compID')) {
      that.setData({
        CompanyName: wx.getStorageSync('compName'),
        CompanyId: wx.getStorageSync('compID'),
        CompanyTel: wx.getStorageSync('tel'),
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
  //获取服务商或维修商
  gotorepaddr: function () {
    var that = this;
    console.log(that.data.index + '...' + that.data.pid);
    console.log(!that.data.pid)
    if (((that.data.index == -1) || (that.data.pid == ''))) {
      that.wetoast.toast({
        title: '请先选择上面选项',
        duration: 1000,
      });
    } else {
      wx.navigateTo({
        url: '../repairaddr/repairaddr?param=' + that.data.index + '&id=' + that.data.pid,
      })
    }
  },
  getAssetcode: function (e) {
    var that = this;
    console.log(e)
    that.setData({
      AssetCode: e.detail.value
    })
    getonesweepData(e.detail.value, that);
  },
  //是否过保
  listenerPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index: e.detail.value,
      zhibao: this.data.array[e.detail.value],
      CompanyName: '',
      CompanyId: '',
      CompanyTel: '',
    });
  },
  //二维码信息
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
  //获取设备名称
  gotoEquipTree: function () {
    wx.navigateTo({
      url: '../equiptree/equiptree',
    })
  },

  //设备地点
  gotoAddress: function () {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  //设备品牌
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
  //故障信息
  getFault: function (e) {
    this.setData({
      Fault: e.detail.value,
    });
  },
  getModel: function (e) {
    this.setData({
      model: e.detail.value,
    });
  },
  submit: function (e) {
    var that = this;
    if (that.data.role == 0) {
      console.log('直报');
      var param = {
        repairNeedEquipmentOut: {
          CompanyId: that.data.CompanyId,
          CompanyName: that.data.CompanyName,
          CompanyTel: that.data.CompanyTel,
          IsWarranty: that.data.index,
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
          Brand: that.data.Brand,
          FormId: e.detail.formId
        },
        SessionId: wx.getStorageSync('sessionid')
      }
      if (that.data.DeviceCodeName == '' || (that.data.Address == '' && that.data.OtherAddressName == '') || that.data.Fault == '' || that.IsWarranty == '' || that.data.CompanyName == '') {
        that.wetoast.toast({
          title: '信息填写不完整',
          duration: 1000,
        });
      } else {
        console.log(param);
        requiredata.schoolrp(requireUrl.schtorpUrl, param, function (res) {
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
            })
          }

        }, function (res) {
          console.log("失败", res);
        })
      }

    } else {
      console.log('转报' + that.data.role)
      var param = {
        requaiNeedEquipmentEditOut: {
          Id: that.data.Id,
          EquipmentId: that.data.EquipmentId,
          ForwardUserId: 0,
          CompanyId: that.data.CompanyId,
          CompanyName: that.data.CompanyName,
          CompanyTel: that.data.CompanyTel,
          IsWarranty: that.data.index,
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
          Brand: that.data.Brand,
          FormId: e.detail.formId
        },
        SessionId: wx.getStorageSync('sessionid')
      }
      console.log(param);
      if (that.data.DeviceCodeName == '' || (that.data.Address == '' && that.data.OtherAddressName == '') || that.data.Fault == '' || that.IsWarranty == '' || that.data.CompanyName == '') {
        that.wetoast.toast({
          title: '信息填写不完整',
          duration: 1000,
        })
      } else {
        requiredata.transforCop(requireUrl.transforCopUrl, param, function (res) {
          if (res.data.flag == 1) {
            tips(that, '提交成功', 1000, '../index')
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
            })
          }

        }, function (res) {
          console.log("失败", res);
        })
      }
    }
  }
})