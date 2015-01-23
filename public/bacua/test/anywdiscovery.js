'186.137.141.82'
curl -v \
     -c cookie.txt \
     -X POST \
     -F "j_username=" \
     -F "j_password=" \
     http://localhost:60138/app/ea/j_security_check?resource=/content/ea/api/discovery.v1.json
curl -v -c cookie.txt -X POST -F "j_username=admin" -F "j_password=admin" http://186.137.141.82:60138/app/ea/j_security_check?resource=/content/ea/api/discovery.v1.json
http://186.137.141.82:60138/app/ea/j_security_check?resource=/content/ea/api/discovery.v1.json

"http://186.137.141.82:60138/content/ea/api/discovery.v1.json"
curl -v \
     -b cookie.txt \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"name": "MyProduction"}' \
     http:href":"http://186.137.141.82:60138/content/ea/api/discovery.v1.json
curl -v -b cookie.txt -X GET http://186.137.141.82:60138/content/ea/api/discovery.v1.json

"http://186.137.141.82:60138/content/ea/api/discovery.v1.json"
{
	"server":{"id":"333548a0-dbff-402d-8ecb-22297dfbc61c","name":"LABO03","description":"SERVIDOR ANYWHERE DEMO","version":"1.6.0.67","configuration":{"syslog.ip":"","ldapEnabled":false}},
	"properties":{"minorVersion":1},
	"links":[
		{"rel":"http://anywhere.adobe.com/mountpointlabels","title":"All Mountpointlabels","href":"http://186.137.141.82:60138/content/ea/api/mountpointlabels.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/exportpresets","title":"Export Presets","href":"http://186.137.141.82:60138/content/ea/api/exportpresets.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/monitors","title":"Monitors for the Anywhere system","href":"http://186.137.141.82:60138/content/ea/api/monitors.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/users","title":"All Users","href":"http://186.137.141.82:60138/content/ea/api/users.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/nodecontrollers","title":"All Node Controllers","href":"http://186.137.141.82:60138/content/ea/api/nodecontrollers.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/enclosures","title":"System enclosures","href":"http://186.137.141.82:60138/content/ea/api/enclosures.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/users/user#current","title":"Current user","href":"http://186.137.141.82:60138/ea/api/users.currentUser.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/medialocators","title":"All Medialocators","href":"http://186.137.141.82:60138/content/ea/api/medialocators.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/groups","title":"All Groups","href":"http://186.137.141.82:60138/content/ea/api/groups.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/productions","title":"All Productions","href":"http://186.137.141.82:60138/content/ea/git/productions.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/productions/templates","title":"All Template Productions","href":"http://186.137.141.82:60138/content/ea/git/productions.templates.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/system/logout","title":"Logout","href":"http://186.137.141.82:60138/system/sling/logout?resource=/content/ea/api/discovery.v1.json","type":"application/octet-stream"},
		{"rel":"http://anywhere.adobe.com/productions/production#byIdAndCommitId","title":"Production details by production id and commit id","href":"http://186.137.141.82:60138/content/ea/git/productions/{productionId}/{commitId}.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/restartrenderer","title":"Restart Anywhere Renderer","href":"http://186.137.141.82:60138/content/ea/api/restartRenderer.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/medialocator#byMediaLocatorId","title":"Medialocator for mediaLocatorId","href":"http://186.137.141.82:60138/content/ea/api/medialocators.byMediaLocatorId.v1/{mediaLocatorId}","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/nodecontroller/status","title":"Node Controller Status","href":"http://186.137.141.82:60138/content/ea/api/nodecontroller/status.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/productions/production#differenceByCommit","title":"Differences for Production","href":"http://186.137.141.82:60138/content/ea/git/productions/{productionId}/{commitId}.differences.v1.json/{baseCommitId}","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/sessions/session#bySessionAndCommit","title":"Session details by session id and commit id","href":"http://186.137.141.82:60138/content/ea/git/productions/{sessionId}/{commitId}.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/rendernodes","title":"Anywhere Render Nodes","href":"http://186.137.141.82:60138/content/ea/data/locator/nodes/render.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/productions/sessions/session#differenceByCommit","title":"Differences for Session","href":"http://186.137.141.82:60138/c* Connection #0 to host 186.137.141.82 left intact ontent/ea/git/productions/{sessionId}/{commitId}.differences.v1.json/{baseCommitId}","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/users/user#byUserId","title":"User by userId Template Link","href":"http://186.137.141.82:60138/content/ea/api/users.byUserId.v1.json/{userId}","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/jobs","title":"All Jobs","href":"http://186.137.141.82:60138/content/ea/api/jobs.v1.json","type":"application/json"},
		{"rel":"http://anywhere.adobe.com/discovery","title":"Discovery for Anywhere","href":"http://186.137.141.82:60138/content/ea/api/discovery.json","type":"application/json"},
		{"rel":"self","title":"Discovery for version v1","href":"http://186.137.141.82:60138/content/ea/api/discovery.v1.json","type":"application/json"}
	]
}








