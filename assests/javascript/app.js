
// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)
// Initialize Firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBfExLEOcofvKXe1WHy2qeMKLiTzsdE8w0",
    authDomain: "trains-386db.firebaseapp.com",
    databaseURL: "https://trains-386db.firebaseio.com",
    projectId: "trains-386db",
    storageBucket: "trains-386db.appspot.com",
    messagingSenderId: "971363359981"
};
firebase.initializeApp(config);
//get reference to the Db
var database = firebase.database();


// Calls storeInputs function if submit button clicked
$("#addtrain").on("click", function (event) {

    // form validation - if empty - alert
    if ($('#trainName').val().length === 0 || $('#destination').val().length === 0 || $("#firstTrainTime").length === 0 || $('#frequency') === 0) {
        alert("Please Fill All Required Fields");
        event.preventDefault();

    } else {
        // if form is filled out, run function
        storeInDb(event);
    }
});

// Calls storeInputs function if enter key is clicked
$('#trainForm').on("keypress", function (event) {

    if (event.which === 13) {
        // form validation - if empty - alert
        if ($('#trainName').val().length === 0 || $('#destination').val().length === 0 || $("#firstTrainTime").length === 0 || $('#frequency') === 0) {
            alert("Please Fill All Required Fields");
            event.preventDefault();

        } else {
            // if form is filled out, run function
            storeInDb(event);
        }
    }
});

//On add button click       
var storeInDb = function (event) {
    // prevent from from reseting
    event.preventDefault();

    //Getting all the inputs
    var trainName = $('#trainName').val().trim();
    var destination = $('#destination').val().trim();
    var frequency = $('#frequency').val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim();
    var e_trainTime = moment(firstTrainTime, "HH:mm").format("X");

    //push to DB
    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        firstTrainTime: e_trainTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    //clear the fields
    $('#trainName').val('');
    $('#destination').val('');
    $('#frequency').val('');
    $("#firstTrainTime").val('');

}

//when new record added
database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().firstTrainTime;
    var trainFrequency = childSnapshot.val().frequency;   

    //Declaring a time difference variable
    var timeDifference = moment().diff(moment.unix(trainTime), "minutes");
    console.log("diff" + timeDifference);

    //reminder
    var trainRemainder = timeDifference % trainFrequency;
    console.log('reminder' + trainRemainder);

    //minutes away for next train
    var minutesAway = trainFrequency - trainRemainder;
    console.log('min away' + minutesAway);

    //next arraival time
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");
    console.log('next arraival' + nextArrival);

    //html table row element
    var tr = $('<tr>').append(
        $('<td>').text(trainName),
        $('<td>').text(trainDestination),
        $('<td>').text(trainFrequency),
        $('<td>').text(nextArrival),
        $('<td>').text(minutesAway)
    );
    $('.tbody').append(tr);

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});


