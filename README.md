
# SiteMinder Mailer Task

The simplified failover mailer that uses SendGrid as master mailing service and in case of
failure switches to MailGun. As a failure the mail service threats all http codes except 2xx-s.
That allows to cover all cases when SendGrid can't process our request.

The mailer is separated to two roles: consumer and processor. The consumer posts received mail requests 
to SQS queue, when the processor polls a queue and send messages using either of mail services.

That allows the mailer to work in asynchornous way without blocking clients and gives a way to 
scale the mailer according to load needs. 
 
The mailer can work in 3 modes accordingly:
- consumer, processor
- consumer
- processor

---

## Prerequisites

- NodeJS 10+ ([Installation instruction](https://nodejs.org/en/download/package-manager/))
- (Optional) yarn ([Installation instruction](https://yarnpkg.com/lang/en/docs/install/))
- AWS account registered

## Building

The project can be build with npm

```shell script
npm install
```

or with yarn
```shell script
yarn install
```

You can also build docker image and deploy it
```shell script
yarn build
```
or
```shell script
npm run build
```

## Running

### Local Configuration
Before running 3 steps should be completed:

- create `config/local.json` (see sample below)
    - `local.json` added to `.gitignore`, so it never should appear in git
- AWS SQS queue created (including dead-letter queue)
    - Login to AWS Console
    - Go to SQS and create queue with name `SiteMinderMailMessagesDeadLetter`
    - Go to SQS and create queue with name `SiteMinderMailMessages`
    - Add permissions to your account for SendMessage, ReceiveMessage and DeleteMessage
        - For testing purposes simply choose "Everybody" and "All SQS Actions"
    - Under 'Dead Letter Queue Settings'
        - Enable 'Use Redrive Policy'
        - Set 'Dead Letter Queue' to 'SiteMinderMailMessagesDeadLetter'
        - Set 'Maximum Receives' to 3
    - Add AccountID and QueueName to `local.json`
        - Tip: AccountID can be found on details tab (see Queue URL)
    -  
- Create AWS credentials
    - Open IAM
    - Find your user or create new one
    - Open 'Security credentials' tab and create access key under 'Access key' section
        - Save access key id and secret access key to save place
    - Create in your home folder directory .aws and file credentials
        - Save AWS credentials to ~/.aws/credentials file (see sample below) 
 

### local.json

```json
{
  "sendGridConfig": {
    "apiKey": "YOUR_SENDGRID_KEY"
  },
  "mailGunConfig": {
    "baseUrl": "https://api.mailgun.net/v3/YOUR_DOMAIN",
    "apiKey": "YOUR_MAILGUN_KEY"
  },
  "sqs": {
    "accountId": "AWS_ACCOUNT_ID",
    "queueName": "AWS_QUEUE_NAME"
  }
}
```

### ~/.aws/credentials

```properties
[default]
aws_access_key_id = YOUR_AWS_ACCESS_KEY
aws_secret_access_key = YOUR_AWS_SECRET_ACCESS_KEY
region = us-east-1
output = json
```

Finally you are ready to start the service locally

``` 
npm start
```

or

```
yarn start
```

By default the server is running on port 3000

## Running with Docker
 
You can build docker image and run dockerized version of the mailer
```
yarn build
docker run -p 3000:3000 siteminder-mailer
```

### Running 

The server can be run as a consumer or processor, or both. By default consumer + processor are started.

### Running in consumer or processor mode
If you want to run the service in consumer mode you can pass it through
 SERVER_MODE environment variables. 
```shell script
SERVER_MODE=consumer node index.js
SERVER_MODE=processor node index.js
```

### Deploying

The mailer should be deployed using Docker.

The source code deployment is only suitable for testing and development.

### Deployment to AWS in 5 minutes

Quick Guide to deploy the app in AWS for **load testing**

- Add Launch Configuration under EC2 -> Auto Scaling
    - Choose Amazon Linux t2.micro instance
    - SSD (optional)
    - Provide Configuration Name (for ex: SMLaunchConf)
    - Put init script from `scripts/aws-startup.sh` into User Data field
        - Do not forget to replace keys
    - Add Storage (skip)
    - Create or Select Existing Security Group in port 80 open
    - Review & Done
- Create Target Group under Load Balancing
    - Name SMTargetGroup
    - Target type: Instance
    - Protocol: HTTP
    - Port: 80
    - VPC: (by default you should have default on)
    - Health Check
        - Protocol: HTTP
        - Path: `/api/heartbeat`
- Create AutoScaling Group
    - Use already created configuration as Launch Configuration
    - Desired Capacity 2 (or any number)
    - Availability zones (any two) but remember them
    - Two or more subnets
    - TargetGroup: SMTargetGroup
- Create Load Balancer
    - Create Application Load Balancer
    - Name: SMLoadBalancer
    - Availability zones: shoud match autoscaling group
    - Security Group: make sure group has port 80 open
    - Configure Routing Tab
        - Target Group: Existing and choose the one we created
        - Health Check:
            - Path: `/api/heartbeat`
    - Register Targets
        - There are should be two targets created by autoscaling group.
        Targets should be registered automatically. No actions needed.
    - Done

Go to your Load Balancer details, grab URL and test it

## API 

### Swagger documentation

The server has swagger documentation embedded, so you can access it
under URL [http://loadbalancer-890517823.us-east-1.elb.amazonaws.com/doc](http://loadbalancer-890517823.us-east-1.elb.amazonaws.com/doc) 

### Send mail

Once you have the server running execute the following code in your command line:

```shell script

curl --request POST \
  --url http://localhost:3000/api/mail/send \
  --header 'Content-Type: application/json' \
  --data '{"to":[{"email": "kxalex@gmail.com", "name": "Oleksii"}, {"email": "kxalex+test@gmail.com"}], "subject": "Subject Test", "content": "Body Test"}'

```

#### Sample Response

TODO: add more samples and describe return codes

```json
{
    "statusCode": 200,
    "message": "Message is queued for processing.",
    "messageId": "9ecf5d4c-2827-4cd7-af3e-383de788efab"
} 
```

#### Sample Message
Below you can field sample message object with all fields.

```json
{
	"to": [ {
			"email": "someemail@gmail.com",
            "name": "SomeName"
		}, {
			"email": "someemail+test@gmail.com"
		}
	],
	"cc": [ { 
			"email": "someemail@gmail.com",
            "name": "SomeName"
		}
	],
	"bcc": [ {
			"email": "someemail@gmail.com",
            "name": "SomeName"
		}
	],
	"subject": "Subject Test",
	"content": "Body Test"
}
```
---

#### Error handling

API requests are checked by fastify JSON schema validation and if request is bad an 
error message will be returned with http status code 400 (bad request)

```json
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "body.cc should NOT have fewer than 1 items"
}
```  

### Demo Environment

Demo environment deployed to `loadbalancer-890517823.us-east-1.elb.amazonaws.com`.
Documentation can be found here `http://loadbalancer-890517823.us-east-1.elb.amazonaws.com/doc`
API endpoint `http://loadbalancer-890517823.us-east-1.elb.amazonaws.com/api` 

### Development Tips

The mailer has common MailServer interface to support any mail services in the future.
If new mail service needs to be added, simply extend IMailService, implement send method,
register within FailoverMailService and new mail service is ready to go.

## TODO

The source code has lots of TODOs that should be addressed. More added below

- Add tests :-)
- Handle dead messages in dead-letter queue
- Handler http error code from mail services properly
- Add auditing db to store message ids
- Move custom mail services support to configs    
- Add tests using fastify inject
- Add service health check to mail services
- Add ability to stop using dead or malfunction mail service for specified timeout
- Add rate limiting feature
- Add handling rate limits from mail services
- Improve retry capability in case of network or connectivity issue (i.e. not mail service)
- Added SQS role to EC2 instances
- Create CloudFormation templates for deployment 
- _More to come..._