{"server":
	{
		"id":"333548a0-dbff-402d-8ecb-22297dfbc61c",
	 	"name":"LABO03",
	 	"description":"SERVIDOR ANYWHERE DEMO",
	 	"version":"1.6.0.67",
	 	"configuration":{
	 		"syslog.ip":"",
	 		"ldapEnabled":false
	 	}
	 },
 	"links":[
 		{
 			"rel":"http://anywhere.adobe.com/discovery/v1",
 			"title":"Discovery for version v1",
 			"href":"http://186.137.141.82:60138/content/ea/api/discovery.v1.json",
 			"type":"application/json"
 		},
 		{
 			"rel":"self",
 			"title":"Discovery for Anywhere",
 			"href":"http://186.137.141.82:60138/content/ea/api/discovery.json",
 			"type":"application/json"
 		}
 	]
 }





 {"server":
 	{ "id":"333548a0-dbff-402d-8ecb-22297dfbc61c","name":"LABO03","description":"SERVIDOR ANYWHERE DEMO","version":"1.6.0.67","configuration":{"syslog.ip":"","ldapEnabled":false}},

 	"properties": {"minorVersion":1},
	"links":[
		{
			"rel":"http://anywhere.adobe.com/users/user#create",
			"title":"Create User",
			"href":"http://186.137.141.82:60138/content/ea/api/users/administration.v1.json",
			"type":"application/json"
		},
		{
			"rel":"http://anywhere.adobe.com/system/",
			"title":"Login",
			"href":"http://186.137.141.82:60138/app/ea/j_security_check?resource=/content/ea/api/discovery.v1.json",
			"type":"application/octet-stream"
		},
		{
			"rel":"http://anywhere.adobe.com/discovery",
			"title":"Discovery for Anywhere",
			"href":"http://186.137.141.82:60138/content/ea/api/discovery.json",
			"type":"application/json"
		},
		{
			"rel":"self",
			"title":"Discovery for version v1",
			"href":"http://186.137.141.82:60138/content/ea/api/discovery.v1.json",
			"type":"application/json"
		}
	]
}



