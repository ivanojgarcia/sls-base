
'use strict';

const AWS = require('aws-sdk');
const moment = require('moment-timezone');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

const getTableEgById = async (tableId) => {
    const params = {
        TableName: process.env.NAME_TABLE,
        KeyConditionExpression: 'tableId = :tableId',
        ExpressionAttributeValues: { ':tableId': tableId}
    };
    return await dynamoDB.query(params).promise();
}
const updateRegisterHistory = async (tableId) => {
    let params = {
        TableName: process.env.EXAM_HISTORY_TABLE,
        Key: {
            tableId
        },
        UpdateExpression: "set createdAt = :createdAt",
        ExpressionAttributeValues:{
            ":createdAt": moment().tz('America/Santiago').unix()
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    const update = await dynamoDB.update(params).promise();
    return update;
}
module.exports = {
    createMassiveTableEg: async (body) => {
        try {
            const table = JSON.parse(body);
            const result = await Promise.all(
                table.map(async data => {
                    let {table} = data;
                    let createdAt = moment().tz('America/Santiago').format();
                    table.tableId = table.tableId.toString();
                    // table.createdAt = createdAt;
                    let params = {
                        TableName: process.env.NAME_TABLE,
                        Item: table
                    };
                    await dynamoDB.put(params).promise()
                    return table;
                })
            )
            return result;
        } catch (error) {
            console.error("ERROR NAME_TABLE :::: ", error,)
            return {
                error: true,
                message: error.message
            };
        }        
    },
    createTableEg: async (body) => {
        try {
            const { table } = JSON.parse(body);
            let currentDate = moment().tz('America/Santiago').format()
            const createdAt = (table.createdAt) ? moment(table.createdAt).tz('America/Santiago').format() : currentDate;
            // table.tableId = (table.tableId) ? table.tableId : uuidv4();
            table.createdAt = createdAt;
            const params = {
                TableName: process.env.NAME_TABLE,
                Item: table
            };

            await dynamoDB.put(params).promise()
            return table;
        } catch (error) {
            console.error("ERROR NAME_TABLE :::: ", error,)
            return {
                error: true,
                message: error.message
            };
        }        
    },
    updateTableEg: async (body) => {
        try {
            const { table } = JSON.parse(body);
            
            let params = {
                TableName: process.env.NAME_TABLE,
                Key: {
                    tableId: table.tableId
                },
                UpdateExpression: 'set description = :description, clinicalEvent = :clinicalEvent,createdAt = :createdAt,currentStatus = :currentStatus,episode = :episode,isCritical = :isCritical,isRead = :isRead,notify = :notify,pdfURL = :pdfURL,professional = :professional,requestNumber = :requestNumber,resourceId = :resourceId',
                ExpressionAttributeValues:{
                    ":description":table.description,
                    ":clinicalEvent": table.clinicalEvent,
                    ":createdAt": table.createdAt,
                    ":currentStatus": table.currentStatus,
                    ":episode": table.episode,
                    ":isCritical": table.isCritical,
                    ":isRead": table.isRead,
                    ":notify": table.notify,
                    ":pdfURL": table.pdfURL,
                    ":professional": table.professional,
                    ":requestNumber": table.requestNumber,
                    ":resourceId": table.resourceId
                },
                ReturnValues:"UPDATED_NEW"
            };
            const update = await dynamoDB.update(params).promise();
            console.log("UPDATE ::: ", update)
            return table;
        } catch (error) {
            console.error("ERROR NAME_TABLE UPDATE :::: ", error,)
            return {
                error: true,
                message: error.message
            };
        }        
    },
    getTableEgByPatient: async (body) => {
        try {
            const { patientID, LastEvaluatedKey, beforeBlock, limit } = JSON.parse(body);
            let before= (beforeBlock) ? beforeBlock : null;
            const params = {
                TableName: process.env.NAME_TABLE,
                IndexName : "patientIndex",
                KeyConditionExpression: 'patientId = :pat_id',
                ExpressionAttributeValues: { ':pat_id': patientID},
                Limit: (!limit) ? 10 : limit
            };
            if(LastEvaluatedKey){
                params.ExclusiveStartKey = {
                    patientId: patientID,
                    tableId: LastEvaluatedKey
                }
            }
            const table = await dynamoDB.query(params).promise();
            return table;
        } catch (error) {
            console.error("ERROR NAME_TABLE :::: ", error,)
            return {
                error: true,
                message: error.message
            };
        }
    }
}