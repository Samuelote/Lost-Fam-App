 export const testEmail = (email) => {
   let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email);
 }

 export const canNavToNext = (values, instOfValidate) => {
   console.log(values)
    if (!values) return false;
    let objToTest = instOfValidate(values);
    for (let key in objToTest) {
      if(objToTest.hasOwnProperty(key)) return false;
    }
    return true;
 }

 export const testName = (name) => {
   if (name){
     return(name.length > 2);
   }
 }

 export const testPassword = (password) => {
   if (password){
     return(password.length > 5);
   }
 }
