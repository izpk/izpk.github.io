define(["jquery","underscore","backbone","views/courseStudyIn","views/courseNotActivated","views/courseActivated"],function(e,t,r,s,a,c){"use strict";return r.View.extend({el:"body #right",template:t.template(e("#template-myCourse").html()),events:{},render:function(t){var r=e("#template-course").html(),n=CAICUI.iGlobal.getTemplate(r,{courseType:0,courseStatus:t});this.$el.html(n);var u="";switch(t){case"notActivated":u=new a;break;case"activated":u=new c;break;case"studyIn":default:u=new s}e("body #courses").append(u.render().el)}})});