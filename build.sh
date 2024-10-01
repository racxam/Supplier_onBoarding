#!/bin/bash
 
echo -e "This script will delete the existing build and create a new one\n"
 
 
if [ -d "mta_archives" ]; then
    rm -rf mta_archives
    echo -e "Deleted mta_archives\n"s
fi
 
 
mbt build
echo -e "Created new mta_archive\n"
 
 
new_file=$(ls mta_archives | head -n 1)
echo -e "Now Deploying ..........."
 
 
if [ -n "$new_file" ]; then
    cf deploy "mta_archives/$new_file"
    echo -e "Deployed mta_archives/$new_file\n..........................!!!!"
else
    echo -e "No files found in mta_archives to deploy.\n"
fi
 
 