{"productions":[
	{
		"ea:productionId":"790321ea-bcd6-4b50-a508-8ca5b86fdb1f",
		"ea:lastModified":"2014-01-09T18:16:16.229-03:00",
		"ea:lastModifiedOfAllSessions":"2014-03-06T13:36:43.927-03:00",
		"properties":{
			"name":"test Disney",
			"description":"pruebas"
		},
		"links":[
		{
			"rel":"latest-version",
			"title":"Versioned Production Details",
			"href":"http://186.137.141.82:60138/content/ea/git/productions/790321ea-bcd6-4b50-a508-8ca5b86fdb1f/HEAD.v1.json",
			"type":"application/json"
		}
		]
	},
	{
		"ea:productionId":"95d1e8ab-ade7-4adf-a5bb-3490267945e2",
		"ea:lastModified":"2014-03-06T16:07:23.607-03:00",
		"properties":{
			"name":"Nombre de la nueva produccion1"
		},
		"links":[
		{
			"rel":"latest-version",
			"title":"Versioned Production Details",
			"href":"http://186.137.141.82:60138/content/ea/git/productions/95d1e8ab-ade7-4adf-a5bb-3490267945e2/HEAD.v1.json",
			"type":"application/json"
		}
		]
	},
	{
		"ea:productionId":"d47fe9e8-9b15-4d6e-8862-570edb3fefc3",
		"ea:lastModified":"2014-03-06T16:09:25.108-03:00",
		"ea:lastModifiedOfAllSessions":"2014-03-06T16:11:40.843-03:00",
		"properties":{"name":"Produccion MC1"},
		"links":[
		{
			"rel":"latest-version",
			"title":"Versioned Production Details",
			"href":"http://186.137.141.82:60138/content/ea/git/productions/d47fe9e8-9b15-4d6e-8862-570edb3fefc3/HEAD.v1.json",
			"type":"application/json"
		}
		]
	},
	{
		"ea:productionId":"47e2f9b1-c000-4b7c-b919-c82ecd4fbd82",
		"ea:lastModified":"2014-01-30T12:26:07.861-03:00",
		"ea:lastModifiedOfAllSessions":"2014-03-06T13:23:59.558-03:00",
		"properties":{"name":"munro 10"},
		"links":[{"rel":"latest-version","title":"Versioned Production Details","href":"http://186.137.141.82:60138/content/ea/git/productions/47e2f9b1-c000-4b7c-b919-c82ecd4fbd82/HEAD.v1.json","type":"application/json"}]
	},
	{
		"ea:productionId":"cb8e710f-eb64-4525-bb0e-0163903ded18",
		"ea:lastModified":"2014-03-11T16:03:03.270-03:00",
		"ea:lastModifiedOfAllSessions":"2014-03-11T16:43:25.195-03:00",
		"properties":{"name":"MATEO1","description":"PRODUCCION ANYWHERE 1"},
		"links":[{"rel":"latest-version","title":"Versioned Production Details","href":"http://186.137.141.82:60138/content/ea/git/productions/cb8e710f-eb64-4525-bb0e-0163903ded18/HEAD.v1.json","type":"application/json"}]
	},
	{
		"ea:productionId":"a1f14e23-17fb-40c8-b6ec-e486a3d94597","ea:lastModified":"2014-03-17T14:47:43.742-03:00","ea:lastModifiedOfAllSessions":"2014-03-17T14:47:47.261-03:00","properties":{"name":"producton17"},
		"links":[{"rel":"latest-version","title":"Versioned Production Details","href":"http://186.137.141.82:60138/content/ea/git/productions/a1f14e23-17fb-40c8-b6ec-e486a3d94597/HEAD.v1.json","type":"application/json"}]},{"ea:productionId":"cff9d5b8-c3cd-421c-a31b-3fa6caf62b87","ea:lastModified":"2014-03-17T16:23:17.012-03:00","ea:lastModifiedOfAllSessions":"2014-03-17T16:23:15.847-03:00","properties":{"name":"IPLUSB"},"links":[{"rel":"latest-version","title":"Versioned Production Details","href":"http://186.137.141.82:60138/content/ea/git/productions/cff9d5b8-c3cd-421c-a31b-3fa6caf62b87/HEAD.v1.json","type":"application/json"}]},{"ea:productionId":"c37d794c-a678-4414-8541-d893c4e75339","ea:lastModified":"2014-01-31T15:59:12.173-03:00","ea:lastModifiedOfAllSessions":"2014-03-17T14:01:39.549-03:00","properties":{"name":"Produccion Disney","description":"Producción de prueba"},"links":[{"rel":"latest-version","title":"Versioned Production Details","href":"http://186.137.141.82:60138/content/ea/git/productions/c37d794c-a678-4414-8541-d893c4e75339/HEAD.v1.json","type":"application/json"}]}],"stats":{"totalResults":8,"startIndex":1,"count":8},"links":[{"rel":"http://anywhere.adobe.com/productions/production#byIdAndCommitId","title":"Production details by production id and commit id","href":"http://186.137.141.82:60138/content/ea/git/productions/{productionId}/{commitId}.v1.json","type":"application/json"},{"rel":"self","title":"Result","href":"http://186.137.141.82:60138/content/ea/git/productions.v1.json","type":"application/json"},{"rel":"create","title":"create productions","href":"http://186.137.141.82:60138/content/ea/git/productions.v1.json","type":"application/json"},{"rel":"http://anywhere.adobe.com/productions/production#differenceByCommit","title":"Differences for Production","href":"http://186.137.141.82:60138/content/ea/git/productions/{productionId}/{commitId}.differences.v1.json/{baseCommitId}","type":"application/json"},{"rel":"http://anywhere.adobe.com/productions#import","title":"Import Production from previously exported zip","href":"http://186.137.141.82:60138/content/ea/git/productions.import.v1.json","type":"application/zip"
	}
	]
}


