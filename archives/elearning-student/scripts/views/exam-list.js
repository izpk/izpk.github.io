define(["jquery","underscore","backbone"],function(e,t,n){"use strict";return n.View.extend({tagName:"ul",className:"exam-list",template:t.template(e("#template-exam-list").html()),events:{},nav:"",render:function(e){return this.$el.html(this.template(e)),this},layout:function(){}})});