var avgarr=[];
exports.getRecommendation1=getRecommendation1;
exports.getRecommendation2=getRecommendation2;
exports.getRecommendation3=getRecommendation3;
exports.getRecommendation4=getRecommendation4;
exports.getRecommendation5=getRecommendation5;

var htmlString;
var container;
var sortIt=[];
var dateString="";
var close=[], high=[], low=[], turnover=[], tradeQ=[], key=[], growth=[];
var records=[];

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd==14){                                    //if it's the 14th of a certain month
    console.log("Today is 14");
    if(mm==5||mm==7||mm==10||mm==12){         //months with 31 days
        dd = 30;
        mm = mm-1;
    }
    if(mm==4||mm==6||mm==9){                 //months with 30 days
        dd = 31;
        mm = mm-1;
    }
    if(mm==8){                                 //July also has 31 days so august considered separately
        dd = 31;
        mm = mm-1;
    }
    if(mm==1){                                 //for prev year since jan
        dd= 31;
        mm = 12;
        yyyy = yyyy-1;
    }
    if(mm==3){                                 //feb can be different for leap year
        if(yyyy%4==0){
            dd = 29;
            mm = 2;
        }else{
            dd = 28;
            mm = 2;
        }
    }
}

else if(dd<14){
    console.log("Today is here");
    var i=1;
    while(dd!=1){
        dd--;
        i++;
    }

    i = 14 - i;

    if(mm==5||mm==7||mm==10||mm==12){
        dd = 30 - i;
        mm = mm-1;
    }
    if(mm==4||mm==6||mm==9){
        dd = 31 - i;
        mm = mm-1;
    }
    if(mm==8){
        dd = 31 - i;
        mm = mm-1;
    }
    if(mm==1){
        dd= 31 - i;
        mm = 12;
        yyyy = yyyy-1;
    }
    if(mm==3){
        if(yyyy%4==0){
            dd = 29 - i;
            mm = 2;
        }else{
            dd = 28 - i;
            mm = 2;
        }
    }
}

else {
    console.log("Today is future");

    dd = dd - 14;
}
dateString = dd+"-"+mm+"-"+yyyy;

//to call second
function ajax2(curr, arr)
{
    company=arr[curr];
    R1= new XMLHttpRequest();
    var url1="https://www.quandl.com/api/v3/datasets/NSE/"+company+".json?api_key=ohudC4aZ_QkhbmV22Prx&start_date="+dateString;
    R1.open("GET", url1, true);
    R1.onreadystatechange = function () {
        //Create the onreadystate function
        
        if (R1.readyState == 4 && R1.status == 200) {
            //This part runs when the request is finished successfully
            var ourData1= JSON.parse(this.responseText);
            var AvgClose=table(arr.length, curr, ourData1);

            console.log("Got page no."+curr);
            ++curr; //Go to the next URL
            
            if (curr < arr.length) //If there is a next company
                ajax2(curr,arr); //Then request it
        }
    
    }

    R1.send(); //Now send the request

}

/** 
 * This function returns
 * @param {Number} current
 * @param {String[]} arr
 * @param {HTMLElement} niftyContainer
 * @param {HTMLElement[]} btnarray
 * @returns {Number[]} avgarr
*/

function AJAXget(current, arr, niftyContainer) {
    
    R = new XMLHttpRequest(); //Create the object

    var company= arr[current];

    var url="https://www.quandl.com/api/v3/datasets/NSE/"+company+".json?api_key=ohudC4aZ_QkhbmV22Prx&transform=diff&start_date="+dateString;
    
    R.open("GET", url, true);
    if(current==0)
    {
        container= niftyContainer;
    }    

    R.onreadystatechange = function () {
        //Create the onreadystate function
        
        if (R.readyState == 4 && R.status == 200) {
            //This part runs when the request is finished successfully
            var ourData= JSON.parse(this.responseText);
            var AvgClose=renderHTML(arr.length, current, ourData);
             avgarr.push(AvgClose);

            ++current; //Go to the next URL
            
            if (current < arr.length) //If there is a next company
                AJAXget(current,arr, container); //Then request it
            else
                ajax2(0, arr);
                return avgarr;
        }
    
    }
    var recomend1=[];
   recomend1.push(getRecommendation1());
    R.send(); //Now send the request   
}

function renderHTML(len, current,  nifty){
    if(current==0)
    {
        container.innerHTML="<br><br><h4><center>Your recommendations are on the way...</center></h4>";
        sortIt=[];
    }
    var htmlString="";
       var close=0;
       var days= nifty.dataset.data.length;

       for(i=0; i<days; i++)
       {
           for(j=0; j<nifty.dataset.data[i].length; j++)
           {
               if(j==5)
               {
                   close+= Number(nifty.dataset.data[i][j]);
               }
           }
       }

       
       var AvgClose=close/days;
       //Sorting
       sortIt.push([nifty.dataset.name,close])
       console.log(sortIt[current]);
         
       if((len-1)==current)
       {
       
       sortIt.sort(function(a, b) {
           a = a[1];
           b = b[1];
       
           return a < b ? -1 : (a > b ? 1 : 0);
       });
   
    }

     
    console.log("DATE: "+dateString);

    return AvgClose;
}