http://186.137.141.82:60138/content/ea/api/discovery.v1.json
{"server":{
	"id":"333548a0-dbff-402d-8ecb-22297dfbc61c","name":"LABO03","description":"SERVIDOR ANYWHERE DEMO","version":"1.6.0.67","configuration":{"syslog.ip":"","ldapEnabled":false}}
	,"properties":{"minorVersion":1},
	"links":[
		{
			"rel":"http://anywhere.adobe.com/mountpointlabels",
			"title":"All Mountpointlabels",
			"href":"http://186.137.141.82:60138/content/ea/api/mountpointlabels.v1.json",
			"type":"application/json"
		},
		{
			"rel":"http://anywhere.adobe.com/exportpresets",
			"title":"Export Presets",
			"href":"http://186.137.141.82:60138/content/ea/api/exportpresets.v1.json",
			"type":"application/json"
		},
		{
			"rel":"http://anywhere.adobe.com/monitors",
			"title":"Monitors for the Anywhere system",
			"href":"http://186.137.141.82:60138/content/ea/api/monitors.v1.json",
			"type":"application/json"
		},
		{
			"rel":"http://anywhere.adobe.com/users",
			"title":"All Users",
			"href":"http://186.137.141.82:60138/content/ea/api/users.v1.json",
			"type":"application/json"
		},
		{
			"rel":"http://anywhere.adobe.com/nodecontrollers",
			"title":"All Node Controllers",
			"href":"http://186.137.141.82:60138/content/ea/api/nodecontrollers.v1.json",
			"type":"application/json"
		},
		{
			"rel":"http://anywhere.adobe.com/enclosures",
			"title":"System enclosures",
			"href":"http://186.137.141.82:60138/content/ea/api/enclosures.v1.json",
			"type":"application/json"
		},
		{
			"rel":"http://anywhere.adobe.com/users/user#current",
			"title":"Current user",
			"href":"http://186.137.141.82:60138/ea/api/users.currentUser.v1.json",
			"type":"application/json"
		},
		{
			"rel":"http://anywhere.adobe.com/medialocators","title":"All Medialocators","href":"http://186.137.141.82:60138/content/ea/api/medialocators.v1.json","type":"application/json"},{"rel":"http://anywhere.adobe.com/groups","title":"All Groups","href":"http://186.137.141.82:60138/content/ea/api/groups.v1.json","type":"application/json"},{"rel":"http://anywhere.adobe.com/productions","title":"All Productions","href":"http://186.137.141.82:60138/content/ea/git/productions.v1.json","type":"application/json"},{"rel":"http://anywhere.adobe.com/productions/templates","title":"All Template Productions","href":"http://186.137.141.82:60138/content/ea/git/productions.templates.v1.json","type":"application/json"},{"rel":"http://anywhere.adobe.com/system/logout","title":"Logout","href":"http://186.137.141.82:60138/system/sling/logout?resource=/content/ea/api/discovery.v1.json","type":"application/octet-stream"},{"rel":"http://anywhere.adobe.com/productions/production#byIdAndCommitId","title":"Production details by production id and commit id","href":"http://186.137.141.82:60138/content/ea/git/productions/{productionId}/{commitId}.v1.json","type":"application/json"},{"rel":"http://anywhere.adobe.com/restartrenderer","title":"Restart Anywhere Renderer","href":"http://186.137.141.82:60138/content/ea/api/restartRenderer.json","type":"application/json"},{"rel":"http://anywhere.adobe.com/medialocator#byMediaLocatorId","title":"Medialocator for mediaLocatorId","href":"http://186.137.141.82:60138/content/ea/api/medialocators.byMediaLocatorId.v1/{mediaLocatorId}","type":"application/json"},{"rel":"http://anywhere.adobe.com/nodecontroller/status","title":"Node Controller Status","href":"http://186.137.141.82:60138/content/ea/api/nodecontroller/status.json","type":"application/json"},{"rel":"http://anywhere.adobe.com/productions/production#differenceByCommit","title":"Differences for Production","href":"http://186.137.141.82:60138/content/ea/git/productions/{productionId}/{commitId}.differences.v1.json/{baseCommitId}","type":"application/json"},{"rel":"http://anywhere.adobe.com/sessions/session#bySessionAndCommit","title":"Session details by session id and commit id","href":"http://186.137.141.82:60138/content/ea/git/productions/{sessionId}/{commitId}.v1.json","type":"application/json"},{"rel":"http://anywhere.adobe.com/rendernodes","title":"Anywhere Render Nodes","href":"http://186.137.141.82:60138/content/ea/data/locator/nodes/render.json","type":"application/json"},{"rel":"http://anywhere.adobe.com/productions/sessions/session#differenceByCommit","title":"Differences for Session","href":"http://186.137.141.82:60138/content/ea/git/productions/{sessionId}/{commitId}.differences.v1.json/{baseCommitId}","type":"application/json"},{"rel":"http://anywhere.adobe.com/users/user#byUserId","title":"User by userId Template Link","href":"http://186.137.141.82:60138/content/ea/api/users.byUserId.v1.json/{userId}","type":"application/json"},{"rel":"http://anywhere.adobe.com/jobs","title":"All Jobs","href":"http://186.137.141.82:60138/content/ea/api/jobs.v1.json","type":"application/json"},{"rel":"http://anywhere.adobe.com/discovery","title":"Discovery for Anywhere","href":"http://186.137.141.82:60138/content/ea/api/discovery.json","type":"application/json"},{"rel":"self","title":"Discovery for version v1","href":"http://186.137.141.82:60138/content/ea/api/discovery.v1.json","type":"application/json"}]}





 http://localhost:60138/content/ea/git/productions.v1.json


 {"server":
 	{
 		"id":"333548a0-dbff-402d-8ecb-22297dfbc61c","name":"LABO03","description":"SERVIDOR ANYWHERE DEMO","version":"1.6.0.67","configuration":{"syslog.ip":"","ldapEnabled":false}},"properties":{"minorVersion":1},
 		"links":[
 		{
 			"rel":"http://anywhere.adobe.com/users/user#create","title":"Create User","href":"http://186.137.141.82:60138/content/ea/api/users/administration.v1.json","type":"application/json"},
 		{
 			"rel":"http://anywhere.adobe.com/system/login","title":"Login","href":"http://186.137.141.82:60138/app/ea/j_security_check?resource=/content/ea/api/discovery.v1.json","type":"application/octet-stream"},
 		{
 			"rel":"http://anywhere.adobe.com/discovery","title":"Discovery for Anywhere","href":"http://186.137.141.82:60138/content/ea/api/discovery.json","type":"application/json"},
 		{
 			"rel":"self","title":"Discovery for version v1","href":"http://186.137.141.82:60138/content/ea/api/discovery.v1.json","type":"application/json"}]}


