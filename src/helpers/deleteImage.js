const fs = require('fs').promises;

const deleteImage =async(userimagePath)=>{
    try {
       await fs.access(userimagePath);
       await fs.access(userimagePath);
       console.log('image was deleted');
    } catch (error) {
        console.error('user image does not exist');
    }
}

module.exports={deleteImage};