/* eslint-disable no-console */
/* global wpformsMultiSelectCheckbox */

// Call the initialization function when the DOM is ready
function initializeDropdownCheckboxes() {
	const dropdowns = document.querySelectorAll( '.dropdown' );

	dropdowns.forEach( ( dropdown ) => {
		const multiSelectCheckbox = new wpformsMultiSelectCheckbox( dropdown );
		multiSelectCheckbox.init();

		// Example of how to listen for the onchange event
		if ( dropdown.classList.contains( 'has-onchange-event' ) ) {
			dropdown.addEventListener( 'wpforms_multiselect_checkbox_changed', ( { detail: { selectedOptions } } ) => {
				console.info( 'Selected options changed:', selectedOptions );
			} );
		}

		// Example of how to listen for the onremove event
		if ( dropdown.classList.contains( 'has-onremove-event' ) ) {
			dropdown.addEventListener( 'wpforms_multiselect_checkbox_removed', ( { detail: { removedOption } } ) => {
				console.info( 'Option removed:', removedOption );
			} );
		}

		// Example of how to update the dropdown values
		if ( dropdown.classList.contains( 'has-update-api' ) ) {
			const valuesToSet = [ 'Option 1', 'Option 3' ];
			multiSelectCheckbox.update( dropdown, valuesToSet );
		}
	} );
}

document.addEventListener( 'DOMContentLoaded', initializeDropdownCheckboxes );