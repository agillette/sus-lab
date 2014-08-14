// To keep our code clean and modular, all custom functionality will be contained inside a single object literal called "dropdownFilter".

var dropdownFilter = {
  
  // Declare any variables we will need as properties of the object
  
  $filters: null,
  $reset: null,
  groups: [],
  outputArray: [],
  outputString: '',
  
  // The "init" method will run on document ready and cache any jQuery objects we will need.
  
  init: function(){
    var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "dropdownFilter" object so that we can share methods and properties between all parts of the object.
    
    self.$filters = $('#team-filters');
    self.$reset = $('#team-reset');
    self.$container = $('#team-container');
    
    self.$filters.find('fieldset').each(function(){
      self.groups.push({
        $dropdown: $(this).find('select'),
        active: ''
      });
    });
    
    self.bindHandlers();
  },
  
  // The "bindHandlers" method will listen for whenever a select is changed. 
  
  bindHandlers: function(){
    var self = this;
    
    // Handle select change
    
    self.$filters.on('change', 'select', function(e){
      e.preventDefault();
      
      self.parseFilters();
    });
    
    // Handle reset click
    
    self.$reset.on('click', function(e){
      e.preventDefault();
      
      self.$filters.find('select').val('');
      
      self.parseFilters();
    });
  },
  
  // The parseFilters method pulls the value of each active select option
  
  parseFilters: function(){
    var self = this;
 
    // loop through each filter group and grap the value from each one.
    
    for(var i = 0, group; group = self.groups[i]; i++){
      group.active = group.$dropdown.val();
    }
    
    self.concatenate();
  },
  
  // The "concatenate" method will crawl through each group, concatenating filters as desired:
  
  concatenate: function(){
    var self = this;
    
    self.outputString = ''; // Reset output string
    
    for(var i = 0, group; group = self.groups[i]; i++){
      self.outputString += group.active;
    }
    
    // If the output string is empty, show all rather than none:
    
    !self.outputString.length && (self.outputString = 'all'); 
    
    //console.log(self.outputString); 
    
    // ^ we can check the console here to take a look at the filter string that is produced
    
    // Send the output string to MixItUp via the 'filter' method:
    
	  if(self.$container.mixItUp('isLoaded')){
    	self.$container.mixItUp('filter', self.outputString);
	  }
  }
};
  
// On document ready, initialise our code.

$(function(){
   $('.active-tab').slideDown();
  // Initialize dropdownFilter code
      
  dropdownFilter.init();
      
  // Instantiate MixItUp
      
  $('#team-container').mixItUp({
    controls: {
      enable: false // we won't be needing these
    },
    callbacks: {
      onMixFail: function(){
        alert('No items were found matching the selected filters.');
      },
			onMixEnd: function(state){
				$('.last-item').removeClass('last-item');
				console.log(state);
				$(state.activeFilter+':nth-child(4n)').addClass('last-item');
			}
    },
		load: {
			filter: '.tsl,.wa,.gsf,.sp'
		}
  });
	$('.team-link').click(function(e){
		e.preventDefault();
		var content = $(this).parents('.container').next('.description').html();
		console.log(content);
		$('.overlay').height( $('html').height() );
		$('.modal').html(content);
		$('.overlay').fadeIn();
		var mHeight = $('.modal').height();
		var wHeight = $(window).height();
		$('.close-modal').animate({ top: $(window).scrollTop()+20 }, 400);
		$('.modal').animate({ top: $(window).scrollTop()+75 }, 400);
		$('.overlay, .close-modal').click(function(e){
			e.preventDefault();
			$('.modal').animate({ top: '100%' }, 400);
			$('.overlay').fadeOut();
		});
	});
	// $('.team-link').click(function(e){
		// e.preventDefault();
		// var clicked = $(this);
		// $('.mix').attr('data-order', '1');
		// $('.team-link').show();
		// $('.description').hide();
		// $('.open').animate({ width: '25%'}, 100, function(){
			// $('.open').removeClass('open');
			// clicked.parents('.mix').attr('data-order', '0');
			// $('#team-container').mixItUp('sort', 'order:asc', function(){
				// clicked.parents('.one-quarter').addClass('open');
				// $('.open').animate({ width: '100%' }, 300, function(){
					// $('.open .description').slideDown();
				// });
				// clicked.hide();
			// });
		// });
	// });
	$('.tab-link').click(function(e){
		e.preventDefault();
		$('.current-tab').removeClass('current-tab');
		$(this).addClass('current-tab');
		var target = $(this).attr('href');
		$('.active-tab').slideUp();
		$(target).slideDown();
		$('.active-tab').removeClass('active-tab');
		$(target).addClass('active-tab');
	});
	$('.team-link').hover(function(){
		$(this).siblings('img').addClass('active');
	}, function(){
		$(this).siblings('img').removeClass('active');
	});
});