define(["jquery","underscore","backbone","storage"],function(e,t,a,r){"use strict";return a.View.extend({tagName:"div",className:"course-detail-main",template:t.template(e("#template-course-detail-week-list").html()),events:{"click .courseDetail-weekList-chapterA":"showTaskList","click .js-toTask":"openVideo"},type:"",render:function(e){return console.log(e),this.isCourseDetailWeekPlan(e),CAICUI.render.thisCourseDetail.$el.html(CAICUI.render.thisCourseDetail.template({data:CAICUI.render.courseDetailData})),this},isCourseDetailWeekPlan:function(e){CAICUI.render.previewInterval&&clearInterval(CAICUI.render.previewInterval),CAICUI.render.thisCourseDetail=this,CAICUI.render.courseDetailList=[],CAICUI.render.courseDetailWeekList=[],CAICUI.render.weekTotalBeoverdue=0,CAICUI.render.taskTotal=0,CAICUI.render.taskTotalBeoverdue=0,CAICUI.render.taskTotalOngoing=0,CAICUI.render.taskTotalCompleted=0,CAICUI.render.taskTotalNotstarted=0,CAICUI.render.thisCourseDetail.filterData(e.chapters),e.taskProgress&&CAICUI.render.thisCourseDetail.addTaskProgress(e.taskProgress),CAICUI.render.courseDetailData="",e.weekList&&e.weekList.length?CAICUI.render.courseDetailData=this.getCourseDetailWeekPlanData(e):CAICUI.render.courseDetailData=this.getCourseDetailData(e)},getCourseDetailData:function(e){for(var t=[],a=CAICUI.render.courseDetailList,r=a.length,s=0,o="",i=0,n=0,d=0,l=0,C=0,I=0,c=(d=0,0),k=0,u=0;u<r;u++){0;var T=a[u];if(T.isTasks){i+=T.chapterTotalTime,n+=T.chapterStudyTime;var p=T.tasks.length;switch(s+=p,o){case"completed":CAICUI.render.taskTotalCompleted+=p;break;case"beoverdue":for(var h=0;h<p;h++)T.tasks[h].state?(C++,CAICUI.render.taskTotalCompleted++,c++):T.tasks[h].progress?(CAICUI.render.taskTotalOngoing++,d++):(CAICUI.render.taskTotalBeoverdue++,I++);break;case"ongoing":for(h=0;h<p;h++)T.tasks[h].state?(C++,CAICUI.render.taskTotalCompleted++,c++):T.tasks[h].progress?(CAICUI.render.taskTotalOngoing++,d++):(CAICUI.render.taskTotalNotstarted++,k++);break;case"notstarted":CAICUI.render.taskTotalNotstarted+=p}}t.push(T)}return s==C&&"notstarted"!==o&&(l=1,o="completed"),CAICUI.render.taskTotal+=s,CAICUI.render.courseDetailWeekList.push({list:t,tasksNum:s,weekStatus:o,weekTaskTime:i,weekStudyTime:n,weekIsFinish:l,weekTaskCompleted:c,weekTaskOngoing:d,weekTaskBeoverdue:I,weekTaskNotstarted:k}),{isPreview:e.isPreview,isPlan:!1,courseDetailWeekList:CAICUI.render.courseDetailWeekList,courseActiveState:e.courseActiveState,courseTaskTotal:CAICUI.render.taskTotal,courseTaskTotalBeoverdue:CAICUI.render.taskTotalBeoverdue,courseTaskTotalCompleted:CAICUI.render.taskTotalCompleted,courseTaskTotalOngoing:CAICUI.render.taskTotalOngoing,courseTaskTotalNotstarted:CAICUI.render.taskTotalNotstarted,coursePercentage:CAICUI.iGlobal.getPercentage(CAICUI.render.taskTotalCompleted,CAICUI.render.taskTotal),courseId:e.courseId,weekTotalBeoverdue:CAICUI.render.weekTotalBeoverdue}},getCourseDetailWeekPlanData:function(e){var a=0,r=(new Date).getTime();return t.each(e.weekList,function(e,t){var s=e.startCategoryId,o=e.endCategoryId,i=[],n=!1,d=CAICUI.render.courseDetailList,l=d.length,C=0,I="",c=0,k=0,u=0,T=0,p=0,h=0,A=(u=0,0),g=0;e.startDate<r&&e.endDate<r?(I="beoverdue",CAICUI.render.weekTotalBeoverdue++):e.startDate<r&&r<e.endDate&&(I="ongoing"),r<e.startDate&&r<e.endDate&&(I="notstarted");for(var U=a;U<l;U++){0;var m=d[U];if(s==m.chapterId&&(n=!0),n){if(m.isTasks){c+=m.chapterTotalTime,k+=m.chapterStudyTime;var v=m.tasks.length;switch(C+=v,I){case"completed":CAICUI.render.taskTotalCompleted+=v;break;case"beoverdue":for(var w=0;w<v;w++)m.tasks[w].state?(p++,CAICUI.render.taskTotalCompleted++,A++):m.tasks[w].progress?(CAICUI.render.taskTotalOngoing++,u++):(CAICUI.render.taskTotalBeoverdue++,h++);break;case"ongoing":for(w=0;w<v;w++)m.tasks[w].state?(p++,CAICUI.render.taskTotalCompleted++,A++):m.tasks[w].progress?(CAICUI.render.taskTotalOngoing++,u++):(CAICUI.render.taskTotalNotstarted++,g++);break;case"notstarted":CAICUI.render.taskTotalNotstarted+=v}}i.push(m)}if(o==m.chapterId){n=!1,a=U,U,U;break}}C==p&&"notstarted"!==I&&(T=1,I="completed"),CAICUI.render.taskTotal+=C,CAICUI.render.courseDetailWeekList.push({planId:e.id,title:e.planTitle,startDate:e.startDate,endDate:e.endDate,isFinish:e.isFinish,list:i,tasksNum:C,weekStatus:I,weekTaskTime:c,weekStudyTime:k,weekIsFinish:T,weekTaskCompleted:A,weekTaskOngoing:u,weekTaskBeoverdue:h,weekTaskNotstarted:g})}),{isPreview:e.isPreview,isPlan:!0,courseDetailWeekList:CAICUI.render.courseDetailWeekList,courseActiveState:e.courseActiveState,courseTaskTotal:CAICUI.render.taskTotal,courseTaskTotalBeoverdue:CAICUI.render.taskTotalBeoverdue,courseTaskTotalCompleted:CAICUI.render.taskTotalCompleted,courseTaskTotalOngoing:CAICUI.render.taskTotalOngoing,courseTaskTotalNotstarted:CAICUI.render.taskTotalNotstarted,coursePercentage:CAICUI.iGlobal.getPercentage(CAICUI.render.taskTotalCompleted,CAICUI.render.taskTotal),courseId:e.courseId,weekTotalBeoverdue:CAICUI.render.weekTotalBeoverdue}},filterData:function(e,a,r,s,o){if(a)a++;else a=1;t.each(e,function(e,o){var i="",n="";a>1?(i=s,n=r+"-"+o):(n=o.toString(),r=o.toString(),i=o.toString());var d=0;if(e.tasks&&e.tasks.length){var l=[],C=0,I=0,c=0;CAICUI.render.previewCourseTasksTotalNum+=e.tasks.length,t.each(e.tasks,function(e,t){"video"==e.taskType?(l.push(e),CAICUI.render.previewCourseTimeTotalNum+=+e.videoTime,d+=+e.videoTime):"exam"==e.taskType?(l.push(e),CAICUI.render.previewCourseTimeTotalNum+=60*+e.taskTime,d+=60*+e.taskTime):"knowledgePointExercise"==e.taskType?(l.push(e),CAICUI.render.previewCourseTimeTotalNum+=7200,d+=7200):"openCourse"==e.taskType&&(l.push(e),CAICUI.render.previewCourseTimeTotalNum+=+e.taskTime),e.state?C++:e.progress?I++:c++}),CAICUI.render.courseDetailList.push({level:a,rootNode:i,parentNode:r,node:n,isChildren:!1,isFree:e.isFree,chapterTitle:e.chapterTitle,chapterId:e.chapterId,isTasks:!0,tasks:l,completedNum:C,ongoingNum:I,notstartedNum:c,chapterTotalTime:d})}e.children&&e.children.length&&(CAICUI.render.courseDetailLevel++,CAICUI.render.courseDetailList.push({level:a,rootNode:i,parentNode:r,node:n,isChildren:!0,isFree:e.isFree,chapterTitle:e.chapterTitle,chapterId:e.chapterId,isTasks:!1}),CAICUI.render.thisCourseDetail.filterData(e.children,a,n,r,i))})},addTaskProgress:function(e){t.each(CAICUI.render.courseDetailList,function(a,r){if(a.isTasks){var s=0,o=0,i=0,n=0;a.tasks.length;t.each(a.tasks,function(a,r){var d="";t.each(e,function(e,t){a.taskId==e.taskId&&(d=e)}),d?(d.studyTime?s+=d.studyTime:s+=0,d.state?o++:d.progress&&i++,a.progress=d.progress,a.total=d.total,a.state=d.state,a.percentage=CAICUI.iGlobal.getPercentage(d.progress,d.total)):n++}),a.completedNum=o,a.ongoingNum=i,a.notstartedNum=n,a.chapterStudyTime=s}})},getStudyTime:function(e){var a=0;return e.taskStudyTimeList&&e.taskStudyTimeList.length&&t.each(e.taskStudyTimeList,function(e,t){a+=parseInt(e.studyTime)}),a},showTaskList:function(e){var t=CAICUI.iGlobal.getThat(e),a=t.parents(".courseDetail-weekList-chapterUl");if(t.data("istasks")){var r=t.parent();r.hasClass("active")?r.removeClass("active"):r.addClass("active")}else{var s=t.data("node"),o=t.data("checked"),i=t.data("level");o?(t.data("checked",!1),1==i?(a.find(".courseDetail-weekList-parentNode-"+s).parent().removeClass("active"),a.find(".courseDetail-weekList-parentNode-"+s).data("checked",!1),a.find(".courseDetail-weekList-rootNode-"+s).parent().removeClass("show active"),a.find(".courseDetail-weekList-rootNode-"+s).data("checked",!1)):(t.parent().removeClass("active"),t.parent().data("checked",!1),a.find(".courseDetail-weekList-parentNode-"+s).parent().removeClass("show active"),a.find(".courseDetail-weekList-parentNode-"+s).data("checked",!1))):(1==i?(a.find(".courseDetail-weekList-rootNode-"+s).parent().addClass("show active"),a.find(".courseDetail-weekList-rootNode-"+s).data("checked",!0)):(t.parent().addClass("active"),t.parent().data("checked",!0)),t.data("checked",!0),a.find(".courseDetail-weekList-parentNode-"+s).parent().addClass("show active"))}window.CAICUI.myScrollLearningPlanPreview?window.CAICUI.myScrollLearningPlanPreview.refresh():window.CAICUI.myScrollCourseStudyList&&window.CAICUI.myScrollCourseStudyList.refresh()},toTask:function(e){var t=CAICUI.iGlobal.getThat(e),a=t.attr("link");if(a){var r=t.attr("data-chapterid");CAICUI.render.openChapterId=r,window.location.hash=a}},openVideo:function(t){var a=CAICUI.render.courseDetail.courseActiveState,s=CAICUI.iGlobal.getThat(t),o=s.attr("link");if(o){var i=s.attr("data-chapterid"),n=s.attr("data-taskslength");CAICUI.render.openChapterId=i,CAICUI.render.openTasksNum=n,CAICUI.render.formCourseStudy=!0,CAICUI.NavVideo=!1,e("body .course-desc").attr("href",o),CAICUI.render.lastLearnChapterName=s.find(".course-list-desc").text(),CAICUI.render.lastLearnChapterLink=o,r.setsingle("playlist-index"+CAICUI.render.courseId,"c|"+s.attr("data-index")),window.location.hash=o}else 4==a?layer.msg("Sorry~ 您当前的课程已锁定",function(){}):2==a?layer.msg("Sorry~ 您当前的课程未激活",function(){}):1==a?layer.msg("Sorry~ 您当前的课程已过期",function(){}):0==a&&layer.msg("Sorry~ 您未购买当前的课程",function(){})}})});