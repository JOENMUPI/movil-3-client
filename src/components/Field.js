const checkFields = (row) => {
    let flag = true;
    
    row.forEach(element => {
        if(element.length <= 0) {
            flag = false;
        }
    });
    
    return flag; 
}

export default {
    checkFields
}