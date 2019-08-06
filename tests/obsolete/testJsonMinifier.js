
var obj ={
    arr:["simple",
    "with new line\n here",
        `long line here:
        
        in the midlle
        
        and here
        
        "sssss"
        
        
        ends here
        `,
        {
        value:"ceva"
        }
    ],
    member:{
        fieldObj:"value"
    },
    long:""
}

for(let i=0;i<10000;i++)
{
    obj.log+="abcdefghighasdasdhashdjksasdjsdfhsdjkhfsdjhfj sdhjhdjfhsdjkfhjsdhfjksdhfjsdhjf jkhdsfjhsd fhsdjkh khsdjfhsdhf sdkhfsdjkhfsdjkhfsdjkhfjksdhfjksdhfjksdsdjkh sdjk"
}

console.log(JSON.stringify(obj));
//console.log(JSON.stringify(obj,null,4));
