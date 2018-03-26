;define([
	'jquery',
	'underscore',
	'backbone',
	'views/node-list',
	'views/node-desc-list',
	'views/node-editor',
	'layer'
	],function($, _, Backbone, NodeList, NodeDescList, NodeEditor,  layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-course-courseNote').html()),
			events : {
				// 'mouseleave .courseIndex-ul' : 'courseNavUlLeave',
				// 'mouseenter .courseIndex-li' : 'courseNavLiEnter',
				// 'mouseleave .courseIndex-li' : 'courseNavLiLeave',
				'click .node-list-title-a' : 'nodeListToggle',
				'click .node-list-link' : 'addNodeLists',
				'click .node-list-linkssss' : 'addNodedetail',
				'click .node-lsit-remove' : 'nodeRemove',
				'click .node-select-a' : 'nodeSelectA',
				'click .node-option-li' : 'addActive',
				'click .node-desc-show' : 'nodeDescShow',
				'click .node-desc-hide' : 'nodeDescHide',
				'click .node-new' : 'nodeNew',
				'click .node-lsit-editor' : 'nodeEditor',
				'click .js-course-note-change' : 'courseChange',
				'change #uploadForm-file' : 'uploadForm',
				'click .add-photo-remove' : 'addPhotoRemove',
				
				'keyup .node-editor-textarea' : 'nodeContent',
				'click .node-editor-cancel' : 'editorCancel',
				'click .node-editor-confirm' : 'editorConfirm',
				'click .js-pagination-li' : 'paginationChange',
				'click .js-pagination-prev' : 'paginationPrev',
				'click .js-pagination-next' : 'paginationNext',
				'click .node-lately' : 'nodeLately',
				'click .node-list-desc-link' : 'nodeListDescLink',
				'click .show-photo-li' : 'showPhoto',
				'click .remove-load-confirm' : 'removeLoadConfirm'
			},
			render : function(courseId){
				
				this.$header = this.$('.courseIndex-header');
				this.$courseNavUl = this.$('.courseIndex-ul');
				this.$courseNavLi = this.$('.courseIndex-li');
				this.$courseIndexActiveBox = this.$('.courseIndex-active-box');
				this.$scroller = this.$('#scroller');
				this.$nodeRight = this.$('.node-right');
				this.$nodeDescContent = this.$('#scroller-node');
				//this.nodeListRender();
				//this.nodeDescRender();
				this.courseNavPreDefault = 2;
				this.courseNavPre = 2;
				this.courseNavAnimateTime = 300;

				CAICUI.render.courseId = courseId;
				CAICUI.render.$this = this;

				

				CAICUI.render.content = '';
				//CAICUI.render.courseId = '';
				CAICUI.render.clientType = 'pc';
				CAICUI.render.title = 'sdf';
				CAICUI.render.isPublic = 1;
				CAICUI.render.subjectId = '';
				CAICUI.render.categoryId = '';
				CAICUI.render.chapterId = '';
				CAICUI.render.subjectName = '';
				CAICUI.render.categoryName = '';
				CAICUI.render.courseName = '';
				CAICUI.render.chapterName = '';
				CAICUI.render.taskName = 'sdf';
				CAICUI.render.imgPath = '';
				CAICUI.render.imgPathArray = [];
				CAICUI.render.isLately = true;
				CAICUI.render.noEditor = true;



				CAICUI.render.nodeId = '';
				CAICUI.render.nodeType = 1;
				CAICUI.render.self = 0;
				CAICUI.render.ordertype = 1;
				CAICUI.render.pageNo = 1;
				CAICUI.render.pageSize = 20;
				CAICUI.render.totalCount = 0;
				CAICUI.render.pageTotal = 0;
				CAICUI.render.paginationType = 0;


				CAICUI.render.serverTotal = 3;
				CAICUI.render.serverNum = 0;
				this.$learningcourse = '';
				this.learningcourse();

				this.$coursechapternodecount = '';
				this.coursechapternodecount();

				this.$courseBaseInfo = '';

				CAICUI.render.timer = setInterval(function(){
					if(CAICUI.render.serverTotal==CAICUI.render.serverNum){
						clearInterval(CAICUI.render.timer);
						var filterLearningcourse = CAICUI.render.$this.filterLearningcourse(CAICUI.CACHE.Learningcourse);
						CAICUI.render.$this.$el.html(CAICUI.render.$this.template({
							'data' : {
								'courseId' : CAICUI.render.courseId,
								'learningcourse' : filterLearningcourse,
								'courseBaseInfo' : CAICUI.render.$this.$courseBaseInfo,
								'nodelist' : CAICUI.render.$this.$coursechapternodecount
							}
						}));
						CAICUI.iGlobal.getTemplateCourseNav('body .courseIndex-header-right',{
							"courseType" : 'course',
							"type" : 'note',
							"courseId" : CAICUI.render.courseId
						});
						window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
						$('body .node-lately').trigger('click');
					}
				},CAICUI.render.time)

			},
			learningcourse : function(callback){
				if(!CAICUI.CACHE.Learningcourse  || !CAICUI.CACHE.Learningcourse.length){
					CAICUI.Request.ajax({
						'server' : 'learningcourse',
						'data' : {
							'token' : CAICUI.User.token,
							'pageNo' : 1,
							'pageSize' : CAICUI.defaultPageSize
						},
						done : function(data){


							var isGetCourseBaseInfo = true;
							_.each(data.data.courselist,function(element,index){
								if(element.courseId == CAICUI.render.courseId){
									isGetCourseBaseInfo = false;
									CAICUI.render.subjectId = element.subjectID;
									CAICUI.render.categoryId = element.categoryId;
									CAICUI.render.chapterId = element.chapterId;
									CAICUI.render.subjectName = element.subjectName;
									CAICUI.render.categoryName = element.categoryName;
									CAICUI.render.courseName = element.courseName;
									CAICUI.render.chapterName = element.chapterName;
									CAICUI.render.taskName = 'sdf';
								}
							})
							if(isGetCourseBaseInfo){
								CAICUI.render.$this.courseBaseInfo(CAICUI.render.courseId);
							}else{
								CAICUI.render.serverNum ++;
							}

							
							CAICUI.render.serverNum ++;
							CAICUI.CACHE.Learningcourse = data.data.courselist;
							CAICUI.CACHE.RecentCourse = data.data.courselist.slice(0,2);
						},
						fail : function(data){
							CAICUI.render.serverNum ++;
							CAICUI.render.serverNum ++;
							CAICUI.CACHE.Learningcourse = {};
							CAICUI.CACHE.RecentCourse = {};
						}
					})
				}else{
					var isGetCourseBaseInfo = true;
					_.each(CAICUI.CACHE.Learningcourse,function(element,index){
						if(element.courseId == CAICUI.render.courseId){
							isGetCourseBaseInfo = false;
							CAICUI.render.subjectId = element.subjectID;
							CAICUI.render.categoryId = element.categoryId;
							CAICUI.render.chapterId = element.chapterId;
							CAICUI.render.subjectName = element.subjectName;
							CAICUI.render.categoryName = element.categoryName;
							CAICUI.render.courseName = element.courseName;
							CAICUI.render.chapterName = element.chapterName;
							CAICUI.render.taskName = 'sdf';
						}
					})
					if(isGetCourseBaseInfo){
						CAICUI.render.$this.courseBaseInfo(CAICUI.render.courseId);
					}else{
						CAICUI.render.serverNum ++;
					}

					CAICUI.render.serverNum ++;
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
				})
			},
			courseNode : function(callback){
				CAICUI.Request.ajax({
					'server' : 'course-node',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.courseId,
						'type' : 'course',
					},
					done : function(data){
						callback(data);
					},
					fail : function(data){
						callback({});
					}
				})
			},
			coursechapternodecount : function(callback){
				CAICUI.Request.ajax({
					'server' : 'coursechapternodecount',
					'data' : {
						'token' : CAICUI.User.token,
						'courseid' : CAICUI.render.courseId,
						'self' : 0
					},
					done : function(data){
						CAICUI.render.serverNum ++;
						CAICUI.render.$this.$coursechapternodecount = data;
					},
					fail : function(data){
						CAICUI.render.serverNum ++;
						CAICUI.render.$this.$coursechapternodecount = {data:{}};
					}
				})
			},
			addCourseNode : function(){
				var nodeList = new NodeList();
				this.coursechapternodecount(function(data){
					$('body #scroller').html(nodeList.render({
						'data' : {
							'nodelist' : data
						}
					}).el);
					window.CAICUI.myScroll.refresh();
				})
			},
			nodeList : function(callback){
				CAICUI.Request.ajax({
					'server' : 'nodelist',
					'data' : {
						'token' : CAICUI.User.token,
						'charpterid' : CAICUI.render.chapterId,
						'self' : CAICUI.render.self,
						'pageNo' : CAICUI.render.pageNo,
						'pageSize' : CAICUI.render.pageSize,
						'ordertype' : CAICUI.render.ordertype
					},
					done : function(data){
						CAICUI.render.pageTotal = Math.ceil(data.totalCount/data.pageSize);
						callback(data)
					},
					fail : function(data){
						callback({})
					}
				})
			},
			nodeListCourse : function(callback){
				CAICUI.Request.ajax({
					'server' : 'nodelist',
					'data' : {
						'token' : CAICUI.User.token,
						'courseid' : CAICUI.render.courseId,
						'self' : CAICUI.render.self,
						'pageNo' : CAICUI.render.pageNo,
						'pageSize' : CAICUI.render.pageSize,
						'ordertype' : CAICUI.render.ordertype
					},
					done : function(data){
						CAICUI.render.pageTotal = Math.ceil(data.totalCount/data.pageSize);
						callback(data)
					},
					fail : function(data){
						callback({})
					}
				})
			},
			addNodeLists : function(e){
				CAICUI.render.noEditor = true;
				CAICUI.render.isLately = false;
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo = 1;
				CAICUI.render.paginationType = 1;
				//if(!that.hasClass('active')){
					CAICUI.iGlobal.loading('.node-right');
					$('.node-list-link').removeClass('active');
					that.addClass('active');
					CAICUI.render.chapterId = that.attr('data-id');
					CAICUI.render.chapterName = that.attr('data-title');
					var nodeDescList = new NodeDescList();
					this.nodeList(function(data){
						$('.node-right').html(nodeDescList.render({
								"data" : data.data,
								"type" : CAICUI.render.nodeType,
								'pageNo': data.pageNo,
								'pageSize': data.pageSize,
								'totalCount': data.totalCount
							}
						).el);
						window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
					});
				//}
			},
			nodeLately : function(e){
				CAICUI.render.noEditor = false;
				CAICUI.render.isLately = true;
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo = 1;
				CAICUI.render.paginationType = 0;
				//if(!that.hasClass('active')){
					CAICUI.iGlobal.loading('.node-right');
					//that.addClass('active');
					$('body .node-list-link.active').removeClass('active');
					var nodeDescList = new NodeDescList();
					this.nodeListCourse(function(data){
						$('.node-right').html(nodeDescList.render({
								"data" : data.data,
								"type" : 0,
								'pageNo': data.pageNo,
								'pageSize': data.pageSize,
								'totalCount': data.totalCount
							}
						).el);

						window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
					});
				//}
			},
			nodeDetail : function(callback){
				CAICUI.Request.ajax({
					'server' : 'nodedetail',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.nodeId
					},
					done : function(data){
						callback(data);
					},
					fail : function(data){
						callback({});
					}
				})
			},
			delmycontent : function(callback){
				CAICUI.Request.ajax({
					'server' : 'delmycontent',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.nodeId,
						'type' : 'note'
					},
					done : function(data){
						callback(data);
					},
					fail : function(data){
						callback({});
					}
				})
			},
			addNodedetail : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(!that.hasClass('active')){
					CAICUI.iGlobal.loading('.node-right');
					$('.node-list-link').removeClass('active');
					that.addClass('active');
					var thatId = that.attr('data-id');
					var nodeDescList = new NodeDescList();
					this.nodedetail(thatId,function(data){
						$('.node-right').html(nodeDescList.render({
								"data" : data,
								"type" : 1
							}
						).el);
						window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
					});
				}
			},
			nodeListLink : function(e){
				var that = this.getThat(e);
				if(!that.hasClass('active')){
					$('.node-list-link').removeClass('active')
					that.addClass('active');
					var thatId = that.attr('data-id');
					this.addNodedetail(thatId);
				}
			},
			getThat : function(e){
				return $(e.currentTarget);
			},
			nodeListRender : function(){
				var nodeList = new NodeList();
				this.$scroller.html(nodeList.render().el);
			},
			
			nodeEditorRender : function(data){
				var nodeEditor = new NodeEditor();
				this.$('.node-right').html(nodeEditor.render(data).el);
			},
			uploadForm : function(e){
				CAICUI.iGlobal.fileUpload({
	        'formClass' : 'uploadForm'
	      }, function(returndata){
					CAICUI.iGlobal.fileUploadAddList('uploadForm', returndata);
				})
			},
			addPhotoRemove : function(e){
				var that = this.getThat(e);
				
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
			nodeContent : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.content = that.val();
			},
			
			editorCancel : function(e){
				if($('body .node-list-link.active').length){
					$('body .node-list-link.active').trigger('click');
				}else{
					$('body .node-lately').trigger('click');
				}
				
			},
			editorConfirm : function(e){
				//this.$uploader.upload();
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
						'id' : CAICUI.render.nodeId,
						'content' : CAICUI.render.content,
						'courseId' : CAICUI.render.courseId,
						'clientType' : CAICUI.render.clientType,
						'title' : CAICUI.render.title,
						'isPublic' : CAICUI.render.isPublic,
						'subjectId' : CAICUI.render.subjectId,
						'categoryId' : CAICUI.render.categoryId,
						'chapterId' : CAICUI.render.chapterId,
						'subjectName' : CAICUI.render.subjectName,
						'categoryName' : CAICUI.render.categoryName,
						'courseName' : CAICUI.render.courseName,
						'chapterName' : CAICUI.render.chapterName,
						'taskName' : CAICUI.render.taskName,
						'imgPath' : CAICUI.render.imgPath
					},
					done : function(data){
						var linkActive = $('body .node-list-link.active');
						if(!CAICUI.render.isPublic && !CAICUI.render.nodeId){
							var linkActiveNodeNum = +linkActive.attr('data-nodenum')+1;
							linkActive.attr('data-nodenum',linkActiveNodeNum);
							linkActive.find('.node-list-num').text('['+linkActiveNodeNum+']');

							var parentUl = linkActive.parents('.node-list-three-ul');
							var parentUlPrev = parentUl.prev();
							var parentUlPrevNodeNum = +parentUlPrev.attr('data-nodenum')+1;
							parentUlPrev.attr('data-nodenum',parentUlPrevNodeNum);
							parentUlPrev.find('.node-list-num').text('['+parentUlPrevNodeNum+']');
						}
						if(CAICUI.render.isLately){
							$('body .node-lately').trigger('click');
						}else{
							linkActive.trigger('click');
						}
					},
					fail : function(data){
						layer.msg('Sorry~ 笔记保存失败', function() {});
					}
				})
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
				CAICUI.render.$this.$('.courseIndex-ul').removeClass('hover')
			},
			courseNavLiLeave : function(e){
				//e.stopPropagation();
			},
			nodeListToggle : function(e){
				var that = this.getThat(e);
				var parent = that.parent();
				parent.toggleClass('active');
				window.CAICUI.myScroll.refresh();
			},
			addActive : function(e){
				var that = this.getThat(e);
				that.siblings().removeClass('active');
				that.addClass('active');
			},
			nodeSelectA : function(e){
				var that = this.getThat(e);
				that.toggleClass('active');
				that.next().toggleClass('active');
			},
			nodeDescShow : function(e){
				var that = this.getThat(e);
				var parentsLi = that.parents('.node-desc-li');
				CAICUI.render.nodeId = parentsLi.attr('data-id');
				
				this.nodeDetail(function(data){

					// var contentSummary = parentsLi.attr('data-contentSummary');

					// parentsLi.find('.node-desc-span').text(contentSummary);
					parentsLi.find('.node-desc-span').text(data.data.content);
					parentsLi.addClass('active');
					window.CAICUI.nodeScroll.refresh();
				});
			},
			nodeDescHide : function(e){
				var that = this.getThat(e);
				var parentsLi = that.parents('li');
				var contentSummary = CAICUI.iGlobal.cutstr(CAICUI.iGlobal.html_decode(parentsLi.attr('data-contentSummary')),120)
				parentsLi.find('.node-desc-span').text(contentSummary);
				parentsLi.removeClass('active');
				window.CAICUI.nodeScroll.refresh();
			},
			nodeNew : function(e){
				if(this.$courseBaseInfo){
					layer.msg('Sorry~ 您没有当前课程的发帖权限', function() {});
				}else{
					CAICUI.render.imgPath = '';
					CAICUI.render.imgPathArray = [];
					var that = this.getThat(e);
					this.nodeEditorRender();
				}
			},
			nodeEditor : function(e){
				var that = this.getThat(e);
				var parentsLi = that.parents('.node-desc-li');

				var updateTime = parentsLi.attr('data-updateTime');
				var taskprogress = parentsLi.attr('data-taskprogress');
				var contentSummary = parentsLi.attr('data-contentSummary');
				CAICUI.render.content = contentSummary;
				var imgPath = parentsLi.attr('data-imgPath');
				if(imgPath && imgPath.length){
					CAICUI.render.imgPathArray = imgPath.split(',');
				}else{
					CAICUI.render.imgPathArray = [];
				}
				console.log(CAICUI.render.imgPathArray)
				var isPublic = +parentsLi.attr('data-isPublic');
				CAICUI.render.isPublic = isPublic;
				CAICUI.render.charpterId = parentsLi.attr('data-charpterId');
				CAICUI.render.nodeId = parentsLi.attr('data-id');
				
				this.nodeEditorRender({
					"time" : updateTime,
					"videoTime" : taskprogress,
					"content" : contentSummary,
					"imgPath" : CAICUI.render.imgPathArray,
					"isPublic" : isPublic
				});
			},
			nodeRemove : function(e){
				var that = this.getThat(e);
				CAICUI.render.removeNodeDescLi = that.parents('.node-desc-li');
				CAICUI.render.nodeRemoveLoad = layer.load(1, {
					type : 1,
					title : false,
					content: $('#remove-load'),
					closeBtn : 0,
				  shade: [0.5,'#000'] //0.1透明度的白色背景
				});
				$('.remove-load-cancel').on('click',function(){
					layer.close(CAICUI.render.nodeRemoveLoad);
				})
			},
			removeLoadConfirm : function(e){
				CAICUI.render.nodeId = CAICUI.render.removeNodeDescLi.attr('data-id');
				CAICUI.render.$this.delmycontent(function(data){
					CAICUI.render.removeNodeDescLi.remove();
					var linkActive = $('body .node-list-link.active');
					var linkActiveNodeNum = +linkActive.attr('data-nodenum')-1;
					linkActive.attr('data-nodenum',linkActiveNodeNum);
					linkActive.find('.node-list-num').text('['+linkActiveNodeNum+']');

					var parentUl = linkActive.parent().parent();
					var parentUlPrev = parentUl.prev();
					var parentUlPrevNodeNum = +parentUlPrev.attr('data-nodenum')-1;
					parentUlPrev.attr('data-nodenum',parentUlPrevNodeNum);
					parentUlPrev.find('.node-list-num').text('['+parentUlPrevNodeNum+']');
					layer.close(CAICUI.render.nodeRemoveLoad);
					if(linkActiveNodeNum){
						window.CAICUI.nodeScroll.refresh();

					}else{
						linkActive.trigger('click');
					}
				});
			},
			courseChange : function(e){
				var that = this.getThat(e);
				that.toggleClass('active');
				$('.option-ul').toggleClass('active');
			},

			paginationChange : function(e){
				CAICUI.iGlobal.loading('.node-right');
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo =that.attr('data-pageno');
				if(CAICUI.render.paginationType){
					this.nodeList(function(data){
					var nodeDescList = new NodeDescList();
						$('.node-right').html(nodeDescList.render({
								"data" : data.data,
								"type" : CAICUI.render.nodeType,
								'pageNo': data.pageNo,
								'pageSize': data.pageSize,
								'totalCount': data.totalCount
							}
						).el);
						window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
				});
				}else{
					var nodeDescList = new NodeDescList();
					this.nodeListCourse(function(data){
						$('.node-right').html(nodeDescList.render({
								"data" : data.data,
								"type" : 0,
								'pageNo': data.pageNo,
								'pageSize': data.pageSize,
								'totalCount': data.totalCount
							}
						).el);
						window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
					});
				}
			},
			paginationPrev : function(e){
				if(CAICUI.render.pageNo>1){
					CAICUI.iGlobal.loading('.node-right');
					CAICUI.render.pageNo = +CAICUI.render.pageNo-1;
					if(CAICUI.render.paginationType){
						this.nodeList(function(data){
						var nodeDescList = new NodeDescList();
							$('.node-right').html(nodeDescList.render({
									"data" : data.data,
									"type" : CAICUI.render.nodeType,
									'pageNo': data.pageNo,
									'pageSize': data.pageSize,
									'totalCount': data.totalCount
								}
							).el);
							window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
					});
					}else{
						var nodeDescList = new NodeDescList();
						this.nodeListCourse(function(data){
							$('.node-right').html(nodeDescList.render({
									"data" : data.data,
									"type" : 0,
									'pageNo': data.pageNo,
									'pageSize': data.pageSize,
									'totalCount': data.totalCount
								}
							).el);
							window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
						});
					}
				}
			},
			paginationNext : function(e){
				if(CAICUI.render.pageNo<=CAICUI.render.pageTotal-1){
					CAICUI.iGlobal.loading('.node-right');
					CAICUI.render.pageNo = +CAICUI.render.pageNo+1;
					if(CAICUI.render.paginationType){
						this.nodeList(function(data){
							var nodeDescList = new NodeDescList();
								$('.node-right').html(nodeDescList.render({
										"data" : data.data,
										"type" : CAICUI.render.nodeType,
										'pageNo': data.pageNo,
										'pageSize': data.pageSize,
										'totalCount': data.totalCount
									}
								).el);
								window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
						});
					}else{
						var nodeDescList = new NodeDescList();
						this.nodeListCourse(function(data){
							$('.node-right').html(nodeDescList.render({
									"data" : data.data,
									"type" : 0,
									'pageNo': data.pageNo,
									'pageSize': data.pageSize,
									'totalCount': data.totalCount
								}
							).el);
							window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
						});
					}
				}
			},
			nodeListDescLink : function(e){
				e.stopPropagation();
				CAICUI.NavVideo = false;
				CAICUI.domRender = false;
				var that = CAICUI.iGlobal.getThat(e);
				//storage.setsingle('playlist-index'+CAICUI.render.courseId,"c|"+that.attr("data-index"));
		    window.location.hash = that.attr('link');
			},
			showPhoto : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatSrc = that.find('img').attr('src');
				var thatBigPhoto = $('body .show-photo-img-big');
				that.siblings().removeClass('active');
				that.addClass('active');
				thatBigPhoto.attr('src',thatSrc);
				window.CAICUI.nodeScroll.refresh();
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
					_.each(stooges,function(element, index, list){
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