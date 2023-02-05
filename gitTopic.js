const url="https://github.com/topics";
const request=require('request');
const cheerio=require('cheerio');
const fs=require('fs');
const path=require('path');
const repoIssue = require('./repoIssue');


let gitDir=path.join(__dirname,"GitRepos");
console.log('before');
request(url,cb);
console.log('after');
makeDir(gitDir);

function cb(err,response,html){
    if(err)
    console.error(err);
    else
    extractHtml(html);
}

function extractHtml(html){
    let $=cheerio.load(html);
    let topics=$('.container-lg.p-responsive.mt-6 li a');
    let topicName=$('.mb-sm-0 h1');
    for(let i=0;i<topics.length;i++){
        let link2Topic="https://github.com"+$(topics[i]).attr('href');
        let topicPath=path.join(gitDir,$(topics[i]).text().trim().split(" ")[0].trim())
        // console.log(link2Topic);
        goToTopic(link2Topic,topicPath);
        makeDir(topicPath);
    }

}

function goToTopic(url,topicPath){
    request(url,function (err,response,html){
        if(err)
        console.log(err);
        else
        get8repos(html,topicPath);
    })
}

function get8repos(html,topicPath){
    let $=cheerio.load(html);
    // console.log("`````````````````````````````")
    let repos=$(".text-bold.wb-break-word");
    // let repoList=$(".tabnav-tabs li")
    for(let i=0;i<8;i++){
        let repoLink="https://github.com"+$(repos[i]).attr('href');
        let repoName=repoLink.split('/').pop();
        let issueLink=repoLink+"/issues";
        let repoPath=path.join(topicPath,repoName);
        // console.log(repoLink);
        // console.log(repoPath);
        repoIssue.getIssues(issueLink,repoPath);
    }

}

function makeDir(filePath){
    if(fs.existsSync(filePath)==false)
    fs.mkdirSync(filePath);

}