const init = async () => {

    let fingerPrint = await getUserFingerPrint();
    let browserData = await getBrowserData();
    
    let data = {
        ...browserData,
        os: navigator.platform,
        userAgent: navigator.userAgent,
        fingerPrint
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
    }).catch((err)=>console.log(err));

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

getUserFingerPrint = () => {
    
    if (window.requestIdleCallback) {
        
        return new Promise((resolve,reject) => {
            requestIdleCallback(async () => {
                
                try {
                    let components = await Fingerprint2.getPromise();
                    let values = components.map(function (component) { return component.value });
                    let murmur = Fingerprint2.x64hash128(values.join(''), 31);
                    resolve(murmur);
                } catch(err) {
                    reject(err);
                    throw new Error(err);
                }
                
            });
        });
        
    } else {
        
        return new Promise((resolve,reject) => {
            Fingerprint2.get(function (components) {
                let values = components.map(function (component) { return component.value });
                let murmur = Fingerprint2.x64hash128(values.join(''), 31);
                if (murmur) {
                    resolve(murmur);
                } else {
                    reject();
                }
            });
        });
        
    }   
    
}

init();