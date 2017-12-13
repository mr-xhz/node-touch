module.exports = {
    //求距离
    distance(p1,p2){
        if(!p1 || !p2) return 0;
        if(p1.x == -1 || p1.y == -1 || p2.x == -1 || p2.y == -1) return 0;
        return Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
    },
    //求斜率
    k(p1,p2){
        if(!p1 || !p2) return 0;
        var x = p2.x - p1.x;
        var y = p2.y - p1.y;
        if(x == 0) return 999999;
        return y / x;
    },
};