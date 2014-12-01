var USER={};
USER.notifyMove  =true;
USER.notfyChat = true;

var myNotification = new Notify('Yo dawg!', {
    body: 'This is an awesome notification',
    tag: "note",
    icon: "http://www.karopapier.de/favicon.ico",
    notifyShow: onNotifyShow,
    permissionDenied: onPermissionDenied,
    notifyError: nix
});

function nix(e, f) {
    //console.log("Error", e, f);
    onPermissionDenied();
}

function onNotifyShow() {
    console.log('notification was shown!');
}

function onPermissionGranted() {
    console.log("I derf!!!!");
    document.getElementById("chkNotifications").checked="checked";
}

function onPermissionDenied() {
    console.log("Darf net");
    document.getElementById("chkNotifications").checked="";
}

console.log("Hier kam ich vorbei");

if (Notify.permissionLevel == "granted") {
    document.getElementById("chkNotifications").checked="checked";
}

function showNotification() {
    myNotification.show();
}

function checkNotification() {
    console.log("Lemmy Check");
    Notify.requestPermission(onPermissionGranted, onPermissionDenied);
}
