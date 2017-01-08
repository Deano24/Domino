<head>
    <meta charset="utf-8">
    <title>Play domino</title> 
    <!-- build:css(.) styles/vendormain.css -->
    <!-- bower:css -->
    <link rel="stylesheet" href="bower_components/toastr/toastr.css" />
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
    <link rel="stylesheet" href="bower_components/sweetalert/dist/sweetalert.css" />
    <link rel="stylesheet" href="bower_components/bootstrap-material-design/dist/bootstrap-material-design.css" />
    <!-- endbower -->
    <!-- endbuild -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="styles/main.css" rel="stylesheet"/>
</head>
<body>
    <header class="intro-header">
        <img src="assets/banner.png" style="width: 100%; height: 100%;">
    </header>
    <a ng-click="javascript:void(0)" class="btn btn-info bmd-btn-fab btn-fab bottom-right" data-toggle="modal" data-target=".room-create-modal"><i class="material-icons">add</i><div class="ripple-container"></div></a>
    <div class="container">
        <div class="row">
            <div class="rooms col-md-8 col-xs-12 rounded" id="roomList">
                <h1 class="rowtitle"><span class="ep1">Rooms</span></h1>
            </div>
            <div class="news col-md-offset-1 col-md-3 col-xs-12 rounded">
                <h1 class="rowtitle"><span class="ep1">News</span></h1>
            </div>
        </div>
    </div>
    <!-- build:js(.) scripts/vendor.js -->
    <script type="text/javascript" src="bower_components/sweetalert/dist/sweetalert.min.js"></script>
    <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
    <!-- endbuild -->
    <script type="text/javascript" src="scripts/services/http.js"></script>
    <script type="text/javascript">
        'use strict';
        function onRoomSelected (url) {
            swal({
                title: 'Your Alias!',
                text: 'Let us know who you are, so we can customize your six love expereince. :D',
                type: 'input',
                showCancelButton: true,
                closeOnConfirm: false,
                animation: 'slide-from-top',
                inputPlaceholder: 'Alias'
            }, function(inputValue){
                if (inputValue === false) {
                    return false;
                }
                if (inputValue === '') {
                    swal.showInputError('Nice try but we need a name!');
                    return false;
                }
                localStorage.setItem('alias', inputValue);
                window.location.href = url;
            });
        }
        function getRooms () {
            getFrom('<%= apiUrl %>/rooms', (err, res) => {
                if (!err) {
                    for (var i = 0; i < res.rooms.length; i++) {
                        $('<div class="row col-md-6 col-xs-12">'+
                            '<div class="col-md-11 col-xs-11">'+
                                '<p class="center"><strong>'+res.rooms[i].title+'</strong> '+res.rooms[i].type+'</p>'+
                                '<a class="btn-join col-md-12 col-xs-12 btn btn-raised" onclick="onRoomSelected(\'/play.html?room='+res.rooms[i].id+'\')">('+res.rooms[i].users+'/4) Join<span class="glyphicon glyphicon-chevron-right"></span></a>'+
                            '</div>'+
                        '</div>').appendTo('#roomList');
                    }
                }
            });
        }
        getRooms();
        function formReset() {
            $('#roomName').parent().removeClass('has-error');
            $('#errorBlock').hide();
            $('#roomName').val('');
            $('#roomPassword').val('');
        }
        function createRoom () {
            const name = $('#roomName').val();
            if (!name || name === '') {
                $('#roomName').parent().addClass('has-error');
                $('#errorBlock').show();
                return;
            }
            var password = $('#roomPassword').val();
            password = password === '' ? null : password;
            postTo('<%= apiUrl %>/rooms', {title: name, password: password}, function(err, res) {
                formReset();
                $('.room-create-modal').modal('hide');
                if (err) {
                    swal({
                        title: 'Room Creation!',
                        text: 'Your room creation failed, because '+JSON.parse(err.responseText).message+' If this problem persists please contact us at support@deano24.com.',
                    });
                    return console.log(err);
                }
                getRooms();
                swal({
                    title: 'Room Creation!',
                    text: 'Your room has been created. :)',
                });
            });
        }
        
    </script>
</body>

<div class="modal fade room-create-modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="formReset()"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Room Creation</h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="control-label" for="roomName">Room Name:</label>
                    <input type="text" class="form-control" id="roomName" placeholder="Deuces">
                    <span id="errorBlock" class="help-block" style='display:none;'>The room name is required.</span>
                </div>
                <div class="form-group">
                    <label for="roomName">Password (leave blank for no password):</label>
                    <input type="password" class="form-control" id="roomPassword" placeholder="12345678">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" onclick="formReset()">Close</button>
                <button type="button" class="btn btn-primary" onclick="createRoom()">Create</button>
            </div>
        </div>
    </div>
</div>