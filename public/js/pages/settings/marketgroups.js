var MarketGroupsRoute = Vue.extend({
    template: templatizer.settings.marketgroups({}),
    data() {
    	return {
    		market_groups:[],

			page:1,
			limit:25,
			num_market_groups:0,
			total_market_groups:0,
			pagination:false
    	}
    },
	watch:{
		search(val,oldVal) {
			this.fetchData(null)
		}
	},
	computed:{
		num_market_groups() {
			return this.market_groups.length
		},
		pagination() {
			return ( ( this.total_market_groups >= this.limit ) ? true : false )
		}
	},
    methods:{
    	update() {
    		var vm = this

    		vue.$ws({
    			controller:'market_groups',
    			method:'update'
    		},function(err,data) {
    			if (err) { vue.growl('danger',err) }
    			else { vue.growl('success','Successfully started update... this will take a while.') }
    		})
    	},
		changePage(page) {
			var vm = this
			vue.loading = true
			vm.page = page
			vm.fetchData(null)
		},
    	fetchData(cb) {
    		var vm = this

    		vue.$ws({
    			controller:'market_groups',
    			method:'index',
    			search:vm.search,
    			limit:vm.limit,
    			page:vm.page
    		},function(err,data) {
    			if (err) { vue.growl('danger',err) }
    			else { 
    				vm.market_groups = data.market_groups || []
    				vm.total_market_groups = data.num
    			}
    			if (cb) { cb(err) }
    			else { vue.loading = false }
    		})
    	}
    },
    ready() {
    	var vm = this
    },
	route: {
		data(transition) {
			this.fetchData(function(err) {
				if (err) { transition.abort() }
				else { transition.next({}) }
			})
		},
		waitForData:true
	}
})