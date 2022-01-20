#!/bin/sh
source /data/config/.env
project=`pwd`
project=$(basename $project)
echo $project
versiondir=/sftp_moveit/${env}_fileshare/version/$env
filename=/sftp_moveit/${env}_fileshare/version/$env/${project}ver
echo $versiondir
echo $filename

gitCommit=`git rev-parse HEAD`
#echo $gitCommit
gitVersion=`git rev-list HEAD --count`
#echo $gitVersion
lastCommitMessage=`git log -1 --format="%s" `
#echo $lastCommitMessage
gitCommit="${gitCommit:0:10}"
author=`git log -1 --pretty=format:'%an'`
projectver="$project ver $gitVersion : $gitCommit : $author : $lastCommitMessage "
echo $projectver

feappver=$projectver
a="const feappver = "
b="export default feappver"
feappver=$(echo $feappver | sed "s/'//g")
echo "$a'$feappver\n' + " > feappver

beappver=`cat  $versiondir/beappver`
beappver=$(echo $beappver | sed "s/'//g")
echo "'$beappver\n'  + " >> feappver

bccjobsver=`cat  $versiondir/bccjobsver`
bccjobsver=$(echo $bccjobsver | sed "s/'//g")
echo "'$bccjobsver\n'  + " >> feappver

salesver=`cat  $versiondir/salesprocessver`
salesver=$(echo $salesver | sed "s/'//g")
echo "'$salesver'" >> feappver
echo $b >> feappver

mv feappver src/utils/version.js
cat  src/utils/version.js

