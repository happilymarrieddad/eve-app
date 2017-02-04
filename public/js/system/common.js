$.ui.autocomplete.prototype._renderItem = function(ul, item){
  var term = this.term.split(' ').join('|')
  var re = new RegExp("(" + term + ")", "gi")
  var t = (item.label ? item.label.toString().replace(re,"<span style='font-weight:bold;color:Blue;'>" + "$&" + "</span>") : '')
  return $( "<li data-id='"+item.value+"' "+(item.color ? 'style="background-color:'+item.color+'"' : '')+" ></li>" )
    .data( "item.autocomplete", item )
    .append( "<a>" + t + "</a>" )
    .appendTo( ul )
}