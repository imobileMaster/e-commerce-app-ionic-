/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
				deviceready();
			}    
};
server_url="http://swapco.colourchalk.com";
//server_url="http://localhost:3000";

function authenticate()
{
	var data = {username:$('#username').val(), password:$('#password').val()};
	if(data.username.trim()=="" || data.password.trim() == "")
	{
		alert("All Fields Are Required");
		return;
	}
	
	 $.getJSON(server_url+"/api.php",
				 {action:'authenticate', data:data},
				 function(res){
				 	if(res.result=="success")
					{
						localStorage['logged_in_username'] = data.username.trim();
						location.href = "welcome.html";						
					}
					else if(res.error_type=="validation")
					{
						alert("Validation Error. Please Check Your Input");
					}
				 });
}

function signup()
{

	var data = new Object();
	data.username = $("#username").val().trim();
	data.password = $("#password").val().trim();
	data.confirm_password = $("#confirm_password").val().trim();
	data.company_name = $("#company_name").val().trim();
	data.website = $("#website").val().trim();
	data.first_name = $("#first_name").val().trim();
	data.middle_name = $("#middle_name").val().trim();
	data.last_name = $("#last_name").val().trim();
	data.address = $("#address").val().trim();
	data.city = $("#city").val().trim();
	data.state = $("#state").val().trim();
	data.zip = $("#zip").val().trim();
	data.email = $("#email").val().trim();
	data.type_of_business = $(".type_of_business:checked").val();
	data.date_of_birth = $("#date_of_birth").val();
	data.social_security = $("#social_security").val();
	data.ein = $("#ein").val();
	data.bank_account = $("#bank_account").val();
	data.routing_number = $("#routing_number").val();
	data.credit_card_number = $("#credit_card_number").val();
	data.expiration = $("#expiration").val();
	data.csc = $("#csc").val();
	data.returns = $("#returns").val().trim();
	

	var verror = "";
	if(data.username == "")
	{
		verror += "Username is required\n";
	}
	if(data.password == "")
	{
		verror += "Username is required\n";
	}
	if(data.password != data.confirm_password)
	{
		verror += "Passwords do not match\n";
	}

	if(verror == "")
	{
	   $.getJSON(server_url+"/api.php",
				 {action:'register', data:data},
				 function(res){
				 	if(res.result=="success")
					{
						alert("Thank You For Registration");
						location.href = "index.html";						
					}
					else if(res.error_type=="db")
					{
						alert("Sorry Database Not Updated. Please Try Again");
					}
					else if(res.error_type=="validation")
					{
						alert("Validation Error. Please Check Your Input");
					}
				 });
	}
	else
	{
		alert(verror);
	}
}

function makeResultSheet(errors, okAction)
{
	if($.isArray(errors))
	{
		$ehtml = "";	
		$.each(errors, function(i, es){
			if($.isArray(es))
			{
				$.each(es, function(i, e)
				{
					$ehtml += "<div class='alert alert-danger' >"+e+"</div>";						
				});
			}
			else
			{
				$ehtml += "<div class='alert alert-danger' >"+es+"</div>";
			}
		});
	}
	return $ehtml;
}

function createStructure()
{
	db.transaction(
		function(tx)
		{
			tx.executeSql('CREATE TABLE IF NOT EXISTS users (id integer primary key, '+
								'username text, password text, company_name text, website text, first_name text, middle_name text, '+
								'last_name text, address text, city text, state text, zip text, email text, returns text)');
			tx.executeSql('CREATE TABLE IF NOT EXISTS categories (id integer primary key, '+
																					'main_type text, name text, image text)');
			tx.executeSql('CREATE TABLE IF NOT EXISTS profiles (id integer primary key, name text)');
			tx.executeSql('CREATE TABLE IF NOT EXISTS selling_sites (id integer primary key, name text, api_key text)');
			tx.executeSql('CREATE TABLE IF NOT EXISTS product_images (id integer primary key, product_id integer, type text, image text)');
			tx.executeSql('CREATE TABLE IF NOT EXISTS products (id integer primary key, category_id integer, profile_id integer, '+
							  'brand text, name text, color text, size text, condition text, description text, price text, shipping text, '+
							  'who text, what text, wen text, were text, why text, how text)');
			tx.executeSql("INSERT INTO categories (main_type, name, image) VALUES(?,?,?)", ['male', 'shirt', '']);
		},
		function(e)
		{
			alert(e.message);
		},
		function()
		{
			$("#db_status").html("DB initiated...").fadeIn();
			setTimeout("$('#db_status').fadeOut()", 1000);
		}
	);
}

