// ==UserScript==
// @name         WordPress.org Predefined Replies
// @namespace    https://wordpress.org/
// @version      0.2.1
// @description  Add saved replies to topic reply forms.
// @author       Scott Kingsley Clark, Clorith
// @match        https://wordpress.org/support/topic/*
// @match        https://*.wordpress.org/support/topic/*
// @updateURL    https://github.com/wporg-support/predefined-replies/raw/main/src/wordpress-predefined-replies.user.js
// @downloadURL  https://github.com/wporg-support/predefined-replies/raw/main/src/wordpress-predefined-replies.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

'use strict';

let postFormArea = document.getElementById( 'new-post' ),
	firstTimeSetupComplete = false,
	postContentArea;

// If no post-form exists, stop this script.
if ( postFormArea.length < 1 ) {
	return;
}

/**
 * Get the locale-suffix for various identifiers.
 *
 * @return string The locale identifier, or an empty string for the default locale.
 */
const getLocaleSuffix = () => {
	 let subdomain = window.location.hostname.split( '.' )[0],
		 lang = '';

	// If the `subdomain` is declared as `wordpress`, then no subdomain exists, and the default language is used.
	if ( subdomain !== 'wordpress' ) {
		lang = '_' + subdomain;
	}

	return lang;
}

const preDefinedArea = () => {
	let wrapper = document.createElement( 'div' ),
		select = selectDropdownMarkup(),
		inserter = document.createElement( 'button' ),
		remover = document.createElement( 'button' );

	wrapper.style = 'display: grid; grid-template-columns: auto auto auto; width: 100%;';

	inserter.type = 'button';
	inserter.id = 'predefined-inserter';
	inserter.className = 'button';
	inserter.prepend( document.createTextNode( '➕ Insert' ) );

	remover.type = 'button';
	remover.id = 'predefined-remover';
	remover.className = 'button';
	remover.disabled = true;
	remover.prepend( document.createTextNode( '➖ Remove' ) );

	inserter.addEventListener( 'click', () => {
		const predefSelector = document.getElementById( 'predefined-selector' ),
			  editorContent = document.getElementById( 'bbp_reply_content' );

		editorContent.value = editorContent.value + predefSelector.value;
	} );
	remover.addEventListener( 'click', () => {
		const selector = document.getElementById( 'predefined-selector' );
		const option = selector.options[ selector.selectedIndex ];
		const remover = document.getElementById( 'predefined-remover' );

		let localPredefs = GM_getValue( 'predefined-replies-local' + getLocaleSuffix(), {} );

		delete localPredefs[ option.getAttribute( 'data-ref-key' ) ];

		GM_setValue( 'predefined-replies-local' + getLocaleSuffix(), localPredefs );

		remover.setAttribute( 'disabled', true );

		buildDropdownContent();
	} );

	wrapper.append( select );
	wrapper.append( inserter );
	wrapper.append( remover );

	return wrapper;
}

