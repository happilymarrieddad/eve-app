var CustomBlueprintsRoute = Vue.extend({
    template: templatizer.settings.blueprints.customindex({}),
    data() {
    	return {
    		blueprints:[],

			page:1,
			limit:25,
			num_blueprints:0,
			total_blueprints:0,
			pagination:false
    	}
    },
	watch:{
		search(val,oldVal) {
			this.fetchData(null)
		}
	},
	computed:{
		num_blueprints() {
			return this.blueprints.length
		},
		pagination() {
			return ( ( this.total_blueprints >= this.limit ) ? true : false )
		}
	},
    methods:{
		changePage(page) {
			var vm = this
			vue.loading = true
			vm.page = page
			vm.fetchData(null)
		},
    	fetchData(cb) {
    		var vm = this

    		vue.$ws({
    			controller:'blueprints',
    			method:'customIndex',
    			search:vm.search,
    			limit:vm.limit,
    			page:vm.page
    		},function(err,data) {
    			if (err) { vue.growl('danger',err) }
    			else { 
    				vm.blueprints = data.blueprints || []
    				vm.total_blueprints = data.num
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