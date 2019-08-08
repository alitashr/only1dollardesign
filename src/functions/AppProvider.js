import React, { Component } from 'react';
import axios from 'axios';

let domain = "https://explorug.com/v2";


class AppProvider extends Component {
   GetKey = (username, password)=>{
        return new Promise((resolve,reject)=>{
            let data = new FormData();
            data.append("action", "login");
            data.append("username",username);
            data.append("password",password);
            axios.post(domain + '/appprovider.aspx', data)
            .then(response =>{
                resolve(response.data);
            })
            .catch(error=>{
            reject(error);
            })
        })
    };
    GetDesignList = (key)=>{
        return new Promise((resolve, reject)=>{
            let data = new FormData();
            data.append("action", "designlist");
            data.append("key",key);
            axios.post(domain+ "/appprovider.aspx", data)
                 .then(response=>{
                     let data = response.data;
                     if(data !=='') resolve(data);
                     else{
                         console.log('designlist is blank');
                     }
                })
                .catch(error=>{
                    reject(error);
                });
        })
    }

    GetDesignThumbs = (key, designsFullPathlist)=> {
        return new Promise((resolve, reject) => {
            let data = new FormData();
            data.append("action", "designthumbs");
            data.append("key",key);
            data.append("files", JSON.stringify(designsFullPathlist));
            data.append("backcolor", "#ffffff");
            axios.post(domain+ "/appprovider.aspx", data)
            .then(response=>{
                let thumbList = response.data;
                resolve(thumbList);
            })
            .catch(error => { // your error handling goes here}
                reject(error)
            });
        });
        
    }
    GetDesignDetails = (key, selectedDesign, backcolor)=>{
        return new Promise((resolve, reject) => {
            let bgcolor = backcolor ? backcolor: '#ffffff';
            let data = new FormData();
            data.append("action", "designdetails");
            data.append("key",key);
            data.append("file", selectedDesign);
            data.append("backcolor", bgcolor);
            axios.post(domain+ "/appprovider.aspx", data)
            .then(response=>{
                let designdetails = response.data;
                console.log(designdetails);
                resolve(designdetails);
            })
            .catch(error => { // your error handling goes here}
                reject(error)
            });
        });
    }

}

export default AppProvider;