developer_key = 'c754d3b3-d156-41d8-9ee0-8e7e59f11371';
developer_password = 'Teamswap9@123';

inventory_wsdl_url = 'https://api.channeladvisor.com/ChannelAdvisorAPI/v3/InventoryService.asmx?WSDL';
admin_wsdl_url = 'https://api.channeladvisor.com/ChannelAdvisorAPI/v7/AdminService.asmx?WSDL';
action_url_part = 'http://api.channeladvisor.com/webservices/';

function caRequest(profile_id, callback)
{
		var soapRequest = '<?xml version="1.0" encoding="utf-8"?>'+
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+
			'xmlns:web="http://api.channeladvisor.com/webservices/">'+
			'<soapenv:Header>'+
				'<web:APICredentials>'+
					'<web:DeveloperKey>'+developer_key+'</web:DeveloperKey>'+
					'<web:Password>'+developer_password+'</web:Password>'+
				'</web:APICredentials>'+
			'</soapenv:Header>'+
			'<soapenv:Body>'+
				'<web:RequestAccess>'+
					'<web:localID>'+profile_id+'</web:localID>'+
				'</web:RequestAccess>'+
			'</soapenv:Body>'+
		'</soapenv:Envelope>';

	soapAjax("RequestAccess", admin_wsdl_url, soapRequest, callback);	
}


function caGAL(profile_id, callback)
{
		var soapRequest = '<?xml version="1.0" encoding="utf-8"?>'+
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+
			'xmlns:web="http://api.channeladvisor.com/webservices/">'+
			'<soapenv:Header>'+
				'<web:APICredentials>'+
					'<web:DeveloperKey>'+developer_key+'</web:DeveloperKey>'+
					'<web:Password>'+developer_password+'</web:Password>'+
				'</web:APICredentials>'+
			'</soapenv:Header>'+
			'<soapenv:Body>'+
				'<web:GetAuthorizationList>'+
					'<web:localID>'+profile_id+'</web:localID>'+
				'</web:GetAuthorizationList>'+
			'</soapenv:Body>'+
		'</soapenv:Envelope>';

	soapAjax("GetAuthorizationList", admin_wsdl_url, soapRequest, callback);	
}


function soapAjax(action, url, soapRequest, callback)
{
	$.ajax({
			 headers: {
  				SOAPAction: action_url_part + action
			 },
		    type: "POST",
			 url: url,
  			 contentType: "text/xml",
		    dataType: "xml",
		    data: soapRequest,
		    success: function(data, status, req) {				
				console.log(req.responseText);
				if(status == "success")
				{	
					 var xmlObj = $(req.responseXML);				
					 callback(xmlObj);							
				}
				
			},
		   error: processError
	});
}


function processError(data, status, req) {
   alert(req.responseText + " " + status);
} 
 

function clearForm()
{
	$.each(localStorage, function(key,value){
				if(key != 'logged_in_username' )
				{
					delete(localStorage[key]);
				}
			});
	 $.each(sessionStorage, function(key,value){
				if(key != 'logged_in_username' )
				{
					delete(sessionStorage[key]);
				}
			});
}

var sub_types = {"clothing" : ["dresses","suits and blazers","sweats & hoodies","sweater","tops & blouses","shirts","jumpsuits and rompers","t-shirts","leggings","jeans","shorts","skirts"],
							  "shoes":["shoes"],
							  "accessories": ["swimwear","mixed items & lots","belts","scarves","sunglasses"]};


var mcat1 = ["dresses","suits and blazers","sweats & hoodies","sweater","tops & blouses","shirts","jumpsuits and rompers","t-shirts"];
var mcat2 = ["leggings","jeans","shorts","skirts"];
var mcat3 = ["shoes"];
var mcat4 = ["swimwear","mixed items & lots","belts","scarves","sunglasses"];

var mfs = {"all":"#chest_bust,#sleeve_length,#inseam,#outseam,#waist,#heel_weight,#shoe_length,#shoe_width,#shirt_section,#shoe_section",
			  "cat1":"#chest_bust,#sleeve_length,#shirt_section",
			  "cat2":"#inseam,#outseam,#waist,#shirt_section",
			  "cat3":"#heel_weight,#shoe_length,#shoe_width,#shoe_section"};