const afterEditorAlternatives = () => {
	let wrapper = document.createElement( 'div' ),
		adderLabel = document.createElement( 'input' ),
		adder = document.createElement( 'button' ),
		fetcher = document.createElement( 'button' );

	wrapper.style = 'display: grid; grid-template-columns: auto auto auto; width: 100%;';

	adderLabel.type = 'text';
	adderLabel.id = 'predef-adder-label';
	adderLabel.placeholder = 'Label new predefined reply';

	adder.type = 'button';
	adder.id = 'predefined-adder';
	adder.className = 'button';
	adder.disabled = true;
	adder.prepend( document.createTextNode( '💾 Save reply' ) );

	fetcher.type = 'button';
	fetcher.id = 'predefined-fetcher';
	fetcher.className = 'button';
	fetcher.prepend( document.createTextNode( '⏬ Get curated replies' ) );

	adderLabel.addEventListener( 'keyup', ( event ) => {
		const adderButton = document.getElementById( 'predefined-adder' ),
			  input = event.target;

		if ( '' === input.value ) {
			adderButton.setAttribute( 'disabled', 'true' );
		} else {
			adderButton.removeAttribute( 'disabled' );
		}
	} );

	adder.addEventListener( 'click', () => {
		const label = document.getElementById( 'predef-adder-label' ).value,
			  editorContent = document.getElementById( 'bbp_reply_content' ).value;

		let localPredefs = GM_getValue( 'predefined-replies-local' + getLocaleSuffix(), {} ),
			newEntry = {};

		newEntry.label = label;
		newEntry.content = editorContent;

		localPredefs[ Date.now() ] = newEntry;

		GM_setValue( 'predefined-replies-local' + getLocaleSuffix(), localPredefs );

		buildDropdownContent();
	} );

	fetcher.addEventListener( 'click', () => {
		const replyBaseUrl = 'https://raw.githubusercontent.com/wporg-support/predefined-replies/main/src/replies/',
		  requester = new XMLHttpRequest();

		let subdomain = window.location.hostname.split( '.' )[0],
			lang = 'en';

		// If the `subdomain` is declared as `wordpress`, then no subdomain exists, and the default language is used.
		if ( subdomain !== 'wordpress' ) {
			lang = subdomain;
		}

		requester.onreadystatechange = () => {
			let data;

			if ( 4 === requester.readyState ) {
				if ( 200 === requester.status ) {
					data = requester.responseText;

					GM_setValue( 'predefined-replies-external' + getLocaleSuffix(), JSON.parse( data ) );

					buildDropdownContent();
				}

				// A 404 error indicates the given language does not exist, fallback to default language instead.
				if ( 404 === requester.status ) {
					lang = 'en';

					requester.open( 'GET', replyBaseUrl + lang + '.json?' + Date.now() );
					requester.send();
				}
			}
		}

		requester.open( 'GET', replyBaseUrl + lang + '.json?' + Date.now() );
		requester.send();
	} );

	wrapper.append( adderLabel );
	wrapper.append( adder );
	wrapper.append( fetcher );

	return wrapper;
}

const selectDropdownMarkup = () => {
	let dropdown = document.createElement( 'select' );

	dropdown.id = 'predefined-selector';

	return dropdown;
}

const createOption = ( optionLabel, optionValue, optionAttributes = {} ) => {
	let option = document.createElement( 'option' ),
		label = document.createTextNode( optionLabel );

	option.value = optionValue;
	option.prepend( label );

	for ( const [ key, value ] of Object.entries( optionAttributes ) ) {
		option.setAttribute( key, value );
	}

	return option;
}

const buildDropdownContent = () => {
	const dropdown = document.getElementById( 'predefined-selector' ),
		  externalPredefs = GM_getValue( 'predefined-replies-external' + getLocaleSuffix(), {} ),
		  localPredefs = GM_getValue( 'predefined-replies-local' + getLocaleSuffix(), {} );

	// Reset/clear the select box content.
	dropdown.innerHTML = '';

	// Add the default empty entry indicating what this select box is.
	dropdown.add( createOption( '-- Select a pre-defined response --', '' ) );

	// Add curated pre-defs.
	if ( Object.keys( externalPredefs ).length >= 1 ) {
		// Create an option group.
		let group = document.createElement( 'optgroup' );

		group.label = 'Curated pre-defined replies';

		// Loop over all curated pre-defined replies, and add them as alternatives.
		for ( const predefID in externalPredefs ) {
			group.append( createOption( externalPredefs[ predefID ].label, externalPredefs[ predefID ].content ) );
		}

		dropdown.add( group );
	}

	// Add custom pre-defs.
	if ( Object.keys( localPredefs ).length >= 1 ) {
		// Create an option group.
		let group = document.createElement( 'optgroup' );

		group.label = 'Custom pre-defined replies';

		// Loop over all custom pre-defined replies, and add them as alterantives.
		for ( const predefID in localPredefs ) {
			group.append( createOption( localPredefs[ predefID ].label, localPredefs[ predefID ].content, { 'data-removable': true, 'data-ref-key': predefID } ) );
		}

		dropdown.add( group );
	}

	if ( ! firstTimeSetupComplete ) {
		dropdown.addEventListener( 'change', ( event ) => {
			const selector = event.target;
			const option = selector.options[ selector.selectedIndex ];

			const remover = document.getElementById( 'predefined-remover' );

			if ( option.hasAttribute( 'data-removable' ) ) {
				remover.removeAttribute( 'disabled' );
			} else {
				remover.setAttribute( 'disabled', true );
			}
		} );
	}
}

// Create the pre-defined replies selector areas.
postContentArea = postFormArea.getElementsByClassName( 'bbp-the-content-wrapper' )[0];
postContentArea.prepend( preDefinedArea() );
postContentArea.append( afterEditorAlternatives() );

buildDropdownContent();

firstTimeSetupComplete = true;
