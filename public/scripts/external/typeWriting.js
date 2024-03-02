import "./hangul.min.js";

function typeWriting(cursor, $box, ctnt){
    let arr = Array.from(Array(ctnt.length), () => Array(0).fill(null));

    const DELAYTIME = 1500;
    const TYPINGSPEED = 60;
    const CURSORBLINKING = 500;

    for (let i = 0; i < ctnt.length; i++){
        let j = 0;
        let c = Hangul.disassemble(ctnt[i]);

        if (c.length > 1){
            for (let a = 0; a < c.length; a++){
                let nc = [];
                
                for (let b = 0; b < a + 1; b++){
                    nc.push(c[b]);
                }
                arr[i].push(Hangul.assemble(nc));
            }
            j += c.length;
        }

        else arr[i].push(ctnt[i]);
    }

    const blinker = () => {
        let doBlink;

        return{
            start(){
                doBlink = setInterval(blink, CURSORBLINKING);
            },
            stop(){
                clearInterval(doBlink);
                cursor.css('opacity', '0');
            }
        }
    }

    const blink = () => {
        if (cursor.css('opacity') == '0') cursor.css('opacity', '1');
        else cursor.css('opacity', '0');
    };

    (() => {
        const Blink = blinker();
        Blink.start();

        let i = 0, j = 0;
        let str = "";
        let _str = '';

        setTimeout(() => {
            Blink.stop();
            Blink.start();
            const typing = setInterval(() => {
                if (i >= arr.length){
                    clearInterval(typing);
                    
                    setTimeout(() => {Blink.stop();}, DELAYTIME * 2);
                    
                    return;
                }

                else{
                    _str = '';
                    if (j >= arr[i].length){
                        str += arr[i][j - 1];
                        i++;
                        j = 0;
                    }
    
                    else _str = arr[i][j++];
    
                    $box.text(str + _str);
                }
            },TYPINGSPEED);
        }, DELAYTIME);
    })();
}

export default typeWriting;