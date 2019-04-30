const query = require('../pg-connect');
const PDFDocument = require('pdfkit')


/* ****************************Add Update Canvas**************************** */
exports.addDrawing = (req, res, next) => {
    console.log('xxxxxxxxx xxxxxxxxxx xxxxxxxxx from server', req.body.eventId);

    if (req.body.id == 0) {
        const sql = 'INSERT INTO drawing (eventid, title, data, json) VALUES ($1, $2, $3, $4) RETURNING id';
        const reqData = _setReqData(req.body);
        query(sql, reqData)
            .then(data => {
                res.status(201).json({
                    message: "Event add successfully",
                    success: true,
                    body: data
                });
            }).catch(err => {
                console.log("xxxxxxxxxxxxxx xxxxxxxxxxx error is " + err);
            });
    } else {
        const sql = 'UPDATE drawing SET data = ' + "'" + req.body.data + "'" + ',json = ' + "'" + req.body.jsun + "'" + 'WHERE id = ' + "'" + req.body.id + "'";
        console.log('xxxxxxxxx xxxxxxx xxxxxxxxxxxxx sql ', sql);

        query(sql)
            .then(data => {
                res.status(201).json({
                    message: "Event Updated successfully",
                    success: true,
                    body: data
                });
            }).catch(err => {
                console.log("xxxxxxxxxxxxxx xxxxxxxxxxx error is " + err);
            });
    }
}

/* ****************************Get Drawing by id**************************** */
exports.getDrawingByEventId = (req, res, next) => {
    if (req.params.eventId) {
        const sql = "SELECT convert_from(data::bytea, 'UTF8') as image, convert_from(json::bytea, 'UTF8')as jsun, * FROM drawing WHERE eventid = " + "'" + req.params.eventId + "'";
        query(sql)
            .then(data => {
                res.status(201).json({
                    message: "Events",
                    success: true,
                    body: data.rows
                });
            }).catch(err => {
                console.log("xxxxx xxxxxxxxxxxxxxxxx " + err);
            });

    } else {
        res.status(401).json({
            message: "Unauthorised",
            success: false,
        });
    }
}

function _setReqData(body) {
    const dreawing = [
        body.eventId,
        'transition',
        body.data,
        body.jsun
    ];
    return dreawing;
}

/* ****************************Remove Drawing**************************** */
exports.deleteDrawingtById = (req, res, next) => {
    if (req.params.id) {
        const sql = "DELETE FROM drawing WHERE id = " + "'" + req.params.id + "'";
        query(sql)
            .then(data => {
                res.status(201).json({
                    message: "Deleted Successfully",
                    success: true,
                    body: {}
                });
            }).catch(err => {
                console.log("xxxxx xxxxxxxxxxxxxxxxx " + err);
            });

    } else {
        res.status(401).json({
            message: "Unauthorised",
            success: false,
        });
    }
}

/* ****************************Get Drawing Pdf**************************** */
exports.getDrawingPdf = (req, res, next) => {
    if (req.params.eventId) {
        const sql = "SELECT convert_from(data::bytea, 'UTF8') as image FROM drawing WHERE eventid = " + "'" + req.params.eventId + "'";
        query(sql)
            .then(data => {
                _getPdf(data.rows, res);
            }).catch(err => {
                console.log("xxxxx xxxxxxxxxxxxxxxxx " + err);
            });

    } else {
        res.status(401).json({
            message: "Unauthorised",
            success: false,
        });
    }
}

/* ****************************Change Drawing Title**************************** */
exports.changeDrawingTitle = (req, res, next) => {
    const sql = "UPDATE drawing SET title = " + "'" + req.body.title + "'" + "WHERE id = " + "'" + req.body.drawingId + "'";
    query(sql)
        .then(data => {
            res.status(200).json({
                success: true,
                message: "Title updated Successfully",
                body: {}
            });
        }).catch(err => {
            res.status(200).json({
                success: false,
                message: 'Backend error' + err,
                body: {}
            });

        });
}


/* ****************************Other functions**************************** */
function _getPdf(img, res) {
    return new Promise((resolve, reject) => {
        doc = new PDFDocument

        img.forEach((value, index) => {
            let base64 = value.image.replace('{"data:image/png;base64,', "").replace('"}', "").replace(/^data:image\/(png|jpg);base64,/, '');

            let buffer = Buffer.from(base64, 'base64');

            if (index == 0) {
                doc.image(buffer, {
                    fit: [500, 400],
                    align: 'center',
                    valign: 'center'
                });

            } else {
                doc.addPage()
                    .image(buffer, {
                        fit: [500, 400],
                        align: 'center',
                        valign: 'center'
                    });
            }
        });
        /**
         * if need to generate pdf
         * doc.pipe(fs.createWriteStream(__dirname + '/out.pdf'));
         * doc.pipe is used to send pdf 
         */
        doc.pipe(res);
        doc.end();
    });
}