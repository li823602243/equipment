//提交审核中的上传三个附件
var postacceptimgUrl = "https://wxopen.cneefix.com/api/project/postacceptanceattachment"

//tips提示
function tips(that, title, duration, url) {
  that.wetoast.toast({
    title: title,
    duration: duration,
    success(data) {
      wx.switchTab({
        url: url,
      })
    },
    fail(data) {

    }
  })
}

//获取opt状态
function getOrderOptType(opt) {
  var strDesc = "";
  switch (opt) {
    case 10:
      strDesc = "校内报修";
      break;
    case 20:
      strDesc = "学校响应";
      break;
    case 22:
      strDesc = "校内填写维修单";
      break;
    case 24:
      strDesc = "报修单修改";
      break;
    case 25:
      strDesc = "直报校外";
      break;
    case 27:
      strDesc = "转报校外";
      break;
    case 30:
      strDesc = "校长审批";
      break;
    case 35:
      strDesc = "企业响应";
      break;
    case 40:
      strDesc = "企业退回";
      break;
    case 45:
      strDesc = "企业派工";
      break;
    case 50:
      strDesc = "填写维修单";
      break;
    case 60:
      strDesc = "学校验收";
      break;
    case 70:
      strDesc = "区县审核";
      break;
    case 80:
      strDesc = "维修评价";
      break;
    case 100:
      strDesc = "撰写维修心得";
      break;
  }
  return strDesc;
}

// 获取状态
function getStatuz(statuz, compyname) {
  switch (statuz) {
    case 10:
      return "等待学校响应";
      break;
    case 20:
      return "学校自修中";
      break;
    case 21:
      return "等待校长审批";
      break;
    case 22:
      return "校长审批不通过";
      break;
    case 23:
      return "企业退回";
      break;
    case 40:
      return "等待企业响应";
      break;
    case 45:
      return "等待企业派工";
      break;
    case 50:
      return "企业维修中";
      break;
    case 60:
      return "等待学校验收";
      break;
    case 61:
      return "学校验收不通过";
      break;
    case 70:
      return "等待区县审核";
      break;
    case 71:
      return "区县审核不通过";
      break;
    case 90:
      return "已评价";
      break;
    case 80:
      if (compyname == '') {
        return "等待评价";
      } else {
        return "维修完成";
      }
      break;
  }
}


//项目状态
function getproStatuz(item) {
  switch (item) {
    case 1:
      return "等待处理";
      break;
    case 2:
      return "等待确认";
      break;
    case 3:
      return "整改通过";
      break;
    case 4:
      return "整改不通过";
      break;
  }
}

//概况状态
function getprofileStatuz(item) {
  switch (item) {
    case 2:
      return "项目实施";
      break;
    case 3:
      return "待验收";
      break;
    case 4:
      return "验收通过";
      break;
    case 41:
      return "验收不通过";
      break;
    case 11:
      return "等待审核";
      break;
    case 12:
      return "审核不通过";
      break;
    case 121:
      return "审核通过";
      break;
  }
}

//超时
function timeout(that, url) {
  that.wetoast.toast({
    title: '登录超时',
    duration: 1000,
    success(data) {
      wx.redirectTo({
        url: url
      })
    },
    fail(data) {

    }
  })
}
//跳转主页面
function indexHref(that, title, url) {
  that.wetoast.toast({
    title: title,
    duration: 1000,
    success(data) {
      wx.switchTab({
        url: url,
      })
    },
    fail(data) {

    }
  })
}

//ajax请求方法

