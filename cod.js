// JavaScript Document
// Checking page title
// JavaScript Document
// Checking page title
var s = document.createElement('script');
var addNewJS= document.getElementsByTagName('style')[0];

var defaultontologies;
var ontologyvalues = prompt("CEDAR OnDemand uses the NCBITAXON,DOID,GO,OBI,PR,IDO,CL ontologies by default. \n\nYou can add your own coma separated BioPortal Ontologies IDs or Press OK to go with default ontologies. \n\n Note! You can add/remove ontologies later on anytime.   ", defaultontologies);
if(ontologyvalues=="" || ontologyvalues=="NCBITAXON,DOID,GO,OBI,PR,IDO,CL" || ontologyvalues==null )
{
 defaultontologies="NCBITAXON,DOID,GO,OBI,PR,IDO,CL";
}
else if(ontologyvalues!="")
{

defaultontologies=ontologyvalues;

}
	
	else{}

//$.noConflict();

//(function($){
    // original code here, with $ being a jQuery reference
    // (but only within this code block)
	s.src = chrome.extension.getURL('cod_complete.js');

//})(jQuery);

// TODO: add "script.js" to web_accessible_resources in manifest.json
//s.src = chrome.extension.getURL('form_complete.js');
//s.src = chrome.extension.getURL('crossdomain_autocomplete.js');
//s.src = chrome.extension.getURL('jquery-1.11.2.min.js');
//s.src = chrome.extension.getURL('jquery-migrate-1.2.1.min.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement). appendChild(s);

 var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('jquery.autocomplete.css');
(document.head||document.documentElement).appendChild(style);
//if(addNewJS.firstChild) addNewJS.insertBefore(s,addNewJS.firstChild);
//else addNewJS.appendChild(s);

//var d = document.getElementsByTagName("input")[0];
//d.className += "bp_form_complete-all-name";

//var d;
//var e= document.querySelectorAll("input[type=text],input[id=fv_0]");
var d= document.querySelectorAll("input[type=text],input[id=fv_0],input");

//if()
for (var i = 0; i < d.length; i++) {
	  d[i].className = "bp_form_complete-"+defaultontologies+"-name";

   // d[i].className = "bp_form_complete-NCBITAXON,DOID,GO,OBI,PR,IDO,CL-name";
	//d[i].setAttribute("data-bp_include_definitions", "true");
	d[i].style.backgroundColor="#f9f9d2";
	//d[i].data-bp_include_definitions="true";
	//d[i].innerHTML="New cell";
	//document.getElementsByClassName("ac_results").style.backgroundColor="yellow"

}
//document.getElementsByTagName("input")[0].style.backgroundColor="yellow"
//document.getElementsByTagName("form").style.backgroundColor="yellow"
//<div class="ac_results" style="position: absolute; width: 650px; top: 27px; left: 82px; display: none;"></div>
//document.getElementsByClassName("ac_results").style.backgroundColor="yellow"

document.getElementsByTagName("body").style.backgroundColor="green"

   // <input type="text" class="bg-info" size="70"  style="border:none" id="a_bioportal_full_id" disabled>    
