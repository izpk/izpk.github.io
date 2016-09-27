;define([
	'jquery',
	'underscore',
	'backbone',
	'collections/lists'
	],function($, _, Backbone, Lists){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-courseIndex').html()),
			events : {
				'mouseleave .courseIndex-ul' : 'courseNavLeave',
				'mouseenter .courseIndex-li' : 'courseNavEnter',
				'mouseleave .courseIndex-li' : 'courseNavLiLeave',
				'click .course-list-title-a' : 'courseNavToggle'
			},
			render : function(type){
				this.$el.html(this.template({
					'type' : type
				}));
				this.$courseNavUl = this.$('.courseIndex-ul');
				this.$courseNavLi = this.$('.courseIndex-li');
				this.$courseIndexActiveBox = this.$('.courseIndex-active-box');
				this.courseNavPre = 0;
				this.courseNavAnimateTime = 150;
			},
			layout : function(){
			},
			courseNavClick : function(){

			},
			courseNavEnter : function(e){
				var currentTarget = e.currentTarget;
				var that = $(currentTarget);
				var index = that.index();
				var box = that.find('.courseIndex-active-box');
				if(index==this.courseNavPre){
					return false;
				}
				this.$courseNavUl.addClass('hover');
				that.addClass('hover');
				this.courseNavPreAnimate(this.courseNavPre);
				this.courseNavAnimate(box,index);
				this.courseNavPre = index;
			},
			courseNavAnimate : function(box,type){
				box.stop(true,false).animate({
					'width' : '148px'
				},this.courseNavAnimateTime)
			},
			courseNavPreAnimate : function(index){
				var li = this.$('.courseIndex-li').eq(index)
				this.$('.courseIndex-active-box').eq(index).stop(true,false).animate({
					'width' : 34,
					'marginLeft' : 0
				},this.courseNavAnimateTime,function(){
					li.removeClass('hover')
				});
			},
			courseNavLeave : function(){
				this.courseNavPreAnimate(this.courseNavPre);
				this.courseNavPre = 0;
				this.$courseNavLi.eq(this.courseNavPre).addClass('hover');
				this.courseNavAnimate(this.$('.courseIndex-active-box').eq(this.courseNavPre),this.courseNavPre);
			},
			courseNavLiLeave : function(e){
				//e.stopPropagation();
			},
			courseNavToggle : function(e){
				var currentTarget = e.currentTarget;
				var that = $(currentTarget);
				var parent = that.parent();
				parent.toggleClass('active');
			}
		});
		return Studycenter;
	});