var request_data = {
  // 点击登录接口
  onUser: function (userUrl, data, success, fail) {
    wx.request({
      url: userUrl,
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //初始化微信登陆接口
  onLogin: function (onloginUrl, code, success, fail) {
    wx.request({
      url: onloginUrl,
      method: "GET",
      data: {
        code: code
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //上传图片
  uploadImg: function (filePaths, i, uploadImgdata, formdata, successBack, failBack) {
    wx.uploadFile({
      url: uploadImgdata.uploadImgUrl,
      filePath: filePaths[i],
      name: 'file',
      formData: formdata,
      success: (res) => {
        console.log("进来了", res.data)

        if (JSON.parse(res.data).flag == 1) {
          uploadImgdata.successUp++;
          console.log("111111111", res.data);
        } else if (JSON.parse(res.data).flag == "-1") {
          uploadImgdata.successUp = "-1"
        }
      },
      fail: (res) => {
        uploadImgdata.failUp++;
        console.log(res)
      },
      complete: () => {
        console.log(formdata);
        i++;
        if (i == uploadImgdata.length) {
          console.log(uploadImgdata.successUp, uploadImgdata.failUp)
          if (uploadImgdata.successUp == uploadImgdata.length && uploadImgdata.successUp != 0) {
            successBack();
          } else {
            failBack();
          }
        }
        else {  //递归调用上传图片函数
          this.uploadImg(filePaths, i, uploadImgdata, formdata, successBack, failBack);
        }

      }
    });
  },
  //选择项目编号
  chooseproNum: function (projectnumUrl, key, sessionId, success, fail) {
    wx.request({
      url: projectnumUrl,
      data: {
        key: key,
        sessionId: sessionId,
        isAll: "true"
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //workindex
  workindex: function (workindexUrl, sessionId, success, fail) {
    wx.request({
      url: workindexUrl,
      data: {
        sessionId: sessionId
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //选择学校名称
  chooseSchool: function (chooseSchoolUrl, chooseSchooldata, success, fail) {
    wx.request({
      url: chooseSchoolUrl,
      data: chooseSchooldata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //附件列表
  getattachmentlist: function (getattachmentlistUrl, getattachmentlistdata, success, fail) {
    wx.request({
      url: getattachmentlistUrl,
      data: getattachmentlistdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });

  },
  //上传内容
  getattachment: function (getattachmentUrl, getattachmentdata, success, fail) {
    wx.request({
      url: getattachmentUrl,
      data: getattachmentdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取流程名称
  getprojectsection: function (getprojectsectionUrl, success, fail) {
    wx.request({
      url: getprojectsectionUrl,
      data: {
        type: 6002
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //根据名称获取流程节点
  getprojectitemsection: function (getprojectitemsectionUrl, getprojectitemsectiondata, success, fail) {
    wx.request({
      url: getprojectitemsectionUrl,
      data: getprojectitemsectiondata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //保存节点信息
  sectionsave: function (sectionsaveUrl, sectionsavedata, success, fail) {
    wx.request({
      url: sectionsaveUrl,
      data: sectionsavedata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取需要二维码绑定的设备名称
  getschoolequipmentlist: function (getschoolequipmentlistUrl, getschoolequipmentlistdata, success, fail) {
    wx.request({
      url: getschoolequipmentlistUrl,
      data: getschoolequipmentlistdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //二维码绑定中的选择地址
  getBarcodeAddress: function (getBarcodeAddressUrl, getBarcodeAddressdata, success, fail) {
    wx.request({
      url: getBarcodeAddressUrl,
      data: getBarcodeAddressdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //二维码绑定
  bindsnocompany: function (bindsnocompanyUrl, bindsnocompanydata, success, fail) {
    wx.request({
      url: bindsnocompanyUrl,
      method: "POST",
      data: bindsnocompanydata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取自验信息
  getprojectsummary: function (getprojectsummaryUrl, getprojectsummarydata, success, fail) {
    wx.request({
      url: getprojectsummaryUrl,
      data: getprojectsummarydata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //申请验收
  applyacceptance: function (applyacceptanceUrl, applyacceptancedata, success, fail) {
    wx.request({
      url: applyacceptanceUrl,
      method: "POST",
      data: applyacceptancedata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //项目概况  
  getprojectitemlist: function (getprojectitemlistUrl, getprojectitemlistdata, success, fail) {
    wx.request({
      url: getprojectitemlistUrl,
      method: "POST",
      data: getprojectitemlistdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  // 获取设备树
  getEquipTree: function (getEquipTreeUrl, param, success, fail) {
    wx.request({
      url: getEquipTreeUrl,
      data: {
        sessionId: param
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  // 获取地址
  getAddress: function (getAddressUrl, param, success, fail) {
    wx.request({
      url: getAddressUrl,
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取设备供应商
  getrepcompany: function (repcompanyUrl, param, success, fail) {
    wx.request({
      url: repcompanyUrl,
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  // 校内报修
  schoolrp: function (schoolresUrl, param, success, fail) {
    wx.request({
      url: schoolresUrl,
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //维修相应列表
  getmtreslist: function (mtresUrl, param, success, fail) {
    wx.request({
      url: mtresUrl,
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  getbusmtreslist: function (bussreslistUrl, param, success, fail) {
    wx.request({
      url: bussreslistUrl,
      method: 'GET',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //维修响应详情
  getresDetail: function (mtresdtUrl, param, success, fail) {
    wx.request({
      url: mtresdtUrl,
      method: 'GET',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //维修派工列表
  getbusdispatchlist: function (bussreslistUrl, param, success, fail) {
    wx.request({
      url: bussreslistUrl,
      method: 'GET',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //本企业维修人列表
  getBussreplist: function (bussrepUrl, param, success, fail) {
    wx.request({
      url: bussrepUrl,
      method: 'GET',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //待审批列表
  getmtapproval: function (mtapprovalUrl, param, success, fail) {
    wx.request({
      url: mtapprovalUrl,
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //区县待审核列表
  getcountyapproval: function (countyapprovalUrl, param, success, fail) {
    wx.request({
      url: countyapprovalUrl,
      method: 'GET',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },

  //我的维修单列表
  getmtreplist: function (schoolrepUrl, param, success, fail) {
    wx.request({
      url: schoolrepUrl,
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //我的报修单列表
  gettorplist: function (mytorplistUrl, param, success, fail) {
    wx.request({
      url: mytorplistUrl,
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //待验收列表
  getinspactionlist: function (repairviewUrl, param, success, fail) {
    wx.request({
      url: repairviewUrl,
      method: 'GET',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //删除报修单
  delmytorepair: function (delmytorepairUrl, param, success, fail) {
    wx.request({
      url: delmytorepairUrl,
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //报修单转报企业
  transforCop: function (transforCopUrl, param, success, fail) {
    wx.request({
      url: transforCopUrl,
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取设备品牌
  getmtBrand: function (getmtBrandUrl, param, success, fail) {
    wx.request({
      url: getmtBrandUrl,
      method: 'GET',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //校内报修单修改
  getEditschool: function (editSchoolUrl, param, success, fail) {
    wx.request({
      url: editSchoolUrl,
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取退回信息
  getpassInfo: function (getpassinfoUrl, param, success, fail) {
    wx.request({
      url: getpassinfoUrl,
      method: 'GET',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //维修查看列表
  getmtlist: function (url, param, success, fail) {
    wx.request({
      url: url,
      method: 'GET',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取上门费信息
  gethomefeeinfo: function (url, param, success, fail) {
    wx.request({
      url: url,
      method: 'GET',
      data: param,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //绑定账号列表
  getallaccount: function (getallaccountUrl, sessionId, loginName, success, fail) {
    wx.request({
      url: getallaccountUrl,
      data: {
        sessionId: sessionId,
        loginName: loginName
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //切换账号
  switchaccount: function (switchaccountUrl, switchaccountdata, success, fail) {
    wx.request({
      url: switchaccountUrl,
      method: 'POST',
      data: switchaccountdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //退出当前账号
  loginout: function (loginoutUrl, loginoutdata, success, fail) {
    wx.request({
      url: loginoutUrl,
      method: 'POST',
      data: loginoutdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //取消绑定账号
  cancelbindaccount: function (cancelbindaccountUrl, cancelbindaccountdata, success, fail) {
    wx.request({
      url: cancelbindaccountUrl,
      method: 'POST',
      data: cancelbindaccountdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //项目概况中对应状态的数量
  numstatistics: function (numstatisticsUrl, sessionid, success, fail) {
    wx.request({
      url: numstatisticsUrl,
      method: 'POST',
      data: { SessionId: sessionid },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //流程所有节点
  getprojectitemsections: function (getprojectitemsectionsUrl, getprojectitemsectionsdata, success, fail) {
    wx.request({
      url: getprojectitemsectionsUrl,
      data: getprojectitemsectionsdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取待验收列表数据
  getschoolprojectlist: function (getschoolprojectlistUrl, getschoolprojectlistdata, success, fail) {
    wx.request({
      url: getschoolprojectlistUrl,
      method: 'POST',
      data: getschoolprojectlistdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //项目列表
  getprojectlist: function (getprojectlistUrl, getprojectlistdata, success, fail) {
    wx.request({
      url: getprojectlistUrl,
      data: getprojectlistdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //学校评价
  schoolevaluate: function (schoolevaluateUrl, schoolevaluatedata, success, fail) {
    wx.request({
      url: schoolevaluateUrl,
      method: 'POST',
      data: schoolevaluatedata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //上传提交审核中的三个附件
  postacceptimg: function (filePaths, category, schoolid, successUp, failUp, i, length, successBack, failBack) {
    wx.uploadFile({
      url: postacceptimgUrl,
      filePath: filePaths[i],
      name: 'file',
      formData: {
        ProjectItemId: schoolid,
        Category: category,
        SessionId: wx.getStorageSync('sessionid')

      },
      success: (res) => {
        if (JSON.parse(res.data).flag == 1) {
          successUp++;
          console.log("成功", res.data);
        } else if (JSON.parse(res.data).flag == "-1") {
          successUp = "-1";
        } else {
          successUp = "-2";
        }


      },
      fail: (res) => {
        failUp++;
        console.log(res)
      },
      complete: () => {
        i++;
        if (i == length) {
          if (successUp == length && successUp != 0) {
            successBack();
          } else {
            failBack();
          }
          console.log(successUp, failUp)
        }
        else {  //递归调用上传图片函数
          this.postacceptimg(filePaths, category, schoolid, successUp, failUp, i, length);
        }

      },
    });
  },
  //企业提交审核
  projectitemaduit: function (projectitemaduitUrl, projectitemaduitdata, success, fail) {
    wx.request({
      url: projectitemaduitUrl,
      method: "POST",
      data: projectitemaduitdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //项目审核
  projectreview: function (projectreviewUrl, projectreviewdata, success, fail) {
    wx.request({
      url: projectreviewUrl,
      method: "POST",
      data: projectreviewdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //项目整改列表
  projectrec: function (projectrecUrl, projectrecdata, success, fail) {
    wx.request({
      url: projectrecUrl,
      data: projectrecdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //企业反馈信息
  projectrecinfo: function (projectrecinfoUrl, projectrecinfodata, success, fail) {
    wx.request({
      url: projectrecinfoUrl,
      data: projectrecinfodata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //整改选择项目编号
  getprojectcodelist: function (getprojectcodelistUrl, getprojectcodelistdata, success, fail) {
    wx.request({
      url: getprojectcodelistUrl,
      data: getprojectcodelistdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //学校确认整改意见
  confirmationc: function (confirmationcUrl, confirmationcdata, success, fail) {
    wx.request({
      url: confirmationcUrl,
      data: confirmationcdata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //下载附件
  downLoadImg: function (downloadimgUrl, success) {
    wx.downloadFile({
      url: 'https://wx.demo.cneefix.com' + downloadimgUrl,
      success: function (res) {
        success(res);
      }
    })
  },
  //获取分项商务信息
  commerceinfo: function (commerceinfoUrl, commerceinfodata, success, fail) {
    wx.request({
      url: commerceinfoUrl,
      data: commerceinfodata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取学校角色中的商务信息
  getprojectinfo: function (getprojectinfoUrl, getprojectinfodata, success, fail) {
    wx.request({
      url: getprojectinfoUrl,
      data: getprojectinfodata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //区县，市级的学校列表信息
  getschoolarea: function (getschoolareaUrl, getschoolareadata, success, fail) {
    wx.request({
      url: getschoolareaUrl,
      data: getschoolareadata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //巡检选择列表
  getprorout: function (getproroutUrl, getproroutdata, success, fail) {
    wx.request({
      url: getproroutUrl,
      data: getproroutdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //巡检列表
  getproroutlist: function (getproroutlistUrl, getproroutlistdata, success, fail) {
    wx.request({
      url: getproroutlistUrl,
      data: getproroutlistdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //巡检详情
  getproroutdetail: function (getproroutdetailUrl, getproroutdetaildata, success, fail) {
    wx.request({
      url: getproroutdetailUrl,
      data: getproroutdetaildata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //监管中项目工期详情
  prodate: function (prodateUrl, prodatedata, success, fail) {
    wx.request({
      url: prodateUrl,
      data: prodatedata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  prorecorddetail: function (prorecorddetailUrl, prorecorddetaildata, success, fail) {
    wx.request({
      url: prorecorddetailUrl,
      data: prorecorddetaildata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //根据二维码编码获取设备信息
  getsnoinfo: function (getsnoinfoUrl, getsnoinfodata, success, fail) {
    wx.request({
      url: getsnoinfoUrl,
      data: getsnoinfodata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  getbarcodesnoinfo: function (getbarcodesnoinfoUrl, getbarcodesnoinfodata, success, fail) {
    wx.request({
      url: getbarcodesnoinfoUrl,
      data: getbarcodesnoinfodata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //地址修改
  repeataddr: function (repeataddrUrl, repeataddrdata, success, fail) {
    wx.request({
      url: repeataddrUrl,
      data: repeataddrdata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //借出列表
  confirmList: function (confirmUrl, confirmdata, success, fail) {
    wx.request({
      url: confirmUrl,
      data: confirmdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //借出详情
  confirmdetail: function (confirmdetailUrl, confirmdetaildata, success, fail) {
    wx.request({
      url: confirmdetailUrl,
      data: confirmdetaildata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //借用确认
  submitconfirm: function (submitconfirmUrl, submitconfirmdata, success, fail) {
    wx.request({
      url: submitconfirmUrl,
      data: submitconfirmdata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //删除附件
  deletefile: function (deletefileUrl, deletefiledata, success, fail) {
    wx.request({
      url: deletefileUrl,
      data: deletefiledata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //取消二维码绑定
  cancelbind: function (cancelbindUrl, cancelbinddata, success, fail) {
    wx.request({
      url: cancelbindUrl,
      data: cancelbinddata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //二维码列表
  getsnoinfosList: function (getsnoinfosListUrl, getsnoinfosListdata, success, fail) {
    wx.request({
      url: getsnoinfosListUrl,
      data: getsnoinfosListdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //企业查询列表
  toolscompany: function (toolscompanyUrl, toolscompanydata, success, fail) {
    wx.request({
      url: toolscompanyUrl,
      data: toolscompanydata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //学校查询列表
  toolsschool: function (toolsschoolUrl, toolsschooldata, success, fail) {
    wx.request({
      url: toolsschoolUrl,
      data: toolsschooldata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  uploaduserinfo: function (uploaduserinfoUrl, uploaduserinfodata, success, fail) {
    wx.request({
      url: uploaduserinfoUrl,
      data: uploaduserinfodata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取项目详情
  getprodetail: function (getprodetailUrl, getprodetaildata, success, fail) {
    wx.request({
      url: getprodetailUrl,
      data: getprodetaildata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取巡检总项目
  getinspectionlist: function (getinspectionlistUrl, getinspectionlistdata, success, fail) {
    wx.request({
      url: getinspectionlistUrl,
      data: getinspectionlistdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  getmessagelist: function (getmessagelistUrl, getmessagelistdata, success, fail) {
    wx.request({
      url: getmessagelistUrl,
      data: getmessagelistdata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  deletemessage: function (deletemessageUrl, deletemessagedata, success, fail) {
    wx.request({
      url: deletemessageUrl,
      data: deletemessagedata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  setread: function (setreadUrl, setreaddata, success, fail) {
    wx.request({
      url: setreadUrl,
      data: setreaddata,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取用户状态
  getloginstatuz: function (getloginstatuzUrl, getloginstatuzdata, success, fail) {
    wx.request({
      url: getloginstatuzUrl,
      data: getloginstatuzdata,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //项目流程图
  getprojectitemfulfilment: function (url, param, success, fail) {
    wx.request({
      url: url,
      data: param,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取服务费信息
  getserviceFee:function(url, param, success, fail){
     wx.request({
      url: url,
      data: param,
      method: "GET",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  },
  //获取配件费信息
  getpartFee:function(url, param, success, fail){
     wx.request({
      url: url,
      data: param,
      method: "GET",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  }

};

module.exports = {
  request_data: request_data,
  getStatuz: getStatuz,
  getproStatuz: getproStatuz,
  getprofileStatuz: getprofileStatuz,
  timeout: timeout,
  indexHref: indexHref,
  tips: tips,
  getOrderOptType: getOrderOptType
}
