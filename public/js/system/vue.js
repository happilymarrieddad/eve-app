var router = new VueRouter(),
	App = Vue.extend({})

var vue = new Vue({
	el:'#app',
	data() {
		return {
			completed:false,
			loading:true,
			authenticated:false,

			first:'',
			last:'',
			email:'',
			id:0,

			username:'',

			socket:null,
			server_address:'127.0.0.1',
			port:80
		}
	},
	computed:{
		username() {
			return this.first + ' ' + this.last
		}
	},
	watch:{
		authenticated:function(val,oldVal) {
			if (val) { router.go('/') }
			else { router.go('/session/create') }
		}
	},
	methods:{
		setUserData(user) {
			this.first = user.first
			this.last = user.last
			this.email = user.email
			this.id = user.id
		},
		setupSocketConnection() {
			var vm = this
			
			vm.socket = socketCluster.connect({
				hostname:vm.server_address,
				port:vm.server_port,
				secure:(vm.server_port == 433 ? true : false)
			})

			vm.socket.on('connect',function(status) {
				if (status.isAuthenticated) {
					vm.authenticated = true
					var authToken = vm.socket.getAuthToken()
					vm.first = authToken.user.first
					vm.last = authToken.user.last
					vm.email = authToken.user.email
				} else {
					vm.authenticated = false
				}
			})

			vm.socket.on('authenticate',function() { vm.authenticated = true })
			vm.socket.on('deauthenticate',function() { vm.authenticated = false })

		},
		growl(type,msg) {
            $.bootstrapGrowl(
                '<span style="color:black">' + msg + '</span>', { 
                position:'fixed',
                type: type,
                align: 'center',
                delay: 120000,
                width:'auto',
                offset: { from: 'top', amount: 3 } 
            })
		},
		logout() {
			var vm = this
			vm.$ws({
				controller:'session',
				method:'logout'
			},function(err) {
				if (err) { vm.growl('danger','Failed to logout.') }
			})
		},
		$ws(args,callback) {
			var vm = this
			args.sender_socket_id = vm.socket.id
			vm.socket.emit('messages',args,callback)
		}
	},
	ready() {
		var vm = this

		vm.server_address = $('#server-address').val()
		vm.server_port = $('#server-port').val()
		$('.hidden-data').remove()
		vm.completed = true
		$('#app').show()
		vm.setupSocketConnection()
	}
})

Vue.use(VueRouter)