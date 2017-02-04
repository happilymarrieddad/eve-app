(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        if (typeof root === 'undefined' || root !== Object(root)) {
            throw new Error('templatizer: window does not exist or is not an object');
        }
        root.templatizer = factory();
    }
}(this, function () {
    var jade=function(){function n(n){return null!=n&&""!==n}function t(e){return(Array.isArray(e)?e.map(t):e&&"object"==typeof e?Object.keys(e).filter(function(n){return e[n]}):[e]).filter(n).join(" ")}function e(n){return i[n]||n}function r(n){var t=String(n).replace(o,e);return t===""+n?n:t}var a={};a.merge=function t(e,r){if(1===arguments.length){for(var a=e[0],i=1;i<e.length;i++)a=t(a,e[i]);return a}var o=e.class,s=r.class;(o||s)&&(o=o||[],s=s||[],Array.isArray(o)||(o=[o]),Array.isArray(s)||(s=[s]),e.class=o.concat(s).filter(n));for(var f in r)"class"!=f&&(e[f]=r[f]);return e},a.joinClasses=t,a.cls=function(n,e){for(var r=[],i=0;i<n.length;i++)e&&e[i]?r.push(a.escape(t([n[i]]))):r.push(t(n[i]));var o=t(r);return o.length?' class="'+o+'"':""},a.style=function(n){return n&&"object"==typeof n?Object.keys(n).map(function(t){return t+":"+n[t]}).join(";"):n},a.attr=function(n,t,e,r){return"style"===n&&(t=a.style(t)),"boolean"==typeof t||null==t?t?" "+(r?n:n+'="'+n+'"'):"":0==n.indexOf("data")&&"string"!=typeof t?(JSON.stringify(t).indexOf("&")!==-1&&console.warn("Since Jade 2.0.0, ampersands (`&`) in data attributes will be escaped to `&amp;`"),t&&"function"==typeof t.toISOString&&console.warn("Jade will eliminate the double quotes around dates in ISO form after 2.0.0")," "+n+"='"+JSON.stringify(t).replace(/'/g,"&apos;")+"'"):e?(t&&"function"==typeof t.toISOString&&console.warn("Jade will stringify dates in ISO form after 2.0.0")," "+n+'="'+a.escape(t)+'"'):(t&&"function"==typeof t.toISOString&&console.warn("Jade will stringify dates in ISO form after 2.0.0")," "+n+'="'+t+'"')},a.attrs=function(n,e){var r=[],i=Object.keys(n);if(i.length)for(var o=0;o<i.length;++o){var s=i[o],f=n[s];"class"==s?(f=t(f))&&r.push(" "+s+'="'+f+'"'):r.push(a.attr(s,f,!1,e))}return r.join("")};var i={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"},o=/[&<>"]/g;return a.escape=r,a.rethrow=function n(t,e,r,a){if(!(t instanceof Error))throw t;if(!("undefined"==typeof window&&e||a))throw t.message+=" on line "+r,t;try{a=a||require("fs").readFileSync(e,"utf8")}catch(e){n(t,null,r)}var i=3,o=a.split("\n"),s=Math.max(r-i,0),f=Math.min(o.length,r+i),i=o.slice(s,f).map(function(n,t){var e=t+s+1;return(e==r?"  > ":"    ")+e+"| "+n}).join("\n");throw t.path=e,t.message=(e||"Jade")+":"+r+"\n"+i+"\n\n"+t.message,t},a.DebugItem=function(n,t){this.lineno=n,this.filename=t},a}(); 

    var templatizer = {};
    templatizer["session"] = {};
    templatizer["settings"] = {};
    templatizer["settings"]["blueprints"] = {};

    // pagination.jade compiled template
    templatizer["pagination"] = function tmpl_pagination() {
        return '<nav><ul style="margin:0px" class="pagination"><li v-show="$parent.page &gt; 1"><a href="#" @click.prevent="$parent.changePage( $parent.page - 1 )"><span>&laquo;</span></a></li><li class="active"><a>{{ $parent.page }}</a></li><li v-show="num &gt;= limit &amp;&amp; $parent.page != Math.ceil(total / limit)"><a href="#" @click.prevent="$parent.changePage( $parent.page + 1 )"><span>&raquo;</span></a></li></ul></nav>';
    };

    // session/create.jade compiled template
    templatizer["session"]["create"] = function tmpl_session_create() {
        return '<div style="margin-top:100px" class="row"><div class="col-md-6 col-md-offset-3"><div class="panel panel-default"><div class="panel-heading"><h5>Please Login</h5></div><div class="panel-body"><div class="form-group"><label>Email</label><input type="email" v-model="email" class="form-control"/></div><div class="form-group"><label>Password</label><input type="password" v-model="password" class="form-control"/></div><hr/><div class="form-group"><button type="button" @click.prevent="login" class="btn btn-success">Create</button></div></div></div></div></div>';
    };

    // settings/blueprints/customedit.jade compiled template
    templatizer["settings"]["blueprints"]["customedit"] = function tmpl_settings_blueprints_customedit() {
        return '<ol class="breadcrumb"><li><a href="#!/settings/customblueprints">Blueprints</a></li><li><span>{{ name }}</span></li></ol><div class="well"><div class="row"><div class="col-md-6"><form class="form form-horizontal"><div class="form-group"><label>Name</label><input type="text" v-model="name" disabled="disabled" class="form-control input-sm"/></div><div class="form-group"><label>Eve ID</label><input type="text" v-model="eve_id" disabled="disabled" class="form-control input-sm"/></div><div class="form-group"><label>Manufactured Item</label><input type="text" v-model="manufactured_inventory_type_name" disabled="disabled" class="form-control input-sm"/></div></form></div><div class="col-md-6"><ul role="tablist" class="nav nav-tabs"><li role="presentation" class="active"><a href="#customblueprints-items" aria-controls="customblueprints-items" role="tab" data-toggle="tab">Items</a></li></ul><div class="tab-content"><div id="customblueprints-items" class="tab-pane fade in active well"><table class="table table-condensed table-hover table-stripped"><thead><tr><th>Name</th><th>ME1 Quantity</th><th>ME10 Quantity</th><th></th></tr></thead><tbody><tr v-for="custom_blueprints_inventory_type in custom_blueprints_inventory_types"><th>{{ custom_blueprints_inventory_type.inventory_types_name }}</th><th>{{ custom_blueprints_inventory_type.me_1_quantity }}</th><th>{{ custom_blueprints_inventory_type.me_10_quantity }}</th><th><button id="delete-custom_blueprints_inventory_types-{{ custom_blueprints_inventory_type.id }}" type="button" @click="deleteCustomBlueprintsInventoryTypes(custom_blueprints_inventory_type)" class="btn btn-xs btn-danger"><span class="glyphicon glyphicon-trash"></span></button></th></tr></tbody><thead><tr><th><input id="customblueprint-edit-inventory-type" type="text" class="form-control input-sm"/></th><th><input type="text" v-model="add_me_1_quantity" class="form-control input-sm"/></th><th><input type="text" v-model="add_me_10_quantity" disabled="disabled" class="form-control input-sm"/></th><th><button type="button" @click="createCustomBlueprintsInventoryType" class="btn btn-xs btn-success"><span class="glyphicon glyphicon-plus"></span></button></th></tr></thead></table></div></div></div></div></div>';
    };

    // settings/blueprints/customindex.jade compiled template
    templatizer["settings"]["blueprints"]["customindex"] = function tmpl_settings_blueprints_customindex() {
        return '<ol class="breadcrumb"><li>Custom Blueprints</li><li><button type="button" @click.prevent="update" class="btn btn-success btn-xs">Update Blueprints</button></li><input style="margin-top:-0.15%;width:180px;height:28px;padding-left:5px" placeholder="Blueprint Search" v-model="search" class="no-slash pull-right form-control"/></ol><div class="table-responsive"><table class="table table-striped table-hover table-condensed"><thead><tr><th>ID</th><th>Name</th><th>Eve ID</th><th>Manufactured Name</th><th>High Profit</th><th>Low Profit</th><th>Avg Profit</th><th></th></tr></thead><tbody v-show="blueprints.length &gt; 0"><tr v-for="blueprint in blueprints"><th><strong>{{ blueprint.id }}</strong></th><td><a href="#!/settings/customblueprint/{{ blueprint.id }}">{{ blueprint.name }}</a></td><td>{{ blueprint.eve_id }}</td><td>{{ blueprint.manufactured_name }}</td><td>{{ blueprint.high_profit }}</td><td>{{ blueprint.low_profit }}</td><td>{{ blueprint.avg_profit }}</td><td class="text-right"><a type="button" href="#!/settings/customblueprint/{{ blueprint.id }}" class="btn btn-xs btn-warning"><span class="glyphicon glyphicon-edit"></span></a></td></tr><tr v-show="pagination"><th colspan="8"><pagination :num="num_blueprints" :limit="25" :total="total_blueprints"></pagination></th></tr></tbody><tbody v-show="blueprints.length &lt; 1"><tr><th colspan="8" class="text-center"> <b>No Custom Blueprints</b></th></tr></tbody></table></div>';
    };

    // settings/blueprints/index.jade compiled template
    templatizer["settings"]["blueprints"]["index"] = function tmpl_settings_blueprints_index() {
        return '<ol class="breadcrumb"><li>Blueprints</li><li><button type="button" @click.prevent="update" class="btn btn-success btn-xs">Update Blueprints</button></li><input style="margin-top:-0.15%;width:180px;height:28px;padding-left:5px" placeholder="Blueprint Search" v-model="search" class="no-slash pull-right form-control"/></ol><div class="table-responsive"><table class="table table-striped table-hover table-condensed"><thead><tr><th>ID</th><th>Name</th><th>Eve ID</th><th>Manufactured Name</th><th>High Profit</th><th>Low Profit</th><th>Avg Profit</th><th></th></tr></thead><tbody v-show="blueprints.length &gt; 0"><tr v-for="blueprint in blueprints"><th><strong>{{ blueprint.id }}</strong></th><td>{{ blueprint.name }}</td><td>{{ blueprint.eve_id }}</td><td>{{ blueprint.manufactured_name }}</td><td>{{ blueprint.high_profit }}</td><td>{{ blueprint.low_profit }}</td><td>{{ blueprint.avg_profit }}</td><td class="text-right"></td></tr><tr v-show="pagination"><th colspan="8"><pagination :num="num_blueprints" :limit="25" :total="total_blueprints"></pagination></th></tr></tbody><tbody v-show="blueprints.length &lt; 1"><tr><th colspan="8" class="text-center"> <b>No Blueprints</b></th></tr></tbody></table></div>';
    };

    // settings/inventorygroups.jade compiled template
    templatizer["settings"]["inventorygroups"] = function tmpl_settings_inventorygroups() {
        return '<ol class="breadcrumb"><li>Inventory Groups</li><li><button type="button" @click.prevent="update" class="btn btn-success btn-xs">Update Inventory Groups</button></li><input style="margin-top:-0.15%;width:180px;height:28px;padding-left:5px" placeholder="Inventory Group Search" v-model="search" class="no-slash pull-right form-control"/></ol><div class="table-responsive"><table class="table table-striped table-hover table-condensed"><thead><tr><th>ID</th><th>Name</th><th>Eve ID</th><th></th></tr></thead><tbody v-show="inventory_groups.length &gt; 0"><tr v-for="inventory_group in inventory_groups"><th><strong>{{ inventory_group.id }}</strong></th><td>{{ inventory_group.name }}</td><td>{{ inventory_group.eve_id }}</td><td class="text-right"></td></tr><tr v-show="pagination"><th colspan="5"><pagination :num="num_inventory_groups" :limit="25" :total="total_inventory_groups"></pagination></th></tr></tbody><tbody v-show="inventory_groups.length &lt; 1"><tr><th colspan="5" class="text-center"> <b>No Inventory Groups</b></th></tr></tbody></table></div>';
    };

    // settings/inventorytypes.jade compiled template
    templatizer["settings"]["inventorytypes"] = function tmpl_settings_inventorytypes() {
        return '<ol class="breadcrumb"><li>Inventory Types</li><li><button type="button" @click.prevent="update" class="btn btn-success btn-xs">Update Inventory Types</button></li><li><button type="button" @click.prevent="updatePrices" class="btn btn-success btn-xs">Update Inventory Types Prices</button></li><li><button type="button" @click.prevent="updateInventoryTypes" class="btn btn-success btn-xs">Update Blueprint Inventory Types</button></li><input style="margin-top:-0.15%;width:180px;height:28px;padding-left:5px" placeholder="Inventory Type Search" v-model="search" class="no-slash pull-right form-control"/></ol><div class="table-responsive"><table class="table table-striped table-hover table-condensed"><thead><tr><th>ID</th><th>Name</th><th>Eve ID</th><th>Market Group Name</th><th>Low Price</th><th>High Price</th><th>Avg Price</th><th></th></tr></thead><tbody v-show="inventory_types.length &gt; 0"><tr v-for="inventory_type in inventory_types"><th><strong>{{ inventory_type.id }}</strong></th><td>{{ inventory_type.name }}</td><td>{{ inventory_type.eve_id }}</td><td>{{ inventory_type.market_group_name }}</td><td>{{ inventory_type.low_price | isk }}</td><td>{{ inventory_type.high_price | isk }}</td><td>{{ inventory_type.avg_price | isk }}</td><td class="text-right"></td></tr><tr v-show="pagination"><th colspan="5"><pagination :num="num_inventory_types" :limit="25" :total="total_inventory_types"></pagination></th></tr></tbody><tbody v-show="inventory_types.length &lt; 1"><tr><th colspan="5" class="text-center"><b>No Inventory Types</b></th></tr></tbody></table></div>';
    };

    // settings/marketgroups.jade compiled template
    templatizer["settings"]["marketgroups"] = function tmpl_settings_marketgroups() {
        return '<ol class="breadcrumb"><li>Market Groups</li><li><button type="button" @click.prevent="update" class="btn btn-success btn-xs">Update Market Groups</button></li><input style="margin-top:-0.15%;width:180px;height:28px;padding-left:5px" placeholder="Market Group Search" v-model="search" class="no-slash pull-right form-control"/></ol><div class="table-responsive"><table class="table table-striped table-hover table-condensed"><thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Eve ID</th><th></th></tr></thead><tbody v-show="market_groups.length &gt; 0"><tr v-for="market_group in market_groups"><th><strong>{{ market_group.id }}</strong></th><td>{{ market_group.name }}</td><td>{{ market_group.description }}</td><td>{{ market_group.eve_id }}</td><td class="text-right"></td></tr><tr v-show="pagination"><th colspan="5"><pagination :num="num_market_groups" :limit="25" :total="total_market_groups"></pagination></th></tr></tbody><tbody v-show="market_groups.length &lt; 1"><tr><th colspan="5" class="text-center"><b>No Market Groups</b></th></tr></tbody></table></div>';
    };

    return templatizer;
}));
