const query = require('../pg-connect');
const emptyImg = require('../const/empty-img');
const emptyJsun = require('../const/empty-json');
const drawingTitle = require('../const/drawing-title');

/* ****************************Add Event PostGrase**************************** */
exports.addEvent = (req, res, next) => {
    // console.log("xxxxxxxxxxx xxxxxxx id 1 " + req.userData.id);
    console.log("xxxxxxxxxxx xxxxxxx id 1 " + req.body.usrid);

    if (req.userData.id == req.body.usrid) {
        const sql = 'INSERT INTO events (usrid, name, age_year, description, created, age_months, before_birth) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
        const reqData = _setReqData(req.body);
        query(sql, reqData)
            .then(data => {
                console.log('xxx xxx data ', data);

                res.status(201).json({
                    message: "Event add successfully",
                    success: true,
                    body: req.body
                });

                /**
                 * Adding drawing pages with the add of event for the drawing canvas
                */
                if (data.rows[0].id) {
                    drawingTitle.title.forEach((value) => {
                        let sql = 'INSERT INTO drawing (eventid, title, data, json) VALUES ($1, $2, $3, $4) RETURNING id';
                        query(sql, [
                            data.rows[0].id,
                            value,
                            emptyImg.img,
                            emptyJsun.jsun
                        ]).then(resp => {
                            // console.log('xxxxxxx xxxxxxxxx xxxxxxxx data ', resp);
                        }).catch(err => {
                            console.log('xxxxxxx xxxxxxxxx xxxxxxxx data ', err);
                        });
                    });
                }


            }).catch(err => {
                console.log("xxxxxxxxxxxxxx xxxxxxxxxxx error is " + err);
            });

    } else {
        res.status(401).json({
            message: "Unauthorised",
            success: false,
            // body: req.body
        });
    }

}

/* ****************************Get Event By Id**************************** */
exports.getEventById = (req, res, next) => {
    if (req.userData.id == req.params.id) {
        const sql = "SELECT * FROM events WHERE usrid = " + "'" + req.userData.id + "'";
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

/* ****************************Delete Event By Id**************************** */
exports.deleteEventById = (req, res, next) => {
    if (req.userData.id) {
        const sql = "DELETE FROM events WHERE id = " + "'" + req.params.id + "'";
        query(sql)
            .then(data => {

                if (data) {
                    let sql = "DELETE FROM drawing WHERE eventid = " + "'" + req.params.id + "'";
                    query(sql)
                        .then(resp => {
                            res.status(201).json({
                                message: "Deleted Successfully",
                                success: true,
                                body: {}
                            });
                        }).catch(error => {
                            res.status(201).json({
                                message: error,
                                success: false,
                                body: {}
                            });
                        });
                }


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

/* ****************************Edit Event**************************** */
exports.editEvent = (req, res, next) => {
    if (req.userData.id) {
        const sql = "UPDATE events SET name = " + "'" + req.body.name + "'," + " age_year = " + "'" + req.body.year + "'," + " description = " + "'" +  req.body.description + "'," + "age_months = " + "'" + req.body.months +  "'," +  "before_birth = " + "'" +  req.body.before + "'" + " WHERE id = " + "'" + req.params.id + "'";
        
        query(sql)
            .then(data => {
                res.status(201).json({
                    message: "Updated Successfully",
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

/* ****************************Private functions**************************** */
function _setReqData(body) {
    const eventData = [
        body.usrid,
        body.name,
        body.year,
        body.description,
        new Date(),
        body.months,
        body.before
    ];
    return eventData;
}