{ "_id" : ObjectId("52d7e1bcdff70a4d02993dd8"), "displayName" : "Mateogo", "username" : "mgomezortega@gmail.com", "password" : "mateogo", "mail" : "mgomezortega@gmail.com", "roles" : [  "administrador",  "coordinador" ], "fealta" : "", "estado_alta" : "activo", "verificado" : { "mail" : false, "feaprobado" : null, "adminuser" : "" }, "conduso" : [ ], "home" : "gestion:comprobantes:list", "grupo" : "tecnica", "feum" : 1397678962666, "es_usuario_de" : [ 	{ 	"id" : "52d7e15edff70a4d02993dd7", 	"code" : "MateoGO", 	"slug" : "Mateo Gómez Ortega", 	"order" : 101, 	"predicate" : "es_usuario_de" } ], "key" : { "fedesde" : "2014-01-01T03:00:00.000Z", "fehasta" : "2014-01-17T03:00:00.000Z", "resumen" : "producto", "tipoitem" : "nrecepcion", "tipomov" : "recepcion", "slug" : "", "estado" : "alta" }, "documQuery" : { "fedesde" : "2014-04-04T03:00:00.000Z", "fehasta" : "2014-04-16T03:00:00.000Z", "resumen" : "detallado", "tipoitem" : "pdiario", "tipomov" : "no_definido", "slug" : "", "estado" : "no_definido" } }






