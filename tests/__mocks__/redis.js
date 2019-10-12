class Redis {
    constructor({host,port}){
        this.host = host;
        this.port = port;
        this.storage = {};
    }

    get(key){
        if(key === '192.168.1.2'){
            return 200;
        }
        if(key === '192.168.1.3'){
            return 3;
        }
        if(this.storage[key]===undefined){
            return null;
        } else {
            return this.storage[key];
        }
    }

    set(key, value, type, time){
        return this.storage[key]=value;
    }

    incr(){
        return 3;
    }
}

module.exports = Redis;