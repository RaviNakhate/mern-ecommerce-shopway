const searchFilter = (arr,ele) => {
    let newArr = arr?.filter((val) => {
        return val.includes(ele.toLowerCase());
    }).slice(0, 2);

    return newArr;
}


export default searchFilter;