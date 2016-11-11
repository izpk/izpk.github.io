define(["jquery","common","layer"],function(e,s,t){"user strict";var o={token:{url:"/api/v2.1/getToken",data:s.product.pcWeb},login:{url:"/api/v2.1/login",type:"post"},logout:{url:"/api/v2.1/logout"},loginloglist:{url:"/api/v3/user/loginloglist"},getExamDate:{url:"/api/v2.1/study/getExamDate"},"message-list":{url:"/api/v2/message/list"},mycount:{url:"/api/studytools/mycount/v2.1"},capabilityAssessment:{url:"/api/v2/capabilityAssessment"},"slide-list":{url:"/api/v2.1/slide/list"},"exam-list":{url:"/api/v2/exam/list"},learningcourse:{url:"/api/v2.1/learning/learningcourse"},noActivecourse:{url:"/api/v2.1/learning/noActivecourse"},expirationcourse:{url:"/api/v2.1/learning/expirationcourse"},courseBaseInfo:{url:"/api/v2.1/course/courseBaseInfo",type:"POST"},courseDetail:{url:"/api/v2.1/course/courseDetail"},getTasksProgress:{url:"/api/v2/study/getTasksProgress"},course_info:{url:"/api/v2/course/info"},coursestatus:{url:"/api/v2.1/study/coursestatus"},handout:{url:"/api/v2/course/handout"},bbslist:{url:"/api/studytools/bbslist/v1.0"},bbsdetail:{url:"/api/studytools/bbsdetail/v1.0"},bbslist_myJoin:{url:"/api/studytools/bbslist_myJoin/v1.0"},bbs_praise:{url:"/api/studytools/bbs_praise/v1.0"},bbsreply:{url:"/api/studytools/bbsreply/v1.0",type:"POST"},bbssave:{url:"/api/studytools/bbssave/v1.0",type:"POST"},bbs_del:{url:"/api/studytools/bbs_del/v1.0"},"course-node":{url:"/api/v2/course/node"},nodelist:{url:"/api/studytools/nodelist/v2.1"},nodedetail:{url:"/api/studytools/nodedetail/v2.1"},"node-list":{url:"/api/v2/note/list"},nodesave:{url:"/api/studytools/nodesave/v2.1",type:"POST"},coursechapternodecount:{url:"/api/studytools/coursechapternodecount/v2.1",type:"POST"},myallcoursechapternodecount:{url:"/api/studytools/myallcoursechapternodecount/v2.1",type:"POST"},delmycontent:{url:"/api/studytools/delmycontent/v2.1"},ad_discuss:{url:"/api/studytools/ad_discuss/v2.1"},timeList:{url:"/api/v2/exam/timeList"},active:{url:"/api/v2/course/active"},bbs_forumlistShow:{url:"/api/studytools/bbs_forumlistShow/v1.0"},addLMG:{url:"/api/v2/lessonMessage/addLMG",type:"POST"},version:{url:"/api/course/courselist/version/v3/"},exercisePointCountCache:{url:"/api/extendapi/examen/get_exercise_point_count_cache",type:"POST"},exerciseKnowledgeMemberStatus:{url:"/api/userAction/examen/get_exercise_knowledge_member_status",type:"POST"},userKnowledgePointExerciseList:{url:"/api/userAction/examen/get_user_knowledge_point_exercise_list"},setMemberExerciseLog:{url:"/api/userAction/examen/setMemberExerciseState"},getNidExerciseDetail:{url:"/api/teachsource/examen/getNidExerciseDetail"}};return{ajax:function(r){var i="",a="get",u="";if(r.url)i=r.url;else{var l=o[r.server],n=r.hostName?r.hostName:s.host.name;r.hostName&&(n=r.hostName),i=n+l.url+"?verTT="+(new Date).getTime(),a=l.type,u=l.data||r.data}e.ajax({url:i,type:a,data:u,success:function(e){"string"==typeof e&&(e=JSON.parse(e)),"nologin"==e.msg?t.msg("Sorry~ 您的账号在其它地方登录",function(){window.location.href=CAICUI.Common.loginLink}):"success"==e.state?r.done(e):"error"==e.state||"error"==e.msg?r.fail(e):r.fail(e)},error:function(e){}})},promise:function(t){var r=o[t.server],i=r.hostName?r.hostName:s.host.name,a=i+r.url+"?verTT="+(new Date).getTime(),u=r.type||"get",l=r.data||t.data,n=new Promise(function(s,t){e.ajax({url:a,type:u,data:l,success:function(e){"string"==typeof e&&(e=JSON.parse(e)),"nologin"==e.msg?window.location.href=CAICUI.Common.loginLink:"success"==e.state?s(e):t("error"==e.state||"error"==e.msg?statusText:statusText)},error:function(e){t(statusText)}})});return n}}});