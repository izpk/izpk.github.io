define(["jquery","jqueryMD5","storage","location","config"],function(e,o,a,t,r){var n={ajax:function(o){var t="";t=o.pathname?o.pathname:"2"==o.version?r.host.name+"/api/v2/"+o.server:"2.1"==o.version?r.host.name+"/api/"+o.server+"/v2.1":r.host.name+"/api/v2.1/"+o.server;jQuery.support.cors=!0,WINAPI.log(t),WINAPI.log(o.data);var n=e.md5(t+JSON.stringify(o.data));e.ajax({url:t+"?verTT="+(new Date).getTime(),type:o.type||"get",data:o.data||"",success:function(t){"string"==typeof t&&(t=JSON.parse(t)),"nologin"==t.msg?(window.localStorage.clear(),e.removeCookie("User",{path:"/"}),e.removeCookie("loginInfo",{path:"/"}),e.removeCookie("Token",{path:"/"}),e.removeCookie("token",{path:"/",expires:-1}),CAICUI.isNav=!0,window.location.href=CAICUI.Common.loginLink):"success"==t.state?(WINAPI.log("网络成功:"+n),a.setsingle(n,t),o.done(t)):"error"==t.state?o.fail(t):o.fail(t)},error:function(t){var r=a.get(n);return r?void o.done(r):("string"==typeof t&&(t=JSON.parse(t)),"login"==o.server?void("success"==t.state?o.done(t):"error"==t.state&&o.fail(t)):void("nologin"==t.msg?(window.localStorage.clear(),e.removeCookie("User",{path:"/"}),e.removeCookie("loginInfo",{path:"/"}),e.removeCookie("Token",{path:"/"}),e.removeCookie("token",{path:"/",expires:-1}),CAICUI.isNav=!0,window.location.href=CAICUI.Common.loginLink):"success"==t.state?o.done(t):"error"==t.state?o.done({data:[],msg:"",pageNo:1,pageSize:999,state:"success",totalCount:0}):o.fail(t)))}})}};return{ajax:n.ajax}});