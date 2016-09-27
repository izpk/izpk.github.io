/*
caicui课件播放器
播放器不再从网站实时读取数据，而是由调用着将播放列表写入本地缓存，播放器调用缓存来播放任务
信息存入本地缓存:storage.setsingle('playlist-index'+courseId,data);
播放器将读取数据:storage.get('playlist-index'+courseId)
playlist-index:结构如下：
c或者t|0|1|1
c：表示是播放的是一个章节，后面的是定位改章节在课程结构的数组索引顺序
t：表示是定位显示一个任务
*/
;
define([
	'jquery',
	"underscore",
	'ajax',
	'storage',
	'layer',
	'iMobile',
	'slimscroll',
	'jqueryUI',
	
], function($, _, request, storage,    layer, iMobile) {
	window.videoController = {
		player: null,
		playerType: 0, //0:swf 1:HTML5 video 2:exe加密播放器 3:控制iframe中的cc视频

		courseData: '',
		courseActiveState: 0, //0:未购买 1:已激活已过期 2:未激活 3:已激活未过期

		ccSetConfig: { //cc播放器配置
			control_enable: 0,
			bigbutton_enable: 0,
			keyboard_enable: 0,
			fullscreen_enable: 1,
			on_player_seek: "on_player_seek",
			on_player_start : "on_player_start"
		},
		courseId : '',
		chapterId : '',
		//subjectId : '',
		taskId : '',
		taskProgress : '',
		load : '',
		payInfoDialog : '',
		//init: function(subjectId, courseId, chapterId, taskId) {
		init: function(courseId, chapterId, taskId, taskProgress) {
			console.log(courseId + ';' + chapterId + ';' + taskId + ';' + taskProgress)
			videoController.courseId = courseId;
			CAICUI.render.chapterId = videoController.chapterId = chapterId;
			if(taskId){
				CAICUI.render.taskId = videoController.taskId = taskId;
			}
			if(taskProgress){
				CAICUI.render.taskProgress = videoController.taskProgress = taskProgress;
			}
			
			//添加笔记默认数据
			videoController.courseNode = {};
			videoController.courseNode.isPublic = 1;
			videoController.courseNode.imgPathArray = [];
	    	//videoController.subjectId = subjectId;
			//课程章节目录和资料列表＋课程购买激活信息
			
			videoController.courseId = courseId;
			// if(storage.get('playlist-index'+courseId) && storage.get('course-'+courseId)){
			// 	CAICUI.render.subjectId = storage.get('course-'+courseId).subjectId;
			// 	videoController.initData(courseId, chapterId);
			// }else{
				CAICUI.Request.ajax({
					'server' : 'courseDetail',
					'data' : {
						'courseId' : courseId
					},
					done : function(data){
						console.log(data);
						CAICUI.render.subjectId = data.data[0].subjectId
						videoController.courseData = data.data[0];
						var indexArray = ''
						console.log(chapterId)
						_.each(data.data[0].chapters,function(element1, index1, list){
							if(element1.chapterId == chapterId){
								indexArray =  index1;
							}else{
								if(element1.children){
									_.each(element1.children,function(element2, index2, list){
										if(element2.chapterId == chapterId){
											indexArray =  index1 + '|' + index2;
										}else{
											if(element2.children){
												_.each(element2.children,function(element3, index3){
													if(element3.chapterId == chapterId){
														indexArray =  index1 + '|' + index2+ '|' + index3;
													}
												})
											}
										}
									})
								}
								

							}
						});
						storage.setsingle('playlist-index'+courseId,"c|"+indexArray);
						videoController.courseActiveState(data.data[0].versionId,function(){
							//storage.setsingle('course-' + courseId, data.data[0]);
							videoController.initData(courseId, chapterId);
						});
					}
				})
			// }
	  },
	  initData : function(courseId, chapterId){
	  	if(storage.get('playlist-index'+courseId) && storage.get('course-'+courseId)){
				//需要播放的视频在章节中的索引序列号
				videoController.indexList=storage.get('playlist-index'+courseId).split('|');
				//章节任务结构化数据
				videoController.courseData = storage.get('course-'+courseId);
				//定位播放器要播放的章节和任务
				//增加属性：currentChapter和currentTask和lasttaskindex，
				if(videoController.indexList.length==4 && videoController.indexList[0]=="c"){
					videoController.currentChapter=videoController.courseData.chapters[videoController.indexList[1]].children[videoController.indexList[2]].children[videoController.indexList[3]];
					//定位本章节中最后学习的任务
					var tasknum=videoController.currentChapter.tasks.length;
					var lasttaskindex=0;
					var lasttaskDate=0;
					if(videoController.currentChapter.tasks[0].modifyDate){
						lasttaskDate=videoController.currentChapter.tasks[0].modifyDate;
					}
					for(var i=1;i<tasknum;i++){
						if(videoController.currentChapter.tasks[i].modifyDate && videoController.currentChapter.tasks[i].modifyDate>lasttaskDate){
							lasttaskindex=i;
							lasttaskDate=videoController.currentChapter.tasks[i].modifyDate;
						}
					}
					videoController.lasttaskindex=lasttaskindex;
				}else if(videoController.indexList.length==3 && videoController.indexList[0]=="c"){
					videoController.currentChapter=videoController.courseData.chapters[videoController.indexList[1]].children[videoController.indexList[2]];
					//定位本章节中最后学习的任务
					var tasknum=videoController.currentChapter.tasks.length;
					var lasttaskindex=0;
					var lasttaskDate=0;
					if(videoController.currentChapter.tasks[0].modifyDate){
						lasttaskDate=videoController.currentChapter.tasks[0].modifyDate;
					}
					for(var i=1;i<tasknum;i++){
						if(videoController.currentChapter.tasks[i].modifyDate && videoController.currentChapter.tasks[i].modifyDate>lasttaskDate){
							lasttaskindex=i;
							lasttaskDate=videoController.currentChapter.tasks[i].modifyDate;
						}
					}
					videoController.lasttaskindex=lasttaskindex;
				}else if(videoController.indexList.length==4  && videoController.indexList[0]=="t"){
					videoController.currentChapter=videoController.courseData.chapters[videoController.indexList[1]].children[videoController.indexList[2]];
					videoController.lasttaskindex=videoController.indexList[3];
				}else if(videoController.indexList.length==2 && videoController.indexList[0]=="c"){
					videoController.currentChapter=videoController.courseData.chapters[videoController.indexList[1]];
					//定位本章节中最后学习的任务
					var tasknum=videoController.currentChapter.tasks.length;
					var lasttaskindex=0;
					var lasttaskDate=0;
					if(videoController.currentChapter.tasks[0].modifyDate){
						lasttaskDate=videoController.currentChapter.tasks[0].modifyDate;
					}
					for(var i=1;i<tasknum;i++){
						if(videoController.currentChapter.tasks[i].modifyDate && videoController.currentChapter.tasks[i].modifyDate>lasttaskDate){
							lasttaskindex=i;
							lasttaskDate=videoController.currentChapter.tasks[i].modifyDate;
						}
					}
					videoController.lasttaskindex=lasttaskindex;
				}else if(videoController.indexList.length==3  && videoController.indexList[0]=="t"){
					videoController.currentChapter=videoController.courseData.chapters[videoController.indexList[1]];
					videoController.lasttaskindex=videoController.indexList[2];
				}else{
					window.location.href = "#/courseIndex/"+courseId;
					return;
				}
				if(videoController.taskId){
					for(var i=0;i<videoController.currentChapter.tasks.length;i++){
						if(videoController.currentChapter.tasks[i]['taskId'] == videoController.taskId){
							videoController.lasttaskindex = i;
						}
					}
				}
				videoController.currentTask=videoController.currentChapter.tasks[videoController.lasttaskindex];
				CAICUI.render.chapterName = videoController.currentChapter.chapterTitle;
				CAICUI.render.taskCount = videoController.currentChapter.tasks.length;
				CAICUI.render.taskCurrent = videoController.lasttaskindex;

				videoController.addAnimate(function(){
					//开始显示任务
					videoController.initDom();

				});
			}else{
				window.location.href = "#/courseIndex/"+courseId;
			}
	  },
	  courseActiveState : function(versionId,callback){
				CAICUI.Request.ajax({
					'server' : 'coursestatus',
					'data' : {
						'token' : CAICUI.User.token,
						'versionId' : versionId
					},
					done : function(data){
						console.log(data);
						//CAICUI.render.serverNum ++;
						//CAICUI.render.$this.$courseActiveState = data.data;

						if(data.state=="success"){
							if(data.data[0].lockStatus !== 0){
								CAICUI.render.lockStatus = true;
							}
							var courseinfo=data.data;
							videoController.courseByInFo(courseinfo);
							
							if(callback){callback()};
						}else{
							alert("获取课程授权信息失败，请刷新页面重试。");
							course.courseActiveState=999;
						}
					}
				})
		},
		courseByInFo : function(courseinfo){
			var courseActiveState=0;//默认未购买
			if($.isArray(courseinfo)){
				var datanow=Date.parse(new Date())/1000;//当前时间戳
				for(var i=0;i<courseinfo.length;i++){
					//alert(datanow +'v'+ courseinfo[i].expirationTime+"|"+courseinfo[i].activeState+"|"+course.courseActiveState);
					if(courseinfo[i].activeState=="acitve" && courseinfo[i].expirationTime>datanow && courseActiveState<3){
						courseActiveState=3;//已激活未过期
						break;
					}else if(courseinfo[i].activeState=="init" && courseActiveState<2){
						courseActiveState=2;//未激活
					}else if(courseinfo[i].activeState=="acitve" && courseinfo[i].expirationTime<datanow && courseActiveState<1){
						courseActiveState=1;//已激活已过期
					}
					
				}
				if(CAICUI.render.lockStatus){
					courseActiveState=4;
				}
			}	
			//course.getinitdata=true;
			videoController.courseData.courseActiveState = courseActiveState;
			//更新缓存的课程数据
			storage.setsingle('course-'+videoController.courseId,videoController.courseData);
			//开始页面显示
			//course.initDom(course.courseData);
			//获取学习进度
			//course.getCourseProgress(course.courseData.courseId); 
			//获取学习时间对比
			//course.getStudyTime(); 
		},
	  addAnimate : function(callback){
    	var windowWidth = $(window).width();
    	var windowHeight = $(window).height();
    	$('body').prepend('<div id="animate" style="width:'+windowWidth+'px;"></div>');
    	$('#animate').animate({
    		'height' : windowHeight,
    		'top' : '0'
    	},300,function(){
    		if(callback){callback();};
    	})
	  },
	  removeAnimate : function(callback){
			$('#animate').animate({
				'height' : '0',
				'top' : '50%'
			},300,function(){
				$('#animate').remove();
				if(callback){callback();};
			})
		},
		tasksStars : function(e){
			var that =$(this);
			var index = that.index();
			var prevAll = that.prevAll();
			var nextAll = that.nextAll();
			var siblings = that.siblings();
			if(e.type == 'mouseenter'){
				prevAll.addClass('active');
				that.addClass('active');
				nextAll.removeClass('active');
			}else if(e.type == 'mouseleave'){
				siblings.removeClass('active');
				that.removeClass('active');
			}
		},
		tasksStarsMouseenter : function(){
			var that =$(this);
			var index = that.index();
		},
		tasksIsEnd : function(){
			// if($(this).find('.studycenter-video-task-end').hasClass('active')){
			// 	$('.studycenter-video-tasks-center').addClass('active');
			// 	$('.video-icon-task-next').hide();
			// }else{
			// 	$('.studycenter-video-tasks-center').removeClass('active');
			// 	$('.video-icon-task-next').show();
			// }
		},
		taskNext : function(){
    	var netxtindex=videoController.lasttaskindex+1;
			console.log(netxtindex);
			videoController.lasttaskindex = netxtindex;
			$('.studycenter-video-task-a').eq(netxtindex).click();
			var videoTaskLength = $('.studycenter-video-task-a').length-1;
			var videoTaskSuccess = 0;
			$('.studycenter-video-task-a').each(function(){
				if($(this).hasClass('video-icon-task-success')){
					videoTaskSuccess++;
				}
			})
			if(videoTaskSuccess == videoTaskLength){
				$('.studycenter-video-tasks-center').addClass('active');
				$('.video-icon-task-next').hide();
			}else{
				$('.studycenter-video-task-a').eq(netxtindex).click();
			}
			
    },
	  //界面显示
		initDom : function(){
			console.log({
				"courseId" : videoController.courseData.courseId,
				"chapterId" : videoController.currentChapter.chapterId,
				"taskId" : videoController.currentChapter.tasks[videoController.lasttaskindex].taskId,
				"taskIndex" : videoController.lasttaskindex,
				"taskData" : videoController.currentChapter
			});
			var videoTemp = _.template($('#video').html());
			$('.studycenter-video').remove();
			$('body').append(videoTemp({
				//"subjectId" : videoController.subjectId,
				"courseId" : videoController.courseData.courseId,
				"chapterId" : videoController.currentChapter.chapterId,
				"taskId" : videoController.currentChapter.tasks[videoController.lasttaskindex].taskId,
				"taskIndex" : videoController.lasttaskindex,
				"taskData" : videoController.currentChapter
			}));
			videoController.initView();
			videoController.initPower();
			videoController.initEvent();
			videoController.realUpdateProgress();
			//更新完成状态
			CAICUI.Request.ajax({
				'server' : 'getTasksProgress',
				'data' : {
					'token' : CAICUI.User.token,
					'courseId' : videoController.courseData.courseId
				},
				done : function(data){
					for(var i=0;i<videoController.currentChapter.tasks.length;i++){
						_.each(data.data,function(element, index){
							if(element.taskId == videoController.currentChapter.tasks[i].taskId && element.state == "1"){
								$("#"+element.taskId).removeClass(["active"]);
								$("#"+element.taskId).addClass("video-icon-task-success");
							}
						})
					}
				},
				fail : function(data){

				}
			});
			
				// if(videoController.currentChapter.tasks[i].progressstate == "1"){
				// 	$("#"+videoController.currentChapter.tasks[i].taskId).removeClass(["active"]);
				// 	$("#"+videoController.currentChapter.tasks[i].taskId).addClass("video-icon-task-success");
				// }
      //}
      //初始化发送学习进度
      videoController.saveProgress('init');
		},
    //初始学习权限
    initPower : function(){	    	
    		//判断用户是否具备学习此任务的权限courseActiveState
    		//章节免费
    		var currentTask = videoController.currentChapter.tasks[videoController.lasttaskindex];
    		if(videoController.courseData.courseActiveState==4){
					videoController.payInfoDialog = layer.confirm(
						'你购买的此课程已锁定',
						{icon: 3,closeBtn:false},
						function(index){
							//layer.close(index);
							//window.location.href = infoAddress+'mc/cartItem/list';
							//window.history.go(-1);
							CAICUI.NavVideo = true;
							CAICUI.domRender = true;
							videoController.videoClose("courseActivated");
							//window.location.hash = "courseActivated";
						},
						function(){
							// window.history.go(-1);
							videoController.videoClose();
						}
						);
						return false;
				}

    		if(videoController.currentChapter.isFree=="true"){
    			//开始任务
					videoController.cc_taskStatus();
					videoController.showTask(currentTask.taskType,currentTask);
    		}else{
    		if(videoController.courseData.courseActiveState==3){
					//开始任务
					videoController.cc_taskStatus();
					videoController.showTask(currentTask.taskType,currentTask);
				}else if(videoController.courseData.courseActiveState==2){
					videoController.payInfoDialog = layer.confirm(
						'你购买的该课程还没激活',
						{icon: 3,closeBtn:false},
						function(index){
							//layer.close(index);
							//location.setHash("/myNotActivated");
							//window.history.go(-1);
							CAICUI.NavVideo = true;
							CAICUI.domRender = true;
							videoController.videoClose("courseNotActivated");
						},
						function(){
							// window.history.go(-1);
							videoController.videoClose();
						}
						);
						return false;
				}else if(videoController.courseData.courseActiveState==1){
					videoController.payInfoDialog = layer.confirm(
						'你购买的此课程已过期',
						{icon: 3,closeBtn:false},
						function(index){
							//layer.close(index);
							//window.location.href = infoAddress+'mc/cartItem/list';
							//window.history.go(-1);
							CAICUI.NavVideo = true;
							CAICUI.domRender = true;
							videoController.videoClose("courseActivated");
							//window.location.hash = "courseActivated";
						},
						function(){
							// window.history.go(-1);
							videoController.videoClose();
						}
						);
						return false;
				}else{
					videoController.payInfoDialog = layer.confirm(
						'你还没有购买此课程,现在购买？',
						{icon: 3,closeBtn:false},
						function(index){
							//layer.close(index);
							window.location.href = 'http://www.caicui.com/';
							//window.location.hash = "#courseStudyIn";
						},
						function(){
							// window.history.go(-1);
							videoController.videoClose();
						}
						);
						return false;
				}
    		}
    },   
    initView: function() {
        $('.studycenter-video-right-content').slimScroll({
            height:'100%',
            railOpacity: 0.4,
            wheelStep: 10
        });
        $('#playCtr').css('width', '100%');
    },
    videoClose : function(hashLink){
    	layer.close(videoController.payInfoDialog);
    	// CAICUI.Loading = false;
    	// CAICUI.NavVideo = true;
    	// if(CAICUI.iGlobal.getUrlPara('return_render') == 'on'){
    	// 	CAICUI.domRender = false;
    	// }
    	
    	//cc播放器
			if(videoController.playerType == 0){
				
			//exe播放器
			}else if(videoController.playerType == 2){
				WINAPI.SetPlayerHide(1);
				WINAPI.SetPlayerPause();
			}else if(videoController.playerType == 3){
				cc_winplayer.SetIframePlayerHide(1);
				//WINAPI.SetPlayerPause();
				var data ={"type":101}; 
				cc_winplayer.sendMessageToIframe(JSON.stringify(data));
			}
  		$('.studycenter-video').remove();
  		videoController.removeAnimate();
  		//关闭视频播放页面，发送任务进度
  		videoController.saveProgress();
  		clearInterval(videoController.slideIntervalstop);
  		clearInterval(videoController.saveVideoProgressSetinterval);
  		var link = '';
  		if(hashLink){
  			link = hashLink;
  		}else{
  			link = CAICUI.iGlobal.getUrlPara('return_link');//$(this).attr('link');
  		}
  		
  		if(CAICUI.iGlobal.getUrlPara('return_hash') == 'on'){
  			window.location.hash = link;
  		}else{
  			window.location.href = link;
  		}
  		
    },
    initEvent : function(){
    	$('.js-studycenter-video-task-end').on('click',videoController.tasksIsEnd)
    	$('.studycenter-video-tasks-stars').on('click mouseenter',videoController.tasksStars)
    	//$('.studycenter-video-tasks-stars').on('mouseenter',videoController.tasksStarsMouseenter)

			//关闭播放器窗口   studycenter-video-close
    	$('.video-icon-task-courselist').on('click',function(){
    		videoController.videoClose();
    	});
    	
    	$('.video-icon-task-continue').on('click',videoController.continuetask);
    	
    	$('.studycenter-video-task-a').on('click',videoController.taskChange);
    	$('.studycenter-video-task-next').on('click',videoController.taskNext);
    	$('.js-close-sidebar').on('click',videoController.closeSidebar);
    	$('.js-open-sidebar').on('click',videoController.openSidebar);
			$('.speedCtrBtn').on('click',function(){
				var speendvalue = $(this).attr("data-speed");
				//WINAPI.log("调整播放速度："+speendvalue);
				WINAPI.SetPlaySpeed(speendvalue);
				$('.speedCtrBtn').removeClass("active");
				$(this).addClass("active");
			});
    	/*$('#playCtr').find('span').on('mousedown', function() {
    	    clearInterval(videoController.slideIntervalstop);
    	    //opt.drugBeginTime = videoController.cc_getPosition();
    	})*/
    	//声音
    	$('.soundIos').on('click',videoController.videoSound);
    	//声音进度条
    	$('#volumeCtrly').slider({
    	    orientation: "vertical",
    	    value: '50',
    	    range: "min",
    	    animate: 'fast',
    	    max: 100,
    	    //回调滑块位置变化时触发
    	    change: function(event, ui) {
    	        if (ui.value > 0) {
    	            $(this).parents('.volumeCtr').prev('.soundIos').html('<i class="glyphicon glyphicon-volume-down"></i>');
					//cc播放器
					if(videoController.playerType == 0){
						videoController.cc_setVolume(ui.value / 100);
					//exe播放器
					}else if(videoController.playerType == 2){
						WINAPI.SetPlayerVolume(ui.value*120/100);
					}else if(videoController.playerType == 3){
						var data ={"type":110,"data":{"volume":ui.value / 100}}; 
						cc_winplayer.sendMessageToIframe(JSON.stringify(data));
					}
    	        } else if (ui.value == 0) {
    	            $(this).parents('.volumeCtr').prev('.soundIos').html('<i class="glyphicon glyphicon-volume-off"></i>');
					//cc播放器
					if(videoController.playerType == 0){
						videoController.cc_setVolume(0 / 100);
					//exe播放器
					}else if(videoController.playerType == 2){
						WINAPI.SetPlayerVolume(0);
					}else if(videoController.playerType == 3){
						var data ={"type":110,"data":{"volume":0}}; 
						cc_winplayer.sendMessageToIframe(JSON.stringify(data));
					}
    	        }
    	    }
    	});
    	//视频进度条
    	videoController.playController();
    	//控制播放暂停或播放
			$('.plays').on('click',function(){
				if($(this).hasClass('glyphicon-pause')){
					$(this).addClass('glyphicon-play').removeClass('glyphicon-pause');
					//cc播放器
					if(videoController.playerType == 0){
						videoController.cc_pause();
					//exe播放器
					}else if(videoController.playerType == 2){
						WINAPI.SetPlayerPause();
					}else if(videoController.playerType == 3){
						var data ={"type":101}; 
						cc_winplayer.sendMessageToIframe(JSON.stringify(data));
					}
				}else {
					$(this).addClass('glyphicon-pause').removeClass('glyphicon-play');
					// 播放
					//cc播放器
					if(videoController.playerType == 0){
						videoController.cc_play();
					//exe播放器
					}else if(videoController.playerType == 2){
						WINAPI.SetPlayerPlay();
					}else if(videoController.playerType == 3){
						var data ={"type":102}; 
						cc_winplayer.sendMessageToIframe(JSON.stringify(data));
					}
				}
			});
			
			$('.js-save-quiz').on('click',function(){
				videoController.saveNoteAndQuiz(this, 'quiz');
			});
			$('.js-save-note').on('click',function(){
				videoController.saveNoteAndQuiz(this, 'note');
			});

			$('.node-editor-cancel').on('click',videoController.closeSidebar);

			$('.node-editor-confirm').on('click',function(){
				var nodeEditorTextarea = $('#node-editor-textarea').val();
		    if (!nodeEditorTextarea) {
						layer.msg('Sorry~ 请输入内容！', function() {});
		        // editor.jeditor.popover('请输入内容');
		        // editor.focus();
		        return false;
		    }
		    videoController.courseNode.imgPath = '';
		    if(videoController.courseNode.imgPathArray.length){
		    	for(var i=0;i<videoController.courseNode.imgPathArray.length;i++){
		    		i ? videoController.courseNode.imgPath += ',' + videoController.courseNode.imgPathArray[i] : videoController.courseNode.imgPath += videoController.courseNode.imgPathArray[i];
		    	}
		    }else{
		    	videoController.courseNode.imgPath = '';
		    }
		    CAICUI.Request.ajax({
					'server' : 'nodesave',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : '',
						'content' : nodeEditorTextarea,
						'clientType' : CAICUI.render.clientType,
						'title' : videoController.currentChapter.tasks[videoController.lasttaskindex].title,
						'isPublic' : videoController.courseNode.isPublic,
						'courseId' : videoController.courseData.courseId,
						'subjectId' : videoController.courseData.subjectId,
						'categoryId' : videoController.courseData.categoryId,
						'chapterId' : videoController.currentChapter.chapterId,
						'subjectName' : videoController.courseData.subjectName,
						'categoryName' : videoController.courseData.categoryName,
						'courseName' : videoController.courseData.courseName,
						'chapterName' : videoController.currentChapter.chapterTitle,
						'taskId' : videoController.currentChapter.tasks[videoController.lasttaskindex].taskId,
						'taskName' : videoController.currentChapter.tasks[videoController.lasttaskindex].title,
						'taskProgress':parseInt(videoController.currentChapter.tasks[videoController.lasttaskindex].progress),
						'taskType':videoController.currentChapter.tasks[videoController.lasttaskindex].taskType,
						'imgPath' : videoController.courseNode.imgPath,
						'clientType' : 'pc'
					},
					done : function(data){
						if (data.state == 'success') {
    					//videoController.closeSidebar();
  				    //layer.msg("保存成功", function() {});

  				    //$('.layui-layer').css('z-index', '2000');
  				    //$('span[class="close"]').trigger("click");
  				    //cc.module.errorMsg(datas.msg);

  				    layer.close(videoController.load);
  				    layer.msg('保存成功！', {
  				    	shade: true,
  				    	icon: 1,
  				    	time: 500
  				    },function(){
  				    	videoController.closeSidebar();
  				    	$('.right-title-input').val('');
  				    	//textarea.val('');
  				    	//storage.remove('xneditor_pdata_message');
  				    	//window.history.back(-1);
  				    });
    				}
					},
					fail : function(data){
						layer.msg('Sorry~ 笔记保存失败', function() {});
					}
				})
        
			});
			$('.add-photo-box').on('click','.add-photo-remove',videoController.addPhotoRemove);
			$('#uploadForm-file').on('change',function(){
				var formData = new FormData($( "#uploadForm" )[0]);
        $.ajax({  
          url: 'http://api.caicui.com/api/v2.1/commons/fileUpload' ,  
          type: 'POST',  
          data: formData,  
          async: false,  
          cache: false,  
          contentType: false,  
          processData: false,  
          success: function (returndata) {  

          	videoController.courseNode.imgPathArray.push(returndata.data.path);

            var $list = $('<div class="add-photo-show"><img class="add-photo-img" src="'+ CAICUI.Common.host.img + returndata.data.path +'"><a class="add-photo-remove" data-src="'+returndata.data.path+'"  href="javascript:;"><i class="icon icon-add-remove"></i></a></div>'),
            	$img = $list.find('img');

            $('body #uploadForm').before( $list );

            if($('body .add-photo-show').length >= 5){
    	    		$('body #uploadForm').hide();
    	    	}
          },  
          error: function (returndata) {
              //alert(returndata);  
          }  
       	});
			});
			$('.node-editor-isOpen').on('click','.node-editor-isOpen-button',function(e){
				

				var that = CAICUI.iGlobal.getThat(e);
				var thatPrev = that.prev();
				if(that.hasClass('active')){
					that.removeClass('active');
					thatPrev.text('私有');
					videoController.courseNode.isPublic =  1;
				}else{
					that.addClass('active');
					thatPrev.text('公开');
					videoController.courseNode.isPublic =  0;
				}

			});
			document.onkeyup = function(event){ 
			  var event = event || window.event;
			  var progress = videoController.currentTask.progress;
			  if(progress){
			  	var newProgress = 0;
			  	var total = 0;
			  	if(videoController.currentTask.taskType=="video"){
			  		total = parseInt(videoController.currentTask.videoTime);
			  	}
			  	// else if(videoController.currentTask.taskType=="exam"){
			  	// 	total = parseInt(videoController.currentTask.totalCount);
			  	// }
			  	if(event.keyCode == 37){
			  		newProgress = progress - 5;
			  		if(newProgress){
			  			videoController.cc_seek(newProgress);
			  		}else{
			  			videoController.cc_seek(0);
			  		}
			  	}else if(event.keyCode == 39){
			  		newProgress = progress + 5;
			  		if(newProgress>total){
			  			videoController.cc_seek(total);
			  		}else{
			  			videoController.cc_seek(newProgress);
			  		}
			  	}
			  }
			  
			}

    },
    addPhotoButton : function(){
			var $addPhotoButton = $('#add-photo-button'),
      // 优化retina, 在retina下这个值是2
      ratio = window.devicePixelRatio || 1,

      // 缩略图大小
      thumbnailWidth = 100 * ratio,
      thumbnailHeight = 100 * ratio,

      // Web Uploader实例
      uploader;

	    // 初始化Web Uploader
	    uploader = WebUploader.create({
	    		disableGlobalDnd : true,
	        // 自动上传。
	        //auto: true,
	        // swf文件路径
	        //swf: BASE_URL + '/js/Uploader.swf',
	        // 文件接收服务端。
	        fileNumLimit : 5,
	        server: 'http://www.caicui.com/api/v2.1/commons/fileUpload',
	        method : 'POST',
	        formData : {
	 					'token' : CAICUI.User.token
	        },
	        // 选择文件的按钮。可选。
	        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	        pick: '#add-photo-button',
	        duplicate : false,
	        // 只允许选择文件，可选。
	        accept: {
	            title: 'Images',
	            extensions: 'gif,jpg,jpeg,bmp,png',
	            mimeTypes: 'image/*'
	        }
	    });

	    // 当有文件添加进来的时候
	    uploader.on( 'fileQueued', function( file ) {
	    	
	        // var $li = $(
	        //         '<div id="' + file.id + '" class="file-item thumbnail">' +
	        //             '<img>' +
	        //             '<div class="info">' + file.name + '</div>' +
	        //         '</div>'
	        //         ),
	        //     $img = $li.find('img');

					var formData = new FormData($( "#uploadForm" )[0]);
	        $.ajax({  
            url: 'http://api.caicui.com/api/v2.1/commons/fileUpload' ,  
            type: 'POST',  
            data: formData,  
            async: false,  
            cache: false,  
            contentType: false,  
            processData: false,  
            success: function (returndata) {  

            	videoController.courseNode.imgPathArray.push(returndata.data.path);

              //alert(returndata);  
              var $list = $('<div class="add-photo-show"><img class="add-photo-img"><a class="add-photo-remove" data-id="'+file.id+'" href="javascript:;"><i class="icon icon-add-remove"></i></a></div>'),
              	$img = $list.find('img');
              $addPhotoButton.before( $list );
              // 创建缩略图
              uploader.makeThumb( file, function( error, src ) {
                  if ( error ) {
                      $img.replaceWith('<span>不能预览</span>');
                      return;
                  }
                  $img.attr( 'src', src );
              }, thumbnailWidth, thumbnailHeight );
              if($('body .add-photo-show').length >= 5){
      	    		$('body .add-photo-button').hide();
      	    	}
            },  
            error: function (returndata) {
                //alert(returndata);  
            }  
         	});
	        
	      
	    });

	    // 文件上传过程中创建进度条实时显示。
	    uploader.on( 'uploadProgress', function( file, percentage ) {
	    	console.log(3)
	        var $li = $( '#'+file.id ),
	            $percent = $li.find('.progress span');

	        // 避免重复创建
	        if ( !$percent.length ) {
	            $percent = $('<p class="progress"><span></span></p>')
	                    .appendTo( $li )
	                    .find('span');
	        }

	        $percent.css( 'width', percentage * 100 + '%' );
	    });

	    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
	    uploader.on( 'uploadSuccess', function( file ) {
	        $( '#'+file.id ).addClass('upload-state-done');
	    });

	    // 文件上传失败，现实上传出错。
	    uploader.on( 'uploadError', function( file ) {
	        var $li = $( '#'+file.id ),
	            $error = $li.find('div.error');

	        // 避免重复创建
	        if ( !$error.length ) {
	            $error = $('<div class="error"></div>').appendTo( $li );
	        }

	        $error.text('上传失败');
	    });

	    // 完成上传完了，成功或者失败，先删除进度条。
	    uploader.on( 'uploadComplete', function( file ) {
	        $( '#'+file.id ).find('.progress').remove();
	    });
	    this.$uploader = uploader;
    },
		addPhotoRemove : function(e){
			console.log(4)
			var that = CAICUI.iGlobal.getThat(e);
			
			var thatPrev = that.prev();
			var thatPrevSrc = that.attr('data-src');
			for(var i=0; i<videoController.courseNode.imgPathArray.length; i++){
				if(videoController.courseNode.imgPathArray[i] == thatPrevSrc){
					videoController.courseNode.imgPathArray.splice(i,1);
					break;
				}
			}
			var parent = that.parent();
			parent.remove();
      if($('body .add-photo-show').length < 5){
    		$('body #uploadForm').show();
    	}
		},
    saveNoteAndQuiz: function(that, type) {
        /*var imgPath = [];
        for (var i = 0; i < this.imgPath.length; i++) {
            imgPath.push(this.imgPath[i].path);
        }*/
        var textarea = $(that).parents('.contentText').find('textarea');
        var content = textarea.val();
        var time = $(that).parents('.contentText').find('.right-time').html();
        if (this.taskType == 'video') {
            if (time.indexOf(':') > 0) {
                var times = time.split(':');
                time = 0;
                if (times.length == 2) {
                    time = parseInt(times[1]) + parseInt(times[0]) * 60;
                } else if (times.length == 3) {
                    time = parseInt(times[2]) + parseInt(times[1]) * 60 + parseInt(times[0]) * 60 * 60;
                }

            } else {
                time = parseInt(time);
            }
        } else if (this.taskType == 'exam') {
            time = time.replace(/第/g, "");
            time = time.replace(/题/g, "");
            time = parseInt(time);
        }

        if (content == "") {
            layer.msg('内容不能为空', function() {});
            return false;
        }
        videoController.courseNode.imgPath = '';
        if(videoController.courseNode.imgPathArray.length){
        	for(var i=0;i<videoController.courseNode.imgPathArray.length;i++){
        		i ? videoController.courseNode.imgPath += ',' + videoController.courseNode.imgPathArray[i] : videoController.courseNode.imgPath += videoController.courseNode.imgPathArray[i];
        	}
        }else{
        	videoController.courseNode.imgPath = '';
        }
        var data = {
            token : CAICUI.User.token,
			
						content : content,

						categoryId : videoController.courseData.categoryId,
						subjectId : videoController.courseData.subjectId,
						courseId : videoController.courseData.courseId,
						
						chapterId : videoController.currentChapter.chapterId,
						taskId : videoController.currentChapter.tasks[videoController.lasttaskindex].taskId,

						categoryName : videoController.courseData.categoryName,
						subjectName : videoController.courseData.subjectName,
						courseName : videoController.courseData.courseName,
						chapterName : videoController.currentChapter.chapterTitle,
						taskName : videoController.currentChapter.tasks[videoController.lasttaskindex].title,
						
						taskProgress:parseInt(videoController.currentChapter.tasks[videoController.lasttaskindex].progress),
						taskType:videoController.currentChapter.tasks[videoController.lasttaskindex].taskType,
						imgPath:videoController.courseNode.imgPath,

						clientType : 'pc'
        };

        if (type == 'quiz') {
            data.title = $(that).parents('.contentText').find('.right-title-input').val();
            data.task = videoController.currentChapter.tasks[videoController.lasttaskindex].title;
            // data.id = iMobile.constant.user['memberId'];
            // data.typeId = videoController.taskTypeId;
            // data.courseId = videoController.courseId;
            //var api = 'studytools/questionsave';
            var api = 'studytools/questionsave';
            var close = "quiz";
            if (data.title == "") {
                layer.msg('"标题不能为空', function() {});
                return false;
            }
            //opt.ask(data);
        } else if (type == 'note') {
            data.title = "笔记";
            data.isPublic = $(that).parents('.contentText').find('div.imgUpLoad input[type="checkbox"]').is(':checked')?0:1;
            //data.id = '';
            //data.taskName = videoController.currentTask.title;
            //data.value = time;
            //data.taskType = videoController.taskType;
            //data.typeId = videoController.taskTypeId;
            var api = 'studytools/nodesave';
            var close = "note";
            //opt.note(data);
        }
        //console.log(data)
        videoController.load = layer.load(1, {
            shade: [0.5,'#000'] //0.1透明度的白色背景
        });
        request.ajax({
        	version : '2.1',
    			server : api,
    			type : "POST",
    			data : data,
    			done : function(data){
    				if (data.state == 'success') {
    					//videoController.closeSidebar();
    				    //layer.msg("保存成功", function() {});

    				    //$('.layui-layer').css('z-index', '2000');
    				    //$('span[class="close"]').trigger("click");
    				    //cc.module.errorMsg(datas.msg);

    				    layer.close(videoController.load);
    				    layer.msg('保存成功！', {
    				    	shade: true,
    				    	icon: 1,
    				    	time: 500
    				    },function(){
    				    	videoController.closeSidebar();
    				    	$('.right-title-input').val('');
    				    	textarea.val('');
    				    	//storage.remove('xneditor_pdata_message');
    				    	//window.history.back(-1);
    				    });
    				}
    			},
					fail : function(data){
						layer.msg('Sorry~ 笔记保存失败', function() {});
					}
    		})
  		
  			imgPath="";//把图片清空
        // iMobile.ajax(false, 'POST', api, data, function(datas) {
        //     if (datas.state == 'success') {
        //         layer.msg("保存成功", function() {});
        //         $('.layui-layer').css('z-index', '2000');
        //         $('span[class="close"]').trigger("click");
        //         //cc.module.errorMsg(datas.msg);
        //     }
        // })
    },
    showTask:function(type,it){
    	this.currenttaskType=type;
			switch (type){
				case 'video':
					$('.ctrLeft1').show();
					$('.video-play').show();
					$('.myExercises').hide();
					$('.ctrLeft2').hide();
					
					/*this.video.id=it.taskId,
					this.video.playerType=0,  //0:swf 1:video
					this.video.currentTime=0, //当前播放时间
					this.video.totalTime=it.videoTime, //视频总时长
					this.video.video=it.videoCcid,      //cc视频vid标识
					this.video.videoSiteId=it.videoSiteId, //cc视频objectID标识
					this.video.attachmentPath=it.attachmentPath,
					this.video.progress=0; */ 
					this.doVideo();
					//videoPega();
					break;
				case 'exam':
					$('.video-play').hide();
					$('.ctrLeft1').hide();
					$('.myExercises').show();
					$('.ctrLeft2').show();
					/*this.exam = {
	                    id:it.taskId,
						items:it.totalCount,
						testCount:it.totalCount
					}
					if(this.thatVideoTime != null){
						this.exam.testCount = this.thatVideoTime;
					}*/
					videoController.exercisePege();
					break;
				case 'doc':
					break;
				case 'vocabulary':
					break;
			}
		},
		doVideo:function(){

			this.player=null;
			nowcc_vid="";
			nowcc_objectID="";
			if(window.clientType == "exe"){
				//cc_winplayer.beginPlay("http://www.caicui.com/studycenter2.2/scripts/html/videoframe.html?videoCcid="+videoController.currentTask.videoCcid+"&videoSiteId="+videoController.currentTask.videoSiteId,2);
			
				//if(window.location.protocol=="file:"){
				//有本地的缓存完整视频优先播放
				var downstatus = 1 || cc_winplayer.getTasksDownStatus(videoController.currentTask.taskId).split('@~');
				//WINAPI.log("下载进度："+parseInt(downstatus[5]));
				if(parseInt(downstatus[5])>99){
					//WINAPI.log("播放视频，任务已完成");
					videoController.playerType = 2;
					var authorizationPath = WINAPI.GetProjectPath('#')+ 'playcode.txt';
					if(WINAPI.GetFileSize(authorizationPath)){
						if(100000<WINAPI.GetFileSize(WINAPI.GetProjectPath()+"mainfile#download#"+parseInt(downstatus[0])+".caicui")){
							var playstatus = cc_winplayer.beginPlay(WINAPI.GetProjectPath()+"mainfile#download#"+parseInt(downstatus[0])+".caicui",1);
							if(playstatus == "true" || playstatus == true ){
							}else{
								$('.video-play div.content').show();
								$('.video-play div.content').html("<p style='color:#dddddd;text-align:left;margin-left:8px;'>您的授权已失效，无法播放缓存的视频文件。<br/>如有疑问，请联系客服。</p>");
							}
						}else{
							$('.video-play div.content').show();
							$('.video-play div.content').html("<p style='color:#dddddd;text-align:left;margin-left:8px;'>您缓存的视频文件已不存在，请删除重新下载。<br/>如有疑问，请联系客服。</p>");
						}
						
					}else{
						$('.video-play div.content').show();
						$('.video-play div.content').html("<p style='color:#dddddd;text-align:left;margin-left:8px;'>您下载的财萃课堂还没有获得授权，无法播放本地缓存的视频文件。<br/>通常您的账号在第一次登陆后的24小时之内自动获得授权。<br/>如有疑问，请联系客服。</p>");
					}
					
				}else{
					//没有本地的缓存视频
					//WINAPI.log("播放视频，任务未完成，播放在线视频");
					videoController.playerType = 3;
					$('.video-play div.content').hide();
					//var frameobj=document.getElementById("ccvideoframe");
					//if($("#ccvideoframe").length>0){
					//	WINAPI.log("播放视频，任务未完成，播放在线视频1111111");
					var playstatus = cc_winplayer.beginPlay("http://www.caicui.com/studycenter2.2/scripts/html/videoframe.html?videoCcid="+videoController.currentTask.videoCcid+"&videoSiteId="+videoController.currentTask.videoSiteId,2);
					//$("#ccvideoframe").attr("src","http://www.caicui.com/studycenter2.2/scripts/html/videoframe.html?videoCcid="+videoController.currentTask.videoCcid+"&videoSiteId="+videoController.currentTask.videoSiteId);
					//}else{
					//	WINAPI.log("播放视频，任务未完成，播放在线视频2222222");
					//	$('.video-play div.content').html('<iframe id="ccvideoframe" src="http://www.caicui.com/studycenter2.2/scripts/html/videoframe.html?videoCcid='+videoController.currentTask.videoCcid+'&videoSiteId='+videoController.currentTask.videoSiteId+'" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" />');
					//}	
				}
				
			}else{
				if(window.location.origin!=='http://www.caicui.com'){
					//测试视频
					videoController.currentTask.videoCcid = '313A5C7994F57292';
					$('.video-play div.content').html('<script src="http://union.bokecc.com/player?vid=313A5C7994F57292&siteid=07552B247EACAED4&autoStart=false&width=848&height=450&playerid=55295D704B531A0D&playertype=1" type="text/javascript">');
				}else{

					$('.video-play div.content').html('<script  src="http://p.bokecc.com/player?vid=' + videoController.currentTask.videoCcid + '&siteid=' + videoController.currentTask.videoSiteId + '&autoStart=true&width=100%&height=100%&playerid=cc_' + videoController.currentTask.videoCcid + '&playertype=1' + '" > </script>');
				}
				
				
				//$('.video-play div.content').html('<script>alert("1");</script>');
				var scripts = document.getElementsByTagName("script");
				var upindex = -1;
					for(var i = 0;i < scripts.length;i=i+1){
						var script = scripts[i];
						if(script.src.indexOf("http://union.bokecc.com/player") == -1 || script.src.indexOf("http://p.bokecc.com/player") == -1){
							if(upindex != -1){
								scripts[upindex].src="";
							}
							upindex = i;
							continue;
						}
					}
			}
			CAICUI.render.videoCcid  = videoController.currentTask.videoCcid;
			videoController.saveVideo();
			//videoController.cc_play();
			
		},
		doDoc:function(){
		},
		doVocabulary:function(){
		},
		//stop:视频结束保存 finish:视频播放结束
		saveVideo:function(stop){
			if(stop == 'stop'){
				clearInterval(videoController.saveVideoProgressSetinterval);
			}else if(stop == 'finish'){
				clearInterval(videoController.saveVideoProgressSetinterval);
				if(videoController.oldProgress!=videoController.currentTask.progress){
					videoController.currentTask.progress=videoController.currentTask.videoTime;
					videoController.oldProgress=videoController.currentTask.progress;
					videoController.saveProgress();
				}
			}else{
				videoController.oldProgress = 0;
				videoController.saveVideoProgressSetinterval = setInterval(function(){
					if(videoController.oldProgress<videoController.currentTask.progress){
						videoController.oldProgress=videoController.currentTask.progress;
						videoController.saveProgress();
					}
				},120000);
			}
		},
		saveProgress : function(str){
			//if(videoController.currentTask.progress>0 && videoController.currentTask.videoTime>0){
			if(videoController.currentTask.videoTime>0 || videoController.currentTask.totalCount>0){
				var state="init";
				if(videoController.currentTask.progress/videoController.currentTask.videoTime>0.9||videoController.currentTask.progress/videoController.currentTask.totalCount>0.9){
					state="complate";
					videoController.currentTask.progressstate = '1';
					//videoController.currentChapter.tasks[videoController.lasttaskindex].progressstate = '1';
				}
				var progress = 0;
				if(videoController.currentTask.progress){
					progress = parseInt(videoController.currentTask.progress);
				}
				if(str == 'init' && progress == 0){
					progress = 1;
				}

				var total = 0;
				if(videoController.currentTask.taskType=="video"){
					total = parseInt(videoController.currentTask.videoTime);
				}else if(videoController.currentTask.taskType=="exam"){
					total = parseInt(videoController.currentTask.totalCount);
				}
				request.ajax({
					server : "chapter/taskProgress",
					type : "POST",
					data : {
						token:CAICUI.User.token,
						memberId:CAICUI.User.memberId,
						progress:progress,
						total:total,
						
						taskId:videoController.currentTask.taskId,				
						chapterId:videoController.currentChapter.chapterId,
						courseId:videoController.courseData.courseId,
						//subjectId:videoController.courseData.subjectId,
						categoryId:videoController.courseData.categoryId,
						
						taskName:videoController.currentTask.title,
						chapterName:videoController.currentChapter.chapterTitle,
						courseName:videoController.courseData.courseName,
						subjectName : videoController.courseData.subjectName,
						categoryName : videoController.courseData.categoryName,
						
						
						memberName:CAICUI.User.nickname,
						state:state
					},
					done : function(data){
					},
					fail : function(data){
						console.log(data)
					}
				})
			}
		},
		saveExam:function(progress){
			videoController.currentTask.progress=progress;
			videoController.saveProgress();
		},
		exercisePege:function(){
			var spanDiv = $('.spans');
				ctrUl = $('.ctrRight');
				iframeSite = "http://www.caicui.com"+videoController.currentTask.examUrl;
				exerciseId = videoController.currentTask.taskId;
				spanLength = videoController.currentTask.totalCount;
			var activeText=0;
				/*if(videoController.taskProgress[videoController.currentTask.taskId]){
					activeText = videoController.taskProgress[videoController.currentTask.taskId];//试卷进度
				}*/
				activeText = videoController.currentTask.progress;//试卷进度
			activeText = activeText>spanLength ?spanLength :activeText;
			console.log('完成题数'+activeText+'/总题数'+spanLength);
			$('#exercisText').attr('src',iframeSite);
			spanDiv.children().remove();
			for(var i=0;i<spanLength;i++){
				var span = $('<span>');
				span.html(i+1);
				spanDiv.append(span);
			}
			spanDiv.css('width',spanLength*40);
			if(activeText>0){
				spanDiv.children('span').eq(activeText-1).addClass('active').prevAll().addClass('over');
				spanDiv.children('span').eq(activeText-1).nextAll().removeClass('active');
			}else if(activeText == undefined ||activeText == ''||activeText == null){
				spanDiv.children('span').first().addClass('active');
			}
			//屏幕宽度变化控制框的宽度
			function widthSize(){
				if($(window).width()>1200){
					videoController.notAllowed()
					//$('.ctrLefts').css('margin-right','209px');
					//ctrUl.css('width','209');
				}else if($(window).width()>768){
					videoController.notAllowed()
					//$('.ctrLefts').css('margin-right','138px');
					//ctrUl.css('width','138');
				}
			}
			widthSize();
			$(window).resize(function(){
				if($('.myExercises').is(':visible')){
					widthSize();
				}
			})
			
			//答题讲义部分不显示
			if($('.myExercises').is(':visible')){
				$('.ctrOption[control="handout"]').hide();
				$('.ctrRight').css("width","133px");
			}else{
				$('.ctrOption[control="handout"]').show();
			}

			//判断是否加载完成

			var iframe = document.getElementById("exercisText");
			if (iframe && iframe.attachEvent){
				iframe.attachEvent("onload", function(){
					videoController.listIndex();
				});
			} else if(iframe){
				iframe.onload = function(){
					videoController.listIndex();
				};
			}
			videoController.ExerciseController();  //试题控制
		},
		//题目列表active索引值变化时触发
    listIndex:function(){
			var spanIndex = $('.spans span.active').index();
			var data ={"type":201,"data":{"number":spanIndex}};
			var iframe = document.getElementById("exercisText");
			iframe.contentWindow.postMessage(JSON.stringify(data),'http://www.caicui.com');
			//var ifrDiv = $('#exercisText').contents().find('.practice');
			//ifrDiv.eq(spanIndex).show().siblings().hide();
		},
		//提交试卷
    saveTest : function(){
    	//提交试卷，发送任务进度,当前任务标记为完成
    	videoController.saveProgress();
    	$('#'+videoController.currentTask.taskId).addClass('video-icon-task-success');
			var data ={"type":202};
			var iframe = document.getElementById("exercisText");
			iframe.contentWindow.postMessage(JSON.stringify(data),'http://www.caicui.com');
			
			//var ifrDiv = $('#exercisText').contents().find('.practice');
			//var spanIndex = ifrDiv.length-1;
			//ifrDiv.eq(spanIndex).show().siblings().hide();
			//$(window.parent.document).contents().find("#exercisText")[0].contentWindow.saveTest();
			//opt.testend(videoController.correctNum());
		},
    correctNum : function(){
			//return parseInt($('#exercisText').contents().find('#rigthNums').text());
		},
		//判断上下题是否可点
		notAllowed:function(){
			if($('.spans span.active').index()==0){
				$('.prevs').addClass('disableBut').removeClass('readyBut');
				$('.prev').addClass('disableBut').removeClass('readyBut');
				$('.nexts').addClass('readyBut').removeClass('disableBut');
				$('.nexts').css({"display":"inline-block"});
				$('.next').addClass('readyBut').removeClass('saveTest disableBut').html('下一题<i class="glyphicon glyphicon-chevron-right"></i>');
				// $('.saveTest').css({"display":"none"});
			}else if($('.spans span.active').index()== $('.spans span').length-1){
				$('.nexts').addClass('disableBut').removeClass('readyBut');
				$('.nexts').css({"display":"none"});
				//            $('.next').addClass('disableBut').removeClass('readyBut');
				$('.next').addClass('saveTest').removeClass('readyBut').html('交卷');
				$('.prevs').addClass('readyBut').removeClass('disableBut');
				$('.prev').addClass('readyBut').removeClass('disableBut');
				//            $('.saveTest').css({"display":"inline-block","cursor":"pointer"});
			}else if($('.spans span.active').index()!=0 && $('.spans span.active').index()!= $('.spans span').length-1){
				$('.prevs').addClass('readyBut').removeClass('disableBut');
				$('.prev').addClass('readyBut').removeClass('disableBut');
				$('.nexts').addClass('readyBut').removeClass('disableBut');
				$('.nexts').css({"display":"inline-block"});
				//            $('.next').addClass('readyBut').removeClass('disableBut');
				$('.next').removeClass('saveTest disableBut').addClass('readyBut').html('下一题<i class="glyphicon glyphicon-chevron-right"></i>');
				//            $('.saveTest').css({"display":"none"});
			}

			if($('.spans span').length==1){
				$('.prevs').addClass('disableBut').removeClass('readyBut');
				$('.prev').addClass('disableBut').removeClass('readyBut');
				$('.nexts').addClass('disableBut').removeClass('readyBut');
				$('.nexts').css({"display":"none"});
				$('.next').removeClass('saveTest').addClass('disableBut').html('下一题<i class="glyphicon glyphicon-chevron-right"></i>');
				//            $('.saveTest').css({"display":"inline-block","cursor":"pointer"});
			}
		},
		//试题控制
    ExerciseController : function(){
			var testStatus="test";
			$('.spans').on('click','span',function(){
				$(this).addClass('active').siblings().removeClass('active');
				videoController.notAllowed();
				videoController.listIndex();
				videoController.saveExam(achieveTopic());
			})
			function left(){
				var spanSize = $('.spans span').length;
				var sWidth = $('.spans span').eq(0).outerWidth(true);
				var divWidth = $('.spanIocn').width();
				var span = $('.spans span.active');

				if(divWidth < sWidth*spanSize){
					if(span.prev().length != 0){
						$('.spans').animate({
							left:'+=37px'
						},'fast');
						span.prev().addClass('active').siblings().removeClass('active');
					}
				}else{
					if(span.prev().length != 0){
						span.removeClass('active');
						span.prev().addClass('active');
					}
				}
			}
			function right(){
				var spanSize = $('.spans span').length;
				var sWidth = $('.spans span').eq(0).outerWidth(true);
				var divWidth = $('.spanIocn').width();
				var span = $('.spans span.active');
				if(divWidth < sWidth*spanSize){
					if(span.next().length != 0){
						$('.spans').animate({
							left:'-=37px'
						},'fast');
						span.next().addClass('active').siblings().removeClass('active');
					}
				}else{
					if(span.next().length != 0){
						span.removeClass('active');
						span.next().addClass('active');
					}
				}
			}

			//        notAllowed();

			//获取完成题数
			function achieveTopic(){
				//            var s1 = '';
				//            if($('.spans .over').length == $('.spans span').length-1){
				//                s1 = $('.spans span').length;
				//            }else{
				//                s1 = $('.spans .over').length;
				//            }
				//            return s1;
				return $('.spans .active').index()+1;
			}

			//初始化active位置
			function activePlace(){
				var aIndex = $('.spans').children('.active').index(),
					parDiv = $('.spanIocn').width(),
					sWidth = $('.spans span').eq(0).outerWidth(true);
				if($('.spans').width()>parDiv){
					$('.spans').css('left',-(aIndex*sWidth));
				}else{
					$('.spans').css('left','');
				}
			}
			activePlace();
			$(window).resize(function(){
				activePlace();
			})

			function rollAnimate(){
				$('.prevs').on('click',function(){
					if(testStatus=="saveTest"){
						testStatus="test";
					}else{
						left();
					}
					videoController.notAllowed();
					videoController.listIndex();
					videoController.saveExam(achieveTopic());
				});
				$('.nexts').on('click',function(){
					right();
					videoController.notAllowed();
					videoController.listIndex();
					videoController.saveExam(achieveTopic());
				});
				$('.ctrIocn .prev').click(function(){
					left();
					videoController.notAllowed();
					videoController.listIndex();
					videoController.saveExam(achieveTopic());
				});
				$('.ctrIocn .next').click(function(){
					if($(this).hasClass('saveTest')){
						testStatus="saveTest";
						videoController.saveTest();
					}else{
						right();
						videoController.notAllowed();
						videoController.listIndex();
						videoController.saveExam(achieveTopic());
					}
				});

				$(document).on('keyup',function(event){
					if(event.keyCode == 39){
						right();
						videoController.notAllowed();
						videoController.listIndex();
					};
					if(event.keyCode == 37){
						left();
						videoController.notAllowed();
						videoController.listIndex();
					}
				})

			}
			rollAnimate();
			videoController.notAllowed();



			//答案解析显示问题
			$('.analysis').click(function(){
				var spanIndex = $('.spans span.active').index();
				var data ={"type":203,"data":{"number":spanIndex}};
				var iframe = document.getElementById("exercisText");
				iframe.contentWindow.postMessage(JSON.stringify(data),'http://www.caicui.com');
				
				//var ifrDiv = $('#exercisText').contents().find('.practice');
				//ifrDiv.eq(spanIndex).find('.exam-answer').show();
			})
		},
	  taskChange : function(){
	  	videoController.cc_taskStatus();
			//任务跳转时，如果当前播放的是加密视频，需要提前关闭
			//cc播放器
			if(videoController.playerType == 0){				
				//exe播放器
			}else if(videoController.playerType == 2){
				WINAPI.SetPlayerHide(1);
				WINAPI.SetPlayerPause();
			}else if(videoController.playerType == 3){
				cc_winplayer.SetIframePlayerHide(1);
				var data ={"type":101}; 
				cc_winplayer.sendMessageToIframe(JSON.stringify(data));
			}
						
	    	var that = $(this);
	    	if(that.hasClass('active')){
	    		return false;
	    	}else{
	    		//videoController.taskActive = that.find('span').text();
	    		that.siblings().removeClass('active');
	    		$('studycenter-video-task-next').removeClass("box-visibility");
	    		that.addClass('active');
	    		$('.studycenter-video-tasks-center').addClass("hidden");
	    		console.log($(that).attr("data-index"));
	    		
	    		//跳转到章节总结结束页面
	    		if(parseInt($(that).attr("data-index"))==videoController.currentChapter.tasks.length){
	    			$('.studycenter-video-task-end').addClass("active");
	    			$('.studycenter-video-task-next').addClass("box-visibility");
	    			$('.studycenter-video-tasks-center').removeClass("hidden");
	    			$('.studycenter-video-tasks-unfinished').addClass("hidden");
	    			$('.studycenter-video-tasks-finished').addClass("hidden");
	    			//判断章节任务是否全部完成
	    			console.log("videoController.currentChapter:");
	    			console.log(videoController.currentChapter);
	    			var allfinish=true;
	    			for(var i=0;i<videoController.currentChapter.tasks.length;i++){
	    				if(videoController.currentChapter.tasks[i].progressstate == '0'){
	    					allfinish = false;
	    				}
	    			}
	    			if(allfinish){
	    				$('.studycenter-video-tasks-finished').removeClass("hidden");
	    			}else{
	    				$('.studycenter-video-tasks-unfinished').removeClass("hidden");
	    			}
	    			//如果之前是视频，需要暂停
	    			$('.studycenter-video-main').remove();
	    		}else{
	    			videoController.lasttaskindex=parseInt($(that).attr("data-index"));
	    			videoController.currentTask=videoController.currentChapter.tasks[videoController.lasttaskindex];
	    			videoController.initDom();
	    		}
	    	}
	  },
    
    continuetask : function(){
    	$('.studycenter-video-task-a').eq(videoController.lasttaskindex).click();
    },
    closeSidebar : function(){
    	var videoRight = $('.studycenter-video-right');
			videoRight.siblings().addClass('hidden');

    	videoController.cc_play();
    	videoController.animateSidebar(0,500);
			//exe播放时，点击笔记，提问，讲义按钮时，调整播放窗口大小
			if(videoController.playerType == 2 || videoController.playerType == 3){
				cc_winplayer.ChangePlayerWH();
			}
    },
    openSidebar : function(){
    	var index = $(this).index();
    	var videoRight = $('.studycenter-video-right').eq(index);
    	videoController.cc_pause();

    	if(videoRight.hasClass('hidden')){
    		videoRight.siblings().addClass('hidden');
    		videoRight.removeClass('hidden');
    		videoController.animateSidebar(400,500);

    		CAICUI.render.taskId = videoController.currentTask.taskId;
    		CAICUI.render.progerss = videoController.currentTask.progress;
    		$(".right-time").html(videoController.formatSeconds(videoController.currentTask.progress));
    		
    		switch (index){
    			case 0:
    				videoController.showQuestions()
    				break;
    			case 1:
    				videoController.showNode()
    				break;
    			case 2:
    				videoController.showHandout()
    				break;
				case 3:
    				//videoController.showSetting()
					if(videoController.playerType == 2){
						$(".speedCtr").show();
					}else{
						$(".speedCtr").hide();
					}
    				break;
    			default:
    				break;
    		}
    	}else{
    		//$('.studycenter-video-main').removeClass('active');
    		videoController.animateSidebar(0,500)
    		videoRight.addClass('hidden');
    	}
			//exe播放时，点击笔记，提问，讲义按钮时，调整播放窗口大小
			if(videoController.playerType == 2 || videoController.playerType == 3){
				cc_winplayer.ChangePlayerWH();
			}
    },
    animateSidebar : function(num,time){
    	/*$('.studycenter-video-main').animate({
    			'padding-right' : num
    		},time)
    		$('.studycenter-video-main-right').animate({
    			'right' : -(400-num)
    		},time)*/
    	$('.studycenter-video-main').css({
    			'padding-right' : num
    		})
    		$('.studycenter-video-main-right').css({
    			'right' : -(400-num)
    		})
    },
    showQuestions : function(){
    	videoController.imgUpLoad('quiz');
    	$('#ac-new-video').attr('src','script/libs/xneditor/ac-new-video.html');
    },
    showNode : function(){
    	$('body .node-editor-textarea').val('');
    	$('body .add-photo-show').remove();
    	//videoController.addPhotoButton();
    	videoController.imgUpLoad();
    },
    showHandout : function(){
    	videoController.handout();
    },
    imgUpLoad: function(type) {
        $('#imgUpLoadNote').html('');
        $('#imgUpLoadQuiz').html('');
        if (type == 'quiz') {
            var imgUpLoads = 'imgUpLoadQuiz';
            var title = '公开提问';
        } else {
            var imgUpLoads = 'imgUpLoadNote';
            var title = '公开笔记';
        }
        var zyUploaData = {
            width            :   "100%",                 // 宽度
        //		height           :   "400px",                 // 宽度
            itemWidth        :   "90px",                 // 文件项的宽度
            itemHeight       :   "70px",                 // 文件项的高度
            url              :   'http://api.caicui.com/api/v2.1/commons/fileUpload',  // 上传文件的路径
            multiple         :   true,                    // 是否可以多个文件上传
            //dragDrop         :   true,                    // 是否可以拖动上传文件
            dragDrop         :   false,                    // 是否可以拖动上传文件
            del              :   true,                    // 是否可以删除文件
            finishDel        :   false,  				  // 是否在上传文件完成后删除预览
            /* 外部获得的回调接口 */
            onSelect: function(files, allFiles){                    // 选择文件的回调方法
                $("#fileSubmit").click();
            },
            onDelete: function(file, surplusFiles){                     // 删除一个文件的回调方法
            },
            onSuccess:function(file,response){   
                console.log(response);
                console.log("此文件上传成功：");
            },
            onFailure: function(file){                    // 文件上传失败的回调方法
            },
            onComplete: function(responseInfo){           // 上传完成的回调方法
            }
        }


        //$("#" + imgUpLoads).zyUpload(zyUploaData);
        $('.add_upload .uploadImg').text('+');
    },
    handout : function(){
    	$('#scanImg').html('');

    	if (videoController.currentTask.attachmentPath == "") {
    	    $('#scanImg').next().html("当前视频暂无讲义下载");
    	    $('.downloadList').html('');
    	} else {
    	    //            var qrcode = new QRCode("scanImg", {
    	    //                text: "text",
    	    //                width: 204,
    	    //                height: 203,
    	    //                colorDark : "#000000",
    	    //                colorLight : "#ffffff",
    	    //                correctLevel : QRCode.CorrectLevel.H
    	    //            });
    	    //            qrcode.makeCode(imgAddress+videoController.video.attachmentPath); // make another code.
    	    $('#scanImg').html('<img src="' + CAICUI.Common.host.IPLocation + 'commons/qrCode?v=' + CAICUI.Common.host.img + videoController.currentTask.attachmentPath + '" />');
    	    $('.downloadList').html('<li><a href="' + CAICUI.Common.host.img + videoController.currentTask.attachmentPath + '" target="_blank"><span></span>' + videoController.currentTask.title + '</a></li>');
    	}
    },
    videoSound : function(){
    	var soundCtr = $(this).next('.volumeCtr');
    	if (soundCtr.is(':hidden')) {
    	    soundCtr.show();
    	    $(this).addClass('active');
    	    setTimeout(function() {
    	        $('.volumeCtr').hide();
    	    }, 5000);
    	} else {
    	    soundCtr.hide();
    	    $(this).removeClass('active');
    	}
    },
    //视频进度条
    playController : function(){
    	//视频进度条
			$('#playCtr').slider({
				range: "min",
				animate:'fast',
				max:100,
				start: function( event, ui ){
					console.log("ctrl get start");
					userOP=true;
				},
				//回调滑块位置变化结束后触发
				//        change: function( event, ui ) {
				//            var videoTime = videoController.cc_getDuration();
				//            var volume = videoTime*ui.value/100;
				//            $('.beforeTime').text(ui.value);
				//            videoController.cc_seek(volume);
				//        },
				//        //回调滑块位置变化时触发
				//        slide: function(event, ui){
				//            $('.beforeTime').text(ui.value);
				//        },
				stop: function( event, ui ) { 
			
					var videoTime = videoController.currentTask.videoTime;
					var volume = videoTime*(ui.value/100); 
					//$('.beforeTime').text(ui.value);
					userOPTime=volume;
					//cc播放器
					if(videoController.playerType == 0){
						videoController.cc_seek(volume);
					//exe播放器
					}else if(videoController.playerType == 2){
						WINAPI.log("设置视频指定播放时间："+volume);
						WINAPI.SetPlayerBegin(volume);
						//设置时间跳转成功
						on_player_seek(0,volume);
					}else if(videoController.playerType == 3){
						WINAPI.log("设置视频指定播放时间："+volume);
						var data ={"type":100,"data":{"time":volume}}; 
						cc_winplayer.sendMessageToIframe(JSON.stringify(data));
					}
					console.log("ctrl get stop:"+volume);
					//userOP=false;
					//videoController.cc_slide();
					//opt.drug(opt.drugBeginTime,videoController.cc_getPosition());
				}
			});
    },
    cc_player_init:function(vid, objectID ){
			$('head div[id^=cc_video_]').remove();//移除cc在head头部的缓存视频节点
			var playerObj=this.cc_getSWF( objectID );
			try{
				if(vid==videoController.currentTask.videoCcid){
					if(playerObj.length>1){
						videoController.player = playerObj[playerObj.length-1];
					}else{
						videoController.player = playerObj;
				
					}
					videoController.playerType = 0;
					//videoController.video.keyboard_enable=0;
					videoController.player.setConfig(videoController.ccSetConfig );
					videoController.cc_play();
					//初始化完毕，更新视频时长为真实的视频时长
					videoController.currentTask.videoTime=videoController.player.getDuration();
					// //初始化完毕，跳转到上次的进度继续播放
					// videoController.taskProgress=20;
					// if(videoController.taskProgress){
					// 	videoController.cc_seek(videoController.taskProgress);
					// }else{
					// 	videoController.cc_seek(videoController.currentTask.progress);
					// }
							
				}
		
			}catch(e){
				console.log("can't get player obj");
			}
		},
		cc_getSWF:function(swfID ) {
			if (window.document[ swfID ]) {
				return window.document[ swfID ];
			} else if (navigator.appName.indexOf("Microsoft") == -1) {
				if (document.embeds && document.embeds[ swfID ]) {
					return document.embeds[ swfID ];
				}
			} else {
				return document.getElementById( swfID );
			}
		},
		cc_play:function(){
			if(videoController.player && videoController.currentTask.taskType=="video"){
				videoController.player.start();
			}
		},
		cc_pause:function(){
			if(videoController.player && videoController.currentTask.taskType=="video"){
				videoController.player.pause();
			}
		},
    cc_setVolume: function(volume) {
        if (videoController.player && videoController.currentTask.taskType=="video") {
            videoController.player.setVolume(volume);
        }
    },
    cc_seek: function(time) {
      if (videoController.player && videoController.currentTask.taskType=="video") {
        videoController.player.seek(time);
      }
    },
		exe_player_init:function(){
			videoController.playerType = 2;					
			//初始化完毕，更新视频时长为真实的视频时长
			videoController.currentTask.videoTime=WINAPI.PlayerDuration();
			WINAPI.log("视频总时长："+videoController.currentTask.videoTime);
			//初始化完毕，跳转到上次的进度继续播放
			if(videoController.currentTask.progress > 20){
				WINAPI.SetPlayerBegin(videoController.currentTask.progress);
			}
		},
		cciframe_player_init:function(){
			videoController.playerType = 3;					
			//初始化完毕，更新视频时长为真实的视频时长
			videoController.currentTask.videoTime=window.videototaltime;
			WINAPI.log("视频总时长："+videoController.currentTask.videoTime);
			//初始化完毕，跳转到上次的进度继续播放
			if(videoController.currentTask.progress > 20){
				var data ={"type":100,"data":{"time":videoController.currentTask.progress}}; 
				cc_winplayer.sendMessageToIframe(JSON.stringify(data));
			}
		},
    cc_taskStatus: function() { //定时更新任务状态			
    	if(videoController.slideIntervalstop){
    		clearInterval(videoController.slideIntervalstop);
    	}
      var that = this;
			var delayTime=1000; //默认为1秒更新一次，如果用户有点击，拖拽等行为，将调整为5秒后再更新
			videoController.slideIntervalstop = setInterval(function(){
				//用户有操作而且回调和操作次数不一致
				if(userOPTime!=userOPCCCallBackTime || userOP ){ 
					console.log("slideIntervalstop:"+userOPTime+"|"+userOPCCCallBackTime);
					delayTime=5000;
					return;
				}else{
					delayTime=1000;
				}
			
				switch(videoController.currentTask.taskType){
					case "video":
						//判断cc播放器是否加载完成
						//sendMessageToIframe("dsfds()sdfdsf");
          	if($('.video-play div.dummy').html()=="finish" && videoController.playerType == 0){
          		videoController.cc_player_init(nowcc_vid,nowcc_objectID);
          		$('.video-play div.dummy').html("play");
          	}
						
						if($('.video-play div.dummy').html()=="finish" && videoController.playerType == 3){
          		videoController.cciframe_player_init();
          		$('.video-play div.dummy').html("play");
          	}
						//判断exe播放器是否加载完成
						if(window.clientType == "exe" && $('.video-play div.dummy').html()=="load" && videoController.playerType == 2){
						//if(window.location.protocol=="file:" && $('.video-play div.dummy').html()=="load" && videoController.playerType == 2){
							var playTime = WINAPI.GetPlayTime();
							//5秒之内顺利播放3秒认为播放进入正常状态
							if(playTime>1){
								videoController.exe_player_init();
								$('.video-play div.dummy').html("play");
							}
						}
	          if($('.video-play div.dummy').html()=="stop"){
							videoController.saveVideo('finish');
							$("#"+videoController.currentTask.taskId).removeClass(["active"]);
							$("#"+videoController.currentTask.taskId).addClass("video-icon-task-success");
							clearInterval(videoController.videoSetinterval);
							//opt.stop();
							//任务完成，提示是否自动切换到下一个任务
							//videoController.automaticSwitch();
						}
						
						/*if(WINAPI.videoInitFinish == 1){
	                		videoController.exe_player_init();
	                		$('.video-play div.dummy').html("play");
	                	}*/
    
						if(videoController.playerType == 0 && videoController.player == null && videoController.currentTask.videoCcid != "" && videoController.currentTask.videoSiteId != ""){
							that.initvideo(videoController.currentTask.videoCcid,videoController.currentTask.videoSiteId);//检测是否是移动video视频
							//检测是否是flash视频，由cc自动调用回调函数:on_cc_player_init
							break;
						}
						switch(0){
							case 0:
								var ct=0;
								var tt=100;
								//cc播放器
								if(videoController.playerType == 0){
									ct=videoController.player.getPosition();
									tt=videoController.player.getDuration();
								//exe播放器
								}else if(videoController.playerType == 2){
									ct=WINAPI.GetPlayTime();
									tt=WINAPI.PlayerDuration();
								}else if(videoController.playerType == 3){
									ct=window.videocurrentime;
									tt=window.videototaltime;
								}
								if(typeof(ct) === 'number' && typeof(tt) === 'number'){
									//that.video.currentTime = ct;
									//that.video.totalTime = tt;
									//videoController.currentProgress=ct;
									videoController.currentTask.progress=ct;
								}else{
									console.log("获取视频时间异常ct:"+ct);
									console.log("获取视频时间异常tt:"+tt);
								}
								break;
							case 1:
								//that.video.currentTime=that.player.currentTime;
								//that.video.totalTime=that.player.duration;
						}
						that.cc_slide();//调用进度条界面显示
						//console.log("视频类型:"+that.video.playerType);
						//console.log("视频当前播放时长:"+that.video.currentTime);
						break;
					case "exam":
					
						break;
					default:
				}
		
			},delayTime);
    },
    //获取苹果或移动设备播放视频
		initvideo:function(vid,objectID){
				$('head div[id^=cc_video_]').remove();//移除cc在head头部的缓存视频节点
				videoController.player=document.getElementById('cc_'+vid);
				if(videoController.player){
					videoController.player.controls=false;
					videoController.playerType = 0;
				}
		},
		cc_slide:function(){
			var position = videoController.currentTask.progress;
			var videoTime = videoController.currentTask.videoTime;
			var values = parseInt(position/videoTime*100);
			var playerCTLValue = $("#playCtr").slider('option', 'value');
			if(playerCTLValue-values>0 && playerCTLValue-values<5) { //解决拖动播放进度条时有时候会进度条会后退1秒的问题
				console.log("playerCTLValue:"+playerCTLValue+"|"+values);
			}else{ //滑动条比时间延迟在3以上，才做一次更新，避免频繁点击时ui响应不过来
				$("#playCtr").slider( "value", values);//播放器进度条
			}
			$('div.ControlBar span.beforeTime').html(this.formatSeconds(position));
			$('div.ControlBar span.afterTime').html(this.formatSeconds(videoTime));
		},
		automaticSwitch:function(){
			var that = this;
			var taskTotal = $("li[data-id='"+that.taskTypeId+"']").attr('taskTotal');
			var taskNum = $("li[data-id='"+that.taskTypeId+"']").attr('taskNum');
			if(taskNum == taskTotal){
				var title = "下章节任务";
				var trigger = $('span.nextChapter');
			}else{
				var title = "下一任务";
				var trigger = $("li[data-id='"+that.taskTypeId+"']").next();
			}

			var buyLayer = layer.confirm(
				'当前任务结束,<span class="layerConfirm">5秒后自动进入下一个任务</span>',
				{
					title:['信息','background: #ffffff'],
					btn: ['重学本任务', title],
					closeBtn:1,
					time:5000
				},
				function(index){
					layer.close(index);
					//$("li[data-id='"+that.taskTypeId+"']").trigger("click");
				},
				function(index){
					layer.close(index);
					//trigger.trigger("click");
				}
			);


			$('.layui-layer-btn0').on('click',function(){
				console.log(1);
				$("li[data-id='"+that.taskTypeId+"']").trigger("click");

			});
			$('.layui-layer-btn1').on('click',function(){
				console.log(2);
				//$('.video-icon-task-close').trigger('click');
				//buyLayer.close();
				trigger.trigger("click");
				
			});

			$('.layui-layer-setwin .layui-layer-close1').html('<div style="color:#b9b9b9;font-size:18px; line-height: 15px;">X</div>');
			$('.layerConfirm').css('color','#00a085');
			$('.layui-layer-btn').css('background','#fafafa');
			$('.layui-layer-btn0').css({'background':'#ffffff','color':'#515151','border':'1px #d8d8d8 ridge','line-height':'27px'});
			$('.layui-layer-btn1').css({'background':'#169f81','color':'#ffffff','line-height':'29px'});
			$('.layui-layer-btn a').css({'-moz-border-radius':'3px','-webkit-border-radius':'3px','border-radius':'3px','font-weight':'normal'});

			//169f85
		},
		formatSeconds:function(value) {
			var theTime = parseInt(value);// 秒
			var theTime1 = 0;// 分
			var theTime2 = 0;// 小时
			if(theTime > 60) {
				theTime1 = parseInt(theTime/60);
				theTime = parseInt(theTime%60);
				if(theTime1 > 60) {
					theTime2 = parseInt(theTime1/60);
					theTime1 = parseInt(theTime1%60);
				}
			}
			var result = "";
			if(theTime > 9) {
				result = parseInt(theTime);
			}else if(theTime > 0) {
				result = "0"+parseInt(theTime);
			}else{
				result = "00";
			}

			if(theTime2>0){
				theTime1=theTime1+theTime2*60;
			}

			if(theTime1 > 9) {
				result = parseInt(theTime1)+":"+result;
			}else if(theTime1 > 0) {
				result = "0"+parseInt(theTime1)+":"+result;
			}else{
				result = "00"+":"+result;
			}

			/*if(theTime1 > 0) {
				result = ""+parseInt(theTime1)+":"+result;
			}*/

			/*if(theTime2 > 0) {
				result = ""+parseInt(theTime2)+":"+result;
			}*/
			return result;
		},
		//实时更新任务进度 --- time : 1s
		realUpdateProgress : function(){
			var courseProgressThis = storage.get('courseProgress-'+videoController.courseId);
			if(courseProgressThis){
				videoController.intervalTasksProgress();
			}else{
				videoController.getTasksProgress(function(){
					videoController.intervalTasksProgress();
				});
			}
		},
		getTasksProgress : function(callback){
			CAICUI.Request.ajax({
				'server' : 'getTasksProgress',
				'data' : {
					'token' : CAICUI.User.token,
					'courseId' : videoController.courseId
				},
				done : function(data){
					CAICUI.CACHE.getTasksProgress = data.data;
					CAICUI.Request.ajax({
						'server' : 'courseDetail',
						'data' : {
							'courseId' : videoController.courseId
						},
						done : function(data){

							var getTasksProgress = CAICUI.CACHE.getTasksProgress;
							var newCourseDetail = data.data[0];
							_.each(newCourseDetail.chapters,function(element1,index1){
								if(element1.children){
									_.each(element1.children,function(element2,index2){
										if(element2.tasks){
											_.each(element2.tasks,function(element3,index3){
												_.each(getTasksProgress,function(element4,index4){
													if(element3.taskId == element4.taskId){
														newCourseDetail['chapters'][index1]['children'][index2]['tasks'][index3].progress = element4.progress;
														newCourseDetail['chapters'][index1]['children'][index2]['tasks'][index3].total = element4.total;
													}
												})
											})
										}
									})
								}
							})
							storage.setsingle('courseProgress-' + videoController.courseId, newCourseDetail);

							if(callback){callback()};
						}
					})
				},
				fail : function(data){
					CAICUI.CACHE.getTasksProgress = {};
				}
			});
			

			// var chapterProgress = data.data;
			// var chapterProgressFilter = _.chain(chapterProgress)
			//  	.map(function(chapterProgress){ return chapterProgress.chapterId ; })
			//   .uniq()
			//   .value();
			// var tasksProgress = [];
			// _.each(chapterProgressFilter,function(elementChapter,item){
			// 	tasksProgress.push({
			// 		"chapterId" : elementChapter,
			// 		"tasksProgressList" : []
			// 	});
			// 	_.each(chapterProgress,function(element, index, list){
			// 		if(element.chapterId == elementChapter){
			// 			if(tasksProgress && tasksProgress[item] && tasksProgress[item].tasksProgressList){
			// 				tasksProgress[item].tasksProgressList.push({
			// 					"taskId" : element.taskId,
			// 					"progress" : element.progress,
			// 					"total" : element.total
			// 				})
			// 			}else{
			// 				tasksProgress[item].tasksProgressList= [{
			// 					"taskId" : element.taskId,
			// 					"progress" : element.progress,
			// 					"total" : element.total
			// 				}];
			// 			}
			// 		}
			// 	});
			// })
			// storage.setsingle('courseProgress-' + CAICUI.render.courseId, tasksProgress);
		},
		intervalTasksProgress : function(){
			CAICUI.render.intervalTasksProgress = setInterval(function(){
				var courseProgressThis = storage.get('courseProgress-'+videoController.courseId);
				var progress = parseInt(videoController.currentTask.progress);
				var total = 0;
				if(videoController.currentTask.taskType=="video"){
					total = parseInt(videoController.currentTask.videoTime);
				}else if(videoController.currentTask.taskType=="exam"){
					total = parseInt(videoController.currentTask.totalCount);
				}
				if(progress && total){
					var courseProgressNew = courseProgressThis;
					var progressNew = '';

					_.each(courseProgressNew.chapters,function(element1,index1){
						if(element1.children){
							_.each(element1.children,function(element2,index2){
								if(element2.children){
									_.each(element2.children,function(element3,index3){
										if(element3.tasks){
											_.each(element3.tasks,function(element4,index4){
												if(element4.taskId == videoController.currentTask.taskId){
													var thisProgress = courseProgressNew['chapters'][index1]['children'][index2]['children'][index3]['tasks'][index4].progress;
													if(!thisProgress || thisProgress<progress){
														courseProgressNew['chapters'][index1]['children'][index2]['children'][index3]['tasks'][index4].progress = progress;
													}
													courseProgressNew['chapters'][index1]['children'][index2]['children'][index3]['tasks'][index4].total = total;
												}
												
											});
										}
									});
								}else if(element2.tasks){
									_.each(element2.tasks,function(element3,index3){
										if(element3.taskId == videoController.currentTask.taskId){
											var thisProgress = courseProgressNew['chapters'][index1]['children'][index2]['tasks'][index3].progress;
											if(!thisProgress || thisProgress<progress){
												courseProgressNew['chapters'][index1]['children'][index2]['tasks'][index3].progress = progress;
											}
											courseProgressNew['chapters'][index1]['children'][index2]['tasks'][index3].total = total;
										}
										
									});
								}
							})
						}else{
							if(element1.tasks){
								_.each(element1.tasks,function(element3,index3){
									if(element3.taskId == videoController.currentTask.taskId){
										var thisProgress = courseProgressNew['chapters'][index1]['tasks'][index3].progress;
										if(!thisProgress || thisProgress<progress){
											courseProgressNew['chapters'][index1]['tasks'][index3].progress = progress;
										}
										courseProgressNew['chapters'][index1]['tasks'][index3].total = total;
									}
									
								})
							}

						}
					})

					// _.each(courseProgressThis,function(element, index){
					// 	if(element.chapterId == videoController.chapterId){
					// 		_.each(element.tasksProgressList,function(taskElement, item){
					// 			if(taskElement.taskId == videoController.currentTask.taskId){
					// 				addCourseProgress = false;
					// 				if(progress>taskElement.progress){
					// 					progressNew = progress;
					// 					courseProgressNew[index].tasksProgressList[item].progress = progress;
					// 				}else{
					// 					progressNew = taskElement.progress;
					// 					courseProgressNew[index].tasksProgressList[item].progress = taskElement.progress;
					// 				}
									
					// 			}
					// 		})
					// 	}
					// 	return {
					// 		"chapterId" : videoController.chapterId,
					// 		"progress" : progressNew,
					// 		"total" : total
					// 	}
					// });
					// if(addCourseProgress){
					// 	courseProgressNew.push({
					// 		"chapterId" : videoController.chapterId,
					// 		"tasksProgressList" : [{
					// 			"taskId" : videoController.currentTask.taskId,
					// 			"progress" : progress,
					// 			"total" : total
					// 		}]
					// 	})
					// }
					storage.setsingle('courseProgress-' + videoController.courseId, courseProgressNew);
				}
			},3000);
		}
	};
	return {
		"init" : videoController.init
	}
});

	//获取flash播放视频
	var nowcc_vid="";
	var nowcc_objectID="";
	//用户控制条操作：正常结束的2个条件，1是释放操作，2是视频跳转顺利完成，采用2个条件可以防止连续操作只满足一个条件的情况
	userOP=false; //用户操作视频控制条，如拖拽，点击，鼠标按下：true，释放时：false
	userOPTime=0; //用户操作视频控制条，如拖拽，点击等需要跳转的时间点，默认得到cc的回调并且时间一致才认为操作结束
	userOPCCCallBackTime=0;  //用户操作cc回调返回的时间点
	imgPath="";//用户上传的图片

	//cc初始化完成自动回调函数			
	function on_cc_player_init( vid, objectID ){
		nowcc_vid=vid;
		nowcc_objectID=objectID;
		$('.video-play div.dummy').html("finish"); 
		WINAPI.log("获得iframe发送的消息视频初始化完成:---on_cc_player_init");
	}
	function on_spark_player_start(){
		//初始化完毕，跳转到上次的进度继续播放
		if(videoController.taskProgress){
			videoController.cc_seek(videoController.taskProgress);
		}else{
			videoController.cc_seek(videoController.currentTask.progress);
		}
	}
	function on_spark_player_pause(){
	    $('.glyphicon.plays.glyphicon-pause').addClass('glyphicon-play').removeClass('glyphicon-pause');
	}

	function on_spark_player_resume(){
	    $('.glyphicon.plays.glyphicon-play').addClass('glyphicon-pause').removeClass('glyphicon-play');
	}

	function on_spark_player_stop(){
	    $('.glyphicon.plays.glyphicon-pause').addClass('glyphicon-play').removeClass('glyphicon-pause');
	    $('.video-play div.dummy').html("stop"); 
	}

	function on_player_seek(from,to){ 
		console.log("on_player_seek:"+from+"|"+to+"|"+userOPTime);
		$('.video-play div.dummy').html("seek"); 
		if(parseInt(to)==parseInt(userOPTime)){
			userOPCCCallBackTime=userOPTime;
			userOP=false;
		}
	}
	function on_player_start(){
		//初始化完毕，跳转到上次的进度继续播放
		if(videoController.taskProgress){
			videoController.cc_seek(videoController.taskProgress);
		}else{
			videoController.cc_seek(videoController.currentTask.progress);
		}
	}
	//绑定message事件
	window.addEventListener('message',function(e){
    var getdata=e.data;
    WINAPI.log("获得iframe发送的消息:"+getdata);
		var getJsonData = JSON.parse(getdata);
		switch(getJsonData.type){
			case 1:
				window.videototaltime = getJsonData.data.totaltime;
				on_cc_player_init(getJsonData.data.vid,getJsonData.data.objectID);
				WINAPI.log("获得iframe发送的消息视频初始化完成:"+getJsonData.data.totaltime);
				break;
			case 5:
				var from = getJsonData.data.from;
				var to = getJsonData.data.to;
				on_player_seek(from,to);
				WINAPI.log("获得iframe发送的消息 定点播放完成");
				break;
			case 10:
				window.videocurrentime = getJsonData.data.second;
				break;
			case 20:
				$('span.active').addClass('over');
				break;
			case 21:
				$('span.active').removeClass("over");
				break;
		}
		//WINAPI.log("获得iframe发送的消息:"+getJsonData.data.totaltime);
	},false);

				