{ 
	"_id" : ObjectId("52d7e1bcdff70a4d02993dd8"), 
	"displayName" : "Mateogo", 
	"username" : "mgomezortega@gmail.com", 
	"password" : "mateogo", 
	"mail" : "mgomezortega@gmail.com", 
	"roles" : [  "administrador",  "coordinador" ], 
	"fealta" : "", 
	"estado_alta" : "activo", 
	"verificado" : { "mail" : false, "feaprobado" : null, "adminuser" : "" }, 
	"conduso" : [ ], 
	"home" : "gestion:comprobantes:list", 
	"grupo" : "tecnica", 
	"feum" : 1397678962666, 
	"es_usuario_de" : [ 	
		{
			"id" : "52d7e15edff70a4d02993dd7", 	
		"code" : "MateoGO", 	
		"slug" : "Mateo Gómez Ortega", 	
		"order" : 101, 	"predicate" : "es_usuario_de" } ], 
		"key" : { "fedesde" : "2014-01-01T03:00:00.000Z", 
		"fehasta" : "2014-01-17T03:00:00.000Z", 
		"resumen" : "producto", 
		"tipoitem" : "nrecepcion", 
		"tipomov" : "recepcion", 
		"slug" : "", 
		"estado" : "alta" 
	}, 
	"documQuery" : 
	{ 
		"fedesde" : "2014-04-04T03:00:00.000Z", 
		"fehasta" : "2014-04-16T03:00:00.000Z", 
		"resumen" : "detallado", 
		"tipoitem" : "pdiario", 
		"tipomov" : "no_definido", 
		"slug" : "", 
		"estado" : "no_definido" } }
		
{ 
	"_id" : ObjectId("535808c528482b12048aaf07"), 
	"displayName" : "admin", 
	"username" : "adminanyw@gmail.com", 
	"password" : "admin", 
	"mail" : "adminanyw@gmail.com", 
	"roles" : [  "administrador" ], 
	"fealta" : "", 
	"grupo" : "tecnica", 
	"estado_alta" : "activo", 
	"verificado" : { "mail" : false, "feaprobado" : null, "adminuser" : "" }, 
	"conduso" : [ ], 
	"home" : "procedencias:list", "feum" : 1398278557734, 
	"es_usuario_de" : [ 	{ 	"id" : "5358076828482b12048aaf06", 	"code" : "Admin", 	"slug" : "Administrator", 	"order" : 101, 	"predicate" : "es_usuario_de" } ], 
	"documQuery" : 
	{ 
		"fedesde" : "2013-04-01T03:00:00.000Z", 
		"fehasta" : "2014-04-23T03:00:00.000Z", 
		"resumen" : "producto", 
		"tipoitem" : "ptecnico", 
		"tipomov" : null, 
		"slug" : "", 
		"estado" : null } }



