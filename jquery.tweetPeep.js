( function( $ ) {
	jQuery.fn.tweetPeep = function( options ) {
		// Define defaults and override with options, if available by extending the default settings
	  var settings = jQuery.extend( {
			type: $.tweetPeep.search,
			search: "TweetPeep",
			numToFetch: ( Math.ceil( $( this ).width() / 48 ) * Math.ceil( $( this ).height() / 48 ) ),
			toolTips: true,
			animate: false
	  }, options );
	  
	  return this.each( function() {
	  	// Change the styles on the element we are about to use
	  	$( this ).css( 'overflow', 'hidden' );
	  	// Assign element to append to into a var as this does not work inside the each (wrong this)
	  	var toAppendTo = this;
	  	var pagesToFetch = Math.ceil( settings.numToFetch / 100 );
	  	for ( var currentPage = 1; currentPage <= pagesToFetch; currentPage++ ) {
		    var perPageNumToFetch = 100;
		    if ( currentPage == pagesToFetch ) {
		    	perPageNumToFetch = settings.numToFetch % 100;
		    	// Fix big with there being a number divisable by 100 like 300 and last page fetch was trying to get 0 items instead of 100
		    	if ( perPageNumToFetch == 0 ) {
		    		perPageNumToFetch = 100;
		    	}
		    }
				// Build url to query twitter API
		    if ( settings.type == $.tweetPeep.friends ) {
		    	var twitterUrl = 'http://twitter.com/statuses/friends.json' + '?screen_name=' + settings.search + '&page=' + currentPage + '&callback=?';
		    } else {
		    	var twitterUrl = 'http://search.twitter.com/search.json' + '?q=' + settings.search + '&rpp=' + perPageNumToFetch + '&page=' + currentPage + '&callback=?';
		    }
		    // Do JSON call to fetch data
		  	$.getJSON( twitterUrl, function( data ) {
		    	$.each( ( data.results ? data.results : data ), function( resultIndex, result ) {
						// Create a new div for out element
						var newImg = $( '<img>' );
						$( newImg ).addClass( 'twitterImg' ).attr( 'src', result.profile_image_url ).attr( 'alt', ( result.from_user ? result.from_user : result.screen_name ) ).css( {
							'float': 'left',
							'height': '48px',
							'width': '48px'
						} ).appendTo( toAppendTo );
						// Add toolTips
						if ( settings.toolTips ) {
							$( newImg ).attr( 'title', ( result.text ? result.text : result.status.text ) );
						}
					} );
				} );
	  	}
			if ( settings.animate ) {
				// Set the width and height on the element to save calculating each time
				$( toAppendTo ).data( 'elmWidth', Math.ceil( $( toAppendTo ).width() / 48 ) ).data( 'elmHeight', Math.ceil( $( toAppendTo ).height() / 48 ) );
				// If animation turned on call animate function
				setTimeout( function () { $.tweetPeep.animate( toAppendTo ); }, $.tweetPeep.animateSpeed );
				
			}
		} );
	};
	// Public static methods and variables
	jQuery.tweetPeep = {
		search: 'search',
		friends: 'friends',
		animate: function( tweetPeepElm ) {
			// Loop round each row
			for ( var currentRow = 0; currentRow < $( tweetPeepElm ).data( 'elmHeight' ); currentRow++ ) {
				// Move the last element of the row to the start
				var elmToMove = $( 'img:eq(' + ( ( $( tweetPeepElm ).data( 'elmWidth' ) * ( currentRow + 1 ) ) - 1 ) + ')', tweetPeepElm ).remove().clone();
				$( 'img:eq(' + $( tweetPeepElm ).data( 'elmWidth' ) * currentRow + ')', tweetPeepElm ).before( elmToMove );
			}
			// Call timeout on this function for next animate
			setTimeout( function () { $.tweetPeep.animate( tweetPeepElm ); }, $.tweetPeep.animateSpeed );
		},
		animateSpeed: 3000
	};
} )( jQuery );
