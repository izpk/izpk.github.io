define([],function(){
	'user strict';
	return {
		"ENTER_KEY" : "13",
		"token": "",
		"loginLink" : "http://www.caicui.com/login?loginRedirectUrl="+window.location.href+"#hide",
		//"loginLink" : "http://www.caicui.com/page/login.jsp?loginRedirectUrl=http://www.caicui.com/studycenter/#studycenterIndex",
		"loginLinkTest" : "#studycenterLogin",
		"host": {
			//"name" : "http://192.168.10.112:8081/",
			//"name": "http://test.caicui.com",
			"name": "http://api.caicui.com",
			"static" : "http://static.caicui.com/",
			"img" : "http://img.caicui.com",
			"imgAddress" : "http://static.caicui.com/",
			"infoAddress" : "http://www.caicui.com/",
			"IPLocation" : "http://www.caicui.com/api/v2/"
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