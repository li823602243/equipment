// junfeipage/working/index.js
const requiredata = require('../../utils/util.js').request_data;
const requireUrl = require('../../config.js');
let app = getApp();
Page({
	data: {
		pageItems: [],
		isloading: true,
		norole:false
	},
	onShow: function() {
		var that = this;
		 new app.WeToast();
		var sessionId = wx.getStorageSync('sessionid'); //本地取存储的sessionID
		console.log("idnex页面的sessionid", sessionId);
		requiredata.workindex(requireUrl.workindexUrl, sessionId, function(res) {
			console.log("进了work页面", res);
			if(res.data.flag == -1) {
				wx.redirectTo({
					url: '../../junfeipage/login/index'
				})
			} else if(res.data.flag == "1") {
				that.setData({
					norole: false
				})
				var rows = JSON.parse(res.data.data.rows);
				var list = [];
				rows.map(function(item) {
					if(item.Children.length % 4) {
						var overlength = 4 - item.Children.length % 4;
						console.log(overlength)
						for(var i = 0; i < overlength; i++) {
							list[i] = {
								'SmallIcon': 'images/work/bgwhite.png',
								'FunName': '空 '
							};
							item.Children.push(list[i]);
						}
					}
				})

				that.setData({
					pageItems: rows,
					isloading: false
				})
			} else {
            	that.setData({
					norole: true,
				})

			}

		}, function(res) {
			console.log("失败", res)
		})
	},
	onesweep: function(e) {
		var that = this;
		wx.scanCode({
			success: (res) => {
				console.log("二维码信息", res.result)
				var scancodename = res.result.substr(-8);
				scancodename = scancodename.replace('/', '');
				console.log(scancodename);
				wx.navigateTo({
					url: 'Equipinfo/Equipinfo?param=' + scancodename,
				})
			}
		})
	},
	barcodeinput: function(e) {
		wx.navigateTo({
			url: 'Equipinfo/Equipinfo?param=' + e.detail.value,
		})
	}
})