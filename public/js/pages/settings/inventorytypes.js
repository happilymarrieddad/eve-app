var InventoryTypesRoute = Vue.extend({
    template: templatizer.settings.inventorytypes({}),
    data() {
    	return {
    		inventory_types:[],

			page:1,
			limit:25,
			num_inventory_types:0,
			total_inventory_types:0,
			pagination:false
    	}
    },
	watch:{
		search(val,oldVal) {
			this.fetchData(null)
		}
	},
	computed:{
		num_inventory_types() {
			return this.inventory_types.length
		},
		pagination() {
			return ( ( this.total_inventory_types >= this.limit ) ? true : false )
		}
	},
    methods:{
    	update() {
    		var vm = this

    		vue.$ws({
    			controller:'inventory_types',
    			method:'update'
    		},function(err,data) {
    			if (err) { vue.growl('danger',err) }
    			else { vue.growl('success','Successfully started update... this will take a while.') }
    		})
    	},
        updatePrices() {
            var vm = this

            vue.$ws({
                controller:'inventory_types',
                method:'updatePrices'
            },function(err,data) {
                if (err) { vue.growl('danger',err) }
                else { vue.growl('success','Successfully started update... this will take a while.') }
            })
        },
        updateInventoryTypes() {
            var vm = this

            vue.$ws({
                controller:'inventory_types',
                method:'updateInventoryTypes'
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
    			controller:'inventory_types',
    			method:'index',
    			search:vm.search,
    			limit:vm.limit,
    			page:vm.page
    		},function(err,data) {
    			if (err) { vue.growl('danger',err) }
    			else { 
    				vm.inventory_types = data.inventory_types || []
    				vm.total_inventory_types = data.num
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