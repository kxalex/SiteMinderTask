#!/bin/bash

#queueUrl=$(aws sqs list-queues --queue-name-prefix MyQueue | jq '.QueueUrls[0]')
endpointUrl=https://sqs.us-east-1.amazonaws.com

function delete() {
    printf "Deleting queue $queueUrl"
    aws sqs delete-queue --queue-url $queueUrl
}

read -e -p "Enter queue name: " queueName

echo "Creating dead-letter queue ${queueName}DeadLetter"
aws sqs create-queue --queue-name ${queueName}DeadLetter
queueUrl=$(aws sqs get-queue-url --queue-name ${queueName}DeadLetter --output text --endpoint-url $endpointUrl)
queueArn=$(aws sqs get-queue-attributes --queue-url $queueUrl --attribute-names QueueArn | jq '.Attributes.QueueArn')

# RedrivePolicy deadLetterTargetArn maxReceiveCount
###vvv = "'{\"RedrivePolicy\": "{\\"deadLetterTargetArn\\":\\"$queueArn\\",\\"maxReceiveCount\\":\\"5\\"}"}'"
echo "Creating queue ${queueName} with dead-letter queue"
echo aws sqs create-queue --queue-name ${queueName}