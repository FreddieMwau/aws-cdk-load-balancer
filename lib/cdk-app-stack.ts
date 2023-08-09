import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { readFileSync } from 'fs';

export class CdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create VPC in which we'll launch the Instance
    const vpc = new ec2.Vpc(
      this,
      'cdk-vpc',
      {
        cidr: '10.0.0.0/16',
        natGateways: 0,
        subnetConfiguration: [
          {
            name: 'public',
            cidrMask: 24,
            subnetType: ec2.SubnetType.PUBLIC
          },
        ],
      }
    );


    // create Security Group for the instance
    const webserverSG = new ec2.SecurityGroup(
      this,
      'webserver-sg',
      {
        vpc,
        allowAllOutbound: true,
      }
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow SSH access from anywhere',
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP traffic from anywhere'
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'allow HTTPS traffic from anywhere'
    );

    // Create a Role for the EC2 Instance
    const webserverRole = new iam.Role(
      this,
      'webserver-role',
      {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
        ],
      }
    );


    // Create EC2 Instance
    const ec2Instance = new ec2.Instance(
      this,
      'ec2-instance',
      {
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        keyName: 'ec2-key-pair',
        role: webserverRole,
        securityGroup: webserverSG,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.BURSTABLE2,
          ec2.InstanceSize.MICRO,
        ),
        machineImage: new ec2.AmazonLinuxImage({
          generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        }),
      }
    );    

    const s3Bucket = new s3.Bucket(this, 's3-bucket', {
      bucketName: 'freddies-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      publicReadAccess: false,
      encryption: s3.BucketEncryption.S3_MANAGED,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
          ],
          allowedOrigins: ['http://localhost:3000'],
          allowedHeaders: ['*'],
        },
      ],
      lifecycleRules: [
        {
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(10),
          expiration: cdk.Duration.days(365),
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(30),
            },
          ],
        },
      ],
    });

    s3Bucket.grantRead(new iam.AccountRootPrincipal());
    const userDataScript = readFileSync('./lib/user-data.sh', 'utf8');
    ec2Instance.addUserData(userDataScript);
  }
}
