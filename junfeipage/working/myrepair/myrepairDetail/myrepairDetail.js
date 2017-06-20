// junfeipage/working/myrepair/myrepairDetail/myrepairDetail.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
const tips = require('../../../../utils/util.js').tips;


let app = getApp();
Page({
  data: {
    list: '',
    show: [true, false, false],
    checked: '',
    id: '',//维修单id
    EquipmentId: '',
    array: ['是', '否'],
    DeviceCodeName: '',
    DeviceCodeId: '',
    Address: '',
    AddressId: '',
    guzhang: '',
    Brand: '',//品牌
    model: '',//型号
    zhibao: '',
    unitid: '',
    hidden: true,
    type: '',
    IsAlarm: '',
    AlarmReason: '',
    Fault: '',
    record: '',//维修记录
    ServerItemId: "",
    Quantity: "",
    UnitName: "",
    Price: "",
    ServeTotal: "",
    PartTotal: '',
    PriceMax: "",
    ReferencePrice: '',
    Warranty: "",
    Memo: "",//备注
    ItemName: "",
    Name: '',
    homeFee: 0,//上门费
    UnitPrice: '',
    serverFee: [],
    partFee: [],
    totalPrice: 0,
    Advice: '',
    unitNames: ['个', '套', '块', '件', '副', '次'],
    ItemNames: [],
    Names: [],
    PriceMaxs: [],  //限价
    ReferencePrices: [], //参考价
    homefeeInfo: '',   //上门费提示
    disabled: false, //是否收上门费
    homefeeMax: 0,
    pjmodel: '',
    pjbrand: ''
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    console.log(options);
    that.setData({
      id: options.param,
      unitid: wx.getStorageSync('unittype')
    })
    //获取验收不通过信息
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
            Advice: maplist.Memo
          })
        }
      }, function (res) {

      })
    }
    //获取信息
    var param = {
      Id: that.data.id,
      t: 4,
      sessionId: wx.getStorageSync('sessionid')
    }
    wx.request({
      url: requireUrl.mtresdtUrl,
      data: param,
      method: 'GET',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.data.flag == 1) {
          console.log(res.data.data.rows)
          var maplist = JSON.parse(res.data.data.rows)
          if (that.data.unitid == 4) {
            if (maplist.Statuz == 50) {
              console.log('状态没变')
              that.setData({
                list: maplist,
                checked: maplist.IsAlarm,
                zhibao: that.data.array[maplist.IsWarranty],
                EquipmentId: maplist.EquipmentId,
                DeviceCodeName: maplist.DeviceCodeName,
                DeviceCodeId: maplist.DeviceCodeId,
                Address: maplist.FullAddress,
                AddressId: maplist.AddressId,
                guzhang: maplist.Fault,
                Brand: maplist.Brand,
                model: maplist.Model,
                Fault: maplist.FaultConfirm,
                record: maplist.Memo,
                checked: maplist.IsAlarm,
                IsAlarm: maplist.IsAlarm,
                AlarmReason: maplist.AlarmReason,
              })
            } else if (maplist.Statuz == 60||maplist.Statuz == 70) {
              console.log('维修完成')
              that.wetoast.toast({
                title: '该报修单已完成',
                duration: 1000,
                success: function () {
                  wx.redirectTo({
                    url: '../../myrepair/myrepair',
                  })
                }
              });
            }
          } else {
            that.setData({
              list: maplist,
              checked: maplist.IsAlarm,
              zhibao: that.data.array[maplist.IsWarranty],
              EquipmentId: maplist.EquipmentId,
              DeviceCodeName: maplist.DeviceCodeName,
              DeviceCodeId: maplist.DeviceCodeId,
              Address: maplist.FullAddress,
              AddressId: maplist.AddressId,
              guzhang: maplist.Fault,
              Brand: maplist.Brand,
              model: maplist.Model,
              Fault: maplist.FaultConfirm,
              record: maplist.Memo,
              checked: maplist.IsAlarm,
              IsAlarm: maplist.IsAlarm,
              AlarmReason: maplist.AlarmReason,
            })
          }

          console.log(that.data.DeviceCodeId);
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
          console.log('已退回')
          that.wetoast.toast({
            title: '该报修单已退回',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: '../../myrepair/myrepair',
              })
            }
          });
        }
      },
      fail: function () {
        console.log('请求失败')
      }
    })

    //获取配件费信息
    var param2 = {
      id: options.param,
      sessionid: wx.getStorageSync('sessionid')
    }
    requiredata.getpartFee(requireUrl.getpartfeeUrl, param2, function (res) {
      console.log(res);
      if (res.data.flag == 1 && res.data.data.total != 0) {
        console.log('有值')
        that.setData({
          partFee: JSON.parse(res.data.data.rows)
        })
        var sum1 = 0, sum2 = 0, sum = 0;
        for (var i = 0; i < that.data.serverFee.length; i++) {
          sum1 += that.data.serverFee[i].Total;
        }
        for (var i = 0; i < that.data.partFee.length; i++) {
          sum2 += that.data.partFee[i].Total;
        }
        sum = parseInt(sum1) + parseInt(sum2) + parseInt(that.data.homeFee);
        that.setData({
          totalPrice: sum
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
    }, function (res) {
      console.log('失败' + res)
    })

    // 获取服务费信息
    requiredata.getserviceFee(requireUrl.getservicefeeUrl, param2, function (res) {
      console.log(res);
      if (res.data.flag == 1 && res.data.data.total != 0) {
        that.setData({
          serverFee: JSON.parse(res.data.data.rows)
        })
        var sum1 = 0, sum2 = 0, sum = 0;
        for (var i = 0; i < that.data.serverFee.length; i++) {
          sum1 += that.data.serverFee[i].Total;
        }
        for (var i = 0; i < that.data.partFee.length; i++) {
          sum2 += that.data.partFee[i].Total;
        }
        sum = parseInt(sum1) + parseInt(sum2) + parseInt(that.data.homeFee);
        that.setData({
          totalPrice: sum
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
    }, function (res) {
      console.log('失败' + res)
    })

    //获取上门费信息
    requiredata.gethomefeeinfo(requireUrl.gethomefeeUrl, param2, function (res) {
      if (res.data.flag == 1) {
        console.log(res)
        var rows = JSON.parse(res.data.data.rows);
        if (rows[0].LimitServerFee == 0) {
          that.setData({
            homefeeInfo: '该维修单不允许收上门费',
            disabled: true,
            homeFee: 0
          })
        } else if (rows[0].LimitServerFee == 1) {
          that.setData({
            homefeeInfo: '限价:' + rows[0].homeFee,
            disabled: false,
            homeFeeMax: rows[0].homeFee
          })
        } else if (rows[0].LimitServerFee == -1) {
          that.setData({
            homefeeInfo: '不限价',
            disabled: false
          })
        }
      }
    }, function (res) {
      console.log('失败' + res)
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
  listenerPickerSelected: function (e) {
    this.setData({
      UnitName: this.data.unitNames[e.detail.value]
    });
  },
  //选择维修项目
  mtnameChange: function (e) {
    var that = this;
    console.log(that.data.PriceMaxs)
    that.setData({
      ItemName: that.data.ItemNames[e.detail.value],
      Price: that.data.PriceMaxs[e.detail.value],
      PriceMax: that.data.PriceMaxs[e.detail.value]
    });
  },
  //选择配件
  pjnameChange: function (e) {
    var that = this;
    that.setData({
      Name: that.data.Names[e.detail.value],
      Price: that.data.ReferencePrices[e.detail.value],
      ReferencePrice: that.data.ReferencePrices[e.detail.value]
    });
  },
  //配件品牌 
  getBrand: function (e) {
    var that = this;
    that.setData({
      pjbrand: e.detail.value
    });
  },
  //配件型号
  getModel: function (e) {
    var that = this;
    that.setData({
      pjmodel: e.detail.value
    });
  },
  toggle: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    that.data.show[idx] = !that.data.show[idx];
    that.setData({
      show: that.data.show
    })
  },
  //撤销响应
  Undores: function () {
    var that = this;
    var param = {
      id: that.data.id,
      sessionid: wx.getStorageSync('sessionid')
    }
    wx.showModal({
      title: '提示',
      content: '确认撤销响应?',
      success: function (res) {
        if (res.confirm) {
          console.log('确定');
          wx.request({
            url: requireUrl.undoresUrl,
            data: param,
            method: 'POST',
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              console.log(res);
              if (res.data.flag == 1) {
                tips(that, '撤销成功', 1000, '../../index');
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

  },
  //报修单退回
  undoBack: function (e) {
    var that = this;
    var param = {
      FormId: e.detail.formId,
      rnId: that.data.id,
      memo: '',
      sessionId: wx.getStorageSync('sessionid')
    }
    wx.showModal({
      title: '提示',
      content: '确认退回?',
      success: function (res) {
        if (res.confirm) {
          console.log('确定');
          wx.request({
            url: requireUrl.backmtUrl,
            data: param,
            method: 'GET',
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              if (res.data.flag == 1) {
                tips(that, '提交成功', 1000, '../../index')
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

  },
  add: function (e) {
    var that = this;
    that.setData({
      hidden: false,
      type: e.currentTarget.dataset.index
    })
    //维修项目名称
    if (that.data.type == 0) {
      console.log(111)
      wx.request({
        url: requireUrl.mtnameUrl,
        data: {
          deviceCodeId: that.data.DeviceCodeId,
          repairNeedId: that.data.id,
          sessionid: wx.getStorageSync('sessionid')
        },
        method: 'GET',
        success: function (res) {
          console.log(res);
          if (res.data.flag == 1) {
            var rows = JSON.parse(res.data.data.rows);
            for (var i = 0; i < rows.length; i++) {
              that.data.ItemNames.push(rows[i].Name),
                that.data.PriceMaxs.push(rows[i].PriceMax)
            }
            that.setData({
              ItemNames: that.data.ItemNames,
              PriceMaxs: that.data.PriceMaxs
            })
          }
          console.log(that.data.ItemNames)
        },

      })
    } else if (that.data.type == 1) {
      console.log(2222)
      wx.request({
        url: requireUrl.getpjlistUrl,
        data: {
          deviceCodeId: that.data.DeviceCodeId,
          sessionid: wx.getStorageSync('sessionid')
        },
        method: 'GET',
        success: function (res) {
          console.log(res);
          if (res.data.flag == 1) {
            var rows = JSON.parse(res.data.data.rows);
            for (var i = 0; i < rows.length; i++) {
              that.data.Names.push(rows[i].Name),
                that.data.ReferencePrices.push(rows[i].ReferencePrice)
            }
            that.setData({
              Names: that.data.Names,
              ReferencePrices: that.data.ReferencePrices
            })
          }
          console.log(that.data.Names)
        },

      })
    }
  },
  Determine: function () {
    var that = this;
    console.log()
    that.setData({
      ServeTotal: that.data.Price * that.data.Quantity,
      PartTotal: that.data.UnitPrice * that.data.Quantity,
    })
    if (that.data.type == 0) {
      if (that.data.ItemName == '') {
        that.wetoast.toast({
          title: '请选择维修项目',
          duration: 1000,
        });
      } else {
        var serverFeeitem = {
          ServerItemId: -1,
          Quantity: that.data.Quantity,
          UnitName: that.data.UnitName,
          Price: that.data.Price,
          Total: that.data.ServeTotal,
          PriceMax: "",
          Warranty: that.data.Warranty,
          Memo: that.data.Memo,
          ItemName: that.data.ItemName
        }
        that.data.serverFee.push(serverFeeitem)
        that.setData({
          serverFee: that.data.serverFee,
          Quantity: '',
          UnitName: '',
          Price: '',
          Total: '',
          PriceMax: "",
          Warranty: '',
          Memo: '',
          ItemName: '',
          ItemNames: [],
          PriceMaxs: [],  //限价
          hidden: true,
        })
      }

    } else if (that.data.type == 1) {
      if (that.data.Name == "") {
        that.wetoast.toast({
          title: '请选择配件名称',
          duration: 1000,
        });
      } else {
        var partFeeitem = {
          PartsItemId: -1,
          Brand: that.data.pjbrand,
          Model: that.data.pjmodel,
          Quantity: that.data.Quantity,
          UnitName: that.data.UnitName,
          UnitPrice: that.data.UnitPrice,
          Total: that.data.PartTotal,
          ReferencePrice: "",
          Warranty: that.data.Warranty,
          Memo: that.data.Memo,
          Name: that.data.Name
        }
        that.data.partFee.push(partFeeitem)
        that.setData({
          partFee: that.data.partFee,
          Brand: '',
          Model: '',
          Quantity: '',
          UnitName: '',
          UnitPrice: '',
          ReferencePrice: "",
          Warranty: '',
          Memo: '',
          Name: '',
          Names: [],
          ReferencePrices: [], //参考价
          hidden: true
        })
      }
    }
    var sum1 = 0, sum2 = 0, sum = 0;
    for (var i = 0; i < that.data.serverFee.length; i++) {
      sum1 += that.data.serverFee[i].Total;
    }
    for (var i = 0; i < that.data.partFee.length; i++) {
      sum2 += that.data.partFee[i].Total;
    }
    sum = parseInt(sum1) + parseInt(sum2) + parseInt(that.data.homeFee);
    that.setData({
      totalPrice: sum
    })
  },
  Cancel: function () {
    var that = this;
    that.setData({
      hidden: true,
      ItemNames: [],
      Names: [],
      UnitName: '',
      Price: '',
      ItemName: '',
      Name: '',
      ReferencePrice: '',
      PriceMax: '',
      PriceMaxs: [],  //限价
      ReferencePrices: [] //参考价
    })
  },
  //s删除维修项目
  delserverfee: function (e) {
    var that = this;
    that.data.serverFee.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      serverFee: that.data.serverFee
    })
    var sum1 = 0, sum2 = 0, sum = 0;
    for (var i = 0; i < that.data.serverFee.length; i++) {
      sum1 += that.data.serverFee[i].Total;
    }
    for (var i = 0; i < that.data.partFee.length; i++) {
      sum2 += that.data.partFee[i].Total;
    }
    sum = parseInt(sum1) + parseInt(sum2) + parseInt(that.data.homeFee);
    that.setData({
      totalPrice: sum
    })
  },
  //删除配件项目
  delpartfee: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.index);
    that.data.partFee.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      partFee: that.data.partFee
    })
    var sum1 = 0, sum2 = 0, sum = 0;
    for (var i = 0; i < that.data.serverFee.length; i++) {
      sum1 += that.data.serverFee[i].Total;
    }
    for (var i = 0; i < that.data.partFee.length; i++) {
      sum2 += that.data.partFee[i].Total;
    }
    sum = parseInt(sum1) + parseInt(sum2) + parseInt(that.data.homeFee);
    that.setData({
      totalPrice: sum
    })
  },
  getmtname: function (e) {
    var that = this;
    that.setData({
      ItemName: e.detail.value
    })
  },
  getPjname: function (e) {
    var that = this;
    that.setData({
      Name: e.detail.value
    })
  },
  getPjnum: function (e) {
    var that = this;
    if (that.data.type == 0) {
      that.setData({
        Quantity: e.detail.value
      })
    } else if (that.data.type == 1) {
      that.setData({
        Quantity: e.detail.value
      })
    }
  },
  getPjdanwei: function (e) {
    var that = this;
    that.setData({
      UnitName: e.detail.value
    })
  },
  getPjprice: function (e) {
    var that = this;
    if (that.data.type == 0) {
      if (that.data.PriceMax != "" & that.data.PriceMax!=0) {
        console.log('限价')
        that.data.Price = e.detail.value > that.data.PriceMax ? that.data.PriceMax : e.detail.value;
        that.setData({
          Price: that.data.Price
        })
      } else {
        that.setData({
          Price: e.detail.value
        })
      }

    } else if (that.data.type == 1) {
      that.setData({
        UnitPrice: e.detail.value
      })
    }
  },
  getPjmonths: function (e) {
    var that = this;
    that.setData({
      Warranty: e.detail.value
    })
  },
  getPjmemo: function (e) {
    var that = this;
    that.setData({
      Memo: e.detail.value
    })
  },
  getFault: function (e) {
    var that = this;
    that.setData({
      Fault: e.detail.value
    })
  },
  getMemo: function (e) {
    var that = this;
    that.setData({
      record: e.detail.value
    })
  },
  getExtraPrice: function (e) {
    var that = this;
    if (that.data.homefeeMax !== '') {
      that.data.homeFee = e.detail.value > that.data.homefeeMax ?
        that.data.homefeeMax : e.detail.value;
      that.setData({
        homeFee: that.data.homeFee
      })
    } else {
      that.setData({
        homeFee: e.detail.value
      })
    }

    var sum1 = 0, sum2 = 0, sum = 0;
    for (var i = 0; i < that.data.serverFee.length; i++) {
      sum1 += that.data.serverFee[i].Total;
    }
    for (var i = 0; i < that.data.partFee.length; i++) {
      sum2 += that.data.partFee[i].Total;
    }
    sum = parseInt(sum1) + parseInt(sum2) + parseInt(that.data.homeFee);
    that.setData({
      totalPrice: sum
    })
  },
  radioChange: function (e) {
    var that = this;
    that.setData({
      IsAlarm: e.detail.value
    })
  },
  getAlarmReason: function (e) {
    var that = this;
    that.setData({
      AlarmReason: e.detail.value
    })
  },
  //维修完成
  submit: function (e) {
    console.log(e);
    var that = this;
    var param = {
      repairOrder: {
        repairRecord: {
          FaultConfirm: that.data.Fault,
          Memo: that.data.record,
          IsAlarm: that.data.IsAlarm,
          AlarmReason: that.data.AlarmReason,
          RepairNeedId: that.data.id,
          HomeFee: that.data.homeFee
        },
        type: 2,
        serverFee: that.data.serverFee,
        partFee: that.data.partFee,
        FormId: e.detail.formId,
      },
      sessionid: wx.getStorageSync('sessionid')
    }
    console.log(param);
    wx.showModal({
      title: '提示',
      content: '确定维修完成?',
      success: function (res) {
        if (res.confirm) {
          console.log('确定');
          wx.request({
            url: requireUrl.myrepairsubmitUrl,
            data: param,
            method: 'POST',
            success: function (res) {
              if (res.data.flag == 1) {
                tips(that, '提交成功', 1000, '../../index')
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
              // fail
            },
            complete: function () {
              // complete
            }
          })
        }

      }
    })

  },
  //转报企业
  transforcop: function () {
    var param = this.data.id;
    var EquipmentId = this.data.EquipmentId;
    wx.showModal({
      title: '提示',
      content: '确定转报企业?',
      success: function (res) {
        if (res.confirm) {
          console.log('确定');
          wx.navigateTo({
            url: '../../enterpriserepair/enterpriserepair?param=' + param + '&role=1' + 'EquipmentId=' + EquipmentId,
          })
        }
      }
    })

  },
  //临时保存
  save: function (e) {
    console.log(e);
    var that = this;
    var param = {
      repairOrder: {
        repairRecord: {
          FaultConfirm: that.data.Fault,
          Memo: that.data.record,
          IsAlarm: that.data.IsAlarm,
          AlarmReason: that.data.AlarmReason,
          RepairNeedId: that.data.id,
          HomeFee: that.data.homeFee
        },
        type: 1,
        serverFee: that.data.serverFee,
        partFee: that.data.partFee,
        FormId: e.detail.formId,
      },
      sessionid: wx.getStorageSync('sessionid')
    }
    console.log(param);
    wx.request({
      url: requireUrl.myrepairsubmitUrl,
      data: param,
      method: 'POST',
      success: function (res) {
        if (res.data.flag == 1) {
          tips(that, '保存成功', 1000, '../../index')
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
      }
    })
  }
})