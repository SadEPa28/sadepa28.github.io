function generateLeftCode() {
    var input = document.getElementById('leftInput1').value;
    wc = watchCheckCodeDecode(input);
    tc = toolsCheckCodeEncode(wc);
    document.getElementById('leftInput2').value = tc
}

function generateRightCode() {
    var input = document.getElementById('rightInput1').value;
    dtc = decodeWatchCheckCode(input);
    gtc = generateToolsCheckCode(dtc);
    document.getElementById('rightInput2').value = gtc
}

function watchCheckCodeDecode(str) {
    if (typeof str !== 'string') {
        console.log("Invalid argument str");
        return
    }
    if (str.length === 0 || str.length < 9) {
        return
    }
    try {
        parseInt(str)
    } catch (error) {
        console.log("str has some except num");
        return
    }
    let i = parseInt(str.substring(0, 2));
    let i2 = parseInt(str.substring(2, 4));
    let i3 = parseInt(str.substring(4, 6));
    let i4 = parseInt(str.substring(6, 8));
    let i5 = parseInt(str.substring(8, str.length));
    let i6 = i5 ^ (i3 + i4);
    let i7 = i4 ^ i6;
    let i8 = i3 ^ i6;
    let i9 = i ^ i6;
    let i10 = i2 ^ i6;
    result = i9.toString().padStart(2, '0') + i10.toString().padStart(2, '0') + i8.toString().padStart(2, '0') + i7.toString().padStart(2, '0') + i6.toString();
    console.log("watchCheckCodeDecode return : " + result);
    return result
}

function toolsCheckCodeEncode(str) {
    if (typeof str !== 'string') {
        console.log("Invalid argument str");
        return
    }
    if (str.length === 0 || str.length < 9) {
        return
    }
    try {
        parseInt(str)
    } catch (error) {
        console.log("str has some except num");
        return
    }
    let i = parseInt(str.substring(0, 2));
    let i2 = parseInt(str.substring(2, 4));
    let i3 = parseInt(str.substring(4, 6));
    let i4 = parseInt(str.substring(6, 8));
    let i5 = parseInt(str.substring(8, str.length));
    let i6 = i4 ^ i3;
    let i7 = i5 ^ i3;
    let i8 = i3 ^ (i6 + i7);
    let i9 = i ^ i7;
    let i10 = i2 ^ i7;
    result = i9.toString().padStart(2, '0') + i10.toString().padStart(2, '0') + i6.toString().padStart(2, '0') + i7.toString().padStart(2, '0') + i8.toString();
    console.log("toolsCheckCodeEncode result: " + result);
    return result
}

function decodeWatchCheckCode(str) {
    if (typeof str !== 'string') {
        console.log("Invalid argument str");
        return
    }
    if (str.length === 0 || str.length < 5) {
        return
    }
    let i = parseInt(str.substring(0, 2));
    let i2 = parseInt(str.substring(2, 4));
    let i3 = parseInt(str.substring(4, str.length));
    let i5 = i3 ^ (i + i2);
    let i6 = i ^ i5;
    let i4 = i2 ^ i5;
    result = i6.toString().padStart(2, '0') + i4.toString().padStart(2, '0') + i5.toString();
    console.log("decodeWatchCheckCode result: " + result);
    return result
}

function generateToolsCheckCode(str) {
    if (typeof str !== 'string') {
        console.log("Invalid argument str");
        return
    }
    if (str.length === 0 || str.length < 5) {
        return
    }
    let i = parseInt(str.substring(0, 2));
    let i2 = parseInt(str.substring(2, 4));
    let i3 = parseInt(str.substring(4, str.length));
    let i5 = i2 ^ i;
    let i6 = i3 ^ i;
    let i4 = i ^ (i5 + i6);
    result = i5.toString().padStart(2, '0') + i6.toString().padStart(2, '0') + i4.toString();
    return result
}