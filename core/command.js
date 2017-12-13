var actionCore = require('../action/actionCore');
var util = require('../core/util');
module.exports = {
    _cacheData:'',
    _slot:'0',
    _event:null,
    _newEvent(){
        return {
            id:'',
            beginTime:null,
            endTime:null,
            done:false,
            move:false,
            down:true,
            point:{},
            type:'',
            finger:0
        };
    },
    _setMove(){
        for(var key in this._event.point){
            var points = this._event.point[key];
            if(points.length != 2){continue;}
            var distance = util.distance(points[0],points[1]);
            if(distance>20){
                this._event.move = true;
                return;
            }
        }
    },
    _setFinger(evt,finger){
        if(evt.value == '1' && this._event.finger < finger){
            this._event.finger = finger;
        }else if(evt.value == '0'){
            this._event.finger = finger;
        }
    },
    event(report){
        var lines = report.match(/.*?(\n|$)/g);
        this._event = this._event || this._newEvent();
        lines.forEach(line => {
            if(!line) return true;
            var m = line.match(/Event.*?time\s*?([\d\.]+?),\s*?type\s*?\d+?\s*?\((.*?)\),\s*?code\s*?\d+?\s*?\((.*?)\),\s*?value\s*?(\S*?)$/im);
            if(!m) return true;
            var evt = {
                time:m[1],
                type:m[2],
                code:m[3],
                value:m[4]
            };
            
            if(evt.code == 'ABS_MT_TRACKING_ID' && Number(evt.value) > 0){
                this._event = this._newEvent();
                this._event.id = evt.value;
                this._event.beginTime = new Date();
            }else if((evt.code == 'ABS_MT_TRACKING_ID' && Number(evt.value) == -1) || (evt.code == 'BTN_TOUCH' && Number(evt.value) == 0) ){
                this._event.endTime = new Date();
                this._event.down = false;
            }else if(evt.code == 'ABS_MT_SLOT'){
                this._slot = evt.value;
            }else if(evt.code == 'ABS_MT_POSITION_X'){
                this._event.point[this._slot] = this._event.point[this._slot] || [{x:-1,y:-1},{x:-1,y:-1}];
                if(this._event.point[this._slot][0].x == -1){
                    this._event.point[this._slot][0].x = Number(evt.value);
                }else{
                    this._event.point[this._slot][1].x = Number(evt.value);
                }
            }else if(evt.code == 'ABS_MT_POSITION_Y'){
                this._event.point[this._slot] = this._event.point[this._slot] || [{x:-1,y:-1},{x:-1,y:-1}];
                if(this._event.point[this._slot][0].y == -1){
                    this._event.point[this._slot][0].y = Number(evt.value);
                }else{
                    this._event.point[this._slot][1].y = Number(evt.value);
                }
            }else if(evt.code == 'BTN_TOOL_FINGER'){
                this._setFinger(evt,1);
            }else if(evt.code == 'BTN_TOOL_DOUBLETAP'){
                this._setFinger(evt,2);
            }else if(evt.code == 'BTN_TOOL_TRIPLETAP'){
                this._setFinger(evt,3);
            }else if(evt.code == 'BTN_TOOL_QUADTAP'){
                this._setFinger(evt,4);
            }else if(evt.code == 'BTN_TOOL_QUINTTAP'){
                this._setFinger(evt,5);
            }
        });
        this._setMove();
        if(!this._event.done){
            actionCore.on(this._event);
        }
    },
    detail(data){
        this._cacheData+=data+"";
        var m = this._cacheData.match(/([\s\S]*?SYN_REPORT.*$)/im);
        if(!m){
            return false;
        }
        var report = m[1];
        
        this.event(report);

        this._cacheData = this._cacheData.substring(report.length);
        this.detail('');
    }
};