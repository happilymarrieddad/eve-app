router.map({
    '/': { component: DashboardRoute,auth:true },
    '/settings': { 
    	component: Vue.extend({
	    	template: '<router-view></router-view>'
		}),
    	subRoutes:{
    		'/inventorytypes':{ component:InventoryTypesRoute,auth:true },
    		'/inventorygroups':{ component:InventoryGroupsRoute,auth:true },
    		'/marketgroups':{ component:MarketGroupsRoute,auth:true },
    		'/blueprints':{ component:BlueprintsRoute,auth:true },
    		'/customblueprints':{ component:CustomBlueprintsRoute,auth:true },
    		'/customblueprint/:id':{ component:CustomBlueprintEditRoute,auth:true }
    	},auth:true 
    },
    '/session': { 
    	component: Vue.extend({
	    	template: '<router-view></router-view>'
		}),
		subRoutes:{
			'create':{ component:SessionRoute,auth:false }
		},auth:false
	}
})

router.redirect({
	'/settings':'/dashboard',
	'/session':'/session/create',
	'*':'/'
})

router.beforeEach(function(transition) {
	vue.loading = true
	if (transition.to.auth && !vue.authenticated) {
		vue.loading = false
		transition.redirect('/session/create')
	} else if (vue.authenticated && !transition.to.auth) {
		vue.loading = false
		transition.redirect('/')
	} else {
		transition.next()
	}
})

router.afterEach(function(transition) {
	setTimeout(function() {
		vue.loading = false
	},5)
})

router.start(App, '#app')