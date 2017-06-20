// junfeipage/working/repairaddr/repairaddr.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
let app = getApp();
function getlist(that) {
    if (that.data.warranty == 0) {
        var param = {
            dcId: that.data.dcId,
            sessionId: wx.getStorageSync('sessionid'),
            key: that.data.inputVal
        }
        requiredata.getrepcompany(requireUrl.repserviceUrl, param, function (res) {
            console.log(res)

            if (res.data.flag == 1) {
                console.log(res.data.data.rows)
                that.setData({
                    list: JSON.parse(res.data.data.rows)
                })
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
    } else if (that.data.warranty == 1) {
        var param = {
            sessionid: wx.getStorageSync('sessionid'),
            key: that.data.inputVal
        };
        requiredata.getrepcompany(requireUrl.repcompanyUrl, param, function (res) {
            console.log(res)
            if (res.data.flag == 1) {
                console.log(res.data.data.rows)
                that.setData({
                    list: JSON.parse(res.data.data.rows)
                })
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

Page({
    data: {
        inputShowed: false,
        inputVal: "",
        list: '',
        warranty: '',
        dcId: '' //分类Id
    },
    onLoad: function (options) {
        console.log(options);
        new app.WeToast();
        var that = this;
        that.setData({
            warranty: options.param,
            dcId: options.id
        })
        getlist(that);
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
    chooseCompany: function (e) {
        var compName = e.currentTarget.dataset.compname;
        wx.setStorageSync('compName', compName);
        wx.setStorageSync('compID', e.currentTarget.dataset.id);
        wx.setStorageSync('tel', e.currentTarget.dataset.tel)
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面       
        })
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    searchconfirm: function (e) {
        var that = this;
        var sessionId = wx.getStorageSync('sessionid');//本地取存储的sessionID
        this.setData({
            inputVal: e.detail.value
        });
        getlist(that);
    }
})