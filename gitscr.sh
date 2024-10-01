echo -e "--------- GIT PUSH SCRIPT-----------"
git add .
echo -e "Enter the comment........?"
read;
git commit -m "${REPLY}"
echo -e "Commited the change in the local git...........!"
git push origin sumit
echo -e "Sucessfully !! pushed the changes to git"