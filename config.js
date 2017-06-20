//配置文件
var host = "https://wxopen.cneefix.com";
var config = {
  host,
  //用code换取openId
  openIdUrl: `${host}/api/wxlogin/loginbycode`,
  //点击登录，登录接口
  userUrl: `${host}/api/wxlogin/loginbyaccount`,
  //选择项目编号
  projectnumUrl: `${host}/api/project/getprojectforcompany`,
  //work主页面
  workindexUrl: `${host}/api/user/getmenu`,
  //选择学校名称
  chooseSchoolUrl: `${host}/api/project/getschoolforcompany`,
  //上传内容节点
  getattachmentUrl: `${host}/api/project/getattachmentitem`,
  //获取附件列表
  getattachmentlistUrl: `${host}/api/project/getattachments`,
  //已绑定账号列表
  getallaccountUrl: `${host}/api/wxlogin/getallaccount`,
  //获取项目流程名称
  getprojectsectionUrl: `${host}/api/project/getprojectsection`
  ,
  //根据名称获取节点信息
  getprojectitemsectionUrl: `${host}/api/project/getprojectitemsection`
  ,
  //保存流程节点信息
  sectionsaveUrl: `${host}/api/project/projectitemsectionsave`
  ,
  //需要绑定的二维码设备名称
  getschoolequipmentlistUrl: `${host}/api/project/getschoolequipmentlist`,
  //获取自验信息
  getprojectsummaryUrl: `${host}/api/project/getprojectsummary`
  ,
  //获取地点
  getAddressUrl: `${host}/api/address/addressfind`,
  //二维码绑定选择地点
  getBarcodeAddressUrl: `${host}/api/address/getschooladdress`,
  bindsnocompanyUrl: `${host}/api/project/bindsnocompany`,
  // 申请验收
  applyacceptanceUrl: `${host}/api/project/applyacceptance`,
  //项目概况
  getprojectitemlistUrl: `${host}/api/project/getprojectitemlist`,
  //  设备树
  getEquipTreeUrl: `${host}/api/repair/unitgroupdivisionfind`,
  //校内报修提交
  schoolrpUrl: `${host}/api/repair/repairneedaddin`,
  //我的报修单列表
  mytorplistUrl: `${host}/api/repair/repairneedfindperson`,
  //维修相应列表
  mtresUrl: `${host}/api/repair/repairneedfindunit`,
  //报修单，维修单详情
  mtresdtUrl: `${host}/api/repair/repairneedgetbyid`,
  //校内维修单响应
  schoolresUrl: `${host}/api/repair/repairneedresponsein`,
  //校内我的维修单列表
  schoolrepUrl: `${host}/api/repair/repairneedfindorderlist`,
  //撤销响应校内
  undoresUrl: `${host}/api/repair/repairorderresponseback`,
  //获取设备供应商
  repcompanyUrl: `${host}/api/repair/repairneedgetsupplier`,
  //获取设备服务商
  repserviceUrl: `${host}/api/repair/repairneedgetservercompany`,
  //校内直报校外
  schtorpUrl: `${host}/api/repair/repairneedaddout`,
  //维修审批列表
  mtapprovalUrl: `${host}/api/repair/repairneedfindnoassess`,
  //校长审批
  masterapproUrl: `${host}/api/repair/repairneedauditpass`,
  //企业维修响应派工列表
  bussreslistUrl: `${host}/api/repair/repairneedfindforcompany`,
  //企业维修响应
  busresUrl: `${host}/api/repair/repairneedaccept`,
  //报修单退回
  backmtUrl: `${host}/api/repair/repairneedgoback`,
  //获取单位维修人
  bussrepUrl: `${host}/api/repair/repairneedgetrepairmanlist`,
  //企业派工
  bussdispatchUrl: `${host}/api/repair/repairneeddispatch`,
  bussmyrepUrl: `${host}/api/repair/repairneedfindforcompanyorder`,
  //维修查看(验收列表)
  repairviewUrl: `${host}/api/repair/repairneedselect`,
  //企业报修单验收
  busrepratingsUrl: `${host}/api/repair/repairneedassert`,
  //报修单评价
  schoolratingsUrl: `${host}/api/repair/evaluationadd`,
  //区县审核列表
  countyapprovalUrl: `${host}/api/repair/repairneedfindnotforcounty`,
  //区县审核列表
  countymasterapprovalUrl: `${host}/api/repair/repairordercountyaudit`,
  //区县维修查看列表
  countymtviewUrl: `${host}/api/repair/srepairneedfindunit`,
  //维修查看统计
  mtviewNumUrl: `${host}/api/repair/repairneedstatistics`,
  //维修单填写提交
  myrepairsubmitUrl: `${host}/api/repair/repairorderadd`,
  //删除报修单
  delmytorepairUrl: `${host}/api/repair/repairneeddel`,
  //报修单日志流水
  mytorepairRecordUrl: `${host}/api/repair/repairlogneedfindbyid`,
  //维修单转报企业
  transforCopUrl: `${host}/api/repair/repairneededitout`,
  //维修项目列表
  mtnameUrl: `${host}/api/repair/repairneedselectservicefee`,


  //退出当前账号
  loginoutUrl: `${host}/api/wxlogin/loginout`,
  //切换账号
  switchaccountUrl: `${host}/api/wxlogin/switchaccount`,
  //取消账号绑定
  cancelbindaccountUrl: `${host}/api/wxlogin/cancelbind`,

  //项目概况对应状体的数量
  numstatisticsUrl: `${host}/api/projectview/getprojectnumstatistics`,
  //所有流程节点
  getprojectitemsectionsUrl: `${host}/api/project/getprojectitemsections`,
  //获取项目列表
  getschoolprojectlistUrl: `${host}/api/projectview/getschoolprojectlist`,
  //提交验收评价
  schoolevaluateUrl: `${host}/api/project/schoolacceptanceevaluation`,
  //企业提交审核
  projectitemaduitUrl: `${host}/api/project/projectitemaduit`,
  //项目审核
  projectreviewUrl: `${host}/api/project/projectreview`,
  //项目整改列表
  projectrecUrl: `${host}/api/projectcorrect/getprojectrectificationlist`,
  //整改反馈返回信息
  projectrecinfoUrl: `${host}/api/projectcorrect/getrectificationlistbyid`,
  //企业提交整改反馈书
  rectificationUrl: `${host}/api/projectcorrect/postprojectrectificationbycompany`,
  //过程材料上传图片
  uploadUrl: `${host}/api/project/postimplementattachment`,
  //整改里面选择项目编号
  codelistUrl: `${host}/api/projectcorrect/getprojectcodelist`,
  //提交项目整改
  submitprorecUrl: `${host}/api/projectcorrect/postprojectrectification`,
  //学校确认整改意见
  confirmationcUrl: `${host}/api/projectcorrect/postconfirmation`,
  //获取分项商务信息
  commerceinfoUrl: `${host}/api/projectview/getprojectcommerceinfo`,
  //获取学校角色的商务信息
  getprojectinfoUrl: `${host}/api/projectview/getprojectinfo`,
  //获取区县，市级学校名称
  getschoolareaUrl: `${host}/api/projectcorrect/getschoolbyprojectid`,
  //巡检项目列表
  getproroutlistUrl: `${host}/api/inspection/getinspectionlist`,
  //选择巡检列表
  getproroutUrl: `${host}/api/inspection/getprojectcodeandschool`,
  //获取巡检详情信息
  getproroutdetailUrl: `${host}/api/inspection/getinspectionsingle`,
  //提交巡检信息
  postinspectioninfoUrl: `${host}/api/inspection/postinspectioninfo`,
  //分项中的项目工期
  prodateUrl: `${host}/api/projectview/getprojectdurationinfo`,
  //根据项目编码获取信息
  getsnoinfoUrl: `${host}/api/assets/getsnoinfo`,
  //二维码中的获取信息
  getbarcodesnoinfoUrl: `${host}/api/project/getsnoinfo`,
  //修改二维码存放地址
  repeataddrUrl: `${host}/api/assets/posteditaddressbysno`,
  //资产借出列表
  confirmUrl: `${host}/api/assets/getassetsequipmentborrowlist`,
  //资产借出详情
  confirmdetailUrl: `${host}/api/assets/getassetsequipmentborrowsingle`,
  //借用确认
  submitconfirmUrl: `${host}/api/assets/postassetspersonconfirm`,
  //删除附件
  deletefileUrl: `${host}/api/project/deleteattachmenbyid`,
  //取消绑定
  cancelbindUrl: `${host}/api/project/cancelbindsnocompany`,

  //二维码列表
  getsnoinfosListUrl: `${host}/api/project/getsnoinfos`,
  //项目列表
  getprojectlistUrl: `${host}/api/projectview/getprojectlist`,
  //项目监管巡检记录
  prorecorddetailUrl: `${host}/api/projectview/getprojectinspectioninfo`,
  //工具企业查询
  toolscompanyUrl: `${host}/api/tools/getcompanyinfolist`,
  //工具学校查询
  toolsschoolUrl: `${host}/api/tools/getschoolinfolist`,
  //获取设备品牌
  getmtBrandUrl: `${host}/api/repair/brandfindbydevicecodeid`,
  //校内报修单修改
  editSchoolUrl: `${host}/api/repair/repairneedupdateforschool`,
  //获取退回信息
  getpassinfoUrl: `${host}/api/repair/repairloggetlogbyidstatuz`,
  //配件列表
  getpjlistUrl: `${host}/api/repair/repairneedselectpartsfee`,
  //获取用户信息
  uploaduserinfoUrl: `${host}/api/wxlogin/uploaduserinfo`,

  //获取上门费信息
  gethomefeeUrl: `${host}/api/repair/repairneedgetconfigparm`,
  //获取项目详情
  getprodetailUrl: `${host}/api/projectview/getprojectitemdetail`,
  //获取巡检总项目
  getinspectionlistUrl: `${host}/api/inspection/getinspectionprojectlist`,
  //获取消息列表
  getmessagelistUrl: `${host}/api/msg/getlist`,
  //删除消息
  deletemessageUrl: `${host}/api/msg/delete`,
  //改变消息上的状态红点
  setreadUrl: `${host}/api/msg/setread`,
  //获取用户登录状态
  getloginstatuzUrl: `${host}/api/wxlogin/getloginstatuz`,
  //获取项目完成情况信息列表
  getprodurationinfoUrl: `${host}/api/projectview/getprojectitemfulfilment`,
  //获取服务费信息
  getservicefeeUrl:`${host}/api/repair/repairordergetservicefeeitem`,
  //配件费信息
  getpartfeeUrl:`${host}/api/repair/repairordergetpartsitem`,
};

module.exports = config
