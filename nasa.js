// get current date for input into API url
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

// create url for api
let nasa_search_url = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + yyyy + "-" + mm + "-" + dd + "&api_key=Acax4ULgKWEsWzgkIxGWrG1PJUdVcQ2HDD7BjVS4"

// pull value from slider, dynamically update the caption with correct value
var slider = document.getElementById("range");
var output = document.getElementById("speed_value");
output.innerHTML = slider.value;

// get data, parse, select, and update on page
var getNEOs = function() {
  jQuery.ajax({
    method: "GET",
    url: nasa_search_url,
    dataType: 'json', 

    success: function(data, status, jqXHR) {
        
      // remove all previous rows from table body
      $("#table_body tr").remove();
      // check for minimum speed and hazardous checkbox value
      NEO_count_element = $('#neocount')
      min_speed_element = $('#speed');
      check_val = $("#checkbox").is(':checked');

      // declare vars for loop
      var array;
      var object;
      // set object count 
      var obj_count = 0;

      for (array in data.near_earth_objects) {
        // the array is a date, must be turned into string to use in path
        array_string = String(array)

        for(object in data.near_earth_objects[array_string]) {
            // same thing--object is a number
            object_string = String(object)
            // set vars needed in table
            var hazardous = data.near_earth_objects[array_string][object_string].is_potentially_hazardous_asteroid
            var speed = Math.floor(data.near_earth_objects[array_string][object_string].close_approach_data["0"].relative_velocity.miles_per_hour)
            var approach = array_string
            var max_diam = Math.floor(data.near_earth_objects[array_string][object_string].estimated_diameter.feet.estimated_diameter_max)
            // check to see if hazardous box is checked
            // if so, pull out correct elements and append to table
            // update the object count 
            if(check_val) {
                if(hazardous == true && Number(speed) >= Number(slider.value)) {
                    var markup = "<tr><td>" + approach + "</td><td>" + hazardous + "</td><td>" + speed + "</td><td>" + max_diam + "</td></tr>"
                    $('#table > tbody:last-child').append(markup)
                    obj_count += 1
                }
            } 
            // if box is not checked, pull correct elements and repeat process
            // also highlight hazardous elements
            else {
                if(Number(speed) >= Number(slider.value)) {
                    if(hazardous == true) {
                        var markup = "<tr><td class='highlight'>" + approach + "</td><td class='highlight'>" + hazardous + "</td><td class='highlight'>" + speed + "</td><td class='highlight'>" + max_diam + "</td></tr>"
                        $('#table > tbody:last-child').append(markup)
                        obj_count += 1  
                    }
                    else {
                        var markup = "<tr><td>" + approach + "</td><td>" + hazardous + "</td><td>" + speed + "</td><td>" + max_diam + "</td></tr>"
                        $('#table > tbody:last-child').append(markup)
                        obj_count += 1
                    }
                }
            }
        }    
    }
    // update found object count at top of page
    NEO_count_element.html(obj_count)
    },
    error: function(xhr, textStatus, errorObj) {
      window.alert("Yikes!");
    }
  });
}

// perform function when page loads, slider is changed, or checkbox is (un)checked
$(document).ready (getNEOs())

slider.oninput = function() {
  output.innerHTML = this.value;
  getNEOs();
}

$(':checkbox').change(function() {
    getNEOs();
});

window.speak = function() { 
  console.log("I would like another apple!"); 
};



