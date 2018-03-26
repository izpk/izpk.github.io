;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'node-right-content',
			template : _.template($('#template-node-desc-list').html()),
			events : {
				'click .node-editor-isOpen-button' : 'isOpen',
				// 'click .add-photo-remove' : 'addPhotoRemove',
				// 'click .node-editor-cancel' : 'editorCancel',
				// 'click .node-editor-confirm' : 'editorConfirm',
				// 'click .show-photo-li' : 'showPhoto'
			},
			type : '',
			render : function(data){
				this.$el.html(this.template({
					"data" : data
				}));
				this.$showPhotoImgBig = this.$('.show-photo-img-big');
				return this;
			},
			getThat : function(e){
				return $(e.currentTarget);
			},
			isOpen : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatPrev = that.prev();
				var nodeDescLi = that.parents('.node-desc-li');
				CAICUI.render.nodeId = nodeDescLi.attr('data-id');
				CAICUI.render.content = nodeDescLi.attr('data-contentsummary');
				CAICUI.render.imgPath = nodeDescLi.attr('data-imgpath');
				CAICUI.render.taskId = nodeDescLi.attr('data-taskid');
				CAICUI.render.taskProgress = nodeDescLi.attr('data-taskprogress');
				if(that.hasClass('active')){
					that.removeClass('active');
					thatPrev.text('私有');
					CAICUI.render.isPublic = 1;
					nodeDescLi.attr('data-ispublic',CAICUI.render.isPublic);
					this.listNodesave();
				}else{
					that.addClass('active');
					thatPrev.text('公开');
					CAICUI.render.isPublic = 0;
					nodeDescLi.attr('data-ispublic',CAICUI.render.isPublic);
					this.listNodesave();
				}
			},
			listNodesave : function(){
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
							'taskProgress': CAICUI.render.taskProgress,
							'taskId' : CAICUI.render.taskId,
							'taskName' : CAICUI.render.taskName,
							'imgPath' : CAICUI.render.imgPath
						},
						done : function(data){
							// var linkActive = $('body .node-list-link.active');
							// if(CAICUI.render.isLately){
							// 	$('body .node-lately').trigger('click');
							// }else{
							// 	linkActive.trigger('click');
							// }
						},
						fail : function(data){
							layer.msg('Sorry~ 笔记保存失败', function() {});
						}
					})
			},
			addPhotoRemove : function(e){
				var that = this.getThat(e);
				var parent = that.parent();
				parent.remove();
			},
			editorCancel : function(e){

			},
			editorConfirm : function(e){
				
			},
			showPhoto : function(e){
				var that = this.getThat(e);
				that.siblings().removeClass('active');
				that.toggleClass('active');

				var thatSrc = that.children('img').attr('src');
				this.$showPhotoImgBig.attr('src',thatSrc);
			}
		});
		return Studycenter;
	});