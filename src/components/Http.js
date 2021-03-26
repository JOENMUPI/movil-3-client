const url = 'http://192.168.1.105:8000/'

const send = async (method, endpoint, body, token) => {
    let response;
    let headers = new Headers({ 'Content-Type': 'application/json' });

    if(token != null) {
        headers.append('x-access-token', token);
    } 
     
    (body == null) 
    ? response = await fetch(url + endpoint , { method, mode: 'cors', headers })
    : response = await fetch(url + endpoint , { method, mode: 'cors', headers, body: JSON.stringify(body) });
    
    return await response.json(); 
}

export default {
    send
}