var CustomBlueprintEditRoute = Vue.extend({
    template: templatizer.settings.blueprints.customedit({}),
    data() {
    	return {
    		id:0,
    		name:'',
    		eve_id:0,
    		manufactured_inventory_type_name:'',

    		add_inventory_type_id:0,
    		add_inventory_type_name:'',
    		add_me_1_quantity:0,

    		custom_blueprints_inventory_types:[]
    	}
    },
	watch:{},
	computed:{
		add_me_10_quantity() {
			return Math.ceil(+this.add_me_1_quantity * 0.9)
		}
	},
    methods:{
    	createCustomBlueprintsInventoryType() {
    		var vm = this
    		
    		if (!vm.add_inventory_type_id) { return vue.growl('danger','You must have a valid inventory type.') }

    		vue.$ws({
    			controller:'custom_blueprints_inventory_types',
    			method:'store',
    			post:{
    				blueprint_id:vm.id,
    				blueprint_eve_id:vm.eve_id,
    				inventory_type_id:vm.add_inventory_type_id,
    				inventory_type_eve_id:vm.add_inventory_type_eve_id,
    				user_id:vue.id,
    				me_1_quantity:vm.add_me_1_quantity,
    				me_10_quantity:vm.add_me_10_quantity
    			}
    		},function(err,data) {
    			if (err) { return vue.growl('danger',err) }
    			vm.add_inventory_type_id = 0
				vm.add_inventory_type_name = ''
				vm.add_me_1_quantity = 0
                $('#customblueprint-edit-inventory-type').val('')
    			vm.fetchCustomBlueprintsInventoryTypes()
    		})
    	},
    	deleteCustomBlueprintsInventoryTypes(custom_blueprints_inventory_type) {
    		var vm = this

    		vue.$ws({
    			controller:'custom_blueprints_inventory_types',
    			method:'destroy',
    			id:custom_blueprints_inventory_type.id
    		},function(err,data) {
    			if (err) { return vue.growl('danger',err) }
    			vm.fetchCustomBlueprintsInventoryTypes()
    		})
    	},
    	fetchCustomBlueprintsInventoryTypes() {
    		var vm = this

    		vue.$ws({
    			controller:'custom_blueprints_inventory_types',
    			method:'findByBlueprintId',
    			id:vm.id
    		},function(err,custom_blueprints_inventory_types) {
    			if (err) { return vue.growl('danger',err) }
    			vm.custom_blueprints_inventory_types = custom_blueprints_inventory_types
    		})
    	},
    	fetchData(cb) {
    		var vm = this

    		vue.$ws({
    			controller:'blueprints',
    			method:'customEdit',
    			id:vm.id
    		},function(err,data) {
    			if (err) { return vue.growl('danger',err) }
    			vm.name = data.blueprint.name
    			vm.eve_id = data.blueprint.eve_id
    			vm.manufactured_inventory_type_name = data.blueprint.manufactured_inventory_type_name
    			if (cb) { return cb(err) }
    			vue.loading = false
    		})
    	}
    },
    ready() {
    	var vm = this

    	$(document).ready(function() {

    		$('#customblueprint-edit-inventory-type').on('keyup.autocomplete',function() {
    			$('#customblueprint-edit-inventory-type').autocomplete({
					source:function(request,response){
						vue.$ws({
							controller:'inventory_types',
							method:'autocomplete',
							search:request.term
						},function(err,inventory_types) {
							if (err) { return; }
							response(inventory_types)
						})
					},
					minLength:2,
					focus:function(event,ui){
						event.preventDefault()
						$('#customblueprint-edit-inventory-type').val(ui.item.label)
						vm.add_inventory_type_name = ui.item.label
					},
					select:function(event,ui){
						event.preventDefault()
						$('#customblueprint-edit-inventory-type').val(ui.item.label)
						vm.add_inventory_type_name = ui.item.label
						vm.add_inventory_type_id = ui.item.value
						vm.add_inventory_type_eve_id = ui.item.eve_id
					}
    			})
    		})

    	}) 
    },
	route: {
		data(transition) {
            var vm = this
			vm.id = transition.to.params.id
            vm.fetchCustomBlueprintsInventoryTypes()
			vm.fetchData(function(err) {
				if (err) { transition.abort() }
				else { transition.next({}) }
			})
		},
		waitForData:true
	}
})