var robot = require("robotjs");

module.exports = {
    name:'SEND_KEY',
    action(keys){
        try{
            var arrKey = keys.split('+');
            var key = '',flag = [];
            
            arrKey.forEach(item => {
                item = item.toLowerCase();
                if(arrKey.length != 1 && (item == 'alt' || item == 'control' || item == 'command' || item == 'shift' || item == 'right_shift')){
                    flag.push(item);
                }else{
                    key = item;
                }
                
            });
            robot.keyTap(key,flag);
        }catch(e){
            console.log(e);
        }
    }
};