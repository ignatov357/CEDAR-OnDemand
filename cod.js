function open_and_handle_selector_popup() {
	if(document.querySelectorAll('.tingle-modal.ontology_ids_selector_popup').length == 0) {
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

			var s = document.createElement('script');
			s.src = chrome.extension.getURL('cod_complete.js');
			s.onload = function() {
			    this.remove();
			};
			(document.head || document.documentElement).appendChild(s);

	 		var style = document.createElement('link');
			style.rel = 'stylesheet';
			style.type = 'text/css';
			style.href = chrome.extension.getURL('jquery.autocomplete.css');
			(document.head||document.documentElement).appendChild(style);

			window.ontologiesSearch = new Sifter(allOntologies);
			$('input[type=text]').each(function(){
		       	var $element = $(this); 
		       	if ($element.val() == '') {
		       		var $label = $("label[for='" + this.id + "']")
					this.style.backgroundColor = "#f9f9d2";
					var labelValue = $label.text(); //Getting the label value
			
					var BioPortalOntologies = searchOntologies(labelValue);

		       		var defaultOntologiesArray = defaultOntologies.toString().split(","); //convert string into array for array-array comparsion to find the intersection
				
					var qualifiedOntologies = defaultOntologiesArray.filter(function(ontology) {
						return BioPortalOntologies.indexOf(ontology) !== -1;
					});
					
					if(qualifiedOntologies.length > 0) {
						this.className = "bp_form_complete-" + qualifiedOntologies + "-name";
					} else {
						this.className = "bp_form_complete-" + defaultOntologies + "-name";
					}
				} else {
					this.className = "bp_form_complete-" + defaultOntologies + "-name";  		
				}
		    }); 

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
		    searchField: ['value', 'text']
		});
		var ontology_ids_selector = $select[0].selectize;
	}
}
function searchOntologies(text) {
	var result = [];
	window.ontologiesSearch.search(text, {fields: ['value', 'text']})['items'].forEach(function(item) {
		result.push(allOntologies[item['id']]['value']);
	});
	return result;
}

if(document.querySelectorAll('.tingle-modal.ontology_ids_selector_popup').length == 0) {
	if(typeof allOntologies === 'undefined') {
		$.ajax({
			url: 'https://data.bioontology.org/ontologies?include=name,acronym&display_links=false&display_context=false&apikey=8b5b7825-538d-40e0-9e9e-5ab9274a9aeb',
			dataType: 'JSON',
			success: function(data) {
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

				/*var script = document.createElement('script');
				script.id = "ontologiesSearchInitializer";
				script.text="var ontologiesSearch = new Sifter(allOntologies); document.querySelector('script[id=ontologiesSearchInitializer]').remove();";
				document.getElementsByTagName('head')[0].appendChild(script);*/

				open_and_handle_selector_popup();
			}
		});
	} else {
		open_and_handle_selector_popup();
	}
}