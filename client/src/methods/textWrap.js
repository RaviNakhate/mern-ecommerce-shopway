const textWrap = (text,slice) => {

    if(text.length<slice+1) {
        return text;
    }

    return `${text.slice(0,slice)}...`;
}

export default textWrap;