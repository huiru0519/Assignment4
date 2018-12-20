// Initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoiaHVpcnUwNTE5IiwiYSI6ImNqY3Y0c21pbTAwcGcyd3QzMnBnaTEwOTYifQ.lLOU5KBQL4PyOt1wpeDfwQ'; // replace this value with your own access token from Mapbox Studio

var map = new mapboxgl.Map({
	container: 'map', // this is the ID of the div in index.html where the map should go
    center: [-78.484147,38.036505], // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
    zoom: 12.8, // set the default zoom programatically
	style: 'mapbox://styles/huiru0519/cjpu4kqn400ob2sqkr86s2yrl', // replace this value with the style URL from Mapbox Studio
	customAttribution: 'City of Charlottesville Open Data Portal (http://opendata.charlottesville.org/)' // Custom text used to attribute data source(s)
});

// Show modal when About button is clicked
$("#about").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
    $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
    $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
});

$(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});


// Legend
var layers = [ // an array of the possible values you want to show in your legend
    'City Park',
    'Wetland',
    'Storm Management',
    'Solar Energy System',
    'Material Waste Management',
    'City Market'
];

var colors = [ // an array of the color values for each legend item
    '#c6df9a',
    '#7d974e',
    '#9dc559',
    '#3090a1',
    '#527415',
    '#283a08'
];

// for loop to create individual legend items
for (i=0; i<layers.length; i++) {
    var layer =layers[i]; // name of the current legend item, from the layers array
    var color =colors[i]; // color value of the current legend item, from the colors array 
    
    var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; // create the HTML for the legend element to be added
    var item = $(itemHTML).appendTo("#legend"); // add the legend item to the legend
    var legendKey = $(item).find(".legend-key"); // find the legend key (colored circle) for the current item
    legendKey.css("background", color); // change the background color of the legend key
}

// 10.25 starts here----------------------------------------------
// 

// POPUPS CODE

    // Create a popup on click 
    map.on('click', function(e) { // Event listener to do some code when user clicks on the map
      

      var stops = map.queryRenderedFeatures(e.point, { // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['park', 'solar', 'green-material', 'green-city-market', 'green-stormuva'] // replace this with the name of the layer // ADD ADDIRIONAL LAYER NAMES HERE
      });


      // if the layer is empty, this if statement will return NULL, exiting the function (no popups created) -- this is a failsafe to avoid endless loops
      if (stops.length == 0) {
        return;
      }

      // Sets the current feature equal to the clicked-on feature using array notation, in which the first item in the array is selected using arrayName[0]. The event listener above ("var stops = map...") returns an array of clicked-on bus stops, and even though the array might only have one item, we need to isolate it by using array notation as follows below.
      var stop = stops[0];
      
      // Initiate the popup
      var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -10] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
      });

      // Set the popup location based on each feature
      popup.setLngLat(e.lngLat);

      // Set the contents of the popup window
      var popupTitle; 
      var popupBody;
      var popupBody1;

      if (stop.layer.id == "park") {
        popupTitle = stop.properties.PARKNAME;
        popupBody1 = stop.properties.PARK_TYPE;
        popupBody = '<img class="park-image" src="img/' + stop.properties.PARKNAME + '.jpg">';
      }
        else if (stop.layer.id == 'solar') {
        popupTitle = stop.properties.Descriptio;
        popupBody1 = stop.properties.Installati;
        popupBody = stop.properties.Theme;
      }
        else if (stop.layer.id == 'green-stormuva') {
        popupTitle = stop.properties.Webmap;
        popupBody1 = stop.properties.Address;
        popupBody = stop.properties.Descriptio;
      } else if (stop.layer.id == 'green-material', 'green-city-market') {
        popupTitle = stop.properties.Theme;
        popupBody1 = stop.properties.Address;
        popupBody = stop.properties.Descriptio;
      }

      popup.setHTML('<h3>' + popupTitle   // 'stop_id' field of the dataset will become the title of the popup
                           + '</h3><p>' + popupBody1 + '</p><p>' + popupBody // 'stop_name' field of the dataset will become the body of the popup
                           + '</p>'); // CHANGE stop.properties.XXXX where X is a field from layer's attribute table

      // Add the popup to the map
      popup.addTo(map);  // replace "map" with the name of the variable in line 28, if different
    });


// SHOW/HIDE LAYERS
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['park', 'City parks'],     
        ['wetland', 'Wetland'],
        ['green-stormuva', 'Storm Management'],     
        ['solar', 'Soalr Energy System'],
        ['green-material', 'Material Waste Management'],
        ['green-city-market', 'City Market'],
    ]; 

    map.on('load', function () {
        
        for (i=0; i<layers.length; i++) {

            $("#layers-control").append("<a href='#' class='active' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>");

        }

        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;
                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                }
        });
    });


/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// Timeline labels using d3

    var width = 500;
    var height = 20;
    var marginLeft = 10;
    var marginRight = 10;

    var data = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 112];
    
    // Append SVG 
    var svg = d3.select("#timeline-labels")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Create scale
    var scale = d3.scaleLinear()
                  .domain([d3.min(data), d3.max(data)])
                  .range([marginLeft, width-marginRight]); 

    // Add scales to axis
    var x_axis = d3.axisBottom()
                   .scale(scale)

    //Append group and insert axis
    svg.append("g")
       .call(x_axis);

// Timeline map filter (timeline of building permit issue dates)
    
    // Create array of  dates from Mapbox layer (in this case, Charlottesville Building Permit application dates)
    map.on('load', function () {

        // Get all data from a layer using queryRenderedFeatures
        var permits = map.queryRenderedFeatures(null, { // when you send "null" as the first argument, queryRenderedFeatures will return ALL of the features in the specified layers
            layers: ["solar"]
        });

        var permitCapArray = [];

        // push the values for a certain property to the variable declared above (e.g. push the permit dates to a permit date array)
        for (i=0; i<permits.length; i++) {
            var permitCap = permits[i].properties.capp;
            
            permitCapArray.push(permitCap);    // Replace "AppliedDat" with the field you want to use for the timeline slider
        }

        // Create event listener for when the slider with id="timeslider" is moved
        $("#timeslider").change(function(e) {
            var capability = this.value; 
            var indices = [];

            // Find the indices in the permitDatesArray array where the year from the time slider matches the year of the permit application
            var matches = permitCapArray.filter(function(item, i){
                if (item.indexOf(capability) >= 10) {
                    indices.push(i);
                }
            });

            // create filter 
            var newFilters = ["any"];
            
            for (i=0; i<indices.length; i++) {
                var filter = ["==","capp", permitCapArray[indices[i]]];
                newFilters.push(filter);
            }

            map.setFilter("solar", newFilters);
        });

    });
