module.exports = {
    upload: (app, opts, swiftClient) => {
        const multer  = require('multer')
        const upload = multer({ dest: opts.uploads });
        const { addFile } = require('./openstack');

        app.post('/upload', upload.array('files', 50), function (req, res, next) {
            Promise.all(
                req.files.map((file) => {
                    const fs = require('fs');
                    const sharp = require('sharp');
                    const thumb = `thumb_${file.originalname}`;
                    const thumbPath = `${file.path}_thumb`;
                    return sharp(file.path)
                        .resize(100, 100, { fit: 'inside', withoutEnlargement: true })
                        .toFile(thumbPath)
                        .then(() => {
                            return addFile(swiftClient, req.user, thumb, thumbPath, {type: 'thumb'}, opts).then((thumbData) => {
                                return addFile(swiftClient, req.user, file.originalname, file.path, {}, opts).then((fileData) => {
                                    const result = {
                                        thumbnailUrl: thumbData.url,
                                        name: file.originalname,
                                        url: fileData.url,
                                        deleteType: "DELETE",
                                        type: file.mimetype,
                                        deleteUrl: "",
                                        size: getFilesizeInBytes(file.path)
                                    };
                    
                                    deleteFile(file.path);
                                    deleteFile(thumbPath);
                    
                                    return result;
                                })
                            });
                    });
                })
            ).then((files) => {
                res.json({files});
            }).catch(() => {
                res.code(500).json({error: "an error occured"})
            });
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