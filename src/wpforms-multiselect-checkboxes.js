/* global define, HTMLSelectElement, CustomEvent */

( function ( root, factory ) {
	const pluginName = 'WPFormsMultiSelectCheckbox';

	if ( typeof define === 'function' && define.amd ) {
		define( [], factory( pluginName ) );
	} else if ( typeof exports === 'object' ) {
		module.exports = factory( pluginName );
	} else {
		root[ pluginName ] = factory( pluginName );
	}
} )( this, function ( pluginName ) {
	( 'use strict' );

	/**
	 * Plugin Object.
	 *
	 * @class Plugin
	 */
	class Plugin {
		// Default settings.
		static defaults = {
			// Default setting to show search field.
			showSearch: false,
			// Default setting to show selected options.
			showTags: false,
			// Default setting to show clear button.
			showClear: false,
			// Default setting to show mask.
			showMask: false,
			// Default setting for the position of the selected options.
			tagsPlacement: 'top',
			// Default delimiter for the input value.
			// This is an undocumented option which might not often be used, but it's here for convenience.
			delimiter: ', ',
		};

		// Default i18n strings.
		static i18n = {
			search: 'Search',
			clear: 'Clear',
			all: 'All',
			multiple: 'Multiple',
		};

		/**
		 * Constructor.
		 *
		 * @param {string|HTMLElement} element  The selector or element.
		 * @param {Object}             settings The settings object.
		 *
		 * @return {void}
		 */
		constructor( element, settings = {} ) {
			// Store the element and settings.
			this.element = element;
			// Merge the default i18n strings with the provided i18n strings.
			this.i18n = Object.assign( {}, Plugin.i18n, settings.i18n );
			// Remove the i18n object from the settings object if it exists.
			if ( settings.i18n ) {
				delete settings.i18n;
			}
			// Merge the default settings with the provided settings.
			this.settings = Object.assign( {}, Plugin.defaults, settings );

			// Store the element and settings.
			// Reduce DOM lookups by storing a few commonly used elements.
			this.wrapper = document.createElement( 'div' );
			this.wrapInner = document.createElement( 'div' );
			this.formWrapper = document.createElement( 'div' );
			this.input = document.createElement( 'input' );
			this.list = document.createElement( 'div' );
			this.selectedOptionsContainer = null;
			this.clearButton = null;
			this.search = null;
			this.mask = null;
		}
		/**
		 * Initialize the plugin.
		 *
		 * @return {void}
		 */
		init() {
			try {
				// Get the elements based on the provided selector.
				const element =
					typeof this.element === 'string' ? document.getElementById( this.element ) : this.element;

				// Check if element is found.
				if ( ! element ) {
					throw new PluginError( 'The specified element could not be found.' );
				}

				// Check if the element is a select field.
				if ( ! ( element instanceof HTMLSelectElement ) ) {
					throw new PluginError( 'This plugin can only be used on select fields.' );
				}

				// Check if the select field is a multiple select field.
				if ( ! element.multiple ) {
					throw new PluginError(
						'This plugin can only be used on select fields with the "multiple" attribute.'
					);
				}

				// Check if the select field has options.
				if ( element.options.length === 0 ) {
					throw new PluginError( 'This plugin can only be used on select fields with available options.' );
				}

				// Get the plugin settings from the data-settings attribute.
				let settings;
				try {
					settings = JSON.parse( element.getAttribute( 'data-settings' ) ) || {};
				} catch ( parseError ) {
					throw new PluginError(
						'Failed to parse the plugin settings. Please ensure that the settings are provided in valid JSON format.'
					);
				}

				this.i18n = Object.assign( {}, this.i18n, settings.i18n );
				this.settings = Object.assign( {}, this.settings, settings );

				// Validate individual properties.
				if ( typeof this.settings.showSearch !== 'boolean' ) {
					throw new PluginError( 'The "showSearch" property must be a boolean value.' );
				}

				if ( typeof this.settings.showTags !== 'boolean' ) {
					throw new PluginError( 'The "showTags" property must be a boolean value.' );
				}

				if ( typeof this.settings.showClear !== 'boolean' ) {
					throw new PluginError( 'The "showClear" property must be a boolean value.' );
				}

				if (
					typeof this.settings.tagsPlacement !== 'string' ||
					! [ 'top', 'bottom', 'left', 'right' ].includes( this.settings.tagsPlacement )
				) {
					throw new PluginError(
						'The "tagsPlacement" property must be a string value and one of the following: top, bottom, left, right.'
					);
				}

				// Build the plugin.
				build.call( this, element );
			} catch ( error ) {
				logError( error );
			}
		}
		/**
		 * Update method to update the plugin values.
		 *
		 * @param {string|HTMLElement} element The selector or element.
		 * @param {Array}              values  The values to set.
		 *
		 * @return {void}
		 */
		update( element, values ) {
			try {
				// Validate the `element` parameter
				if ( ! element ) {
					throw new PluginError( 'The update method requires the "element" parameter.' );
				}

				// Check if the element is a select field.
				if ( ! ( element instanceof HTMLSelectElement ) ) {
					throw new PluginError( 'This plugin can only be used on select fields.' );
				}

				// Validate the `values` parameter.
				if ( ! Array.isArray( values ) ) {
					throw new PluginError( 'The update method requires the "values" parameter to be an array.' );
				}

				const checkboxes = Array.from( element.parentNode.querySelectorAll( 'input[type="checkbox"]' ) );

				// Check if the checkboxes are found.
				if ( checkboxes.length === 0 ) {
					throw new PluginError( 'Could not find the checkboxes associated with the select field.' );
				}

				checkboxes.forEach( ( checkbox ) => {
					// Check/uncheck checkboxes based on provided values
					checkbox.checked = values.includes( checkbox.value );
				} );

				const list = element.parentNode.querySelector( '.wpforms-multiselect-checkbox-list' );

				// Check if the list element is found.
				if ( ! list ) {
					throw new PluginError( 'Could not find the list element associated with the select field.' );
				}

				// Trigger custom event to update selected options.
				list.dispatchEvent( new CustomEvent( 'change', { detail: { isForced: true } } ) );
			} catch ( error ) {
				logError( error );
			}
		}
	}

	/**
	 * Plugin Error Object
	 *
	 * @class PluginError
	 * @augments Error
	 */
	class PluginError extends Error {
		/**
		 * Constructor.
		 *
		 * @param {string} message The error message.
		 *
		 * @return {void}
		 */
		constructor( message ) {
			super( message );

			this.name = pluginName;
		}
	}

	/**
	 * Build the plugin.
	 *
	 * @param {string|HTMLElement} element The selector or element.
	 *
	 * @return {void}
	 */
	function build( element ) {
		// Hide the original select field.
		element.style.display = 'none';

		// Get the plugin settings
		const { showSearch, showTags, showClear, showMask, tagsPlacement, delimiter } = this.settings;

		// Wrap the select field.
		this.wrapper.classList.add( 'wpforms-multiselect-checkbox-dropdown' );
		element.parentNode.insertBefore( this.wrapper, element );
		this.wrapper.appendChild( element );

		// Add a wrapper for the plugin elements.
		this.wrapInner.classList.add( 'wpforms-multiselect-checkbox-wrapper' );
		this.wrapper.appendChild( this.wrapInner );

		// Add a wrapper for the form elements.
		this.formWrapper.classList.add( 'wpforms-multiselect-checkbox-form-outline' );
		this.wrapInner.appendChild( this.formWrapper );

		// Add a mask element.
		if ( showMask ) {
			this.wrapper.classList.add( 'has-mask' );
			this.mask = document.createElement( 'span' );
			this.mask.classList.add( 'wpforms-multiselect-checkbox-input-mask' );
			this.formWrapper.appendChild( this.mask );
		}

		// Store the field placeholder.
		const placeholderText = element.getAttribute( 'placeholder' ) || '';

		Object.assign( this.input, {
			type: 'text',
			name: element.name,
			disabled: element.disabled,
			placeholder: placeholderText,
			className: 'wpforms-multiselect-checkbox-input',
			readOnly: true,
			autocomplete: 'off',
			autocapitalize: 'none',
			spellcheck: false,
			role: 'combobox',
			tabIndex: 0,
			ariaAutoComplete: 'list',
			ariaHasPopup: true,
			ariaExpanded: false,
			ariaMultiSelectable: true,
			ariaReadOnly: true,
			ariaDisabled: element.disabled,
		} );
		this.formWrapper.appendChild( this.input );

		// Remove the name attribute from the original select field.
		element.removeAttribute( 'name' );

		// Add placeholder input.
		const placeholder = document.createElement( 'span' );
		Object.assign( placeholder, {
			className: 'wpforms-multiselect-checkbox-input-placeholder',
			role: 'presentation',
		} );
		placeholder.textContent = placeholderText;
		this.formWrapper.appendChild( placeholder );

		// Add arrow element.
		const arrow = document.createElement( 'span' );
		arrow.setAttribute( 'role', 'presentation' );
		arrow.classList.add( 'wpforms-multiselect-checkbox-arrow' );
		this.formWrapper.appendChild( arrow );

		if ( element.disabled ) {
			this.formWrapper.classList.add( 'disabled' );
			return;
		}

		if ( showClear ) {
			this.wrapper.classList.add( 'has-clear' );
			this.clearButton = document.createElement( 'span' );
			Object.assign( this.clearButton, {
				innerHTML: '&times;',
				className: 'wpforms-multiselect-checkbox-clear',
				role: 'button',
				ariaLabel: Plugin.i18n.clear,
			} );
			this.formWrapper.appendChild( this.clearButton );
		}

		this.list.classList.add( 'wpforms-multiselect-checkbox-list' );
		this.wrapInner.appendChild( this.list );

		if ( showTags ) {
			this.selectedOptionsContainer = document.createElement( 'div' );
			this.selectedOptionsContainer.classList.add( 'wpforms-multiselect-checkbox-selected' );
			this.wrapper.classList.add( `has-tags-${ tagsPlacement }` );
			this.wrapper.appendChild( this.selectedOptionsContainer );
		}

		if ( showSearch ) {
			this.wrapper.classList.add( 'has-search' );
			this.search = document.createElement( 'input' );
			Object.assign( this.search, {
				type: 'search',
				className: 'wpforms-multiselect-checkbox-search',
				placeholder: Plugin.i18n.search,
				ariaLabel: Plugin.i18n.search,
			} );
			this.list.appendChild( this.search );
		}

		const items = document.createElement( 'div' );
		Object.assign( items, {
			role: 'listbox',
			className: 'wpforms-multiselect-checkbox-items',
			ariaLabel: this.input.getAttribute( 'placeholder' ),
			ariaHidden: false,
		} );
		this.list.appendChild( items );

		let lastOptgroup = null;

		const checkboxes = Array.from( element.options ).map( ( option ) => {
			const label = document.createElement( 'label' );
			const text = document.createElement( 'span' );
			const checkbox = document.createElement( 'input' );
			const optgroup = option.parentNode.tagName === 'OPTGROUP' ? option.parentNode.label : null;

			if ( optgroup && optgroup !== lastOptgroup ) {
				const optgroupLabel = document.createElement( 'h3' );
				optgroupLabel.classList.add( 'wpforms-multiselect-checkbox-optgroup' );
				optgroupLabel.textContent = optgroup;
				items.appendChild( optgroupLabel );
				lastOptgroup = optgroup;
			}

			text.textContent = option.textContent;

			label.classList.toggle( 'disabled', option.disabled );
			label.setAttribute( 'role', 'option' );
			items.appendChild( label );

			Object.assign( checkbox, {
				type: 'checkbox',
				disabled: option.disabled,
				value: option.value,
				checked: option.selected,
				ariaDisabled: option.disabled,
			} );

			label.appendChild( checkbox );
			label.appendChild( text );

			return checkbox;
		} );

		// Update the selected options.
		const updateSelectedOptions = () => {
			const selectedOptions = Array.from( checkboxes )
				.filter( ( checkbox ) => checkbox.checked )
				.map( ( checkbox ) => checkbox.value );

			// Update the input value.
			this.input.value = selectedOptions.join( delimiter );
			this.input.setAttribute( 'value', this.input.value );

			if ( showTags ) {
				this.selectedOptionsContainer.textContent = '';

				if ( selectedOptions.length === 0 ) {
					this.input.value = '';
					this.input.removeAttribute( 'value' );

					// Hide the clear button if no options are selected.
					if ( this.clearButton ) {
						this.clearButton.style.visibility = 'hidden';
					}
					return;
				}

				selectedOptions.forEach( ( option ) => {
					const optionSpan = document.createElement( 'span' );
					optionSpan.classList.add( 'wpforms-multiselect-checkbox-selected-option' );
					optionSpan.textContent = option;

					const removeIcon = document.createElement( 'span' );
					removeIcon.dataset.value = option;
					Object.assign( removeIcon, {
						innerHTML: '&times;',
						className: 'wpforms-multiselect-checkbox-remove',
						role: 'button',
						ariaLabel: `Remove ${ option }`,
					} );
					optionSpan.appendChild( removeIcon );
					this.selectedOptionsContainer.appendChild( optionSpan );
				} );
			}

			// Update the mask text.
			if ( showMask ) {
				if ( selectedOptions.length === checkboxes.length && checkboxes.length > 1 ) {
					placeholder.textContent = '';
					this.mask.textContent = this.i18n.all;
				} else if ( selectedOptions.length === 0 || selectedOptions.length === 1 ) {
					this.mask.textContent = getLabelFromOption( selectedOptions[ 0 ] );
					placeholder.textContent = placeholderText;
				} else {
					placeholder.textContent = '';
					this.mask.textContent = this.i18n.multiple.replace( '{count}', selectedOptions.length );
				}
			}

			// Update the clear button visibility.
			if ( this.clearButton ) {
				this.clearButton.style.visibility = selectedOptions.length ? 'visible' : 'hidden';
			}

			const changeEvent = new CustomEvent( 'wpforms_multiselect_checkbox_changed', {
				bubbles: true,
				cancelable: true,
				detail: { selectedOptions },
			} );
			element.dispatchEvent( changeEvent );
		};

		// Get the label from the option value.
		const getLabelFromOption = ( value ) => {
			const option = Array.from( element.options ).find( ( _option ) => _option.value === value );
			return option ? option.textContent.trim() : '';
		};

		// Remove an item from the selected options.
		const removeItem = ( value ) => {
			const checkbox = this.list.querySelector( `input[value="${ value }"]` );

			if ( ! checkbox ) {
				return;
			}

			checkbox.checked = false;
			updateSelectedOptions();

			const removeEvent = new CustomEvent( 'wpforms_multiselect_checkbox_removed', {
				bubbles: true,
				cancelable: true,
				detail: { removedOption: value },
			} );

			element.dispatchEvent( removeEvent );
		};

		// Callback function for the input click event.
		const handleInputClick = ( { target: input } ) => {
			const isOpen = this.list.classList.toggle( 'open' );
			input.setAttribute( 'aria-expanded', isOpen );

			if ( ! isOpen ) {
				maybeFlushSearchInput();
				this.list.classList.remove( 'open-up' );
				return;
			}

			const listRect = this.list.getBoundingClientRect();
			const windowHeight = window.innerHeight || document.documentElement.clientHeight;

			if ( listRect.top + listRect.height > windowHeight ) {
				this.list.classList.add( 'open-up' );
				return;
			}

			this.list.classList.remove( 'open-up' );
		};

		// Callback function for the input focus event to handle spacebar key.
		const handleInputFocus = ( event ) => {
			if ( event.key !== ' ' && event.key !== 'Spacebar' ) {
				return;
			}

			// Prevent the default spacebar behavior (e.g., scrolling the page).
			event.preventDefault();
			handleInputClick( event );
		};

		// Callback function for the list change event.
		const handleCheckboxChange = ( { target, detail } ) => {
			// Check if the target is a checkbox.
			if ( target.tagName !== 'INPUT' && target.type !== 'checkbox' && detail?.isForced !== true ) {
				return;
			}

			updateSelectedOptions();
		};

		// Callback function for the clear button click event.
		const handleClearButtonClick = () => {
			checkboxes.forEach( ( checkbox ) => {
				checkbox.checked = false;
			} );
			updateSelectedOptions();
			handleDocumentClick( {}, true );
		};

		// Callback function for the search input event.
		const handleSearchInput = ( { target: search } ) => {
			const searchValue = search.value.toLowerCase();
			const labels = Array.from( this.list.querySelectorAll( 'label' ) );

			labels.forEach( ( label ) => {
				const text = label.querySelector( 'span' ).textContent.toLowerCase();
				label.style.display = text.includes( searchValue ) || searchValue.length === 0 ? 'inline-flex' : 'none';
			} );
		};

		// Callback function for the remove option click event.
		const handleRemoveOptionClick = ( { target } ) => {
			if ( ! target.classList.contains( 'wpforms-multiselect-checkbox-remove' ) ) {
				return;
			}

			const value = target.dataset.value;
			removeItem( value );
		};

		// Callback function for the document click event.
		const handleDocumentClick = ( { target }, isForced = false ) => {
			if ( this.wrapper.contains( target ) && ! isForced ) {
				return; // Exit early if the target is within the wrapper and forceClose is false.
			}

			maybeFlushSearchInput();
			this.list.classList.remove( 'open', 'open-up' );
			this.input.setAttribute( 'aria-expanded', false );
		};

		// Callback function to flush the search input.
		const maybeFlushSearchInput = () => {
			if ( ! this.search ) {
				return; // Exit early if the search field is not enabled.
			}

			this.search.value = '';
			this.search.dispatchEvent( new Event( 'input' ) );
		};

		// Bind event listeners.
		this.input.addEventListener( 'click', handleInputClick );
		this.input.addEventListener( 'keydown', handleInputFocus );
		this.list.addEventListener( 'change', handleCheckboxChange );
		document.addEventListener( 'click', handleDocumentClick );

		// Bind event listeners for selected options, if enabled.
		if ( this.selectedOptionsContainer ) {
			this.selectedOptionsContainer.addEventListener( 'click', handleRemoveOptionClick );
		}

		// Bind event listeners for clear button, if enabled.
		if ( this.clearButton ) {
			this.clearButton.addEventListener( 'click', handleClearButtonClick );
		}

		// Bind event listeners for search field, if enabled.
		if ( this.search ) {
			this.search.addEventListener( 'input', debounce( handleSearchInput, 300 ) );
		}

		updateSelectedOptions();
	}

	/**
	 * Debounce function to limit the number of times a function is called.
	 *
	 * @param {Function} func  The function to be called.
	 * @param {number}   delay The delay in milliseconds.
	 *
	 * @return {Function} The debounced function.
	 */
	function debounce( func, delay ) {
		let timeoutId;

		return function ( ...args ) {
			clearTimeout( timeoutId );

			timeoutId = setTimeout( () => {
				func.apply( this, args );
			}, delay );
		};
	}

	/**
	 * Log the error message.
	 * This function can be replaced with a custom error logging logic.
	 *
	 * @param {string} error The error message.
	 *
	 * @return {void}
	 */
	function logError( error ) {
		// Custom error logging logic
		// Display the error message in a specific format or send it to a logging service
		// eslint-disable-next-line no-console
		console.error( error );
	}

	return Plugin;
} );
