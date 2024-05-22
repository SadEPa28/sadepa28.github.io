function generateNewADBCode() {
    const input = document.getElementById('newADBInput').value;
    let output = '';

    // 遍历处理前的数字字符串
    for (let i = 0; i < input.length; i++) {
        // 计算处理后的位置
        const newIndex = (i === 0 ? input.length - 1 : i - 1);
        // 拼接处理后的数字
        output += input.charAt(newIndex);
    }

    // 将处理后的数字设置为输出值
    document.getElementById('newADBOutput').value = output;
}

function generateNewSelfTestCode() {
    // 获取输入的数字字符串
    const inputNumber = document.getElementById('newSelfTestInput').value;

    // 统计每个数字出现的频率
    const frequency = {};
    for (let i = 0; i < inputNumber.length; i++) {
        const digit = inputNumber.charAt(i);
        frequency[digit] = (frequency[digit] || 0) + 1;
    }

    // 按照频率排列数字
    const sortedDigits = Object.keys(frequency).sort(function (a, b) {
        return frequency[b] - frequency[a] || a - b;
    });

    // 构建处理后的数字字符串
    let processedNumber = '';
    for (let j = 0; j < sortedDigits.length; j++) {
        processedNumber += sortedDigits[j].repeat(frequency[sortedDigits[j]]);
    }

    // 将处理后的数字字符串输出到指定的元素中
    document.getElementById('newSelfTestOutput').value = processedNumber;}

function generateOldADBCode() {
    const input = document.getElementById('oldADBInput').value;
    let wc = watchCheckCodeDecode(input);
    document.getElementById('oldADBOutput').value = toolsCheckCodeEncode(wc)
}

function generateOldSelfTestCode() {
    const input = document.getElementById('oldSelfTestInput').value;
    let dtc = decodeWatchCheckCode(input);
    document.getElementById('oldSelfTestOutput').value = generateToolsCheckCode(dtc)
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
    let result = i9.toString().padStart(2, '0') + i10.toString().padStart(2, '0') + i8.toString().padStart(2, '0') + i7.toString().padStart(2, '0') + i6.toString();
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
    let result = i9.toString().padStart(2, '0') + i10.toString().padStart(2, '0') + i6.toString().padStart(2, '0') + i7.toString().padStart(2, '0') + i8.toString();
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
    let result = i6.toString().padStart(2, '0') + i4.toString().padStart(2, '0') + i5.toString();
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
    return i5.toString().padStart(2, '0') + i6.toString().padStart(2, '0') + i4.toString()
}