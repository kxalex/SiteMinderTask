# SiteMinder Mailer Architecture

## Architecture

### Software
The mailer is build as a microservice with simple REST API to send mail messages.
Docker has been chosen as a container solution.

As a software solution it has been decided to do not split development services in separate microservices
due to development overhead and therefore new mail services will not be added that frequently.
Instead keeping codebase in common simplifies support and development speed providing a way to 
run the microservice in different modes.

The server has two parts: consumer and processor.

The consumer is simple HTTP server that exposes REST API to accept mail messages for processing.
Once a message is received and validated it's posted to SQS queue for processing.
The processor polls the queue and picks messages for processing. 

Current solution allows to run the service in 3 modes:
- Consumer+Processor
- Consumer
- Processor

Such separation can be used to separate logically two server roles and accordingly it's allowed to
run the server in either of them, or both. After thoroughful testing we can determine 
how many consumers and producers are required to handle particular load. The scaling should be configured
based on determined values.

AWS SQS has been chosen as MQ service to store incoming messages. The microservice is responsible 
for handling REST API requests and processing messages from queue asynchronously.
Such solution allows to process incoming requests faster without blocking client,
in the meantime same or another instance of may play a role of message processor.

SQS dead-letter queue is used to store all malformed or bad requests is they were not processed either 
of services. Additional processor for such messages should be added. 

See [README.md](../README.md) for details.
 

### Deployment & Cloud

Current deployment is using EC2 t2.micro (free tier) instances with round-robin load balancer in front
(see README for more details on configuration).
It's deployed in 2 availability zones 1 instance per zone (for testing purposes). Auto-scaling group is configured to add new instances in case of high cpu load (>=75%) and decrease number of instance when load goes down.

The logging should be forwarded to CloudWatch, yet scaling might be configured based on number of
requests coming or queued messages to process.

Future release and better solution is to deploy as docker images to Amazon ECS and configure load-balancing between docker instances. Such approach is more resource friendly and does not require DevOps involvement and CloudFormation scripting. 

## Constraints

- No way to disable either of mail services at runtime only through stopping services
- Requests can't be load balanced between mail services. All requests will go to master and 
  in case of failure to slave
- Simplified failover procedure. Failover should rely on factors like rate limiting,
  response speed and so on 
- No tests has been done to understand load that can be handled for EC2 instances
- AWS SQS message size limited to 64k
    - No support added to use S3 for bigger messages
- AWS SQS at least once delivery rule. The mail message might be processed more then once


## Resiliency to data loss

Current implementation uses AWS SQS for queuing messages and postponed processing that relies 
on AWS SQS resiliency. The Mailer service picks a message and tries to process it, if the message
can't processed by any reason there are 3 retries will happen. In case master (SendGrid) mail service is still
failing processing message, the message passed to slave (MailGun) mail service with retry capabilities.

In case if either of services can't process message the message it moved to dead-letter queue 
after 3 failed receives. _No dead messages handling implemented yet._

If any of instances will crash during message processing,
the message will stay in the queue for next instance to pick up.

## Auditing

The project already has connected logger that supports logging to CloudWatch.
Therefore, to complete solution we need to store all logs in CloudWatch.

It is recommended to use ELK for auditing but the current size project it might be overkill to
use ELK. If your project already has ELK for auditing, better use ELK. 

## Next version architectural improvements

- Handling failed messages
- Add S3 support for bigger messages
- Perform load testing
- Improve retrying capability to make sure that a message is delived
- Detect either of services goes down and immediately switch to backup service (see branch [improved-mailer](https://github.com/kxalex/SiteMinderTask/tree/improved-mailer))

