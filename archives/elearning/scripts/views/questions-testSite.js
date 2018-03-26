;define([
	'jquery',
	'underscore',
	'backbone',
	'layer'
	],function($, _, Backbone, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body',
			template : _.template($('#template-questions-testSite').html()),
			events : {
				'click .questions-card-button' : 'toggleCards',
				'click .js-card-btn' : 'cardBtn',
				'click .js-questions-btn-prev' : 'questionsPrev',
				'click .js-questions-btn-next' : 'questionsNext',
				'click .questions-correction-btn' : 'openFeedbackPop',
				'click .questions-analysis-btn' : 'analysis',
				'click .js-questions-option-click' : 'questionsOptionClick',
				'keyup .js-questions-option-keyup' : 'questionsOptionKeyup',
				'click .js-open-sidebar' : 'openSidebar',
				'click .js-close-sidebar' : 'closeSidebar',
				'click .node-editor-isOpen-button' : 'nodeEditorIsOpenButton',
				'click .node-editor-confirm' : 'nodeEditorConfirm',
				'change #uploadForm-file' : 'uploadFormFile',
				'click .view-other-btn' : 'viewOther',
				'click #questions-guide-content' : 'stepGuide',
				'click .questions-exit' : 'exit'
			},
			render : function(type, id){

				CAICUI.render.examType = type;
				CAICUI.render.examId = id;
				window.videoController = {
					courseData : {},
					currentChapter : {},
					currentTask : {},
				};


				CAICUI.render.answerArr = ["A","B","C","D","E","F","G","H"];
				CAICUI.render.this = this;
				CAICUI.render.typeHtml = '';
				CAICUI.render.questionsType = '';
				CAICUI.render.questionsStatus = '';
				CAICUI.render.pushContext = '';
				CAICUI.render.isDone = '';
				CAICUI.render.exerciseId = '';
				CAICUI.render.questionsDataCache = '';
				CAICUI.render.questionsDataCacheArray = [];
				CAICUI.render.exerciseFilenameArray = [];
				CAICUI.render.isMyChecked = '';
				CAICUI.render.cardOpen = false;
				// CAICUI.render.exerciseDoneCount = 0;
				CAICUI.render.exerciseIdOld = '';
				CAICUI.render.exerciseIdNew = '';

				CAICUI.render.exerciseNoDoneCount = 0;
				CAICUI.render.exerciseRightCount = 0;
				CAICUI.render.isPublic = 1;
				CAICUI.render.currentProgress = 0;
				CAICUI.render.isFinish = 0;
				CAICUI.render.taskState = 0;
				CAICUI.render.answerResolution = {
					context : '',
					status : true,
					rightAnswer : '',
					myAnswer : ''
				};
				CAICUI.render.imgPathArray = [];
				CAICUI.render.questionsGuide = '';
				CAICUI.render.questionsGuideIndex = 1;
				CAICUI.render.this.questionsAnswer = '';

				CAICUI.render.questionsIsSubmit = true;
				CAICUI.render.questionsIndex = "0";

				CAICUI.render.readonly = '';
				if(CAICUI.render.viewResolution){
					CAICUI.render.readonly = 'readonly="readonly"';
				}

				CAICUI.render.ExerciseTotalTime = 0;
				CAICUI.render.lastExerciseNid = 0;
				CAICUI.render.isDoneNew = '';
				// $('body .studycenter-video').append(CAICUI.render.this.template());
				
				CAICUI.render.this.$el.append(CAICUI.render.this.template());
				window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body .questions #wrapper');
				this.init();
			},
			
			init : function(){
				
					this.getKnowledgePointInfoAjax(function(){
						$('body .questions-title').html(CAICUI.render.examenInfo.enTitle);
					});

					CAICUI.render.this.exercisePointCountCacheAjax(CAICUI.render.examId,function(data){
						CAICUI.CACHE.exercisePointCountCache = data;
						

						for(var i=0;i<CAICUI.CACHE.exercisePointCountCache.length;i++){
							var thatData = CAICUI.CACHE.exercisePointCountCache[i];
							// if(videoController.currentChapter.knowledgePointId == thatData.knowledge_point_id){
								// console.log(thatData)
								CAICUI.render.cacheKnowledgeLevel1Id = thatData.knowledge_path_level_one_id;
								CAICUI.render.cacheKnowledgeLevel2Id = thatData.knowledge_path_level_two_id;
								CAICUI.render.cacheKnowledgePath = thatData.knowledge_path_level_one_id+','+thatData.knowledge_path_level_two_id;
								CAICUI.render.exerciseFilename = thatData.exercise_filename;
								CAICUI.render.exerciseCount = thatData.exercise_count;
							// }
						}

						CAICUI.render.this.exerciseFilenameAjax(function(data){
							var templateHtml = $('#template-questions-testSite-cards').html();
							var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
								'data' : CAICUI.render.exerciseFilenameArray
							});
							$('body  .questions').append(addHtml);

		    		CAICUI.render.this.exerciseKnowledgeMemberStatusAjax(CAICUI.render.examId,function(data){

		    			if(CAICUI.render.myExamContinue && CAICUI.render.myExamContinue.examenNum){
		    				CAICUI.render.examenNum = CAICUI.render.myExamContinue.examenNum;
		    				CAICUI.render.isFinish = data[0].is_finish;
		    				CAICUI.render.errorNum = +data[0].error_num;
								CAICUI.render.lastExerciseNid = +data[0].last_exercise_nid;

		    			}else{
		    				if(data && data.length){
		    					CAICUI.render.examenNum = data.length;
		    				}
		    			}
							CAICUI.render.this.userKnowledgePointExerciseListAjax(function(data){
								
								CAICUI.render.questionsDataCacheArray = data;
								// CAICUI.render.exerciseDoneCount = data.length;
								CAICUI.render.exerciseNoDoneCount = CAICUI.render.exerciseCount-CAICUI.render.exerciseDoneCount;
								CAICUI.render.exerciseRightCount = CAICUI.render.exerciseDoneCount-CAICUI.render.errorNum;
								var correctRate = 0;
								if(CAICUI.render.exerciseDoneCount){
									correctRate = ((CAICUI.render.exerciseRightCount/CAICUI.render.exerciseDoneCount)*100);
									if(correctRate>0&&correctRate<1){
										correctRate = 1;
									}
									correctRate = correctRate.toFixed(0);
								}
								var progress = 0;
								if(CAICUI.render.exerciseCount){
									progress = ((CAICUI.render.exerciseDoneCount/CAICUI.render.exerciseCount)*100);
									if(progress>0&&progress<1){
										progress = 1;
									}
									progress = progress.toFixed(0);
								}
								$('body .questions-progress-show').attr('data-course-progress', progress);
								$('body .questions-percentage').html(progress);
								$('body .questions-progress-show').animate({
									'width': progress+'%'},
									1000);
								$('.exercise-done-count').text(CAICUI.render.exerciseDoneCount);
								$('.exercise-count').text(CAICUI.render.exerciseCount);

								$('.progress-round-count').text(correctRate);
								$('#progress-round-question').attr('data-progress',correctRate);
								CAICUI.iGlobal.canvasRound('progress-round-question',{
									'borderColor':"#00A184",
									"borderWidth" : 3,
									"bg":true,
									"bgBorderColor" : "#8CD5C8"
								});
								_.each(data,function(element,index){
									var btnClass = 'questions-cards-info';
									if(element.status=='0'){
										btnClass = 'questions-cards-info';
									}else if(element.status=='1'){
										btnClass = 'questions-cards-success';
										$('#questions-card-'+element.exercise_id).attr('data-isdone','true');
									}else if(element.status=='2'){
										btnClass = 'questions-cards-danger';
										$('#questions-card-'+element.exercise_id).attr('data-isdone','false');
									}
									$('#questions-card-'+element.exercise_id).addClass(btnClass);
								})
								if(CAICUI.render.lastExerciseNid){
									CAICUI.render.questionsIndex = +CAICUI.render.lastExerciseNid;

								}else{
									CAICUI.render.questionsIndex = 0;
								}
								// console.log(CAICUI.render.questionsIndex)
								$('body .questions .js-card-btn').eq(CAICUI.render.lastExerciseNid).addClass('questions-cards-active')
								CAICUI.render.exerciseId = $('.js-card-btn').eq(CAICUI.render.questionsIndex).attr('data-exerciseid');
								CAICUI.render.isDone = $('body #questions-card-'+CAICUI.render.exerciseId).attr('data-isdone')
								if(CAICUI.render.isDone){
									$('body .questions-body').addClass('questions-answerResolution-active');
								}
								
								CAICUI.render.this.getNidExerciseDetailAjax(function(){
									CAICUI.render.this.guide();
									
									CAICUI.render.action = "begintest";
									CAICUI.render.this.actionTaskProgress();
								});
							});
						});
					});
				});
				var cardsInterval = null;
				cardsInterval = setInterval(function(){
					var questionsCardsUl = $('body .questions-cards-ul').find('li');
					if(questionsCardsUl.length){
						window.CAICUI.myCardsScroll = CAICUI.iGlobal.iScroll('body .questions #wrapper-cards');
						window.CAICUI.myCardsScroll.refresh();
						clearInterval(cardsInterval);
					}
				},300)
			},
			openFeedbackPop : function(){
				CAICUI.render.feedbackType = ["答案有异议","解析有误","错别字","排版错误","其他错误"]
				var feedbackTemp = _.template($('#template-feedback-knowledgePoint').html());
				CAICUI.render.feedbackTitle = CAICUI.render.this.getExerciseTitle(CAICUI.render.exerciseTitle,CAICUI.render.questionsType);
				$('body').append(feedbackTemp({
					"currentTask" : {
						'progress' : +CAICUI.render.questionsIndex+1,
						'title' : CAICUI.render.feedbackTitle
					},
					"feedbackType" : CAICUI.render.feedbackType
				}));
				CAICUI.Request.ajax({
					'server' : 'member',
					'data' : {
						'token' : CAICUI.User.token
					},
					done : function(data){
						if (data.state == 'success') {
							CAICUI.render.member = data.data;
							$('body .pop-input-tel').val(CAICUI.render.member.mobile ? CAICUI.render.member.mobile : CAICUI.render.member.email);
						} else {
							console.log('member:'+data)
						}
					},
					fail : function(data){
						console.log('member:'+data)
					}
				});
				this.feedbackAnimate('.pop-html');
				this.feedbackEvent();
			},
			feedbackAnimate : function(obj){
				$(obj).animate({
					"opacity" : 1
				}, 1000)
			},
			feedbackEvent : function(){
				var feedback = $('#help-feedback-pop');
				if(feedback){
					feedback.on('click','.pop-radio-label',function(){
						var that = $(this);
						that.siblings().removeClass('active');
						that.addClass('active');
					});
					feedback.on('click','.pop-button-confirm',function(){
						var labelIndex = $('.pop-radio-label.active').index();
						var feedbackTitle = CAICUI.render.feedbackType[labelIndex];
						var feedbackContent = $('.pop-textarea').val();
						if(!feedbackContent){
							layer.msg('Sorry~ 请输入内容！', function() {});
							return;
						}else{
							var addDom = '';
							var questionBankCookie = JSON.parse($.cookie('questionBankCookie'));
							var jsonName = {
								"categoryName" : questionBankCookie.categoryName,
								"categoryId" : questionBankCookie.categoryId,

								"subjectName" : questionBankCookie.subjectName,
								"subjectId" : questionBankCookie.subjectId,
								
								courseName : "考点特训",
								chapterName : "试题纠错",
								taskName : CAICUI.render.examenInfo.enTitle,
								id : CAICUI.render.exerciseId
							};
							addDom += '<a class="content-addDom" data-nameJson="'+JSON.stringify(jsonName)+'" href="javascript:;" data-course-id="'+CAICUI.render.courseId+'" data-chapter-id="'+CAICUI.render.chapterId+'" data-task-id="'+CAICUI.render.taskId+'" ';
							var sort = 0;
							if(CAICUI.render.questionsIndex == "0"){
								sort = "1";
							}else{
								sort = CAICUI.render.questionsIndex;
							}
							addDom += 'data-type="testSite" data-sort="'+sort+'" data-exercise-id="'+ CAICUI.render.exerciseId +'" data-title="'+ CAICUI.render.examenInfo.enTitle+'" ';

							addDom += '>试题：'+sort+'题</a>';

							feedbackContent += addDom;
						}
						var feedbackTel = $('.pop-input-tel').val();
						if(!feedbackTel){
							layer.msg('Sorry~ 请输入联系方式！', function() {});
							return;
						}
						var platform = (navigator.platform) == 'MacIntel' ? '苹果' : '';
						var userAgentArr = navigator.userAgent.split(' ');
						var userAgentArrLength = userAgentArr.length;
						var userAgent = userAgentArr[userAgentArr.length-2].split('/')[0]+'-'+userAgentArr[userAgentArr.length-1].split('/')[0];
						CAICUI.render.this.feedbackAjax({
							"memberId" : CAICUI.User.memberId,
							"memberName" : CAICUI.User.nickname,
							"cmptType" : feedbackTitle,
							"cmptContent" : feedbackContent,
							"contactWay" : feedbackTel,
							"deviceDesc" : platform+" "+userAgent
						})
					});
					feedback.on('click','.pop-button-cancel',function(){
						feedback.remove();
						feedback.off();
					});
				}
			},
			feedbackAjax : function(data){
				CAICUI.Request.ajax({
					'server' : 'addLMG',
					'data' : data,
					done : function(data){
						$('.pop-html').remove();
						layer.msg('提交成功', {
						  icon: 1,
						  time: 1000
						}, function(){
						  $('#help-feedback-pop').remove();
							$('#help-feedback-pop').off();
						});   
					},
					fail : function(data){
						layer.msg('Sorry~ ', function() {});
					}
				})
			},
			guide : function(callback){
				CAICUI.render.questionsGuide = $.cookie('questionsGuide');
				if(CAICUI.render.questionsGuide != 'true'){
					this.createGuide();
				}else{
					this.callbackGuide();
				}
			},
			createGuide : function(){
				var templateHtml = $('#template-questions-testSite-guide').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml);
				$('body .questions').append(addHtml);
			},
			removeGuide : function(){
				$('#questions-guide').remove();
				$.cookie('questionsGuide', true, {
					path: '/',
					expires: 36500
				});
				this.callbackGuide();
			},
			stepGuide : function(e){
				CAICUI.render.questionsGuideIndex = +CAICUI.render.questionsGuideIndex+1;
				if(CAICUI.render.questionsGuideIndex<6){
					$('body #questions-guide-content').attr('class','questions-guide-step-'+CAICUI.render.questionsGuideIndex)
				}else{
					this.removeGuide();
				}
			},
			callbackGuide : function(){
				CAICUI.render.this.clockTime();
				document.onkeydown=function(event){
					var e = event || window.event || arguments.callee.caller.arguments[0];
					if(e && e.keyCode==37){
						CAICUI.render.this.questionsPrev();
					}
					if(e && e.keyCode==39){
						CAICUI.render.this.questionsNext();
					}
				}; 
			},
			exerciseFilenameAjax : function(callback){
				this.getExerciseId(function(data){
					// var data = 'ff8080814c7e36d9014c967ac2b90152,ff8080814f1c162a014f200e6b482543,ff8080814f1c162a014f200e6d542621,ff8080814f1c162a014f200dc58c208c,ff8080814f1c162a014f200e6ccf25f0,ff8080814f1c162a014f200e69d22486,ff8080814f1c162a014f200e6a0524ac,ff8080814f1c162a014f200e6d632626,ff8080814f1c162a014f200dc20a1fab,ff8080814f1c162a014f200dc2031fa9,ff8080814f1c162a014f200dc1f61fa5,ff8080814f1c162a014f200dc1f31fa4,ff8080814f1c162a014f200dc1ef1fa3,ff8080814f1c162a014f200dc1cd1f9a,ff8080814f1c162a014f200dc1c91f99,ff8080814f1c162a014f200dc1c61f98,ff8080814f1c162a014f200dc04e1f1f,ff8080814f1c162a014f200dbf891ed9,ff8080814f73b419014f870049b51bbc,ff8080814f73b419014f870049b81bbe,ff8080814f73b419014f870049ba1bbf,ff8080814f73b419014f870049bb1bc0,ff8080814f73b419014f870049be1bc2,ff8080814f73b419014f870049c21bc4,ff8080814f73b419014f870049c71bc7,ff8080814f73b419014f870049cf1bcc,8a22ecb55b7a030e015b7b2c4ec00094,8a22ecb55b7a030e015b7b3f0f2b009e,8a22ecb55b7a030e015b7b408fad00a0'.split(',');
					CAICUI.render.exerciseFilenameArray = data;
					CAICUI.render.exerciseCount = data.length;
					if(callback){callback()}
				});
			},
			getKnowledgePointInfoAjax: function(callback){
				CAICUI.Request.ajax({
					'server' : 'getKnowledgePointInfo',
					'data' : {
						'knowledgePointId' : CAICUI.render.examId
					},
					done : function(data){
						CAICUI.render.examenInfo = data.data[0];
						if(callback){callback(data.data)}
					}
				})
			},
			exercisePointCountCacheAjax: function(id, callback){
				CAICUI.Request.ajax({
					'server' : 'exercisePointCountCache',
					'data' : {
						'knowledge_points' : id,
						'type' : 4
					},
					done : function(data){
						if(callback){callback(data.data)}
					}
				})
			},
			exerciseKnowledgeMemberStatusAjax: function(id, callback){
				var examenNum = '';
				if(CAICUI.render.myExamContinue){
					examenNum = CAICUI.render.myExamContinue.examenNum
				}
				CAICUI.Request.ajax({
					'server' : 'get_exercise_knowledge_member_status',
					'data' : {
						'knowledge_points' : id,
						'type' : 4,
						'member_id' : CAICUI.User.memberId,
						'examenNum' : examenNum
					},
					done : function(data){
						if(data && data.data && data.data.length){
							// console.log(data.data[0].progress)
							CAICUI.render.exerciseDoneCount = data.data[0].progress;
						}else{
							CAICUI.render.exerciseDoneCount = 0;
						}
						if(callback){callback(data.data)}
					}
				})
			},
			userKnowledgePointExerciseListAjax: function(callback){
				
				CAICUI.Request.ajax({
					'server' : 'userKnowledgePointExerciseList',
					'data' : {
						'knowledge_point_id' : CAICUI.render.examId,
						'member_id' : CAICUI.User.memberId
					},
					done : function(data){
						if(callback){callback(data.data)}
					}
				})
			},
			getNidExerciseDetailAjax : function(callback){
				
				CAICUI.Request.ajax({
					'server' : 'getNidExerciseDetail',
					'data' : {
						'exerciseId' : CAICUI.render.exerciseId
					},
					done : function(data){
						CAICUI.render.prevClick = '';
						CAICUI.render.nextClick = '';
						CAICUI.render.exerciseTitle = '';
						CAICUI.render.exerciseDetail = data.data[0];

						if(CAICUI.render.exerciseId !== data.data[0].id){
							// CAICUI.render.isDone = '';
							CAICUI.render.exerciseIdOld = CAICUI.render.exerciseId;
							CAICUI.render.exerciseIdNew = data.data[0].id;
							CAICUI.render.exerciseId = data.data[0].id;
						}
						if(data.data[0].title){
							CAICUI.render.exerciseTitle += data.data[0].title;
						}
						if(data.data[0].background){
							CAICUI.render.exerciseTitle += data.data[0].background;
						}
						CAICUI.render.this.addDOMNidExerciseDetail(data.data[0]);
						if(callback){callback(data.data[0])};
					}
				});
			},
			addDOMNidExerciseDetail:function(data){
				if(CAICUI.render.lastExerciseNid==0){
					$('body .js-questions-btn-prev').hide();
				}else{
					$('body .js-questions-btn-prev').show();
				}
				var exerciseData = data;
				var templateHtml = $('#template-questions-testSite-content').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					'item' : exerciseData
				});
				$('body .questions #scroller').html(addHtml);
				$('body .questions #scroller').find('img').each(function(item){
					var src = $(this).attr('src');
					var srcSubstr = src.substr(-3);
					if(srcSubstr == "jpg" || srcSubstr == "png" || srcSubstr == "gif" || srcSubstr == "svg"){
						src = CAICUI.Common.host.static+src;
					}
					$(this).attr('src',src);
				})
				setTimeout(function(){
					window.CAICUI.myScroll.refresh();
					window.CAICUI.myScroll.scrollTo(0,0);
				},300)
			},
			setMemberExerciseLogAjax : function(callback){
				if(CAICUI.render.viewResolution){
					CAICUI.render.this.doneChange();
					if(callback){callback()};
					return false;
				}
				
				this.questionsStatus(function(){
					if(CAICUI.render.isMyChecked){
						CAICUI.render.isMyChecked = '';
						CAICUI.render.isDone = $('body #questions-card-'+CAICUI.render.exerciseId).attr('data-isdone');

						console.log(CAICUI.render.pushContext)
						// var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
						// var newContent = CAICUI.render.pushContext.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
						// CAICUI.render.pushContext = JSON.parse(newContent);
						if(CAICUI.render.status==1){
							$('body #questions-card-'+CAICUI.render.exerciseId).attr('data-isdone','true');
						}else if(CAICUI.render.status==2){
							$('body #questions-card-'+CAICUI.render.exerciseId).attr('data-isdone','false');
						}
						
						var cardBtn = $('body .js-card-btn');
						var rightNum = 0;
						var errorNum = 0;
						var noDoneNum = 0;
						for(var i=0;i<cardBtn.length;i++){
							var isDone = cardBtn.eq(i).attr('data-isdone');
							if(isDone == "true"){
								rightNum++;
							}else if(isDone == "false"){
								errorNum++;
							}else{
								noDoneNum++;
							}
						}
						CAICUI.render.exerciseRightCount = rightNum;
						CAICUI.render.errorNum = errorNum;
						CAICUI.render.exerciseDoneCount = rightNum + errorNum;
						CAICUI.render.exerciseNoDoneCount = noDoneNum;

						if(CAICUI.render.exerciseDoneCount == CAICUI.render.exerciseCount){
							CAICUI.render.action = "submittest";
							CAICUI.render.isFinish = 1;
							CAICUI.render.taskState = 1;
							CAICUI.render.this.setMemberExamenFinish();
						}
						
						
						var requestData = {
							'knowledgePointId' : CAICUI.render.examId,
							'exerciseId' : CAICUI.render.exerciseId,
							'memberId' : CAICUI.User.memberId,
							'context' : "'"+JSON.stringify(CAICUI.render.pushContext)+"'",
							'status' : CAICUI.render.status,
							'progress' : CAICUI.render.exerciseDoneCount,
							'lastExerciseNid' : CAICUI.render.lastExerciseNid,
							'errorNum' : CAICUI.render.errorNum,
							'correctNum' : CAICUI.render.exerciseRightCount,
							'totalTime' : CAICUI.render.ExerciseTotalTime,
							'examenNum' : 0,
							'examenType' : CAICUI.render.examType,
							'isFinish' : CAICUI.render.isFinish,
							'currentProgress' : +CAICUI.render.currentProgress,
							'exerciseTitle' : CAICUI.render.exerciseTitle,
							'examenTotalNum' : CAICUI.render.exerciseCount,
							'examenName' : CAICUI.render.examenInfo.enTitle,

							'subjectId' : CAICUI.render.subjectId,
							'categoryId' : CAICUI.render.categoryId,
							'courseId' : CAICUI.render.courseId,
							'chapterId' : CAICUI.render.chapterId,
							'taskId' : videoController.currentTask.taskId,
							'cacheKnowledgeLevel1Id' : CAICUI.render.cacheKnowledgeLevel1Id,
							'cacheKnowledgeLevel2Id' : CAICUI.render.cacheKnowledgeLevel2Id,
							'cacheKnowledgePath' : CAICUI.render.cacheKnowledgePath,

						}
						
						CAICUI.Request.ajax({
							'server' : 'setMemberExerciseLog',
							'data' : requestData,
							done : function(data){
								var addCache = false;
								var addCacheIndex = 0;
								for(var i=0;i<CAICUI.render.questionsDataCacheArray.length;i++){
									var exerciseId = CAICUI.render.questionsDataCacheArray[i].exercise_id || CAICUI.render.questionsDataCacheArray[i].exerciseId;
									if(exerciseId==CAICUI.render.exerciseId){
										addCache = true;
										addCacheIndex = i;
									}
								}
								console.log(addCache+';'+addCacheIndex)
								if(addCache){
									CAICUI.render.questionsDataCacheArray[addCacheIndex].context = JSON.stringify(CAICUI.render.pushContext)
								}else{
									CAICUI.render.questionsDataCacheArray.push(requestData)
								}
								CAICUI.render.this.doneChange();
								CAICUI.render.this.actionTaskProgress();
								if(callback){callback(data)};
							}
						});

						if(CAICUI.render.exerciseIdOld && CAICUI.render.exerciseIdNew){
							var requestData = {
								'knowledgePointId' : CAICUI.render.knowledgepointid,
								'exerciseId' : CAICUI.render.exerciseIdOld,
								'memberId' : CAICUI.User.memberId,
								'context' : "'"+JSON.stringify(CAICUI.render.pushContext)+"'",
								'status' : CAICUI.render.status,
								'subjectId' : CAICUI.render.subjectId,
								'categoryId' : CAICUI.render.categoryId,
								'courseId' : CAICUI.render.courseId,
								'chapterId' : CAICUI.render.chapterId,
								'taskId' : videoController.currentTask.taskId,
								'cacheKnowledgeLevel1Id' : CAICUI.render.cacheKnowledgeLevel1Id,
								'cacheKnowledgeLevel2Id' : CAICUI.render.cacheKnowledgeLevel2Id,
								'cacheKnowledgePath' : CAICUI.render.cacheKnowledgePath,
								'progress' : CAICUI.render.exerciseDoneCount,
								'lastExerciseNid' : CAICUI.render.lastExerciseNid,
								'errorNum' : CAICUI.render.errorNum,
								'correctNum' : CAICUI.render.exerciseRightCount,
								'totalTime' : CAICUI.render.ExerciseTotalTime,
								'examenNum' : 0,
								'examenName' : CAICUI.render.examenInfo.enTitle,
								'examenTotalNum' : CAICUI.render.exerciseCount,
								'examenType' : 'knowledge',
								'isFinish' : 0,
								'currentProgress' : CAICUI.render.currentProgress,
								'exerciseTitle' : CAICUI.render.exerciseTitle
							}
							CAICUI.Request.ajax({
								'server' : 'setMemberExerciseLog',
								'data' : requestData,
								done : function(data){
									var addCache = false;
									var addCacheIndex = 0;
									for(var i=0;i<CAICUI.render.questionsDataCacheArray.length;i++){
										var exerciseId = CAICUI.render.questionsDataCacheArray[i].exercise_id || CAICUI.render.questionsDataCacheArray[i].exerciseId;
										console.log(exerciseId+';'+CAICUI.render.exerciseIdOld);
										if(exerciseId==CAICUI.render.exerciseIdOld){
											addCache = true;
											addCacheIndex = i;
										}
									}
									console.log(addCache+';'+addCacheIndex)
									if(addCache){
										CAICUI.render.questionsDataCacheArray[addCacheIndex].context = JSON.stringify(CAICUI.render.pushContext)
									}else{
										CAICUI.render.questionsDataCacheArray.push(requestData)
									}
									
								}
							});
						}

					}else{
						CAICUI.render.status = 0;
						if(callback){callback()};
					}
				});
			},
			doneChange : function(){
				if(CAICUI.render.status==1){
					$('body .js-card-btn').eq(CAICUI.render.questionsIndex).attr('data-isdone','true');
				}else if(CAICUI.render.status==2){
					$('body .js-card-btn').eq(CAICUI.render.questionsIndex).attr('data-isdone','false');
				}
				
				$('body .knowledge-point-number-'+CAICUI.render.knowledgepointid).text(CAICUI.render.exerciseDoneCount);
				$('body #knowledge-point-btn-'+CAICUI.render.knowledgepointid).attr('data-last-exercise-nid',CAICUI.render.lastExerciseNid)
				$('body #knowledge-point-btn-'+CAICUI.render.knowledgepointid).attr('data-exercise-progress',CAICUI.render.exerciseDoneCount)
				$('body #knowledge-point-btn-'+CAICUI.render.knowledgepointid).attr('data-exercise-total-time',CAICUI.render.ExerciseTotalTime)
				$('body #knowledge-point-btn-'+CAICUI.render.knowledgepointid).attr('data-errornum',CAICUI.render.errorNum)
				$('.exercise-done-count').text(CAICUI.render.exerciseDoneCount);
				$('.exercise-count').text(CAICUI.render.exerciseCount);
				var correctRate = 0;
					if(CAICUI.render.exerciseDoneCount){
						correctRate = ((CAICUI.render.exerciseRightCount/CAICUI.render.exerciseDoneCount)*100);
						if(correctRate>0&&correctRate<1){
							correctRate = 1;
						}
						correctRate = correctRate.toFixed(0)
					}
					var progress = 0;
					if(CAICUI.render.exerciseCount){
						progress = ((CAICUI.render.exerciseDoneCount/CAICUI.render.exerciseCount)*100);
						if(progress>0&&progress<1){
							progress = 1;
						}
						progress = progress.toFixed(0)
					}
				$('body .questions-progress-show').attr('data-course-progress', progress);
				$('body .questions-percentage').html(progress);
				$('body .questions-progress-show').animate({
					'width': progress+'%'},
					1000);
				$('.progress-round-count').text(correctRate);
				$('#progress-round-question').attr('data-progress',correctRate)
				CAICUI.iGlobal.canvasRound('progress-round-question',{
					'borderColor':"#00A184",
					"borderWidth" : 3,
					"bg":true,
					"bgBorderColor" : "#bgBorderWidth"
				});
			},
			analysis : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var analysis = this.$el.find(".questions-answerResolution");
				if(analysis.hasClass('active')){
					analysis.removeClass('active')
					$('body .questions-body').removeClass('questions-answerResolution-active')
				}else{
					$('body .questions-body').addClass('questions-answerResolution-active')
					this.questionsStatus(function(){})
					if(CAICUI.render.isMyChecked){
						$('body .js-card-btn').eq(+CAICUI.render.questionsIndex).trigger('click');
					}else{
						analysis.addClass('active')
					}
				}
				window.CAICUI.myScroll.refresh();
			},
			cardBtn : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatButton = that.find('button');
				var index = that.attr('data-index');
				if(CAICUI.render.questionsIsSubmit){
					CAICUI.render.questionsIsSubmit = false;
					if(CAICUI.render.prevClick || CAICUI.render.nextClick){
						
					}else{
						CAICUI.render.action = "seektest";
					}
					this.setMemberExerciseLogAjax(function(data){
						CAICUI.render.this.questionsLoaderContent();
						var cardPre = '';
						if(CAICUI.render.exerciseIdOld){
							cardPre = $('#questions-card-'+CAICUI.render.exerciseIdOld);
						}else{
							cardPre = $('#questions-card-'+CAICUI.render.exerciseId);
						}
						if(CAICUI.render.status == 1){
							cardPre.removeClass('questions-cards-danger').addClass('questions-cards-success')
						}else if(CAICUI.render.status == 2){
							cardPre.removeClass('questions-cards-success').addClass('questions-cards-danger')
						}
						$('body .questions .js-card-btn').removeClass('questions-cards-active')
						that.addClass('questions-cards-active');
						CAICUI.render.exerciseId = that.attr('data-exerciseid');
						CAICUI.render.lastExerciseNid = index;
						if(+CAICUI.render.ExerciseProgress<(+index+1)){
							CAICUI.render.ExerciseProgress = (+index+1);
						}
						CAICUI.render.questionsIndex = index;
						CAICUI.render.currentProgress = index;
						$('body .right-questions-item-count').text((+CAICUI.render.questionsIndex+1));
						CAICUI.render.isDone = that.attr('data-isdone');
						
						
						CAICUI.render.exerciseIdOld = '';
						CAICUI.render.exerciseIdNew = '';
						CAICUI.render.isDoneNew = '';
						
						CAICUI.render.this.getNidExerciseDetailAjax(function(data){
							if(CAICUI.render.isDone){
								$('body .questions-body').addClass('questions-answerResolution-active');
							}else{
								$('body .questions-body').removeClass('questions-answerResolution-active');
							}
							CAICUI.render.questionsIsSubmit = true;
							if(CAICUI.render.cardOpen){
								$('body .questions-card-button').trigger('click');
								CAICUI.render.cardOpen = false;
							}
						});
						
					});
				}
			},
			questionsPrev : function(e){
				if(CAICUI.render.questionsIndex>0){
					var questionsIndex = +CAICUI.render.questionsIndex-1;
					CAICUI.render.prevClick = true;
					CAICUI.render.action = "test";
					$('body .js-card-btn').eq(questionsIndex).trigger('click');
				}
			},
			questionsNext : function(e){
				if(+CAICUI.render.questionsIndex<(+CAICUI.render.exerciseCount)){
					if((+CAICUI.render.questionsIndex+1)==(+CAICUI.render.exerciseCount)){
						this.setMemberExerciseLogAjax(function(data){
							var cardPre = '';
							if(CAICUI.render.exerciseIdOld){
								cardPre = $('#questions-card-'+CAICUI.render.exerciseIdOld);
							}else{
								cardPre = $('#questions-card-'+CAICUI.render.exerciseId);
							}
							if(CAICUI.render.status == 1){
								cardPre.removeClass('questions-cards-danger').addClass('questions-cards-success')
							}else if(CAICUI.render.status == 2){
								cardPre.removeClass('questions-cards-success').addClass('questions-cards-danger')
							}
							if(CAICUI.render.exerciseDoneCount==CAICUI.render.exerciseCount){
								layer.msg('您已经完成了本章的全部习题！', {time:2000}, function() {
									window.location.hash = '#myExam';
								});
							}else{
								layer.msg('已经是最后一题了~', {time:2000}, function() {});
							}
						});
					}
					var questionsIndex = +CAICUI.render.questionsIndex+1;
					CAICUI.render.nextClick = true;
					CAICUI.render.action = "test";
					$('body .js-card-btn').eq(questionsIndex).trigger('click');
				}
			},
			actionTaskProgress : function(){
				console.log(CAICUI.render.action)

				var taskProgressData = {
						action : CAICUI.render.action,
						token:CAICUI.User.token,
						memberId:CAICUI.User.memberId,
						progress: CAICUI.render.exerciseDoneCount,
						total: CAICUI.render.exerciseCount,
						
						taskId:videoController.currentTask.taskId,				
						chapterId:videoController.currentChapter.chapterId,
						courseId:videoController.courseData.courseId,
						subjectId:videoController.courseData.subjectId,
						categoryId:videoController.courseData.categoryId,
						
						taskName:videoController.currentTask.title,
						chapterName:videoController.currentChapter.chapterTitle,
						courseName:videoController.courseData.courseName,
						subjectName : videoController.courseData.subjectName,
						categoryName : videoController.courseData.categoryName,


						state : CAICUI.render.taskState,
						memberName : CAICUI.User.nickname,
						isSupply : 0,
						createDate : new Date().getTime()
					}

				CAICUI.Request.ajax({
					'server' : 'actionTaskProgress',
					'data' : {
						'token' : CAICUI.User.token,
						'message': JSON.stringify(taskProgressData)
					},
					done : function(data){

					}
				});
			},
			setMemberExamenFinish : function(){
				CAICUI.Request.ajax({
					'server' : 'setMemberExamenFinish',
					'data' : {
						'memberId' : CAICUI.User.memberId,
						'examenid': CAICUI.render.knowledgePointId,
						'examenNum' : 0
					},
					done : function(data){

					}
				});
			},
			getExerciseTitle : function(titles,types){
				var title = '';
				if(titles){
					title = titles.replace(/<[^>]+>/g,"").replace(/(^\s+)|(\s+$)/g,"").replace(/(\r)|(\n)|(\t)/g,'')
				}else{
					switch(types){
						case 'radio' :
							title = '单选题';
							break;
						case 'checkbox' :
							title = '复选题';
							break;
						case 'blank' :
							title = '填空题';
							break;
						case 'question' :
							title = '简答题';
							break;
						case 'matrixRadio' :
							title = '矩阵单选题';
							break;
						case 'matrixCheckbox' :
							title = '矩阵复选题';
							break;
						case 'matrixBlank' :
							title = '矩阵填空题';
							break;
						case 'multiTask' :
							title = '多任务题';
							break;
					}
				}
				return title;
			},
			getQuestionsDataCacheIndex : function(callback){
				var number = 0;
				var arrLength = CAICUI.render.questionsDataCacheArray.length;
				for(var i=0;i<arrLength;i++){
					var exerciseId = CAICUI.render.questionsDataCacheArray[i].exercise_id || CAICUI.render.questionsDataCacheArray[i].exerciseId;
					if(exerciseId == CAICUI.render.exerciseId){
						CAICUI.render.questionsDataCache = CAICUI.render.questionsDataCacheArray[i];
						if(CAICUI.render.questionsDataCache.status=='0'){
							CAICUI.render.isDone = '';
						}else if(CAICUI.render.questionsDataCache.status=='1'){
							CAICUI.render.isDone = 'true';
						}else if(CAICUI.render.questionsDataCache.status=='2'){
							CAICUI.render.isDone = 'false';
						}
						return CAICUI.render.questionsDataCacheArray[i];
					}else{
						number++;
					}
				}
				if(number == arrLength){
					console.log("没有做题记录");
					CAICUI.render.isDoneNew = "none";
					if(CAICUI.render.exerciseIdOld && CAICUI.render.exerciseIdNew){
						$('body #questions-card-'+CAICUI.render.exerciseIdOld).removeAttr('data-isdone');
						$('body #questions-card-'+CAICUI.render.exerciseIdNew).removeAttr('data-isdone');
					}
				}
			},
			filterQuestionsContent : function(content){
				var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','#39':"'"};
				var newContent = content.replace(/&(lt|gt|nbsp|amp|quot|#39);/ig,function(all,t){return arrEntities[t];});

				var newContentFalseArr = newContent.split('"false"');
				newContent = '';
				var length = newContentFalseArr.length
				for(var i=0;i<length;i++){
					if(i == (length-1)){
						newContent += newContentFalseArr[i]
					}else{
						newContent += newContentFalseArr[i] + 'false'
					}
				}
				var newContentTrueArr = newContent.split('"true"');
				newContent = '';
				var length = newContentTrueArr.length
				for(var i=0;i<length;i++){
					if(i == (length-1)){
						newContent += newContentTrueArr[i]
					}else{
						newContent += newContentTrueArr[i] + 'true'
					}
				}
				return newContent;
			},
			questions : function(type,context,answerResolution){
				CAICUI.render.questionsAnswer = '';
				CAICUI.render.typeHtml = '';
				CAICUI.render.questionsType = type;
				var activeClass = '';
				var questionsDataCache = this.getQuestionsDataCacheIndex();
				CAICUI.render.isDone = $('body #questions-card-'+CAICUI.render.exerciseId).attr('data-isdone');
				if(CAICUI.render.isDone && CAICUI.render.isDoneNew != 'none'){
					activeClass = 'active';
					var content = questionsDataCache.context;
					var newContent = this.filterQuestionsContent(content);
					try{
						CAICUI.render.pushContext = JSON.parse(newContent);
					}catch(e){
						CAICUI.render.pushContext = JSON.parse(newContent.slice(1,newContent.length-1));
					}
				}else{

					CAICUI.render.isDone = '';
					var newContent = this.filterQuestionsContent(context);
					try{
						CAICUI.render.pushContext = JSON.parse(newContent);
					}catch(e){
						// CAICUI.render.pushContext = newContent;
						if(CAICUI.render.exerciseDetail.questionTypes == "question"){
							var contentSplit = newContent.split('":"');
							console.log(contentSplit)
							CAICUI.render.pushContext = [{
								"blank" : contentSplit[1].substring(0,contentSplit[1].length-2)
							}]
						}
					}
				}
				console.log(CAICUI.render.pushContext)
				CAICUI.render.answerResolution.context = answerResolution;
				if(type === "multiTask"){
					_.each(CAICUI.render.pushContext,function(element, index){
						CAICUI.render.typeHtml += '<div class="questions-options-box"><div class="questions-options-title">'+element.title+'</div>';
						CAICUI.render.this.questionsTypes(element.type,element.data,index);
						CAICUI.render.typeHtml += '</div>';
					});
				}else{
					CAICUI.render.typeHtml += '<div class="questions-options-box">'
					CAICUI.render.this.questionsTypes(type,CAICUI.render.pushContext,0)
					CAICUI.render.typeHtml += '</div>';
				}
				return CAICUI.render.typeHtml;
			},
			questionsTypes : function(type,context,index, showChecked){
				switch(type){
					case "checkbox":
						CAICUI.render.this.checkbox(context,index);
						break;
					case "radio":
						CAICUI.render.this.radio(context,index);
						break;
					case "question":
						CAICUI.render.this.question(context,index);
						break;
					case "blank":
						CAICUI.render.this.blank(context,index)
						break;
					case "matrixRadio":
						CAICUI.render.this.matrix('matrixRadio',context,index, showChecked)
						break;
					case "matrixCheckbox":
						CAICUI.render.this.matrix('matrixCheckbox',context,index, showChecked)
						break;
					case "matrixBlank":
						CAICUI.render.this.matrix('matrixBlank',context,index, showChecked)
						break;
				}
			},
			checkbox : function(context,num){
				var right = true;
				var rightAnswer = '';
				var myAnswer = '';
				_.each(context,function(element, index){
					var regExp = CAICUI.render.this.optionRegExpTest(element.title);
						if(!regExp){
						var activeClass = '';
						if(element.isChecked){
							rightAnswer += CAICUI.render.answerArr[index] + ' ';
						}
						if(element.myChecked){
							activeClass = 'active';
							myAnswer += CAICUI.render.answerArr[index] + ' ';
						}
						if(element.isChecked != element.myChecked){
							right = false;
						}
						CAICUI.render.typeHtml += '<div data-number="'+num+'-'+index+'" class="questions-hover questions-checkbox js-questions-option-click '+activeClass+'"  data-mychecked='+element.myChecked+' data-ischecked='+element.isChecked+'><label><span class="questions-checkbox-input"></span><span class="questions-options-item">'+CAICUI.render.answerArr[index]+'：'+'</span><div>'+element.title+'</div></label></div>'
					}
				})
				CAICUI.render.answerResolution = {
					status : right,
					rightAnswer : rightAnswer,
					myAnswer : myAnswer
				}
			},
			radio : function(context,num){
				var right = true;
				var rightAnswer = '';
				var myAnswer = '';
				_.each(context,function(element,index){
					var regExp = CAICUI.render.this.optionRegExpTest(element.title);
					if(!regExp){
						var activeClass = '';
						if(element.isChecked){
							rightAnswer += CAICUI.render.answerArr[index] + ' ';
						}
						if(element.myChecked){
							activeClass = 'active';
							myAnswer += CAICUI.render.answerArr[index] + ' ';
						}
						if(element.isChecked != element.myChecked){
							right = false;
						}
						CAICUI.render.typeHtml += '<div data-number="'+num+'-'+index+'" class="questions-hover questions-radio js-questions-option-click '+activeClass+'" data-mychecked='+element.myChecked+' data-ischecked='+element.isChecked+'><label><span class="questions-radio-input"></span><span class="questions-options-item">'+CAICUI.render.answerArr[index]+'：'+'</span><div>'+element.title+'</div></label></div>'
					}
				})
				CAICUI.render.answerResolution = {
					status : right,
					rightAnswer : rightAnswer,
					myAnswer : myAnswer
				}
			},
			question : function(context,num){
				var right = true;
				var blank = '';
				if(context[0].myBlank){
					blank = context[0].myBlank;
				}
				if(context[0].blank != context[0].myBlank){
					right = false;	
				}
				CAICUI.render.typeHtml += '<div data-number="'+num+'-0" class="questions-question js-questions-option-keyup"><textarea '+CAICUI.render.readonly+'>'+blank+'</textarea></div>'
				CAICUI.render.answerResolution = {
					status : right,
					rightAnswer : context[0].blank,
					myAnswer : context[0].myBlank
				}
			},
			blank : function(context,num){
				var right = true;
				var blank = '';
				if(context[0].myBlank){
					blank = context[0].myBlank;
				}
				if(context[0].blank != context[0].myBlank){
					right = false;	
				}
				CAICUI.render.typeHtml += '<div data-number="'+num+'-0" class="questions-blank js-questions-option-keyup"><input '+CAICUI.render.readonly+' type="input" value='+blank+'></div>'
				CAICUI.render.answerResolution = {
					status : right,
					rightAnswer : context[0].blank,
					myAnswer : context[0].myBlank
				}
			},
			matrix: function(type,context,num, showChecked){
				var data = context[0];
				var itemsLength = data.items.length;
				var cols = data.cols;
				var rows = data.rows;
				CAICUI.render.typeHtml += '<table class="questions-table questions-matrix questions-matrix-'+type+'"><tbody class="questions-tbody">';
				for(var i=0;i<rows;i++){
					CAICUI.render.typeHtml += '<tr class="questions-tr">';
					var rowsArray = [];
					for(var n=1;n<cols;n++){
						rowsArray.push(n+(i*cols));
					}
					for(var j=0;j<cols;j++){
						var item = j+(i*cols);
						var itemData = data.items[item];
						var isCheckedClass = '';
						var myBlank = '';
						if(itemData.title && item){
							CAICUI.render.typeHtml += '<td class="questions-td">'+itemData.title+'</td>'
						}else if(item){
							switch(type){
								case "matrixRadio" :
									if(itemData.myChecked){
										isCheckedClass = ' active';
									}
									CAICUI.render.typeHtml += '<td data-mychecked='+itemData.myChecked+' data-rowsArray='+rowsArray+' data-number="'+num+'-'+item+'" class="questions-td  questions-radio js-questions-option-click'+isCheckedClass +'" data-ischecked='+itemData.isChecked+'>'
									CAICUI.render.typeHtml += '<span class="questions-radio-input"></span>'
									break;
								case "matrixCheckbox":
									if(itemData.myChecked){
										isCheckedClass = ' active';
									}
									CAICUI.render.typeHtml += '<td data-mychecked='+itemData.myChecked+' data-number="'+num+'-'+item+'" class="questions-td  questions-checkbox js-questions-option-click'+isCheckedClass +'" data-ischecked='+itemData.isChecked+'>'
									CAICUI.render.typeHtml += '<span class="questions-checkbox-input"></span>'
									break;
								case "matrixBlank":
									if(itemData.myBlank){
										myBlank = itemData.myBlank;
									}
									CAICUI.render.typeHtml += '<td data-number="'+num+'-'+item+'" class="questions-td js-questions-option-keyup">'
									CAICUI.render.typeHtml += '<input '+CAICUI.render.readonly+' type="text" value="'+myBlank+'" >'
									break;
							}
							CAICUI.render.typeHtml += '</td>'
						}else{
							CAICUI.render.typeHtml += '<td class="questions-td"></td>'
						}
					}
					CAICUI.render.typeHtml += '</tr>'
				}
				CAICUI.render.typeHtml += '</tbody></table>';
			},
		  questionsResolution: function(type, context, answerResolution){
		  	context = CAICUI.render.pushContext;
		  	if(typeof context == 'string'){
		  		var context = JSON.parse(context);
		  	}
		  	
		  	CAICUI.render.questionsAnswerHtml = '';
		  	CAICUI.render.questionsAnswerHtml += '<p class="questions-answerResolution-p">问题解析</p>';
		  	var questionsStatus = 0;
		  	var questionsStatusClass = 'questions-answer-error';
		  	var thisBtn = '';
		  	if(CAICUI.render.exerciseIdOld){
		  		thisBtn = $('body #questions-card-'+CAICUI.render.exerciseIdOld);
		  	}else{
		  		thisBtn = $('body #questions-card-'+CAICUI.render.exerciseId);
		  	}
		  	var isDone = thisBtn.attr('data-isdone');
		  	if(isDone == 'true'){
		  		questionsStatus = 1;
		  		CAICUI.render.questionsStatus = "回答正确";
		  		questionsStatusClass = 'questions-answer-success';
		  	}else if(isDone == 'false'){
		  		questionsStatus = 2;
		  		CAICUI.render.questionsStatus = "回答错误 正确答案是：";
		  	}else{
		  		questionsStatus = 0;
		  		CAICUI.render.questionsStatus = "正确答案是：";
		  	}

		  	
		  	if(questionsStatus==1){
		  		CAICUI.render.questionsAnswerHtml += '<div class="questions-answer-status '+questionsStatusClass+'">'
		  		CAICUI.render.questionsAnswerHtml += '<span class="questions-answer ">'+CAICUI.render.questionsStatus+'</span>';
		  		CAICUI.render.questionsAnswerHtml +=  '</div>';
		  	}else if(questionsStatus==2){
		  		if(type == "multiTask"){
		  			CAICUI.render.questionsAnswerHtml += '<div class="questions-answer-status '+questionsStatusClass+'">'
		  				CAICUI.render.questionsAnswerHtml += '<span class="questions-answer ">'+CAICUI.render.questionsStatus+'</span>';
		  			_.each(context,function(element, index){
		  				
		  				CAICUI.render.questionsAnswer = '';
		  				CAICUI.render.questionsAnswerHtml += '<p class="questions-answerResolution-item">第'+(+index+1)+'题：</p>';
		  				CAICUI.render.this.questionsResolutionTypes(element.type,element.data, index, true);
		  			});
		  		}else{
		  			CAICUI.render.questionsAnswerHtml += '<div class="questions-answer-status '+questionsStatusClass+'">'
		  			CAICUI.render.questionsAnswerHtml += '<span class="questions-answer ">'+CAICUI.render.questionsStatus+'</span>';
		  			this.questionsResolutionTypes(type, context, 0, true);
		  		}
		  		CAICUI.render.questionsAnswerHtml +=  '</div>';
		  	}
		  	

		  	CAICUI.render.questionsAnswerHtml += '<div class="questions-answerResolution-content">';
		  	CAICUI.render.questionsAnswerHtml += '<span class="questions-answerResolution-text">解析：</span>';
		  	if(answerResolution){
		  		CAICUI.render.questionsAnswerHtml += answerResolution
		  	}else{
		  		CAICUI.render.questionsAnswerHtml += '暂无解析';
		  	}
		  	CAICUI.render.questionsAnswerHtml += '</div>'
		  	return CAICUI.render.questionsAnswerHtml;
		  },
		  questionsResolutionTypes : function(type, context, index, showChecked){
		  	switch(type){
		  		case "checkbox":
		  			CAICUI.render.this.checkboxChecked(context,index);
		  			// CAICUI.render.questionsAnswer += '正确答案是：'+CAICUI.render.answerResolution.rightAnswer;
		  			// if(CAICUI.render.answerResolution.myAnswer){
		  			// 	CAICUI.render.questionsAnswer += '，您的答案是：' + CAICUI.render.answerResolution.myAnswer;
		  			// }
		  			CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'+CAICUI.render.answerResolution.rightAnswer+'</span>'
		  			
		  			break;
		  		case "radio":
		  			CAICUI.render.this.radioChecked(context,index);
		  			// CAICUI.render.questionsAnswer += '正确答案是：'+CAICUI.render.answerResolution.rightAnswer;
		  			// if(CAICUI.render.answerResolution.myAnswer){
		  			// 	CAICUI.render.questionsAnswer += '，您的答案是：' + CAICUI.render.answerResolution.myAnswer;
		  			// }
		  			CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'+CAICUI.render.answerResolution.rightAnswer+'</span>'
		  			break;
		  		case "question":
		  			CAICUI.render.this.questionChecked(context,index);
		  			// CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'
		  			// if(CAICUI.render.answerResolution.myAnswer){
		  			// 	CAICUI.render.questionsAnswerHtml += '您的答案是：' + CAICUI.render.answerResolution.myAnswer;
		  			// }
		  			// CAICUI.render.questionsAnswerHtml +=  '</span>';
		  			// CAICUI.render.questionsAnswerHtml +=  '</p>';
		  			// CAICUI.render.questionsAnswerHtml += '<p>正确答案是：'+CAICUI.render.answerResolution.rightAnswer+'</p>';

		  			CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'+CAICUI.render.answerResolution.rightAnswer+'</span>'
		  			break;
		  		case "blank":
		  			// CAICUI.render.this.blankChecked(context,index);
		  			// CAICUI.render.questionsAnswer += '正确答案是：'+CAICUI.render.answerResolution.rightAnswer;
		  			// if(CAICUI.render.answerResolution.myAnswer){
		  			// 	CAICUI.render.questionsAnswer += '，您的答案是：' + CAICUI.render.answerResolution.myAnswer;
		  			// }
		  			// CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'+CAICUI.render.questionsAnswer+'</span>'
		  			// CAICUI.render.questionsAnswerHtml +=  '</p>';

		  			CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'+CAICUI.render.answerResolution.rightAnswer+'</span>'
		  			
		  			break;
		  		case "matrixRadio":
		  			// CAICUI.render.questionsAnswerHtml +=  '</p>';
		  			// CAICUI.render.questionsAnswerHtml += '<p>正确答案是：</p>';
		  			CAICUI.render.this.matrixChecked('matrixRadio',context,index, showChecked);
		  			break;
		  		case "matrixCheckbox":
		  			// CAICUI.render.questionsAnswerHtml +=  '</p>';
		  			// CAICUI.render.questionsAnswerHtml += '<p>正确答案是：</p>';
		  			CAICUI.render.this.matrixChecked('matrixCheckbox',context,index, showChecked);
		  			break;
		  		case "matrixBlank":
		  			// CAICUI.render.questionsAnswerHtml +=  '</p>';
		  			// CAICUI.render.questionsAnswerHtml += '<p>正确答案是：</p>';
		  			CAICUI.render.this.matrixChecked('matrixBlank',context,index, showChecked);
		  			break;
		  	}
		  	return CAICUI.render.questionsAnswerHtml;
		  },
		  checkboxChecked : function(context,num){
		  	var right = true;
		  	var rightAnswer = '';
		  	var myAnswer = '';
		  	_.each(context,function(element, index){
		  		var regExp = CAICUI.render.this.optionRegExpTest(element.title);
		  			if(!regExp){
		  			var activeClass = '';
		  			if(element.isChecked){
		  				rightAnswer += CAICUI.render.answerArr[index] + ' ';
		  			}
		  			if(element.myChecked){
		  				activeClass = 'active';
		  				myAnswer += CAICUI.render.answerArr[index] + ' ';
		  			}
		  			if(element.isChecked != element.myChecked){
		  				right = false;
		  			}
		  			CAICUI.render.typeHtml += '<div data-number="'+num+'-'+index+'" class="questions-hover questions-checkbox js-questions-option-click '+activeClass+'"  data-mychecked='+element.myChecked+' data-ischecked='+element.isChecked+'><label><span class="questions-checkbox-input"></span><span class="questions-options-item">'+CAICUI.render.answerArr[index]+'：'+'</span><div>'+element.title+'</div></label></div>'
		  		}
		  	})

		  	CAICUI.render.answerResolution = {
		  		status : right,
		  		rightAnswer : rightAnswer,
		  		myAnswer : myAnswer
		  	}
		  },
		  radioChecked : function(context,num){
		  	// console.log(context)
		  	var right = true;
		  	var rightAnswer = '';
		  	var myAnswer = '';
		  	_.each(context,function(element,index){
		  		var regExp = CAICUI.render.this.optionRegExpTest(element.title);
		  		if(!regExp){
		  			var activeClass = '';
		  			if(element.isChecked){
		  				rightAnswer += CAICUI.render.answerArr[index] + ' ';
		  			}
		  			if(element.myChecked){
		  				activeClass = 'active';
		  				myAnswer += CAICUI.render.answerArr[index] + ' ';
		  			}
		  			if(element.isChecked != element.myChecked){
		  				right = false;
		  			}
		  			CAICUI.render.typeHtml += '<div data-number="'+num+'-'+index+'" class="questions-hover questions-radio js-questions-option-click '+activeClass+'" data-mychecked='+element.myChecked+' data-ischecked='+element.isChecked+'><label><span class="questions-radio-input"></span><span class="questions-options-item">'+CAICUI.render.answerArr[index]+'：'+'</span><div>'+element.title+'</div></label></div>'
		  		}
		  	})
		  	CAICUI.render.answerResolution = {
		  		status : right,
		  		rightAnswer : rightAnswer,
		  		myAnswer : myAnswer
		  	}
		  },
		  questionChecked : function(context,num){
		  	var right = true;
		  	var blank = '';
		  	if(context[0].myBlank){
		  		blank = context[0].myBlank;
		  	}
		  	if(context[0].blank != context[0].myBlank){
		  		right = false;	
		  	}
		  	CAICUI.render.typeHtml += '<div data-number="'+num+'-0" class="questions-question js-questions-option-keyup"><textarea '+CAICUI.render.readonly+'>'+blank+'</textarea></div>'
		  	CAICUI.render.answerResolution = {
		  		status : right,
		  		rightAnswer : context[0].blank,
		  		myAnswer : context[0].myBlank
		  	}
		  },
		  blankChecked : function(context,num){
		  	var right = true;
		  	var blank = '';
		  	if(context[0].myBlank){
		  		blank = context[0].myBlank;
		  	}
		  	if(context[0].blank != context[0].myBlank){
		  		right = false;	
		  	}
		  	CAICUI.render.typeHtml += '<div data-number="'+num+'-0" class="questions-blank js-questions-option-keyup"><input '+CAICUI.render.readonly+' type="input" value='+blank+'></div>'
		  	CAICUI.render.answerResolution = {
		  		status : right,
		  		rightAnswer : context[0].blank,
		  		myAnswer : context[0].myBlank
		  	}
		  },
		  matrixChecked: function(type,context,num, showChecked){
		  	var data = context[0];
		  	var itemsLength = data.items.length;
		  	var cols = data.cols;
		  	var rows = data.rows;
		  	var isShowChecked = false;
		  	var isShowCheckedClass = '';
		  	var optionClick = '';
		  	var optionKeyup = '';
		  	var optionBlank = '';
		  	var optionDisabled = '';
		  	CAICUI.render.questionsAnswerHtml += '<table class="questions-table questions-matrix questions-matrix-'+type+'"><tbody class="questions-tbody">';
		  	for(var i=0;i<rows;i++){
		  		CAICUI.render.questionsAnswerHtml += '<tr class="questions-tr">';
		  		var rowsArray = [];
		  		for(var n=1;n<cols;n++){
		  			rowsArray.push(n+(i*cols));
		  		}
		  		for(var j=0;j<cols;j++){
		  			var item = j+(i*cols);
		  			var itemData = data.items[item];
		  			isShowChecked = false
		  			isShowCheckedClass = '';
		  			optionBlank = '';
		  			optionClick = ' js-questions-option-click';
		  			optionKeyup = ' js-questions-option-keyup'
		  			if(itemData.title && item){
		  				CAICUI.render.questionsAnswerHtml += '<td class="questions-td">'+itemData.title+'</td>'
		  			}else if(item){
		  				if(showChecked){
		  					optionClick = '';
		  					optionKeyup = '';
		  					if(itemData.isChecked){
		  						isShowChecked = true;
		  						isShowCheckedClass = ' active';

		  					}
		  					if(itemData.blank){
		  						console.log(itemData.blank)
		  						optionDisabled = 'disabled';
		  						optionBlank = itemData.blank;
		  					}
		  				}
		  				switch(type){
		  					case "matrixRadio" :
		  						CAICUI.render.questionsAnswerHtml += '<td data-mychecked='+isShowChecked+' data-rowsArray='+rowsArray+' data-number="'+num+'-'+item+'" class="questions-td  questions-radio '+isShowCheckedClass + optionClick+'" data-ischecked='+itemData.isChecked+'>'
		  						CAICUI.render.questionsAnswerHtml += '<span class="questions-radio-input"></span>'
		  						break;
		  					case "matrixCheckbox":
		  						CAICUI.render.questionsAnswerHtml += '<td data-mychecked='+isShowChecked+' data-number="'+num+'-'+item+'" class="questions-td  questions-checkbox '+isShowCheckedClass + optionClick+'" data-ischecked='+itemData.isChecked+'>'
		  						CAICUI.render.questionsAnswerHtml += '<span class="questions-checkbox-input"></span>'
		  						break;
		  					case "matrixBlank":
		  						CAICUI.render.questionsAnswerHtml += '<td data-mychecked='+isShowChecked+' data-number="'+num+'-'+item+'" class="questions-td '+optionKeyup+'">'
		  						CAICUI.render.questionsAnswerHtml += '<input '+CAICUI.render.readonly+' type="text" value="'+optionBlank+'" '+optionDisabled+'>'
		  						break;
		  				}
		  				CAICUI.render.questionsAnswerHtml += '</td>'
		  			}else{
		  				CAICUI.render.questionsAnswerHtml += '<td class="questions-td"></td>'
		  			}
		  		}
		  		CAICUI.render.questionsAnswerHtml += '</tr>'
		  	}
		  	CAICUI.render.questionsAnswerHtml += '</tbody></table>';
		  },

			questionsOptionClick: function(e){
				e.preventDefault();
				if(CAICUI.render.viewResolution){
					return false;
				}
				var that = CAICUI.iGlobal.getThat(e);
				var mychecked = that.attr('data-mychecked');
				var number = that.attr('data-number');
				var numberArray = number.split('-');
				if(mychecked=="true"){
					that.removeClass('active');
					mychecked = false;
					that.attr('data-mychecked',mychecked);
				}else{
					if(that.hasClass('questions-radio')){
						that.siblings().attr('data-mychecked','false')
						that.siblings().removeClass('active');
					}
					that.addClass('active');
					mychecked = true;
					that.attr('data-mychecked',mychecked)
				}
				if(CAICUI.render.questionsType=="multiTask"){
					this.changeMultiTaskQuestionsDataClick(CAICUI.render.pushContext[numberArray[0]].type,numberArray,mychecked,that);
				}else{
					this.changeQuestionsDataClick(CAICUI.render.questionsType,numberArray,mychecked,that);
				}
			},
			changeQuestionsDataClick : function(type,numberArray,checked,that){
				switch(type){
					case 'radio':
						_.each(CAICUI.render.pushContext,function(element, index){
							element.myChecked = false;
						})
						CAICUI.render.pushContext[numberArray[1]].myChecked = checked
						break;
					case 'checkbox':
						CAICUI.render.pushContext[numberArray[1]].myChecked = checked
						break;
					case 'matrixRadio':
						var rowsarray = that.attr('data-rowsarray').split(',');
						_.each(rowsarray,function(element, index){
							CAICUI.render.pushContext[0].items[element].myChecked = false;
						})
						CAICUI.render.pushContext[0].items[numberArray[1]].myChecked = checked
						break;
					case 'matrixCheckbox':

						CAICUI.render.pushContext[0].items[numberArray[1]].myChecked = checked
						break;
				}
			},
			changeMultiTaskQuestionsDataClick : function(type,numberArray,checked,that){
				switch(type){
					case 'radio':
						_.each(CAICUI.render.pushContext[numberArray[0]].data,function(element, index){
							element.myChecked = false;
						})
						CAICUI.render.pushContext[numberArray[0]].data[numberArray[1]].myChecked = checked
						break;
					case 'checkbox':
						CAICUI.render.pushContext[numberArray[0]].data[numberArray[1]].myChecked = checked
						break;
					case 'matrixRadio':
						var rowsarray = that.attr('data-rowsarray').split(',');
						_.each(rowsarray,function(element, index){
							CAICUI.render.pushContext[numberArray[0]].data[0].items[element].myChecked = false;
						})
						CAICUI.render.pushContext[numberArray[0]].data[0].items[numberArray[1]].myChecked = checked
						break;
					case 'matrixCheckbox':

						CAICUI.render.pushContext[numberArray[0]].data[0].items[numberArray[1]].myChecked = checked
						break;
				}
			},

			questionsOptionKeyup: function(e){
				e.preventDefault();
				var that = CAICUI.iGlobal.getThat(e);
				var number = that.attr('data-number');
				var numberArray = number.split('-');
				var thatVal = that.children().val();

				if(CAICUI.render.questionsType=="multiTask"){
					this.changeMultiTaskQuestionsDataKeyup(CAICUI.render.pushContext[numberArray[0]].type,numberArray,thatVal,that);
				}else{
					this.changeQuestionsDataKeyup(CAICUI.render.questionsType,numberArray,thatVal,that);
				}
			},
			changeQuestionsDataKeyup: function(type,numberArray,thatVal,that){
				switch(type){
					case 'blank':
						CAICUI.render.pushContext[numberArray[1]].myBlank = thatVal;
						break;
					case 'question':
						CAICUI.render.pushContext[numberArray[1]].myBlank = thatVal;
						break;
					case 'matrixQuestion':
						
						CAICUI.render.pushContext[0].items[numberArray[1]].myBlank = thatVal
						break;
					case 'matrixBlank':

						CAICUI.render.pushContext[0].items[numberArray[1]].myBlank = thatVal
						break;
				}
			},
			changeMultiTaskQuestionsDataKeyup: function(type,numberArray,thatVal,that){
				switch(type){
					case 'blank':
						CAICUI.render.pushContext[numberArray[0]].data[0].myBlank = thatVal;
						break;
					case 'question':
						CAICUI.render.pushContext[numberArray[0]].data[0].myBlank = thatVal;
						break;
					case 'matrixQuestion':
						
						CAICUI.render.pushContext[0].items[numberArray[1]].myBlank = thatVal
						break;
					case 'matrixBlank':

						CAICUI.render.pushContext[numberArray[0]].data[0].items[numberArray[1]].myBlank = thatVal
						break;
				}
			},
			questionsStatus: function(callback){
				if(CAICUI.render.questionsType=="multiTask"){
					var statusEnd = '';
					var statusRightTotal = 0;
					_.each(CAICUI.render.pushContext,function(element,index){
						statusEnd = CAICUI.render.this.questionsStatusMultiTask(element.type,index);
						if(statusEnd){
							statusRightTotal++;
						}
					})
					if(statusRightTotal == CAICUI.render.pushContext.length){
						CAICUI.render.status = 1;
					}else{
						CAICUI.render.status = 2;
					}
				}else{
					var questionsStatusOther = CAICUI.render.this.questionsStatusOther(CAICUI.render.questionsType);
					if(questionsStatusOther){
						CAICUI.render.status = 1;
					}else{
						CAICUI.render.status = 2;
					}
					
				}
				if(callback){callback()};
			},
			questionsStatusMultiTask : function(type,index){
				var status = '';
				var contextData = CAICUI.render.pushContext;
				if(type=='matrixRadio'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData[index].data[0].items,function(element, index){
						if(element.isChecked){
							isCheckedTotal++;
							if(element.myChecked){
								myCheckedTotal++;
							}
						}
					});
					if(isCheckedTotal == myCheckedTotal){
						status = true;
					}else{
						status = false;
					}
					if(myCheckedTotal){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='matrixCheckbox'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData[index].data[0].items,function(element, index){
						if(element.isChecked && element.myChecked){
							myCheckedNum++;
						}
						if(element.isChecked){
							isCheckedTotal++;
						}
						if(element.myChecked){
							myCheckedTotal++;
						}
					})
					if(myCheckedTotal == isCheckedTotal){
						if(isCheckedTotal && myCheckedNum && isCheckedTotal == myCheckedNum){
							status = true;
						}else{
							status = false;
						}
					}else{
						status = false;
					}
					if(myCheckedTotal){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type == 'radio'){
					status = true;
					_.each(contextData[index].data,function(element,index){
						if(element.isChecked){
							if(element.myChecked){
								status = true;
							}else{
								status = false;
							}
						}
						if(element.myChecked){
							CAICUI.render.isMyChecked = true;
						}
					})
				}else if(type=='checkbox'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData,function(element,index){
						if(element.isChecked && element.myChecked){
							myCheckedNum++;
						}
						if(element.isChecked){
							isCheckedTotal++;
						}
						if(element.myChecked){
							myCheckedTotal++;
							CAICUI.render.isMyChecked = true;
						}
					})
					if(myCheckedTotal == isCheckedTotal){
						if(isCheckedTotal && myCheckedNum && isCheckedTotal == myCheckedNum){
							status = true;
							
						}else{
							status = false;
						}
					}else{
						status = false;
					}
				}else if(type == 'blank'){
					var context = contextData[index].data[0];
					var blankText = context.blank;
					if(blankText==context.myBlank){
						status = true;
					}else{
						status = false;
					}
					if(context.myBlank){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='question'){
					var context = contextData[index].data[0];
					var blankText = context.blank;
					if(context.myBlank){
						status = true;
					}else{
						status = false;
					}
					if(context.myBlank){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type == 'matrixBlank'){
					status = true;
					_.each(contextData[index].data[0].items,function(element,index){
						//$(element.blank).text();
						var elementBlank = element.blank;
						if(elementBlank){
							if(elementBlank==element.myBlank){
								status = true;
							}else{
								status = false;
							}
						}
						if(element.myBlank){
							CAICUI.render.isMyChecked = true;
						}
					})
				}
				return status;
			},
			questionsStatusOther : function(type){
				var status = '';
				var contextData = CAICUI.render.pushContext;
				if(type=='radio'){
					status = true;
					_.each(contextData,function(element,index){
						if(element.isChecked){
							if(element.myChecked){
								status = true;
							}else{
								status = false;
							}
						}
						if(element.myChecked){
							CAICUI.render.isMyChecked = true;
						}
					})
				}else if(type=='checkbox'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData,function(element,index){
						if(element.isChecked && element.myChecked){
							myCheckedNum++;
						}
						if(element.isChecked){
							isCheckedTotal++;
						}
						if(element.myChecked){
							myCheckedTotal++;
							CAICUI.render.isMyChecked = true;
						}
					})
					if(myCheckedTotal == isCheckedTotal){
						if(isCheckedTotal && myCheckedNum && isCheckedTotal == myCheckedNum){
							status = true;
							
						}else{
							status = false;
						}
					}else{
						status = false;
					}
				}else if(type=='blank'){
					var blankText = contextData[0].blank;
					if(blankText==contextData[0].myBlank){
						status = true;
					}else{
						status = false;
					}
					if(contextData[0].myBlank){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='question'){
					var blankText = contextData[0].blank;
					if(contextData[0].myBlank){
						status = true;
					}else{
						status = false;
					}
					if(contextData[0].myBlank){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='matrixRadio'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData[index].data[0].items,function(element, index){
						if(element.isChecked){
							isCheckedTotal++;
							if(element.myChecked){
								myCheckedTotal++;
							}
						}
					});
					if(isCheckedTotal == myCheckedTotal){
						status = true;
					}else{
						status = false;
					}
					if(myCheckedTotal){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='matrixCheckbox'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData[index].data[0].items,function(element, index){
						if(element.isChecked && element.myChecked){
							myCheckedNum++;
						}
						if(element.isChecked){
							isCheckedTotal++;
						}
						if(element.myChecked){
							myCheckedTotal++;
						}
					})
					if(myCheckedTotal == isCheckedTotal){
						if(isCheckedTotal && myCheckedNum && isCheckedTotal == myCheckedNum){
							status = true;
						}else{
							status = false;
						}
					}else{
						status = false;
					}
					if(myCheckedTotal){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='matrixBlank'){
					status = true;
					_.each(contextData[0].items,function(element,index){
						//$(element.blank).text()
						var elementBlank = element.blank;
						if(elementBlank){
							if(elementBlank==element.myBlank){
								status = true;
							}else{
								status = false;
							}
						}
						if(element.myBlank){
							CAICUI.render.isMyChecked = true;
						}
					})
				}
				return status;
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
			toggleCards : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(CAICUI.render.cardOpen){
					CAICUI.render.cardOpen =false;
					that.removeClass('active');
					$('body .questions-cards').removeClass('active');
					//$('body .questions-cards').slideUp(200);
					that.find('.questions-card-span').text("展开答题卡")
				}else{
					CAICUI.render.cardOpen = true;
					that.addClass('active');
					$('body .questions-cards').addClass('active');
					//$('body .questions-cards').slideDown(200);
					that.find('.questions-card-span').text("收起答题卡")
				}
			},
			exit : function(){
				
				this.exitMsg(function(){
					CAICUI.render.this.$el.find('.questions').remove();
						CAICUI.render.cardOpen = false;
						CAICUI.render.ExerciseTotalTime = 0;
						CAICUI.render.errorNum = 0;
						CAICUI.render.exerciseCount = 0;
						CAICUI.render.exerciseDoneCount = 0;
						CAICUI.render.exerciseNoDoneCount = 0;
						CAICUI.render.exerciseRightCount = 0;
						CAICUI.render.myExamContinue = {};
						CAICUI.render.viewResolution = false;
					CAICUI.render.this.removeAnimate(function(){
					});
						// window.location.hash = '#courseStudy/'+CAICUI.render.courseId;

						var link = CAICUI.iGlobal.getUrlPara('return_link');
						if(CAICUI.iGlobal.getUrlPara('return_hash') == 'on'){
							window.location.hash = link;
						}else{
							window.location.href = link;
						}
				});
				
			},
			exitMsg : function(callback){
				clearInterval(CAICUI.render.timer);
				this.undelegateEvents();
				layer.msg('已记录您本章的练习进度', {time:1000}, function() {
					if(callback){callback()}
				});
			},
			clearInitData : function(){
				CAICUI.render.this.$el.find('.questions').remove();
				clearInterval(CAICUI.render.timer);
				CAICUI.render.this.undelegateEvents();
				CAICUI.render.cardOpen = false;
				CAICUI.render.ExerciseTotalTime = 0;
				CAICUI.render.errorNum = 0;
				CAICUI.render.exerciseCount = 0;
				CAICUI.render.exerciseDoneCount = 0;
				CAICUI.render.exerciseNoDoneCount = 0;
				CAICUI.render.exerciseRightCount = 0;
				CAICUI.render.myExamContinue = {};
				CAICUI.render.viewResolution = false;
			},
			clockTime : function(){
				CAICUI.render.timer = null;
				var num=CAICUI.render.ExerciseTotalTime;
				var clock = this.$el.find(".questions-times");
				jisuan(num);
				CAICUI.render.timer = setInterval(function(){
					num++;
					CAICUI.render.ExerciseTotalTime = jisuan(num);
				},1000);
				function jisuan(times){
					var t = parseInt(times); 
					var day1=Math.floor(t/(60*60*24)); 
					var hour=Math.floor((t-day1*24*60*60)/3600); 
					var minute=Math.floor((t-day1*24*60*60-hour*3600)/60); 
					var second=Math.floor(t-day1*24*60*60-hour*3600-minute*60); 
					if(hour<10) hour = "0"+hour;
					if(minute<10) minute = "0"+minute;
					if(second<10) second = "0"+second;
					clock.text(hour+":"+minute+":"+second);
					return t;
				}
			},
			questionsLoaderContent : function(){
				var templateHtml = $('#template-questions-testSite-loader-content').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml);
				$('body .questions-body #scroller').append(addHtml);
			},
			
			getExerciseId : function(callback){
				

				this.createIframe();
				this.getIframeData(function(data){
					if(callback){callback(data)};
				});
			},
			createIframe : function(){
				var iframe = $("<iframe>");
				var origin = window.location.origin;
				if(window.location.hostname=="localhost"){
					$(iframe).attr("src",'questions-id.html');
				}else{
					$(iframe).attr("src",window.origin+'/exercisecache/'+CAICUI.render.exerciseFilename);
				}
				
				$(iframe).attr("name","iframe_name");
				$(iframe).attr("id","iframe_name");
				$("body .questions").append(iframe);
			},
			getIframeData : function(callback){
				var iframeData =[];
				$('#iframe_name').load(function(){
					var iframeObj = $('body').find("#iframe_name").contents().find("body").html();
					if(iframeObj.split("</script>").length>1){
						iframeData = $.trim(iframeObj.split("</script>").slice(2)[0].split(",")).split(",");
					}else{
						iframeData = $.trim(iframeObj).split(",");
					}
					
					if(callback){callback(iframeData)}
				})
			},
			optionRegExpTest : function(string){
				// console.log(string)
				var regExp = false;
				if(string){
					var startString = string.slice(0,2);
					var endString = string.slice(2);
					
					if(startString == "选项"){
						regExp = new RegExp('点击这里编辑').test(endString);
					}
				}
				
				return regExp;
			},
			openSidebar : function(e){
				if(CAICUI.render.cardOpen){
					$('body .questions-card-button').trigger('click');
				}
				$('body .questions-cards').removeClass('active');
				var that = CAICUI.iGlobal.getThat(e);
				var dataControl = that.attr('data-control');
	    	var index = $(this).index();
	    	var videoRight = $('body .studycenter-video-main-right .questions-type-'+dataControl);
	    	var dispaly = videoRight.attr('data-display');
	    	if(dispaly == 'hidden'){
	    		$('body .right-questions-item-count').text((+CAICUI.render.questionsIndex+1));
	    		// CAICUI.render.taskId = videoController.currentTask.taskId;
	    		// CAICUI.render.progerss = videoController.currentTask.progress;
	    		// $(".right-time").html(videoController.formatSeconds(videoController.currentTask.progress));
	    		if(dataControl=="note"){
	    			
	    			this.showNode();
	    		}else if(dataControl=="quiz"){
	    			this.showQuestions();
	    		}
	    		$('body .studycenter-video-right').addClass('hidden');
	    		// videoRight.siblings().addClass('hidden');
	    		videoRight.removeClass('hidden');
	    		$('body .studycenter-video-right').attr('data-display','hidden');
	    		videoRight.attr('data-display','show');
	    		// this.animateSidebar(410,500);
		    	$('body .questions-body-context').css({
	    			'padding-right' : 410
	    		})
	    		$('body .studycenter-video-main-right').css({
	    			'right' : 0
	    		})
	    	}else{
	    		//$('.studycenter-video-main').removeClass('active');
	    		// this.animateSidebar(0,500)
		    	$('body .questions-body-context').css({
	    			'padding-right' : 168
	    		})
	    		$('body .studycenter-video-main-right').css({
	    			'right' : -410
	    		})
	    		videoRight.addClass('hidden');
	    		videoRight.attr('data-display','hidden');
	    	}
	    },
	    animateSidebar : function(num,time){
	    	$('body .questions-body-context').css({
    			'padding-right' : num
    		})
    		$('body .studycenter-video-main-right').css({
    			'right' : -(410-num)
    		})
	    },
      closeSidebar : function(){
      	var videoRight = $('body .studycenter-video-right');
  			videoRight.siblings().addClass('hidden');

      	this.animateSidebar(0,500);
      },
	    showQuestions : function(){
	    	$('#ac-new-video').attr('src','script/libs/xneditor/ac-new-video.html');
	    },
	    showNode : function(){
	    	$('body .node-editor-textarea').val('');
	    	$('body .add-photo-show').remove();
	    },
	    nodeEditorIsOpenButton : function(e){
	    	var that = CAICUI.iGlobal.getThat(e);
	    	var thatPrev = that.prev();
	    	if(that.hasClass('active')){
	    		that.removeClass('active');
	    		thatPrev.text('私有');
	    		CAICUI.render.isPublic =  1;
	    	}else{
	    		that.addClass('active');
	    		thatPrev.text('公开');
	    		CAICUI.render.isPublic =  0;
	    	}
	    },
	    uploadFormFile : function(){
	    	CAICUI.iGlobal.fileUpload({
	        'formClass' : 'uploadForm'
	      }, function(returndata){
					CAICUI.iGlobal.fileUploadAddList('uploadForm', returndata);
				})
	    },
	    nodeEditorConfirm : function(){
				var nodeEditorTextarea = $('body #node-editor-textarea').val();
		    if (!nodeEditorTextarea) {
						layer.msg('Sorry~ 请输入内容！', function() {});
		        return false;
		    }
		    CAICUI.render.imgPath = '';
		    if(CAICUI.render.imgPathArray.length){
		    	for(var i=0;i<CAICUI.render.imgPathArray.length;i++){
		    		i ? CAICUI.render.imgPath += ',' + CAICUI.render.imgPathArray[i] : CAICUI.render.imgPath += CAICUI.render.imgPathArray[i];
		    	}
		    }else{
		    	CAICUI.render.imgPath = '';
		    }
		    CAICUI.Request.ajax({
					'server' : 'nodesave',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : '',
						'content' : nodeEditorTextarea,
						'clientType' : CAICUI.render.clientType,
						'title' : CAICUI.render.chapterName,
						'isPublic' : CAICUI.render.isPublic,

						'courseId' : CAICUI.render.courseId,
						'subjectId' : CAICUI.render.subjectId,
						'categoryId' : CAICUI.render.categoryId,
						'chapterId' : CAICUI.render.chapterId,
						'subjectName' : CAICUI.render.subjectName,
						'categoryName' : CAICUI.render.categoryName,
						'courseName' : CAICUI.render.courseName,
						'chapterName' : CAICUI.render.chapterName,

						'taskId' : CAICUI.render.exerciseId,
						'taskName' : CAICUI.render.exerciseId,
						'taskProgress': (+CAICUI.render.questionsIndex+1)+'题',

						
						'imgPath' : CAICUI.render.imgPath,
						'clientType' : 'pc'
					},
					done : function(data){
						if (data.state == 'success') {

  				    //layer.close(videoController.load);
  				    layer.msg('保存成功！', {
  				    	shade: true,
  				    	icon: 1,
  				    	time: 500
  				    },function(){
  				    	CAICUI.render.this.closeSidebar();
  				    	$('body .right-title-input').val('');
  				    });
    				}
					},
					fail : function(data){
						layer.msg('Sorry~ 笔记保存失败', function() {});
					}
				})
	    },
  		addPhotoRemove : function(e){
  			var that = CAICUI.iGlobal.getThat(e);
  			var thatPrev = that.prev();
  			var thatPrevSrc = that.attr('data-src');
  			for(var i=0; i<CAICUI.render.imgPathArray.length; i++){
  				if(CAICUI.render.imgPathArray[i] == thatPrevSrc){
  					CAICUI.render.imgPathArray.splice(i,1);
  					break;
  				}
  			}
  			var parent = that.parent();
  			parent.remove();
        if($('body .add-photo-show').length < 5){
      		$('body #uploadForm').show();
      	}
  		},
      viewOther : function(e){
      	var that = CAICUI.iGlobal.getThat(e);
      	var thatLink = that.attr('link');
      	this.exitMsg(function(){
      		window.location.hash = thatLink;
      	})
      	
      }
		});
		return Studycenter;
	});