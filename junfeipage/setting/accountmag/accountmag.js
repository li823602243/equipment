// junfeipage/setting/accountmag/accountmag.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const timeout = require('../../../utils/util.js').timeout;
const indexHref = require('../../../utils/util.js').indexHref;
let app = getApp();
var initdata = function (that) {
  var list = that.data.list
  for (var i = 0; i < list.length; i++) {
    list[i].txtStyle = ""
  }
  that.setData({ list: list })
}
Page({
  data: {
    delBtnWidth: 180,//删除按钮宽度单位（rpx）  
    list: [],
    select: 0,
    acctname: "",
    isloading: true
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast()
    this.initEleWidth();
    //sessionid
    var sessionid = wx.getStorageSync('sessionid');
    var AcctName = wx.getStorageSync('AcctName');
    that.setData({
      acctname: AcctName
    })
    requiredata.getallaccount(requireUrl.getallaccountUrl, sessionid, AcctName, function (res) {
      console.log("登录列表数据", res.data);
      if (res.data.flag == "1") {
        JSON.parse(res.data.data.rows).map(function (item) {
          if (item.UserId == wx.getStorageSync('accountId')) {
            that.setData({
              select: wx.getStorageSync('accountId')
            })
          }
        })
        that.setData({
          list: JSON.parse(res.data.data.rows),
          isloading: false
        })
      } else if (res.data.flag == "-1") {
        timeout(that, "../../login/index")
      } else {
        that.wetoast.toast({
          title: res.data.msg,
          duration: 1000
        });
      }
      //

    }, function (res) {
      console.log("失败", res)
    })


  },
  //点击切换账号
  selectedtap: function (e) {
    wx.setStorageSync('accountId', e.currentTarget.dataset.accountid);
    var that = this;
    that.setData({
      select: e.currentTarget.dataset.accountid
    })

    var switchaccountdata = {
      LoginName: e.currentTarget.dataset.loginname,
      SessionId: wx.getStorageSync('sessionid'),
    }
    console.log(switchaccountdata)
    requiredata.switchaccount(requireUrl.switchaccountUrl, switchaccountdata, function (res) {
      if (res.data.flag == "1") {
        wx.setStorageSync('unittype', JSON.parse(res.data.data.rows).UnitType);
        wx.setStorageSync('sessionid', res.data.data.sessionId);
        wx.setStorageSync('AcctName', e.currentTarget.dataset.loginname);
         wx.setStorageSync('Unitid', JSON.parse(res.data.data.rows).UnitId);
          wx.setStorageSync('RoleIds', JSON.parse(res.data.data.rows).RoleIds);
        //跳转到首页
        wx.switchTab({
          url: '../../working/index'
        })
        console.log("切换账号成功", res.data)
      } else if (res.data.flag == "-1") {
        timeout(that, "../../login/index")
      } else {
        that.wetoast.toast({
          title: res.data.msg,
          duration: 1000
        });
      }
    }, function (res) {
      console.log("失败", res.data)
    })

  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var that = this
    initdata(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        list: list
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        list: list
      });
    }
  },
  //获取元素自适应后的实际宽度  
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
      // console.log(scale);  
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error  
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件  
  delItem: function (e) {
    var that = this;
    var cancelbindaccountdata = {
      LoginName: e.currentTarget.dataset.loginname,
      SessionId: wx.getStorageSync('sessionid'),

    }
    wx.showModal({
      title: '提示',
      content: '是否删除账号？',
      success: function (res) {
        if (res.confirm) {
          //获取列表中要删除项的下标   
          var index = e.target.dataset.index;
          var list = that.data.list;
          //移除列表中下标为index的项  
          requiredata.cancelbindaccount(requireUrl.cancelbindaccountUrl, cancelbindaccountdata, function (res) {
            if (res.data.flag == "1") {
              list.splice(index, 1);
              //更新列表的状态  
              that.setData({
                list: list
              });
            } else if (res.data.flag == "-1") {
              timeout(that, "../../login/index")
            } else {
              that.wetoast.toast({
                title: res.data.msg,
                duration: 1000
              });
            }
          }, function (res) {

          })

        } else {
          initdata(that)
        }
      }
    })

  },
  //退出账号
  loginOuttap: function (e) {
    var that = this;
    var loginoutdata = {
      LoginName: wx.getStorageSync('AcctName'),
      SessionId: wx.getStorageSync('sessionid'),
    }
    wx.showModal({
      title: '提示',
      content: '是否退出当前登录？',
      success: function (res) {
        if (res.confirm) {
          requiredata.loginout(requireUrl.loginoutUrl, loginoutdata, function (res) {
            console.log(res.data, loginoutdata)
            if (res.data.flag == "1") {
              //跳转到登陆页面
              wx.redirectTo({
                url: '../../login/index?loginflag=1'
              })
            } else if (res.data.flag == "-1") {
              timeout(that, "../../login/index")
            } else {
              that.wetoast.toast({
                title: res.data.msg,
                duration: 1000
              });
            }
          }, function (res) {
            console.log("失败")
          })
        } else {
          console.log("取消")
        }
      }
    })


  }
})