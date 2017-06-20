// junfeipage/working/mytorepair/mytorepair.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const getStatuz = require('../../../utils/util.js').getStatuz;
const tips = require('../../../utils/util.js').tips;
let app = getApp();
var Start = 10;

var initdata = function (that) {
  var list = that.data.list
  for (var i = 0; i < list.length; i++) {
    list[i].txtStyle = ""
  }
  that.setData({ list: list })
}


function getlist(that) {
  var param = {
    Start: 0,
    PageLength: 10,
    key: '',
    SessionId: wx.getStorageSync('sessionid')
  }
  requiredata.getmtreplist(requireUrl.mytorplistUrl, param, function (res) {
    if (res.data.flag == 1) {
      var maplist = JSON.parse(res.data.data.rows);
      if (maplist.length == 0) {
        that.setData({
          nodata: true
        })
      } else {
        for (var i = 0; i < maplist.length; i++) {
          maplist[i].Statuz = getStatuz(maplist[i].Statuz, maplist[i].CompanyName);
          if (maplist[i].CompanyName == '') {
            maplist[i].CompanyName = '校内'
          }
        }
        that.setData({
          list: maplist,
          total: res.data.data.total,
          nodata: false
        })
        console.log(JSON.parse(res.data.data.rows))
      }
      Start = 10;
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


Page({
  data: {
    list: '',
    nodata: false,
    hidden: true,
    hasMore: true,
    total: '',
    startX: 0, //开始坐标
    startY: 0,
    delBtnWidth: 180
  },
  onLoad: function (options) {
    var that = this;
    that.initEleWidth();
    new app.WeToast();
    getlist(that);
  },
  onUnload: function () {
    Start = 10;
  },
  //去评价页面
  gotoratings: function (e) {
    var that = this;
    var param = e.currentTarget.dataset.id;
    console.log(param);
    wx.navigateTo({
      url: 'toratings/toratings?param=' + param,
    })
  },
  onReachBottom: function () {
    //上拉加载   
    var that = this;
    that.setData({
      hidden: false
    })
    var param = {
      Start: Start,
      PageLength: 10,
      key: '',
      SessionId: wx.getStorageSync('sessionid')
    }
    requiredata.getmtreplist(requireUrl.mytorplistUrl, param, function (res) {
      console.log(res)
      var maplist = JSON.parse(res.data.data.rows);
      for (var i = 0; i < maplist.length; i++) {
        maplist[i].Statuz = getStatuz(maplist[i].Statuz, maplist[i].CompanyName);
        if (maplist[i].CompanyName == '') {
          maplist[i].CompanyName = '校内'
        }
      }
      that.setData({
        list: that.data.list.concat(maplist),
      })
      if (that.data.list.length == that.data.total) {
        console.log('没有更多数据了');
        that.setData({
          hasMore: false
        })
      }
      Start += 10;
    }, function (res) {
      console.log("失败", res);
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      hasMore: true
    })
    getlist(that);
    wx.stopPullDownRefresh();
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
    var that = this;
    initdata(that);
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = that.data.startX - moveX;
      var delBtnWidth = that.data.delBtnWidth;
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
      var index = e.currentTarget.dataset.index;
      var list = that.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态  
      that.setData({
        list: list
      });
    }
  },

  touchE: function (e) {
    var that = this;
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var list = that.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态  
      that.setData({
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
  //删除事件
  del: function (e) {
    var that = this;
    var param = {
      Id: e.currentTarget.dataset.id,
      sessionid: wx.getStorageSync('sessionid')
    }
    requiredata.delmytorepair(requireUrl.delmytorepairUrl, param, function (res) {
      console.log(res);
      if (res.data.flag == 1) {
        that.data.list.splice(e.currentTarget.dataset.index, 1);
        that.setData({
          list: that.data.list
        })
      }
    }, function (res) {
      console.log("失败", res);
    })
  },
  //查看详情
  gotoDetail: function (e) {
    var param = e.currentTarget.dataset.id;
    var statuz = e.currentTarget.dataset.statuz;
    wx.navigateTo({
      url: '../RepiarDetail/RepiarDetail?param=' + param+'&statuz='+statuz,
    })
  },
  //修改报修单(审批不通过)
  gotoEdit:function(e){
    wx.navigateTo({
      url: '../enterpriserepair/enterpriserepair?param='+e.currentTarget.dataset.id+'&role=1'+'&pass=22',
    })
  },
  //修改报修单(学校响应之前)
  SchoolEdit:function(e){
    wx.navigateTo({
      url: '../schoolrepair/schoolrepair?param='+e.currentTarget.dataset.id+'&role=1',
    })
  },
  //修改报修单(校长审批之前)
  EntrantyEdit:function(e){
     wx.navigateTo({
      url: '../enterpriserepair/enterpriserepair?param='+e.currentTarget.dataset.id+'&role=1',
    })
  },
  //修改报修单(企业退回)
  editbypass:function(e){
     wx.navigateTo({
      url: '../enterpriserepair/enterpriserepair?param='+e.currentTarget.dataset.id+'&role=1'+'&pass=23',
    })
  }
})