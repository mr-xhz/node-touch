var util = require('../core/util');
var actionFactory = require('./actionFactory');

var fs = require('fs'),
    path = require('path');

var constant = {
    //单击时间
    SIMPLE_CLICK : 300,
    //动作延迟时间
    DELAY_TIME : 150
};

module.exports = {
    on(evt){
        if(evt.done) return false;
        if(!evt.beginTime) return false;
        if(!evt.move && !evt.down){
            if(new Date().getTime() - evt.beginTime.getTime() < constant.SIMPLE_CLICK){
                //simple_click
                this._beginAction("CLICK","",evt.finger);
            }else{
                //long_click
                this._beginAction("LONG_CLICK","",evt.finger);
            }
            evt.done = true;
        }else if(evt.finger <= 0 || evt.finger != Object.keys(evt.point).length){
            return false;
        }
        evt.direction = evt.direction || {};
        for(var key in evt.point){
            evt.direction[key] = evt.direction[key] || {LEFT:0,RIGHT:0,UP:0,DOWN:0};
            var points = evt.point[key];
            if(points.length != 2){continue;}
            var k1 = util.k(points[0],points[1]);
            k1 = Math.abs(k1);
            if(k1>0){
                if(k1 < 1){
                    if(points[0].x > points[1].x){
                        evt.direction[key]["LEFT"]++;
                    }else{
                        evt.direction[key]["RIGHT"]++;
                    }
                }else{
                    if(points[0].y > points[1].y){
                        evt.direction[key]["UP"]++;
                    }else{
                        evt.direction[key]["DOWN"]++;
                    }
                }
            }
        }
        if(new Date().getTime() - evt.beginTime.getTime() >= constant.DELAY_TIME){
            this._action(evt);
        }
    },
    _action(evt){
        evt.done = true;
        //先对坐标进行排序
        var points = [];
        for(var key in evt.point){
            points.push({
                key:key,
                x:evt.point[key][0].x
            });
        }
        points.sort(function(a,b){
            return a.x > b.x;
        });
        var arrDirection = [];
        points.forEach(item => {
            var d = evt.direction[item.key];
            if(!d) return false;
            var direction = "";
            var max = 0;
            for(var key in d){
                if(max < d[key]){
                    max = d[key];
                    direction = key;
                }
            }
            arrDirection.push(direction);
        });
        //console.log(arrDirection,evt.finger);
        var direction = "";
        var type = "";

        var mapDirection = {};
        //在这里判断是什么动作
        arrDirection.forEach(item => {
            mapDirection[item] = mapDirection[item] || 0;
            mapDirection[item]++;
        });
        var keys = Object.keys(mapDirection);
        if(keys.length == 1){
            direction = keys[0];
            type = "MOVE";
        }else if(keys.length == 2){
           if(keys[0] == 'LEFT' || keys[0] == 'DOWN'){
              direction = "OUTSIDE";
           }else{
              direction = "INSIDE";
           }
           type = "ZOOM";
        }
        this._beginAction(type,direction,evt.finger);

       
    },
    /**
     * type MOVE ZOOM CLICK LONG_CLICK
     * direction LEFT RIGHT DOWN UP INSIDE OUTSIDE
     * finger 1 2 3 4 5
     */
    _beginAction(type,direction,finger){
        //console.log("type:",type);   
        //console.log("direction:",direction);   
        //console.log("finger:",finger);   
        var config = {};
        try{
            var configPath = path.join(process.env.HOME,'.config/node-touch/node-touch.json');
            if(!fs.existsSync(configPath)){
                configPath = path.join(__dirname,'../config/node-touch.json');
            }
            var strConfig = fs.readFileSync(configPath,"utf8");
            config = JSON.parse(strConfig);
        }catch(e){
            console.log(e);
            return false;
        }
        config = config["ALL"];
        if(!config || config.length == 0) return false;
        var actionConfig = null;
        for(var i=0;i<config.length;i++){
            var item = config[i];
            if(item.type == type && (item.direction == "ALL" || item.direction == direction) && item.finger == finger){
                actionConfig = item.action;
                break;
            }
        }
        if(!actionConfig || !actionConfig.name) return false;
        var action = actionFactory.getAction(actionConfig.name);
        action && action.action(actionConfig.content);
        
    }
};