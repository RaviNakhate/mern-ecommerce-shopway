const indianRupeesFormate = (ele) => {
    if (typeof ele !== "number") {
        return "₹ 0";
    }

    let x = ele;
    x = x.toString();
    let lastThree = x.substring(x.length - 3);
    let otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== '')
        lastThree = ',' + lastThree;
    let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return "₹ " + res;
}


export default indianRupeesFormate;