

const messageDecode = function(){
    this.buffer = Buffer.alloc(0);
}

messageDecode.prototype.push = function(chunk){


    this.buffer = Buffer.concat([this.buffer, chunk]);

    const msg = [];

    while (true) {
        
        if( this.buffer.length < 4 ) break;

        const len = this.buffer.readUInt32BE(0);

        if( this.buffer.length < 4 + len ) break;

        const data = this.buffer.slice(4, 4+len);

        msg.push(data);

        this.buffer = this.buffer.slice(4+len);
    }

    return msg;
}

module.exports.framingDecode = messageDecode;

module.exports.framingEncode = (data)=>{

    const chunks = [];

    for( let chunk of data ){
        let buf;
        if( Buffer.isBuffer(chunk)){
            buf = chunk;
        }else{
            buf = Buffer.from(JSON.stringify(chunk));
        }


        const jum = Buffer.alloc(4);
        jum.writeUInt32BE(buf.length);

        chunks.push(jum, buf);
    }

    return Buffer.concat(chunks);

}

module.exports.createId = (b)=>{
    const ts = Date.now().toString(b || 16);
    const rand = Math.random().toString(36).substring(2, 8);

    return ts + rand;
}