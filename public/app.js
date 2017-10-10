  // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCI49DR8jKmeVk-O7lYUuN8ZOl8hLBmfPU",
      authDomain: "apptest-8f5d2.firebaseapp.com",
      databaseURL: "https://apptest-8f5d2.firebaseio.com",
      projectId: "apptest-8f5d2",
      storageBucket: "apptest-8f5d2.appspot.com",
      messagingSenderId: "217976011014"
    };
    firebase.initializeApp(config);

    var readerTable = document.getElementById('readerTable');
    //var values[] ;
    var editKey;
    var imageUrl;


    var dbRef = firebase.database().ref().child('bookss');
    dbRef.on('child_added', snap => {
      //console.log(snap.val());
      var row = readerTable.insertRow();
      row.id = snap.key;
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var keyval = snap.key;
    //  console.log(keyval);
      cell1.innerHTML = '<pre></pre>';
      cell2.innerHTML = '<pre></pre>';
      cell1.setAttribute('class', 'filterable-cell');
      cell2.setAttribute('class', 'filterable-cell');
      cell3.setAttribute('class', 'filterable-cell');
      cell4.setAttribute('class', 'filterable-cell');

      cell1.innerText = snap.val().title;
      cell2.innerText = snap.val().author;
      //cell3.innerHTML = '<span class="glyphicon glyphicon-trash" aria-hidden="true" ></span>';
    //  cell3.onclick = removeItem(snap.key);
     cell3.id = 'cell3'+snap.key;
     cell4.id = 'cell4'+snap.key;
     createEditIcon('cell4'+snap.key, snap.key)
     createRemoveIcon('cell3'+snap.key, snap.key) ;

    });



    dbRef.on('child_removed', snap => {
      const rowToRemove = document.getElementById(snap.key);
      rowToRemove.remove();
    });



    function createRemoveIcon(container, id){
        var button = document.createElement("button");
        button.setAttribute('class', 'btn btn-danger');
        button.innerHTML = 'Delete';
        button.onclick = function(){
            //var icon = document.createElement("span");

            //icon.className ="glyphicon glyphicon-trash";
            //this.appendChild(icon);
            dbRef.child(id).remove();
        }
        document.getElementById(container).appendChild(button);
    }



    document.getElementById('notificationForm').addEventListener('submit', submitForm);

    function submitForm(e){
        e.preventDefault();
        //console.log(123);
        var title = getInputVal('bookTitle');
        var author = getInputVal('bookAuthor');
      //  console.log(title);
      //submit form
        saveData(title,author,imageUrl);
        //show alert
        document.querySelector('.alert').style.display = 'block';
        //Hide Alert after 3 second
        setTimeout(function(){
          document.querySelector('.alert').style.display = 'none';
        },3000);
      //clear form
      document.getElementById('notificationForm').reset();
    }

    function getInputVal(id){
      return document.getElementById(id).value;
    }



    function saveData(title,author,imageUrl){
      var newBook = dbRef.push();
      newBook.set({
        title: title,
        author: author,
        timestamp: new Date().getTime(),
        imageUrl: imageUrl
      });
    }



    function createEditIcon(container, id){
        var editButton = document.createElement("edit-button");
        editButton.setAttribute('class', 'btn btn-primary');
        editButton.innerHTML = 'Edit';
        editButton.onclick = function(){
            //var icon = document.createElement("span");

            //icon.className ="glyphicon glyphicon-trash";
            //this.appendChild(icon);
          //  dbRef.child(id).remove();
          loadEditableData(id);
        }
        document.getElementById(container).appendChild(editButton);
    }



    function loadEditableData(firebaseKey){
      editKey = firebaseKey;
      var dbEditRef = dbRef.child(firebaseKey);
      dbEditRef.once('value', snapshot => {
        document.getElementById('bookTitle').value = snapshot.val().title;
        document.getElementById('bookAuthor').value = snapshot.val().author;
        document.getElementById('editButton').style.display = 'block';
        document.getElementById('addButton').style.display = 'none';
        document.getElementById('uploadImageButton').style.display = 'none';
      });
    }



    function updateData(){
      var dbEditRef = dbRef.child(editKey);
      dbEditRef.update({
        title : getInputVal('bookTitle'),
        author : getInputVal('bookAuthor')
      });
      document.querySelector('.alert').style.display = 'block';
      //Hide Alert after 3 second
      setTimeout(function(){
        document.querySelector('.alert').style.display = 'none';
      },3000);
    //clear form
    document.getElementById('notificationForm').reset();
    document.getElementById('editButton').style.display = 'none';
    document.getElementById('addButton').style.display = 'block';
  }



  dbRef.on('child_changed' , snap => {
      console.log(snap.val());
      const rowToChange = document.getElementById(snap.key);
      rowToChange.cells[0].innerHTML = snap.val().title;
      rowToChange.cells[1].innerHTML = snap.val().author;

      document.getElementById('uploadImageButton').style.display = 'block';
  });


  var uploadImageButton = document.getElementById('uploadImageButton');
    uploadImageButton.addEventListener('change', function(e){
    //Get file
    var file = e.target.files[0];
    //Get a storage reference
    var storageRef = firebase.storage().ref('creatives/' + file.name);
    // upload the file
    var task = storageRef.put(file);
    //Update progressbar
    task.on('state_changed',
    function progress(snapshot){
      document.getElementById('addButton').style.display = 'none';
      var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      document.getElementById('progressBar').style.display = 'block';
      progressBar.value = percentage;
    },
    function error(err){},
    function complete(){
      const gsConference = storageRef.getMetadata().then(function(metadata){
        imageUrl = metadata.downloadURLs[0];
      console.log(metadata.downloadURLs[0]);
      document.getElementById('progressBar').style.display = 'none';
      document.getElementById('addButton').style.display = 'block';

      }).catch(function(error) {
          console.log(error);
      });
    }
  );

});
