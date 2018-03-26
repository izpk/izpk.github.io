;define([
	'jquery',
	'underscore',
	'backbone',
	'views/ac-list',
	'views/ac-new',
	'views/ac-desc',
	'views/pagination',
	'swiper',
	'storage',
	'layer',
	// 'layerExt',
	],function($, _, Backbone, AcList, AcNew, AcDesc, Pagination, Swiper, storage){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-course-ac').html()),
			events : {
				// 'mouseleave .courseIndex-ul' : 'courseNavUlLeave',
				// 'mouseenter .courseIndex-li' : 'courseNavLiEnter',
				// 'mouseleave .courseIndex-li' : 'courseNavLiLeave',
				
				'click .ac-new' : 'acNew',
				'click .option-li-newAcType' : 'optionLiNewAcType',
				'keyup .newAc-title' : 'newAcTitle',
				'mouseleave .ac-select-box' : 'selectBoxLeave',
				'click .ac-select-a' : 'acSelectA',
				'click .ac-option-li' : 'addActive',
				'click .js-ac-list-active' : 'acListActive',
				'click .ac-Ad-close' : 'acAdClose',
				'click .ac-editor-select' : 'acSelectA',
				'click .js-course-ac-change' : 'courseChange',
				'click .option-li' : 'acOptionChoose',
				'click .js-pagination-li' : 'paginationChange',
				'click .js-pagination-prev' : 'paginationPrev',
				'click .js-pagination-next' : 'paginationNext',
				'click .ac-desc-like-a' : 'likeAc',
				'click .ac-search-a' : 'searchAc',
				'click .editor-button-box' : 'editorButtonBox',
				'click .ac-list-info-video' : 'acVideoLink',
				'click .ac-list-remove' : 'acRemove',
				'click .ac-list' : 'acListShow',
				'click .ac-answer-replys' : 'acAnswerReplys',
				'click .js-ac-load-cancel' : 'acLoadCancel',
				'click .js-ac-load-confirm' : 'acLoadConfirm',
				'click .js-acReply-load-cancel' : 'acReplyLoadCancel',
				'click .js-acReply-load-confirm' : 'acReplyLoadConfirm',

			},
			render : function(courseId){
				CAICUI.render.layer = layer;
				this.$header = this.$('.courseIndex-header');
				this.$courseNavUl = this.$('.courseIndex-ul');
				this.$courseNavLi = this.$('.courseIndex-li');
				this.$courseIndexActiveBox = this.$('.courseIndex-active-box');
				this.$scroller = this.$('#scroller');
				
				this.$acRight = this.$('.ac-right');
				this.courseNavPreDefault = 1;
				this.courseNavPre = 1;
				this.courseNavAnimateTime = 300;

				CAICUI.render.subjectId = '';
				CAICUI.render.courseId = courseId;
				CAICUI.render.$this = this;
				CAICUI.render.serverTotal = 5;
				CAICUI.render.serverNum = 0;

				CAICUI.render.self = 0;
				CAICUI.render.type = 3;
				CAICUI.render.ordertype = 1;
				CAICUI.render.pageNo = 1;
				CAICUI.render.pageSize = 20;
				CAICUI.render.search = '';
				CAICUI.render.totalCount = '';
				CAICUI.render.pageTotal = 0;

				CAICUI.render.bbsId = '';
				CAICUI.render.bbsType = 0;

				CAICUI.render.listActive = '';
				CAICUI.render.replayId = '';
				CAICUI.render.replayContent = '';

				CAICUI.render.parentsAcListActive = '';
				CAICUI.render.acRemoveLoad = '';
				CAICUI.render.parentLi = '';
				CAICUI.render.acReplayRemoveLoad = '';

				this.$learningcourse = '';
				this.learningcourse();

				this.$bbslist = '';
				
				
				this.$ad_discuss = '';
				this.ad_discuss();

				this.$courseBaseInfo = '';

				this.$bbs_forumlistShow = '';
				this.bbs_forumlistShow();
				this.$newtids = [];
				CAICUI.render.timer = setInterval(function(){
					if(CAICUI.render.serverTotal==CAICUI.render.serverNum){
						clearInterval(CAICUI.render.timer);
						var random = Math.floor(Math.random()*(CAICUI.render.$this.$bbslist.length)+1);
						CAICUI.render.$this.$bbslist.splice(random,0,{
							"isAd" : true,
							"ad_discuss" : CAICUI.render.$this.$ad_discuss
						});
						CAICUI.render.$this.getForumlistShow();
						var filterLearningcourse = CAICUI.render.$this.filterLearningcourse(CAICUI.CACHE.Learningcourse);
						CAICUI.render.$this.$el.html(CAICUI.render.$this.template({
							'data' : {
								'courseId' : CAICUI.render.courseId,
								'learningcourse' : filterLearningcourse,
								'courseBaseInfo' : CAICUI.render.$this.$courseBaseInfo,
								'bbslist' : CAICUI.render.$this.$bbslist,
								'ad_discuss' : CAICUI.render.$this.$ad_discuss,
								'pageNo' : CAICUI.render.pageNo,
								'pageSize' : CAICUI.render.pageSize,
								'totalCount' : CAICUI.render.totalCount,
								'bbs_forumlistShow' : CAICUI.render.$this.$bbs_forumlistShow,
								'newtids' : CAICUI.render.$this.$newtids
							}
						}));
						
						CAICUI.iGlobal.getTemplateCourseNav('body .courseIndex-header-right',{
							"courseType" : 'course',
							"type" : 'ac',
							"courseId" : CAICUI.render.courseId
						});
						window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
						$('body .ac-list-li-content').eq(0).trigger('click');
						var swiper = new Swiper('.ac-swiper-container', {
							autoplay: 2500,
							loop: true
						});
					}
				},CAICUI.render.time);
			},
			ad_discuss : function(){
				CAICUI.Request.ajax({
					'server' : 'ad_discuss',
					'data' : {
						'token' : CAICUI.User.token,
						'number' : 3
					},
					done : function(data){
						CAICUI.render.serverNum ++;
						CAICUI.render.$this.$ad_discuss = data.data;
					},
					fail : function(data){
						CAICUI.render.serverNum ++;
						CAICUI.render.$this.$ad_discuss = {};
					}
				});

			},
			bbs_forumlistShow : function(){
				CAICUI.Request.ajax({
					'server' : 'bbs_forumlistShow',
					'data' : {
						'token' : CAICUI.User.token
					},
					done : function(data){
						CAICUI.render.serverNum ++;
						CAICUI.render.$this.$bbs_forumlistShow = data;

					},
					fail : function(data){
						CAICUI.render.serverNum ++;
						CAICUI.render.$this.$bbs_forumlistShow = {};
					}
				});

			},
			learningcourse : function(){
				if(!CAICUI.CACHE.Learningcourse  || !CAICUI.CACHE.Learningcourse.length){
					CAICUI.Request.ajax({
						'server' : 'learningcourse',
						'data' : {
							'token' : CAICUI.User.token,
							'pageNo' : 1,
							'pageSize' : CAICUI.defaultPageSize
						},
						done : function(data){

							
							

							console.log(data);
							var isGetCourseBaseInfo = true;
							_.each(data.data.courselist,function(element,index){
								if(element.courseId == CAICUI.render.courseId){
									isGetCourseBaseInfo = false;
									CAICUI.render.subjectId = element.subjectID;
								}
							});
							if(isGetCourseBaseInfo){
								CAICUI.render.$this.courseBaseInfo(CAICUI.render.courseId);
							}else{
								CAICUI.render.serverNum ++;
							}
							CAICUI.render.serverNum ++;
							CAICUI.CACHE.Learningcourse = data.data.courselist;
							CAICUI.CACHE.RecentCourse = data.data.courselist.slice(0,2);
							CAICUI.render.$this.bbslist();
						},
						fail : function(data){
							CAICUI.render.serverNum ++;
							CAICUI.CACHE.Learningcourse = {};
							CAICUI.CACHE.RecentCourse = {};
							CAICUI.render.$this.bbslist();
						}
					});
				}else{
					var isGetCourseBaseInfo = true;
					_.each(CAICUI.CACHE.Learningcourse,function(element,index){
						if(element.courseId == CAICUI.render.courseId){
							isGetCourseBaseInfo = false;
							CAICUI.render.subjectId = element.subjectID;
						}
					});
					if(isGetCourseBaseInfo){
						this.courseBaseInfo(CAICUI.render.courseId);
					}else{
						CAICUI.render.serverNum ++;
					}

					CAICUI.render.serverNum ++;
					CAICUI.render.$this.bbslist();
				}
			},
			courseBaseInfo : function(courseId){
				CAICUI.Request.ajax({
					'server' : 'coursesBaseInfo',
					'data' : {
						'token' : CAICUI.User.token,
						'courseIds' : courseId
					},
					done : function(data){
						CAICUI.render.serverNum ++;
						CAICUI.render.$this.$courseBaseInfo = data.data[0];
					},
					fail : function(data){
						CAICUI.render.serverNum ++;
						CAICUI.render.$this.$courseBaseInfo = {};
					}
				});
			},
			bbslist : function(callback){
				CAICUI.Request.ajax({
					'server' : 'bbslist',
					'data' : {
						'token' : CAICUI.User.token,
						'type' : CAICUI.render.type,
						'subjectId' : CAICUI.render.subjectId,
						'keyWords' : CAICUI.render.search,
						'self' : CAICUI.render.self,
						'ordertype' : CAICUI.render.ordertype,
						'pageNo' : CAICUI.render.pageNo,
						'pageSize' : CAICUI.render.pageSize
					},
					done : function(data){
						if(callback){
							callback(data);
						}else{
							CAICUI.render.serverNum ++;
							CAICUI.render.$this.$bbslist = data.data;

							CAICUI.render.pageNo = data.pageNo;
							CAICUI.render.pageSize = data.pageSize;
							CAICUI.render.totalCount = data.totalCount;
							CAICUI.render.pageTotal = Math.ceil(data.totalCount/data.pageSize);
						}
					},
					fail : function(data){
						CAICUI.render.serverNum ++;
						CAICUI.render.$this.$bbslist = {};
						layer.msg('Sorry~ 网络错误，请刷新页面！', function() {});
					}
				});
			},
			bbsdetail : function(callback){
				CAICUI.Request.ajax({
					'server' : 'bbsdetail',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.replayId,
						'pageNo' : 1,
						'pageSize' : 20
					},
					done : function(data){
						callback(data.data);
					},
					fail : function(data){
						callback({});
					}
				});
			},
			likeAc : function(){
				CAICUI.Request.ajax({
					'server' : 'bbs_praise',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.replayId,
						'action' : 2,
					},
					done : function(data){
						CAICUI.render.listActive.find('.ac-list-info-like-num').text(data.data.totalCount);
						$('.ac-desc-like-num').text(data.data.totalCount);
					},
					fail : function(data){
						layer.msg('Sorry~ ', function() {});
					}
				});
			},
			bbs_del : function(callback){
				CAICUI.Request.ajax({
					'server' : 'bbs_del',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.bbsId,
						'type' : CAICUI.render.bbsType
					},
					done : function(data){
						if(callback){
							callback();
						}
					},
					fail : function(data){
						layer.msg('Sorry~ 您没有当前帖子的删除权限', function() {});
					}
				});
			},
			acListActive : function(e){
				e.stopPropagation();
				CAICUI.iGlobal.loading('.ac-right');
				var that = CAICUI.iGlobal.getThat(e);
				var id = that.attr('data-id');
				var isme = that.attr('data-isme');
				var isnew = that.attr('data-isnew');
				var parentsLi = that.parents('.ac-list-li');
				CAICUI.render.listActive = that;
				parentsLi.siblings().removeClass('active');
				parentsLi.addClass('active');
				CAICUI.render.replayId = parentsLi.attr('data-id');
				this.bbsdetail(function(data){
					var acDesc = new AcDesc();
					$('.ac-content').find('.ac-right').remove();
					$('.ac-content').append(acDesc.render({
						"data" : data,
						"isme" : isme
					}).el);
					if(isnew=='true'){
						that.attr('data-isnew','false');
						that.find('.icon-post-type-2').remove();
						CAICUI.render.$this.addForumlistShowStorage({
							"id" : id,
							"time" : parseInt(new Date().getTime()/1000)
						});
					}
					setTimeout(function(){
						window.CAICUI.acScroll = CAICUI.iGlobal.iScroll('body #wrapper-ac');
						layer.photos({
				      photos: '.discussQA-imgPath',
				      shift : 0
				    });
					},300);
				});
			},

			acList : function(data){
				var acList = new AcList();
				this.$scroller.html(acList.render(data).el);
			},
			getThat : function(e){
				return $(e.currentTarget);
			},
			courseNavAnimate : function(box,type){
				box.stop(true,false).animate({
					'width' : '148px'
				},this.courseNavAnimateTime);
			},
			courseNavPreAnimate : function(index){
				var li = this.$('.courseIndex-li').eq(index);
				var addHover = false;
				if(CAICUI.render.$this.$('.courseIndex-ul').hasClass('hover')){
					//CAICUI.render.$this.$('.courseIndex-ul').removeClass('hover')
				}else{
					addHover = true;
				}
				this.$('.courseIndex-active-box').eq(index).stop(true,false).animate({
					'width' : 34,
					'marginLeft' : 0
				},this.courseNavAnimateTime,function(){
					li.removeClass('hover');
					if(addHover){
						CAICUI.render.$this.$('.courseIndex-ul').addClass('hover');
						addHover = false;
					}
				});
			},
			courseNavLiEnter : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var index = that.index();
				var box = that.find('.courseIndex-active-box');
				if(index==this.courseNavPre){
					return false;
				}
				that.addClass('hover');
				this.courseNavPreAnimate(this.courseNavPre);
				this.courseNavAnimate(box,index);
				this.courseNavPre = index;
			},
			courseNavUlLeave : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				this.courseNavPreAnimate(this.courseNavPre);
				this.courseNavPre = this.courseNavPreDefault;
				this.$courseNavLi.eq(this.courseNavPre).addClass('hover');
				this.courseNavAnimate(this.$('.courseIndex-active-box').eq(this.courseNavPre),this.courseNavPre);
				CAICUI.render.$this.$('.courseIndex-ul').removeClass('hover');
			},
			courseNavLiLeave : function(e){
				//e.stopPropagation();
			},
			
			acNew : function(e){
				if(this.$courseBaseInfo){
					layer.msg('Sorry~ 您没有当前课程的发帖权限', function() {});
				}else{
					CAICUI.render.newAcType = 1;
					CAICUI.render.newAcTitle = '';
					if(CAICUI.render.listActive){
						CAICUI.render.listActive.removeClass('active');
					}
					var that = CAICUI.iGlobal.getThat(e);
					var acNew = new AcNew();
					$('.ac-content').find('.ac-right').remove();
					$('.ac-content').append(acNew.render().el);
				}
			},
			optionLiNewAcType : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.newAcType = that.attr('data-type');
				console.log(CAICUI.render.newAcType);
			},
			newAcTitle : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatTitle = that.val();
				var titleLength = thatTitle.length;
				if(titleLength>50){
					CAICUI.render.newAcTitle = thatTitle.substr(0,50);
					$('.ac-editor-num').text('还可以输入0字');
					that.val(CAICUI.render.newAcTitle);
				}else{
					CAICUI.render.newAcTitle = thatTitle;
					$('.ac-editor-num').text('还可以输入'+(50-titleLength)+'字');
				}
			},
			nextDomShow : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.next().toggleClass('active');
			},
			addActive : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.siblings().removeClass('active');
				that.addClass('active');
			},
			acSelectA : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.toggleClass('active');
				that.next().toggleClass('active');
			},
			acSelectAChange : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.toggleClass('active');
				that.next().toggleClass('active');

			},
			selectBoxLeave : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.find('a').removeClass('active');
				that.find('ul').removeClass('active');
			},
			acAdClose : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var parentsLi = that.parents('li');
				parentsLi.remove();
				window.CAICUI.myScroll.refresh();
			},
			acEditorSelect : function(e){
				var that = CAICUI.iGlobal.getThat(e);
			},
			courseChange : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.toggleClass('active');
				$('.course-change-ul').toggleClass('active');
			},
			acOptionChoose : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatText = that.find('.option-a').text();
				
				that.siblings().removeClass('active');
				that.addClass('active');
				that.parent().removeClass('active');
				that.parent().prev().removeClass('active');
				that.parent().prev().find('.ac-select-text').text(thatText);
				if(that.hasClass('option-li-render')){
					CAICUI.render.type = that.attr('data-type') ? that.attr('data-type') : CAICUI.render.type;
					CAICUI.render.ordertype = that.attr('data-ordertype') ? that.attr('data-ordertype') : CAICUI.render.ordertype;
					this.acOptionChooseRender();
				}
			},
			acOptionChooseRender : function(){
				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				CAICUI.render.pageNo = 1;
				this.bbslist(function(data){
					var acList = new AcList();
					$('body #scroller').html(acList.render({
						'data' : {
							'type' : 0,
							'bbslist' : data.data,
							'newtids' : CAICUI.render.$this.$newtids,
							'pageNo': data.pageNo,
							'pageSize': data.pageSize,
							'totalCount': data.totalCount
						}
					}).el);
					window.CAICUI.myScroll.refresh();
				});
			},
			paginationChange : function(e){
				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo =that.attr('data-pageno');
				this.bbslist(function(data){
					var acList = new AcList();
					$('body #scroller').html(acList.render({
						'data' : {
							'type' : 0,
							'bbslist' : data.data,
							'newtids' : CAICUI.render.$this.$newtids,
							'pageNo': data.pageNo,
							'pageSize': data.pageSize,
							'totalCount': data.totalCount
						}
					}).el);
					window.CAICUI.myScroll.refresh();
				});
			},
			paginationPrev : function(e){
				if(CAICUI.render.pageNo>1){
					CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = +CAICUI.render.pageNo-1;
					this.bbslist(function(data){
						var acList = new AcList();
						$('body #scroller').html(acList.render({
							'data' : {
								'type' : 0,
								'bbslist' : data.data,
								'newtids' : CAICUI.render.$this.$newtids,
								'pageNo': data.pageNo,
								'pageSize': data.pageSize,
								'totalCount': data.totalCount
							}
						}).el);
					window.CAICUI.myScroll.refresh();
				});
				}
			},
			paginationNext : function(e){
				if(CAICUI.render.pageNo<=CAICUI.render.pageTotal-1){
					CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = +CAICUI.render.pageNo+1;
					this.bbslist(function(data){
						var acList = new AcList();
						$('body #scroller').html(acList.render({
							'data' : {
								'type' : 0,
								'bbslist' : data.data,
								'newtids' : CAICUI.render.$this.$newtids,
								'pageNo': data.pageNo,
								'pageSize': data.pageSize,
								'totalCount': data.totalCount
							}
						}).el);
						window.CAICUI.myScroll.refresh();
					});
				}
			},
			searchAc : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatPrev = that.prev();
				var thatPrevText = thatPrev.val();

				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				CAICUI.render.pageNo = 1;
				CAICUI.render.search = thatPrevText;
				this.bbslist(function(data){
					var acList = new AcList();
					$('body #scroller').html(acList.render({
						'data' : {
							'search' : true,
							'type' : 0,
							'bbslist' : data.data,
							'newtids' : CAICUI.render.$this.$newtids,
							'pageNo': data.pageNo,
							'pageSize': data.pageSize,
							'totalCount': data.totalCount
						}
					}).el);
					thatPrev.val('');
					CAICUI.render.search = '';
					window.CAICUI.myScroll.refresh();
				});
			},
			editorButtonBox : function(e){
				console.log(123)
			},
			acVideoLink : function(e){
				e.stopPropagation();
				CAICUI.NavVideo = false;
				CAICUI.domRender = false;
				var that = CAICUI.iGlobal.getThat(e);
				window.location.hash = that.attr('link');
			},
			acRemove : function(e){
				e.stopPropagation();
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.bbsType = that.attr('data-type');
				var parents = that.parents('.ac-list-li');
				CAICUI.render.bbsId  = parents.attr('data-id');
				CAICUI.render.parentsAcListActive = parents;
				CAICUI.render.acRemoveLoad = layer.load(1, {
					type : 1,
					title : false,
					content: $('#remove-ac-load'),
					closeBtn : 0,
				  shade: [0.5,'#000'] //0.1透明度的白色背景
				});
			},
			acLoadCancel : function(){
				layer.close(CAICUI.render.acRemoveLoad);
			},
			acLoadConfirm : function(){
				this.bbs_del(function(){
					CAICUI.render.parentsAcListActive.remove();
					$('body .ac-right').empty();
					window.CAICUI.acScroll.refresh();
					window.CAICUI.myScroll.refresh();
					layer.close(CAICUI.render.acRemoveLoad);
				});
			},
			acListShow : function(e){
				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				CAICUI.render.ordertype = 1;
				CAICUI.render.pageNo = 1;
				CAICUI.render.search = '';
				this.bbslist(function(data){
					var acList = new AcList();
					$('body #scroller').html(acList.render({
						'data' : {
							'search' : true,
							'type' : 0,
							'bbslist' : data.data,
							'newtids' : CAICUI.render.$this.$newtids,
							'pageNo': data.pageNo,
							'pageSize': data.pageSize,
							'totalCount': data.totalCount
						}
					}).el);
					window.CAICUI.myScroll.refresh();
				});
			},
			acAnswerReplys : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var parentLi = that.parents('.ac-answer-li');
				CAICUI.render.bbsId = that.attr('data-pid');
				CAICUI.render.bbsType = that.attr('data-type');
				CAICUI.render.parentLi = parentLi;
				CAICUI.render.acReplayRemoveLoad = layer.load(1, {
					type : 1,
					title : false,
					content: $('#remove-acReply-load'),
					closeBtn : 0,
				  shade: [0.5,'#000'] //0.1透明度的白色背景
				});
			},
			acReplyLoadCancel : function(){
				layer.close(CAICUI.render.acReplayRemoveLoad);
			},
			acReplyLoadConfirm : function(){
				this.bbs_del(function(){
					if(CAICUI.render.parentLi.siblings().length){
						CAICUI.render.parentLi.remove();
						var acReplay = $('.ac-answer-li');
						acReplay.each(function(index){
							var that = $(this);
							that.find('.ac-answer-floor').text(index+1);
						})
					}else{
						CAICUI.render.parentLi.parent().remove();
						CAICUI.render.parentLi.remove();
					}
					var discussNum = CAICUI.render.$this.$('.ac-list-ul .ac-list-li.active').find('.ac-list-info-discuss-num');
					var discussNumText = discussNum.text();
					discussNum.text(+discussNumText-1);
					window.CAICUI.acScroll.refresh();
					layer.close(CAICUI.render.acReplayRemoveLoad);
				});
			},
			getForumlistShow : function(){
				//this.removeOldForumlistShowStorage();
				var fid = 0;
				var bbs_forumlistShow = CAICUI.render.$this.$bbs_forumlistShow;
				var fidData = '';
				if(CAICUI.render.$this.$bbslist && CAICUI.render.$this.$bbslist.length){
					fid = CAICUI.render.$this.$bbslist[0]['fid'];
				}
				console.log(fid);
				for(var i in bbs_forumlistShow){
					if(+bbs_forumlistShow[i]['fid'] == fid){
						fidData = bbs_forumlistShow[i];
						break;
					}
				}
				console.log(fidData);
				for(var i in fidData['newtids']){
					CAICUI.render.$this.$newtids.push({
						"id" : i,
						"time" : fidData['newtids'][i]
					})
				}
				console.log(CAICUI.render.$this.$newtids)
			},
			addForumlistShowStorage : function(args){
				var acActive = CAICUI.Storage.getStorage('acActive');
				if(acActive){
					acActive.push(args);
					CAICUI.Storage.setStorage({'acActive':acActive})
				}else{
					CAICUI.Storage.setStorage({'acActive':[args]})
				}
			},
			removeOldForumlistShowStorage : function(){
				var acActive = CAICUI.Storage.getStorage('acActive');
				console.log(acActive)
				var nowDate = parseInt(new Date().getTime()/1000);
				for(var i in acActive){
					var newDate = parseInt((nowDate-acActive[i]['time']));
					if(newDate<0){
						newDate = 1;
					}
	        var $newDate = Math.ceil(newDate/(3600*24));
					console.log($newDate)
				}
				CAICUI.iGlobal.stringData();

			},
			filterLearningcourse : function(stooges){
				var courseListNav = _.chain(stooges)
				 	.map(function(stooge){ return stooge.categoryName ; })
				  .uniq()
				  .value();
				var courseListIndex = _.chain(stooges)
				 	.map(function(stooge){ return stooge.categoryIndex ; })
				  .uniq()
				  .value();
				var courseLists = [];
				for(var i=0;i<courseListNav.length;i++){
					courseLists.push({
						"categoryName" : courseListNav[i],
						"categoryIndex" : courseListIndex[i],
						"list" : []
					});
					_.each(stooges,function(element , index, list){
						if(element.categoryName == courseListNav[i]){
							if(courseLists && courseLists[i] && courseLists[i].list){
								courseLists[i].list.push(element)
								// var add = true;
								// _.each(courseLists[i].list,function(ele, index, list){
								// 	if(element.courseId == ele.courseId){
								// 		add = false;
								// 	}
								// });
								// if(add){
								// 	courseLists[i].list.push(element);
								// }
							}else{
								courseLists[i].list= [element];
							}
							
						}
					});
				}
				for(var i=0;i<courseLists.length;i++){
					courseLists[i].newList = []
					var stooge = courseLists[i].list
					var subjectNameArray = _.chain(stooge)
					 	.map(function(stooge){ return stooge.subjectName ; })
					  .uniq()
					  .value();
					var subjectIndexArray = _.chain(stooge)
					 	.map(function(stooge){ return stooge.subjectIndex ; })
					  .uniq()
					  .value();
				  for(var j=0;j<subjectNameArray.length;j++){
				  	courseLists[i].newList.push({
				  		"subjectName" : subjectNameArray[j],
				  		"subjectIndex" : subjectIndexArray[j],
							"list" : []
				  	})
				  	_.each(courseLists[i].list,function(element, index, list){
							if(element.subjectName == subjectNameArray[j]){

								if(courseLists[i].newList[j].list){
									//courseLists[i].newList[j].list.push(element);
									var add = true;
									_.each(courseLists[i].newList[j].list,function(ele, index, list){
										if(element.courseId == ele.courseId){
											add = false;
										}
									});
									if(add){
										courseLists[i].newList[j].list.push(element);
									}
								}else{
									courseLists[i].newList[j].list= [element];
								}
								
							}
						});
				  }
				}
				var courseLists = _.sortBy(courseLists, 'categoryIndex');
				_.each(courseLists,function(element, index){
					courseLists[index].newList =  _.sortBy(element.newList, 'subjectIndex');
					_.each(courseLists[index].newList,function(elements, item){
						courseLists[index].newList[item].list =  _.sortBy(elements.list, 'courseIndex');
					})
				})
				return courseLists;
			}
		});
		return Studycenter;
	});