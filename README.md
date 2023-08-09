# Project: Static Website Deployment with CDN and Load Balancer

Welcome to the "Static Website Deployment with CDN and Load Balancer" project! In this project, we'll use the AWS Cloud Development Kit (CDK) to deploy a static website, configure a CDN (Content Delivery Network) for performance optimization, and set up an Elastic Load Balancer for high availability.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Deployment Steps](#deployment-steps)
- [Accessing the Website](#accessing-the-website)
- [Resources](#resources)

## Overview

In this project, we'll leverage the power of AWS services to deploy a static website with enhanced performance, scalability, and availability. We'll utilize the following AWS services:

- **Amazon S3**: Store and serve static website files such as HTML, CSS, JavaScript, and images.
- **Amazon CloudFront**: Set up a global CDN to deliver content from edge locations for reduced latency and improved performance.
- **Elastic Load Balancer**: Distribute incoming traffic across multiple EC2 instances to ensure high availability and scalability.
- **Amazon EC2 Instances**: Host the static website content and serve it to users.
- **IAM (Identity and Access Management)**: Manage access control and permissions for AWS resources.

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- An AWS account: You'll need an active AWS account to create and manage resources.
- AWS CLI and CDK installed: Install the AWS CLI and CDK to interact with AWS services and deploy infrastructure using CDK.
- Basic knowledge of TypeScript: Familiarity with TypeScript programming will help you understand and modify the CDK code.

## Getting Started

1. Clone this repository to your local machine:

   ```sh
   git clone https://github.com/FreddieMwau/aws-cdk-load-balancer.git
   cd static-website-cdn-load-balancer

2. Configure your AWS CLI with your AWS credentials:

   ```sh
   aws configure

3. Install project dependencies:

   ```sh
   npm install
## Project Structure
The project's directory structure will look like this:

    static-website-cdn-load-balancer/
    ├── bin/
    ├── lib/
    ├── test/
    ├── cdk.json
    ├── package.json
    └── README.md

* `bin/`: Contains the entry point script for your CDK app.
* `lib/`: Holds the main CDK constructs and resources.
* `test/`: Contains test files for your CDK app.
* `cdk.json`: CDK configuration file.
* `package.json`: Project's package configuration.
* `README.md`: Project's READNE file (you're reading it now).

## Deployment Steps

Follow these steps to deploy your static website with a CDN and load balancer

1. Update the necessary configuration in the CDK app code (`lib/`).
2. Deploy the CDK stack to create AWS resources:

    ```sh
   cdk deploy --all
3. Wait for the deployment to complete. Take note of the output values for the website URL & load balancer


## Accessing the Website
Once the deployment is complete, you can access your static website using the provided URL. The website content will be delivered via CloudFront for improved performance. The load balancer ensures availability and scalability of your application.

## Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
- [Amazon S3 Documentation](https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html)
- [Amazon CloudFront Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- [Elastic Load Balancing Documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html)

### PS 
The CloudFront configuration step has been omitted due to the absence of a unique domain for the project.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Creating the Key Pair

To create an EC2 key pair named 'ec2-key-pair' and save the private key to a file named 'ec2-key-pair.pem', run the following command in your terminal:

```sh
aws ec2 create-key-pair --key-name ec2-key-pair --query 'KeyMaterial' --output text > ec2-key-pair.pem