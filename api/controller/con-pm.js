const query = require('../pg-connect');

exports.addPartsMap = async (req, res) => {
    try {
        const isPmExists = await checkIfPmExistes(req);
        let sql = 'INSERT INTO salesforce.parts_map__c (name, image__c, Subscriber__c) VALUES ($1, $2, $3)RETURNING id';
        let data = setPartsMapArr(req);
        if (isPmExists) {
            sql = `UPDATE salesforce.parts_map__c SET image__c = '${req.body.pmImage}' WHERE Subscriber__c = '${req.userData.sfid}'`;
            data = [];
        }
        try {
            const result = await query(sql, data);
            res.status(200).json({
                message: "Parts Map Added Successfully",
                success: true,
                body: result.rows
            });
        } catch (err) {
            res.status(401).json({
                message: "Backend Error",
                success: false,
                body: err
            });
        }
    } catch (err) {
        console.log(err)
        res.status(401).json({
            message: "Backend Error",
            success: false,
            body: err
        });
    }

}

exports.getUsrPm = async (req, res) => {
    const sql = `SELECT * FROM salesforce.parts_map__c WHERE Subscriber__c = '${req.userData.sfid}'`;
    try {
        const result = await query(sql);
        res.status(200).json({
            message: "Parts Map",
            success: true,
            body: result.rows
        });
    } catch (err) {
        res.status(401).json({
            message: "Backend Error",
            success: false,
            body: err
        });
    }
}

setPartsMapArr = (req) => {
    return [
        req.body.name,
        req.body.pmImage,
        req.userData.sfid
    ];
}

checkIfPmExistes = (req) => {
    return new Promise(async (resolve, reject) => {
        const sql = `SELECT * FROM salesforce.parts_map__c WHERE Subscriber__c = '${req.userData.sfid}'`;
        try {
            const result = await query(sql);
            if (result.rowCount == 0) {
                resolve(false);
            }
            resolve(true);
        } catch (err) {
            reject(err);
        }

    })
}