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



$(('#submit-button')).on('click', function (event){

    // Prevent the page from refreshing
    event.preventDefault();

    // Get inputs-

    var trainName= $("#train-name").val().trim();
    console.log(trainName);
    var destination = $("#destination").val().trim();
    console.log(destination);
    var firstTrain = $("#first-train").val().trim();
    console.log(firstTrain)
    var frequency = $("#frequency").val().trim();
    console.log(frequency)
   
    
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

database.ref().on('child_added', function(childSnapshot){
    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val());
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrain);
    console.log(childSnapshot.val().frequency);

    // Store everything into a variable.
    var trainNameChild = childSnapshot.val().trainName;
    var destinationChild = childSnapshot.val().destination;
    var firstTrainChild = childSnapshot.val().firstTrain;
    var frequencyChild = parseInt(childSnapshot.val().frequency);
    // console.log(frequencyChild);
    console.log(firstTrainChild);

    var firstTrainMoment = moment(firstTrainChild, 'HH:mm').format('hh:mm A');
    console.log(firstTrainMoment);


    var nextArrival = moment(firstTrainMoment, 'hh:mm A').add(frequencyChild, 'm').format('hh:mm A');
    console.log(nextArrival);
    
    var minutesAway = moment(nextArrival,'hh:mm A').diff(moment(), 'minutes');
    console.log(minutesAway);
 



    $(".table-item").append('<div class="row">' +
    '<div class="col-md-2 employee-name">' + childSnapshot.val().trainName + '</div>' +
    '<div class="col-md-2 employee-role">' + childSnapshot.val().destination + '</div>' +
    '<div class="col-md-2 start-date">' + childSnapshot.val().frequency + '</div>' +
    '<div class="col-md-2 monthly-rate">' + nextArrival + '</div>' +
    '<div class="col-md-2 total-billed">' + minutesAway + '</div>' 
    + '</div>');
    

    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
