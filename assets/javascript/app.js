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
// Create a variable to reference the database.
var database = firebase.database();
var rootRef = firebase.database().ref().child("trains");



$(('#submit-button')).on('click', function (event){
    // Get a key for a new Post.

    // Prevent the page from refreshing
    event.preventDefault();

    // Get inputs-

    var trainName= $("#train-name").val().trim();
    console.log('Train Name:', trainName);
    var destination = $("#destination").val().trim();
    console.log('Destination:', destination);
    var firstTrain = $("#first-train").val().trim();
    console.log('First Train:', firstTrain)
    var frequency = $("#frequency").val().trim();
    console.log('Frequency', frequency)
   
    
    // Change what is saved in firebase
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
});

$(document).on('click','.remove', function(remove){
    var row = $(this).closest('.row');
    var rowId = row.attr('id');
    console.log('rowId:', rowId);
    database.ref().child(rowId).remove();
    $(this).closest('.row').remove();
});

$(document).on('click', '.update', function(update){
    var row = $(this).closest('.row');
    var rowId = row.attr('id');
    console.log('rowId:', rowId);
    
    
    var trainName = $('#'+rowId+' .train-name').text();
    console.log('Update:', trainName);
    var destination = $('#'+rowId+' .destination').text();
    console.log('Update:', destination);
    var nextTrain = $('#'+rowId+' .next-arrival').text();
    console.log('Update:', nextTrain);
    var frequency = $('#'+rowId+' .frequency').text();
    console.log('Update:', frequency);

    database.ref().child(rowId).set({ 
        trainName: trainName,
        destination: destination,
        firstTrain: nextTrain,
        frequency: frequency,
    });

    var nextTrainMoment = moment(nextTrain, 'HH:mm A');
    

    var nextArrival = moment(nextTrainMoment).add(frequency, 'm').format('hh:mm A');
    console.log('Next Arrival:', nextArrival);

    var minutesAway = moment(nextArrival,'hh:mm A').diff(moment(), 'minutes');
   

    if (minutesAway < 0) {
        minutesAway += 1440;
        console.log('Minutes Away:', minutesAway);
    } else {
        console.log('Minutes Away:', minutesAway);
    }

    $('#'+rowId+' .minutes-away').text(minutesAway);
    console.log('Update:', minutesAway);
 

})
database.ref().on('child_added', function(childSnapshot){
    // Log everything that's coming out of snapshot
    console.log('Key:', childSnapshot.key)
    console.log('Train Name:', childSnapshot.val().trainName);
    console.log('Destination:', childSnapshot.val().destination);
    console.log('First Train:', childSnapshot.val().firstTrain);
    console.log('Frequency:', childSnapshot.val().frequency);

    // Store everything into a variable.
    var trainKey = childSnapshot.key;
    var trainNameChild = childSnapshot.val().trainName;
    var destinationChild = childSnapshot.val().destination;
    var firstTrainChild = childSnapshot.val().firstTrain;
    var frequencyChild = parseInt(childSnapshot.val().frequency);

    var firstTrainMoment = moment(firstTrainChild, 'HH:mm A').format('hh:mm A');



    var nextArrival = moment(firstTrainMoment, 'hh:mm A').add(frequencyChild, 'm').format('hh:mm A');
    console.log('Next Arrival:', nextArrival);
    
    var minutesAway = moment(nextArrival,'hh:mm A').diff(moment(), 'minutes');
   

    if (minutesAway < 0) {
        minutesAway += 1440;
        console.log('Minutes Away:', minutesAway);
    } else {
        console.log('Minutes Away:', minutesAway);
    }
 

    $(".table-item").append('<div class="row" id="' + childSnapshot.key +'">' +
    '<div class="train-name col-md-2 " contenteditable="true">' + childSnapshot.val().trainName + '</div>' +
    '<div class="destination col-md-2" contenteditable="true">' + childSnapshot.val().destination + '</div>' +
    '<div class="frequency col-md-2 ">' + childSnapshot.val().frequency + '</div>' +
    '<div class="next-arrival col-md-2 " contenteditable="true">' + nextArrival + '</div>' +
    '<div class="minutes-away col-md-1 ">' + minutesAway + '</div>' 
    + '<div class="col-md-3"><a class="update waves-effect waves-light btn">Update</a><a class="remove waves-effect waves-light btn">Remove</a></div></div>');
    

    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });