const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.saveCompletedOrder = order => {
	const delivery_status = 'READY_FOR_DELIVERY';
  const {orderId,name,address,pizzas,timestamp} = order.order;
    
  const params = {
		TableName: process.env.COMPLETED_ORDER_TABLE,
		Item: {
            orderId,
            name,
            address,
            pizzas,
            timestamp,
            delivery_status
        }
	};

	return dynamo.put(params).promise();
};

module.exports.deliverOrder = orderId => {
	const params = {
		TableName: process.env.COMPLETED_ORDER_TABLE,
		Key: {
			orderId
		},
		ConditionExpression: 'attribute_exists(orderId)',
		UpdateExpression: 'set delivery_status = :v',
		ExpressionAttributeValues: {
			':v': 'YOUR_ORDER_IS_BEING_PREPARED'
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamo
		.update(params)
		.promise()
		.then(response => {
			return response.Attributes;
		});
};

module.exports.getOrder = orderId => {
  const params = {
		TableName: process.env.COMPLETED_ORDER_TABLE,
		Key: {
      orderId:orderId
      }
  };
  return dynamo.get(params).promise();
}