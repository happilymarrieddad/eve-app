var SessionRoute = Vue.extend({
    template: templatizer.session.create({}),
    data() {
    	return {
    		email:'',
    		password:''
    	}
    },
    methods:{
    	login() {
    		var vm = this

    		vue.$ws({
    			controller:'session',
    			method:'login',
    			email:vm.email,
    			password:vm.password
    		},function(err,data) {
    			if (err) { return vue.growl('danger',err) }
    			vue.setUserData(data.user)
    		})
    	}
    },
    ready() {
        var vm = this
    }
})