// junfeipage/login/index.js
const requireUrl = require('../../config.js');
const requiredata = require('../../utils/util.js').request_data;
let app = getApp();

Page({
  data: {
    checked: 0,
    username: "",
    password: "",
    startuploading: true
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    if (options.loginflag == 1) {
      that.setData({
        startuploading: false
      })
    } else {
      //code换取openid
      wx.login({
        success: function (e) {
          console.log("微信登录的code值", e.code);
          if (e.code) {
            requiredata.onLogin(requireUrl.openIdUrl, e.code, function (res) {

              if (res.data.flag == "1") {
                wx.setStorageSync('sessionid', res.data.data.sessionId)
                console.log("自动登录的时候的sessionid", wx.getStorageSync('sessionid'))
                wx.setStorageSync('AcctName', JSON.parse(res.data.data.rows).AcctName)
                wx.setStorageSync('unittype', JSON.parse(res.data.data.rows).UnitType);
                wx.setStorageSync('accountId', JSON.parse(res.data.data.rows).Id);
                wx.setStorageSync('Unitid', JSON.parse(res.data.data.rows).UnitId);
                 wx.setStorageSync('RoleIds', JSON.parse(res.data.data.rows).RoleIds);
                console.log(res.data)
                that.setData({
                  startuploading: true
                })
                wx.getUserInfo({
                  success: function (res) {
                    //用户信息解密参数
                    var userinfoObj = {
                      Type: "USERINFO",
                      SessionId: wx.getStorageSync('sessionid'),
                      EncryptedData: res.encryptedData,
                      Iv: res.iv
                    }
                    if (res.encryptedData) {
                      requiredata.uploaduserinfo(requireUrl.uploaduserinfoUrl, userinfoObj, function (res) {

                        console.log("用户信息", userinfoObj, res.data);
                      },
                        function (res) {
                          console.log('获取用户信息失败！' + res.errMsg)
                        })
                    }
                  }
                })

                wx.switchTab({
                  url: '../../junfeipage/working/index'
                });
              } else {
                that.setData({
                  startuploading: false
                })
              }

            },
              function (res) {
                that.setData({
                  startuploading: false
                })
                console.log('获取用户登录态失败！' + res.errMsg)
              })
          }

        }
      })
    }
    var username = wx.getStorageSync('username');
    this.setData({
      username: username
    })
    console.log("user", username);
  },
  //监听选择框事件
  checkboxChange: function (e) {
    this.setData({
      checked: e.detail.value
    })
    console.log(this.data.checked)
  },
  //输入用户名事件
  bindusername: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  //输入用户密码事件
  bindpassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  logintap: function () {
    var that = this;
    if (that.data.username == "" || that.data.password == "") {
      that.wetoast.toast({
        title: '请填写选项',
        duration: 5000
      });
    }
    else {

      wx.login({
        success: function (e) {
          console.log("1", e.code);
          if (e.code) {
            var userobj = {
              LoginName: that.data.username,
              Pwd: that.data.password,
              Code: e.code,
              SessionId: wx.getStorageSync('sessionid')

            }
            userobj = JSON.stringify(userobj);
            console.log(e.code, that.data.username, that.data.password)

            requiredata.onUser(requireUrl.userUrl, userobj, function (res) {
              if (res.data.flag == 1) {
                var acctname = JSON.parse(res.data.data.rows).AcctName
                console.log("33333", acctname)
                wx.setStorageSync('sessionid', res.data.data.sessionId)
                console.log("登陆成功的值", res.data);
                wx.setStorageSync('username', that.data.username);
                wx.setStorageSync('password', that.data.password);
                wx.setStorageSync('AcctName', acctname)
                console.log("actname", wx.getStorageSync('AcctName'))
                wx.setStorageSync('unittype', JSON.parse(res.data.data.rows).UnitType);
                wx.setStorageSync('accountId', JSON.parse(res.data.data.rows).Id);
                wx.setStorageSync('Unitid', JSON.parse(res.data.data.rows).UnitId);
                 wx.setStorageSync('RoleIds', JSON.parse(res.data.data.rows).RoleIds);
                // wx.getUserInfo({
                //   success: function (res) {
                //     //用户信息解密参数
                //     var userinfoObj = {
                //       Type: "USERINFO",
                //       SessionId: wx.getStorageSync('sessionid'),
                //       EncryptedData: res.encryptedData,
                //       Iv: res.iv
                //     }
                //     if (res.encryptedData) {
                //       requiredata.uploaduserinfo(requireUrl.uploaduserinfoUrl, userinfoObj, function (res) {

                //         console.log("输入登录时用户信息", userinfoObj, res.data);
                //       },
                //         function (res) {
                //           console.log('获取用户信息失败！' + res.errMsg)
                //         })
                //     }
                //   }
                // })
                wx.switchTab({
                  url: '../../junfeipage/working/index'
                });
              } else {
                that.wetoast.toast({
                  title: res.data.msg,
                  duration: 1000
                });
              }

            },
              function (res) {
                that.wetoast.toast({
                  title: '登录失败',
                  duration: 1000
                });
                console.log('请求失败！' + res.errMsg)
              })

          }

        }
      })
    }

  }
})