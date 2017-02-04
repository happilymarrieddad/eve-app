Vue.component('pagination',Vue.extend({
	template:templatizer.pagination({}),
	props:['num','limit','total'],
	data:function() {
		return {
			num:0,
			limit:25,
			total:0,
			page:0
		}
	},
	watch:{},
	computed:{},
	methods:{},
	created:function() {},
	beforeCompile:function() {},
	compiled:function() {},
	ready:function() {
		var vm = this
		
		$(document).ready(function() {
		
		})
	}
}))