function table(len, curr, ourData1)
{
    if(curr==0)
    {
        records=[];
        key=[];
    }

    var days= ourData1.dataset.data.length-1;
    var datalength = ourData1.dataset.data[days].length;

    for(j=0; j<datalength; j++)
    {
        if(j==5)
        {
            close.push([ourData1.dataset.name, Number(ourData1.dataset.data[days][j])]);
        }
        if(j==2)
        {
            high.push([ourData1.dataset.name, Number(ourData1.dataset.data[days][j])]);
        }
        if(j==3)
        {
            low.push([ourData1.dataset.name, Number(ourData1.dataset.data[days][j])]);
        }
        if(j==6)
        {
            tradeQ.push([ourData1.dataset.name, Number(ourData1.dataset.data[days][j])]);
        }
        if(j==7)
        {
            turnover.push([ourData1.dataset.name, Number(ourData1.dataset.data[days][j])]);
        }
            
    }      

    if(curr==(len-1))
    {
        sortIt.reverse();
        var i=0;
        while(i<5 && i<sortIt.length)
        {
            key[i] = sortIt[i][0];
            growth[i] = Math.round(sortIt[i][1] * 100) / 100;
            i++;           
        }  

        for(i in key)
        {
            var record=[key[i], growth[i], match(key[i],close), match(key[i],high),match(key[i],low),match(key[i],tradeQ),match(key[i],turnover)]
            records.push(record); 
            console.log(records[i][0]);  
        }
    }
    
    var table = document.createElement('table');
        
        //Table attributes
        table.setAttribute("cellpadding", "12");
        table.setAttribute("margin", "10");
        table.setAttribute("align","center")
        //heading row
        var thr= document.createElement('tr');

       var th=[];
        for(var j=0; j<7; j++)
        {
            th[j]=document.createElement('th');
            th[j].style.height="40";
        }
        th[0].appendChild(document.createTextNode('Company'));
        th[1].appendChild(document.createTextNode('Growth'));
        th[2].appendChild(document.createTextNode('Close'));
        th[3].appendChild(document.createTextNode('High'));
        th[4].appendChild(document.createTextNode('Low'));
        th[5].appendChild(document.createTextNode('Total Trade Quantity'));
        th[6].appendChild(document.createTextNode('Turnover (Lacs)')); 
            
        thr.style.fontSize="large";
        thr.style.color="white";
        thr.style.backgroundColor="#009900"
        for(var j=0; j<7; j++)
        {
            thr.appendChild(th[j]);
        }
        table.appendChild(thr);
        table.border="solid 3px black";
      

        for (var i = 0; i < records.length; i++){
            var tr = document.createElement('tr');   
            var td=[];
            for(var j=0; j<7; j++)
            {
                td[j] = document.createElement('td');
                
                td[j].style.color="#000066";
            }
            td[0].appendChild(document.createTextNode(records[i][0]));
            if(records[i][1]<0)
                td[1].style.color="red";
            else
                td[1].style.color="darkgreen";
            td[1].appendChild(document.createTextNode(records[i][1]));
            td[2].appendChild(document.createTextNode(records[i][2]));
            td[3].appendChild(document.createTextNode(records[i][3]));
            td[4].appendChild(document.createTextNode(records[i][4]));
            td[5].appendChild(document.createTextNode(records[i][5]));
            td[6].appendChild(document.createTextNode(records[i][6])); 
           
                     
            for(var j=0; j<7; j++)
            {
                tr.appendChild(td[j]);
            }
            tr.style.height="25";
            tr.setAttribute("size","15")
            tr.style.fontSize="medium";
            table.appendChild(tr);
        }
        if(container!=null)
        {
            container.innerHTML="<br><br>";
            container.appendChild(table);
        }

    else
      console.log("its null");


}
/** 
 * This function returns
 * @returns {any} records
*/
function getRecommendation1()
{
    return records[0];
}
/** 
 * This function returns
 * @returns {any} records
*/
function getRecommendation2()
{
    return records[1];
}
/** 
 * This function returns
 * @returns {any} records
*/
function getRecommendation3()
{
    return records[2];
}
/** 
 * This function returns
 * @returns {any} records
*/
function getRecommendation4()
{
    return records[3];
}
/** 
 * This function returns
 * @returns {any} records
*/
function getRecommendation5()
{
    return records[4];
}
function match(value,arr)
{
    for(i=0; i<arr.length; i++)
    {
        if(arr[i][0]==value)
        {
            //console.log("matched value= "+arr[i][1]);
            return arr[i][1];
        }
    }
}


exports.AJAXget= AJAXget;


