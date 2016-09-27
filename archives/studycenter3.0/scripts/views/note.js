;define([
	'jquery',
	'underscore',
	'backbone',
	'collections/lists'
	],function($, _, Backbone, Lists){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body',
			template : _.template($('#template-note').html()),
			events : {
				'click body' : 'layout'
			},
			nav : '',
			render : function(){
				this.$el.append(this.template());

			},
			layout : function(){
			}
		});
		return Studycenter;
	});