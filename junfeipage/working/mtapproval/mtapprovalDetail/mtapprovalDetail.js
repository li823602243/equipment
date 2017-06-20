// junfeipage/working/mtapproval/mtapprovalDetail/mtapprovalDetail.js
const requireUrl = require('../../../../config.js');
const tips = require('../../../../utils/util.js').tips;
let app = getApp();
Page({
  data: {
    show: [false, true, true],
    index: 0,
    array: ['是', '否'],
    list: '',
    id: '',
    zhibao: '',
    result: ['通过', '不通过'],
    aprres: '',
    statuz: '',
    memo: '',
    unitid: '',
    pass: true,
    totalFee: 0
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast()
    that.setData({
      id: options.param,
      unitid: wx.getStorageSync('unittype')
    })
    if (that.data.unitid == 3) {
      that.setData({
        statuz: 40
      })
    } else if (that.data.unitid == 2) {
      that.setData({
        statuz: 80
      })
    }
    var param = {
      Id: that.data.id,
      t: 5,
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
          var rows = JSON.parse(res.data.data.rows);
          if (that.data.unitid == 3) {
            if (rows.Statuz == 21) {
              that.setData({
                list: rows,
                zhibao: that.data.array[rows.IsWarranty],
                totalFee: parseInt(rows.HomeFee) + parseInt(rows.ServiceFee) + parseInt(rows.PartsFee)
              })
            } else {
              that.wetoast.toast({
                title: '该报修单已审批',
                duration: 1000,
                success: function () {
                  wx.redirectTo({
                    url: '../../mtapproval/mtapproval',
                  })
                }
              });
            }
          } else {
            that.setData({
              list: rows,
              zhibao: that.data.array[rows.IsWarranty],
              totalFee: parseInt(rows.HomeFee) + parseInt(rows.ServiceFee) + parseInt(rows.PartsFee)
            })
          }

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
          })
        }
      },
      fail: function () {
        console.log('请求失败')
      }
    })
  },
  listenerPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    var that = this;
    that.setData({
      index: e.detail.value,
      aprres: that.data.result[e.detail.value]
    });
    if (that.data.unitid == 3) {
      if (e.detail.value == 0) {
        that.setData({
          statuz: 40
        })
      } else if (e.detail.value == 1) {
        that.setData({
          statuz: 22
        })
      }
    } else if (that.data.unitid == 2) {
      if (e.detail.value == 0) {
        that.setData({
          statuz: 80
        })
      } else if (e.detail.value == 1) {
        that.setData({
          statuz: 71
        })
      }
    }
  },
  radioChange: function (e) {
    var that = this;
    that.setData({
      index: e.detail.value
    })
    console.log(e.detail.value)
    if (that.data.unitid == 3) {
      if (e.detail.value == 'true') {
        console.log(111111)
        that.setData({
          statuz: 40
        })
      } else if (e.detail.value == 'false') {
        console.log(222222)
        that.setData({
          statuz: 22
        })
      }
    } else if (that.data.unitid == 2) {
      if (e.detail.value == 'true') {
        that.setData({
          statuz: 80
        })
      } else if (e.detail.value == 'false') {
        that.setData({
          statuz: 71
        })
      }
    }
    console.log(that.data.statuz)
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
  getAdvice: function (e) {
    var that = this;
    that.setData({
      memo: e.detail.value
    })
  },
  submit: function (e) {
    var that = this;
    var param = {
      auditOrder: {
        FormId: e.detail.formId,
        Id: that.data.id,
        Statuz: that.data.statuz,
        Memo: that.data.memo
      },
      SessionId: wx.getStorageSync('sessionid')
    }
    console.log(param);
    if (that.data.statuz == '') {
      that.wetoast.toast({
        title: '请选择审批结果',
        duration: 1000
      });
    }
    else {
      console.log(that.data.statuz);
      if ((that.data.statuz == 71 || that.data.statuz == 22) && that.data.memo == '') {
        that.wetoast.toast({
          title: '请填写审批意见',
          duration: 1000
        });
      } else {
        console.log(222)
        if (that.data.unitid == 3) {
          wx.request({
            url: requireUrl.masterapproUrl,
            data: param,
            method: 'POST',
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              if (res.data.flag == 1) {
                tips(that, '审批成功', 1000, '../../index')
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
                })
              }

            },
            fail: function () {
              console.log('请求失败')
            }
          })
        } else if (that.data.unitid == 2) {
          wx.request({
            url: requireUrl.countymasterapprovalUrl,
            data: param,
            method: 'POST',
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              if (res.data.flag == 1) {
                tips(that, '审批成功', 1000, '../../index')
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
                })
              }
            },
            fail: function () {
              console.log('请求失败')
            }
          })
        }
      }

    }

  }
})