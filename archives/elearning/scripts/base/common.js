define([],function(){
	'user strict';
	return {
		"prefix" : {
			"node" : "/api/userAction/scene/mobileIndex"
		},
		"ENTER_KEY" : "13",
		"token": "",
		"loginLink" : "#studycenterLogin",
		// "loginLink" : window.zbgedu.login,
		"loginLinkTest" : "#studycenterLogin",
		"fileUpload" : "http://api.zbgedu.com/api/base/file/upload/",
		"host": {
			// "location" : "http://192.168.10.29:3080",
			"location" : "http://localhost:3080",
			"name": "http://api.zbgedu.com",
			"nameAction": "http://action.zbgedu.com",
			// "demoName" : "http://demo.caicui.com",
			"demoName" : "http://192.168.10.112:8083",
			"static" : "http://exstatic.zbgedu.com",
			"img" : "http://exstatic.zbgedu.com",
			"imgAddress" : "http://exstatic.zbgedu.com",
			"infoAddress" : "http://www.zbgedu.com/",
			"IPLocation" : "http://www.zbgedu.com/api/v2/"
		},
		"correctionPlaceholder" : "亲爱的同学：非常欢迎你向我们反馈产品的意见建议和体验感受。我们一定会认真调整，及时反馈。根据你的建议，不断完善和优化我们的产品，为你提供更舒适的学习体验。",
		"xneditor" : {
			"acEditor" : "assets/xneditor/ac-editor.html",
			"acNewVideo" : "assets/xneditor/ac-new-video.html",
			"acNew" : "assets/xneditor/ac-new.html",
			"editorDiscussQA" : "assets/xneditor/editor-discussQA.html",
			"editorQuestionQA" : "assets/xneditor/editor-questionQA.html",
			"editor" : "assets/xneditor/editor.html"
		},
		"product": {
			"pcWeb": {
				"appType": "pc",
				"appId": "pcWeb",
				"appKey": "e877000be408a6cb0428e0f584456e03"
			},
			"winExe": {
				"appType": "pcEXE",
				"appId": "pcEXECourse",
				"appKey": "4a9a86b12b9339f66852d9cb58973f6e"
			},
			"iPad": {
				"appType": "iPad",
				"appId": "iPadCourse",
				"appKey": "bd2de9a5d1606fe68083026e911def3a"
			},
			"iPhone": {
				"appType": "iPhone",
				"appId": "iPhoneCourse",
				"appKey": "8f81bf2e06c0f32df06ba7a04cf4bbb7"
			},
			"aPhone": {
				"appType": "aPhone",
				"appId": "aPhoneCourse",
				"appKey": "4b6454d8cf903498116e26b26dd5791a"
			},
			"aPad": {
				"appType": "aPad",
				"appId": "aPadCourse",
				"appKey": "f7e4ebaa872f38db7b548b870c13e79e"
			}
		}
	}
})