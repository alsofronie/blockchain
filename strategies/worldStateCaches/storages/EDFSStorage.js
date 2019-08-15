function FolderStorage(){

}


module.exports.create = function(foldername){

    return new FolderStorage(foldername)
}