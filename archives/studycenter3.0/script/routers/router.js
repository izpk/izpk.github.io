define(["jquery","director"],function(e,t){"user strict";var n="",o=function(){n="login"},r=function(){n="studycenterIndex"},i=function(){n="courseStudyIn"},c=function(){n="courseNotActivated"},u=function(){n="courseActivated"},u=function(){n="courseActivated"},a=function(e){n="courseStudy"},d=function(e){n="courseAc"},s=function(e){n="courseNote"},I=function(){n="myExam"},g=function(){n="myNote"},C=function(){n="myAc"},l=function(e,t){return CAICUI.Loading=!0,require(["views/video"],function(n){n.init(e,t)}),!1},f=function(e,t,n){return CAICUI.Loading=!0,require(["views/video"],function(o){o.init(e,t,n)}),!1},v=function(e,t,n,o){return CAICUI.Loading=!0,require(["views/video"],function(r){r.init(e,t,n,o)}),!1},A=function(){n="pagination"},m=function(){n="help"},w={"/studycenterLogin":o,"/login":r,"/studycenterIndex":r,"/studycenterIndex#login":r,"/courseStudyIn":i,"/courseNotActivated":c,"/courseActivated":u,"/courseStudy/:courseId":a,"/courseAc/:courseId":d,"/courseNote/:courseId":s,"/myExam":I,"/myNote":g,"/myAc":C,"/video/:courseId/:chapterId":l,"/video/:courseId/:chapterId/:taskId":f,"/video/:courseId/:chapterId/:taskId/:taskprogress":v,"/pagination":A,"/help":m};return Router(w).configure({before:function(){clearInterval(CAICUI.render.timer),clearTimeout(CAICUI.render.courseIndexTips),clearTimeout(CAICUI.render.intervalTasksProgress),CAICUI.render.$this&&CAICUI.domRender&&CAICUI.render.$this.undelegateEvents();var t=(e.cookie("User"),e.cookie("loginInfo"));return t&&"null"!=t?void(e("#animate").length&&e(".video-icon-task-courselist").trigger("click")):(require(["views/login"],function(e){CAICUI.isNav=!0;var t=new e;t.render()}),!1)},on:function(t){return"studycenterLogin"==n?(CAICUI.isNav=!0,require(["views/login"],function(e){var t=new e,n="#studycenterIndex";t.render(n)}),!1):void require(["views/layout","views/"+n],function(o,r){try{if(CAICUI.domRender){if(CAICUI.NavVideo){var i=new o;i.render(n),CAICUI.iGlobal.loading("#right")}var c=e.cookie("clearTime"),u=new Date;if(c){var a=u.getTime();a>c&&(localStorage.clear(),e.cookie("clearTime",a,{path:"/",expires:36500}))}else{var d=u.getFullYear()+"/"+(+u.getMonth()+1)+"/"+u.getDate()+" ",s=u.getHours(),I="";3>s?(d+="3:00:00",I=new Date(d).getTime()):(d+="24:00:00",I=new Date(d).getTime()+108e5),e.cookie("clearTime",I,{path:"/",expires:36500})}var g=new r;g.render(t)}CAICUI.NavVideo=!0,CAICUI.domRender=!0}catch(C){var l=CAICUI.Storage.getStorage("tryNum");console.log(l),l?(l++,CAICUI.Storage.setStorage({tryNum:l})):CAICUI.Storage.setStorage({tryNum:1}),CAICUI.Storage.getStorage("tryNum")<3?setTimeout(function(){},3e3):(window.localStorage.clear(),window.location.href="http://www.caicui.com")}})},notfound:function(){window.location.href=CAICUI.Common.loginLink}})});