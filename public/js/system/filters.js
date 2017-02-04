Vue.filter('isk',{
	read:function(value){
		var ret = null
		try {
			ret = value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
		} catch(err) { ret = value }
		return ret
	},
	write:function(val,oldVal){
		var ret = null
		try {
			ret = val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
		} catch(err) { ret = val }
		return ret
	}
})