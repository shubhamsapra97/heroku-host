const init = async () => {

    return getUserFingerPrint();
    let browserData = await getBrowserData();
    
    let data = {
        ...browserData,
        os: navigator.platform,
        userAgent: navigator.userAgent
    }
    
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
        console.log("window.requestIdleCallback called");
        requestIdleCallback(function () {
            Fingerprint2.get(function (components) {
              console.log(components);
            })
        })
    } else {
        console.log("else [art called");
        setTimeout(function () {
            Fingerprint2.get(function (components) {
              console.log(components);
            })  
        }, 500)
    }   
    
}

init();