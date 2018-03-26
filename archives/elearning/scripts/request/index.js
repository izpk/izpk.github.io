define(['jquery', 'common', 'layer'], function($, Common, layer) {
  'user strict';
  var server = {
    'node-login' : {
      'name' : '登录',
      'isPrefix' : true,
      'path' : '/login',
      'type' : 'post',
      'mock' : '/mock/node-login.json',
      'queryData' : {
        'type' : "pcWeb",
        'username' : "zpk",
        'password' : "123456"
      }
    },
    'node-classCourseList' : {
      'name' : '课程班级列表',
      'isPrefix' : true,
      'path' : '/classCourseList',
      'mock' : '/mock/node-classCourseList.json',
      'notMock' : true,
      'queryData' : {
      }
    },
    'node-classCourseDetail' : {
      'name' : '课程班级详情',
      'isPrefix' : true,
      'path' : '/classCourseDetail',
      'mock' : '/mock/node-classCourseDetail.json',
      'notMock' : true,
      'queryData' : {
        'courseid' : "123456"
      }
    },
    'node-teachingProgram' : {
      'name' : '课程班级教学大纲',
      'isPrefix' : true,
      'path' : '/teachingProgram',
      'mock' : '/mock/node-classCourse-teachingProgram.json',
      'notMock' : true,
      'queryData' : {
        'courseid' : "123456"
      }
    },
    'node-teachingPlan' : {
      'name' : '课程班级教学计划',
      'isPrefix' : true,
      'path' : '/teachingPlan',
      'mock' : '/mock/node-classCourse-teachingPlan.json',
      'notMock' : true,
      'queryData' : {
        'courseid' : "123456"
      }
    },
    'node-examReport' : {
      'name' : '测评成绩报告',
      // 'url': '/api/business/learning/applyrestudylist',
      'isPrefix' : true,
      'path' : '/examReport',
      'mock' : '/mock/examReport.json',
      'notMock' : true,
      'queryData' : {
        'courseid' : "123456"
      }
    },
    
    'token': {
      // 'url' : '/api/v2.1/getToken',
      'url': '/api/zbids/app/gettoken/v1.0/',
      'mock' : '/mock/token.json',
      'data': Common.product.pcWeb
    },
    'login': {
      // 'url' : '/api/v2.1/login',
      'url': '/api/zbids/member/login/v1.0',
      'mock' : '/mock/login.json',
      'type': 'POST'
    },
    'logout': {
        // 'url' : '/api/v2.1/logout'
        'url': '/api/zbids/member/loginout/v1.0',
        'mock' : '/mock/logout.json',
    },
    'member': {
        // 'url' : '/api/v2/member/get'
        'url': '/api/zbids/member/getmemberinfo',
        'mock' : '/mock/getmemberinfo.json',
    },
    'loginloglist': {
        'url': '/api/zbids/member/getLoginLog',
        'mock' : '/mock/node-login.json',
    },
    'getExamDate': {
        'url': '/api/business/coursestudy/getExamDate',
        'mock' : '/mock/getExamDate.json',
    },
    'message-list': {
        'url': '/api/study/message/list/v1.0',
        'mock' : '/mock/message-list.json',
    },
    'updateStatus': {
        'url': '/api/study/message/updateStatus/v1.0',
        'mock' : '/mock/updateStatus.json',
    },
    'mycount': {
        'url': '/api/studytools/mycount/v2.1',
        'mock' : '/mock/mycount.json',
    },
    'slide-list': {
        'url': '/api/article/slide/list',
        'mock' : '/mock/slide-list.json',
    },
    'exam-list': {
        'url': '/api/userAction/examen/get_exercise_knowledge_member_status',
        'mock' : '/mock/exam-list.json',
    },
    'learningcourse': { // 在学
        'url': '/api/business/learning/learningcourse/v1.0',
        'mock' : '/mock/learningcourse.json',
    },
    'noActivecourse': { // 未激活
        'url': '/api/business/learning/noActivecourse/v1.0',
        'mock' : '/mock/noActivecourse.json',
    },
    'expirationcourse': { // 过期
        'url': '/api/business/learning/expirationcourse/v1.0',
        'mock' : '/mock/expirationcourse.json',
    },
    'courseBaseInfo': {
        'url': '/api/v2.1/course/courseBaseInfo/data',
        'mock' : '/mock/courseBaseInfo.json',
        'urlDemo': '/api/v2.1/course/courseBaseInfo/data',
        'type': 'POST'
    },
    'courseDetail': {
        'url': '/api/teachsource/course/courseDetail/data',
        'mock' : '/mock/courseDetail.json',
        'urlDemo': '/api/teachsource/course/courseDetail/data',
    },
    'coursesBaseInfo': {
        'url': '/api/teachsource/course/courseBaseInfo/data',
        'mock' : '/mock/courseBaseInfo.json',
        'urlDemo': '/api/teachsource/course/courseBaseInfo/data',
    },
    'getTasksProgress': {
        'url': '/api/v2/study/getTasksProgress',
        'mock' : '/mock/getTasksProgress.json',
    },
    'taskProgress': {
        'url': '/api/v2.1/chapter/taskProgress',
        'mock' : '/mock/taskProgress.json',
        'type': 'POST'
    },
    'coursestatus': {
        'url': '/api/business/learning/courseactivestatus',
        'mock' : '/mock/coursestatus.json',
    },
    'handout': {
        'url': '/api/teachsource/course/courseBaseInfo/data',
        'mock' : '/mock/handout.json',
        'urlDemo': '/api/teachsource/course/courseBaseInfo/data'
    },



    'bbslist': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/bbslist/v1.0',
        'mock' : '/mock/bbslist.json',
    },
    'bbsdetail': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/bbsdetail/v1.0',
        'mock' : '/mock/bbsdetail.json',
    },
    'bbslist_myJoin': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/bbslist_myJoin/v1.0',
        'mock' : '/mock/bbslist_myJoin.json',
    },
    'bbs_praise': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/bbs_praise/v1.0',
        'mock' : '/mock/bbs_praise.json',
    },
    'bbsreply': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/bbsreply/v1.0',
        'mock' : '/mock/bbsreply.json',
        'type': 'POST'
    },
    'bbssave': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/bbssave/v1.0',
        'mock' : '/mock/bbssave.json',
        'type': 'POST'
    },
    'bbs_del': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/bbs_del/v1.0',
        'mock' : '/mock/bbs_del.json',
    },
    'course-node': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/v2/course/node',
        'mock' : '/mock/course-node.json',
    },
    'nodelist': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/nodelist/v2.1',
        'mock' : '/mock/nodelist.json',
    },
    'nodedetail': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/nodedetail/v2.1',
        'mock' : '/mock/nodedetail.json',
    },
    'node-list': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'mock' : '/mock/node-list.json',
        'url': '/api/v2/note/list'
    },
    'nodesave': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/nodesave/v2.1',
        'mock' : '/mock/nodesave.json',
        'type': 'POST'
    },
    'coursechapternodecount': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/coursechapternodecount/v2.1',
        'mock' : '/mock/coursechapternodecount.json',
        'type': 'POST'
    },
    'myallcoursechapternodecount': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/myallcoursechapternodecount/v2.1',
        'mock' : '/mock/myallcoursechapternodecount.json',
        'type': 'POST'
    },
    'delmycontent': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/delmycontent/v2.1',
        'mock' : '/mock/delmycontent.json',
    },

    'ad_discuss': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/ad_discuss/v2.1',
        'mock' : '/mock/ad_discuss.json',
    },
    'bbs_forumlistShow': {
        'hostNameDemo': 'http://192.168.10.201:9999',
        'url': '/api/studytools/bbs_forumlistShow/v1.0',
        'mock' : '/mock/bbs_forumlistShow.json',
    },





    'subjectTimeList' : {
      // 'hostNameDemo': 'http://api.zbgedu.com',
      'url' : '/api/teachsource/exam/subjectTimeList',
      'mock' : '/mock/subjectTimeList.json',
    },
    'timeList': {
        'url' : '/api/teachsource/exam/timeList',
        'mock' : '/mock/timeList.json',
        // 'url': '/api/v2/exam/timeList'
    },
    'active': {
        // 'url' : '/api/v2/course/active'
        'url': '/api/business/order/courseActive/v1.0',
        'mock' : '/mock/courseActive.json',
    },

    'addLMG': {
        // 'url' : '/api/v2/lessonMessage/addLMG',
        'url': '/api/business/complaintOpinion/create/v1.0',
        'mock' : '/mock/addLMG.json',
        'type': 'POST'
    },
    'version': {
        // 'url' : '/api/course/courselist/version/v3/'
        'url': '/api/teachsource/course/coursesversionlist',
        'urlDemo': '/api/teachsource/course/coursesversionlist/data',
        'mock' : '/mock/version.json',
    },
    
    'getNidExerciseDetail': {
        'hostNameDemo': 'http://192.168.10.112:8083',
        'urlDemo': '/api/teachsource/examen/getNidExerciseDetail/data',
        'url': '/api/teachsource/examen/getNidExerciseDetail',
        'mock' : '/mock/getNidExerciseDetail.json',
    },
    'actionGetCourseProgress': {
        'action': 'true',
        'hostName': 'http://action.zbgedu.com',
        'url': '/api/userAction/course/getCourseProgress/v1.0/',
        'mock' : '/mock/actionGetCourseProgress.json',
    },
    'actionGetTasksProgress': {
        'action': 'true',
        'hostName': 'http://action.zbgedu.com',
        'url': '/api/userAction/course/getTasksProgress/v1.0/',
        'mock' : '/mock/actionGetTasksProgress.json',
    },
    'actionTaskProgress': {
        'action': 'true',
        'hostName': 'http://action.zbgedu.com',
        'url': '/api/userAction/course/taskProgress/v1.0/',
        'mock' : '/mock/taskProgress.json',
    },
    'wileyCourseActive': {
        'url': '/api/business/order/wileyCourseActive/v1.0',
        'mock' : '/mock/wileyCourseActive.json',
    },
    'wileyCourseStudy': {
        'url': '/api/business/order/wileyCourseStudy/v1.0',
        'mock' : '/mock/wileyCourseStudy.json',
    },
    'getAppointmentState': {
        'hostName': window.origin,
        'url': '/publicCourse/getAppointmentState.do',
        'mock' : '/mock/getAppointmentState.json',
        'type': 'POST'
    },
    'appointClick': {
        'hostName': window.origin,
        'url': '/publicCourse/appointClick.do',
        'mock' : '/mock/appointClick.json',
        'type': 'POST'
    },
    'getExerciseIds': {
        'url': '/api/teachsource/examen/getExerciseIds',
        'urlDemo': '/api/teachsource/examen/getExerciseIds/data',
        'mock' : '/mock/getExerciseIds.json',
    },
    'getExerciseBaseInfo': {
        // 'staticDataDemo' : './scripts/staticData/getExerciseBaseInfo.json',
        'urlDemo': '/api/teachsource/examen/getExerciseBaseInfo/data',
        'url': '/api/teachsource/examen/getExerciseBaseInfo',
        'mock' : '/mock/getExerciseBaseInfo.json',
    },
    'getmembernotprocnoticelist': {
        'url': '/api/business/coursegroup/getmembernotprocnoticelist',
        'mock' : '/mock/getmembernotprocnoticelist.json',
    },
    'membercheck': {
        'url': '/api/business/coursegroup/membercheck',
        'mock' : '/mock/membercheck.json',
    },


    'exercisePointCountCache': {
        'hostNameDemo': 'http://192.168.10.201:8080',
        'url': '/api/extendapi/examen/get_exercise_point_count_cache',
        'mock' : '/mock/exercisePointCountCache.json',
        'type': 'POST'
    },
    'exerciseKnowledgeMemberStatus': {
        'hostNameDemo': 'http://192.168.10.201:8080',
        'url': '/api/userAction/examen/get_exercise_knowledge_member_status',
        'mock' : '/mock/exerciseKnowledgeMemberStatus.json',
        'type': 'POST'
    },
    'userKnowledgePointExerciseList': {
        'hostNameDemo': 'http://192.168.10.201:8080',
        'url': '/api/userAction/examen/get_user_knowledge_point_exercise_list',
        'mock' : '/mock/userKnowledgePointExerciseList.json',
    },
    'setMemberExerciseLog': {
        'hostNameDemo': 'http://192.168.10.112:8083',
        'url': '/api/userAction/examen/setMemberExerciseState',
        'mock' : '/mock/setMemberExerciseLog.json',
        'type': 'POST'
    },
    'get_user_knowledge_point_exercise_list': {
        'hostNameDemo': 'http://192.168.10.201:8080',
        'url': '/api/userAction/examen/get_user_knowledge_point_exercise_list',
        'mock' : '/mock/get_user_knowledge_point_exercise_list.json',
    },
    'get_exercise_knowledge_member_status': {
        // 'staticDataDemo' : './scripts/staticData/get_exercise_knowledge_member_status.json',
        'hostNameDemo': 'http://192.168.10.201:8080',
        'url': '/api/userAction/examen/get_exercise_knowledge_member_status',
        'mock' : '/mock/get_exercise_knowledge_member_status.json',
        'type': 'POST'
    },
    'getMemberErrorExercise': {
        'hostNameDemo': 'http://192.168.10.201:8080',
        'url': '/api/userAction/examen/getMemberErrorExercise',
        'mock' : '/mock/getMemberErrorExercise.json',
    },
    'delMemberExercise': {
        'url': '/api/userAction/examen/delMemberExercise',
        'mock' : '/mock/delMemberExercise.json',
    },
    'setMemberErrorExercise': {
        'hostNameDemo': 'http://192.168.10.112:8083',
        'url': '/api/userAction/examen/setMemberErrorExercise',
        'mock' : '/mock/setMemberErrorExercise.json',
        'type': 'POST'
    },
    'setMemberExamenFinish': {
        'hostNameDemo': 'http://192.168.10.112:8083',
        'url': '/api/userAction/examen/setMemberExamenFinish',
        'mock' : '/mock/setMemberExamenFinish.json',
        'type': 'POST'
    },
    'appointment': {
        'url': '/api/userAction/opencourse/appointment',
        'mock' : '/mock/appointment.json',
    },
    'getappointmentlist': {
        'url': '/api/userAction/opencourse/getappointmentlist',
        'mock' : '/mock/getappointmentlist.json',
    },
    'getopencoursedetail': {
        // 'hostName': 'http://demo.zbgedu.com',
        // 'url': '/api/userAction/course/getopencoursedetail/data',
        'url': '/api/teachsource/course/getopencoursedetail/data',
        'mock' : '/mock/getopencoursedetail.json',
    },
    'includeopencoursegroup': {
        'url': '/api/business/coursegroup/includeopencoursegroup',
        'mock' : '/mock/includeopencoursegroup.json',
    },
    'memberbuycategorylist': {
        'url': '/api/business/course/memberbuycategorylist',
        'mock' : '/mock/memberbuycategorylist.json',
    },
    'memberbuylist': {
        'url': '/api/business/coursegroup/memberbuylist',
        'mock' : '/mock/memberbuylist.json',
    },
    'getTotalTime': {
        'url': '/api/userAction/openCourse/getTotalTime',
        'mock' : '/mock/getTotalTime.json',
    },
    'settotaltime': {
        'url': '/api/userAction/openCourse/settotaltime',
        'mock' : '/mock/settotaltime.json',
    },
    'setgift': {
        'url': '/api/userAction/openCourse/setgift',
        'mock' : '/mock/setgift.json',
    },
    'payment': {
        'url': '/api/business/order/payment',
        'mock' : '/mock/payment.json',
        'type': 'POST'
    },
    'ccLogin': {
        'hostName': 'https://view.csslcloud.net',
        'hostNameDemo': 'https://view.csslcloud.net',
        'url': '/api/view/login',
        'mock' : '/mock/ccLogin.json',
        'type': 'POST'
    },
    'getcoursecategory': {
        'staticData': '../assets/staticData/getcoursecategory.json'
    },
    'courseCategoryExamenCount': {
        'url': '/api/teachsource/examen/courseCategoryExamenCount',
        'mock' : '/mock/courseCategoryExamenCount.json',
        // 'type' : 'POST'
    },
    'courseCategoryExamenList': {
        'url': '/api/teachsource/examen/courseCategoryExamenList',
        'mock' : '/mock/courseCategoryExamenList.json',
    },
    'childKnowledgeNodePointList': {
        'url': '/api/teachsource/knowledge/childKnowledgeNodePointList',
        'mock' : '/mock/childKnowledgeNodePointList.json',
    },
    'getListById': {
        'url': '/api/teachsource/resources/getListById',
        'mock' : '/mock/getListById.json',
    },
    'getDetailById': {
        'url': '/api/teachsource/resources/getDetailById',
        'mock' : '/mock/getDetailById.json',
    },
    'getExamenInfo': {
        'url': '/api/teachsource/examen/getExamenInfo',
        'mock' : '/mock/getExamenInfo.json',
    },
    'getKnowledgePointInfo': {
        'url': '/api/teachsource/knowledge/getKnowledgePointInfo',
        'mock' : '/mock/getKnowledgePointInfo.json',
    },
    'searchCourseAlterationsByVersionId' : {
      'mock' : '/mock/searchCourseAlterationsByVersionId.json',
      'url': '/api/teachsource/courseAlteration/searchCourseAlterationsByVersionId'
    },
    'courselist' : {
      'name' : '获取商品包课程列表',
      'url' : '/api/business/coursegroup/courselist',
      'mock' : '/mock/courselist.json',
    },
    'getplan' : {
      'name' : '获取课程计划模板',
      'url': '/api/userAction/study/getplan',
      'mock' : '/mock/getplan.json',
    },
    'memberGetplan' : {
      'name' : '获取学员学习计划',
      'url': '/api/userAction/study/member/getplan',
      'mock' : '/mock/memberGetplan.json',
    },
    'getPreview' : {
      'name' : '获取学员学习预览',
      'url': '/api/userAction/study/member/getPreview',
      'mock' : '/mock/getPreview.json',
    },
    'saveplan' : {
      'name' : '保存学员学习预览',
      'url': '/api/userAction/study/member/saveplan',
      'mock' : '/mock/saveplan.json',
      'type': 'POST'
    },
    'getMaxOverplan' : {
      'name' : '获取学员未完成的学习计划最大周',
      'url': '/api/userAction/study/member/getMaxOverplan',
      'mock' : '/mock/getMaxOverplan.json',
    },
    'updateplan' : {
      'name' : '更新学员学习计划',
      'url': '/api/userAction/study/member/updateplan',
      'mock' : '/mock/updateplan.json',
      'type': 'POST'
    },
    'saveExtension' : {
      'name' : '申请修改学员计划',
      'url': '/api/userAction/study/member/saveExtension',
      'mock' : '/mock/saveExtension.json',
      'type': 'POST'
    },
    'editinfo' : {
      'name' : '学员完善个人信息',
      'url': '/api/zbids/member/editinfo',
      'mock' : '/mock/editinfo.json',
      'type': 'POST'
    },
    'getappdownloadinfo' : {
      'name' : '获取产品版本和下载信息',
      'url': '/api/zbids/app/getappdownloadinfo',
      'mock' : '/mock/getappdownloadinfo.json',
    },
    'applyrestudy' : {
      'name' : '申请重听提交成绩',
      'url': '/api/business/learning/applyrestudy',
      'mock' : '/mock/applyrestudy.json',
      'type': 'POST'
    },
    'fileUpload' : {
      'name' : '上传图片',
      'mock' : '/mock/fileUpload.json',
      'href' : 'http://api.zbgedu.com/api/v2.1/commons/fileUpload',
      'type': 'POST'
    },
    'applyrestudylist' : {
      'name' : '学员申请重听审核状态列表',
      'mock' : '/mock/applyrestudylist.json',
      'url': '/api/business/learning/applyrestudylist',
      'type': 'POST'
    },
    'addDegree' : {
      'name' : '保存学员试卷某题的掌握情况',
      'url': '/api/userAction/study/member/addDegree',
      'mock' : '/mock/addDegree.json',
      'type': 'POST'
    }
  };

  return {
    ajax: function(args) {
      // var hostName = "";
      // if(thatServer.hostName){
      //  hostName = thatServer.hostName;
      // }else{
      //  hostName = Common.host.name;
      // }
      var url = '';
      var type = '';
      var data = '';

      if (args.url) {
        url = args.url;
        type = args.type;
      } else {
        var thatServer = server[args.server];
        type = thatServer.type ? thatServer.type : 'get';
        var envType = parseInt($.cookie('envType'));
        if(envType){
          if(envType == 1){

          }else if(envType == 2){

          }
        }else{
          
        }
        if (thatServer.staticData) {
          url = thatServer.staticData;
          // if(envType == 1) {
          //   url = thatServer.staticDataDemo;
          // }else if(envType == 2) {
          //   url = thatServer.staticData;
          // }else{
          //   url = thatServer.staticData;
          // }
            // if ($.cookie('envType') && $.cookie('envType') == 'false') {
            //     url = thatServer.staticData;
            // } else {

            //     url = thatServer.staticDataDemo;
            // }
        } else {
          var hostName = '';
          var thatServerUrl = '';
          if(envType == 1) {
            if (thatServer.staticDataDemo) {
                url = thatServer.staticDataDemo;
                type = 'get';
            } else {
              if(thatServer.isPrefix){
                hostName = Common.host.location;
                thatServerUrl = Common.prefix.node + thatServer.path;
              }else{
                hostName = Common.host.demoName;
                if (thatServer.hostNameDemo) {
                  hostName = thatServer.hostNameDemo;
                }else if (thatServer.action == 'true') {
                  hostName = Common.host.nameAction;
                }
                if (thatServer.urlDemo) {
                  thatServerUrl = thatServer.urlDemo;
                }else if(thatServer.url){
                  thatServerUrl = thatServer.url;
                }
                
              }
                
              url = hostName + thatServerUrl + "?verTT=" + new Date().getTime();
            }
          }else if(envType == 2 && thatServer.mock && !thatServer.notMock){
            url = thatServer.mock;
            
            type = 'get';

          }else{
            if(thatServer.isPrefix){
              hostName = Common.host.location;
              thatServerUrl = Common.prefix.node + thatServer.path;
            }else{
              hostName = Common.host.name;
              if (thatServer.hostName) {
                  hostName = thatServer.hostName;
              }else if (thatServer.action == 'true') {
                  hostName = Common.host.nameAction;
              }
              if(thatServer.url){
                thatServerUrl = thatServer.url;
              }
            }
            url = hostName + thatServerUrl + "?verTT=" + new Date().getTime();
          }
          /*
          if (envType == 0) {
            if(thatServer.isPrefix){
              hostName = Common.host.location;
              thatServerUrl = Common.prefix.node + thatServer.path;
            }else{
              hostName = Common.host.name;
              if (thatServer.hostName) {
                  hostName = thatServer.hostName;
              }else if (thatServer.action == 'true') {
                  hostName = Common.host.nameAction;
              }
              if(thatServer.url){
                thatServerUrl = thatServer.url;
              }
            }
              
              url = hostName + thatServerUrl + "?verTT=" + new Date().getTime();
          } else {
              if (thatServer.staticDataDemo) {
                  url = thatServer.staticDataDemo;
                  type = 'get';
              } else {
                if(thatServer.isPrefix){
                  hostName = Common.host.location;
                  thatServerUrl = Common.prefix.node + thatServer.path;
                }else{
                  hostName = Common.host.demoName;
                  if (thatServer.hostNameDemo) {
                    hostName = thatServer.hostNameDemo;
                  }else if (thatServer.action == 'true') {
                    hostName = Common.host.nameAction;
                  }
                  if (thatServer.urlDemo) {
                    thatServerUrl = thatServer.urlDemo;
                  }else if(thatServer.url){
                    thatServerUrl = thatServer.url;
                  }
                  
                }
                  
                url = hostName + thatServerUrl + "?verTT=" + new Date().getTime();
              }

          }
          */

          data = thatServer.data || args.data;
        }
      }
      $.ajax({
          url: url,
          type: type,
          data: data,
          success: function(data) {
            if (typeof data == "string") {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.log('url:::' + url)
                    console.log('data:::' + JSON.stringify(data))
                    console.log('errorData:::' + data)
                }
            }
            if (args.server == "getAppointmentState" || args.server == "appointClick") {
                args.done(data)
            }
            if (data.msg == "nologin") {
                // return false;

                window.localStorage.clear();
                $.removeCookie('User', { path: '/' });
                $.removeCookie('loginInfo', { path: '/' });
                $.removeCookie('Token', { path: '/' });

                $.removeCookie('token', {
                    path: '/',
                    expires: -1
                });

                CAICUI.isNav = true;

                // CAICUI.User.login_time
                $.ajax({
                    // url :  hostName + '/api/v3/user/loginloglist',
                    url: hostName + '/api/zbids/member/getLoginLog',
                    type: 'get',
                    data: {
                        memberid: CAICUI.User.memberId,
                        pageNo: 1,
                        pageSize: 1
                    },
                    success: function(data) {
                        if (typeof data == "string") {
                            data = JSON.parse(data);
                        }

                        if (data.state == "success") {
                            var loginloglist_login_time = data.data[0].loginTime;
                            if (loginloglist_login_time > +CAICUI.User.loginTime) {
                                layer.msg('Sorry~ 您的账号在其它地方登录', function() {
                                    window.location.href = CAICUI.Common.loginLink;
                                });
                            } else {
                                window.location.href = CAICUI.Common.loginLink;
                                // 您已经很长时间没有操作，为了您的账号安全，请重新登录。
                                // layer.msg('Sorry~ ', function() {
                                //  window.location.href = CAICUI.Common.loginLink;
                                // });
                            }
                        } else {
                            window.location.href = CAICUI.Common.loginLink;
                            // 您已经很长时间没有操作，为了您的账号安全，请重新登录。
                            // layer.msg('Sorry~ ', function() {
                            //  window.location.href = CAICUI.Common.loginLink;
                            // });
                        }

                    },
                    error: function(data) {
                        window.location.href = CAICUI.Common.loginLink;
                        // 您已经很长时间没有操作，为了您的账号安全，请重新登录。
                        // layer.msg('Sorry~ ', function() {
                        //  window.location.href = CAICUI.Common.loginLink;
                        // });
                    }
                })
            } else if (data.state == "success") {
                args.done(data)
            } else if (data.state == "error" || data.msg == "error") {
                if (args.fail) {
                    args.fail(data)
                } else {
                    console.log(data)
                }
            } else {
                if (args.fail) {
                    args.fail(data)
                } else {
                    console.log(data)
                }
            }
          },
          error: function(data) {
              console.log(data)
          }
      })
    },
    promise: function(args) {
      var thatServer = server[args.server];
      var hostName = thatServer.hostName ? thatServer.hostName : Common.host.name;
      var url = hostName + thatServer.url + "?verTT=" + new Date().getTime();
      var type = thatServer.type || 'get';
      var data = thatServer.data || args.data;
      var promise = new Promise(function(resolve, reject) {
          $.ajax({
              url: url,
              type: type,
              data: data,
              success: function(data) {
                  if (typeof data == "string") {
                      data = JSON.parse(data);
                  }
                  if (data.msg == "nologin") {
                      window.location.href = CAICUI.Common.loginLink;
                  } else if (data.state == "success") {
                      resolve(data);
                  } else if (data.state == "error" || data.msg == "error") {
                      reject(statusText);
                  } else {
                      reject(statusText);
                  }
              },
              error: function(data) {
                  reject(statusText);
              }
          })
      });
      return promise;
    }
  }
});