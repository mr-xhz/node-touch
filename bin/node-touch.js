var child_process = require('child_process');

var command = require("../core/command");

child_process.exec('cat /proc/bus/input/devices', (err, stdout, stderr) => {
    if (err || stderr) {
        console.log(err, stderr);
        return;
    }
    var m = stdout.match(/Touchpad[\s\S]*?Handlers=.*?(event\d+)\s*$/im);
    if (!m) {
        console.error("找不到触摸板");
        return;
    }
    var touchpadId = m[1];
    console.log("触摸板id为:", touchpadId);
    var evtest = child_process.spawn('evtest',['/dev/input/'+touchpadId]);
    evtest.stdout.on('data',data => {
        command.detail(data);
    });
});


