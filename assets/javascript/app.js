// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCqWFihOF-wM6zOXHFHOqN6uWqOGAIiH0Y",
    authDomain: "train-schedule-dcf8a.firebaseapp.com",
    databaseURL: "https://train-schedule-dcf8a.firebaseio.com",
    projectId: "train-schedule-dcf8a",
    storageBucket: "train-schedule-dcf8a.appspot.com",
    messagingSenderId: "70045426233"
  };
  firebase.initializeApp(config);

// Variable to reference the database.
var database = firebase.database();


// When Submit Button is Clicked
$(('#submit-button')).on('click', function (event){

    // Prevent the page from refreshing
    event.preventDefault();

    // Stores Inputs as Variables
    var trainName= $("#train-name").val().trim();
    // console.log('Train Name:', trainName);
    var destination = $("#destination").val().trim();
    // console.log('Destination:', destination);
    var firstTrain = $("#first-train").val().trim();
    // console.log('First Train:', firstTrain)
    var frequency = $("#frequency").val().trim();
    // console.log('Frequency', frequency)
   
    // Prevents Submit If Fields Are Empty
    if (trainName==="" || destination ==="" || frequency ==="") {
        alert('Error! Please Enter All Info.')
    
    // Otherwise
    } else {

        // Save Variables to Firebase Database
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
        });

        // Clear Input Boxes
        $('#train-name').val('');
        $('#destination').val('');
        $('#first-train').val('');
        $('#frequency').val('');
        }
});



// When Information is Added to Firebase Database 
database.ref().on('child_added', function(childSnapshot){

    // Log everything that's coming out of snapshot
    // console.log('Key:', childSnapshot.key)
    // console.log('Train Name:', childSnapshot.val().trainName);
    // console.log('Destination:', childSnapshot.val().destination);
    // console.log('First Train:', childSnapshot.val().firstTrain);
    // console.log('Frequency:', childSnapshot.val().frequency);

    // Store everything into a variable
    var trainKey = childSnapshot.key;
    var trainNameChild = childSnapshot.val().trainName;
    var destinationChild = childSnapshot.val().destination;
    var firstTrainChild = childSnapshot.val().firstTrain;
    var frequencyChild = parseInt(childSnapshot.val().frequency);

    // Saves firstTrain Variable as Moment with Formatting
    var firstTrainMoment = moment(firstTrainChild, 'HH:mm A').format('hh:mm A');

    // Adds Frequency Minutes to Calculate Next Arrival
    var nextArrival = moment(firstTrainMoment, 'hh:mm A').add(frequencyChild, 'm').format('hh:mm A');
    // console.log('Next Arrival:', nextArrival);
    
    // Difference Between Present Moment and Next Arrival in Minutes
    var minutesAway = moment(nextArrival,'hh:mm A').diff(moment(), 'minutes');
   
    // If minutesAway are < 0, Add 1440 Minutes (24 hours)
    if (minutesAway < 0) {
        minutesAway += 1440;
        // console.log('Minutes Away:', minutesAway);
    } else {
        // console.log('Minutes Away:', minutesAway);
    }
 
    // Write Train Information from Firebase to HTML
    $(".train-info").append('<div class="row" id="' + childSnapshot.key +'">' +
    '<div class="train-name col m2 " contenteditable="true">' + childSnapshot.val().trainName + '</div>' +
    '<div class="destination col m2" contenteditable="true">' + childSnapshot.val().destination + '</div>' +
    '<div class="frequency col m2">' + childSnapshot.val().frequency + '</div>' +
    '<div class="next-arrival col m2 " contenteditable="true">' + nextArrival + '</div>' +
    '<div class="minutes-away col m2 ">' + minutesAway + '</div>' 
    + '<div class="col m2 button-column"><a class="update waves-effect waves-light btn">Update</a><a class="remove waves-effect waves-light btn">Remove</a></div></div>');
    
    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});



// When Update is Clicked
$(document).on('click', '.update', function(update){
    var row = $(this).closest('.row');
    var rowId = row.attr('id');
    // console.log('rowId:', rowId);
    
    // Save New Text as Variables
    var trainName = $('#'+rowId+' .train-name').text();
    // console.log('Update:', trainName);
    var destination = $('#'+rowId+' .destination').text();
    // console.log('Update:', destination);
    var nextTrain = $('#'+rowId+' .next-arrival').text();
    // console.log('Update:', nextTrain);
    var frequency = $('#'+rowId+' .frequency').text();
    // console.log('Update:', frequency);

    // Overwrite Firebase with Changed Variables
    database.ref().child(rowId).set({ 
        trainName: trainName,
        destination: destination,
        firstTrain: nextTrain,
        frequency: frequency,
    });

    // Saves nextTrain Variable as Moment with Formatting
    var nextTrainMoment = moment(nextTrain, 'HH:mm A');
    
    // Adds Frequency Minutes to Calculate Next Arrival
    var nextArrival = moment(nextTrainMoment).add(frequency, 'm').format('hh:mm A');
    // console.log('Next Arrival:', nextArrival);

    // Difference Between Present Moment and Next Arrival in Minutes
    var minutesAway = moment(nextArrival,'hh:mm A').diff(moment(), 'minutes');
   
    // If minutesAway are < 0, Add 1440 Minutes (24 hours)
    if (minutesAway < 0) {
        minutesAway += 1440;
        // console.log('Minutes Away:', minutesAway);
    } else {
        // console.log('Minutes Away:', minutesAway);
    };

    // Update Minutes Away in HTML
    $('#'+rowId+' .minutes-away').text(minutesAway);
    // console.log('Update:', minutesAway);
});



// When Remove Button is Clicked
$(document).on('click','.remove', function(remove){
    var row = $(this).closest('.row');
    var rowId = row.attr('id');
    // console.log('rowId:', rowId);

    // Deletes Row from HTML
    row.remove();

    // Data from Firebase
    database.ref().child(rowId).remove();  
});