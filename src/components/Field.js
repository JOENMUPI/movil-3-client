const checkFields = (row) => {
    let flag = true;
    
    row.forEach(element => {
        if(element.length <= 0) {
            flag = false;
        }
    });
    
    return flag; 
}

const checkPass = (pass) => {
    let capitalLetter = false;
    let lowercaseLetter = false;
    let number = false;
    let specialLetter = false;
    
    if(pass.length >= 8) {		
        for(let i = 0; i < pass.length; i++) { 
            if(pass.charCodeAt(i) > 64 && pass.charCodeAt(i) < 91) {
                capitalLetter = true;
            
            } else if(pass.charCodeAt(i) > 96 && pass.charCodeAt(i) < 123) {
                lowercaseLetter = true;
            
            } else if(pass.charCodeAt(i) > 47 && pass.charCodeAt(i) < 58) {
                number = true;
            
            } else {
                specialLetter = true;
            }
        } 
    }

    if(capitalLetter && lowercaseLetter && specialLetter && number) {
        return true;
    
    } else {
        return false;
    }
}

export default {
    checkFields,
    checkPass
}