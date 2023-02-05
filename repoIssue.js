const url="https://github.com/google/material-design-lite/issues";
const request=require('request');
const cheerio=require('cheerio');
const path=require('path');
const fs=require('fs');
const pdfkit=require('pdfkit');

function processIssues(url,repoPath){

    request(url,cb);
    
    function cb(err,response,html){
        if(err)
        console.log(err);
        else
        extractHtml(html);
    }
    
    function extractHtml(html){
        let $=cheerio.load(html);
        let issueList=$(".markdown-title");
        let arr=[];
        for(let i=0;i<issueList.length;i++){
            let issueLink=$(issueList[i]).attr('href');
            let fullLink="https://github.com"+issueLink;

            arr.push(fullLink);
        }
        // console.log(arr);
        repoPath=repoPath+".pdf";
        let text=JSON.stringify(arr);
        let pdfDoc=new pdfkit();
        pdfDoc.pipe(fs.createWriteStream(repoPath));
        pdfDoc.text(text);
        pdfDoc.end();
        // console.log(arr);
        // fs.writeFileSync(repoPath,JSON.stringify(arr));
    
    }
}
// console.log('before');
// console.log('after');



module.exports={
    getIssues:processIssues
}