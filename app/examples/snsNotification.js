const AWS = require('aws-sdk');

// AWS.config.update({
//   accessKeyId : process.env.ACCESS_KEY_ID_SNS,
//   secretAccessKey : process.env.SECRET_ACCESS_KEY_SNS
// });
AWS.config.region = process.env.REGION;

// Make sure this is initialized *after* AWS SDK is configured
const sns = new AWS.SNS();

// const getEndpointAttributes = async () => {
//   const params = {
//     PlatformApplicationArn: process.env.APPLICATION_ARN
//   };
//   return await sns.getPlatformApplicationAttributes(params).promise(); 
// }
const ListEndpointsByPlatformApplication = async () => {
  const params = {
    PlatformApplicationArn: process.env.APPLICATION_ARN
  };
  return await sns.listEndpointsByPlatformApplication(params).promise(); 
}

const sendSNS = async (push, endpointArn) => {
  push.GCM = JSON.stringify(push.GCM);
  const params = {
    Message: JSON.stringify(push),
    MessageStructure: 'json',
    TargetArn: endpointArn
  };
  return await sns.publish(params).promise();
}

module.exports = {
    createSNSEndpoint: async (deviceToken) => {
      try {
        const params = {
          PlatformApplicationArn: process.env.APPLICATION_ARN /* from step 1 */,
          Token: deviceToken
        };
        const endPointCreated = await sns.createPlatformEndpoint(params).promise();
        console.log("endPointCreated ::::::::: ", endPointCreated)
        return endPointCreated;
        
      } catch (error) {
        console.log("ERROR createSNSEndpoint :::: ", error)
        return {error: true, message: error.message};
      }
    },
    // subscribeDeviceToTopic: async (endpointArn) => {
    //   const params = {
    //     Protocol: 'application',
    //     TopicArn: process.env.TOPIC_ARN_SUBS_DEVICE /* from step 2 */,
    //     Endpoint: endpointArn
    //   };
    //   return await sns.subscribe(params, function(err, data) {
    //     if (err) {
    //         console.log(" ERROR ", err)
    //     } else {
    //         console.log("DATA NOTIFICACTION REGISTER ::: ", data)
    //         return data;
    //     };
    //   });
    // }
    publishDeviceToTopic: async (endpointArn, examId, userId) => {
      try {
        const listEndpoint = await ListEndpointsByPlatformApplication();
        console.log("listEndpoint ::::: ", listEndpoint)
        let push = {
          default: "Notification",
          GCM: {
            notification: {
              title: "Title",
	            text: "Sample message for Android endpoints.",
              type: "new_exam",
              tableId,
              secondtId: secondId
            }
          }
        };
        let badge = {
          GCM: {
            data: {
              text: "Sample message for Android endpoints",
              type: "new_exam"
            }
          }
        };
       const pushNotification = await sendSNS(push, endpointArn);
       const badgeNotification = await sendSNS(badge, endpointArn);
       return {
        pushNotification,
        badgeNotification
       }
      } catch (error) {
        console.log("ERROR publishDeviceToTopic :::::: ", error);
        return { error: true, message: error.message}
      }
    }
  }