module.exports = {
    upload: (app, opts) => {
        const multer  = require('multer')
        const upload = multer({ dest: opts.uploads });

        app.post('/upload', upload.array('files', 50), function (req, res, next) {
            console.log(req.files);
            // req.files is array of `photos` files
            // req.body will contain the text fields, if there were any
            
            const files = req.files.map((file) => {
                const result = {
                    thumbnailUrl: "https://jquery-file-upload.appspot.com/image%2Fpng/-5835233320985920217/beer.png.80x80.png",
                    name: file.originalname,
                    url:"https://jquery-file-upload.appspot.com/image%2Fpng/-5835233320985920217/beer.png",
                    deleteType: "DELETE",
                    type: file.mimetype,
                    deleteUrl: "https://jquery-file-upload.appspot.com/image%2Fpng/-5835233320985920217/beer.png",
                    size: getFilesizeInBytes(file.path)
                };

                deleteFile(file.path);

                return result;
            });
            
            res.json({files});
        });
    }
}

function getFilesizeInBytes(filename) {
    const fs = require('fs');
    const stats = fs.statSync(filename);
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}

function deleteFile(filename) {
    const fs = require('fs');
    fs.unlinkSync(filename)
}