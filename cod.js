function open_and_handle_selector_popup() {
	if(document.querySelectorAll('.tingle-modal.ontology_ids_selector_popup, .tingle-modal.handling_search_popup, .tingle-modal.first_run_loader').length == 0) {
		var modal = new tingle.modal({
		    footer: true,
		    stickyFooter: false,
		    closeMethods: [],
		    closeLabel: "Cancel",
		    cssClass: ['ontology_ids_selector_popup']
		});

		modal.setContent('<p style="margin: 0px;">You can add/remove BioPortal Ontologies IDs.</p><p style="margin-top: 0px;">Note! You can add/remove ontologies later on anytime.</p><select id="ontology_ids" multiple></select>');
		modal.addFooterBtn('OK', 'tingle-btn tingle-btn--primary tingle-btn--pull-left', function() {
			if(ontology_ids_selector.getValue() == '') {
				return false;
			} else {
				var defaultOntologies = ontology_ids_selector.getValue();
				if(document.querySelectorAll('head meta[name=cedarOnDemandExtension_OntologyIds]').length == 0) {
					var meta = document.createElement('meta');
					meta.name = "cedarOnDemandExtension_OntologyIds";
					meta.content = defaultOntologies;
					document.getElementsByTagName('head')[0].appendChild(meta);
				} else {
					document.querySelector('head meta[name=cedarOnDemandExtension_OntologyIds]').content = defaultOntologies;
				}
			}

			//window.ontologiesSearch = new Sifter(allOntologies); // Local ontologies search library object creation
       		var loader = new tingle.modal({
			    closeMethods: [],
			    cssClass: ['handling_search_popup']
			});
			loader.setContent('<div id="preloader"><div id="loader"></div></div><br><br>Setting up the relevant ontologies for every input field.<br>Please, wait!');
			$('input[type=text]').each(function(){
		       	var $element = $(this); 
	       		var $label = $("label[for='" + this.id + "']");
	       		if($label.length > 0) {
					var labelValue = $label.text(); // Getting the label value

					callback = function(recommenderOntologies) {
						var defaultOntologiesArray = defaultOntologies.toString().split(","); //convert string into array for array-array comparsion to find the intersection
				
						var qualifiedOntologies = defaultOntologiesArray.filter(function(ontology) {
							return recommenderOntologies.indexOf(ontology) !== -1;
						});
						
						if(qualifiedOntologies.length > 0) {
							$element.attr("class", "bp_form_complete-" + qualifiedOntologies + "-name-shortid");
						} else {
							$element.attr("class", "bp_form_complete-" + defaultOntologies + "-name-shortid");
						}
						//$element.attr("data-bp_include_definitions", "true");
						$element.css('background-color', '#f9f9d2');

						if(activeRequestsToBioPortal == 1) {
						    loader.close();
							document.querySelector('.tingle-modal.handling_search_popup').remove();

							var s = document.createElement('script');
							s.src = chrome.extension.getURL('cod_complete.js');
							s.onload = function() {
							    this.remove();
							};
							(document.head || document.documentElement).appendChild(s);

						}
					}
					searchOntologiesUsingBioportal(labelValue, callback); // Search of relevant ontologies using BioPortal Recommender
					//searchOntologies(labelValue, callback); // Local search of relevant ontologies
				} else {
					$element.attr("class", "bp_form_complete-" + defaultOntologies + "-name-shortid");
					//$element.attr("data-bp_include_definitions", "true");
					$element.css('background-color', '#f9f9d2');
				}
			});


		    loader.open();
		    modal.close();
		    document.querySelector('.tingle-modal.ontology_ids_selector_popup').remove();
		});
		modal.addFooterBtn('Cancel', 'tingle-btn tingle-btn--default tingle-btn--pull-left', function() {
		    modal.close();
		    document.querySelector('.tingle-modal.ontology_ids_selector_popup').remove();
		});

		modal.open();

		defaultOntologies = 'NCBITAXON,DOID,GO,OBI,PR,IDO,CL';
		if(document.querySelectorAll('head meta[name=cedarOnDemandExtension_OntologyIds]').length > 0) {
			defaultOntologies = document.querySelector('head meta[name=cedarOnDemandExtension_OntologyIds]').content;
		}
		var $select = jQuery('select#ontology_ids').selectize({
			options: allOntologies,
			items: defaultOntologies.split(','),
			plugins: ['remove_button'],
		    delimiter: ',',
		    persist: false,
		    searchField: ['value', 'text'],
		    //sortField: {'field': 'text', 'direction': 'asc'}
		});
		var ontology_ids_selector = $select[0].selectize;
	}
}

