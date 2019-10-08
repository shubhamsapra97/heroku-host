// the init function
const init = async () => {
    
    try {
        let fingerPrintData = await getFingerPrint();
        let browserData = await getBrowserData();
        getData();
        let data = {
            ...browserData,
            os: navigator.platform,
            userAgent: navigator.userAgent,
            cookieEnabled: cookieEnabled(),
            encoding: document.characterSet,
            ...fingerPrintData
        }
        console.log(data);
        // save in db
        fetch('/init',{
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then((res)=>{
           res.json().then((data) => {
               console.log("Response ",data);
               if (res.status == 201 || res.status == 200) {
                   document.write("Init saved successfully");
               } else {
                   document.write('Error saving config');
               } 
            });
        }).catch((err)=>{
            throw new Error(err);
        });
        
    } catch (err) {
        throw new Error(err);
    }   

}

// get browser related details.
getBrowserData = () => {
    
    let objAgent = navigator.userAgent;
    let version = ''+parseFloat(navigator.appVersion);
    let objOffsetName,objOffsetVersion,ix;
    
    if (objAgent.match(/Opera|OPR\//)) {
        browser = "Opera";
        version = objAgent.substring(objAgent.match(/Opera|OPR\//).index+4);
    } else if ((objOffsetVersion=objAgent.indexOf("Chrome"))!=-1) {
        browser = "Chrome";
        version = objAgent.substring(objOffsetVersion+7);
    }
    else if ((objOffsetVersion=objAgent.indexOf("Firefox"))!=-1) {
        browser = "Firefox";
    } 
    else if ((objOffsetVersion=objAgent.indexOf("Safari"))!=-1) {
        browser = "Safari";
        version = objAgent.substring(objOffsetVersion+7);
        if ((objOffsetVersion=objAgent.indexOf("Version"))!=-1){
            version = objAgent.substring(objOffsetVersion+8);
        }
    }
    if ((ix=version.indexOf(";"))!=-1) {
        version=version.substring(0,ix);
    }
    if ((ix=version.indexOf(" "))!=-1)  {
        version=version.substring(0,ix);
    }
    
    return {
        browser,
        version,
    }
    
}

getFingerPrint = () => {
    
    if (window.requestIdleCallback) {
        
        return new Promise((resolve,reject) => {
            requestIdleCallback(async () => {
                
                try {
                    let components = await Fingerprint2.getPromise();
                    let screenResolution,timezone,language,sessionStorage,localStorage;
                    let values = components.map((component) => { 
                        if (component.key == "screenResolution") {
                            screenResolution = component.value;
                        } else if(component.key == "timezone") {
                            timezone = component.value;
                        } else if(component.key == "language") {
                            language = component.value;
                        } else if(component.key == "sessionStorage") {
                            localStorage = component.value;
                        } else if(component.key == "localStorage") {
                            sessionStorage = component.value;
                        }
                        return component.value;
                    });
                    let data = {
                        screenResolution,
                        timezone,
                        language,
                        sessionStorage,
                        localStorage,
                        fingerPrintHash: Fingerprint2.x64hash128(values.join(''), 31)
                    }
                    resolve(data);
                } catch(err) {
                    reject(err);
                    throw new Error(err);
                }
                
            });
        });
        
    } else {
        
        return new Promise((resolve,reject) => {
            Fingerprint2.get((components) => {
                let values = components.map((component) => { 
                    if (component.key == "screenResolution") {
                        screenResolution = component.value;
                    } else if(component.key == "timezone") {
                        timezone = component.value;
                    } else if(component.key == "language") {
                        language = component.value;
                    } else if(component.key == "sessionStorage") {
                        localStorage = component.value;
                    } else if(component.key == "localStorage") {
                        sessionStorage = component.value;
                    }
                    return component.value;
                });
                let data = {
                        screenResolution,
                        timezone,
                        language,
                        sessionStorage,
                        localStorage,
                        fingerPrintHash: Fingerprint2.x64hash128(values.join(''), 31)
                    }
                if (data && Object.keys(data).length) {
                    resolve(murmur);
                } else {
                    reject();
                }
            });
        });
        
    }   
    
}

cookieEnabled = () => {
    
    let cookieEnabled = (navigator.cookieEnabled) ? true : false;
  
    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
    { 
      document.cookie="testcookie";
      cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    return (cookieEnabled);
    
}

getData = () => {
    
        fetch('https://api.ipdata.co?api-key=3903a0185925e6ebbde587bf50be2cd1ad78a0afcf512cbf8670e136',{
            method:"GET",
        }).then((response)=>{
            console.log(response);
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          // Examine the text in the response
          response.json().then(function(data) {
              console.log(data);
            //var country_code = data.country_code;
            //var country = data.country_name;
            //var ip = data.ip;
            //var time_zone = data.time_zone;
            //var latitude = data.latitude;
            //var longitude = data.longitude;

            //console.log("Country Code: " + country_code);
            //console.log("Country Name: " + country);
            //console.log("IP: " + ip); 
            //console.log("Time Zone: " + time_zone);
            //console.log("Latitude: " + latitude);
            //console.log("Longitude: " + longitude);   
          });
        }).catch((err)=>{
            throw new Error(err);
        }); 
    
}

init();