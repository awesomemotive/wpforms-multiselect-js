/* eslint-disable no-console */
/* global WPFormsMultiSelectCheckbox */

// Call the initialization function when the DOM is ready
function initializeDropdownCheckboxes() {
	const dropdowns = document.querySelectorAll( '.dropdown' );
	const dropDownWithCustomOpener = document.querySelector( '.dropdown-with-custom-opener' );
	const customOpener = document.querySelector( '.custom-opener' );

	dropdowns.forEach( ( dropdown ) => {
		const multiSelectCheckbox = new WPFormsMultiSelectCheckbox( dropdown );
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

	// Example of how to set a custom opener
	if ( dropDownWithCustomOpener ) {
		const multiSelectCheckbox = new WPFormsMultiSelectCheckbox(
			dropDownWithCustomOpener,
			{
				customOpener,
			}
		);
		multiSelectCheckbox.init();
	}
}

document.addEventListener( 'DOMContentLoaded', initializeDropdownCheckboxes );