/* Function for the search of relevant ontologies using BioPortal Recommender
   Executes callback function, if given, passing the array of ontology IDs */
function searchOntologiesUsingBioportal(text, callback) {
	if(typeof activeRequestsToBioPortal != "number") {
		activeRequestsToBioPortal = 0;
	}
	$.ajax({
		url: 'https://data.bioontology.org/recommender?input=' + text + '&include=ontologies&display_links=false&display_context=false&apikey=8b5b7825-538d-40e0-9e9e-5ab9274a9aeb', 
	    dataType: 'JSON',
	    beforeSend: function() {
	    	activeRequestsToBioPortal++;
	    },
		success: function(data) {
	        for(i = 0; i < data.length; i++) {
				data[i] = data[i]['ontologies'][0]['acronym'];
			}
			if(typeof callback == "function") {
				callback(data);
			}
	    },
	    complete: function() {
	    	activeRequestsToBioPortal--;
	    }
	});
}

/* Function for the local search of relevant ontologies
   Returns array of ontology IDs or executes callback function, if given, passing the array of ontology IDs */
function searchOntologies(text, callback = null) {
	var result = [];
	window.ontologiesSearch.search(text, {fields: ['value', 'text']})['items'].forEach(function(item) {
		result.push(allOntologies[item['id']]['value']);
	});
	if(typeof callback == "function") {
		callback(result);
	} else {
		return result;
	}
}

if(document.querySelectorAll('.tingle-modal.ontology_ids_selector_popup, .tingle-modal.handling_search_popup, .tingle-modal.first_run_loader').length == 0) {			
	if(typeof allOntologies === 'undefined') {
		var loader = new tingle.modal({
		    closeMethods: [],
		    cssClass: ['first_run_loader']
		});
		loader.setContent('<div id="preloader"><div id="loader"></div></div><br><br>Retrieving list of ontologies.<br>Please, wait!');
		loader.open();

		$.ajax({
			url: 'https://data.bioontology.org/ontologies?include=name,acronym&display_links=false&display_context=false&apikey=8b5b7825-538d-40e0-9e9e-5ab9274a9aeb',
			dataType: 'JSON',
			success: function(data) {
				// Removing spaces at the beginning and the end of the ontology names
				for(i = 0; i < data.length; i++) {
					data[i]['name'] = data[i]['name'].trim();
		        }
				data.sort(function(a, b) {
					if(a.name < b.name) {
						return -1;
					}
					if(a.name > b.name) {
						return 1;
					}
					return 0;
				});
				allOntologies = [];
				allOntologiesString = '';
				allOntologiesString += '[';
				for(i = 0; i < data.length; i++) {
					allOntologies.push({value: data[i]['acronym'], text: data[i]['name']});
					allOntologiesString += '{value: "' + data[i]['acronym'] + '", text: "' + data[i]['name'] + '"}';
					if(i < (data.length - 1)) {
						allOntologiesString += ',';
					}
		        }
		        allOntologiesString += ']';

				var script = document.createElement('script');
				script.id = "allOntologiesSaver";
				script.text="allOntologies = " + allOntologiesString + "; document.querySelector('script[id=allOntologiesSaver]').remove();";
				document.getElementsByTagName('head')[0].appendChild(script);

			    loader.close();
				document.querySelector('.tingle-modal.first_run_loader').remove();	

				open_and_handle_selector_popup();
			}
		});
	} else {
		open_and_handle_selector_popup();
	}
}