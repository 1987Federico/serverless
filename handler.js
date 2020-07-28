'use strict';
const uuidv1 = require('uuid');
const AWS = require('aws-sdk');
const parser = require("body-parser-for-serverless");

const orderMetadataManager = require('./orderMetadataManager');

var sqs = new AWS.SQS({ region: process.env.REGION });
const QUEUE_URL = process.env.PENDING_ORDER_QUEUE;

module.exports.pedido = (event, context, callback) => {
	const body = JSON.parse(event.body);
  	const order = {
		orderId: uuidv1.v1(),
		name: body.name,
		address: body.address,
		pizzas: body.pizzas,
		timestamp: Date.now()
  	};
  
	const params = {
			MessageBody: JSON.stringify({ order }),
			QueueUrl: QUEUE_URL
	};

	sqs.sendMessage(params, function(err, data) {
		if (err) {
			sendResponse(500, err, callback);
		} else {
			const message = {
				order: order,
				messageId: data.MessageId
			};
			sendResponse(200, message, callback);
		}
	});
};

module.exports.prepararPedido = (event, context, callback) => {
  const order = JSON.parse(event.Records[0].body);
  orderMetadataManager.saveCompletedOrder(order)
		.then(data => {
			callback();
		})
		.catch(error => {
			callback(error);
		});
};

module.exports.enviarPedido = (event,context,callback) => {
	const record = event.Records[0];
	if (record.eventName === 'INSERT') {
		const orderId = record.dynamodb.Keys.orderId.S;
		orderMetadataManager.deliverOrder(orderId)
			.then(data => {
				callback();
			})
			.catch(error => {
				callback(error);
			});
	} else {
		callback();
	}
};

module.exports.consultarPedido = (event,context,callback)=>{
	const {orderId} = event.pathParameters;
	orderMetadataManager
		.getOrder(orderId)
		.then(data => {
			return sendResponse(200,data,callback)
		})
		.catch(error => {
			callback(error);
		});
};

function sendResponse(statusCode, message, callback) {
	const response = {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	callback(null, response);
}